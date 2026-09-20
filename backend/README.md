# PRAVIRAK Backend Service

Backend API service for the PRAVIRAK business decision and institutional loan appraisal platform.

*For the complete project overview, PS compliance matrix, and architecture diagram, see the [Root README](../README.md).*

---

## Purpose

The PRAVIRAK backend provides:
1. **User Authentication & Cross-Device Persistence**: Secure JWT-based registration and login with bcrypt password hashing; persistent CRUD storage for registered users' saved businesses and generated appraisal reports in PostgreSQL.
2. **Server-Side Geospatial Proxies**: Caching proxies for OpenStreetMap Nominatim (address search, reverse geocoding, and administrative boundary hierarchy parsing) and Overpass API (real competitor POI querying within 5-10 km radii) complying with upstream usage policies and eliminating CORS restrictions.
3. **Evidence-Grounded AI Advisory & Feasibility**: Safe OpenRouter gateway proxying LLM queries (`POST /api/advisor/ask`, `POST /api/reports/local-feasibility`, `POST /api/schemes/recommend`) with strict system prompts, per-IP rate limiting, character caps, and deterministic fallback templates that prevent financial hallucination.

---

## Folder Structure

```text
backend/
├── src/
│   ├── controllers/            # Route request handlers
│   │   ├── authController.js       # Register, login, me
│   │   ├── businessController.js   # Saved business CRUD
│   │   ├── geocodeController.js    # Address search and reverse geocode
│   │   ├── reportController.js     # Saved reports & local feasibility
│   │   └── schemeController.js     # Scheme lookup handlers
│   ├── db/                     # PostgreSQL pool and schema migrations
│   │   ├── index.js                # pg Pool connection management
│   │   └── schema.sql              # Table definitions and index creation
│   ├── middleware/             # Express middlewares
│   │   ├── auth.js                 # JWT bearer token verification
│   │   └── errorHandler.js         # 404 and central error handling
│   ├── routes/                 # Express REST route definitions
│   │   ├── advisorRoutes.js        # /api/advisor
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── businessRoutes.js       # /api/businesses
│   │   ├── geocodeRoutes.js        # /api/geocode
│   │   ├── placesRoutes.js         # /api/places
│   │   ├── reportRoutes.js         # /api/reports
│   │   └── schemeRoutes.js         # /api/schemes
│   ├── services/               # Core business logic & upstream clients
│   │   ├── advisorService.test.js  # Advisor prompt injection & safety tests
│   │   ├── authService.js          # Password hashing and token generation
│   │   ├── businessService.js      # Business persistence queries
│   │   ├── geocodeService.js       # Nominatim OSM client & cache
│   │   ├── localFeasibilityService.js # Zod-validated SWOT/opportunity engine
│   │   ├── localFeasibilityService.test.js # Schema validation tests
│   │   ├── openRouterAdvisorService.js # Context-grounded advisor client
│   │   ├── openRouterSchemeService.js  # Grounded scheme lookup client
│   │   ├── placesService.js        # Overpass API competitor client & cache
│   │   ├── placesService.test.js   # Haversine distance and OSM tag tests
│   │   └── reportService.js        # Report persistence queries
│   ├── app.js                  # Express app configuration & middleware
│   └── server.js               # HTTP server listener and DB schema init
├── docker-compose.yml          # Local PostgreSQL 16 container setup
├── package.json
└── README.md
```

---

## Scripts

- `npm run dev`: Starts the server with Node.js watch mode (`node --watch src/server.js`) on port 4000.
- `npm start`: Starts the production server (`node src/server.js`).
- `npm test`: Runs the automated test suite via the Node.js native test runner (`node --test src/**/*.test.js`).

---

## Environment Variables

The backend relies on the following environment variables (defined in `.env`):

- `PORT`: HTTP server port (defaults to `4000`).
- `NODE_ENV`: Application environment (`development` or `production`).
- `FRONTEND_URL`: Allowed CORS origin for production web frontend.
- `CORS_ORIGIN`: Additional comma-separated allowed CORS origins.
- `JWT_SECRET`: Secret key used for signing and verifying JWT tokens.
- `JWT_EXPIRES_IN`: Expiry duration for authentication tokens (e.g. `7d`).
- `DATABASE_URL`: Full PostgreSQL connection URI.
- `PGHOST`: PostgreSQL host (if `DATABASE_URL` is omitted).
- `PGPORT`: PostgreSQL port (if `DATABASE_URL` is omitted).
- `PGUSER`: PostgreSQL user (if `DATABASE_URL` is omitted).
- `PGPASSWORD`: PostgreSQL password (if `DATABASE_URL` is omitted).
- `PGDATABASE`: PostgreSQL database name (if `DATABASE_URL` is omitted).
- `PGSSL`: Set to `require` for managed cloud databases enforcing SSL.
- `OPENROUTER_API_KEY`: API key for OpenRouter LLM and web-search gateway (optional; falls back to deterministic engine templates if omitted).
- `OPENROUTER_MODEL`: Specific OpenRouter model slug override (optional).
- `OPENROUTER_SITE_URL`: Site attribution header sent to OpenRouter (optional).

---

## Setup and Run Steps

