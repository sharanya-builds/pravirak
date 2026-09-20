# PRAVIRAK Frontend Client

Interactive single-page web client for the PRAVIRAK business decision and institutional loan appraisal platform. Built with React 19, TypeScript, Vite, and Tailwind CSS.

*For the complete project overview, PS compliance matrix, and architecture diagram, see the [Root README](../README.md).*

---

## Purpose

The PRAVIRAK frontend delivers a responsive, mobile-first interface designed for rural and first-generation entrepreneurs:
1. **Interactive Analysis & Sizing Flow**: Guides users through business category selection, OpenStreetMap location geocoding (with village/block/district hierarchy), and promoter margin entry with live scheme routing previews.
2. **Pure Deterministic Computation**: Performs all financial modeling, capex sizing, DSCR debt safety evaluation, break-even timelines, and quarterly loan amortization locally in the client without external AI latency or financial hallucinations.
3. **De-duplicated Presentation**: Displays a 360x800 single-screen Decision Summary card, an interactive tabbed analysis view, and an official printable appraisal dossier with Short (summary + loan breakdown) and Full report modes.
4. **Multilingual Access & Speech Input**: Provides full UI translations across English, Hindi, and Telugu, with voice-to-text input resilient to browser offline states.

---

## Folder Structure

```text
frontend/
├── src/
│   ├── api/                    # HTTP client calling backend REST endpoints
│   │   └── client.ts               # Auth, business, report, and geocode APIs
│   ├── components/
│   │   ├── auth/                   # Authentication forms
│   │   │   └── LoginPage.tsx           # Login, account registration, and guest mode
│   │   ├── chat/                   # Interactive AI advisory UI
│   │   │   └── SidePanelChatbot.tsx    # Floating slide-over assistant drawer
│   │   ├── common/                 # Reusable UI elements
│   │   │   ├── DecisionCard.tsx        # Decision headline and badges
│   │   │   ├── EvidenceCard.tsx        # Provenance-aware metric cards
│   │   │   ├── LanguageSelector.tsx    # Language switcher dropdown
│   │   │   ├── PrimaryButton.tsx       # Standard action button
│   │   │   ├── SchemeCard.tsx          # Government scheme card
│   │   │   ├── SchemeLoanBreakdown.tsx # PS loan calculation & schedule table
│   │   │   ├── ThemeToggle.tsx         # Dark / Light theme toggle
│   │   │   └── VoiceInputButton.tsx    # Microphone speech-to-text button
│   │   ├── modules/                # Core application pages & views
│   │   │   ├── DecisionDashboard.tsx   # 5-tab detailed analysis dashboard
│   │   │   ├── ExistingBusinessFlow.tsx# Diagnostic flow for existing shops
│   │   │   ├── FinalBusinessPlan.tsx   # Decision summary & printable dossier
│   │   │   ├── HomeDashboard.tsx       # Main portal dashboard
│   │   │   ├── LandingPage.tsx         # Marketing landing page
│   │   │   ├── LocalFeasibilityReportView.tsx # SWOT and local market insights
│   │   │   ├── MarketMap.tsx           # Leaflet map with 5km/10km catchments
│   │   │   ├── MyBusinesses.tsx        # User saved businesses list
│   │   │   ├── NewBusinessFlow.tsx     # Wizard flow for new business analysis
│   │   │   ├── ReportsPage.tsx         # Saved appraisal reports list
│   │   │   └── explorers/              # Deep-dive explorer detail views
│   │   └── shell/                  # Layout scaffolding
│   │       ├── AppShell.tsx            # Header, navigation, and content container
│   │       └── navigation.ts           # Navigation keys and route items
│   ├── context/                # React global context providers
│   │   ├── AuthContext.tsx         # User session & guest mode state
│   │   ├── LanguageContext.tsx     # Active language and translation dictionary
│   │   └── ThemeContext.tsx        # Dark / Light theme state
│   ├── data/                   # Static reference datasets & localized strings
│   │   ├── compliances.ts          # Statutory MSME compliance & license rules
│   │   ├── presetBusinesses.ts     # Pre-configured sample businesses
│   │   ├── schemes.ts              # Institutional credit schemes (PMEGP, MUDRA, CGTMSE)
│   │   └── translations.ts         # Complete UI strings for EN, HI, and TE
│   ├── engine/                 # Deterministic client-side business logic
│   │   ├── aiAdvisorEngine.ts      # Local deterministic NLP fallback generator
│   │   ├── decisionEngine.ts       # 4-pillar synthesis into START/MOVE/ADJUST
│   │   ├── existingBusinessEngine.ts # Health scoring for existing enterprises
│   │   ├── financialEngine.ts      # Capex, opex, EMI, DSCR, and stress tests
│   │   ├── localFeasibilityEngine.ts # Feasibility caching and normalization
│   │   ├── locationAnalysisEngine.ts # Footfall, competitor density, and score
│   │   ├── locationParser.ts       # Administrative hierarchy extraction
│   │   ├── psCalculator.ts         # Problem statement loan sizing & amortization
│   │   └── schemeReconciliation.ts # Margin adequacy and shortfall resolution
│   ├── hooks/                  # Custom React hooks
│   │   ├── useBusinessStore.ts     # Syncs saved analyses (Backend API vs LocalStorage)
│   │   └── useSpeechRecognition.ts # Web Speech API voice transcription hook
│   ├── services/               # Upstream API client wrappers
│   │   ├── localFeasibilityService.ts # Local feasibility report caller
│   │   └── placesService.ts        # Overpass places API caller
│   ├── types/                  # Shared TypeScript interfaces
│   │   └── index.ts                # Domain models, schemes, and metrics
│   ├── App.tsx                 # Root router and view coordinator
│   ├── index.css               # Global Tailwind CSS and accessibility theme overrides
│   └── main.tsx                # React application entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Scripts

- `npm run dev`: Starts the Vite local development server with Hot Module Replacement (default: `http://localhost:5173`).
- `npm run build`: Type-checks with `tsc -b` and builds minified production assets into `dist/`.
- `npm run lint`: Runs `oxlint` across the codebase for fast static analysis.
- `npm test`: Runs the automated test suite using `vitest run`.
- `npm run preview`: Locally previews the production build in `dist/`.

