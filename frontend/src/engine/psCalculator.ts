/**
 * Pure deterministic calculation engine for MSME Scheme Routing & Amortization Schedules.
 * 
 * Rules:
 * - Input: availableMargin (INR)
 * - projectCost = availableMargin / 0.10
 * - maxLoan = 0.90 * projectCost
 * - Scheme routing:
 *   * projectCost <= 140,000 -> "Micro Finance Scheme": up to 90% of cost, max loan 125,000, 6.5% p.a., 3 years total (3-month moratorium)
 *   * 140,000 < projectCost <= 5,000,000 -> "Term Loan Scheme": up to 90% of cost, max loan 4,500,000, 8.0% p.a., 7 years total (6-month moratorium)
 *   * projectCost > 5,000,000 -> beyond scheme limits (graceful result, no exception)
 * - Loan cap: loan = min(0.90 * projectCost, schemeMaxLoan)
 * - Repayment schedule: Quarterly, moratorium quarters interest-only (serviced or capitalised),
 *   followed by equal principal instalments or EMI.
 */

export type MoratoriumInterestTreatment = 'serviced' | 'capitalised';
export type RepaymentType = 'equal_principal' | 'emi';

export interface PSCalculatorOptions {
  moratoriumInterest?: MoratoriumInterestTreatment;
  repaymentType?: RepaymentType;
  roundToDecimals?: boolean;
}

export interface RepaymentQuarterRow {
  quarter: number;
  openingBalance: number;
  interest: number;
  principal: number;
  totalPayment: number;
  closingBalance: number;
  isMoratorium: boolean;
  /** Alias for totalPayment */
  installment: number;
}

export type SchemeName = 'Micro Finance Scheme' | 'Term Loan Scheme';
export type SchemeShortType = 'Micro' | 'Term Loan';

export interface SchemeConfig {
  schemeName: SchemeName;
  schemeType: SchemeShortType;
  maxProjectCost: number;
  schemeMaxLoan: number;
  annualInterestRatePct: number;
  tenureYears: number;
  moratoriumMonths: number;
}

export const SCHEME_CONFIGS: {
  MICRO: SchemeConfig;
  TERM_LOAN: SchemeConfig;
} = {
  MICRO: {
    schemeName: 'Micro Finance Scheme',
    schemeType: 'Micro',
    maxProjectCost: 140000,
    schemeMaxLoan: 125000,
    annualInterestRatePct: 6.5,
    tenureYears: 3,
    moratoriumMonths: 3,
  },
  TERM_LOAN: {
    schemeName: 'Term Loan Scheme',
    schemeType: 'Term Loan',
    maxProjectCost: 5000000,
    schemeMaxLoan: 4500000,
    annualInterestRatePct: 8.0,
    tenureYears: 7,
    moratoriumMonths: 6,
  },
};

export const MAX_ELIGIBLE_PROJECT_COST = 5000000;

export interface PSCalculatorEligibleResult {
  isEligible: true;
  beyondSchemeLimits: false;
  status: 'eligible';
  message?: string;
  availableMargin: number;
  projectCost: number;
  maxLoan: number;
  loan: number;
  /** Alias for loan */
  loanAmount: number;
  schemeName: SchemeName;
  /** Alias for schemeName */
  scheme: SchemeName;
  schemeType: SchemeShortType;
  schemeMaxLoan: number;
  interestRate: number;
  /** Alias for interestRate */
  interestRatePct: number;
  tenureYears: number;
  moratoriumMonths: number;
  totalQuarters: number;
  moratoriumQuarters: number;
  repaymentQuarters: number;
  cappedByScheme: boolean;
  shortfall: number;
  /** Alias for shortfall */
  ownContributionShortfall: number;
  totalPromoterContribution: number;
  schedule: RepaymentQuarterRow[];
  /** Alias for schedule */
  repaymentSchedule: RepaymentQuarterRow[];
  assumptions: string[];
  options: {
    moratoriumInterest: MoratoriumInterestTreatment;
    repaymentType: RepaymentType;
    roundToDecimals: boolean;
  };
}

export interface PSCalculatorBeyondLimitsResult {
  isEligible: false;
  beyondSchemeLimits: true;
  status: 'beyond_scheme_limits';
  message: string;
  availableMargin: number;
  projectCost: number;
  maxLoan?: number;
  loan?: undefined;
  loanAmount?: undefined;
  schemeName?: undefined;
  scheme?: undefined;
  schemeType?: undefined;
  schemeMaxLoan?: undefined;
  interestRate?: undefined;
  interestRatePct?: undefined;
  tenureYears?: undefined;
  moratoriumMonths?: undefined;
  totalQuarters?: undefined;
  moratoriumQuarters?: undefined;
  repaymentQuarters?: undefined;
  cappedByScheme?: false;
  shortfall?: 0;
  ownContributionShortfall?: 0;
  totalPromoterContribution?: number;
  schedule?: undefined;
  repaymentSchedule?: undefined;
  assumptions: string[];
  options?: {
    moratoriumInterest: MoratoriumInterestTreatment;
    repaymentType: RepaymentType;
    roundToDecimals: boolean;
  };
}

