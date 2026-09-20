import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  analyzeLocationForBusiness,
  analyzeLocationForBusinessAsync
} from './locationAnalysisEngine';
import { NearbyPlacesResult, SelectedLocation } from '../types';

describe('locationAnalysisEngine Provenance & Competitor Tests', () => {
  const sampleLocation: SelectedLocation = {
    address: 'Near Clock Tower, Jangaon, Telangana',
    city: 'Jangaon',
    state: 'Telangana',
    latitude: 17.7266,
    longitude: 79.1578,
    source: 'USER_INPUT'
  };

  describe('analyzeLocationForBusiness (synchronous / pure)', () => {
    it('defaults all metrics to ESTIMATED and NEVER invents competitor names when realCompetitors is absent', () => {
      const result = analyzeLocationForBusiness('Kirana General Store', sampleLocation);

      // Provenance checks
      expect(result.competitorsCountProvenance).toBe('ESTIMATED');
      expect(result.footfallMonthlyProvenance).toBe('ESTIMATED');
      expect(result.residentialColoniesNearbyProvenance).toBe('ESTIMATED');
      expect(result.metricsProvenance).toEqual({
        score: 'ESTIMATED',
        footfallMonthly: 'ESTIMATED',
        residentialColoniesNearby: 'ESTIMATED',
        competitorsNearbyCount: 'ESTIMATED',
        marketDistanceKm: 'ESTIMATED',
        alternativeLocation: 'ESTIMATED'
      });

      // Factors provenance
      expect(result.locationFit?.factors.length).toBeGreaterThan(0);
      result.locationFit?.factors.forEach((f) => {
        expect(f.provenance).toBe('ESTIMATED');
      });

      // No fake competitor names!
      expect(result.competitors).toEqual([]);
      expect(result.competitorsNearbyCount).toBeGreaterThan(0);
      expect(result.competitorsNote).toBe(
        'No OpenStreetMap data found for this area (common in villages); count is a model estimate'
      );
    });

    it('sets MEASURED provenance and includes real names when realCompetitors has measured OSM data', () => {
      const realData: NearbyPlacesResult = {
        count: 2,
        names: ['Balaji Provisions', 'Laxmi Supermarket'],
        places: [
          { id: '101', name: 'Balaji Provisions', type: 'shop', distanceKm: 0.35, lat: 17.727, lng: 79.158, provenance: 'MEASURED' },
          { id: '102', name: 'Laxmi Supermarket', type: 'shop', distanceKm: 0.82, lat: 17.729, lng: 79.160, provenance: 'MEASURED' }
        ],
        provenance: 'MEASURED',
        note: null,
        category: 'kirana',
        radiusKm: 1.5
      };

      const result = analyzeLocationForBusiness('Kirana General Store', sampleLocation, realData);

      expect(result.competitorsNearbyCount).toBe(2);
      expect(result.competitorsCountProvenance).toBe('MEASURED');
      expect(result.competitorsNote).toBeUndefined();
      expect(result.metricsProvenance.competitorsNearbyCount).toBe('MEASURED');

      // Check real competitor objects
      expect(result.competitors).toHaveLength(2);
      expect(result.competitors[0].name).toBe('Balaji Provisions');
      expect(result.competitors[0].distanceKm).toBe(0.35);
      expect(result.competitors[1].name).toBe('Laxmi Supermarket');
      expect(result.competitors[1].distanceKm).toBe(0.82);

      // Factor 2 (Competition Pressure) should reflect MEASURED provenance
      const compFactor = result.locationFit?.factors.find((f) => f.name.toLowerCase().includes('competition'));
      expect(compFactor).toBeDefined();
      expect(compFactor?.provenance).toBe('MEASURED');

      // Other metrics remain ESTIMATED
      expect(result.footfallMonthlyProvenance).toBe('ESTIMATED');
      expect(result.metricsProvenance.footfallMonthly).toBe('ESTIMATED');
    });

    it('falls back to ESTIMATED without competitor names when realCompetitors returns empty / failure', () => {
      const fallbackData: NearbyPlacesResult = {
        count: 0,
        names: [],
        places: [],
        provenance: 'ESTIMATED',
        note: 'No OpenStreetMap data found for this area (common in villages); count is a model estimate',
        category: 'kirana',
        radiusKm: 1.5
      };

      const result = analyzeLocationForBusiness('Kirana General Store', sampleLocation, fallbackData);

      expect(result.competitorsCountProvenance).toBe('ESTIMATED');
      expect(result.competitorsNote).toBe(
        'No OpenStreetMap data found for this area (common in villages); count is a model estimate'
      );
      expect(result.metricsProvenance.competitorsNearbyCount).toBe('ESTIMATED');
      // Must not invent fake names
      expect(result.competitors).toEqual([]);
      // Count is model estimate (> 0)
      expect(result.competitorsNearbyCount).toBeGreaterThan(0);
    });
  });

  describe('analyzeLocationForBusinessAsync (async with mocked fetch)', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it('resolves with MEASURED provenance on Overpass API success', async () => {
      const mockApiResponse = {
        count: 3,
        names: ['Sri Rama Bakers', 'City Bakery', 'Iyengar Bakery'],
        places: [
          { id: '201', name: 'Sri Rama Bakers', type: 'shop', distanceKm: 0.2, lat: 17.72, lng: 79.15, provenance: 'MEASURED' },
          { id: '202', name: 'City Bakery', type: 'shop', distanceKm: 0.6, lat: 17.73, lng: 79.16, provenance: 'MEASURED' },
          { id: '203', name: 'Iyengar Bakery', type: 'shop', distanceKm: 1.1, lat: 17.74, lng: 79.17, provenance: 'MEASURED' }
        ],
        provenance: 'MEASURED',
        note: null,
        category: 'bakery',
        radiusKm: 1.5
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse
      } as any);

      const result = await analyzeLocationForBusinessAsync('Bakery & Sweets', sampleLocation, 1.5);

      expect(result.competitorsNearbyCount).toBe(3);
      expect(result.competitorsCountProvenance).toBe('MEASURED');
      expect(result.competitors).toHaveLength(3);
      expect(result.competitors.map((c) => c.name)).toEqual([
        'Sri Rama Bakers',
        'City Bakery',
        'Iyengar Bakery'
      ]);
      expect(result.competitorsNote).toBeUndefined();
    });

    it('falls back to ESTIMATED without throwing on Overpass API network failure', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network timeout'));

      const result = await analyzeLocationForBusinessAsync('Bakery & Sweets', sampleLocation, 1.5);

      expect(result.competitorsCountProvenance).toBe('ESTIMATED');
      expect(result.competitorsNote).toBe(
        'No OpenStreetMap data found for this area (common in villages); count is a model estimate'
      );
      expect(result.competitors).toEqual([]);
      expect(result.competitorsNearbyCount).toBeGreaterThan(0);
    });

    it('falls back to ESTIMATED when Overpass API returns 500 error status', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 504,
        statusText: 'Gateway Timeout'
      } as any);

      const result = await analyzeLocationForBusinessAsync('Bakery & Sweets', sampleLocation, 1.5);

      expect(result.competitorsCountProvenance).toBe('ESTIMATED');
      expect(result.competitorsNote).toBe(
        'No OpenStreetMap data found for this area (common in villages); count is a model estimate'
      );
      expect(result.competitors).toEqual([]);
    });
  });
});
