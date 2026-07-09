"""Demo dataset helpers for CausalForge."""

from __future__ import annotations

from pathlib import Path

import pandas as pd

SEED_PATH = Path(__file__).resolve().parents[4] / "data" / "seed" / "ops_intervention_demo.csv"


def load_demo_frame() -> pd.DataFrame:
    if not SEED_PATH.exists():
        raise FileNotFoundError(f"Demo dataset not found at {SEED_PATH}")
    return pd.read_csv(SEED_PATH)


def load_demo_summary() -> dict:
    df = load_demo_frame()
    return {
        "name": "ops_intervention_demo",
        "description": (
            "Synthetic retail operations panel: regions, pre/post periods, "
            "promo campaign treatment and revenue outcome."
        ),
        "rows": int(len(df)),
        "columns": list(df.columns),
        "regions": sorted(df["region"].unique().tolist()),
        "periods": sorted(df["period"].unique().tolist()),
        "treatment_rate": float(df["treated"].mean()),
        "outcome": "revenue",
        "intervention": "promo_campaign",
        "path": "data/seed/ops_intervention_demo.csv",
        "notice": "Synthetic data only. Designed for method demonstration, not production decisions.",
    }
