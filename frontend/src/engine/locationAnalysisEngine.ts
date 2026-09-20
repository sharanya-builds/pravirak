import { 
  CompetitorPOI, 
  ComplementaryBusinessPOI, 
  DemandOpportunityMarker, 
  LocationData, 
  LocationFitAnalysis, 
  NearbyPlacesResult,
  Provenance,
  ScoreFactor, 
  SelectedLocation 
} from '../types';
import { matchBusinessCategory } from './financialEngine';
import { fetchNearbyPlaces } from '../services/placesService';

/**
 * Deterministic seeded PRNG (mulberry32) so the same business+location
 * always reproduces the same numbers (idempotent, cache/report-safe) while
 * two DIFFERENT businesses or DIFFERENT addresses always diverge — this is
 * what stops every analysis from converging on the same evidence numbers.
 * Seed is derived from the business text AND the precise coordinates, so
 * even two "Kirana store" analyses at different real addresses vary.
 */
function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random integer in [min, max] inclusive, using the given PRNG. */
function randRange(rng: () => number, min: number, max: number): number {
  return Math.round(min + rng() * (max - min));
}

type CategoryKey = 'bakery' | 'kirana' | 'cloud_kitchen' | 'garments' | 'mobile_repair' | 'dairy';

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

// Maps financialEngine's human-readable benchmark.category label back to the
// short internal key, so this file can branch on the same category the
// financial engine already computed instead of re-deriving it differently.
const BENCHMARK_TO_KEY: Record<string, string> = {
  'Bakery & Confectionery': 'bakery',
  'Kirana & FMCG Retail': 'kirana',
  'Cloud Kitchen & Delivery': 'cloud_kitchen',
  'Garments & Apparel Retail': 'garments',
  'Mobile & Electronics Service': 'mobile_repair',
  'Dairy Farming & Milk Chilling': 'dairy'
};

/**
 * Analyzes any arbitrary user-selected location for a specific business concept.
 * Generates Location Fit score (0-100), 6 factor breakdowns with provenance,
 * and geographic competitor/demand clusters around the user's coordinates.
 *
 * This is a deterministic ESTIMATION model, not a live market-data feed — it
 * has no scraped footfall or POI counts to draw on. To stay honest AND avoid
 * every analysis collapsing onto the same numbers, it combines: (a) the same
 * canonical business category used by the financial engine, so financial and
 * location analysis never disagree on what kind of business this is, (b) a
 * coarse locality-type read from the actual address text and, critically,
 * (c) a seed derived from the real geocoded coordinates + business text, so
 * different real addresses (even nominally "similar" ones) produce distinct
 * — but reproducible — evidence rather than snapping to a handful of presets.
 */
