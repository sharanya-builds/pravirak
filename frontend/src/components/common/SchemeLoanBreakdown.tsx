import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Download,
  Calendar,
  Percent,
  Clock,
  Landmark,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  calculatePS,
  PSCalculatorResult,
  PSCalculatorEligibleResult,
  MoratoriumInterestTreatment,
  RepaymentType,
  RepaymentQuarterRow
} from '../../engine/psCalculator';

export interface SchemeLoanBreakdownProps {
  result: PSCalculatorResult;
  availableMargin?: number;
  businessCategory?: string;
  locationSummary?: string;
  printMode?: 'short' | 'full';
  isPrintAppendix?: boolean;
  onOptionChange?: (options: {
    moratoriumInterest: MoratoriumInterestTreatment;
    repaymentType: RepaymentType;
  }) => void;
  className?: string;
}

export const SchemeLoanBreakdown: React.FC<SchemeLoanBreakdownProps> = ({
  result: initialResult,
  availableMargin,
  businessCategory,
  locationSummary,
  printMode,
  isPrintAppendix = false,
  onOptionChange,
  className = ''
}) => {
  const { t } = useLanguage();

  const [moratoriumInterest, setMoratoriumInterest] = useState<MoratoriumInterestTreatment>('serviced');
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('equal_principal');
  const [isAssumptionsExpanded, setIsAssumptionsExpanded] = useState<boolean>(true);
  const [isFullScheduleOpen, setIsFullScheduleOpen] = useState<boolean>(false);
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

  // If availableMargin is provided and initialResult was eligible, recalculate dynamically on option toggles
  const calculationResult: PSCalculatorResult = useMemo(() => {
    if (availableMargin !== undefined && availableMargin > 0 && initialResult.isEligible) {
      return calculatePS(availableMargin, {
        moratoriumInterest,
        repaymentType
      });
    }
    return initialResult;
  }, [availableMargin, initialResult, moratoriumInterest, repaymentType]);

  const handleMoratoriumChange = (treatment: MoratoriumInterestTreatment) => {
    setMoratoriumInterest(treatment);
    onOptionChange?.({ moratoriumInterest: treatment, repaymentType });
  };

  const handleRepaymentTypeChange = (type: RepaymentType) => {
    setRepaymentType(type);
    onOptionChange?.({ moratoriumInterest, repaymentType: type });
  };

  // Schedule totals
  const scheduleTotals = useMemo(() => {
    if (!calculationResult.isEligible) {
      return { totalInterest: 0, totalPrincipal: 0, totalPaid: 0 };
    }
    return calculationResult.schedule.reduce(
      (acc, r) => ({
        totalInterest: acc.totalInterest + r.interest,
        totalPrincipal: acc.totalPrincipal + r.principal,
        totalPaid: acc.totalPaid + r.totalPayment
      }),
      { totalInterest: 0, totalPrincipal: 0, totalPaid: 0 }
    );
  }, [calculationResult]);

  // Why selected one-liner
  const whySelectedText = useMemo(() => {
    if (!calculationResult.isEligible) return '';
    if (calculationResult.schemeType === 'Term Loan') {
      return `Project cost ₹${calculationResult.projectCost.toLocaleString('en-IN')} is above ₹1.40 Lakh threshold, qualifying for Term Loan Scheme (up to ₹50 Lakh).`;
    }
    return `Project cost ₹${calculationResult.projectCost.toLocaleString('en-IN')} is within the ₹1.40 Lakh ceiling, qualifying for Micro Finance Scheme.`;
  }, [calculationResult]);

  // Compact Summary Figures (from psCalculator output)
  const compactSummary = useMemo(() => {
    if (!calculationResult.isEligible) return null;
    const eligible = calculationResult as PSCalculatorEligibleResult;
    const moratoriumRows = eligible.schedule.filter((r) => r.isMoratorium);
    const amortRows = eligible.schedule.filter((r) => !r.isMoratorium);
    const moratoriumQuartersCount = moratoriumRows.length;
    const moratoriumQuarterlyPayment = moratoriumRows.length > 0 ? moratoriumRows[0].totalPayment : 0;
    const firstFullPayment = amortRows.length > 0 ? amortRows[0].totalPayment : 0;
    const finalPayment = eligible.schedule.length > 0 ? eligible.schedule[eligible.schedule.length - 1].totalPayment : 0;

    return {
      schemeName: eligible.schemeName,
      schemeType: eligible.schemeType,
      interestRatePct: eligible.interestRatePct,
      tenureYears: eligible.tenureYears,
      totalQuarters: eligible.totalQuarters,
      moratoriumMonths: eligible.moratoriumMonths,
      moratoriumQuartersCount,
      moratoriumQuarterlyPayment,
      firstFullPayment,
      finalPayment,
      totalInterest: scheduleTotals.totalInterest,
      totalRepaid: scheduleTotals.totalPaid
    };
  }, [calculationResult, scheduleTotals]);

  // Year Grouping (Year 1 ... Year 7)
  const years = useMemo(() => {
    if (!calculationResult.isEligible) return [];
    const eligible = calculationResult as PSCalculatorEligibleResult;
    const numYears = Math.ceil(eligible.totalQuarters / 4);
    const result: Array<{
      year: number;
      quarters: RepaymentQuarterRow[];
      totalPayment: number;
      totalInterest: number;
      totalPrincipal: number;
      closingBalance: number;
      hasMoratorium: boolean;
    }> = [];

    for (let y = 1; y <= numYears; y++) {
      const quarters = eligible.schedule.filter((r) => Math.ceil(r.quarter / 4) === y);
      if (quarters.length === 0) continue;
      const totalPayment = quarters.reduce((sum, r) => sum + r.totalPayment, 0);
      const totalInterest = quarters.reduce((sum, r) => sum + r.interest, 0);
      const totalPrincipal = quarters.reduce((sum, r) => sum + r.principal, 0);
      const closingBalance = quarters[quarters.length - 1].closingBalance;
      const hasMoratorium = quarters.some((r) => r.isMoratorium);

      result.push({
        year: y,
        quarters,
        totalPayment,
        totalInterest,
        totalPrincipal,
        closingBalance,
        hasMoratorium
      });
    }

    return result;
  }, [calculationResult]);

  const toggleYear = (y: number) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(y)) next.delete(y);
      else next.add(y);
      return next;
    });
  };

  const expandAllYears = () => {
    setExpandedYears(new Set(years.map((y) => y.year)));
  };

  const collapseAllYears = () => {
    setExpandedYears(new Set());
  };

  // CSV download
  const handleDownloadCsv = () => {
    if (!calculationResult.isEligible) return;

    const headers = [
      'Quarter',
      'Opening Balance (INR)',
      'Interest (INR)',
      'Principal (INR)',
      'Total Payment (INR)',
      'Closing Balance (INR)',
      'Period Type'
    ];

    const rows: RepaymentQuarterRow[] = calculationResult.schedule;

    const csvLines = [
      `# PRAVIRAK Government Scheme Loan Repayment Schedule`,
      ...(businessCategory ? [`# Business Category: ${businessCategory}`] : []),
      ...(locationSummary ? [`# Location: ${locationSummary}`] : []),
      `# Scheme: ${calculationResult.schemeName}`,
      `# Project Cost: ${calculationResult.projectCost}`,
      `# Loan Amount: ${calculationResult.loanAmount}`,
      `# Moratorium Interest Treatment: ${moratoriumInterest}`,
      `# Amortization Style: ${repaymentType}`,
      headers.join(','),
      ...rows.map((r) =>
        [
          r.quarter,
          r.openingBalance,
          r.interest,
          r.principal,
          r.totalPayment,
          r.closingBalance,
          r.isMoratorium ? 'Moratorium' : 'Amortization'
        ].join(',')
      ),
      [
        'Total',
        '',
        scheduleTotals.totalInterest.toFixed(2),
        scheduleTotals.totalPrincipal.toFixed(2),
        scheduleTotals.totalPaid.toFixed(2),
        '0',
        ''
      ].join(',')
    ];

    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    try {
      if (typeof URL.createObjectURL === 'function') {
        const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `pravirak_scheme_loan_${calculationResult.schemeType.toLowerCase().replace(/\s+/g, '_')}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch {
      // Safe fallback for testing environments
    }
  };

  // Case: Beyond Scheme Limits or Not Eligible
  if (!calculationResult.isEligible || calculationResult.beyondSchemeLimits) {
    return (
      <div className={`space-y-4 ${className}`} data-testid="scheme-loan-beyond-limits">
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-extrabold text-rose-900 dark:text-rose-200">
                {t.beyondLimitsNoticeTitle}
              </h3>
              <p className="text-sm font-semibold text-rose-800 dark:text-rose-300 mt-1" data-testid="beyond-limits-message">
                {calculationResult.message}
              </p>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-black/30 rounded-2xl p-4 text-xs text-rose-950 dark:text-rose-200 space-y-1.5">
            <p className="font-bold">{t.observationsLabel}</p>
            <ul className="list-disc pl-5 space-y-1">
              {calculationResult.assumptions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const eligible = calculationResult as PSCalculatorEligibleResult;

  // Print Appendix Mode: Render only the complete quarter-by-quarter repayment schedule table
  if (isPrintAppendix) {
    return (
      <div className={`space-y-4 ${className}`} data-testid="print-appendix-schedule">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-300 dark:border-neutral-700" data-testid="appendix-repayment-table">
            <thead>
              <tr className="border-b border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 font-bold">
                <th className="py-2 px-2.5">Period</th>
                <th className="py-2 px-2.5">Status</th>
                <th className="py-2 px-2.5 text-right">{t.thOpeningBalance} (₹)</th>
                <th className="py-2 px-2.5 text-right">{t.thInterest} (₹)</th>
                <th className="py-2 px-2.5 text-right">{t.thPrincipal} (₹)</th>
                <th className="py-2 px-2.5 text-right font-black">{t.thTotalPayment} (₹)</th>
                <th className="py-2 px-2.5 text-right">{t.thClosingBalance} (₹)</th>
              </tr>
            </thead>
            <tbody>
              {eligible.schedule.map((row) => (
                <tr
                  key={row.quarter}
                  className={`border-b border-slate-200 dark:border-neutral-800 ${
                    row.isMoratorium ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''
                  }`}
                >
                  <td className="py-1.5 px-2.5 font-mono font-semibold">Q{row.quarter}</td>
                  <td className="py-1.5 px-2.5 text-[11px]">
                    {row.isMoratorium ? (
                      <span className="font-bold text-amber-800 dark:text-amber-400 uppercase text-[10px]">
                        Moratorium
                      </span>
                    ) : (
                      <span className="text-slate-600 dark:text-neutral-400">Regular</span>
                    )}
                  </td>
                  <td className="py-1.5 px-2.5 text-right font-mono">₹{row.openingBalance.toLocaleString('en-IN')}</td>
                  <td className="py-1.5 px-2.5 text-right font-mono text-amber-900 dark:text-amber-300">₹{row.interest.toLocaleString('en-IN')}</td>
                  <td className="py-1.5 px-2.5 text-right font-mono">₹{row.principal.toLocaleString('en-IN')}</td>
                  <td className="py-1.5 px-2.5 text-right font-mono font-bold">₹{row.totalPayment.toLocaleString('en-IN')}</td>
                  <td className="py-1.5 px-2.5 text-right font-mono">₹{row.closingBalance.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-800 dark:border-neutral-400 bg-slate-100 dark:bg-neutral-850 font-black text-slate-950 dark:text-white">
                <td colSpan={3} className="py-2 px-2.5 uppercase text-[10px] tracking-wide">
                  Total Lifetime Repayment
                </td>
                <td className="py-2 px-2.5 text-right font-mono text-amber-900 dark:text-amber-300">
                  ₹{scheduleTotals.totalInterest.toLocaleString('en-IN')}
                </td>
                <td className="py-2 px-2.5 text-right font-mono">
                  ₹{scheduleTotals.totalPrincipal.toLocaleString('en-IN')}
                </td>
                <td className="py-2 px-2.5 text-right font-mono">
                  ₹{scheduleTotals.totalPaid.toLocaleString('en-IN')}
                </td>
                <td className="py-2 px-2.5 text-right font-mono">₹0</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }


  return (
    <div className={`space-y-6 ${className}`} data-testid="scheme-loan-breakdown">
      {/* Three Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Project Cost */}
        <div
          className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-1"
          data-testid="card-project-cost"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
            {t.projectCostCardTitle}
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white" data-testid="val-project-cost">
            ₹{eligible.projectCost.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-700 dark:text-neutral-300 font-medium">
            {t.projectCostCardDesc}
          </p>
        </div>

        {/* Maximum Loan */}
        <div
          className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-1"
          data-testid="card-max-loan"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
            {t.maxLoanCardTitle}
          </span>
          <div className="text-2xl font-black text-indigo-950 dark:text-indigo-400" data-testid="val-max-loan">
            ₹{eligible.loanAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-700 dark:text-neutral-300 font-medium">
            {eligible.cappedByScheme
              ? `Capped at scheme ceiling of ₹${eligible.schemeMaxLoan.toLocaleString('en-IN')}`
              : t.maxLoanCardDesc}
          </p>
        </div>

        {/* Own Contribution */}
        <div
          className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-1"
          data-testid="card-own-contribution"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
            {t.ownContributionCardTitle}
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white" data-testid="val-own-contribution">
            ₹{eligible.totalPromoterContribution.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-700 dark:text-neutral-300 font-medium">
            {eligible.cappedByScheme
              ? `Includes ₹${eligible.shortfall.toLocaleString('en-IN')} cap shortfall`
              : t.ownContributionCardDesc}
          </p>
        </div>
      </div>

      {/* Scheme Card */}
      <div
        className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4"
        data-testid="scheme-card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-950 dark:text-indigo-400" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white" data-testid="scheme-name">
              {eligible.schemeName}
            </h3>
          </div>
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
            data-testid="scheme-type-badge"
          >
            {eligible.schemeType}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 dark:bg-[#141414] p-3 rounded-xl border border-slate-100 dark:border-neutral-800">
            <span className="text-slate-700 dark:text-neutral-300 font-medium flex items-center gap-1.5 mb-1">
              <Percent className="w-3.5 h-3.5 text-indigo-950 dark:text-indigo-400" />
              {t.schemeRateLabel}
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white" data-testid="scheme-rate">
              {eligible.interestRatePct}% p.a.
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-[#141414] p-3 rounded-xl border border-slate-100 dark:border-neutral-800">
            <span className="text-slate-700 dark:text-neutral-300 font-medium flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-950 dark:text-indigo-400" />
              {t.schemeTenureLabel}
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white" data-testid="scheme-tenure">
              {eligible.tenureYears} Years ({eligible.totalQuarters} Quarters)
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-[#141414] p-3 rounded-xl border border-slate-100 dark:border-neutral-800">
            <span className="text-slate-700 dark:text-neutral-300 font-medium flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-950 dark:text-indigo-400" />
              {t.schemeMoratoriumLabel}
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white" data-testid="scheme-moratorium">
              {eligible.moratoriumMonths} Months ({eligible.moratoriumQuarters} Quarter{eligible.moratoriumQuarters > 1 ? 's' : ''})
            </span>
          </div>
        </div>

        {/* Routing Reason */}
        <div
          className="bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3 text-xs text-indigo-950 dark:text-indigo-200"
          data-testid="scheme-reason"
        >
          <span className="font-bold mr-1">{t.selectionReasonLabel}</span>
          <span>{whySelectedText}</span>
        </div>
      </div>

      {/* Capped By Scheme Notice (if applicable) */}
      {eligible.cappedByScheme && (
        <div
          className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-5 space-y-2"
          data-testid="cap-notice"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
            <h4 className="text-xs sm:text-sm font-extrabold text-amber-950 dark:text-amber-200">
              {t.capNoticeTitle}
            </h4>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
            The calculated 90% loan entitlement is{' '}
            <strong>₹{eligible.maxLoan.toLocaleString('en-IN')}</strong>, but the scheme imposes a maximum ceiling of{' '}
            <strong>₹{eligible.schemeMaxLoan.toLocaleString('en-IN')}</strong>.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-semibold pt-1 text-amber-950 dark:text-amber-200">
            <div data-testid="cap-shortfall">
              {t.shortfallAmountLabel}:{' '}
              <span className="font-black text-rose-600 dark:text-rose-400">
                ₹{eligible.shortfall.toLocaleString('en-IN')}
              </span>
            </div>
            <div data-testid="cap-total-promoter">
              {t.totalRequiredContribution}:{' '}
              <span className="font-black">
                ₹{eligible.totalPromoterContribution.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 1. Compact Summary Card (Default View) */}
      {compactSummary && (
        <div
          data-testid="compact-repayment-summary"
          className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-neutral-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                {t.compactSummaryTitle || 'Repayment Summary'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white" data-testid="compact-scheme-name">
                {compactSummary.schemeName}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" data-testid="compact-rate">
                {compactSummary.interestRatePct}% p.a.
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800" data-testid="compact-tenure">
                {compactSummary.tenureYears} Years ({compactSummary.totalQuarters} Quarters)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-[#141414] p-3 rounded-xl border border-slate-100 dark:border-neutral-800">
              <span className="text-slate-500 dark:text-neutral-400 font-medium block text-[11px] mb-0.5">
                {t.schemeMoratoriumLabel}
              </span>
              <strong className="text-slate-900 dark:text-white text-xs sm:text-sm font-black block" data-testid="compact-moratorium">
                {compactSummary.moratoriumMonths} Months
              </strong>
              <span className="text-[10px] text-slate-500 dark:text-neutral-400">
                ({compactSummary.moratoriumQuartersCount} {compactSummary.moratoriumQuartersCount === 1 ? 'Quarter' : 'Quarters'})
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-[#141414] p-3 rounded-xl border border-slate-100 dark:border-neutral-800">
              <span className="text-slate-500 dark:text-neutral-400 font-medium block text-[11px] mb-0.5">
                {t.interestOnlyQuarters || 'Interest-only Quarters'}
              </span>
              <strong className="text-slate-900 dark:text-white text-xs sm:text-sm font-black block font-mono" data-testid="compact-interest-only">
                {compactSummary.moratoriumQuarterlyPayment.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </strong>
              <span className="text-[10px] text-slate-500 dark:text-neutral-400">
                per quarter ({compactSummary.moratoriumQuartersCount} qtrs)
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-[#141414] p-3 rounded-xl border border-slate-100 dark:border-neutral-800">
              <span className="text-slate-500 dark:text-neutral-400 font-medium block text-[11px] mb-0.5">
                {t.firstPaymentAfterMoratorium || 'First payment after moratorium'}
              </span>
              <strong className="text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-black block font-mono" data-testid="compact-first-payment">
                {compactSummary.firstFullPayment.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </strong>
              <span className="text-[10px] text-slate-500 dark:text-neutral-400">
                Principal + Interest
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-[#141414] p-3 rounded-xl border border-slate-100 dark:border-neutral-800">
              <span className="text-slate-500 dark:text-neutral-400 font-medium block text-[11px] mb-0.5">
                {t.finalPayment || 'Final Payment'}
              </span>
              <strong className="text-slate-900 dark:text-white text-xs sm:text-sm font-black block font-mono" data-testid="compact-final-payment">
                {compactSummary.finalPayment.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </strong>
              <span className="text-[10px] text-slate-500 dark:text-neutral-400">
                Q{compactSummary.totalQuarters} final closing
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-neutral-800 text-xs">
            <div className="flex items-center justify-between p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/40">
              <span className="font-bold text-amber-950 dark:text-amber-200">
                {t.totalInterest || 'Total Interest'}:
              </span>
              <strong className="font-mono text-amber-800 dark:text-amber-300 font-black text-sm" data-testid="compact-total-interest">
                {compactSummary.totalInterest.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </strong>
            </div>
            <div className="flex items-center justify-between p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <span className="font-bold text-indigo-950 dark:text-indigo-200">
                {t.totalRepaid || 'Total Repaid'}:
              </span>
              <strong className="font-mono text-indigo-950 dark:text-indigo-300 font-black text-sm" data-testid="compact-total-repaid">
                {compactSummary.totalRepaid.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* 2. Collapsible Schedule Section (Collapsed by Default) */}
      <div
        className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4"
        data-testid="schedule-section"
      >
        {/* Toggle Bar with CSV Download always visible outside */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-neutral-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="toggle-full-schedule"
              onClick={() => setIsFullScheduleOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold text-slate-900 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              {isFullScheduleOpen ? (
                <>
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                  <span>{t.hideFullSchedule || 'Hide full schedule'}</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                  <span>
                    {(t.viewFullSchedule || 'View full schedule ({n} quarters)').replace('{n}', String(eligible.totalQuarters))}
                  </span>
                </>
              )}
            </button>
            {isFullScheduleOpen && (
              <button
                type="button"
                data-testid="toggle-expand-all-years"
                onClick={expandedYears.size === years.length ? collapseAllYears : expandAllYears}
                className="px-3 py-2 rounded-xl text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-100 dark:border-indigo-800 transition-colors cursor-pointer"
              >
                {expandedYears.size === years.length
                  ? (t.collapseAllYears || 'Collapse all years')
                  : (t.expandAllYears || 'Expand all years')}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-950 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-100 dark:border-indigo-800 transition-colors cursor-pointer shrink-0"
            data-testid="download-csv-button"
          >
            <Download className="w-3.5 h-3.5" />
            {t.downloadCsvButton}
          </button>
        </div>

        {/* Year-by-Year Expandable Table (visible when isFullScheduleOpen is true, or in print when printMode === 'full') */}
        <div className={`${isFullScheduleOpen ? 'block' : 'hidden'} ${printMode === 'full' ? 'print:block' : 'print:hidden'}`}>
          {/* Mobile-first horizontal scroll table */}
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-5 sm:px-0">
              <table className="min-w-[650px] w-full text-xs text-left border-collapse" data-testid="repayment-table">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 font-bold bg-slate-50/70 dark:bg-[#141414]">
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3 text-right">{t.thOpeningBalance} (₹)</th>
                    <th className="py-2.5 px-3 text-right">{t.thInterest} (₹)</th>
                    <th className="py-2.5 px-3 text-right">{t.thPrincipal} (₹)</th>
                    <th className="py-2.5 px-3 text-right font-extrabold text-slate-900 dark:text-white">
                      {t.thTotalPayment} (₹)
                    </th>
                    <th className="py-2.5 px-3 text-right">{t.thClosingBalance} (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                  {years.map((yearGroup) => {
                    const isExpanded = expandedYears.has(yearGroup.year);
                    return (
                      <React.Fragment key={`year-${yearGroup.year}`}>
                        {/* Year summary row */}
                        <tr
                          data-testid={`year-row-${yearGroup.year}`}
                          onClick={() => toggleYear(yearGroup.year)}
                          className="bg-slate-100/80 dark:bg-[#1A1A1A] hover:bg-slate-200/80 dark:hover:bg-[#222222] font-bold cursor-pointer transition-colors border-t border-b border-slate-200 dark:border-neutral-800"
                        >
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                              )}
                              <span className="text-slate-900 dark:text-white font-extrabold">
                                {(t.yearLabel || 'Year {y}').replace('{y}', String(yearGroup.year))}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-neutral-400 font-normal ml-1">
                                (Q{(yearGroup.year - 1) * 4 + 1}–Q{Math.min(yearGroup.year * 4, eligible.totalQuarters)})
                              </span>
                              {yearGroup.hasMoratorium && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 ml-1">
                                  {t.moratoriumBadge}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-500 dark:text-neutral-400">
                            {yearGroup.quarters[0].openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-amber-700 dark:text-amber-400">
                            {yearGroup.totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700 dark:text-neutral-300">
                            {yearGroup.totalPrincipal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-black text-indigo-950 dark:text-indigo-300" data-testid={`year-total-payment-${yearGroup.year}`}>
                            {yearGroup.totalPayment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white" data-testid={`year-closing-balance-${yearGroup.year}`}>
                            {yearGroup.closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>

                        {/* Quarter detail rows when year is expanded */}
                        {isExpanded &&
                          yearGroup.quarters.map((row) => (
                            <tr
                              key={row.quarter}
                              className={`transition-colors ${
                                row.isMoratorium
                                  ? 'bg-amber-50/40 dark:bg-amber-950/20 font-medium'
                                  : 'hover:bg-slate-50/80 dark:hover:bg-[#141414] bg-white dark:bg-[#0D0D0D]'
                              }`}
                              data-testid={`row-quarter-${row.quarter}`}
                              data-moratorium={row.isMoratorium ? 'true' : 'false'}
                            >
                              <td className="py-2 px-3 pl-8 whitespace-nowrap">
                                <span className="font-bold text-slate-900 dark:text-white mr-1.5">
                                  Q{row.quarter}
                                </span>
                                {row.isMoratorium && (
                                  <span
                                    className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200"
                                    data-testid={`badge-moratorium-${row.quarter}`}
                                  >
                                    {t.moratoriumBadge}
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-right font-mono whitespace-nowrap text-slate-700 dark:text-neutral-300">
                                {row.openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-2 px-3 text-right font-mono whitespace-nowrap text-amber-700 dark:text-amber-400">
                                {row.interest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-2 px-3 text-right font-mono whitespace-nowrap text-slate-700 dark:text-neutral-300">
                                {row.principal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-2 px-3 text-right font-mono whitespace-nowrap font-bold text-indigo-950 dark:text-indigo-300">
                                {row.totalPayment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-2 px-3 text-right font-mono whitespace-nowrap font-medium text-slate-900 dark:text-white">
                                {row.closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr
                    className="border-t-2 border-slate-300 dark:border-neutral-700 font-extrabold bg-slate-50 dark:bg-[#161616] text-slate-900 dark:text-white"
                    data-testid="schedule-totals-row"
                  >
                    <td className="py-3 px-3">{t.totalsRowLabel}</td>
                    <td className="py-3 px-3 text-right">—</td>
                    <td className="py-3 px-3 text-right font-mono text-amber-700 dark:text-amber-400" data-testid="total-interest">
                      ₹{scheduleTotals.totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono" data-testid="total-principal">
                      ₹{scheduleTotals.totalPrincipal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-indigo-950 dark:text-indigo-300" data-testid="total-paid">
                      ₹{scheduleTotals.totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">₹0.00</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Assumptions & Live Config Collapsible */}
      <div
        className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4"
        data-testid="assumptions-section"
      >
        <button
          type="button"
          onClick={() => setIsAssumptionsExpanded((prev) => !prev)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
          data-testid="assumptions-toggle"
        >
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-950 dark:text-indigo-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.assumptionsTitle}
            </h4>
          </div>
          {isAssumptionsExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isAssumptionsExpanded && (
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-neutral-800 text-xs">
            {/* Live configuration controls */}
            <div className="bg-slate-50 dark:bg-[#141414] p-4 rounded-2xl border border-slate-100 dark:border-neutral-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-slate-800 dark:text-neutral-200">
                  {t.moratoriumToggleLabel}:
                </span>
                <div className="inline-flex rounded-xl bg-slate-200 dark:bg-neutral-800 p-1" data-testid="moratorium-toggle-group">
                  <button
                    type="button"
                    onClick={() => handleMoratoriumChange('serviced')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      moratoriumInterest === 'serviced'
                        ? 'bg-white dark:bg-[#222222] text-indigo-950 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
                    }`}
                    data-testid="toggle-moratorium-serviced"
                  >
                    {t.moratoriumServiced}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoratoriumChange('capitalised')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      moratoriumInterest === 'capitalised'
                        ? 'bg-white dark:bg-[#222222] text-indigo-950 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
                    }`}
                    data-testid="toggle-moratorium-capitalised"
                  >
                    {t.moratoriumCapitalised}
                  </button>
                </div>
              </div>

              {/* Repayment Type */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-neutral-800">
                <span className="font-bold text-slate-800 dark:text-neutral-200">
                  Amortization Style:
                </span>
                <div className="inline-flex rounded-xl bg-slate-200 dark:bg-neutral-800 p-1">
                  <button
                    type="button"
                    onClick={() => handleRepaymentTypeChange('equal_principal')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      repaymentType === 'equal_principal'
                        ? 'bg-white dark:bg-[#222222] text-indigo-950 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
                    }`}
                  >
                    Equal Principal (Declining)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRepaymentTypeChange('emi')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      repaymentType === 'emi'
                        ? 'bg-white dark:bg-[#222222] text-indigo-950 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
                    }`}
                  >
                    Quarterly EMI (Equal Total)
                  </button>
                </div>
              </div>
            </div>

            {/* Assumptions list */}
            <div className="space-y-1.5 text-slate-600 dark:text-neutral-400">
              <p className="font-bold text-slate-800 dark:text-neutral-200">
                Mathematical Assumptions Applied:
              </p>
              <ul className="list-disc pl-5 space-y-1" data-testid="assumptions-list">
                {eligible.assumptions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
