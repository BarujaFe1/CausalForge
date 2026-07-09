from fastapi import APIRouter

router = APIRouter(tags=["methodology"])


@router.get("/methodology")
async def methodology():
    return {
        "product": "CausalForge",
        "purpose": "Applied causal inference lab for business interventions",
        "mvp_methods": [
            {
                "id": "diff_in_diff",
                "name": "Difference-in-Differences (simple)",
                "when": "Parallel trends between treated and control groups over time",
                "outputs": ["ATT estimate", "confidence interval", "assumption checklist"],
            },
            {
                "id": "matching",
                "name": "Nearest-neighbor matching (basic)",
                "when": "Observable confounders can balance treated vs control units",
                "outputs": ["matched ATT", "balance summary", "limitations"],
            },
        ],
        "phase_2": [
            "propensity score",
            "DAG canvas",
            "placebo tests",
            "sensitivity analysis",
            "method comparison",
        ],
        "responsible_use": [
            "State the causal question and intervention clearly",
            "Declare identifying assumptions before estimating",
            "Report uncertainty and limitations with every effect",
            "Never treat observational estimates as automatic proof of causality",
        ],
    }
