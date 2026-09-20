import { describe, it, expect } from 'vitest';
import {
  calculatePS,
  calculatePSScheme,
} from './psCalculator';

describe('psCalculator Engine', () => {
  describe('Acceptance Tests', () => {
    it('1. margin 100000 -> projectCost 1000000, loan 900000, Term Loan, 8%, 28 quarters, first 2 quarters interest-only, closing balance 0 at the end', () => {
      const res = calculatePS(100000);

      expect(res.isEligible).toBe(true);
      expect(res.beyondSchemeLimits).toBe(false);
      if (!res.isEligible) return;

      expect(res.projectCost).toBe(1000000);
      expect(res.loan).toBe(900000);
      expect(res.loanAmount).toBe(900000);
      expect(res.schemeName).toBe('Term Loan Scheme');
      expect(res.schemeType).toBe('Term Loan');
      expect(res.interestRatePct).toBe(8.0);
      expect(res.interestRate).toBe(8.0);
      expect(res.totalQuarters).toBe(28);
      expect(res.moratoriumQuarters).toBe(2);
      expect(res.repaymentQuarters).toBe(26);

      // Repayment schedule verification
      expect(res.schedule).toBeDefined();
      expect(res.schedule.length).toBe(28);

      // First 2 quarters are interest-only
      const q1 = res.schedule[0];
      expect(q1.quarter).toBe(1);
      expect(q1.openingBalance).toBe(900000);
      expect(q1.isMoratorium).toBe(true);
      expect(q1.principal).toBe(0);
      // 8% per year / 4 quarters = 2% per quarter -> 900,000 * 0.02 = 18,000
      expect(q1.interest).toBe(18000);
      expect(q1.totalPayment).toBe(18000);
      expect(q1.closingBalance).toBe(900000);

      const q2 = res.schedule[1];
      expect(q2.quarter).toBe(2);
      expect(q2.openingBalance).toBe(900000);
      expect(q2.isMoratorium).toBe(true);
      expect(q2.principal).toBe(0);
      expect(q2.interest).toBe(18000);
      expect(q2.totalPayment).toBe(18000);
      expect(q2.closingBalance).toBe(900000);

      // Quarter 3: start of principal amortization
      const q3 = res.schedule[2];
      expect(q3.quarter).toBe(3);
      expect(q3.isMoratorium).toBe(false);
      expect(q3.openingBalance).toBe(900000);
      expect(q3.principal).toBeGreaterThan(0);

      // Quarter 28: final quarter
      const q28 = res.schedule[27];
      expect(q28.quarter).toBe(28);
      expect(q28.closingBalance).toBe(0);

      // Check continuity: opening of q equals closing of q-1
      for (let i = 1; i < res.schedule.length; i++) {
        expect(res.schedule[i].openingBalance).toBe(res.schedule[i - 1].closingBalance);
      }

      // Check sum of principal repayments equals original loan amount
      const totalPrincipalPaid = res.schedule.reduce((sum, row) => sum + row.principal, 0);
      expect(Math.round(totalPrincipalPaid)).toBe(900000);
    });

    it('2. margin 10000 -> projectCost 100000, loan 90000, Micro, 6.5%, 12 quarters, first 1 quarter interest-only', () => {
      const res = calculatePS(10000);

      expect(res.isEligible).toBe(true);
      expect(res.beyondSchemeLimits).toBe(false);
      if (!res.isEligible) return;

      expect(res.projectCost).toBe(100000);
      expect(res.loan).toBe(90000);
      expect(res.loanAmount).toBe(90000);
      expect(res.schemeName).toBe('Micro Finance Scheme');
      expect(res.schemeType).toBe('Micro');
      expect(res.interestRatePct).toBe(6.5);
      expect(res.totalQuarters).toBe(12);
      expect(res.moratoriumQuarters).toBe(1);
      expect(res.repaymentQuarters).toBe(11);

      expect(res.schedule).toHaveLength(12);

      // First 1 quarter interest-only
      const q1 = res.schedule[0];
      expect(q1.quarter).toBe(1);
      expect(q1.openingBalance).toBe(90000);
      expect(q1.isMoratorium).toBe(true);
      expect(q1.principal).toBe(0);
      // 6.5% / 4 = 1.625% -> 90,000 * 0.01625 = 1462.5
      expect(q1.interest).toBe(1462.5);
      expect(q1.totalPayment).toBe(1462.5);
      expect(q1.closingBalance).toBe(90000);

      // Quarter 2: repayment begins
      const q2 = res.schedule[1];
      expect(q2.quarter).toBe(2);
      expect(q2.isMoratorium).toBe(false);
      expect(q2.principal).toBeGreaterThan(0);

      // Final quarter closing balance is 0
      const q12 = res.schedule[11];
      expect(q12.quarter).toBe(12);
      expect(q12.closingBalance).toBe(0);

      const totalPrincipalPaid = res.schedule.reduce((sum, row) => sum + row.principal, 0);
      expect(Math.round(totalPrincipalPaid)).toBe(90000);
    });

    it('3. margin 13000 -> projectCost 130000 (Micro, boundary check) and margin 14000 -> projectCost 140000 stays Micro (<=)', () => {
      const res13k = calculatePS(13000);
      expect(res13k.projectCost).toBe(130000);
      expect(res13k.schemeName).toBe('Micro Finance Scheme');
      expect(res13k.schemeType).toBe('Micro');
      expect(res13k.interestRatePct).toBe(6.5);
      expect(res13k.cappedByScheme).toBe(false);
      expect(res13k.loan).toBe(117000);

      const res14k = calculatePS(14000);
      expect(res14k.projectCost).toBe(140000);
      expect(res14k.schemeName).toBe('Micro Finance Scheme');
      expect(res14k.schemeType).toBe('Micro');
      expect(res14k.interestRatePct).toBe(6.5);
    });

    it('4. margin 14100 -> projectCost 141000 -> Term Loan', () => {
      const res14100 = calculatePS(14100);
      expect(res14100.projectCost).toBe(141000);
      expect(res14100.schemeName).toBe('Term Loan Scheme');
      expect(res14100.schemeType).toBe('Term Loan');
      expect(res14100.interestRatePct).toBe(8.0);
      expect(res14100.totalQuarters).toBe(28);
      expect(res14100.moratoriumQuarters).toBe(2);
      expect(res14100.loan).toBe(126900); // 0.90 * 141,000 = 126,900
      expect(res14100.cappedByScheme).toBe(false);
    });

    it('5. projectCost between ~138,889 and 140,000: loan is capped at 125000 and cappedByScheme is true', () => {
      // 125000 / 0.90 = 138888.888...
      // For projectCost = 138889: 0.90 * 138889 = 125000.1 > 125000
      const margin13888_9 = 13888.9;
      const res138889 = calculatePS(margin13888_9);
      expect(res138889.projectCost).toBe(138889);
      expect(res138889.schemeName).toBe('Micro Finance Scheme');
      expect(res138889.cappedByScheme).toBe(true);
      expect(res138889.loan).toBe(125000);
      expect(res138889.shortfall).toBe(0.1);

      // For projectCost = 140000: 0.90 * 140000 = 126000 > 125000
      const res140k = calculatePS(14000);
      expect(res140k.projectCost).toBe(140000);
      expect(res140k.schemeName).toBe('Micro Finance Scheme');
      expect(res140k.cappedByScheme).toBe(true);
      expect(res140k.loan).toBe(125000);
      expect(res140k.shortfall).toBe(1000); // 126,000 - 125,000 = 1,000
      expect(res140k.ownContributionShortfall).toBe(1000);
      expect(res140k.totalPromoterContribution).toBe(15000); // 14,000 + 1,000 = 15,000
    });

    it('6. margin 6000000 -> "beyond scheme limits" result, no exception', () => {
      expect(() => calculatePS(6000000)).not.toThrow();

      const res = calculatePS(6000000);
      expect(res.isEligible).toBe(false);
      expect(res.beyondSchemeLimits).toBe(true);
      expect(res.status).toBe('beyond_scheme_limits');
      expect(res.projectCost).toBe(60000000);
      expect(res.availableMargin).toBe(6000000);
      expect(typeof res.message).toBe('string');
      expect(res.message).toMatch(/exceeds maximum scheme limit/i);
      expect(Array.isArray(res.assumptions)).toBe(true);
      expect(res.assumptions.length).toBeGreaterThan(0);
      expect(res.loan).toBeUndefined();
      expect(res.schedule).toBeUndefined();
    });
  });

  describe('Configuration Options & Variations', () => {
    it('supports moratoriumInterest: "capitalised"', () => {
      const res = calculatePS(100000, { moratoriumInterest: 'capitalised' });

      expect(res.isEligible).toBe(true);
      if (!res.isEligible) return;

      expect(res.schedule).toBeDefined();
      const q1 = res.schedule[0];
      expect(q1.isMoratorium).toBe(true);
      expect(q1.totalPayment).toBe(0);
      expect(q1.interest).toBe(18000);
      // Capitalised interest adds to balance: 900,000 + 18,000 = 918,000
      expect(q1.closingBalance).toBe(918000);

      const q2 = res.schedule[1];
      expect(q2.openingBalance).toBe(918000);
      expect(q2.totalPayment).toBe(0);
      // 918,000 * 0.02 = 18,360
      expect(q2.interest).toBe(18360);
      expect(q2.closingBalance).toBe(936360);

      // Repayment begins from 936,360
      const q3 = res.schedule[2];
      expect(q3.openingBalance).toBe(936360);

      // Final closing balance is still strictly 0
      const q28 = res.schedule[27];
      expect(q28.closingBalance).toBe(0);
    });

    it('supports repaymentType: "emi"', () => {
      const res = calculatePS(100000, { repaymentType: 'emi' });

      expect(res.isEligible).toBe(true);
      if (!res.isEligible) return;

      // In EMI, during post-moratorium quarters, totalPayment is approximately constant
      const postMoratoriumRows = res.schedule.slice(2);
      const firstEMI = postMoratoriumRows[0].totalPayment;

      // Check that payments before the final adjustment are uniform
      for (let i = 0; i < postMoratoriumRows.length - 1; i++) {
        expect(Math.abs(postMoratoriumRows[i].totalPayment - firstEMI)).toBeLessThanOrEqual(0.05);
      }

      // Final balance is strictly 0
      expect(res.schedule[27].closingBalance).toBe(0);
    });

    it('handles exact scheme upper limit projectCost = 5,000,000 (margin = 500,000)', () => {
      const res = calculatePS(500000);
      expect(res.isEligible).toBe(true);
      expect(res.beyondSchemeLimits).toBe(false);
      expect(res.projectCost).toBe(5000000);
      expect(res.schemeName).toBe('Term Loan Scheme');
      expect(res.maxLoan).toBe(4500000);
      expect(res.loan).toBe(4500000);
      expect(res.cappedByScheme).toBe(false);
      expect(res.shortfall).toBe(0);
    });

    it('handles projectCost just over 5,000,000 (margin = 500,001)', () => {
      const res = calculatePS(500000.1);
      expect(res.isEligible).toBe(false);
      expect(res.beyondSchemeLimits).toBe(true);
      expect(res.projectCost).toBe(5000001);
    });

    it('handles zero or negative margin gracefully without throwing', () => {
      expect(() => calculatePS(0)).not.toThrow();
      const resZero = calculatePS(0);
      expect(resZero.isEligible).toBe(false);
      expect(resZero.beyondSchemeLimits).toBe(true);
      expect(resZero.message).toMatch(/greater than zero/i);

      expect(() => calculatePS(-5000)).not.toThrow();
      const resNeg = calculatePS(-5000);
      expect(resNeg.isEligible).toBe(false);
      expect(resNeg.beyondSchemeLimits).toBe(true);
    });

    it('populates assumptions list with comprehensive details', () => {
      const res = calculatePS(100000);
      expect(res.assumptions).toBeInstanceOf(Array);
      expect(res.assumptions.length).toBeGreaterThan(3);
      expect(res.assumptions.some((a) => a.includes('10%'))).toBe(true);
      expect(res.assumptions.some((a) => a.includes('Term Loan Scheme'))).toBe(true);
      expect(res.assumptions.some((a) => a.includes('quarterly'))).toBe(true);
    });

    it('works with calculatePSScheme alias', () => {
      const res1 = calculatePS(10000);
      const res2 = calculatePSScheme(10000);
      expect(res1).toEqual(res2);
    });
  });
});
