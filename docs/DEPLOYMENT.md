# Deployment — CausalForge

## Architecture on Vercel

| Project | Root | Runtime | URL (current) |
|---|---|---|---|
| `causalforge` | `apps/web` | Next.js | https://causalforge-rose.vercel.app |
| `causalforge-api` | repo root (`vercel.json`) | Python FastAPI | https://causalforge-api.vercel.app |

> Note: `causalforge.vercel.app` may be unavailable/occupied on the team; use the project alias that Vercel assigns (currently `causalforge-rose`).

## Environment variables

### Web (`causalforge`)
```bash
NEXT_PUBLIC_API_URL=https://causalforge-api.vercel.app
```

### API (`causalforge-api`)
```bash
CORS_ORIGINS=https://causalforge-rose.vercel.app,https://causalforge.vercel.app,http://localhost:3000
```

Local template: see root `.env.example` (never commit real `.env` / OIDC tokens).

## Deploy commands (CLI)

```bash
# API (from repo root, linked to causalforge-api)
vercel link --yes --project causalforge-api
vercel deploy --prod --yes

# Web (from apps/web, linked to causalforge)
cd apps/web
vercel link --yes --project causalforge
vercel deploy --prod --yes
```

## Smoke checklist after deploy

1. `GET https://causalforge-api.vercel.app/health` → `status: ok`
2. `GET /api/cases` → `promo_campaign`, `support_sla`
3. `POST /api/estimate` with promo DiD → `evidence_label: suggestive` (typically)
4. Open web demo → complete journey → memo with caveats
5. Confirm `Access-Control-Allow-Origin` echoes the web origin

## Local demo

```bash
# Terminal A
cd apps/api
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Terminal B
cd apps/web
set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev
```

Or Windows: `start.bat` from repo root.
