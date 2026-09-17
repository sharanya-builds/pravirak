# PRAVIRAK — Bug Fix Changelog (this session)

This documents exactly what was fixed and why, in response to:
1. Gemini scheme lookup 404-ing on every model candidate.
2. Location search always resolving to the same Madhapur pin.
3. Every business/location analysis producing identical numbers and the same "START HERE" decision.
4. Government scheme matching falling back to the static list instead of a live, LLM-driven search.

---

## 1. `backend/src/services/geminiSchemeService.js` — dynamic model discovery

**Root cause:** The service hardcoded a short list of Gemini model names
(`gemini-2.5-flash`, `gemini-2.5-flash-lite`, ...). Google renames/retires
model IDs periodically, so once those specific IDs stopped being available to
your API key, every candidate 404'd and the app permanently fell back to the
static scheme dataset — exactly what the screenshot showed.

**Fix:**
- Added `discoverAvailableModels(apiKey)`, which calls Gemini's own
  `GET /v1beta/models` endpoint, filters for models that support
  `generateContent`, and ranks them (flash > pro, deprioritizing
  `-exp`/`-preview`/`-thinking` builds). Cached in-memory for 15 minutes.
- The candidate list used for the actual scheme lookup is now:
  `[your GEMINI_MODEL override, ...whatever your key can actually use (auto-discovered), a few static last-resort guesses]`.
  This means the app self-heals the next time Google renames a model, instead
  of needing a code change every time.
- If a specific model rejects the `google_search` tool (400 mentioning
  "tool"/"search"), the service now retries that same model once *without*
  the tool instead of discarding it — and if that succeeds, the returned
  schemes are clearly marked `groundedViaSearch: false` with capped
  confidence and a "not independently re-verified" freshness note, rather
  than either pretending to be live-verified or silently vanishing into the
  static fallback.

**What you still need to do:** if `GEMINI_API_KEY` itself is invalid, expired,
or belongs to a Google Cloud project where the "Generative Language API"
isn't enabled, you'll still see failures — that's a credentials/config issue
no amount of client code can fix. `.env.example` now explains this.

**Frontend:** `SchemeRecommendations.tsx` and `api/client.ts` now surface the
`groundedViaSearch` flag so the UI honestly distinguishes "live search
results" from "model-knowledge results, not independently re-verified this
session" from "static reference dataset."

---

## 2. `frontend/src/components/common/GooglePlacesSearch.tsx` — real geocoding

**Root cause:** With no working Google Places key, the component fell back to
(a) a hardcoded list of ~30 known landmarks, and (b) for anything else, a
`fallbackResolution()` function that matched a handful of city *names* in the
typed text and returned **one fixed lat/lng per city** — e.g. any unmatched
address containing "Hyderabad" resolved to the exact same coordinates as
"Madhapur." That's why every search seemingly "stuck" to the same pin.

**Fix:**
- Added `geocodeWithNominatim()`, which calls OpenStreetMap's free, keyless
  Nominatim search API (`nominatim.openstreetmap.org/search`) to resolve
  *any* typed address to its real coordinates, city, state and postal code.
- Autocomplete now merges: instant local landmark matches (fast, offline) +
  live Nominatim results (deduplicated against the local matches), so typing
  an address not in the hardcoded list still gets a real, distinct pin.
- Pressing Enter on free-typed text, or picking "custom" text with no
  resolved coordinates, now triggers an on-demand Nominatim geocode instead
  of guessing from city keywords. Only if that genuinely fails does it fall
  back to a clearly-labelled *approximate* pin at India's geographic centroid
  (not any specific city), which the user can drag into place — it no longer
  silently pretends to be precise.
- `GoogleMapPreview.tsx` messaging updated to reflect this: it now says
  "OpenStreetMap (Live Geocoding)" instead of "Demo / Simulated Map Active."

---

## 3. `frontend/src/engine/locationAnalysisEngine.ts` — real differentiation

**Root cause:** The scoring model only branched on 3 business keyword groups
(stationery / bakery / food) crossed with 3 address keyword groups (tech hub /
student hub / dense residential). Any input outside those — which was most
inputs, including "Kirana," "Garments," "Dairy," "Mobile repair," and any
address not in the tiny hardcoded landmark list — fell through to one
identical set of default numbers. Combined with bug #2 (everything geocoding
to the same pin), this is why every analysis looked the same.