---

## Environment Variables

Configured in `frontend/.env` (see `frontend/.env.example`):

- `VITE_API_BASE_URL`: URL of the PRAVIRAK backend REST API (e.g. `http://localhost:4000/api` or production URL).
- `VITE_GOOGLE_MAPS_API_KEY`: (Optional) Google Maps API key for address search. When omitted, the app defaults to OpenStreetMap Nominatim and Leaflet.

---

## Setup and Run Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set `VITE_API_BASE_URL` to point to your running backend (defaults to `http://localhost:4000/api`).

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates production HTML, JavaScript, and CSS bundles in `dist/`.

---

## How the Engines are Organised

The [`src/engine/`](src/engine/) directory contains pure, side-effect-free TypeScript mathematical functions. None of these engines call an LLM:

1. **`psCalculator.ts` (Statutory Loan Sizing & Amortization)**:
   - Takes promoter margin capital ($M$).
   - Calculates project cost: $B = M / 0.10$.
   - Calculates maximum loan: $\text{loan} = \min(0.90 \times B, \text{schemeMaxLoan})$.
   - Routes to **Micro Finance Scheme** (cost $\le$ ₹1.40L, max loan ₹1.25L, 6.5% p.a., 3y tenure, 3m moratorium) or **Term Loan Scheme** (cost $\le$ ₹50L, max loan ₹45L, 8.0% p.a., 7y tenure, 6m moratorium).
   - Generates full quarterly amortization schedules with moratorium interest handling.
