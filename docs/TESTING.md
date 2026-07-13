# Testing — CausalForge

## Backend (`apps/api`)

```bash
cd apps/api
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
set PYTHONPATH=.   # Windows PowerShell: $env:PYTHONPATH="."
pytest
ruff check app tests
```

### What we cover

| Suite | Focus |
|---|---|
| `tests/test_api.py` | Health, cases, demo, estimate endpoints |
| `tests/test_estimators.py` | Promo DiD recovers ~+35 ATT; matching standardization; caveats |

### Design notes

- Promo case DGP includes a known ATT ≈ +35 → regression guard against broken DiD.
- SLA case is noisy by design → tests assert memo/caveats, not a fixed label.
- Estimators never return without `disclaimer` + caveats.

## Frontend (`apps/web`)

```bash
cd apps/web
npm ci
npm run typecheck
npm run lint
npm run build
```

UI is intentionally thin: API contract tests carry statistical correctness.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs API pytest/ruff and web typecheck/lint/build on push/PR.
