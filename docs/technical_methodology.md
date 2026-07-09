# CausalForge — Technical Methodology (MVP)

## Goal
Estimate the effect of a declared intervention on an outcome while surfacing assumptions, uncertainty and limitations.

## Demo data
Synthetic retail panel (`data/seed/ops_intervention_demo.csv`):
- units nested in regions
- pre/post periods
- treated region receives `promo_campaign` in post
- outcome: `revenue`
- covariates: `store_size`, `baseline_traffic`

True data-generating ATT on treated post is approximately **+35** revenue units (plus common post trend), enabling controlled method checks.

## MVP estimators

### 1. Difference-in-Differences (simple)
\[
ATT = (Y_{post}^{T} - Y_{pre}^{T}) - (Y_{post}^{C} - Y_{pre}^{C})
\]
Assumes parallel trends, no anticipation and stable composition.

### 2. Nearest-neighbor matching (basic)
Match treated post units to control post units on `store_size` and `baseline_traffic` (Euclidean distance, 1:1 with replacement). Report mean outcome difference as ATT under conditional unconfoundedness and overlap.

## Uncertainty
MVP reports a conservative standard error and a normal-approximation 95% CI. Phase 2 will add clustered SE, placebo tests and sensitivity analysis.

## Non-goals
- Automatic causal discovery
- Claiming causality without assumptions
- Production decision automation on individuals
