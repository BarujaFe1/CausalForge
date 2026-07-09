"""Pydantic schemas for CausalForge API."""

from typing import Literal

from pydantic import BaseModel, Field


class EstimateRequest(BaseModel):
    case_id: Literal["promo_campaign", "support_sla"] = "promo_campaign"
    method: Literal["diff_in_diff", "matching"] = "diff_in_diff"
    outcome: str | None = Field(default=None, description="Outcome metric column (defaults from case)")
    intervention: str | None = Field(default=None, description="Intervention label (defaults from case)")
    treated_region: str | None = Field(
        default=None,
        description="Treated unit/group value (defaults from case)",
    )


class AssumptionItem(BaseModel):
    id: str
    label: str
    status: Literal["assumed", "checked", "unverified", "violated"]
    note: str


class EstimateResponse(BaseModel):
    case_id: str
    method: str
    intervention: str
    outcome: str
    effect_estimate: float
    std_error: float
    ci_low: float
    ci_high: float
    n_treated: int
    n_control: int
    crosses_zero: bool
    evidence_label: Literal["suggestive", "inconclusive", "not_estimable"]
    assumptions: list[AssumptionItem]
    limitations: list[str]
    decision_memo: str
    caveats: list[str]
    disclaimer: str
