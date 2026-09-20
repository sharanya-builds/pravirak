import {
  LocalFeasibilityReport,
  SelectedLocation,
  LocationData,
  Language
} from '../types';
import { fetchNearbyPlaces } from './placesService';
import { buildDeterministicCatchment, formatPricingGuidance } from '../engine/localFeasibilityEngine';

export type FeasibilityLocationInput =
  | SelectedLocation
  | LocationData
  | {
      address?: string;
      areaName?: string;
      latitude?: number;
      lat?: number;
      longitude?: number;
      lng?: number;
      village?: string | null;
      block?: string | null;
      district?: string | null;
      state?: string | null;
    };

export interface FetchLocalFeasibilityParams {
  category: string;
  location: FeasibilityLocationInput;
  ownCapital: number;
  projectCost: number;
  competitorCount: number;
  catchmentPopulationEstimate?: number | null;
  language: Language;
}

/**
 * Fetches the Local Feasibility Report from the backend endpoint POST /api/report/local-feasibility
 * and enriches it with deterministic 5 km and 10 km Overpass counts.
 */
export async function fetchLocalFeasibilityReport(
  params: FetchLocalFeasibilityParams
): Promise<LocalFeasibilityReport> {
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:4000/api';
  const url = `${apiBase}/report/local-feasibility`;

  const loc = params.location as any;
  const address = loc.address || loc.areaName || '';
  const lat = loc.latitude ?? loc.lat;
  const lng = loc.longitude ?? loc.lng;

  const payload = {
    category: params.category,
    location: {
      village: loc.village ?? null,
      block: loc.block ?? null,
      district: loc.district ?? null,
      state: loc.state ?? null,
      address
    },
    ownCapital: params.ownCapital,
    projectCost: params.projectCost,
    competitorCount: params.competitorCount,
    catchmentPopulationEstimate: params.catchmentPopulationEstimate ?? null,
    language: params.language
  };

  // Run backend feasibility call and Overpass 5km/10km queries concurrently
  const [reportPromise, places5kmPromise, places10kmPromise] = [
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Local feasibility API returned ${res.status}`);
      }
      return res.json();
    }),
    lat && lng
      ? fetchNearbyPlaces(lat, lng, 5, params.category)
      : Promise.resolve(null),
    lat && lng
      ? fetchNearbyPlaces(lat, lng, 10, params.category)
      : Promise.resolve(null)
  ];

  try {
    const [rawReport, places5km, places10km] = await Promise.all([
      reportPromise,
      places5kmPromise,
      places10kmPromise
    ]);

    // Deterministic Overpass counts
    const comp5kmCount = places5km ? places5km.count : params.competitorCount;
    const comp10kmCount = places10km ? places10km.count : Math.max(comp5kmCount, params.competitorCount * 2);

    const catchment = buildDeterministicCatchment({
      catchmentKm: rawReport.marketReach?.catchmentKm || 5,
      summary: rawReport.marketReach?.summary || 'Local catchment area overview.',
      distributionChannels: rawReport.marketReach?.distributionChannels || ['Direct counter sales'],
      competitors5kmCount: comp5kmCount,
      competitors10kmCount: comp10kmCount,
      competitors5kmProvenance: places5km?.provenance || 'ESTIMATED',
      competitors10kmProvenance: places10km?.provenance || 'ESTIMATED',
      population5km: params.catchmentPopulationEstimate ?? null,
      population10km: null // strictly omit if not given
    });

    const pricing = formatPricingGuidance(
      rawReport.pricing?.strategy,
      rawReport.pricing?.priceBandNote
    );

    return {
      marketReach: catchment,
      opportunities: rawReport.opportunities || [],
      swot: rawReport.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      threats: rawReport.threats || [],
      pricing,
      assumptions: rawReport.assumptions || [],
      aiGenerated: Boolean(rawReport.aiGenerated),
      provenance: rawReport.provenance === 'AI_GENERATED' ? 'AI_GENERATED' : 'ESTIMATED'
    };
  } catch (err) {
    // If backend is unreachable or errors, return local deterministic fallback
    const comp5kmCount = Math.max(1, params.competitorCount);
    const comp10kmCount = Math.max(comp5kmCount, params.competitorCount * 2);

    const catchment = buildDeterministicCatchment({
      catchmentKm: 5,
      summary: `Primary retail catchment covering a 5 km zone around ${(params.location as any).address || (params.location as any).areaName || 'the target area'}.`,
      distributionChannels: ['Direct counter walk-in sales', 'Local weekly haat / market stalls'],
      competitors5kmCount: comp5kmCount,
      competitors10kmCount: comp10kmCount,
      competitors5kmProvenance: 'ESTIMATED',
      competitors10kmProvenance: 'ESTIMATED',
      population5km: params.catchmentPopulationEstimate ?? null,
      population10km: null
    });

    return {
      marketReach: catchment,
      opportunities: [
        {
          niche: 'Daily essential items pre-packaged in micro ticket sizes',
          why: 'Serves daily wage earners and recurring walk-in household needs.'
        },
        {
          niche: 'Advance custom booking for local events and weekly haats',
          why: 'Capitalizes on trusted community relationships.'
        }
      ],
      swot: {
        strengths: [
          'Direct customer connection with zero intermediary distribution costs',
          'Low overhead operational footprint aligned with promoter capital'
        ],
        weaknesses: [
          'Initial working capital constrained to micro-scale reserves',
          'Dependence on single-owner operational bandwidth'
        ],
        opportunities: [
          'Capture higher customer inflow during weekly regional haats',
          'Broaden inventory line into fast-moving daily staples'
        ],
        threats: [
          'Seasonal rain or crop harvest income cyclicality',
          'Wholesale supplier stockouts or mandi logistics price shifts'
        ]
      },
      threats: [
        {
          type: 'supply_chain',
          description: 'Delayed wholesale replenishment from regional mandis.',
          mitigation: 'Build relationships with 2-3 alternate distributors and keep 7-day reserve.'
        },
        {
          type: 'seasonal',
          description: 'Seasonal demand swings around harvest and monsoon months.',
          mitigation: 'Adjust inventory levels ahead of peak agricultural income windows.'
        },
        {
          type: 'single_buyer',
          description: 'High credit concentration with a few customers.',
          mitigation: 'Diversify walk-ins and avoid unsecured credit exceeding micro limits.'
        }
      ],
      pricing: formatPricingGuidance(
        'Cost-plus margin with local price matching',
        'Verify counter prices against prevailing local mandi and market rates.'
      ),
      assumptions: [
        'Owner directly operates day-to-day business.',
        'Shop premises lease remains stable for first 12 months.'
      ],
      aiGenerated: false,
      provenance: 'ESTIMATED'
    };
  }
}
