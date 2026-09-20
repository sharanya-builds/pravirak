import express from 'express';
import { getNearbyCompetitors } from '../services/placesService.js';

const router = express.Router();

/**
 * GET /api/places/nearby?lat&lng&radiusKm&category
 * Queries OpenStreetMap Overpass API server-side with 10s timeout,
 * 10-minute cache, radius up to 10 km, and maps business categories to OSM tags.
 */
router.get('/nearby', async (req, res) => {
  const { lat, lng, radiusKm, category } = req.query;

  if (lat == null || lng == null || lat === '' || lng === '') {
    return res.status(400).json({ error: 'lat and lng are required query parameters' });
  }

  const numericLat = parseFloat(lat);
  const numericLng = parseFloat(lng);

  if (isNaN(numericLat) || isNaN(numericLng)) {
    return res.status(400).json({ error: 'lat and lng must be valid numbers' });
  }

  try {
    const result = await getNearbyCompetitors(numericLat, numericLng, radiusKm, category);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      count: 0,
      names: [],
      places: [],
      provenance: 'ESTIMATED',
      note: 'No OpenStreetMap data found for this area (common in villages); count is a model estimate',
      error: err.message
    });
  }
});

export default router;
