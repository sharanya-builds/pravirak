import React, { useState } from 'react';
import { 
  Printer, 
  RotateCcw, 
  CheckSquare, 
  Square, 
  Share2
} from 'lucide-react';
import { 
  BusinessDecisionResult, 
  BusinessInput, 
  FinancialAnalysis, 
  GovernmentScheme, 
  LocationData 
} from '../../types';
import { formatINR } from '../../engine/financialEngine';
import { PrimaryButton } from '../common/PrimaryButton';
import { useLanguage } from '../../context/LanguageContext';

interface FinalBusinessPlanProps {
  input: BusinessInput;
  location: LocationData;
  financials: FinancialAnalysis;
  decisionResult: BusinessDecisionResult;
  recommendedScheme: GovernmentScheme;
  onReset: () => void;
}

export const FinalBusinessPlan: React.FC<FinalBusinessPlanProps> = ({
  input,
  location,
  financials,
  decisionResult,
  recommendedScheme,
  onReset
}) => {
  const { t, language } = useLanguage();

  // Checkbox state for next steps
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  });

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => ({ ...prev, [stepNumber]: !prev[stepNumber] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const summary = `Pravirak Decision Dossier for ${input.businessIdea} at ${location.areaName}: Decision: ${decisionResult.decision}, Project Cost: ${formatINR(financials.projectCost)}, DSCR: ${financials.dscr}x (${financials.safetyStatus}). Scheme: ${recommendedScheme.name}.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      alert('Business Plan Summary copied to clipboard for sharing!');
    }
  };

  const refId = `PVK/2024/IND-${Math.abs(input.businessIdea.length * 137 + 54321)}`;
  const currentDate = new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-950">
            {t.dossierGenerationComplete}
          </h2>
          <p className="text-xs sm:text-sm text-slate-800 font-medium mt-0.5">
            {t.bankReadyDossierDesc}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer"
            title="Share summary"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <PrimaryButton
            onClick={handlePrint}
            variant="primary"
            size="md"
            icon={<Printer className="w-4 h-4" />}
          >
            {t.downloadPrintPlan}
          </PrimaryButton>

          <PrimaryButton
            onClick={onReset}
            variant="secondary"
            size="md"
            icon={<RotateCcw className="w-4 h-4" />}
          >
            {t.startAnotherAnalysisBtn}
          </PrimaryButton>
        </div>
      </div>

      {/* Official Government / Bank Report Document */}
      <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-sm relative overflow-hidden print:border-none print:shadow-none print:p-0">
        {/* Watermark / Subtle Seal background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.02]">
          <span className="text-9xl font-extrabold text-slate-900 tracking-widest">
            PRAVIRAK
          </span>
        </div>

        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black tracking-tight text-slate-950">
                PRAVIRAK
              </span>
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 text-slate-800 rounded-sm border border-slate-300">
                {t.officialBusinessDossier}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-medium">
              {t.nationalPlatformBadge}
            </p>
          </div>

          <div className="text-right text-xs sm:text-sm text-slate-800 space-y-0.5 font-medium">
            <div><strong>{t.dossierRef}</strong> <span className="font-mono text-slate-950 font-bold">{refId}</span></div>
            <div><strong>{t.dateOfAppraisal}</strong> <span className="text-slate-900">{currentDate}</span></div>
            <div><strong>{t.statusLabel}</strong> <span className="text-emerald-700 font-extrabold">{t.verifiedAnalysis}</span></div>
          </div>
        </div>

        {/* Report Sections */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-900">
          {/* Section 1: Executive Summary */}
          <div>
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-950 rounded-xs"></span>
              {t.executiveSummary}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
              <div>
                <span className="text-slate-700 font-semibold block text-xs">{t.businessTarget}</span>
                <strong className="text-slate-950 text-sm font-bold block mt-0.5">{input.businessIdea}</strong>
              </div>
              <div>
                <span className="text-slate-700 font-semibold block text-xs">{t.locationLabel}</span>
                <strong className="text-slate-950 text-sm font-bold block mt-0.5">{location.areaName}</strong>
              </div>
              <div>
                <span className="text-slate-700 font-semibold block text-xs">{t.estimatedProjectCost}</span>
                <strong className="text-slate-950 text-sm font-mono font-bold block mt-0.5">{formatINR(financials.projectCost)}</strong>
              </div>
              <div>
                <span className="text-slate-700 font-semibold block text-xs">{t.yourDecision}</span>
                <span className="inline-block font-black text-xs sm:text-sm px-2.5 py-1 bg-slate-900 text-white rounded-md mt-0.5">
                  {decisionResult.decision}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Market Outlook & Competition */}
          <div>
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-950 rounded-xs"></span>
              {t.marketOutlook}
            </h3>
            <p className="text-sm sm:text-base text-slate-950 font-medium leading-relaxed mb-4">
              Spatial radius scanning mapped <strong className="text-slate-950 font-bold">{location.competitorsNearbyCount} {t.competitorsNearby.toLowerCase()}</strong> within 1.5 km radial catchment. Monthly estimated consumer pedestrian footfall stands at <strong className="text-slate-950 font-bold">{location.footfallMonthly.toLocaleString('en-IN')}</strong> across major residential colonies ({location.customerColonies.join(', ')}).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-extrabold text-slate-950 block mb-1.5">{t.demandSignals}</span>
                <ul className="list-disc list-inside space-y-1 text-slate-800 font-medium text-xs sm:text-sm">
                  {location.demandSignals.map((sig, idx) => (
                    <li key={idx}>{sig}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-extrabold text-slate-950 block mb-1.5">{t.transitCorridors}</span>
                <ul className="list-disc list-inside space-y-1 text-slate-800 font-medium text-xs sm:text-sm">
                  {location.transitPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Financial Feasibility & Debt Schedule */}
          <div>
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-950 rounded-xs"></span>
              {t.financialFeasibilitySchedule}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 rounded-lg">
                <thead className="bg-slate-100 text-slate-900 font-bold">
                  <tr className="border-b border-slate-200">
                    <th className="p-3 font-bold">{t.tableComponent}</th>
                    <th className="p-3 font-bold">{t.tableAmount}</th>
                    <th className="p-3 font-bold">{t.tableShare}</th>
                    <th className="p-3 font-bold">{t.tableNotes}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t.ownCapitalEquity}</td>
                    <td className="p-3 font-mono font-bold text-slate-950">{formatINR(financials.ownCapital)}</td>
                    <td className="p-3 font-mono font-medium text-slate-800">{financials.promoterContributionPct}%</td>
                    <td className="p-3 text-slate-800 font-medium">{t.equityNote}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t.potentialBankFinancing}</td>
                    <td className="p-3 font-mono font-bold text-slate-950">{formatINR(financials.loanRequired)}</td>
                    <td className="p-3 font-mono font-medium text-slate-800">{100 - financials.promoterContributionPct}%</td>
                    <td className="p-3 text-slate-800 font-medium">{t.debtNote}</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-3 text-slate-950">{t.estimatedProjectCost}</td>
                    <td className="p-3 font-mono text-indigo-950 font-extrabold">{formatINR(financials.projectCost)}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">100%</td>
                    <td className="p-3 text-slate-900 font-medium">{t.capexBufferNote} ({formatINR(financials.workingCapitalBufferAmount)})</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t.monthlyRepaymentEMI}</td>
                    <td className="p-3 font-mono font-bold text-slate-950">{formatINR(financials.monthlyEMI)} / mo</td>
                    <td className="p-3 text-slate-600 font-medium">-</td>
                    <td className="p-3 text-slate-800 font-medium">{t.fixedEmiNote}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t.debtCoverageSafetyParam}</td>
                    <td className="p-3 font-mono font-black text-emerald-800">{financials.dscr}x</td>
                    <td className="p-3 text-slate-600 font-medium">-</td>
                    <td className="p-3 font-bold uppercase text-emerald-800">{financials.safetyStatus}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Recommended Government Scheme */}
          <div>
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-950 rounded-xs"></span>
              {t.matchedGovtScheme}
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm sm:text-base text-slate-950">{recommendedScheme.name}</span>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-md font-bold text-xs">
                  {recommendedScheme.matchScore}% FIT
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-slate-800 font-medium text-xs sm:text-sm pt-2 border-t border-slate-200">
                <div><strong className="text-slate-950">{t.maxSubsidyLabel}</strong> {recommendedScheme.maxSubsidyText}</div>
                <div><strong className="text-slate-950">{t.maxLimitLabel}</strong> {recommendedScheme.maxLoanText}</div>
                <div><strong className="text-slate-950">{t.nodalAgency}</strong> {recommendedScheme.nodalAgency}</div>
              </div>
            </div>
          </div>

          {/* Section 5: Action Plan & Next Steps (Interactive Checkboxes) */}
          <div>
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-950 rounded-xs"></span>
              {t.actionPlanNextSteps}
            </h3>
            <div className="space-y-2.5">
              {decisionResult.actionPlan.map((step) => {
                const isChecked = completedSteps[step.stepNumber];
                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => toggleStep(step.stepNumber)}
                    className={`p-3.5 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 ${
                      isChecked ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="mt-0.5 text-indigo-950 shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-950">
                        <span className={isChecked ? 'line-through text-slate-500' : ''}>
                          {t.stepLabel} {step.stepNumber}: {step.title}
                        </span>
                        <span className="text-xs text-indigo-900 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {step.timeline}
                        </span>
                      </div>
                      <p className={`text-xs sm:text-sm mt-1 font-medium leading-relaxed ${isChecked ? 'text-slate-500' : 'text-slate-900'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Official Footer & Sign-off */}
        <div className="mt-8 pt-6 border-t-2 border-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-800 font-medium">
          <div>
            <span className="font-bold text-slate-950 block">Pravirak Enterprise Decision Platform</span>
            <p className="text-xs text-slate-700 mt-0.5">{t.dossierPlatformDesc}</p>
          </div>
          <div className="text-right text-xs">
            <div className="font-extrabold text-slate-950 uppercase">{t.verifiedAnalysis}</div>
            <div className="text-slate-700">{t.dossierRef} {refId}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