export type PSCalculatorResult = PSCalculatorEligibleResult | PSCalculatorBeyondLimitsResult;

/**
 * Utility to round to 2 decimal places for financial calculations.
 */
function round2(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Pure function to calculate scheme eligibility, loan amount, and quarterly repayment schedule.
 *
 * @param availableMargin Promoter margin amount in INR
 * @param options Calculation options: moratoriumInterest ('serviced' | 'capitalised'),
 *                repaymentType ('equal_principal' | 'emi'), roundToDecimals (default true)
 */
export function calculatePS(
  availableMargin: number,
  options?: PSCalculatorOptions
): PSCalculatorResult {
  const moratoriumInterest = options?.moratoriumInterest ?? 'serviced';
  const repaymentType = options?.repaymentType ?? 'equal_principal';
  const roundToDecimals = options?.roundToDecimals ?? true;

  const round = roundToDecimals ? round2 : (x: number) => x;

  // Handle non-positive margin gracefully
  if (availableMargin <= 0 || isNaN(availableMargin)) {
    return {
      isEligible: false,
      beyondSchemeLimits: true,
      status: 'beyond_scheme_limits',
      message: 'Available margin must be greater than zero.',
      availableMargin: availableMargin || 0,
      projectCost: 0,
      cappedByScheme: false,
      shortfall: 0,
      ownContributionShortfall: 0,
      assumptions: [
        'Available margin provided is zero, negative, or invalid.',
        'A positive promoter margin is required to compute project cost and scheme eligibility.',
      ],
    };
  }

  // Core formula: projectCost = availableMargin / 0.10
  const projectCost = round(availableMargin / 0.10);
  const maxLoan = round(0.90 * projectCost);

  // Scheme routing
  if (projectCost > MAX_ELIGIBLE_PROJECT_COST) {
    return {
      isEligible: false,
      beyondSchemeLimits: true,
      status: 'beyond_scheme_limits',
      message: `Project cost of ₹${projectCost.toLocaleString('en-IN')} exceeds maximum scheme limit of ₹${MAX_ELIGIBLE_PROJECT_COST.toLocaleString('en-IN')}.`,
      availableMargin,
      projectCost,
      maxLoan,
      cappedByScheme: false,
      shortfall: 0,
      ownContributionShortfall: 0,
      totalPromoterContribution: availableMargin,
      assumptions: [
        `Project cost is calculated as available margin (₹${availableMargin.toLocaleString('en-IN')}) / 0.10 = ₹${projectCost.toLocaleString('en-IN')}.`,
        `Project cost exceeds the maximum allowable ceiling of ₹${MAX_ELIGIBLE_PROJECT_COST.toLocaleString('en-IN')} under government MSME schemes.`,
        'Government subsidy / interest subvention schemes (Micro Finance & Term Loan) do not apply above ₹50,00,000 project cost.',
        'Alternative options include commercial bank consortium financing or SIDBI direct credit.',
      ],
    };
  }

  const scheme: SchemeConfig =
    projectCost <= SCHEME_CONFIGS.MICRO.maxProjectCost
      ? SCHEME_CONFIGS.MICRO
      : SCHEME_CONFIGS.TERM_LOAN;

  // Apply loan cap: loan = min(0.90 * projectCost, schemeMaxLoan)
  const cappedByScheme = maxLoan > scheme.schemeMaxLoan;
  const loan = cappedByScheme ? scheme.schemeMaxLoan : maxLoan;
  const shortfall = cappedByScheme ? round(maxLoan - scheme.schemeMaxLoan) : 0;
  const totalPromoterContribution = round(availableMargin + shortfall);

  // Repayment parameters
  const totalQuarters = scheme.tenureYears * 4;
  const moratoriumQuarters = Math.round(scheme.moratoriumMonths / 3);
  const repaymentQuarters = totalQuarters - moratoriumQuarters;
  const quarterlyRate = (scheme.annualInterestRatePct / 100) / 4;

  // Generate repayment schedule
  const schedule: RepaymentQuarterRow[] = [];
  let currentBalance = loan;

  // 1. Moratorium quarters
  for (let q = 1; q <= moratoriumQuarters; q++) {
    const openingBalance = round(currentBalance);
    const interest = round(openingBalance * quarterlyRate);
    let principal = 0;
    let totalPayment = 0;
    let closingBalance = openingBalance;

    if (moratoriumInterest === 'serviced') {
      principal = 0;
      totalPayment = interest;
      closingBalance = openingBalance;
    } else {
      // capitalised: interest is added to loan principal
      principal = 0;
      totalPayment = 0;
      closingBalance = round(openingBalance + interest);
    }

    currentBalance = closingBalance;

    schedule.push({
      quarter: q,
      openingBalance,
      interest,
      principal,
      totalPayment,
      closingBalance,
      isMoratorium: true,
      installment: totalPayment,
    });
  }

  // 2. Post-moratorium repayment quarters
  const balanceToAmortize = currentBalance;

  if (repaymentType === 'equal_principal') {
    const baseQuarterlyPrincipal = balanceToAmortize / repaymentQuarters;

    for (let q = moratoriumQuarters + 1; q <= totalQuarters; q++) {
      const isLastQuarter = q === totalQuarters;
      const openingBalance = round(currentBalance);
      const interest = round(openingBalance * quarterlyRate);

      let principal: number;
      let closingBalance: number;

      if (isLastQuarter) {
        // Guarantee closing balance is exactly 0 at the end
        principal = openingBalance;
        closingBalance = 0;
      } else {
        principal = round(baseQuarterlyPrincipal);
        closingBalance = round(openingBalance - principal);
      }

      const totalPayment = round(principal + interest);
      currentBalance = closingBalance;

      schedule.push({
        quarter: q,
        openingBalance,
        interest,
        principal,
        totalPayment,
        closingBalance,
        isMoratorium: false,
        installment: totalPayment,
      });
    }
  } else {
    // Quarterly EMI formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const factor = Math.pow(1 + quarterlyRate, repaymentQuarters);
    const quarterlyEMI =
      quarterlyRate === 0
        ? balanceToAmortize / repaymentQuarters
        : (balanceToAmortize * quarterlyRate * factor) / (factor - 1);

    for (let q = moratoriumQuarters + 1; q <= totalQuarters; q++) {
      const isLastQuarter = q === totalQuarters;
      const openingBalance = round(currentBalance);
      const interest = round(openingBalance * quarterlyRate);

      let principal: number;
      let closingBalance: number;
      let totalPayment: number;

      if (isLastQuarter) {
        principal = openingBalance;
        closingBalance = 0;
        totalPayment = round(principal + interest);
      } else {
        principal = round(quarterlyEMI - interest);
        closingBalance = round(openingBalance - principal);
        totalPayment = round(principal + interest);
      }

      currentBalance = closingBalance;

      schedule.push({
        quarter: q,
        openingBalance,
        interest,
        principal,
        totalPayment,
        closingBalance,
        isMoratorium: false,
        installment: totalPayment,
      });
    }
  }

  // Assumptions list
  const assumptions: string[] = [
    `Project cost is derived as available promoter margin (₹${availableMargin.toLocaleString('en-IN')}) divided by 0.10 = ₹${projectCost.toLocaleString('en-IN')} (assumes 10% base own contribution).`,
    scheme.schemeType === 'Micro'
      ? `Routed to Micro Finance Scheme (cost <= ₹1,40,000): up to 90% financing, max loan ₹1,25,000, 6.5% p.a. interest, 3-year tenure (12 quarters) with a 3-month (1 quarter) moratorium.`
      : `Routed to Term Loan Scheme (₹1,40,000 < cost <= ₹50,00,000): up to 90% financing, max loan ₹45,00,000, 8.0% p.a. interest, 7-year tenure (28 quarters) with a 6-month (2 quarters) moratorium.`,
    cappedByScheme
      ? `Loan is capped at the scheme limit of ₹${scheme.schemeMaxLoan.toLocaleString('en-IN')} (calculated 90% was ₹${maxLoan.toLocaleString('en-IN')}), creating an own-contribution shortfall of ₹${shortfall.toLocaleString('en-IN')} to be funded by the promoter.`
      : `Loan of ₹${loan.toLocaleString('en-IN')} (90% of project cost) is within the scheme limit of ₹${scheme.schemeMaxLoan.toLocaleString('en-IN')}.`,
    `Repayment schedule is quarterly across ${totalQuarters} quarters (${scheme.tenureYears} years).`,
    moratoriumInterest === 'serviced'
      ? `During the ${moratoriumQuarters} moratorium quarter(s), quarterly interest is serviced with zero principal deduction.`
      : `During the ${moratoriumQuarters} moratorium quarter(s), interest is capitalised and added to the loan balance.`,
    repaymentType === 'equal_principal'
      ? `Post-moratorium principal is amortized in equal quarterly instalments over ${repaymentQuarters} quarters.`
      : `Post-moratorium repayment follows an equated quarterly instalment (quarterly EMI) structure over ${repaymentQuarters} quarters.`,
    `Final closing balance is strictly ₹0 at quarter ${totalQuarters}.`,
  ];

  return {
    isEligible: true,
    beyondSchemeLimits: false,
    status: 'eligible',
    availableMargin,
    projectCost,
    maxLoan,
    loan,
    loanAmount: loan,
    schemeName: scheme.schemeName,
    scheme: scheme.schemeName,
    schemeType: scheme.schemeType,
    schemeMaxLoan: scheme.schemeMaxLoan,
    interestRate: scheme.annualInterestRatePct,
    interestRatePct: scheme.annualInterestRatePct,
    tenureYears: scheme.tenureYears,
    moratoriumMonths: scheme.moratoriumMonths,
    totalQuarters,
    moratoriumQuarters,
    repaymentQuarters,
    cappedByScheme,
    shortfall,
    ownContributionShortfall: shortfall,
    totalPromoterContribution,
    schedule,
    repaymentSchedule: schedule,
    assumptions,
    options: {
      moratoriumInterest,
      repaymentType,
      roundToDecimals,
    },
  };
}

/**
 * Alias for calculatePS for clarity and naming flexibility.
 */
export const calculatePSScheme = calculatePS;
