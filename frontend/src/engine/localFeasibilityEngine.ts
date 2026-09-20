import { MarketReachData, PricingGuidanceData, Provenance } from '../types';

export const PRICING_BAND_LABEL = 'Guidance, verify with local mandi/market rates';

export interface CatchmentComputeParams {
  catchmentKm: number;
  summary: string;
  distributionChannels: string[];
  competitors5kmCount: number;
  competitors10kmCount: number;
  competitors5kmProvenance?: Provenance;
  competitors10kmProvenance?: Provenance;
  population5km?: number | null;
  population10km?: number | null;
}

/**
 * Pure deterministic calculation for catchment metrics:
 * - Density per 10,000 population calculated ONLY if real population is available.
 * - Otherwise density is null (strictly omitted; never fabricate population).
 */
export function buildDeterministicCatchment(params: CatchmentComputeParams): MarketReachData {
  const {
    catchmentKm,
    summary,
    distributionChannels,
    competitors5kmCount,
    competitors10kmCount,
    competitors5kmProvenance = 'ESTIMATED',
    competitors10kmProvenance = 'ESTIMATED',
    population5km,
    population10km
  } = params;

  const densityPer10kAt5km =
    typeof population5km === 'number' && population5km > 0
      ? Math.round((competitors5kmCount / population5km) * 10000 * 10) / 10
      : null;

  const densityPer10kAt10km =
    typeof population10km === 'number' && population10km > 0
      ? Math.round((competitors10kmCount / population10km) * 10000 * 10) / 10
      : null;

  return {
    catchmentKm: Math.min(10, Math.max(5, catchmentKm)),
    summary,
    distributionChannels,
    competitors5kmCount,
    competitors10kmCount,
    competitors5kmProvenance,
    competitors10kmProvenance,
    population5km: population5km ?? null,
    population10km: population10km ?? null,
    densityPer10kAt5km,
    densityPer10kAt10km
  };
}

/**
 * Text-only pricing guidance wrapper enforcing mandatory disclaimer label.
 */
export function formatPricingGuidance(strategy: string, customNote?: string): PricingGuidanceData {
  return {
    strategy: strategy || 'Cost-plus margin with local price matching',
    priceBandNote: customNote
      ? `${PRICING_BAND_LABEL}. ${customNote}`
      : PRICING_BAND_LABEL
  };
}
