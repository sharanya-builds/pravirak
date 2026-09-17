const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search';
const NOMINATIM_REVERSE_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';

const USER_AGENT = 'PRAVIRAK-BusinessAdvisor/1.0 (contact: support@pravirak.app)';

const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function withTimeout(ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timeoutId) };
}

/**
 * Shared helper: maps a raw Nominatim item (search or reverse) to the
 * standard result shape used throughout the app.
 *
 * Fields added for rural/urban distinction:
 *   addressType  – item.addresstype || item.type  (e.g. "village", "city", "suburb")
 *   type         – item.type        (raw OSM type)
 *   category     – item.category    (OSM category, e.g. "place", "highway")
 *   displayAddress – same as address, kept for explicit frontend use
 */
function normaliseItem(item) {
  const addr = item.address || {};

  // Extended city fallback chain — includes hamlet & locality for rural areas
  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.hamlet ||
    addr.municipality ||
    addr.locality ||
    addr.suburb ||
    addr.county ||
    addr.state_district ||
    'Unknown';

  return {
    address: item.display_name,
    displayAddress: item.display_name,
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
    placeId: `osm-${item.place_id}`,
    city,
    state: addr.state || '',
    postalCode: addr.postcode || '',
    // Distinguishes village/rural vs urban on the frontend
    addressType: item.addresstype || item.type || '',
    type: item.type || '',
    category: item.category || '',
    source: 'OPENSTREETMAP'
  };
}

export async function geocodeAddress(query) {
  const q = (query || '').trim();
  if (q.length < 2) return [];

  const cached = cache.get(q.toLowerCase());
  if (cached && cached.expiresAt > Date.now()) {
    return cached.results;
  }

  // limit raised from 6 → 10
  const url = `${NOMINATIM_ENDPOINT}?format=jsonv2&addressdetails=1&limit=10&countrycodes=in&accept-language=en&q=${encodeURIComponent(q)}`;
  const { signal, clear } = withTimeout(8000);

  try {
    const res = await fetch(url, {
      signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': USER_AGENT
      }
    });
    clear();

    if (!res.ok) {
      throw new Error(`Nominatim responded with ${res.status}`);
    }

    const data = await res.json();
    const results = (Array.isArray(data) ? data : []).map(normaliseItem);

    cache.set(q.toLowerCase(), { results, expiresAt: Date.now() + CACHE_TTL_MS });
    return results;
  } catch (err) {
    clear();
    if (err.name === 'AbortError') {
      throw new Error('Location search timed out — please try again.');
    }
    throw new Error(`Could not reach the location search service: ${err.message}`);
  }
}

/**
 * Reverse-geocode a latitude/longitude pair using Nominatim.
 *
 * Returns a single result object in the same shape as geocodeAddress results,
 * or null when Nominatim cannot find an address for the given coordinates.
 *
 * Usage example (Express route):
 *   // NOTE: wire up this route in your router file:
 *   // GET /api/geocode/reverse?lat=12.9716&lng=77.5946
 *   // router.get('/reverse', async (req, res) => {
 *   //   const { lat, lng } = req.query;
 *   //   const result = await reverseGeocode(parseFloat(lat), parseFloat(lng));
 *   //   res.json(result ? [result] : []);
 *   // });
 */
export async function reverseGeocode(lat, lng) {
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
    throw new Error('reverseGeocode requires valid numeric lat and lng values.');
  }

  const url = `${NOMINATIM_REVERSE_ENDPOINT}?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=18&addressdetails=1`;
  const { signal, clear } = withTimeout(8000);

  try {
    const res = await fetch(url, {
      signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': USER_AGENT
      }
    });
    clear();

    if (res.status === 404) {
      // Nominatim returns 404 when no result is found for the coordinates
      return null;
    }

    if (!res.ok) {
      throw new Error(`Nominatim reverse responded with ${res.status}`);
    }

    const data = await res.json();

    // Reverse endpoint returns a single object (not an array)
    if (!data || !data.place_id) {
      return null;
    }

    return normaliseItem(data);
  } catch (err) {
    clear();
    if (err.name === 'AbortError') {
      throw new Error('Reverse geocode timed out — please try again.');
    }
    throw new Error(`Could not reach the reverse geocode service: ${err.message}`);
  }
}