2. **`schemeReconciliation.ts` (Promoter Capital Reconciliation)**:
   - Evaluates promoter margin ($M$) against estimated project cost ($B$).
   - When $M \ge 0.10 \times B$, marks project as Fully Funded.
   - When $M < 0.10 \times B$, identifies capital shortfall ($\max(0, 0.10 \times B - M)$) and generates three bridge options: Infuse Additional Capital, Scale Down Initial Capex, or Execute in Phased Rollout.
3. **`financialEngine.ts` (Operational Viability & DSCR)**:
   - Computes capital expenditure (capex), monthly revenue projections, operational expenditure (opex), monthly debt service (EMI), Debt Service Coverage Ratio (DSCR), break-even horizon in months, and stress-tested financial scenarios.
4. **`locationAnalysisEngine.ts` (Geospatial Suitability)**:
   - Computes spatial score (0-100), footfall estimation, competitor density per 10k residents, and catchment radius signals.
5. **`locationParser.ts` (Administrative Boundary Parsing)**:
   - Extracts structured village, block/tehsil/mandal, district, and state from OpenStreetMap Nominatim responses.
6. **`decisionEngine.ts` (4-Pillar Synthesis)**:
   - Aggregates scores across Local Demand, Competition, Location Fit, and Financial Feasibility into the final decision: `START HERE`, `MOVE TO ALTERNATIVE`, `CHANGE CATEGORY`, `ADJUST SCALE`, or `VALIDATE FIRST`.
   - Attaches strict data provenance badges (`MEASURED`, `ESTIMATED`, `AI_GENERATED`) and enforces confidence level ceilings.

---

## i18n Approach and How to Add a Language

### Architecture
- **State Management**: [`src/context/LanguageContext.tsx`](src/context/LanguageContext.tsx) exposes the current active language (`'en' | 'hi' | 'te'`), a language switcher (`setLanguage`), and the active translation dictionary (`t`).
- **Dictionary**: [`src/data/translations.ts`](src/data/translations.ts) defines the complete `TranslationStrings` interface and corresponding dictionary objects for:
  - `en` (English)
  - `hi` (Hindi - हिंदी)
  - `te` (Telugu - తెలుగు)

### How to Add a New Language (e.g. Tamil - `ta` or Kannada - `kn`):
1. **Update Types**: In [`src/types/index.ts`](src/types/index.ts), expand the `Language` union type:
   ```typescript
   export type Language = 'en' | 'hi' | 'te' | 'ta';
   ```
2. **Add Dictionary**: In [`src/data/translations.ts`](src/data/translations.ts):
   - Create and export the translation object implementing `TranslationStrings`:
     ```typescript
     export const taTranslations: TranslationStrings = { ... };
     ```
   - Add the dictionary to the `translations` registry map:
     ```typescript
     export const translations: Record<Language, TranslationStrings> = {
       en: enTranslations,
       hi: hiTranslations,
       te: teTranslations,
       ta: taTranslations,
     };
     ```
3. **Update UI Selector**: In [`src/components/common/LanguageSelector.tsx`](src/components/common/LanguageSelector.tsx), add the new option:
   ```typescript
   { code: 'ta', label: 'தமிழ்', shortLabel: 'TA' }
   ```

---

## How to Run Tests

The frontend uses **Vitest** and **React Testing Library** for fast, deterministic unit testing:

```bash
npm test
```

This runs all 13 test suites across engines and components, covering:
- Loan sizing formulas, interest caps, and quarterly schedules in `psCalculator.test.ts`.
- Capital adequacy and shortfall bridge options in `schemeReconciliation.test.ts`.
- Single-home content de-duplication and navigation in `Deduplication.test.tsx`.
- Decision Summary card, print dossier modes, and administrative location parsing in `FinalBusinessPlan.test.tsx`.
- Speech recognition offline detection in `VoiceInputButton.test.tsx`.
- Multi-language dictionary completeness in `translations.test.ts`.
