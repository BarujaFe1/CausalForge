"""Unit tests for causal estimators (synthetic ground truth)."""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

from app.models.schemas import EstimateRequest
from app.services.demo_data import get_case, load_case_frame
from app.services.estimators import _matching, _standardize, run_estimate


def test_promo_did_recovers_positive_att():
    result = run_estimate(
        EstimateRequest(case_id="promo_campaign", method="diff_in_diff")
    )
    assert result.effect_estimate == pytest.approx(35, abs=8)
    assert result.crosses_zero is False
    assert result.evidence_label == "suggestive"
    assert len(result.caveats) >= 3
    assert len(result.assumptions) >= 2


def test_support_matching_returns_memo_and_caveats():
    result = run_estimate(
        EstimateRequest(case_id="support_sla", method="matching")
    )
    assert result.method == "matching"
    assert result.outcome == "resolution_hours"
    assert result.evidence_label in {"suggestive", "inconclusive"}
    assert "decision_memo" in result.model_dump()
    assert any("zero" in c.lower() or "inconclusive" in c.lower() for c in result.caveats)


def test_matching_uses_standardized_distance():
    df = load_case_frame("promo_campaign")
    post = df[df["period"] == "post"].copy()
    treated = post[post["region"] == "South"]
    control = post[post["region"] != "South"]
    covars = ["store_size", "baseline_traffic"]

    stack = pd.concat([treated[covars], control[covars]], axis=0)
    standardized = _standardize(stack)
    assert abs(standardized.mean().mean()) < 1e-9
    assert standardized.std(ddof=0).mean() == pytest.approx(1.0, abs=1e-6)

    effect, se, n_t, n_c = _matching(
        df, "South", "revenue", "region", "period", covars
    )
    assert n_t > 0 and n_c > 0
    assert np.isfinite(effect) and np.isfinite(se)


def test_unknown_case_raises():
    with pytest.raises(ValueError, match="Unknown case"):
        get_case("does_not_exist")


def test_estimate_disclaimer_rejects_automatic_causality():
    result = run_estimate(
        EstimateRequest(case_id="promo_campaign", method="matching")
    )
    text = (result.disclaimer + " " + result.decision_memo).lower()
    assert "not" in text and ("proof" in text or "automatic" in text)
