/**
 * buildAnalysisContext.ts
 *
 * Builds the compact, flat analysisContext JSON that is sent to the
 * backend /api/advisor/ask endpoint.  Only deterministic values produced
 * by PRAVIRAK's own engines are included — the LLM is not allowed to
 * invent or recompute any of these.
 */
import {
  BusinessInput,
  LocationData,
  FinancialAnalysis,
  BusinessDecisionResult
} from '../types';

export interface AnalysisContext {
  businessIdea: string;
  businessCategory: string;
  location: {
    village: string | null;
    block: string | null;
    district: string | null;
    state: string;
    areaName: string;
    city: string;
  };
  ownCapital: number;
  projectCost: number;
  loanRequired: number;
  monthlyEMI: number;
  quarterlyPayment: number;
  dscr: number;
  safetyStatus: string;
  decision: string;
  competitorCount: number;
  competitorCountProvenance: string;
  topRisks: string[];
  schemeName: string | null;
}

export function buildAnalysisContext(
  input: BusinessInput,
  location: LocationData,
  financials: FinancialAnalysis,
  decisionResult: BusinessDecisionResult
): AnalysisContext {
  const topRisks = (decisionResult.riskFactors ?? [])
    .slice(0, 3)
    .map((r) => r.title);

  // Best-match scheme: first action-plan scheme name mentioned, or null
  const schemeName =
    decisionResult.actionPlan
      ?.find((step) =>
        /pmegp|mudra|cgtmse|scheme|loan/i.test(step.description ?? '')
      )
      ?.title ?? null;

  return {
    businessIdea: input.businessIdea,
    businessCategory: input.category || input.businessIdea,
    location: {
      village: location.village ?? null,
      block: location.block ?? null,
      district: location.district ?? null,
      state: location.state,
      areaName: location.areaName,
      city: location.city
    },
    ownCapital: financials.ownCapital,
    projectCost: financials.projectCost,
    loanRequired: financials.loanRequired,
    monthlyEMI: financials.monthlyEMI,
    quarterlyPayment: Math.round(financials.monthlyEMI * 3),
    dscr: financials.dscr,
    safetyStatus: financials.safetyStatus,
    decision: decisionResult.decision,
    competitorCount: location.competitorsNearbyCount,
    competitorCountProvenance: location.competitorsCountProvenance ?? 'ESTIMATED',
    topRisks,
    schemeName
  };
}
