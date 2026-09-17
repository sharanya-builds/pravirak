# PRAVIRAK Backend

Node.js + Express + PostgreSQL API that backs authentication and persistence
(My Businesses, Reports) for the PRAVIRAK frontend. All deterministic
business/finance/decision computation stays in the frontend engine
(`frontend/src/engine`); this service is responsible for accounts and
saved-analysis storage so a user's businesses follow them across devices.

## Stack

- Express (routing/middleware)
- PostgreSQL via `pg` (connection pool, plain parameterized SQL — no ORM)
- bcryptjs (password hashing)
- jsonwebtoken (stateless session tokens)

## Structure

```text
backend/
├── src/
│   ├── controllers/   # request/response glue
│   ├── services/      # business logic + SQL
│   ├── middleware/     # auth guard, error handling
│   ├── routes/         # Express routers
│   ├── db/              # schema.sql + Postgres pool
│   ├── app.js           # Express app factory
│   └── server.js        # process entry point (runs schema.sql on boot)
└── docker-compose.yml    # one-command local Postgres for development
```

## Setup

You need a PostgreSQL database. Easiest path for local development:

```bash
cd backend
docker compose up -d        # starts Postgres 16 on localhost:5432
npm install
cp .env.example .env         # defaults already match docker-compose.yml
npm run dev                    # http://localhost:4000
```

No Docker? Point `DATABASE_URL` in `.env` at any Postgres instance — a local
install, or a free-tier managed database (Neon, Supabase, Render, Railway,
RDS, etc. all work). The schema (`src/db/schema.sql`) runs automatically on
first boot — no separate migration step needed for a fresh database.

If the backend can't reach Postgres, `npm run dev` fails fast with a clear
error message rather than starting in a broken state.

## API

All responses are JSON. Authenticated routes require `Authorization: Bearer <token>`.

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | `{ name, phone?, email?, password }` → `{ user, token }` |
| POST | `/api/auth/login` | No | `{ identifier, password }` → `{ user, token }` |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/businesses` | Yes | List the logged-in user's saved businesses |
| GET | `/api/businesses/:id` | Yes | Get one saved business |
| POST | `/api/businesses` | Yes | Create or update (pass `id` to update) a saved business snapshot |
| DELETE | `/api/businesses/:id` | Yes | Remove a saved business |
| GET | `/api/reports` | Yes | List generated reports |
| POST | `/api/reports` | Yes | Record a generated report for a business |
| POST | `/api/schemes/recommend` | No | AI-grounded government scheme lookup (see below) |

`identifier` in login accepts either the phone number or email used at registration.

## AI-grounded government schemes (Gemini + Google Search grounding)

`POST /api/schemes/recommend` takes `{ businessIdea, category, ownCapital, city, state }` and asks
Gemini — using live Google Search grounding — to find *current* central/state government schemes
a business like this could realistically apply for, sourced only from official government pages.

This is deliberately **retrieval + explanation only**: the LLM never computes eligibility, subsidy
rupee amounts, EMI, or DSCR — that stays in the deterministic `engine/` code on the frontend. The
service enforces:

- **No invented data.** Every returned scheme must include a `sourceUrl` matching `https://...`; the
  prompt instructs the model to omit any detail it can't verify from a retrieved source, and the
  service discards any scheme object that doesn't have a valid name, summary, source URL, and
  confidence rating.
- **Source, freshness, confidence always shown.** Each scheme carries `sourceName`/`sourceUrl`,
  a `freshness` string (or `"undated"`), and a `confidence` of `HIGH`/`MEDIUM`/`LOW`.
- **Safe fallback, never a fabricated answer.** If `GEMINI_API_KEY` isn't set, the request fails, or
  the model's response can't be parsed into valid scheme objects, the endpoint returns
  `{ grounded: false, reason, schemes: [] }` and the frontend falls back to PRAVIRAK's static,
  human-curated `data/schemes.ts` dataset instead of ever showing unverified information.

Set `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`, default `gemini-2.5-flash`) in `backend/.env` to
enable this. Without it, scheme lookups still work end-to-end using the static dataset.

**On model names:** a Gemini API key is not tied to a specific model version — the same key works for
any model your project has access to, you just reference it by ID in the request. Google renames and
retires model IDs fairly often (for example the entire `gemini-2.0-*` line was shut down on June 1,
2026), so hardcoding one model name is fragile. `geminiSchemeService.js` tries your configured
`GEMINI_MODEL` first, then falls back through Google's rolling `gemini-flash-latest` alias and a couple
of known-good model IDs before giving up — so a single deprecated model name won't silently break scheme
lookups. If you start seeing `grounded: false` with a reason mentioning 404s, check
https://ai.google.dev/gemini-api/docs/models for the current model list and update `GEMINI_MODEL`.

## Notes

- Passwords are hashed with bcrypt; never stored in plain text.
- Tokens are signed JWTs (`JWT_SECRET`), expire per `JWT_EXPIRES_IN` (default 7 days).
- The `snapshot_json` column on `businesses` stores the full business input,
  location, financials and decision result so an analysis can be re-opened
  without recomputation.
