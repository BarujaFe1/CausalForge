# Architecture — CausalForge

## Purpose

CausalForge is a **responsible causal inference lab** for portfolio demos: it estimates intervention effects on synthetic business panels while forcing the user through **question → assumptions → method → uncertainty → decision memo**.

It does **not** claim automatic causality.

## High-level diagram

```text
Browser (Next.js)
  │  NEXT_PUBLIC_API_URL
  ▼
FastAPI (apps/api)
  ├── /api/cases
  ├── /api/demo?case_id=
  ├── /api/estimate   POST
  └── /api/methodology
  │
  ▼
Services
  ├── demo_data.py     case registry + CSV loaders
  └── estimators.py    DiD + standardized NN matching
  │
  ▼
data/seed/*.csv        synthetic ground-truth panels
```

## Monorepo layout

| Path | Role |
|---|---|
| `apps/web` | Demo UI (App Router), journey steps, responsible labels |
| `apps/api` | FastAPI estimators + pytest |
| `api/index.py` | Vercel Python entry (adds `apps/api` to `sys.path`) |
| `data/seed` | Controlled synthetic datasets |
| `docs/` | Audit, architecture, methodology, handoff |
| `vercel.json` | Serverless API build for `@vercel/python` |

## Domain model

1. **Case** — narrative + schema metadata (`promo_campaign`, `support_sla`).
2. **Assumptions** — declared with status (`assumed` / `checked` / `unverified`).
3. **Estimate** — ATT point estimate, SE, 95% CI, `crosses_zero`, `evidence_label`.
4. **Memo** — executive text + limitations + caveats + disclaimer.

## Identification strategies (MVP)

### Difference-in-Differences
\[
\widehat{ATT} = (Y_{post}^{T}-Y_{pre}^{T}) - (Y_{post}^{C}-Y_{pre}^{C})
\]
SE uses finer panel ids when present (`unit_id` / `agent_id`).

### Matching
1:1 nearest neighbor on z-scored covariates (pooled post sample), with replacement.

## Evidence labels (product contract)

| Label | Rule |
|---|---|
| `suggestive` | 95% CI excludes 0 under stated assumptions — **not proof** |
| `inconclusive` | 95% CI includes 0 — do not claim impact |
| `not_estimable` | Reserved for future failure modes |

## Boundary decisions

- **No upload in MVP UI** (seed only) — reduces PII risk.
- **No DoWhy/EconML** in MVP — keep serverless bundle lean.
- **CORS via `CORS_ORIGINS`** — required for dual Vercel deploy.
- **Degraded UI** when API is down — journey browsable, estimate blocked.

## Extension points (Phase 2+)

- Propensity score + balance tables
- DAG canvas
- Placebo / pre-trend checks
- Sensitivity analysis
- Method comparison panel
