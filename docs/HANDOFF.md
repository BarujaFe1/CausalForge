# Handoff — CausalForge Portfolio Quality Pass

**Branch:** `chore/portfolio-quality-pass`  
**Date:** 2026-07-13  
**Author workstream:** deep portfolio review (architecture, causal rigor, QA, DX, docs, UX)

---

## What was found

| Area | Finding |
|---|---|
| Product thesis | Strong — responsible observational causality for portfolio |
| Matching | Euclidean distance on **raw** scales (traffic dominated size) |
| DiD SE | Fragile when grouping only has 2 arms (`support_sla`) |
| Frontend | Monolithic page; unused `recharts` / `lucide-react`; no ESLint flat config |
| Ops | No CI; thin estimator unit tests; incomplete deploy/architecture docs |
| Security | No secrets in git; local `.vercel` / `.env.local` correctly ignored |
| UX | Weak loading/error/offline states; a11y gaps (skip link, labels) |

**Pre-pass overall score:** ~7.0 / 10  

---

## What was fixed / improved

### Bugs & engineering
- **B1** Matching now z-scores pooled post covariates before NN distance
- **B2** ESLint flat config (`eslint.config.mjs`) + `npm run lint`
- **B3** Missing seed / bad `case_id` → HTTP 400/404 instead of unhandled 500
- **B4** UI split into `CasePicker`, `StepNav`, `EvidencePanel`, `DecisionMemo`
- **B5** Removed unused frontend dependencies
- DiD SE prefers `unit_id` / `agent_id` when present
- Typo fix: assumption id `suta` → `sutva`
- Extra limitation text when DiD is asked on 2-arm group panels

### Product / UX
- Loading skeletons, API offline banner, estimate blocked when API down
- Skip link, `aria-*`, focus-visible, method `<label htmlFor>`
- Tip copy under effect panel explaining CI crossing zero
- Fallback cases for degraded browsing

### Quality gates
- `tests/test_estimators.py` — promo DiD ≈ +35, standardization, disclaimer
- `pytest.ini` with `pythonpath = .`
- `.github/workflows/ci.yml` — API pytest/ruff + web typecheck/lint/build

### Docs
- `docs/AUDIT_REPORT.md`
- `docs/ARCHITECTURE.md`
- `docs/TECHNICAL_DECISIONS.md`
- `docs/TESTING.md`
- `docs/DEPLOYMENT.md`
- Portfolio-grade `README.md` rewrite (problem, solution, interview script)
- This `docs/HANDOFF.md`

---

## Commands run

```bash
# API
cd apps/api
ruff check app tests          # pass
pytest                        # 12 passed

# Web
cd apps/web
npm run typecheck
npm run lint
npm run build                 # NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## Tests executed

| Suite | Result |
|---|---|
| `apps/api` pytest | **12 passed** |
| `apps/api` ruff | **All checks passed** |
| `apps/web` typecheck | run in this pass |
| `apps/web` lint | run in this pass |
| `apps/web` build | run in this pass |

---

## What still remains (intentional / next)

1. **Real product screenshots** — README assets are still generated placeholders.
2. **Propensity / balance / placebo / sensitivity** — Phase 2 (documented, not built).
3. **Alias `causalforge.vercel.app`** — occupied; live demo is `causalforge-rose.vercel.app`.
4. **Upload path** — out of MVP; keep seed-only for PII safety.
5. **Cold start / bundle size** on Vercel Python (SciPy) — monitor; trim further if needed.
6. **E2E browser tests** — not added (API contract tests cover statistical core).
7. **Redeploy web+API** after merging this branch to pick up matching + UX fixes in production.

---

## Remaining risks

- Users may still over-read `SUGGESTIVE` as proof — copy must stay aggressive.
- Matching remains basic (no overlap diagnostics).
- Dual-project CORS misconfig can break demo if env drifts.
- Portfolio screenshots should be refreshed from the live UI.

---

## Suggested next steps

1. Merge PR `chore/portfolio-quality-pass` → `main`
2. Redeploy `causalforge-api` and `causalforge`
3. Capture real screenshots into `assets/screenshots/`
4. Optionally add Phase 2 propensity + balance table as a follow-up PR

---

## Portfolio talking points

- “I built a causal lab that refuses automatic causality.”
- “Two synthetic DGPs: one recovers ATT ≈ +35; one teaches inconclusive evidence.”
- “Matching distances are scale-invariant; labels come from CI coverage of zero.”
- “Full-stack + CI + dual Vercel deploy with degraded UI offline.”

Detail page: `/projetos/causal-forge` on Felipe’s portfolio.

---

## Suggested commit message

```text
chore: improve portfolio quality, docs, tests and stability
```

---

## Acceptance checklist

- [x] Installs (API venv + web npm)
- [x] Runs locally (documented)
- [x] Build passes (web)
- [x] Main bugs fixed + tests
- [x] README portfolio-grade
- [x] Architecture / testing / deployment / decisions docs
- [x] CI workflow
- [x] `.env.example` present; `.gitignore` blocks secrets
- [x] Essential tests exist
- [x] UX reviewed (journey, loading, offline, a11y basics)
- [x] HANDOFF written
- [x] No secrets committed