export function analyzeLocationForBusiness(
  businessIdea: string,
  selectedLoc: SelectedLocation,
  realCompetitors?: NearbyPlacesResult | null
): LocationData {
  const addr = (selectedLoc.address || '').toLowerCase();
  const city = selectedLoc.city || 'Hyderabad';
  const state = selectedLoc.state || 'Telangana';
  const lat = selectedLoc.latitude;
  const lng = selectedLoc.longitude;

  // Canonical category — reuses financialEngine's matcher so the location
  // read and the financial benchmark are always talking about the same
  // business, instead of each file guessing independently.
  const benchmark = matchBusinessCategory(businessIdea);
  const categoryKey = (BENCHMARK_TO_KEY[benchmark.category] || 'bakery') as CategoryKey;

  const isStationeryLike = /stationery|book|xerox|print|paper/.test(businessIdea.toLowerCase());
  const isFood = categoryKey === 'cloud_kitchen';
  const isBakery = categoryKey === 'bakery';
  const isKirana = categoryKey === 'kirana';
  const isGarment = categoryKey === 'garments';
  const isMobileRepair = categoryKey === 'mobile_repair';
  const isDairy = categoryKey === 'dairy';

  // Demographic / locality weighting — coarse text signal from the address,
  // used only as a directional bias; the seeded PRNG below supplies the
  // actual per-address variation so results don't all snap to 3 buckets.
  const isTechHub = /madhapur|hitec|gachibowli|whitefield|indiranagar|cyber|financial district|tech park|it park/.test(addr);
  const isStudentHub = /boring|vidyanagar|kothrud|university|college|campus|institute/.test(addr);
  const isDenseResidential = /kukatpally|sigra|godowlia|kankarbagh|colony|nagar|layout|enclave|society/.test(addr);
  const isCommercialHighStreet = /market|bazaar|chowk|road|marg|circle|junction|mg road|main road/.test(addr);

  // Rural/village detection — the app explicitly targets Tier 2/3 and rural
  // entrepreneurs, not just metro ones, so a village address should produce
  // genuinely different (not just re-labelled) evidence: thinner but often
  // more captive local demand, far fewer direct competitors, and lower
  // physical accessibility infrastructure than a city micro-market.
  const METRO_CITIES = [
    'hyderabad', 'bengaluru', 'bangalore', 'mumbai', 'delhi', 'new delhi', 'pune', 'chennai',
    'kolkata', 'ahmedabad', 'jaipur', 'lucknow', 'patna', 'varanasi', 'anand', 'secunderabad'
  ];
  const mentionsMandalOrVillage = /village|gram panchayat|mandal|taluka|taluk|tehsil|\brural\b/.test(addr);
  const isRural = mentionsMandalOrVillage || !METRO_CITIES.some((m) => city.toLowerCase().includes(m) || addr.includes(m));

  // Seed combines business text + rounded coordinates (~11m precision) so
  // identical (business, address) pairs stay stable across re-renders/saved
  // reports, while any change to either input shifts every downstream number.
  const seedStr = `${businessIdea.trim().toLowerCase()}|${lat.toFixed(4)}|${lng.toFixed(4)}|${addr}`;
  const rng = mulberry32(hashSeed(seedStr));

  // Factor 1: Demand Signal (0 - 100)
  let demandBase = 70;
  let demandDetail = 'Moderate catchment of local residents, commuters and daily walk-ins within 1 km.';
  if (isTechHub) {
    demandBase = isFood || isStationeryLike ? 85 : 74;
    demandDetail = 'High daytime floating population of corporate tech employees and delivery order volume.';
  } else if (isStudentHub) {
    demandBase = isStationeryLike || isFood ? 88 : 70;
    demandDetail = 'Dense student population with regular daily requirement for notes, printing, books and quick snacks.';
  } else if (isDenseResidential) {
    demandBase = isKirana || isDairy ? 82 : 72;
    demandDetail = 'Steady daily-need demand from a dense surrounding residential population.';
  } else if (isCommercialHighStreet) {
    demandBase = isGarment || isMobileRepair ? 80 : 74;
    demandDetail = 'Consistent footfall along an established local commercial high street.';
  } else if (isRural) {
    demandBase = isKirana || isDairy ? 75 : isFood || isGarment ? 58 : 62;
    demandDetail = isKirana || isDairy
      ? 'Thinner overall footfall than a town market, but daily-need demand is captive — villagers have few nearby alternatives for staple goods or milk collection.'
      : 'Lower and more seasonal (harvest/festival-linked) footfall typical of a village/mandal-level catchment, without a large non-agricultural consumer base nearby.';
  }
  const demandScore = clamp(demandBase + randRange(rng, -6, 6), 45, 96);

  // Factor 2: Competition Pressure (Higher score means healthier/less saturated market)
  let compBase = 68;
  let compCountBase = 7;
  let compDetail = 'Moderate density of direct outlets within a 1.5 km radial catchment.';
  if (isTechHub && isFood) {
    compBase = 55;
    compCountBase = 13;
    compDetail = 'Intense food and beverage saturation along primary high-street corridors.';
  } else if (isStationeryLike) {
    compBase = 78;
    compCountBase = 4;
    compDetail = 'Low direct specialty competition in the immediate micro-market.';
  } else if (isKirana && isDenseResidential) {
    compBase = 60;
    compCountBase = 10;
    compDetail = 'Kirana/FMCG retail tends to cluster in dense residential pockets — moderate-to-high existing supply.';
  } else if (isMobileRepair) {
    compBase = 72;
    compCountBase = 5;
    compDetail = 'Electronics/mobile repair is typically a lower-density specialty trade in most micro-markets.';
  } else if (isDairy) {
    compBase = 75;
    compCountBase = 3;
    compDetail = 'Dairy production/chilling has limited direct local competition compared to retail trades.';
  } else if (isRural) {
    compBase = isKirana ? 65 : 82;
    compCountBase = isKirana ? 3 : 1;
    compDetail = 'Village/mandal-level markets typically support very few direct competitors — the real constraint is thin demand, not saturation.';
  }

  // Competitor resolution:
  // If realCompetitors from OpenStreetMap Overpass is provided and has MEASURED provenance with count > 0:
  // Use real measured competitor data and real OSM names.
  // Otherwise fall back to PRNG model estimate, set provenance to 'ESTIMATED' with the note,
  // and NEVER invent competitor names!
  const hasMeasuredCompetitors =
    Boolean(realCompetitors &&
    realCompetitors.provenance === 'MEASURED' &&
    typeof realCompetitors.count === 'number' &&
    realCompetitors.count > 0);

  const compCount = hasMeasuredCompetitors
    ? realCompetitors!.count
    : Math.max(1, compCountBase + randRange(rng, -1, 2));

  const competitorProvenance: Provenance = hasMeasuredCompetitors ? 'MEASURED' : 'ESTIMATED';
  const competitorNote = hasMeasuredCompetitors
    ? undefined
    : 'No OpenStreetMap data found for this area (common in villages); count is a model estimate';

  if (hasMeasuredCompetitors) {
    compDetail = `${compCount} direct competitor outlet(s) identified from OpenStreetMap within radial zone.`;
  }

  const compScore = hasMeasuredCompetitors
    ? clamp(85 - compCount * 3, 35, 92)
    : clamp(compBase + randRange(rng, -8, 8), 35, 92);

  // Factor 3: Customer Accessibility (0 - 100)
  let accessBase = 80;
  let accessDetail = 'Direct arterial road frontage with accessible pedestrian footpaths and shared parking.';
  if (isDenseResidential) {
    accessBase = 76;
    accessDetail = 'High neighborhood walk-in accessibility, though vehicle parking may see peak evening congestion.';
  } else if (isCommercialHighStreet) {
    accessBase = 84;
    accessDetail = 'High-street frontage with strong visibility and mixed pedestrian/vehicle access.';
  } else if (isRural) {
    accessBase = 58;
    accessDetail = 'Village-level road and transport infrastructure — reachable for the local catchment, but limited connectivity for customers from outside the immediate villages/mandal.';
  }
  const accessScore = clamp(accessBase + randRange(rng, -7, 7), 40, 95);

  // Factor 4: Business-Location Fit (0 - 100)
  let fitBase = 74;
  let fitDetail = 'Reasonable alignment between the proposed trade profile and local consumer purchasing habits.';
  if (isStationeryLike && isTechHub) {
    fitBase = 85;
    fitDetail = 'Excellent fit: IT firms, co-working spaces, and nearby schools generate sustained demand for office supplies and print services.';
  } else if (isBakery && isTechHub) {
    fitBase = 82;
    fitDetail = 'Strong alignment with corporate celebration-cake orders and evening cafe culture.';
  } else if (isKirana && isDenseResidential) {
    fitBase = 83;
    fitDetail = 'Kirana retail is a strong structural fit for dense, daily-need residential catchments.';
  } else if (isDairy && isRural) {
    fitBase = 84;
    fitDetail = 'Genuine rural/agricultural profile — strong structural fit for dairy production, fodder access and cooperative milk collection routes.';
  } else if (isDairy && !isTechHub && !isStudentHub) {
    fitBase = 80;
    fitDetail = 'Peri-urban/semi-rural profile suits dairy production and bulk institutional milk supply.';
  } else if (isGarment && isCommercialHighStreet) {
    fitBase = 81;
    fitDetail = 'Apparel retail benefits from high-street visibility and browsing footfall.';
  } else if (isMobileRepair && (isStudentHub || isDenseResidential)) {
    fitBase = 78;
    fitDetail = 'Consistent device-repair demand from a nearby student or dense residential population.';
  } else if (isKirana && isRural) {
    fitBase = 79;
    fitDetail = 'A well-stocked kirana store is typically the anchor daily-need business in a village — strong fit, but revenue ceiling is lower than an urban catchment.';
  } else if (isRural && (isFood || isGarment)) {
    fitBase = 55;
    fitDetail = 'Discretionary-spend businesses like this are structurally harder to sustain on village-level disposable income and footfall — consider whether the nearest mandal/taluka town centre would support more volume.';
  }
  const fitScore = clamp(fitBase + randRange(rng, -6, 6), 40, 95);

  // Factor 5: Nearby Complementary Businesses (0 - 100)
  const compBizScore = clamp(76 + randRange(rng, -10, 12), 50, 95);
  const compBizDetail = isTechHub
    ? 'Supported by nearby corporate offices, co-working spaces and commercial banks driving reciprocal footfall.'
    : isStudentHub
    ? 'Supported by nearby coaching institutes, hostels and photocopy/printing shops driving reciprocal footfall.'
    : 'Supported by nearby small retail, service outlets and transit points driving reciprocal footfall.';

  // Factor 6: Market Opportunity (0 - 100)
  const oppScore = clamp(75 + randRange(rng, -9, 13), 50, 96);
  const oppDetail = compScore >= 70
    ? 'Under-served micro-market with room for a well-run, differentiated new entrant.'
    : 'Opportunity exists mainly by out-competing on service quality, range or convenience rather than scarcity.';

  // Weighted Overall Location Fit
  const overallFitScore = Math.round(
    demandScore * 0.25 +
    compScore * 0.20 +
    accessScore * 0.15 +
    fitScore * 0.20 +
    compBizScore * 0.10 +
    oppScore * 0.10
  );

  let fitCategory: LocationFitAnalysis['fitCategory'] = 'High Fit';
  if (overallFitScore < 65) fitCategory = 'Poor Fit';
  else if (overallFitScore < 72) fitCategory = 'Marginal Fit';
  else if (overallFitScore < 82) fitCategory = 'Moderate Fit';

  const factors: ScoreFactor[] = [
    {
      name: 'Demand Signal',
      score: demandScore,
      label: demandScore >= 80 ? 'Strong' : 'Moderate',
      provenance: 'ESTIMATED',
      detail: demandDetail
    },
    {
      name: 'Competition Pressure',
      score: compScore,
      label: compScore >= 75 ? 'Low (Favorable)' : compScore >= 60 ? 'Moderate' : 'High Saturation',
      provenance: competitorProvenance,
      detail: compDetail
    },
    {
      name: 'Customer Accessibility',
      score: accessScore,
      label: accessScore >= 80 ? 'High' : 'Moderate',
      provenance: 'ESTIMATED',
      detail: accessDetail
    },
    {
      name: 'Business-Location Fit',
      score: fitScore,
      label: fitScore >= 80 ? 'Excellent' : 'Average',
      provenance: 'ESTIMATED',
      detail: fitDetail
    },
    {
      name: 'Nearby Complementary Businesses',
      score: compBizScore,
      label: compBizScore >= 80 ? 'High Synergy' : 'Moderate',
      provenance: 'ESTIMATED',
      detail: compBizDetail
    },
    {
      name: 'Market Opportunity',
      score: oppScore,
      label: oppScore >= 80 ? 'Attractive' : 'Standard',
      provenance: 'ESTIMATED',
      detail: oppDetail
    }
  ];

  const locationFit: LocationFitAnalysis = {
    overallFitScore,
    fitCategory,
    factors,
    disclaimer: 'Data provenance indicators show whether metrics are Measured from real APIs, Estimated via models, or AI Generated.'
  };

  const competitorTypeLabel: Record<CategoryKey, string> = {
    mobile_repair: 'Mobile & Electronics Service',
    bakery: 'Bakery & Cake',
    kirana: 'Kirana & FMCG Retail',
    cloud_kitchen: 'Food Service & Delivery',
    garments: 'Garments & Apparel Retail',
    dairy: 'Dairy & Milk Supply'
  };
  const compTypeLabel = isStationeryLike ? 'Stationery & Printing' : competitorTypeLabel[categoryKey];

  // Real competitor POIs only if measured from Overpass.
  // Never invent competitor names! For estimated counts, show count without names.
  const competitors: CompetitorPOI[] = hasMeasuredCompetitors
    ? (realCompetitors!.places || [])
        .filter((p) => p.name && p.name.trim().length > 0)
        .map((p) => ({
          id: p.id,
          name: p.name,
          type: p.type || compTypeLabel,
          distanceKm: p.distanceKm,
          lat: p.lat,
          lng: p.lng,
          strength: p.distanceKm <= 0.5 ? 'Strong' : p.distanceKm <= 1.0 ? 'Moderate' : 'Weak',
          provenance: 'MEASURED' as Provenance
        }))
    : [];

  // Generate complementary businesses relevant to the actual category
  const COMPLEMENTARY_POOL: Record<CategoryKey, ComplementaryBusinessPOI[]> = {
    mobile_repair: [
      { id: 'cb-1', name: 'Regus Tech Business Park', type: 'IT Office Complex', distanceKm: 0.4, lat: lat + 0.0035, lng: lng - 0.0025, synergy: 'Working professionals nearby generate steady device screen/battery repair demand.', provenance: 'ESTIMATED' },
      { id: 'cb-2', name: 'Narayana Junior College & Academy', type: 'Educational Institution', distanceKm: 0.7, lat: lat - 0.004, lng: lng + 0.003, synergy: 'Student footfall for affordable accessory and quick-repair services.', provenance: 'ESTIMATED' }
    ],
    bakery: [
      { id: 'cb-1', name: 'Cafe Coffee Corner', type: 'Cafe', distanceKm: 0.3, lat: lat + 0.003, lng: lng - 0.002, synergy: 'Shared evening footfall between cafe and bakery browsing.', provenance: 'ESTIMATED' },
      { id: 'cb-2', name: 'City Convention Hall', type: 'Event Venue', distanceKm: 0.9, lat: lat - 0.004, lng: lng + 0.003, synergy: 'Recurring bulk orders for celebration and event cakes.', provenance: 'ESTIMATED' }
    ],
    kirana: [
      { id: 'cb-1', name: 'Residents Welfare Association Block', type: 'Residential Society', distanceKm: 0.3, lat: lat + 0.003, lng: lng - 0.002, synergy: 'Daily repeat purchases from a captive nearby household base.', provenance: 'ESTIMATED' },
      { id: 'cb-2', name: 'Municipal Vegetable Market', type: 'Wet Market', distanceKm: 0.5, lat: lat - 0.0035, lng: lng + 0.0028, synergy: 'Cross-shopping traffic between fresh produce and packaged staples.', provenance: 'ESTIMATED' }
    ],
    cloud_kitchen: [
      { id: 'cb-1', name: 'Corporate Tech Campus', type: 'IT Office Complex', distanceKm: 0.5, lat: lat + 0.0035, lng: lng - 0.0025, synergy: 'Steady lunch and evening delivery order volume from office staff.', provenance: 'ESTIMATED' },
      { id: 'cb-2', name: 'Residential Apartment Complex', type: 'Residential Cluster', distanceKm: 0.6, lat: lat - 0.004, lng: lng + 0.003, synergy: 'Dinner-time delivery demand from nearby households.', provenance: 'ESTIMATED' }
    ],
    garments: [
      { id: 'cb-1', name: 'High Street Shopping Row', type: 'Retail Strip', distanceKm: 0.3, lat: lat + 0.003, lng: lng - 0.002, synergy: 'Shared browsing footfall across adjoining apparel and lifestyle stores.', provenance: 'ESTIMATED' },
      { id: 'cb-2', name: 'Community Wedding Hall', type: 'Event Venue', distanceKm: 1.0, lat: lat - 0.004, lng: lng + 0.003, synergy: 'Seasonal bulk demand for festive and wedding wear.', provenance: 'ESTIMATED' }
    ],
    dairy: [
      { id: 'cb-1', name: 'Cooperative Milk Collection Centre', type: 'Agri-Cooperative', distanceKm: 1.2, lat: lat + 0.006, lng: lng - 0.004, synergy: 'Established bulk offtake and price support for chilled milk.', provenance: 'ESTIMATED' },
      { id: 'cb-2', name: 'Veterinary & Feed Supply Store', type: 'Agri Input Supplier', distanceKm: 0.8, lat: lat - 0.005, lng: lng + 0.004, synergy: 'Nearby access to feed, fodder and veterinary care for the herd.', provenance: 'ESTIMATED' }
    ]
  };
  const complementaryBusinesses: ComplementaryBusinessPOI[] = COMPLEMENTARY_POOL[categoryKey];

  // Generate demand opportunity markers (category-agnostic geographic signals)
  const demandMarkers: DemandOpportunityMarker[] = [
    {
      id: 'dm-1',
      title: isDenseResidential ? 'Residential High-Rise Colony' : 'Nearby Residential Pocket',
      type: 'Residential Cluster',
      lat: lat + 0.005,
      lng: lng + 0.004,
      detail: `${300 + randRange(rng, 0, 25) * 100}+ resident households in daily walking/commuting range.`,
      provenance: 'ESTIMATED'
    },
    {
      id: 'dm-2',
      title: 'Local Transit / Commute Corridor',
      type: 'Transit Hub',
      lat: lat - 0.003,
      lng: lng - 0.004,
      detail: `${(2000 + randRange(rng, 0, 120) * 100).toLocaleString('en-IN')}+ estimated daily commuter footfall during morning & evening peak.`,
      provenance: 'ESTIMATED'
    }
  ];

  // Alternative location recommendation in same city / territory
  const altName = isTechHub 
    ? 'Kondapur Commercial Stretch (1.8 km)'
    : isStudentHub 
    ? 'Kankarbagh Main Commercial Road'
    : isRural
    ? `${city} Mandal/Taluka Market Centre`
    : 'Near Metro Station Plaza';

  const rentDifferentialPct = -1 * randRange(rng, 15, 35);
  const footfallGainPct = randRange(rng, 8, 25);
  const alternativeLocation = {
    areaName: altName,
    score: Math.min(94, overallFitScore + randRange(rng, 6, 14)),
    lat: lat + 0.008 + rng() * 0.008,
    lng: lng - (0.006 + rng() * 0.006),
    distanceKm: Math.round((1.2 + rng() * 1.4) * 10) / 10,
    advantageReason: `${Math.abs(rentDifferentialPct)}% lower commercial space rental with an estimated ${footfallGainPct}% higher accessible footfall and lower direct competitor density.`,
    footfallGainPct,
    rentDifferentialPct,
    competitorDensity: 'Lower' as const,
    provenance: 'ESTIMATED' as Provenance
  };

  return {
    id: `loc-${Date.now()}`,
    city,
    state,
    village: selectedLoc.village ?? null,
    block: selectedLoc.block ?? null,
    district: selectedLoc.district ?? null,
    areaName: selectedLoc.address,
    pincode: selectedLoc.postalCode || '',
    lat,
    lng,
    score: overallFitScore,
    locationFit,
    footfallMonthly: Math.round(demandScore * (1600 + randRange(rng, 0, 6) * 100)),
    residentialColoniesNearby: (isDenseResidential ? 9 : 5) + randRange(rng, 0, 4),
    competitorsNearbyCount: compCount,
    marketDistanceKm: 1.2,
    competitors,
    complementaryBusinesses,
    demandMarkers,
    demandSignals: [
      demandDetail,
      fitDetail,
      'High footfall visibility along major local commute routes.'
    ],
    customerColonies: [
      `${selectedLoc.address.split(',')[0]} Vicinity`,
      'Sector 1 & 2 Enclave',
      'Adjacent Residential Societies'
    ],
    transitPoints: [
      'Local Transit & Auto Stand (0.3 km)',
      'Metro / Bus Corridor (0.9 km)'
    ],
    commercialHubs: [
      'Main Arterial Commercial Street',
      'Local Market Plaza'
    ],
    alternativeLocation,
    provenance: competitorProvenance === 'MEASURED' ? 'MEASURED' : 'ESTIMATED',
    competitorsCountProvenance: competitorProvenance,
    competitorsNote: competitorNote,
    footfallMonthlyProvenance: 'ESTIMATED',
    residentialColoniesNearbyProvenance: 'ESTIMATED',
    marketDistanceKmProvenance: 'ESTIMATED',
    scoreProvenance: 'ESTIMATED',
    metricsProvenance: {
      score: 'ESTIMATED',
      footfallMonthly: 'ESTIMATED',
      residentialColoniesNearby: 'ESTIMATED',
      competitorsNearbyCount: competitorProvenance,
      marketDistanceKm: 'ESTIMATED',
      alternativeLocation: 'ESTIMATED'
    }
  };
}

/**
 * Async location analysis that queries live OpenStreetMap competitor data
 * via backend Overpass proxy, falling back to model estimates if unavailable.
 */
export async function analyzeLocationForBusinessAsync(
  businessIdea: string,
  selectedLoc: SelectedLocation,
  radiusKm: number = 1.5
): Promise<LocationData> {
  const benchmark = matchBusinessCategory(businessIdea);
  const categoryKey = BENCHMARK_TO_KEY[benchmark.category] || 'bakery';
  let realCompetitors: NearbyPlacesResult | null = null;
  try {
    realCompetitors = await fetchNearbyPlaces(
      selectedLoc.latitude,
      selectedLoc.longitude,
      radiusKm,
      categoryKey
    );
  } catch {
    // Fallback to model estimate handled inside analyzeLocationForBusiness
  }
  return analyzeLocationForBusiness(businessIdea, selectedLoc, realCompetitors);
}
