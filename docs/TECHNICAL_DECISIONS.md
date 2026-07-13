# Technical Decisions — CausalForge

## TD-01 — Responsible labels over p-value theater
**Decision:** Surface `suggestive` / `inconclusive` from CI coverage of zero, plus mandatory caveats.  
**Why:** Portfolio demos that shout “significant!” teach the wrong habit.  
**Trade-off:** Users wanting a single green “winner” badge will be frustrated — by design.

## TD-02 — Dual Vercel projects (web + API)
**Decision:** Mirror SentinelaSUS: Next.js app + Python FastAPI on Vercel.  
**Why:** Keeps App Router DX; avoids static-export hybrid complexity.  
**Trade-off:** CORS and two env configs; cold starts on SciPy.

## TD-03 — Synthetic controlled cases only (MVP)
**Decision:** Two seed CSVs with known DGP properties.  
**Why:** Enables method checks without PII and teaches when evidence is weak.  
**Trade-off:** Not a production analytics platform.

## TD-04 — Standardize covariates before matching
**Decision:** Z-score pooled post covariates before Euclidean NN.  
**Why:** Raw scales (e.g. traffic vs store size) otherwise dominate distance.  
**Trade-off:** Still not propensity-score matching; overlap unverified.

## TD-05 — Prefer SciPy stack, defer DoWhy/EconML
**Decision:** Pandas + NumPy + SciPy only for MVP estimators.  
**Why:** Smaller Vercel bundle, clearer pedagogy, fewer opaque abstractions.  
**Trade-off:** Fewer advanced identification utilities out of the box.

## TD-06 — Monolithic journey in one route
**Decision:** Single `/` page with step state instead of multi-route wizard.  
**Why:** Fastest demo loop for portfolio visitors.  
**Trade-off:** Less deep-linking per step (acceptable for MVP).

## TD-07 — No automatic causality claims in copy
**Decision:** README, API disclaimer, and UI notice share the same contract.  
**Why:** Causal products that overclaim destroy credibility in interviews.  
**Trade-off:** More reading; slower “wow” marketing.
