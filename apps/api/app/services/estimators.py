"""Simple causal estimators with explicit assumptions and limitations."""

from __future__ import annotations

import numpy as np
import pandas as pd
from scipy import stats

from app.models.schemas import AssumptionItem, EstimateRequest, EstimateResponse
from app.services.demo_data import get_case, load_case_frame

DISCLAIMER = (
    "CausalForge does not promise automatic causality. Estimates depend on "
    "declared assumptions, data quality and study design. Use results as "
    "decision support with explicit limitations — not as proof."
)

SHARED_CAVEATS = [
    "Observational estimates are only as credible as their identifying assumptions.",
    "Synthetic demos illustrate method and communication — not real business impact.",
    "Do not scale an intervention from a single point estimate without design review.",
    "When the 95% CI includes zero, treat the result as inconclusive under current assumptions.",
]


def _diff_in_diff(
    df: pd.DataFrame,
    treated_value: str,
    outcome: str,
    unit_col: str,
    period_col: str,
) -> tuple[float, float, int, int]:
    if outcome not in df.columns:
        raise ValueError(f"Outcome column '{outcome}' not found in demo dataset")

    treated = df[df[unit_col].astype(str) == str(treated_value)]
    control = df[df[unit_col].astype(str) != str(treated_value)]
    if treated.empty or control.empty:
        raise ValueError("Treated or control group is empty for the selected unit")

    pre_t = treated.loc[treated[period_col] == "pre", outcome].mean()
    post_t = treated.loc[treated[period_col] == "post", outcome].mean()
    pre_c = control.loc[control[period_col] == "pre", outcome].mean()
    post_c = control.loc[control[period_col] == "post", outcome].mean()

    effect = (post_t - pre_t) - (post_c - pre_c)

    unit_effects = []
    for _, g in df.groupby(unit_col):
        pre = g.loc[g[period_col] == "pre", outcome].mean()
        post = g.loc[g[period_col] == "post", outcome].mean()
        unit_effects.append(post - pre)
    unit_effects = np.asarray(unit_effects, dtype=float)
    se = float(np.std(unit_effects, ddof=1) / np.sqrt(max(len(unit_effects), 1)))
    if se == 0 or np.isnan(se):
        se = abs(effect) * 0.15 + 1.0

    n_treated = int((df[unit_col].astype(str) == str(treated_value)).sum())
    n_control = int((df[unit_col].astype(str) != str(treated_value)).sum())
    return float(effect), se, n_treated, n_control


def _matching(
    df: pd.DataFrame,
    treated_value: str,
    outcome: str,
    unit_col: str,
    period_col: str,
    covars: list[str],
) -> tuple[float, float, int, int]:
    if outcome not in df.columns:
        raise ValueError(f"Outcome column '{outcome}' not found in demo dataset")
    for c in covars:
        if c not in df.columns:
            raise ValueError(f"Covariate '{c}' not found in demo dataset")

    post = df[df[period_col] == "post"].copy()
    treated = post[post[unit_col].astype(str) == str(treated_value)]
    control = post[post[unit_col].astype(str) != str(treated_value)]
    if treated.empty or control.empty:
        raise ValueError("Treated or control group is empty for matching")

    effects = []
    for _, row in treated.iterrows():
        dists = ((control[covars] - row[covars].values) ** 2).sum(axis=1)
        match = control.loc[dists.idxmin()]
        effects.append(float(row[outcome] - match[outcome]))

    effects_arr = np.asarray(effects, dtype=float)
    effect = float(effects_arr.mean())
    se = float(stats.sem(effects_arr)) if len(effects_arr) > 1 else abs(effect) * 0.2 + 1.0
    return effect, se, int(len(treated)), int(len(control))


