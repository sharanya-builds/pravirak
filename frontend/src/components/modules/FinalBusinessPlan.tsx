import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  RotateCcw, 
  CheckSquare, 
  Square, 
  Share2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Landmark,
  ArrowRight
} from 'lucide-react';
import { 
  BusinessDecisionResult, 
  BusinessInput, 
  FinancialAnalysis, 
  GovernmentScheme, 
  LocationData,
  LocalFeasibilityReport
} from '../../types';
import { formatINR } from '../../engine/financialEngine';
import { formatLocationField } from '../../engine/locationParser';
import { reconcileSchemeLoan } from '../../engine/schemeReconciliation';
import { SchemeLoanBreakdown } from '../common/SchemeLoanBreakdown';
import { PrimaryButton } from '../common/PrimaryButton';
import { useLanguage } from '../../context/LanguageContext';
import { LocalFeasibilityReportView } from './LocalFeasibilityReportView';
import { fetchLocalFeasibilityReport } from '../../services/localFeasibilityService';

interface FinalBusinessPlanProps {
  input: BusinessInput;
  location: LocationData;
  financials: FinancialAnalysis;
  decisionResult: BusinessDecisionResult;
  recommendedScheme: GovernmentScheme;
  onReset: () => void;
  feasibilityReport?: LocalFeasibilityReport | null;
}

