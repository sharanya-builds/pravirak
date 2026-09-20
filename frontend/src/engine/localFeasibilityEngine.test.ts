import { describe, it, expect } from 'vitest';
import {
  buildDeterministicCatchment,
  formatPricingGuidance,
  PRICING_BAND_LABEL
} from './localFeasibilityEngine';

describe('localFeasibilityEngine Deterministic Catchment & Pricing', () => {
  it('computes competitor density per 10,000 population only when population figure is available', () => {
    const catchmentWithPop = buildDeterministicCatchment({
      catchmentKm: 6,
      summary: 'Test summary',
      distributionChannels: ['Direct counter'],
      competitors5kmCount: 4,
      competitors10kmCount: 9,
      population5km: 20000,
      population10km: 50000
    });

    // 4 / 20,000 * 10,000 = 2.0
    expect(catchmentWithPop.densityPer10kAt5km).toBe(2.0);
    // 9 / 50,000 * 10,000 = 1.8
    expect(catchmentWithPop.densityPer10kAt10km).toBe(1.8);
    expect(catchmentWithPop.competitors5kmCount).toBe(4);
    expect(catchmentWithPop.competitors10kmCount).toBe(9);
  });

  it('strictly omits density (sets to null) when population is not available; never fabricates population', () => {
    const catchmentNoPop = buildDeterministicCatchment({
      catchmentKm: 5,
      summary: 'Rural village catchment',
      distributionChannels: ['Counter sales'],
      competitors5kmCount: 2,
      competitors10kmCount: 5,
      population5km: null,
      population10km: undefined
    });

    expect(catchmentNoPop.densityPer10kAt5km).toBeNull();
    expect(catchmentNoPop.densityPer10kAt10km).toBeNull();
    expect(catchmentNoPop.population5km).toBeNull();
    expect(catchmentNoPop.population10km).toBeNull();
  });

  it('clamps catchmentKm between 5 and 10 km', () => {
    const low = buildDeterministicCatchment({
      catchmentKm: 2,
      summary: 'S',
      distributionChannels: ['C'],
      competitors5kmCount: 1,
      competitors10kmCount: 2
    });
    expect(low.catchmentKm).toBe(5);

    const high = buildDeterministicCatchment({
      catchmentKm: 25,
      summary: 'S',
      distributionChannels: ['C'],
      competitors5kmCount: 1,
      competitors10kmCount: 2
    });
    expect(high.catchmentKm).toBe(10);
  });

  it('formats pricing band note with mandatory mandi/market rate label without fabricated prices', () => {
    const pricing = formatPricingGuidance('Cost-plus 15% mark-up');

    expect(pricing.strategy).toBe('Cost-plus 15% mark-up');
    expect(pricing.priceBandNote).toContain(PRICING_BAND_LABEL);
    expect(pricing.priceBandNote).toContain('Guidance, verify with local mandi/market rates');
  });
});
