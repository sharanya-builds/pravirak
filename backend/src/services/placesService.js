const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';
const USER_AGENT = 'PRAVIRAK-BusinessAdvisor/1.0 (contact: support@pravirak.app)';

const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function withTimeout(ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timeoutId) };
}

/**
 * Calculates straight-line distance in km between two coordinate pairs (Haversine).
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Maps business category to OpenStreetMap tag query clauses for Overpass QL.
 */
export function getCategoryOsmClauses(category) {
  const cat = (category || '').toLowerCase().trim();

  if (/kirana|grocery|fmcg|provision|supermarket/.test(cat)) {
    return `
      node["shop"~"convenience|general|supermarket|grocery"](around:{{radius}},{{lat}},{{lng}});
      way["shop"~"convenience|general|supermarket|grocery"](around:{{radius}},{{lat}},{{lng}});
    `;
  }
  if (/bakery|confectionery|cake|pastry/.test(cat)) {
    return `
      node["shop"~"bakery|confectionery|pastry"](around:{{radius}},{{lat}},{{lng}});
      way["shop"~"bakery|confectionery|pastry"](around:{{radius}},{{lat}},{{lng}});
    `;
  }
  if (/garment|apparel|cloth|textile|boutique|tailor/.test(cat)) {
    return `
      node["shop"~"clothes|tailor|boutique|fabric"](around:{{radius}},{{lat}},{{lng}});
      way["shop"~"clothes|tailor|boutique|fabric"](around:{{radius}},{{lat}},{{lng}});
    `;
  }
  if (/cloud_kitchen|food|restaurant|kitchen|cafe|tiffin|snack/.test(cat)) {
    return `
      node["amenity"~"restaurant|fast_food|cafe"](around:{{radius}},{{lat}},{{lng}});
      way["amenity"~"restaurant|fast_food|cafe"](around:{{radius}},{{lat}},{{lng}});
      node["craft"="caterer"](around:{{radius}},{{lat}},{{lng}});
      way["craft"="caterer"](around:{{radius}},{{lat}},{{lng}});
    `;
  }
  if (/mobile|electronic|repair|phone|computer/.test(cat)) {
    return `
      node["shop"~"mobile_phone|electronics|computer"](around:{{radius}},{{lat}},{{lng}});
      way["shop"~"mobile_phone|electronics|computer"](around:{{radius}},{{lat}},{{lng}});
      node["craft"="electronics_repair"](around:{{radius}},{{lat}},{{lng}});
      way["craft"="electronics_repair"](around:{{radius}},{{lat}},{{lng}});
    `;
  }
  if (/dairy|milk/.test(cat)) {
    return `
      node["shop"="dairy"](around:{{radius}},{{lat}},{{lng}});
      way["shop"="dairy"](around:{{radius}},{{lat}},{{lng}});
      node["craft"="dairy"](around:{{radius}},{{lat}},{{lng}});
      way["craft"="dairy"](around:{{radius}},{{lat}},{{lng}});
      node["amenity"="marketplace"](around:{{radius}},{{lat}},{{lng}});
      way["amenity"="marketplace"](around:{{radius}},{{lat}},{{lng}});
    `;
  }
  if (/stationery|book|print|xerox/.test(cat)) {
    return `
      node["shop"~"stationery|books|copyshop"](around:{{radius}},{{lat}},{{lng}});
      way["shop"~"stationery|books|copyshop"](around:{{radius}},{{lat}},{{lng}});
    `;
  }

  // General commercial / retail fallback
  return `
    node["shop"](around:{{radius}},{{lat}},{{lng}});
    way["shop"](around:{{radius}},{{lat}},{{lng}});
    node["amenity"="marketplace"](around:{{radius}},{{lat}},{{lng}});
    way["amenity"="marketplace"](around:{{radius}},{{lat}},{{lng}});
  `;
}

/**
 * Builds the Overpass QL query string.
 */