export const FinalBusinessPlan: React.FC<FinalBusinessPlanProps> = ({
  input,
  location,
  financials,
  decisionResult,
  recommendedScheme,
  onReset,
  feasibilityReport
}) => {
  const { t, language } = useLanguage();
  const [internalFeasibility, setInternalFeasibility] = useState<LocalFeasibilityReport | null>(null);
  const activeFeasibility = feasibilityReport !== undefined ? feasibilityReport : internalFeasibility;

  React.useEffect(() => {
    if (feasibilityReport === undefined) {
      fetchLocalFeasibilityReport({
        category: input.category || input.businessIdea,
        location: location,
        ownCapital: input.ownCapital,
        projectCost: financials.projectCost,
        competitorCount: location.competitorsNearbyCount,
        catchmentPopulationEstimate: null,
        language: language
      }).then(setInternalFeasibility).catch(() => {});
    }
  }, [feasibilityReport, input, location, financials.projectCost, language]);

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

  const reconciliation = useMemo(() => {
    if (!input.ownCapital || input.ownCapital <= 0 || !financials.projectCost) {
      return null;
    }
    return reconcileSchemeLoan(input.ownCapital, financials.projectCost);
  }, [input.ownCapital, financials.projectCost]);

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

        {/* Data Provenance Legend */}
        <div className="bg-slate-50 rounded-xl px-4 py-2 border border-slate-200 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-700">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            {t.provenanceLegendTitle}:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <strong className="text-emerald-800 font-semibold">{t.badgeMeasured}</strong>
            <span className="text-slate-500 text-[11px]">({t.provenanceMeasuredDesc})</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <strong className="text-amber-800 font-semibold">{t.badgeEstimated}</strong>
            <span className="text-slate-500 text-[11px]">({t.provenanceEstimatedDesc})</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <strong className="text-purple-800 font-semibold">{t.badgeAi}</strong>
            <span className="text-slate-500 text-[11px]">({t.provenanceAiDesc})</span>
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

            {/* Administrative Hierarchy Details */}
            <div className="mt-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-500 font-medium block">{t.villageLabel}:</span>
                <span className="text-slate-900 font-bold" data-testid="plan-village">
                  {formatLocationField(location.village || input.location?.village, t.notAvailableForAddress)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">{t.blockLabel}:</span>
                <strong className="text-slate-900 font-semibold block mt-0.5" data-testid="plan-block">
                  {formatLocationField(location.block || input.location?.block)}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">{t.districtLabel}:</span>
                <strong className="text-slate-900 font-semibold block mt-0.5" data-testid="plan-district">
                  {formatLocationField(location.district || input.location?.district)}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">{t.stateLabel}:</span>
                <strong className="text-slate-900 font-semibold block mt-0.5" data-testid="plan-state">
                  {formatLocationField(location.state || input.location?.state)}
                </strong>
              </div>
            </div>
          </div>

          {/* Section 2: Catchment Market & Demographic Outlook */}
          <div>
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-950 rounded-xs"></span>
              {t.marketOutlook}
            </h3>
            <p className="text-sm sm:text-base text-slate-950 font-medium leading-relaxed mb-2">
              Spatial radius scanning mapped <strong className="text-slate-950 font-bold">{location.competitorsNearbyCount} {t.competitorsNearby.toLowerCase()}</strong> within 1.5 km radial catchment. Monthly estimated consumer pedestrian footfall stands at <strong className="text-slate-950 font-bold">{location.footfallMonthly.toLocaleString('en-IN')}</strong> across major residential colonies ({location.customerColonies.join(', ')}).
            </p>
            {location.competitors && location.competitors.length > 0 ? (
              <p className="text-xs text-slate-700 mb-4 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200">
                <strong className="text-emerald-950 font-bold">Identified Competitors (OpenStreetMap):</strong>{' '}
                {location.competitors.map((c) => c.name).filter(Boolean).join(', ')}
              </p>
            ) : location.competitorsNote ? (
              <p className="text-xs text-amber-900 mb-4 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
                {location.competitorsNote}
              </p>
            ) : (
              <div className="mb-4" />
            )}
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

          {/* Section: Local Feasibility Report */}
          <div data-testid="plan-local-feasibility-section" className="border-t border-slate-200 pt-5">
            <LocalFeasibilityReportView
              report={activeFeasibility}
              location={location}
              category={input.category || input.businessIdea}
              isPrintView={true}
            />
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

          {/* Section 4: Government Scheme Loan Structure (PS Mode Engine Reconciliation) */}
          {reconciliation && (
            <div className="space-y-4" data-testid="plan-scheme-loan-section">
              <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-950 rounded-xs"></span>
                {t.govtSchemeLoanStructureTitle}
              </h3>
              <p className="text-xs text-slate-600 mb-4 font-medium">
                {t.govtSchemeLoanStructureDesc}
              </p>

              {/* Capital Reconciliation Banner */}
              {reconciliation.isFullyFunded ? (
                <div
                  className="mb-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-2"
                  data-testid="plan-fully-funded-banner"
                >
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{t.fullyFundedTitle}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                    Your available capital of{' '}
                    <strong>₹{reconciliation.ownCapital.toLocaleString('en-IN')}</strong> meets the required 10% promoter contribution (
                    <strong>₹{reconciliation.requiredMargin.toLocaleString('en-IN')}</strong>) for the planned project cost of{' '}
                    <strong>₹{reconciliation.projectCost.toLocaleString('en-IN')}</strong>.
                  </p>
                  <div className="text-xs font-bold text-emerald-900 pt-1 flex flex-wrap gap-4">
                    <span>
                      {t.maxSupportableProjectCostTitle}:{' '}
                      <strong className="font-mono text-emerald-950" data-testid="max-supportable-project">
                        ₹{reconciliation.maxSupportableProjectCost.toLocaleString('en-IN')}
                      </strong>
                    </span>
                    {reconciliation.surplus > 0 && (
                      <span>
                        Surplus Capital Buffer:{' '}
                        <strong className="font-mono text-emerald-950">
                          ₹{reconciliation.surplus.toLocaleString('en-IN')}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-4"
                  data-testid="plan-shortfall-banner"
                >
                  <div className="flex items-start gap-2.5 text-amber-950">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base">
                        {t.shortfallAlertTitle}:{' '}
                        <span className="text-rose-600 font-mono" data-testid="plan-shortfall-amount">
                          ₹{reconciliation.shortfall.toLocaleString('en-IN')}
                        </span>
                      </h4>
                      <p className="text-xs sm:text-sm text-amber-900 mt-1 leading-relaxed font-medium">
                        The estimated project cost of{' '}
                        <strong>₹{reconciliation.projectCost.toLocaleString('en-IN')}</strong> requires a 10% promoter contribution of{' '}
                        <strong>₹{reconciliation.requiredMargin.toLocaleString('en-IN')}</strong>, but your current available capital is{' '}
                        <strong>₹{reconciliation.ownCapital.toLocaleString('en-IN')}</strong>.
                      </p>
                      <p className="text-xs text-amber-800 mt-1 font-semibold">
                        The institutional scheme structure below is calculated for the largest project your current capital can support (
                        <strong data-testid="max-supportable-shortfall-project">₹{reconciliation.maxSupportableProjectCost.toLocaleString('en-IN')}</strong>).
                      </p>
                    </div>
                  </div>

                  {/* 3 Actionable Options to Bridge Shortfall */}
                  {reconciliation.optionsIfShortfall && (
                    <div className="bg-white/80 rounded-xl p-4 border border-amber-200/80 space-y-2.5 text-xs" data-testid="shortfall-options-card">
                      <span className="font-extrabold text-slate-900 block text-xs uppercase tracking-wider">
                        {t.threeOptionsToProceed}:
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                        <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 space-y-1">
                          <strong className="text-slate-900 block font-bold">{t.optionAddCapitalTitle}</strong>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {reconciliation.optionsIfShortfall.addCapitalText}
                          </p>
                        </div>
                        <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 space-y-1">
                          <strong className="text-slate-900 block font-bold">{t.optionScaleDownTitle}</strong>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {reconciliation.optionsIfShortfall.scaleDownText}
                          </p>
                        </div>
                        <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 space-y-1">
                          <strong className="text-slate-900 block font-bold">{t.optionPhasedTitle}</strong>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {reconciliation.optionsIfShortfall.phasedExecutionText}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* How this was calculated card */}
              <div
                className="mb-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3"
                data-testid="how-calculated-card"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-900">
                  <HelpCircle className="w-4 h-4 text-indigo-950" />
                  <h4 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                    {t.howCalculatedTitle}
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block font-medium">Promoter Capital (M):</span>
                    <strong className="text-slate-900 font-mono text-sm block mt-0.5" data-testid="how-calc-m">
                      ₹{reconciliation.ownCapital.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block font-medium">Plan Project Cost (B):</span>
                    <strong className="text-slate-900 font-mono text-sm block mt-0.5" data-testid="how-calc-b">
                      ₹{reconciliation.projectCost.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block font-medium">10% Required Margin (0.10×B):</span>
                    <strong className="text-slate-900 font-mono text-sm block mt-0.5" data-testid="how-calc-required-margin">
                      ₹{reconciliation.requiredMargin.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block font-medium">Max Supportable (M / 0.10):</span>
                    <strong className="text-indigo-950 font-mono text-sm block mt-0.5" data-testid="how-calc-max-supportable">
                      ₹{reconciliation.maxSupportableProjectCost.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-900">Applied Case:</span>
                    <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-slate-100 text-slate-800" data-testid="how-calc-applied-case">
                      {reconciliation.isFullyFunded
                        ? 'Fully Funded (M ≥ 0.10 × B) — sized for project cost B'
                        : 'Capital Shortfall (M < 0.10 × B) — sized for maximum supportable project M / 0.10'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    <strong>Statutory scheme rules & thresholds applied:</strong> Minimum promoter margin 10.0%, debt financing up to 90.0%. Micro Finance Scheme covers projects ≤ ₹1,40,000 (up to ₹1,25,000 at 6.5% p.a., 3 years with 3-month moratorium). Term Loan Scheme covers projects &gt; ₹1,40,000 up to ₹50,00,000 (up to ₹45,00,000 at 8.0% p.a., 7 years with 6-month moratorium). Projects &gt; ₹50,00,000 exceed scheme limits.
                  </p>
                </div>
              </div>

              {/* Render SchemeLoanBreakdown */}
              <SchemeLoanBreakdown
                result={reconciliation.calculationResult}
                availableMargin={reconciliation.appliedMargin}
                businessCategory={input.businessIdea}
                locationSummary={location.areaName}
              />
            </div>
          )}

          {/* Section 5: Recommended Government Scheme */}
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
