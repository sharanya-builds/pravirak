import React, { useState } from 'react';
import { Sliders, RefreshCw, Info } from 'lucide-react';
import { FinancialAnalysis, SafetyStatus } from '../../types';
import { formatINR, runStressScenario } from '../../engine/financialEngine';
import { useLanguage } from '../../context/LanguageContext';

interface StressTestProps {
  financials: FinancialAnalysis;
  categoryKey: string;
}

export const StressTest: React.FC<StressTestProps> = ({ financials, categoryKey }) => {
  const [salesDropPct, setSalesDropPct] = useState<number>(0);
  const [opexIncreasePct, setOpexIncreasePct] = useState<number>(0);
  const [rawMaterialIncreasePct, setRawMaterialIncreasePct] = useState<number>(0);
  const { t } = useLanguage();

  // Compute stressed outcome deterministically
  const stressResult = runStressScenario(
    financials,
    categoryKey,
    salesDropPct,
    opexIncreasePct,
    rawMaterialIncreasePct
  );

  const getSafetyBadge = (status: SafetyStatus) => {
    switch (status) {
      case 'SAFE':
        return {
          style: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
          label: t.safeRepayment
        };
      case 'WATCH':
        return {
          style: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
          label: t.watchZone
        };
      case 'RISKY':
      default:
        return {
          style: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
          label: t.riskyBorrowing
        };
    }
  };

  const isStressed = salesDropPct > 0 || opexIncreasePct > 0 || rawMaterialIncreasePct > 0;

  const resetControls = () => {
    setSalesDropPct(0);
    setOpexIncreasePct(0);
    setRawMaterialIncreasePct(0);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              {t.sensitivityResilienceAnalysis}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {t.whatIfThingsGoWrong}
            </h3>
          </div>
        </div>

        {isStressed && (
          <button
            onClick={resetControls}
            className="flex items-center gap-1.5 text-xs text-white bg-[#1E3A8A] hover:bg-[#1E40AF] px-3.5 py-2 rounded-xl border border-blue-700 shadow-xs transition-colors font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.resetScenario}</span>
          </button>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {/* Scenario Controls (3 Sliders / Toggle Buttons) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* 1. Sales Decrease */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 card-hover-float">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900 uppercase">
                {t.salesDecrease}
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                salesDropPct > 0 ? 'bg-rose-100 text-rose-900 font-mono dark:bg-rose-950/50 dark:text-rose-300' : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
              }`}>
                -{salesDropPct}%
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 10, 20, 30].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSalesDropPct(val)}
                  className={`py-1.5 text-xs font-extrabold rounded-lg border transition-all cursor-pointer ${
                    salesDropPct === val
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-blue-50 hover:text-blue-950 hover:border-blue-400'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-700 font-medium mt-2">
              {t.simFootfallCompetition}
            </p>
          </div>

          {/* 2. Operating Costs Increase */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 card-hover-float">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900 uppercase">
                {t.operatingCostsIncrease}
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                opexIncreasePct > 0 ? 'bg-amber-100 text-amber-900 font-mono dark:bg-amber-950/50 dark:text-amber-300' : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
              }`}>
                +{opexIncreasePct}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 10, 20].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setOpexIncreasePct(val)}
                  className={`py-1.5 text-xs font-extrabold rounded-lg border transition-all cursor-pointer ${
                    opexIncreasePct === val
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-blue-50 hover:text-blue-950 hover:border-blue-400'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-700 font-medium mt-2">
              {t.simOpexInflation}
            </p>
          </div>

          {/* 3. Raw Material Cost */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 card-hover-float">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900 uppercase">
                {t.rawMaterialCost}
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                rawMaterialIncreasePct > 0 ? 'bg-amber-100 text-amber-900 font-mono dark:bg-amber-950/50 dark:text-amber-300' : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
              }`}>
                +{rawMaterialIncreasePct}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 10, 20].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRawMaterialIncreasePct(val)}
                  className={`py-1.5 text-xs font-extrabold rounded-lg border transition-all cursor-pointer ${
                    rawMaterialIncreasePct === val
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-blue-50 hover:text-blue-950 hover:border-blue-400'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-700 font-medium mt-2">
              {t.simRawMaterialInflation}
            </p>
          </div>
        </div>

        {/* Live Stressed Output Comparison Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs mb-4">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center justify-between">
            <span>{t.scenarioStressComparison}</span>
            <span className="font-semibold normal-case text-slate-700">{t.realTimeRecalculation}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700 bg-slate-50 font-bold">
                  <th className="p-3.5 font-bold">{t.financialParameter}</th>
                  <th className="p-3.5 font-bold">{t.normalBaseline}</th>
                  <th className="p-3.5 font-bold bg-slate-100/60">{t.stressedScenario}</th>
                  <th className="p-3.5 font-bold">{t.impactVariance}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Monthly Revenue */}
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">{t.monthlyRevenueParam}</td>
                  <td className="p-3.5 font-mono text-slate-800">{formatINR(financials.projectedMonthlyRevenue)}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-950 bg-slate-100/30">
                    {formatINR(stressResult.stressedRevenue)}
                  </td>
                  <td className="p-3.5 font-mono text-rose-700 font-bold">
                    {salesDropPct > 0 ? `-${salesDropPct}%` : '0%'}
                  </td>
                </tr>

                {/* Operating Costs */}
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">{t.operatingExpensesParam}</td>
                  <td className="p-3.5 font-mono text-slate-800">{formatINR(financials.projectedMonthlyOpex)}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-950 bg-slate-100/30">
                    {formatINR(stressResult.stressedOpex)}
                  </td>
                  <td className="p-3.5 font-mono text-rose-700 font-bold">
                    {stressResult.stressedOpex > financials.projectedMonthlyOpex
                      ? `+${formatINR(stressResult.stressedOpex - financials.projectedMonthlyOpex)}`
                      : '0%'}
                  </td>
                </tr>

                {/* Monthly Surplus (After EMI) */}
                <tr className={stressResult.stressedNetSurplus < 0 ? 'bg-rose-50/50' : ''}>
                  <td className="p-3.5 font-bold text-slate-950">
                    {t.monthlySurplusParam}
                  </td>
                  <td className="p-3.5 font-mono text-slate-800">{formatINR(financials.monthlyNetSurplus)}</td>
                  <td className={`p-3.5 font-mono font-black bg-slate-100/30 ${
                    stressResult.stressedNetSurplus >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {formatINR(stressResult.stressedNetSurplus)}
                  </td>
                  <td className={`p-3.5 font-mono font-bold ${
                    stressResult.stressedNetSurplus < financials.monthlyNetSurplus ? 'text-rose-700' : 'text-slate-800'
                  }`}>
                    {formatINR(stressResult.stressedNetSurplus - financials.monthlyNetSurplus)}
                  </td>
                </tr>

                {/* Repayment EMI */}
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">{t.bankLoanRepaymentParam}</td>
                  <td className="p-3.5 font-mono text-slate-800">{formatINR(financials.monthlyEMI)}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-950 bg-slate-100/30">
                    {formatINR(stressResult.monthlyEMI)} ({t.fixedObligation})
                  </td>
                  <td className="p-3.5 text-slate-700 font-semibold">{t.fixedObligation}</td>
                </tr>

                {/* Debt Coverage & Safety */}
                <tr className="bg-slate-50/80">
                  <td className="p-3.5 font-black text-slate-950">
                    {t.debtCoverageSafetyParam}
                  </td>
                  <td className="p-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border uppercase ${getSafetyBadge(financials.safetyStatus).style}`}>
                      {getSafetyBadge(financials.safetyStatus).label} ({financials.dscr}x)
                    </span>
                  </td>
                  <td className="p-3.5 bg-slate-100/60">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border uppercase ${getSafetyBadge(stressResult.stressedSafety).style}`}>
                      {getSafetyBadge(stressResult.stressedSafety).label} ({stressResult.stressedDSCR}x)
                    </span>
                  </td>
                  <td className="p-3.5 text-xs font-bold text-slate-800">
                    {stressResult.stressedSafety === financials.safetyStatus 
                      ? t.resilientUnderShock 
                      : `${t.degradedTo} ${getSafetyBadge(stressResult.stressedSafety).label}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Narrative & Legal Explanation Note */}
        <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-900 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="text-sm sm:text-base font-bold text-slate-950 leading-snug">
              {t.scenarioDiagnosis} {stressResult.warningNote}
            </p>
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
              {t.sensitivityDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
