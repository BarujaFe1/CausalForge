from fastapi import APIRouter, HTTPException

from app.models.schemas import EstimateRequest, EstimateResponse
from app.services.estimators import run_estimate

router = APIRouter(tags=["estimate"])


@router.post("/estimate", response_model=EstimateResponse)
async def estimate_effect(payload: EstimateRequest):
    """
    Run a simple causal estimate (diff-in-diff or matching) on the demo dataset.

    This endpoint never claims automatic causality. Results include assumptions,
    uncertainty and explicit limitations.
    """
    try:
        return run_estimate(payload)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