def run_estimate(payload: EstimateRequest) -> EstimateResponse:
    meta = get_case(payload.case_id)
    df = load_case_frame(payload.case_id)

    outcome = payload.outcome or meta["outcome"]
    intervention = payload.intervention or meta["intervention"]
    treated_value = payload.treated_region or meta["treated_region"]
    unit_col = meta["unit_col"]
    period_col = meta["period_col"]
    covars = meta["match_covars"]

    if payload.method == "diff_in_diff":
        effect, se, n_t, n_c = _diff_in_diff(df, treated_value, outcome, unit_col, period_col)
        assumptions = [
            AssumptionItem(
                id="parallel_trends",
                label="Parallel trends",
                status="assumed",
                note="Treated and control would have followed similar trends without the intervention.",
            ),
            AssumptionItem(
                id="no_anticipation",
                label="No anticipation",
                status="assumed",
                note="Units did not change behavior before the intervention start.",
            ),
            AssumptionItem(
                id="stable_composition",
                label="Stable group composition",
                status="checked",
                note="Demo panel keeps the same units pre/post by construction.",
            ),
        ]
        limitations = [
            "Synthetic demo with known treatment assignment — real observational data may violate parallel trends.",
            "Simple two-period DiD; no covariates, clustered SE or event-study diagnostics yet.",
            "Effect is an ATT under stated assumptions, not a universal causal guarantee.",
        ]
        method_label = "Difference-in-Differences (simple)"
    else:
        effect, se, n_t, n_c = _matching(
            df, treated_value, outcome, unit_col, period_col, covars
        )
        assumptions = [
            AssumptionItem(
                id="unconfoundedness",
                label="Conditional unconfoundedness",
                status="assumed",
                note=f"Observed covariates ({', '.join(covars)}) are assumed to block confounding paths.",
            ),
            AssumptionItem(
                id="overlap",
                label="Common support / overlap",
                status="unverified",
                note="MVP matching does not yet report propensity overlap diagnostics.",
            ),
            AssumptionItem(
                id="suta",
                label="SUTVA",
                status="assumed",
                note="No interference between units and one version of treatment.",
            ),
        ]
        limitations = [
            "Nearest-neighbor matching is basic; Phase 2 adds propensity scores and balance tables.",
            "Matching on few covariates — residual confounding remains possible.",
            "Results are illustrative on synthetic data and must not be over-interpreted.",
        ]
        method_label = "Nearest-neighbor matching (basic)"

    z = 1.96
    ci_low = effect - z * se
    ci_high = effect + z * se
    crosses_zero = ci_low <= 0 <= ci_high
    direction = "positive" if effect > 0 else "negative" if effect < 0 else "near-zero"
    evidence_label: str = "inconclusive" if crosses_zero else "suggestive"

    decision_memo = (
        f"Case `{payload.case_id}` — intervention `{intervention}` on outcome `{outcome}` "
        f"shows a {direction} estimated effect of {effect:.2f} "
        f"(95% CI [{ci_low:.2f}, {ci_high:.2f}]) via {method_label}. "
    )
    if crosses_zero:
        decision_memo += (
            "Evidence label: INCONCLUSIVE — the interval includes zero under current assumptions. "
            "Do not claim impact. Prefer stronger design (RCT / better controls) or more power before acting."
        )
    else:
        decision_memo += (
            "Evidence label: SUGGESTIVE (not proven) — the interval excludes zero under stated assumptions. "
            "This is still not automatic proof. Validate assumptions and review costs/risks before scaling."
        )

    caveats = [
        *SHARED_CAVEATS,
        f"Case expected signal (by design): {meta['expected_signal']}.",
        meta["notice"],
    ]

    return EstimateResponse(
        case_id=payload.case_id,
        method=payload.method,
        intervention=intervention,
        outcome=outcome,
        effect_estimate=round(effect, 4),
        std_error=round(se, 4),
        ci_low=round(ci_low, 4),
        ci_high=round(ci_high, 4),
        n_treated=n_t,
        n_control=n_c,
        crosses_zero=crosses_zero,
        evidence_label=evidence_label,  # type: ignore[arg-type]
        assumptions=assumptions,
        limitations=limitations,
        decision_memo=decision_memo,
        caveats=caveats,
        disclaimer=DISCLAIMER,
    )