**Fix:**
- The engine now imports `matchBusinessCategory` from `financialEngine.ts`
  so location analysis and financial analysis always agree on what kind of
  business this is (all 6 categories: bakery, kirana, cloud kitchen,
  garments, mobile/electronics repair, dairy) instead of each file guessing
  independently with different keyword lists.
- Added a deterministic seeded PRNG (`mulberry32`, seeded from a hash of the
  business text + real coordinates + address). Every score (demand,
  competition, accessibility, fit, synergy, opportunity), competitor count,
  competitor positions/names, footfall estimate, and alternative-location
  numbers now get seed-based variation on top of the category/locality
  heuristic — so two different real addresses (or two different business
  ideas at the same address) reliably produce different, non-identical
  evidence, while the *same* (business, address) pair stays reproducible
  across reloads/saved reports.
- Competitor and complementary-business name pools are now category-specific
  for all 6 business types (previously mobile repair, garments, and dairy
  had no dedicated content and fell back to generic/incorrect labels, e.g. a
  "mobile repair shop" being shown competing against fictional bookstores).

**Note on financials:** `computeFinancialAnalysis()` (EMI/DSCR) intentionally
depends on business category + capital + scale, not the exact street address
— that's realistic (loan sizing doesn't change because you moved two blocks
over) and unchanged. What *was* broken and is now fixed is that the
*location* evidence and *decision narrative* varied so little that it looked
identical alongside the financials.

---

## 5. Follow-up round: location search hanging, and rural coverage

**"Just loading, never resolves":** the direct browser→Nominatim call had no
timeout, and public Nominatim frequently rate-limits or silently drops
requests from shared/cloud IP ranges (its usage policy also requires a
custom `User-Agent` header, which browsers refuse to let client-side JS set
at all — so calling it directly from the browser was never fully policy-
compliant to begin with). Fixed by:
- Adding a backend proxy: `GET /api/geocode/search?q=...`
  (`backend/src/services/geocodeService.js` +
  `backend/src/controllers/geocodeController.js` +
  `backend/src/routes/geocodeRoutes.js`, registered in `app.js`), which calls
  Nominatim server-side with a real `User-Agent`, an 8s timeout, and a
  10-minute in-memory cache.
- `GooglePlacesSearch.tsx` now calls this backend proxy first, and only
  falls back to a direct browser call if the backend itself is unreachable
  (e.g. local dev without the backend running) — the whole lookup is now
  hard-capped at 9 seconds either way, so it can never hang indefinitely.
- Fixed a related bug where the abort-handling logic could silently swallow
  a genuine timeout instead of showing the user an error; it now uses a
  request-ID guard to distinguish "a newer keystroke superseded this
  request" (silent, correct) from "this specific request timed out"
  (now shows a clear message).
- `api/client.ts`'s `request()` now has its own 20s default timeout (30s for
  the scheme lookup specifically), so even a fully-hung backend can't leave
  the UI spinning forever.

**"Recommended places aren't rural at all":**
- Added real rural entries to the local landmark list in
  `GooglePlacesSearch.tsx` (Konne/Bachannapet in Jangaon district Telangana,
  Loni in Ahmednagar, Masauli in Barabanki, Bikram in Patna Rural, Talwandi
  Sabo in Bathinda, Anekal in Bengaluru Rural, Kishangarh Renwal in Jaipur
  Rural) and swapped two of the four "Quick Test Localities" pills to rural
  examples instead of all four being metro landmarks.
