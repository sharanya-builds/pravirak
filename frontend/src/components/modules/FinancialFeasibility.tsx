import React, { useState } from 'react';
import { 
  Wallet, 
  Coins, 
  Landmark, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Layers
} from 'lucide-react';
import { FinancialAnalysis, SafetyStatus } from '../../types';
import { formatINR } from '../../engine/financialEngine';
import { MetricCard } from '../common/MetricCard';
import { useLanguage } from '../../context/LanguageContext';

interface FinancialFeasibilityProps {
  financials: FinancialAnalysis;
}

export const FinancialFeasibility: React.FC<FinancialFeasibilityProps> = ({ financials }) => {
  const [showCapexBreakdown, setShowCapexBreakdown] = useState(false);
  const { t } = useLanguage();

  const getSafetyBadge = (status: SafetyStatus) => {
    switch (status) {
      case 'SAFE':
        return {
          badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          text: t.safeRepayment,
          icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
          explanation: t.safeExplanation
        };
      case 'WATCH':
        return {
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          text: t.watchZone,
          icon: <AlertTriangle className="w-5 h-5 text-amber-700" />,
          explanation: t.watchExplanation
        };
      case 'RISKY':
      default:
        return {
          badge: 'bg-rose-100 text-rose-900 border-rose-300',
          text: t.riskyBorrowing,
          icon: <AlertTriangle className="w-5 h-5 text-rose-700" />,
          explanation: t.riskyExplanation
        };
    }
  };

  const safety = getSafetyBadge(financials.safetyStatus);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Official Header */}
      <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-indigo-900" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-950">
              {t.financialFeasibilityTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1">
            {t.deterministicCashflowDesc}
          </p>
        </div>

        {/* Safety Badge Banner */}
        <div className={`px-3.5 py-2 rounded-xl border flex items-center gap-2.5 ${safety.badge}`}>
          {safety.icon}
          <div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wide block">
              {safety.text}
            </span>
            <span className="text-xs font-bold text-slate-900">DSCR {financials.dscr}x</span>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Core Financial Metrics (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label={t.ownCapitalEquity}
            value={formatINR(financials.ownCapital)}
            subtext={`${financials.promoterContributionPct}% ${t.promoterContributionSubtext}`}
            icon={<Wallet className="w-4 h-4 text-slate-500" />}
          />

          <MetricCard
            label={t.estimatedProjectCost}
            value={formatINR(financials.projectCost)}
            subtext={t.capexBufferSubtext}
            icon={<Coins className="w-4 h-4 text-slate-500" />}
            highlight={true}
          />

          <MetricCard
            label={t.potentialBankFinancing}
            value={formatINR(financials.loanRequired)}
            subtext="PMEGP / MUDRA / MSME Term Loan"
            icon={<Landmark className="w-4 h-4 text-slate-500" />}
          />

          <MetricCard
            label={t.monthlyRepaymentEMI}
            value={`${formatINR(financials.monthlyEMI)} / mo`}
            subtext={`@ ${financials.interestRatePct}% p.a. (${financials.tenureYears} Yrs)`}
            safetyStatus={financials.safetyStatus}
            icon={<Clock className="w-4 h-4 text-slate-500" />}
          />
        </div>

        {/* Operating Cashflow Overview Box */}
        <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 mb-6">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-900" />
            {t.monthlyCashflowTitle}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block">{t.projectedMonthlyRevenue}</span>
              <span className="text-lg font-bold text-slate-950 font-mono mt-0.5 block">
                {formatINR(financials.projectedMonthlyRevenue)}
              </span>
              <span className="text-xs text-slate-800 font-medium block mt-1">
                {t.evidence}: {t.evidenceFootfallTicket}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block">{t.projectedMonthlyOpex}</span>
              <span className="text-lg font-bold text-slate-950 font-mono mt-0.5 block">
                {formatINR(financials.projectedMonthlyOpex)}
              </span>
              <span className="text-xs text-slate-800 font-medium block mt-1">
                {t.opexIncludesSub}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block">{t.netCashSurplus}</span>
              <span className={`text-lg font-black font-mono mt-0.5 block ${
                financials.monthlyNetSurplus > 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {formatINR(financials.monthlyNetSurplus)} / mo
              </span>
              <span className="text-xs text-slate-800 font-medium block mt-1">
                {t.retainedNetProfitSub}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-lg border border-slate-200">
            <p className="text-sm sm:text-base text-slate-950 font-medium leading-relaxed">
              <strong className="font-bold text-indigo-950">{t.safetyEvaluation}</strong> {safety.explanation}
            </p>
          </div>
        </div>

        {/* Capex Itemized Breakdown Accordion */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowCapexBreakdown(!showCapexBreakdown)}
            className="w-full p-4 bg-white hover:bg-slate-50 flex items-center justify-between text-left transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-900" />
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {t.itemizedCapexBreakdown}
              </span>
              <span className="text-xs text-slate-700 font-bold font-mono">
                ({financials.capexItems.length} {t.itemsCount})
              </span>
            </div>
            {showCapexBreakdown ? (
              <ChevronUp className="w-4 h-4 text-slate-700" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {showCapexBreakdown && (
            <div className="border-t border-slate-200 divide-y divide-slate-100 bg-slate-50/50">
              {financials.capexItems.map((item, idx) => (
                <div key={idx} className="p-3 sm:px-4 sm:py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <div className="font-bold text-slate-900">{item.item}</div>
                    <div className="text-xs text-slate-800 font-medium">{item.description}</div>
                  </div>
                  <div className="font-bold text-slate-950 font-mono text-right ml-4 text-sm sm:text-base">
                    {formatINR(item.amount)}
                  </div>
                </div>
              ))}

              <div className="p-3 sm:px-4 sm:py-3.5 bg-indigo-50/80 flex items-center justify-between text-xs sm:text-sm border-t border-indigo-100">
                <div>
                  <div className="font-bold text-indigo-950 text-sm">
                    {t.workingCapitalBufferMandatory}
                  </div>
                  <div className="text-xs sm:text-sm text-indigo-900 font-medium mt-0.5">
                    {t.workingCapitalDesc}
                  </div>
                </div>
                <div className="font-bold text-indigo-950 font-mono text-right ml-4 text-sm sm:text-base">
                  {formatINR(financials.workingCapitalBufferAmount)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