export function buildOverpassQuery(lat, lng, radiusMeters, category) {
  const clauses = getCategoryOsmClauses(category)
    .replace(/{{radius}}/g, radiusMeters)
    .replace(/{{lat}}/g, lat)
    .replace(/{{lng}}/g, lng);

  return `[out:json][timeout:10];
(
${clauses}
);
out tags center 50;`;
}

/**
 * Fetch nearby places matching category around (lat, lng) within radiusKm.
 * Max radius: 10 km. Timeout: 10 seconds. In-memory cache: 10 minutes.
 */
export async function getNearbyCompetitors(lat, lng, radiusKm = 1.5, category = '') {
  const numericLat = parseFloat(lat);
  const numericLng = parseFloat(lng);

  if (isNaN(numericLat) || isNaN(numericLng)) {
    throw new Error('Valid numeric lat and lng are required.');
  }

  // Radius clamped up to 10 km
  const clampedRadiusKm = Math.min(Math.max(parseFloat(radiusKm) || 1.5, 0.1), 10);
  const radiusMeters = Math.round(clampedRadiusKm * 1000);
  const normalizedCat = (category || '').trim().toLowerCase();

  const cacheKey = `${numericLat.toFixed(4)}:${numericLng.toFixed(4)}:${radiusMeters}:${normalizedCat}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const query = buildOverpassQuery(numericLat, numericLng, radiusMeters, normalizedCat);
  const { signal, clear } = withTimeout(10000);

  try {
    const res = await fetch(OVERPASS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': USER_AGENT,
        Accept: 'application/json'
      },
      body: `data=${encodeURIComponent(query)}`,
      signal
    });
    clear();

    if (!res.ok) {
      throw new Error(`Overpass API HTTP error ${res.status}`);
    }

    const data = await res.json();
    const elements = Array.isArray(data?.elements) ? data.elements : [];

    if (elements.length === 0) {
      // Return ESTIMATED fallback indicator
      const fallbackResult = {
        count: 0,
        names: [],
        places: [],
        provenance: 'ESTIMATED',
        note: 'No OpenStreetMap data found for this area (common in villages); count is a model estimate',
        category: normalizedCat,
        radiusKm: clampedRadiusKm
      };
      cache.set(cacheKey, { data: fallbackResult, expiresAt: Date.now() + CACHE_TTL_MS });
      return fallbackResult;
    }

    // Process elements from OpenStreetMap
    const seenNames = new Set();
    const names = [];
    const places = [];

    for (const el of elements) {
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      if (elLat == null || elLng == null) continue;

      const rawName = el.tags?.name?.trim();
      if (rawName && !seenNames.has(rawName.toLowerCase())) {
        seenNames.add(rawName.toLowerCase());
        names.push(rawName);
      }

      const distanceKm = calculateDistanceKm(numericLat, numericLng, elLat, elLng);
      const typeLabel = el.tags?.shop || el.tags?.amenity || el.tags?.craft || 'commercial';

      places.push({
        id: `osm-${el.type || 'node'}-${el.id}`,
        name: rawName || '', // Empty if unnamed in OSM — NEVER INVENT NAMES
        type: typeLabel,
        distanceKm,
        lat: elLat,
        lng: elLng,
        provenance: 'MEASURED'
      });
    }

    // Sort closest first
    places.sort((a, b) => a.distanceKm - b.distanceKm);

    const measuredResult = {
      count: elements.length,
      names,
      places: places.filter((p) => p.name), // Named places for POI markers
      allPlacesCount: elements.length,
      provenance: 'MEASURED',
      note: null,
      category: normalizedCat,
      radiusKm: clampedRadiusKm
    };

    cache.set(cacheKey, { data: measuredResult, expiresAt: Date.now() + CACHE_TTL_MS });
    return measuredResult;
  } catch (err) {
    clear();
    // In case of timeout or failure, return fallback with ESTIMATED label
    return {
      count: 0,
      names: [],
      places: [],
      provenance: 'ESTIMATED',
      note: 'No OpenStreetMap data found for this area (common in villages); count is a model estimate',
      category: normalizedCat,
      radiusKm: clampedRadiusKm,
      error: err.message
    };
  }
}