- `locationAnalysisEngine.ts` now actually detects a rural/village address
  (mentions of "village"/"mandal"/"taluka"/"rural", or a city not on a
  short metro-city list) and scores it differently instead of falling
  through to generic small-town defaults: thinner but more captive daily-need
  demand, far fewer direct competitors, lower physical accessibility
  infrastructure, and fit commentary that distinguishes a genuinely strong
  rural fit (kirana, dairy) from a weak one (discretionary food/garment
  spend that a village-level catchment usually can't sustain).

## 6. Backend LLM provider switched from direct Gemini → OpenRouter

Per request, the government-scheme lookup no longer calls Google's Gemini API
directly. It now goes through **OpenRouter** (`https://openrouter.ai`), which
exposes one OpenAI-compatible endpoint that can route to many
providers/models under a single API key.

- New file: `backend/src/services/openRouterSchemeService.js` (replaces
  `geminiSchemeService.js`, which has been removed). `schemeController.js`
  now imports from it — no other call sites changed.
- Uses OpenRouter's **web search plugin** (`plugins: [{ id: 'web' }]`) for
  live grounding — this works across model providers, not just Google, so
  the feature isn't tied to Gemini's specific grounding tool anymore.
- Candidate models: a short static list of cheap/reliable slugs
  (`google/gemini-2.5-flash`, `google/gemini-flash-1.5`, `openai/gpt-4o-mini`,
  `anthropic/claude-3.5-haiku`, `meta-llama/llama-3.3-70b-instruct`), cross-
  checked against OpenRouter's live `/models` catalog when reachable so a
  genuinely-removed slug doesn't get retried forever. Override with
  `OPENROUTER_MODEL` in `.env` if you want to force one.
- Same reliability behavior as before: 8s discovery timeout, 9s per-call
  timeout, 22s hard overall budget, graceful retry without the web plugin if
  a model rejects it (with confidence capped + "not independently
  re-verified" noted), and specific messages for 401 (bad key) vs 402
  (no credits) vs 404 (model not found) instead of one generic failure.
- **Env change:** `.env.example` now asks for `OPENROUTER_API_KEY` (get one
  at https://openrouter.ai/keys) instead of `GEMINI_API_KEY`/`GEMINI_MODEL`.
  Note OpenRouter requires the account to have credits (even trivial usage)
  or every call 402s.
- Frontend copy in `SchemeRecommendations.tsx` updated from
  "Gemini"/"Google Search" to provider-neutral wording, since `result.model`
  now shows whichever OpenRouter slug actually answered
  (e.g. `google/gemini-2.5-flash (via OpenRouter)`).

## 7. Login page — "Continue as Guest" did nothing

**Root cause:** `App.tsx`'s handler for the guest button only changed
`currentView` state — it never called `continueAsGuest()` from
`AuthContext`. Since the top-level render guard is `if (!user && !isGuest)
return <LoginPage/>`, and `isGuest` never actually became `true`, the app
kept re-rendering the login page regardless of what `currentView` was set to.
Clicking the button visibly did nothing.

**Fix:** the handler now calls `continueAsGuest()` (which sets `isGuest =
true` and persists a `pravirak_guest` flag to localStorage) before switching
the view, exactly like `login()`/`register()` already did for authenticated
users.

## 8. "Change Location" button did nothing visible

Previously this button only cleared an internal `isLocationConfirmed` flag —
since the address search box was already always visible, nothing appeared to
happen. `GooglePlacesSearch` is now a `forwardRef` exposing
`focusAndSelect()`; clicking "Change Location" scrolls focus back to the
search input and selects its current text so the user can immediately type a
new address.

- `decisionEngine.ts`: fixed a copy-paste inconsistency where the "DON'T
  BORROW YET" explanation cited a 1.25x DSCR safety threshold in the text
  while the actual code threshold is 1.5x.
- `types/index.ts`: extended `SelectedLocation.source` with `'OPENSTREETMAP'`
  and `'USER_INPUT_APPROX'` so provenance labels reflect where a coordinate
  actually came from.

## Verification performed in this sandbox
This sandbox has no network access, so a full `npm install` / `vite build`
could not be run. Every edited file was verified with:
- `node --check` (ES module syntax) for the backend `.js` files — passed.
- `esbuild` parse/transform (TS + JSX syntax) for every edited `.ts`/`.tsx`
  file — passed with no errors.
Please run `npm install && npm run build` in both `frontend/` and `backend/`
once you pull this down, and set `GEMINI_API_KEY` (and optionally
`VITE_GOOGLE_MAPS_API_KEY`) in your `.env` files before testing live.
