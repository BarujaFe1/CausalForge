"""Demo dataset helpers for CausalForge — multiple synthetic cases."""

from __future__ import annotations

from pathlib import Path

import pandas as pd

SEED_DIR = Path(__file__).resolve().parents[4] / "data" / "seed"

CASES: dict[str, dict] = {
    "promo_campaign": {
        "id": "promo_campaign",
        "title": "Promo campaign (retail panel)",
        "title_pt": "Campanha promocional (painel de varejo)",
        "description": (
            "Synthetic retail panel: 5 regions, pre/post periods, promo applied to South in post. "
            "Outcome = revenue. Designed so Diff-in-Diff recovers a clear ATT under parallel trends."
        ),
        "description_pt": (
            "Painel sintético de varejo: 5 regiões, períodos pre/post, promoção na região South no pós. "
            "Outcome = revenue. Diff-in-Diff recupera um ATT claro sob parallel trends."
        ),
        "file": "ops_intervention_demo.csv",
        "recommended_method": "diff_in_diff",
        "outcome": "revenue",
        "intervention": "promo_campaign",
        "treated_region": "South",
        "unit_col": "region",
        "period_col": "period",
        "treated_col": "treated",
        "match_covars": ["store_size", "baseline_traffic"],
        "story": (
            "Growth rolled a regional promo. Question: did revenue rise because of the campaign, "
            "or would it have risen anyway?"
        ),
        "story_pt": (
            "Growth lançou uma promoção regional. Pergunta: a receita subiu por causa da campanha, "
            "ou teria subido de qualquer forma?"
        ),
        "expected_signal": "positive_clear",
        "notice": "Synthetic data only. Method demonstration — not a production decision.",
    },
    "support_sla": {
        "id": "support_sla",
        "title": "Support SLA coaching (ops matching)",
        "title_pt": "Coaching de SLA de atendimento (matching operacional)",
        "description": (
            "Synthetic support ops: agents coached on SLA vs similar uncoached agents. "
            "Outcome = resolution_hours. Matching on tenure and ticket_load; residual noise makes "
            "the interval often cross zero — useful to practice non-overclaim."
        ),
        "description_pt": (
            "Ops de suporte sintético: agentes com coaching de SLA vs similares sem coaching. "
            "Outcome = resolution_hours. Matching em tenure e ticket_load; ruído residual faz o "
            "intervalo frequentemente cruzar zero — útil para praticar não overclaim."
        ),
        "file": "support_sla_demo.csv",
        "recommended_method": "matching",
        "outcome": "resolution_hours",
        "intervention": "sla_coaching",
        "treated_region": "coached",
        "unit_col": "group",
        "period_col": "period",
        "treated_col": "treated",
        "match_covars": ["tenure_months", "ticket_load"],
        "story": (
            "Ops coached half the agents on SLA. Question: did coaching shorten resolution time, "
            "or are coached agents just different?"
        ),
        "story_pt": (
            "Ops treinou metade dos agentes em SLA. Pergunta: o coaching reduziu o tempo de resolução, "
            "ou os agentes treinados já eram diferentes?"
        ),
        "expected_signal": "inconclusive_likely",
        "notice": "Synthetic data only. Inconclusive intervals are a feature, not a bug.",
    },
}


def list_cases() -> list[dict]:
    return [
        {
            "id": c["id"],
            "title": c["title"],
            "title_pt": c["title_pt"],
            "description": c["description"],
            "description_pt": c["description_pt"],
            "recommended_method": c["recommended_method"],
            "outcome": c["outcome"],
            "intervention": c["intervention"],
            "treated_region": c["treated_region"],
            "story": c["story"],
            "story_pt": c["story_pt"],
            "expected_signal": c["expected_signal"],
            "notice": c["notice"],
        }
        for c in CASES.values()
    ]


def get_case(case_id: str) -> dict:
    if case_id not in CASES:
        raise ValueError(f"Unknown case '{case_id}'. Available: {', '.join(CASES)}")
    return CASES[case_id]


def load_case_frame(case_id: str = "promo_campaign") -> pd.DataFrame:
    meta = get_case(case_id)
    path = SEED_DIR / meta["file"]
    if not path.exists():
        raise FileNotFoundError(f"Demo dataset not found at {path}")
    return pd.read_csv(path)


def load_demo_frame() -> pd.DataFrame:
    """Backward-compatible default case."""
    return load_case_frame("promo_campaign")


def load_demo_summary(case_id: str = "promo_campaign") -> dict:
    meta = get_case(case_id)
    df = load_case_frame(case_id)
    unit_col = meta["unit_col"]
    return {
        "id": meta["id"],
        "name": meta["file"].replace(".csv", ""),
        "title": meta["title"],
        "title_pt": meta["title_pt"],
        "description": meta["description"],
        "description_pt": meta["description_pt"],
        "story": meta["story"],
        "story_pt": meta["story_pt"],
        "rows": int(len(df)),
        "columns": list(df.columns),
        "regions": sorted(df[unit_col].astype(str).unique().tolist()),
        "periods": sorted(df[meta["period_col"]].astype(str).unique().tolist()),
        "treatment_rate": float(df[meta["treated_col"]].mean()),
        "outcome": meta["outcome"],
        "intervention": meta["intervention"],
        "treated_region": meta["treated_region"],
        "recommended_method": meta["recommended_method"],
        "expected_signal": meta["expected_signal"],
        "path": f"data/seed/{meta['file']}",
        "notice": meta["notice"],
        "cases": list_cases(),
    }
