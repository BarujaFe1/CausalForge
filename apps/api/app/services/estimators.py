"""Simple causal estimators with explicit assumptions and limitations."""

from __future__ import annotations

import numpy as np
import pandas as pd
from scipy import stats

from app.models.schemas import AssumptionItem, EstimateRequest, EstimateResponse
from app.services.demo_data import load_demo_frame

DISCLAIMER = (
    "CausalForge does not promise automatic causality. Estimates depend on "
    "declared assumptions, data quality and study design. Use results as "
    "decision support with explicit limitations — not as proof."
)


def _diff_in_diff(df: pd.DataFrame, treated_region: str, outcome: str) -> tuple[float, float, int, int]:
    if outcome not in df.columns:
        raise ValueError(f"Outcome column '{outcome}' not found in demo dataset")

    treated = df[df["region"] == treated_region]
    control = df[df["region"] != treated_region]
    if treated.empty or control.empty:
        raise ValueError("Treated or control group is empty for the selected region")

    pre_t = treated.loc[treated["period"] == "pre", outcome].mean()
    post_t = treated.loc[treated["period"] == "post", outcome].mean()
    pre_c = control.loc[control["period"] == "pre", outcome].mean()
    post_c = control.loc[control["period"] == "post", outcome].mean()

    effect = (post_t - pre_t) - (post_c - pre_c)

    # Conservative SE using pooled residual variance of unit-level DiD contributions
    unit_effects = []
    for region, g in df.groupby("region"):
        pre = g.loc[g["period"] == "pre", outcome].mean()
        post = g.loc[g["period"] == "post", outcome].mean()
        unit_effects.append(post - pre)
    unit_effects = np.asarray(unit_effects, dtype=float)
    se = float(np.std(unit_effects, ddof=1) / np.sqrt(max(len(unit_effects), 1)))
    if se == 0 or np.isnan(se):
        se = abs(effect) * 0.15 + 1.0

    n_treated = int((df["region"] == treated_region).sum())
    n_control = int((df["region"] != treated_region).sum())
    return float(effect), se, n_treated, n_control


def _matching(df: pd.DataFrame, treated_region: str, outcome: str) -> tuple[float, float, int, int]:
    if outcome not in df.columns:
        raise ValueError(f"Outcome column '{outcome}' not found in demo dataset")

    post = df[df["period"] == "post"].copy()
    treated = post[post["region"] == treated_region]
    control = post[post["region"] != treated_region]
    if treated.empty or control.empty:
        raise ValueError("Treated or control group is empty for matching")

    # Match on store_size and baseline_traffic (nearest neighbor, 1:1 with replacement)
    covars = ["store_size", "baseline_traffic"]
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
    df = load_demo_frame()

    if payload.method == "diff_in_diff":
        effect, se, n_t, n_c = _diff_in_diff(df, payload.treated_region, payload.outcome)
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
                note="Demo panel keeps the same regions pre/post by construction.",
            ),
        ]
        limitations = [
            "Synthetic demo with known treatment assignment — real observational data may violate parallel trends.",
            "Simple two-period DiD; no covariates, clustered SE or event-study diagnostics yet.",
            "Effect is an ATT under stated assumptions, not a universal causal guarantee.",
        ]
        method_label = "Difference-in-Differences (simple)"
    else:
        effect, se, n_t, n_c = _matching(df, payload.treated_region, payload.outcome)
        assumptions = [
            AssumptionItem(
                id="unconfoundedness",
                label="Conditional unconfoundedness",
                status="assumed",
                note="Observed covariates (store_size, baseline_traffic) block confounding paths.",
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
                note="No interference between regions and one version of treatment.",
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
    direction = "positive" if effect > 0 else "negative" if effect < 0 else "near-zero"
    crosses_zero = ci_low <= 0 <= ci_high

    decision_memo = (
        f"Intervention `{payload.intervention}` on outcome `{payload.outcome}` "
        f"shows a {direction} estimated effect of {effect:.2f} "
        f"(95% CI [{ci_low:.2f}, {ci_high:.2f}]) via {method_label}. "
    )
    if crosses_zero:
        decision_memo += (
            "The interval includes zero — evidence is inconclusive under current assumptions. "
            "Prefer collecting stronger design (RCT / better controls) before acting."
        )
    else:
        decision_memo += (
            "The interval excludes zero under stated assumptions, but this is not automatic proof. "
            "Validate parallel trends / balance and review operational costs before scaling."
        )

    return EstimateResponse(
        method=payload.method,
        intervention=payload.intervention,
        outcome=payload.outcome,
        effect_estimate=round(effect, 4),
        std_error=round(se, 4),
        ci_low=round(ci_low, 4),
        ci_high=round(ci_high, 4),
        n_treated=n_t,
        n_control=n_c,
        assumptions=assumptions,
        limitations=limitations,
        decision_memo=decision_memo,
        disclaimer=DISCLAIMER,
    )