### 1. Start PostgreSQL
You can launch PostgreSQL 16 using Docker Compose:
```bash
docker compose up -d
```
Or connect to any existing PostgreSQL instance by providing `DATABASE_URL` in `.env`.

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` and `JWT_SECRET` are configured.

### 3. Install Dependencies
```bash
npm install
```

### 4. Initialize Database & Launch Server
Starting the server automatically runs `initSchema()` from `src/db/index.js`, executing `schema.sql` idempotently:
```bash
npm run dev
```
The API will be available at `http://localhost:4000`. Verify server health at `GET http://localhost:4000/api/health`.

---

## API Endpoint Table

| Method | Path | Purpose | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check | None (Public) |
| `POST` | `/api/auth/register` | Register a new user account with phone/email and password | None (Public) |
| `POST` | `/api/auth/login` | Authenticate existing user and receive JWT token | None (Public) |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | Bearer JWT |
| `GET` | `/api/businesses` | List all saved business feasibility analyses for current user | Bearer JWT |
| `POST` | `/api/businesses` | Create or update a saved business feasibility snapshot | Bearer JWT |
| `GET` | `/api/businesses/:id`| Retrieve single saved business feasibility analysis by ID | Bearer JWT |
| `DELETE`| `/api/businesses/:id`| Delete saved business analysis | Bearer JWT |
| `GET` | `/api/reports` | List generated business appraisal reports for current user | Bearer JWT |
| `POST` | `/api/reports` | Save a generated business appraisal report | Bearer JWT |
| `POST` | `/api/reports/local-feasibility` | Generate Zod-validated local feasibility report (SWOT, niches, threats, pricing) | None (Session) |
| `GET` | `/api/geocode/search` | Forward geocode address query to Nominatim OSM with administrative hierarchy parsing | None (Public) |
| `GET` | `/api/geocode/reverse`| Reverse geocode coordinates to Nominatim administrative location hierarchy | None (Public) |
| `GET` | `/api/places/nearby` | Query real competitor POIs within 5-10 km radius from Overpass OSM API | None (Public) |
| `POST` | `/api/schemes/recommend` | Retrieve web-grounded central and state MSME schemes with verifiable citations | None (Public) |
| `POST` | `/api/advisor/ask` | Ask conversational question grounded strictly in computed `analysisContext` JSON | Rate-Limited (20 req / 10m) |

---

## Database Schema Summary

The database uses PostgreSQL (configured in [`src/db/schema.sql`](src/db/schema.sql)):

- **`users` Table**:
  - `id`: `SERIAL PRIMARY KEY`
  - `name`: `TEXT NOT NULL`
  - `phone`: `TEXT UNIQUE`
  - `email`: `TEXT UNIQUE`
  - `password_hash`: `TEXT NOT NULL` (bcrypt hash)
  - `created_at`, `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- **`businesses` Table**:
  - `id`: `SERIAL PRIMARY KEY`
  - `user_id`: `INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`
  - `business_idea`: `TEXT NOT NULL`
  - `category`: `TEXT`
  - `location_id`, `location_name`: `TEXT`
  - `own_capital`: `NUMERIC`
  - `status`: `TEXT NOT NULL DEFAULT 'Draft'`
  - `decision`: `TEXT` (START / MOVE / RECONSIDER / etc.)
  - `snapshot_json`: `JSONB NOT NULL DEFAULT '{}'::jsonb` (complete analysis snapshot)
  - `created_at`, `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT NOW()`
  - Index: `idx_businesses_user` on `user_id`
- **`reports` Table**:
  - `id`: `SERIAL PRIMARY KEY`
  - `business_id`: `INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE`
  - `user_id`: `INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`
  - `title`: `TEXT NOT NULL`
  - `generated_at`: `TIMESTAMPTZ NOT NULL DEFAULT NOW()`
  - Index: `idx_reports_user` on `user_id`

---

## External Services Called

1. **OpenRouter API** (`https://openrouter.ai/api/v1/chat/completions`):
   - Invoked for AI business advisory (`openRouterAdvisorService.js`), grounded scheme retrieval (`openRouterSchemeService.js`), and qualitative SWOT/opportunity evaluation (`localFeasibilityService.js`).
   - Grounded in context JSON and validated by Zod; falls back to deterministic local templates when offline or unconfigured.
2. **OpenStreetMap Overpass API** (`https://overpass-api.de/api/interpreter`):
   - Invoked in `placesService.js` to scan for real competitors within a 5-10 km radius.
   - Cached in memory for 10 minutes with Haversine distance calculations.
3. **OpenStreetMap Nominatim** (`https://nominatim.openstreetmap.org/`):
   - Invoked in `geocodeService.js` for geocoding and reverse geocoding.
   - Enforces an 8s timeout, 10-minute in-memory cache, and identifying User-Agent (`PRAVIRAK-BusinessAdvisor/1.0`).
4. **PostgreSQL**:
   - Connection pooling via `pg.Pool` for user accounts, saved business analyses, and audit logs.

---

## How to Run Tests

The backend test suite is executed using Node.js's native test runner:

```bash
npm test
```

This runs all `src/**/*.test.js` files, verifying:
- Prompt injection protection, character caps, and number grounding in `advisorService.test.js`.
- Zod schema validation, length constraints, and deterministic fallback generation in `localFeasibilityService.test.js`.
- Haversine coordinate math, Overpass QL clause builders, and API error handling in `placesService.test.js`.
