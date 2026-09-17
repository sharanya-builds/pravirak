# PRAVIRAK

AI-assisted business decision platform for entrepreneurs in India — "Ideas to Livelihoods."

PRAVIRAK helps a first-time or existing entrepreneur decide, with evidence rather than
guesswork, whether a specific business idea in a specific location is worth pursuing:
local market demand, competition, location fit, financial feasibility (capex, EMI, DSCR),
stress-tested repayment safety, matched government schemes, and required licenses —
all synthesized into one deterministic START / MOVE / RECONSIDER decision.

## Project structure

```text
pravirak/
├── frontend/        # React + Vite + TypeScript single-page app
│   ├── src/
│   │   ├── api/            # Backend API client
│   │   ├── context/        # Auth context (session state)
│   │   ├── hooks/           # useBusinessStore (backend for logged-in users, local for guests)
│   │   ├── components/
│   │   │   ├── auth/        # Login / Create account page
│   │   │   ├── shell/        # AppShell: top nav, mobile drawer, Explore Hub
│   │   │   ├── common/        # Shared UI primitives (cards, buttons, map, etc.)
│   │   │   └── modules/        # Home, My Businesses, Reports, New Analysis flow,
│   │   │                        # Decision Dashboard, Final Business Plan, Existing
│   │   │                        # Business flow, and Explore Hub's 9 explorer pages
│   │   ├── engine/            # Deterministic finance / location / decision engines
│   │   ├── data/                # Reference data (schemes, compliances, translations)
│   │   ├── types/                # Shared TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── backend/          # Node.js + Express + SQLite API (auth, saved businesses, reports)
│   ├── src/
│   └── package.json
│
└── README.md
```

## Architecture

This is a real two-tier application:

- **Frontend** — all business, financial and location computation is deterministic
  TypeScript running client-side (`frontend/src/engine`). No AI is used for numbers;
  AI is only used to retrieve and explain — see below.
- **Backend** — owns accounts and cross-device persistence: authentication (JWT +
  bcrypt), "My Businesses" (saved analyses), and generated Reports, stored in
  PostgreSQL. It also proxies AI-grounded government scheme lookups (Gemini +
  Google Search grounding) so the API key never reaches the browser.

### Evidence-grounded AI advisory model

PRAVIRAK splits "what the numbers say" from "what's currently available" on purpose:

- **Deterministic engines** (`frontend/src/engine`) own every number: capex, EMI,
  DSCR, break-even, stress testing, and the START/MOVE/RECONSIDER decision itself.
  These never call an LLM and always produce the same output for the same input.
- **Gemini, grounded in live Google Search** (`backend/src/services/geminiSchemeService.js`)
  is used only for one job: given the user's business idea, capital and location,
  search official government sources for *currently* relevant schemes and explain
  them in plain language. It is explicitly instructed never to invent a scheme,
  rule, or figure — every result must carry a source URL, a freshness signal, and
  a confidence rating, or it's discarded. If grounding is unavailable (no API key,
  network failure, or an unparseable response), the app falls back to a static,
  human-curated scheme dataset rather than ever showing unverified information.

See `backend/README.md` for the full API and prompt contract.

Guests (no account) can still use the full product — their saved businesses are kept
in the browser's local storage instead of the backend, so nothing is lost on refresh
but it stays on that device only. Logging in migrates the experience to
account-backed, cross-device storage.

