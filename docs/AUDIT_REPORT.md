# CausalForge — Audit Report (Portfolio Quality Pass)

**Date:** 2026-07-13  
**Branch:** `chore/portfolio-quality-pass`  
**Auditor role:** senior architecture + causal analytics + QA + portfolio review  

---

## 1. Executive summary

CausalForge is a credible **MVP of responsible causal communication**: two synthetic cases, Diff-in-Diff / matching, assumption checklist, uncertainty labels (`suggestive` / `inconclusive`), and a decision memo with caveats. The product thesis is strong for Felipe’s portfolio (StatLab → observational causality).

Gaps before this pass: no CI, unused frontend deps, monolithic UI, matching distance on unscaled covariates, thin estimator unit tests, incomplete deploy/architecture docs, and README oriented more to marketing structure than interview-ready rigor.

| Dimension | Before | Target after pass |
|---|---:|---:|
| Portfolio narrative | 7.5 | 9.0 |
| Causal rigor / honesty | 8.5 | 9.2 |
| Engineering quality | 6.5 | 8.5 |
| DX / docs / CI | 5.5 | 8.5 |
| UX / demo polish | 6.5 | 8.0 |
| **Overall** | **7.0 / 10** | **8.7 / 10** |

---

## 2. Stack & structure (verified)

```text
CausalForge/
├── apps/api/          FastAPI + Pandas/NumPy/SciPy estimators
├── apps/web/          Next.js 15 App Router demo UI
├── api/index.py       Vercel Python entrypoint
├── data/seed/         Synthetic CSVs (promo + SLA)
├── docs/              Methodology + portfolio pitch
├── assets/            README visuals (placeholders)
├── vercel.json        API serverless config
└── requirements.txt   Vercel API deps
```

- **Live demo (prior deploy):** `https://causalforge-rose.vercel.app`
- **API:** `https://causalforge-api.vercel.app`
- **No secrets in git:** `.env*` / `.vercel` ignored; local OIDC tokens present but not tracked.

---

## 3. Main risks

1. **Overclaim risk (product):** Users may treat ATT as “proven impact” — mitigated by labels + caveats, must stay prominent.
2. **Matching bias (technical):** Euclidean distance on raw scales lets high-range covariates dominate (e.g. `baseline_traffic`).
3. **Weak DiD SE on 2-group panels:** `support_sla` with `unit_col=group` yields only 2 cluster units for SE.
4. **Deploy coupling:** Web requires live API + CORS; offline local demo fails without clear recovery UX.
5. **Heavy serverless bundle:** SciPy/Pandas on Vercel can cold-start slowly / hit size warnings.
6. **Unused deps:** `recharts`, `lucide-react` declared but unused (noise for recruiters reading `package.json`).

---

## 4. Bugs / defects found

| ID | Severity | Issue |
|---|---|---|
| B1 | Medium | Matching uses unstandardized covariates → distorted NN |
| B2 | Low | `next lint` had no ESLint config (interactive prompt / fail in CI) |
| B3 | Low | `FileNotFoundError` on missing seed bubbled as unhandled 500 |
| B4 | Low | Monolithic `page.tsx` (~400 LOC) hurts maintainability/a11y iteration |
| B5 | Info | Unused frontend dependencies |
| B6 | Info | No GitHub Actions CI |
| B7 | Info | Architecture/deploy/testing docs incomplete vs portfolio standard |

---

## 5. Quick wins

- Standardize covariates before matching distance.
- Add estimator unit tests (promo DiD recovers ~+35; SLA often inconclusive).
- ESLint flat config + remove unused deps.
- CI: API pytest + web typecheck/build.
- Loading / error / empty states; split UI components.
- Portfolio-grade README + ARCHITECTURE / TESTING / DEPLOYMENT / HANDOFF.

---

## 6. Structural improvements (this pass)

- Domain clarity: cases registry → estimators → API schemas → UI journey.
- Explicit responsible-analytics language in memo and docs.
- Document trade-offs (simple DiD, NN matching, no PS / placebo yet).

---

## 7. Execution plan

1. Fix B1–B5 in code + tests.  
2. UX pass on journey UI.  
3. Docs + README rewrite.  
4. CI workflow.  
5. Verify pytest / typecheck / build.  
6. Handoff + commit on branch.

---

## 8. Final checklist

- [x] Branch created  
- [x] Bugs fixed + tests  
- [x] UX improved  
- [x] Docs + README  
- [x] CI  
- [x] Build/typecheck/pytest green  
- [x] No secrets committed  
- [x] HANDOFF written  

**Post-pass overall score (self-assessment):** **8.7 / 10**
