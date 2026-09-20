import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import {
  localFeasibilitySchema,
  generateDeterministicFallback,
  generateLocalFeasibilityReport
} from './localFeasibilityService.js';

describe('Local Feasibility Service & Schema Validation', () => {
  const validReportSample = {
    marketReach: {
      catchmentKm: 7,
      summary: 'Serves the local town and 4 adjoining villages.',
      distributionChannels: ['Direct storefront sales', 'Weekly haat stall']
    },
    opportunities: [
      {
        niche: 'Morning fresh dairy and baked staples',
        why: 'No dedicated specialty supplier within 4 km.'
      }
    ],
    swot: {
      strengths: ['Low rent footprint', 'Direct owner management'],
      weaknesses: ['Limited initial stock buffer'],
      opportunities: ['Weekly mandi footfall capture'],
      threats: ['Monsoon transit disruption']
    },
    threats: [
      {
        type: 'supply_chain',
        description: 'Wholesale mandi stockout',
        mitigation: 'Keep 7-day reserve with multiple distributors'
      }
    ],
    pricing: {
      strategy: 'Cost-plus 18% margin matching regional market rates',
      priceBandNote: 'Guidance, verify with local mandi/market rates'
    },
    assumptions: [
      'Promoter manages daily operations directly'
    ]
  };

  describe('Schema Validation with Zod', () => {
    test('valid object passes schema validation', () => {
      const parsed = localFeasibilitySchema.safeParse(validReportSample);
      assert.strictEqual(parsed.success, true);
    });

    test('rejects catchmentKm < 5 or > 10', () => {
      const invalidLow = {
        ...validReportSample,
        marketReach: { ...validReportSample.marketReach, catchmentKm: 4 }
      };
      const parsedLow = localFeasibilitySchema.safeParse(invalidLow);
      assert.strictEqual(parsedLow.success, false);

      const invalidHigh = {
        ...validReportSample,
        marketReach: { ...validReportSample.marketReach, catchmentKm: 15 }
      };
      const parsedHigh = localFeasibilitySchema.safeParse(invalidHigh);
      assert.strictEqual(parsedHigh.success, false);
    });

    test('rejects unknown threat types', () => {
      const invalidThreat = {
        ...validReportSample,
        threats: [
          {
            type: 'cyber_attack', // not allowed enum
            description: 'Unknown',
            mitigation: 'None'
          }
        ]
      };
      const parsed = localFeasibilitySchema.safeParse(invalidThreat);
      assert.strictEqual(parsed.success, false);
    });

    test('rejects missing required arrays', () => {
      const missingSwot = { ...validReportSample, swot: { strengths: [] } };
      const parsed = localFeasibilitySchema.safeParse(missingSwot);
      assert.strictEqual(parsed.success, false);
    });
  });

  describe('Deterministic Template Fallback', () => {
    test('generates valid English fallback matching schema with aiGenerated=false', () => {
      const fallback = generateDeterministicFallback({
        category: 'Kirana Store',
        location: { village: 'Pembarthi', block: 'Jangaon', district: 'Jangaon', state: 'Telangana' },
        ownCapital: 100000,
        competitorCount: 3,
        projectCost: 1000000,
        language: 'en'
      });

      const parsed = localFeasibilitySchema.safeParse(fallback);
      assert.strictEqual(parsed.success, true);
      assert.strictEqual(fallback.aiGenerated, false);
      assert.strictEqual(fallback.provenance, 'ESTIMATED');
      assert.ok(fallback.marketReach.catchmentKm >= 5 && fallback.marketReach.catchmentKm <= 10);
      assert.ok(fallback.opportunities.length > 0);
      assert.ok(fallback.swot.strengths.length > 0);
      assert.ok(fallback.threats.some((t) => t.type === 'supply_chain'));
      assert.ok(fallback.pricing.priceBandNote.includes('mandi/market rates'));
    });

    test('generates valid Hindi and Telugu fallbacks matching schema', () => {
      const hiFallback = generateDeterministicFallback({
        category: 'Bakery',
        location: { block: 'Jangaon', district: 'Jangaon' },
        language: 'hi'
      });
      assert.strictEqual(localFeasibilitySchema.safeParse(hiFallback).success, true);
      assert.strictEqual(hiFallback.aiGenerated, false);

      const teFallback = generateDeterministicFallback({
        category: 'Bakery',
        location: { block: 'Jangaon', district: 'Jangaon' },
        language: 'te'
      });
      assert.strictEqual(localFeasibilitySchema.safeParse(teFallback).success, true);
      assert.strictEqual(teFallback.aiGenerated, false);
    });
  });

  describe('generateLocalFeasibilityReport Service & Fallback Path', () => {
    const originalEnv = process.env.OPENROUTER_API_KEY;
    const originalFetch = globalThis.fetch;

    afterEach(() => {
      process.env.OPENROUTER_API_KEY = originalEnv;
      globalThis.fetch = originalFetch;
    });

    test('returns deterministic fallback immediately when OPENROUTER_API_KEY is not set', async () => {
      delete process.env.OPENROUTER_API_KEY;

      const report = await generateLocalFeasibilityReport({
        category: 'Mobile Repair',
        location: { district: 'Warangal' },
        language: 'en'
      });

      assert.strictEqual(report.aiGenerated, false);
      assert.strictEqual(report.provenance, 'ESTIMATED');
      assert.ok(report.swot.strengths.length > 0);
    });

    test('retries on initial validation failure and succeeds if retry returns valid schema', async () => {
      process.env.OPENROUTER_API_KEY = 'test-key';

      let callCount = 0;
      globalThis.fetch = async () => {
        callCount++;
        if (callCount === 1) {
          // First attempt returns invalid schema (catchmentKm is 100 which exceeds 10)
          return {
            ok: true,
            json: async () => ({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      ...validReportSample,
                      marketReach: { ...validReportSample.marketReach, catchmentKm: 100 }
                    })
                  }
                }
              ]
            })
          };
        }
        // Retry returns valid schema
        return {
          ok: true,
          json: async () => ({
            choices: [{ message: { content: JSON.stringify(validReportSample) } }]
          })
        };
      };

      const report = await generateLocalFeasibilityReport({
        category: 'Kirana',
        language: 'en'
      });

      assert.strictEqual(callCount, 2);
      assert.strictEqual(report.aiGenerated, true);
      assert.strictEqual(report.provenance, 'AI_GENERATED');
      assert.strictEqual(report.marketReach.catchmentKm, 7);
    });

    test('falls back gracefully when both initial call and retry fail validation', async () => {
      process.env.OPENROUTER_API_KEY = 'test-key';

      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({ invalid: 'schema' })
              }
            }
          ]
        })
      });

      const report = await generateLocalFeasibilityReport({
        category: 'Kirana',
        language: 'en'
      });

      assert.strictEqual(report.aiGenerated, false);
      assert.strictEqual(report.provenance, 'ESTIMATED');
      assert.ok(report.swot.strengths.length > 0);
    });

    test('falls back gracefully when network fetch throws or times out', async () => {
      process.env.OPENROUTER_API_KEY = 'test-key';

      globalThis.fetch = async () => {
        throw new Error('Connection refused or timed out');
      };

      const report = await generateLocalFeasibilityReport({
        category: 'Kirana',
        language: 'en'
      });

      assert.strictEqual(report.aiGenerated, false);
      assert.strictEqual(report.provenance, 'ESTIMATED');
    });
  });
});
