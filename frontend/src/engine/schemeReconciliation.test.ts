import { describe, it, expect } from 'vitest';
import { reconcileSchemeLoan } from './schemeReconciliation';

describe('schemeReconciliation', () => {
  describe('Case 1: M >= 0.10 * B (Fully Funded)', () => {
    it('handles M > 0.10 * B with surplus capital and max supportable project size', () => {
      // Estimated project cost B = 10,00,000. 10% required margin = 1,00,000.
      // Promoter capital M = 1,50,000 (surplus = 50,000).
      const B = 1000000;
      const M = 150000;

      const result = reconcileSchemeLoan(M, B);

      expect(result.ownCapital).toBe(150000);
      expect(result.projectCost).toBe(1000000);
      expect(result.requiredMargin).toBe(100000);
      expect(result.isFullyFunded).toBe(true);
      expect(result.shortfall).toBe(0);
      expect(result.surplus).toBe(50000);
      expect(result.maxSupportableProjectCost).toBe(1500000); // 1,50,000 / 0.10
      expect(result.appliedMargin).toBe(100000); // Calls psCalculator with 0.10 * B

      // Underlying scheme loan check
      expect(result.calculationResult.isEligible).toBe(true);
      expect(result.calculationResult.projectCost).toBe(1000000);
      expect(result.calculationResult.loanAmount).toBe(900000);
      expect(result.calculationResult.schemeName).toBe('Term Loan Scheme');
      expect(result.optionsIfShortfall).toBeUndefined();
    });

    it('handles exact match M == 0.10 * B', () => {
      // Estimated project cost B = 1,00,000 (Micro Finance). Required margin = 10,000.
      // Promoter capital M = 10,000.
      const B = 100000;
      const M = 10000;

      const result = reconcileSchemeLoan(M, B);

      expect(result.ownCapital).toBe(10000);
      expect(result.projectCost).toBe(100000);
      expect(result.requiredMargin).toBe(10000);
      expect(result.isFullyFunded).toBe(true);
      expect(result.shortfall).toBe(0);
      expect(result.surplus).toBe(0);
      expect(result.maxSupportableProjectCost).toBe(100000);
      expect(result.appliedMargin).toBe(10000);

      expect(result.calculationResult.isEligible).toBe(true);
      expect(result.calculationResult.projectCost).toBe(100000);
      expect(result.calculationResult.loanAmount).toBe(90000);
      expect(result.calculationResult.schemeName).toBe('Micro Finance Scheme');
      expect(result.optionsIfShortfall).toBeUndefined();
    });
  });

  describe('Case 2: M < 0.10 * B (Capital Shortfall)', () => {
    it('computes shortfall, sizes scheme loan for maximum supportable project M / 0.10, and formulates 3 options', () => {
      // Estimated project cost B = 20,00,000. Required margin = 2,00,000.
      // Promoter capital M = 1,00,000.
      // Shortfall = 1,00,000. Max supportable project = 10,00,000.
      const B = 2000000;
      const M = 100000;

      const result = reconcileSchemeLoan(M, B);

      expect(result.ownCapital).toBe(100000);
      expect(result.projectCost).toBe(2000000);
      expect(result.requiredMargin).toBe(200000);
      expect(result.isFullyFunded).toBe(false);
      expect(result.shortfall).toBe(100000);
      expect(result.surplus).toBe(0);
      expect(result.maxSupportableProjectCost).toBe(1000000);
      expect(result.appliedMargin).toBe(100000); // Called with margin M

      // Underlying scheme loan is sized for supportable project cost 10,00,000
      expect(result.calculationResult.isEligible).toBe(true);
      expect(result.calculationResult.projectCost).toBe(1000000);
      expect(result.calculationResult.loanAmount).toBe(900000);
      expect(result.calculationResult.schemeName).toBe('Term Loan Scheme');

      // 3 Actionable options
      expect(result.optionsIfShortfall).toBeDefined();
      expect(result.optionsIfShortfall?.addCapitalText).toContain('1,00,000');
      expect(result.optionsIfShortfall?.scaleDownText).toContain('10,00,000');
      expect(result.optionsIfShortfall?.phasedExecutionText).toContain('10,00,000');
    });
  });

  describe('Beyond Scheme Limits', () => {
    it('gracefully marks beyondSchemeLimits without throwing when project cost exceeds 50 Lakhs', () => {
      // Margin 6,00,000 -> Project cost 60,00,000 > 50,00,000 limit
      const B = 6000000;
      const M = 600000;

      const result = reconcileSchemeLoan(M, B);

      expect(result.isFullyFunded).toBe(true);
      expect(result.calculationResult.isEligible).toBe(false);
      expect(result.calculationResult.beyondSchemeLimits).toBe(true);
      expect(result.calculationResult.message).toContain('₹50,00,000');
    });
  });
});
