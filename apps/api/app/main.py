from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import demo, estimate, health, methodology

app = FastAPI(
    title="CausalForge API",
    description=(
        "Applied causal inference lab for business interventions. "
        "Estimates effects with explicit assumptions, uncertainty and limitations."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(demo.router, prefix="/api")
app.include_router(estimate.router, prefix="/api")
app.include_router(methodology.router, prefix="/api")
