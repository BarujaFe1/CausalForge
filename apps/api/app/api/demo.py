from fastapi import APIRouter, Query

from app.services.demo_data import list_cases, load_demo_summary

router = APIRouter(tags=["demo"])


@router.get("/cases")
async def demo_cases():
    """List available synthetic demo cases."""
    return {"cases": list_cases(), "notice": "Synthetic demos only — responsible causal communication."}


@router.get("/demo")
async def demo_dataset(case_id: str = Query(default="promo_campaign")):
    """Return summary of a synthetic demo dataset."""
    return load_demo_summary(case_id)
