"""Pydantic schemas for CausalForge API."""

from typing import Literal

from pydantic import BaseModel, Field


class EstimateRequest(BaseModel):
    method: Literal["diff_in_diff", "matching"] = "diff_in_diff"
    outcome: str = Field(default="revenue", description="Outcome metric column")
    intervention: str = Field(
        default="promo_campaign",
        description="Intervention / treatment label for the causal question",
    )
    treated_region: str = Field(default="South", description="Treated unit/region in demo data")


class AssumptionItem(BaseModel):
    id: str
    label: str
    status: Literal["assumed", "checked", "unverified", "violated"]
    note: str


class EstimateResponse(BaseModel):
    method: str
    intervention: str
    outcome: str
    effect_estimate: float
    std_error: float
    ci_low: float
    ci_high: float
    n_treated: int
    n_control: int
    assumptions: list[AssumptionItem]
    limitations: list[str]
    decision_memo: str
    disclaimer: str
