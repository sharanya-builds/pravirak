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
  onOptionChange,
  className = ''
}) => {
  const { t } = useLanguage();

  const [moratoriumInterest, setMoratoriumInterest] = useState<MoratoriumInterestTreatment>('serviced');
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('equal_principal');
  const [isAssumptionsExpanded, setIsAssumptionsExpanded] = useState<boolean>(true);

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
            <p className="font-bold">Observations:</p>
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
          <span className="font-bold mr-1">Selection Reason:</span>
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

      {/* Repayment Schedule Table */}
      <div
        className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4"
        data-testid="schedule-section"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {t.scheduleTableTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              {t.scheduleTableSubtitle}
            </p>
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

        {/* Mobile-first horizontal scroll table */}
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-6 sm:px-0">
            <table className="min-w-[650px] w-full text-xs text-left border-collapse" data-testid="repayment-table">
              <thead>
                <tr className="border-b border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 font-bold bg-slate-50/70 dark:bg-[#141414]">
                  <th className="py-2.5 px-3">{t.thQuarter}</th>
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
                {eligible.schedule.map((row) => (
                  <tr
                    key={row.quarter}
                    className={`transition-colors ${
                      row.isMoratorium
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 font-medium'
                        : 'hover:bg-slate-50/80 dark:hover:bg-[#141414]'
                    }`}
                    data-testid={`row-quarter-${row.quarter}`}
                    data-moratorium={row.isMoratorium ? 'true' : 'false'}
                  >
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-bold text-slate-900 dark:text-white mr-1.5">
                        Q{row.quarter}
                      </span>
                      {row.isMoratorium && (
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-extrabold bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200"
                          data-testid={`badge-moratorium-${row.quarter}`}
                        >
                          {t.moratoriumBadge}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap text-slate-700 dark:text-neutral-300">
                      {row.openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap text-amber-700 dark:text-amber-400">
                      {row.interest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap text-slate-700 dark:text-neutral-300">
                      {row.principal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap font-bold text-indigo-950 dark:text-indigo-300">
                      {row.totalPayment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap font-medium text-slate-900 dark:text-white">
                      {row.closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
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
