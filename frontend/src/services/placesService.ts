import { NearbyPlacesResult } from '../types';

/**
 * Client service to query the backend Overpass proxy for real competitor data.
 * Endpoint: GET /api/places/nearby?lat&lng&radiusKm&category
 * 
 * If the API call fails or returns empty, returns an ESTIMATED fallback object with a clear note.
 */
export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  radiusKm: number = 1.5,
  category: string = ''
): Promise<NearbyPlacesResult> {
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:4000/api';
  const url = `${apiBase}/places/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radiusKm=${encodeURIComponent(radiusKm)}&category=${encodeURIComponent(category)}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Places API returned ${res.status}`);
    }

    const data = await res.json();
    return {
      count: typeof data.count === 'number' ? data.count : 0,
      names: Array.isArray(data.names) ? data.names : [],
      places: Array.isArray(data.places) ? data.places : [],
      provenance: data.provenance === 'MEASURED' ? 'MEASURED' : 'ESTIMATED',
      note: data.note ?? null,
      category: data.category ?? category,
      radiusKm: data.radiusKm ?? radiusKm
    };
  } catch (err: any) {
    // Graceful fallback for offline, network failure, or timeouts
    return {
      count: 0,
      names: [],
      places: [],
      provenance: 'ESTIMATED',
      note: 'No OpenStreetMap data found for this area (common in villages); count is a model estimate',
      category,
      radiusKm
    };
  }
}
