import { ExistingBusinessDiagnosis, ExistingBusinessInput } from '../types';
import { calculateDSCR, calculateEMI, formatINR, getSafetyRating } from './financialEngine';

export function diagnoseExistingBusiness(input: ExistingBusinessInput): ExistingBusinessDiagnosis {
  const currentMonthlyProfit = input.monthlyRevenue - input.monthlyExpenses;
  const profitMarginPct = input.monthlyRevenue > 0 
    ? Math.round((currentMonthlyProfit / input.monthlyRevenue) * 100) 
    : 0;

  let financialHealth: 'Healthy' | 'Vulnerable' | 'Stressed' = 'Healthy';
  if (profitMarginPct < 8 || currentMonthlyProfit < 20000) {
    financialHealth = 'Stressed';
  } else if (profitMarginPct < 16) {
    financialHealth = 'Vulnerable';
  }

  // Diagnostics points based on inputs
  const diagnostics: string[] = [];
  if (profitMarginPct >= 20) {
    diagnostics.push(`Strong operating margin of ${profitMarginPct}% indicates healthy unit economics and loyal local customer retention.`);
  } else if (profitMarginPct >= 10) {
    diagnostics.push(`Moderate operating margin of ${profitMarginPct}%. Raw material procurement or utility overheads may be eroding bottom-line profitability.`);
  } else {
    diagnostics.push(`Thin operating margin of ${profitMarginPct}% (${formatINR(currentMonthlyProfit)}/month) leaves minimal cash cushion for inventory delays or slow festive months.`);
  }

  const expenseRatio = input.monthlyRevenue > 0 ? Math.round((input.monthlyExpenses / input.monthlyRevenue) * 100) : 0;
  diagnostics.push(`Operating expenses consume ${expenseRatio}% of gross revenues. Benchmarking indicates peer units in this category typically operate at 72-78%.`);

  if (input.existingDebtMonthlyEMI > 0) {
    const dscr = calculateDSCR(currentMonthlyProfit, input.existingDebtMonthlyEMI);
    diagnostics.push(`Current debt service coverage is ${dscr}x (${getSafetyRating(dscr)}) against existing monthly EMI obligations of ${formatINR(input.existingDebtMonthlyEMI)}.`);
  } else {
    diagnostics.push('Zero existing debt obligations: Strong foundation to leverage concessional MSME bank credit for expansion.');
  }

  // Profit opportunities
  const profitOpportunities = [
    {
      title: 'Direct Vendor Bulk Procurement Renegotiation',
      estimatedGainMonthly: Math.round(input.monthlyRevenue * 0.035),
      effort: 'Quick Win' as const
    },
    {
      title: 'High-Margin Product Category Introduction',
      estimatedGainMonthly: Math.round(input.monthlyRevenue * 0.05),
      effort: 'Quick Win' as const
    },
    {
      title: 'Digital Ordering & Loyalty WhatsApp Automation',
      estimatedGainMonthly: Math.round(input.monthlyRevenue * 0.04),
      effort: 'Medium Term' as const
    },
    {
      title: 'Energy & Waste Overhead Optimization',
      estimatedGainMonthly: Math.round(input.monthlyRevenue * 0.02),
      effort: 'Quick Win' as const
    }
  ];

  // Tailor expansion recommendation by goal
  let expansionTitle = 'Phase 2 Outlet / Micro-Market Expansion';
  let requiredCapital = Math.round(input.monthlyRevenue * 3.5);
  let recommendedFinancing = 'PM MUDRA (Tarun) / PMEGP Expansion Route';

  if (input.primaryGoal === 'Improve profit') {
    expansionTitle = 'Operations & Procurement Streamlining (Zero New Debt)';
    requiredCapital = Math.round(input.monthlyRevenue * 0.8);
    recommendedFinancing = 'Internal Cash Flow Reinvestment + Working Capital CC Limit';
  } else if (input.primaryGoal === 'Add products') {
    expansionTitle = 'Product Line Diversification & Specialized Machinery';
    requiredCapital = Math.round(input.monthlyRevenue * 1.5);
    recommendedFinancing = 'MUDRA Kishore Term Loan (9.5% p.a., 36 months)';
  } else if (input.primaryGoal === 'Open another outlet') {
    expansionTitle = 'Second High-Footfall Commercial Outlet Launch';
    requiredCapital = Math.round(input.monthlyRevenue * 4.0);
    recommendedFinancing = 'CGTMSE Collateral-Free Term Loan + PMEGP 2nd Loan (up to ₹1 Crore)';
  } else if (input.primaryGoal === 'Expand distribution') {
    expansionTitle = 'Wholesale & B2B Institutional Supply Network';
    requiredCapital = Math.round(input.monthlyRevenue * 2.2);
    recommendedFinancing = 'SIDBI Working Capital Assistance & Bank Overdraft';
  }

  // Calculate debt and safety for expansion
  const expansionLoan = Math.round(requiredCapital * 0.75); // 75% debt, 25% own reserves
  const expansionEMI = calculateEMI(expansionLoan, 9.5, 4);
  const projectedNewSurplus = Math.round(currentMonthlyProfit * 1.45 - expansionEMI);
  const expansionDSCR = calculateDSCR(Math.round(currentMonthlyProfit * 1.45), expansionEMI + input.existingDebtMonthlyEMI);
  const expansionSafety = getSafetyRating(expansionDSCR);

  const actionChecklist = [
    `Formalize existing financial statements and file last 2 years ITR to establish bank creditworthiness.`,
    `Ensure Udyam MSME certificate is updated with active turnover figures.`,
    `Identify target expansion micro-location with confirmed commercial footfall metrics.`,
    `Apply for subsidized credit under ${recommendedFinancing} to minimize interest drag.`,
    `Deploy a cloud billing & inventory software to track unit margins across all product categories.`
  ];

  return {
    currentMonthlyProfit,
    profitMarginPct,
    financialHealth,
    diagnostics,
    profitOpportunities,
    expansionRecommendation: {
      title: expansionTitle,
      requiredCapital,
      recommendedFinancing,
      newMonthlySurplus: projectedNewSurplus,
      expansionSafety,
      actionChecklist
    }
  };
}
