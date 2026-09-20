import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDistanceKm,
  getCategoryOsmClauses,
  buildOverpassQuery,
  getNearbyCompetitors
} from './placesService.js';

describe('placesService - OpenStreetMap Overpass Client', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('calculateDistanceKm computes distance accurately', () => {
    // Distance between two points in Hyderabad ~ 1.5 km
    const dist = calculateDistanceKm(17.385, 78.4867, 17.395, 78.4967);
    assert.ok(dist > 1.0 && dist < 2.0);
  });

  test('getCategoryOsmClauses maps kirana and garments to appropriate OSM tags', () => {
    const kiranaClauses = getCategoryOsmClauses('Kirana & FMCG Retail');
    assert.ok(kiranaClauses.includes('convenience'));

    const garmentsClauses = getCategoryOsmClauses('garments');
    assert.ok(garmentsClauses.includes('clothes'));
  });

  test('buildOverpassQuery formats Overpass QL correctly', () => {
    const query = buildOverpassQuery(17.385, 78.4867, 1500, 'kirana');
    assert.ok(query.includes('[out:json][timeout:10]'));
    assert.ok(query.includes('around:1500,17.385,78.4867'));
  });

  test('getNearbyCompetitors returns MEASURED provenance on Overpass success', async () => {
    global.fetch = async () => {
      return {
        ok: true,
        json: async () => ({
          elements: [
            {
              type: 'node',
              id: 101,
              lat: 17.386,
              lon: 78.487,
              tags: { name: 'Sri Krishna Kirana', shop: 'convenience' }
            },
            {
              type: 'node',
              id: 102,
              lat: 17.388,
              lon: 78.489,
              tags: { shop: 'general' } // Unnamed element in OSM
            }
          ]
        })
      };
    };

    const result = await getNearbyCompetitors(17.385, 78.4867, 1.5, 'kirana');
    assert.equal(result.provenance, 'MEASURED');
    assert.equal(result.count, 2);
    assert.deepEqual(result.names, ['Sri Krishna Kirana']);
    assert.equal(result.places.length, 1); // Only named places in places array
    assert.equal(result.places[0].name, 'Sri Krishna Kirana');
    assert.equal(result.note, null);
  });

  test('getNearbyCompetitors returns ESTIMATED provenance when Overpass returns empty', async () => {
    global.fetch = async () => {
      return {
        ok: true,
        json: async () => ({ elements: [] })
      };
    };

    const result = await getNearbyCompetitors(18.123, 79.456, 1.5, 'bakery');
    assert.equal(result.provenance, 'ESTIMATED');
    assert.equal(result.count, 0);
    assert.deepEqual(result.names, []);
    assert.ok(result.note.includes('No OpenStreetMap data found'));
  });

  test('getNearbyCompetitors falls back to ESTIMATED when Overpass fetch throws or times out', async () => {
    global.fetch = async () => {
      throw new Error('ETIMEDOUT');
    };

    const result = await getNearbyCompetitors(19.123, 77.456, 1.5, 'garments');
    assert.equal(result.provenance, 'ESTIMATED');
    assert.equal(result.count, 0);
    assert.deepEqual(result.names, []);
    assert.ok(result.note.includes('No OpenStreetMap data found'));
  });
});
