from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "causalforge-api",
        "version": "0.1.0",
        "notice": "Causal estimates require explicit assumptions and declared limitations.",
    }
