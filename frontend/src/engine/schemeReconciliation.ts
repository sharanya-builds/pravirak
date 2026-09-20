import { calculatePS, PSCalculatorResult } from './psCalculator';

export interface SchemeReconciliationResult {
  ownCapital: number; // M
  projectCost: number; // B
  requiredMargin: number; // 0.10 * B
  shortfall: number; // max(0, 0.10 * B - M)
  surplus: number; // max(0, M - 0.10 * B)
  maxSupportableProjectCost: number; // M / 0.10
  isFullyFunded: boolean; // M >= 0.10 * B
  appliedMargin: number; // M >= 0.10 * B ? 0.10 * B : M
  calculationResult: PSCalculatorResult;
  optionsIfShortfall?: {
    addCapitalText: string;
    scaleDownText: string;
    phasedExecutionText: string;
  };
}

/**
 * Reconciles the promoter's available capital (M) with the estimated project cost (B).
 *
 * Rules:
 * - If M >= 0.10 * B: Fully funded. Calculate scheme loan for project cost B using margin 0.10 * B.
 *   Maximum supportable project cost is M / 0.10.
 * - If M < 0.10 * B: Capital shortfall. Calculate scheme loan using margin M ("for the largest
 *   project your capital supports", M / 0.10), compute shortfall in INR, and formulate 3 options.
 */
export function reconcileSchemeLoan(
  ownCapital: number,
  projectCost: number
): SchemeReconciliationResult {
  const M = Math.max(0, Math.round(ownCapital));
  const B = Math.max(0, Math.round(projectCost));
  const requiredMargin = Math.round(0.10 * B);
  const isFullyFunded = M >= requiredMargin;
  const shortfall = Math.max(0, requiredMargin - M);
  const surplus = Math.max(0, M - requiredMargin);
  const maxSupportableProjectCost = Math.round(M / 0.10);

  // If M >= 0.10 * B, call psCalculator with margin 0.10 * B (which gives projectCost = B)
  // If M < 0.10 * B, call psCalculator with margin M (gives projectCost = M / 0.10)
  const appliedMargin = isFullyFunded ? requiredMargin : M;
  const calculationResult = calculatePS(appliedMargin);

  let optionsIfShortfall: SchemeReconciliationResult['optionsIfShortfall'] = undefined;

  if (!isFullyFunded) {
    optionsIfShortfall = {
      addCapitalText: `Infuse ₹${shortfall.toLocaleString('en-IN')} additional capital from savings or a partner to fully finance the estimated ₹${B.toLocaleString('en-IN')} project.`,
      scaleDownText: `Scale down the project size to ₹${maxSupportableProjectCost.toLocaleString('en-IN')} by optimizing equipment, interior fit-out, or initial stock.`,
      phasedExecutionText: `Execute in phases: Start Phase 1 within your current ₹${maxSupportableProjectCost.toLocaleString('en-IN')} limit, then expand using business revenues.`
    };
  }

  return {
    ownCapital: M,
    projectCost: B,
    requiredMargin,
    shortfall,
    surplus,
    maxSupportableProjectCost,
    isFullyFunded,
    appliedMargin,
    calculationResult,
    optionsIfShortfall
  };
}
