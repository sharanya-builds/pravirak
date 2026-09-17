import { geocodeAddress, reverseGeocode } from '../services/geocodeService.js';

export async function search(req, res, next) {
  try {
    const q = (req.query.q || '').toString();
    if (!q || q.trim().length < 2) {
      return res.json({ results: [] });
    }
    const results = await geocodeAddress(q);
    res.json({ results });
  } catch (err) {
    res.json({ results: [], error: err.message });
  }
}

export async function reverse(req, res, next) {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ result: null, error: 'lat and lng query params are required' });
    }
    const result = await reverseGeocode(lat, lng);
    res.json({ result });
  } catch (err) {
    res.json({ result: null, error: err.message });
  }
}
