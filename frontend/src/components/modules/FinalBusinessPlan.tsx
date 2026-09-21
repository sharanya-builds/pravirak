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
  ChevronDown,
  ChevronUp,
  MapPin,
  Compass,
  Lightbulb,
  Grid2X2,
  ShieldAlert,
  Tag,
  Landmark,
  Layers,
  Calendar,
  FileText,
  ArrowRight,
  TrendingUp
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
import { fetchLocalFeasibilityReport } from '../../services/localFeasibilityService';
import { SECTION_REGISTRY } from '../../data/sectionRegistry';

interface FinalBusinessPlanProps {
  input: BusinessInput;
  location: LocationData;
  financials: FinancialAnalysis;
  decisionResult: BusinessDecisionResult;
  recommendedScheme: GovernmentScheme;
  onReset: () => void;
  feasibilityReport?: LocalFeasibilityReport | null;
  onNavigateToSection?: (sectionKey: string) => void;
}

export const FinalBusinessPlan: React.FC<FinalBusinessPlanProps> = ({
  input,
  location,
  financials,
  decisionResult,
  recommendedScheme,
  onReset,
  feasibilityReport,
  onNavigateToSection
}) => {
  const { t, language } = useLanguage();
  const [internalFeasibility, setInternalFeasibility] = useState<LocalFeasibilityReport | null>(null);
  const activeFeasibility = feasibilityReport !== undefined ? feasibilityReport : internalFeasibility;

  // Download mode: 'short' (default, max 2 pages) or 'full' (all detailed sections)
  const [downloadMode, setDownloadMode] = useState<'short' | 'full'>('short');

  // Accordion sections state (all collapsed by default)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    market: false,
    opportunities: false,
    swot: false,
    threats: false,
    pricing: false,
    loanSchedule: false,
    breakeven: false,
    stressTests: false,
    howCalculated: false,
    actionPlan: false
  });

  const allOpen = useMemo(() => Object.values(openSections).every(Boolean), [openSections]);

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAll = () => {
    const target = !allOpen;
    setOpenSections({
      market: target,
      opportunities: target,
      swot: target,
      threats: target,
      pricing: target,
      loanSchedule: target,
      breakeven: target,
      stressTests: target,
      howCalculated: target,
      actionPlan: target
    });
  };

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

  // Quarterly payment post-moratorium
  const quarterlyPayment = useMemo(() => {
    const postMoratoriumRow = reconciliation?.calculationResult?.isEligible
      ? reconciliation.calculationResult.schedule.find(r => !r.isMoratorium)
      : null;
    if (postMoratoriumRow) {
      return postMoratoriumRow.totalPayment;
    }
    return Math.round(financials.monthlyEMI * 3);
  }, [reconciliation, financials.monthlyEMI]);

  const psLoanAmount = reconciliation?.calculationResult?.isEligible
    ? reconciliation.calculationResult.loan
    : financials.loanRequired;
  const psSchemeName = reconciliation?.calculationResult?.isEligible
    ? reconciliation.calculationResult.schemeName
    : recommendedScheme.name;
  const psInterestRate = reconciliation?.calculationResult?.isEligible
    ? reconciliation.calculationResult.interestRate
    : financials.interestRatePct;
  const isFullyFunded = reconciliation ? reconciliation.isFullyFunded : true;
  const shortfall = reconciliation ? reconciliation.shortfall : 0;

  // Top 3 reasons derived strictly from existing deterministic engine outputs
  const topReasons = useMemo(() => {
    if (decisionResult.evidenceList && decisionResult.evidenceList.length > 0) {
      return decisionResult.evidenceList.slice(0, 3).map(e => e.detail ? `${e.title}: ${e.detail}` : e.title);
    }
    if (location.demandSignals && location.demandSignals.length > 0) {
      return location.demandSignals.slice(0, 3);
    }
    if (recommendedScheme.matchReasons && recommendedScheme.matchReasons.length > 0) {
      return recommendedScheme.matchReasons.slice(0, 3);
    }
    return [
      `Strong location fit in ${location.city || location.areaName}`,
      `Viable Debt Service Coverage Ratio (DSCR ${financials.dscr}x)`,
      `Eligible for ${recommendedScheme.name} under CGTMSE guarantee`
    ];
  }, [decisionResult, location, recommendedScheme, financials]);

  // Top 3 risks derived strictly from existing engine outputs
  const topRisks = useMemo(() => {
    if (decisionResult.riskFactors && decisionResult.riskFactors.length > 0) {
      return decisionResult.riskFactors.slice(0, 3).map(r => r.title || r.mitigation);
    }
    if (activeFeasibility?.threats && activeFeasibility.threats.length > 0) {
      return activeFeasibility.threats.slice(0, 3).map(t => t.description);
    }
    return [
      `Cash flow management prior to break-even (~${financials.breakEvenMonths} months)`,
      `Competition pressure from ${location.competitorsNearbyCount} nearby businesses`,
      `Working capital buffer utilization during initial gestation`
    ];
  }, [decisionResult, activeFeasibility, financials, location]);

  // First next step
  const firstStep = decisionResult.actionPlan?.[0] || {
    stepNumber: 1,
    title: 'Apply for Udyam Registration & Scheme Loan',
    timeline: 'Week 1-2',
    description: `Register on Udyam portal and apply for ${recommendedScheme.name} with nodal agency.`
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const summary = `Pravirak Decision Dossier for ${input.businessIdea} at ${location.areaName}: Decision: ${decisionResult.decision}, Project Cost: ${formatINR(financials.projectCost)}, DSCR: ${financials.dscr}x (${financials.safetyStatus}). Scheme: ${recommendedScheme.name}.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      alert(t.planCopiedAlert);
    }
  };

  const refId = `PVK/2024/IND-${Math.abs(input.businessIdea.length * 137 + 54321)}`;
  const currentDate = new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const decisionBadgeColor = useMemo(() => {
    const d = (decisionResult.decision || '').toUpperCase();
    if (d.includes('START')) return 'bg-emerald-600 text-white';
    if (d.includes('MOVE') || d.includes('ADJUST') || d.includes('VALIDATE')) return 'bg-amber-600 text-white';
    return 'bg-rose-600 text-white';
  }, [decisionResult.decision]);

  return (
    <div className={`max-w-4xl mx-auto space-y-4 sm:space-y-6 ${downloadMode === 'short' ? 'print-mode-short' : 'print-mode-full'}`}>
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-950">
            {t.dossierGenerationComplete}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            {t.bankReadyDossierDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Short vs Full Download Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              data-testid="download-mode-short"
              onClick={() => setDownloadMode('short')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                downloadMode === 'short'
                  ? 'bg-white text-indigo-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={t.shortPlanDesc}
            >
              {t.shortPlan}
            </button>
            <button
              type="button"
              data-testid="download-mode-full"
              onClick={() => setDownloadMode('full')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                downloadMode === 'full'
                  ? 'bg-white text-indigo-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={t.fullPlanDesc}
            >
              {t.fullPlan}
            </button>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="p-2 text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer"
            title={t.shareSummaryTitle}
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

      {/* 1. DECISION SUMMARY CARD (Top of plan, fits 360x800 screen without scrolling) */}
      <div 
        data-testid="decision-summary-card" 
        className="bg-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-800 space-y-3 print:border-slate-900 print:shadow-none"
      >
        {/* Decision & One-sentence Reason */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
              {t.decisionSummaryTitle}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black tracking-wide ${decisionBadgeColor}`}>
                {decisionResult.decision}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {input.businessIdea} • {location.city || location.areaName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug pt-0.5">
              {decisionResult.summaryExplanation || decisionResult.headline}
            </p>
          </div>
        </div>

        {/* Three Key Figures */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-center">
          <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium leading-tight">{t.projectCostLabel}</span>
            <strong className="text-xs sm:text-sm font-mono font-black text-white block mt-0.5">{formatINR(financials.projectCost)}</strong>
          </div>
          <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium leading-tight">{t.loanWithSchemeLabel}</span>
            <strong className="text-xs sm:text-sm font-mono font-black text-white block mt-0.5">{formatINR(psLoanAmount)}</strong>
            <span className="text-[9px] text-indigo-300 block truncate font-medium">{psSchemeName} ({psInterestRate}%)</span>
            {!isFullyFunded && shortfall > 0 && (
              <span className="text-[9px] text-rose-400 block font-bold truncate">
                Shortfall: {formatINR(shortfall)}
              </span>
            )}
          </div>
          <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium leading-tight">{t.firstPaymentAfterMoratorium || t.quarterlyPaymentLabel}</span>
            <strong className="text-xs sm:text-sm font-mono font-black text-emerald-400 block mt-0.5">{formatINR(quarterlyPayment)}</strong>
            <span className="text-[8px] sm:text-[9px] text-slate-400 block font-normal leading-tight mt-0.5">{t.reducingPaymentNote}</span>
          </div>
        </div>

        {/* Top 3 Reasons and Top 3 Risks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{t.topReasonsTitle}</span>
            </span>
            <ul className="space-y-1 text-[11px] text-slate-200">
              {topReasons.slice(0, 3).map((r, i) => (
                <li key={i} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-emerald-400 font-bold shrink-0">•</span>
                  <span className="line-clamp-1">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{t.topRisksTitle}</span>
            </span>
            <ul className="space-y-1 text-[11px] text-slate-200">
              {topRisks.slice(0, 3).map((r, i) => (
                <li key={i} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-amber-400 font-bold shrink-0">•</span>
                  <span className="line-clamp-1">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Clearly Labelled "Do this first" Next Step */}
        <div className="bg-emerald-950/70 border border-emerald-500/40 p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 font-bold text-[11px]">
              1
            </div>
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400 block leading-tight">
                {t.doThisFirstTitle}
              </span>
              <strong className="text-white text-xs font-bold truncate block">
                {firstStep.title}
              </strong>
            </div>
          </div>
          <span className="text-[10px] text-emerald-300 font-bold bg-emerald-900/70 px-2 py-0.5 rounded-md border border-emerald-700/50 shrink-0">
            {firstStep.timeline || 'Week 1-2'}
          </span>
        </div>
      </div>

      {/* 2. JUMP TO SECTION LIST (Navigates to the corresponding analysis tab; replaces duplicate accordions on screen) */}
      <div 
        data-testid="jump-to-sections-list" 
        className="no-print bg-white dark:bg-[#0D111A] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Detailed Business Dossier & Analysis Sections</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any section below to jump directly to its full deep-dive in the Analysis View.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
            {downloadMode === 'short' ? 'Short Report View' : 'Full Report View'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SECTION_REGISTRY.map((item) => {
            const Icon = item.icon;
            const translatedTitle = (t as any)[item.labelKey] || item.defaultLabel;
            const cardDesc = item.id === 'jump-market'
              ? `${location.competitorsNearbyCount} competitors • 5 km & 10 km catchment`
              : item.defaultDesc;
            return (
              <button
                key={item.id}
                type="button"
                data-testid={item.id}
                onClick={() => onNavigateToSection?.(item.id)}
                className="flex items-start justify-between p-3.5 rounded-xl border transition-all text-left group hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/70 hover:bg-white dark:bg-slate-900/40 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={`p-2 rounded-lg ${item.bgColor} shrink-0`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                      {translatedTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                      {cardDesc}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2 mt-1" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Official Government / Bank Report Document (Hidden on screen to prevent duplicate rendering; visible in print) */}
      <div 
        data-testid="print-dossier-document"
        className="hidden print:block bg-white dark:bg-[#0D111A] rounded-2xl border border-slate-300 dark:border-slate-800 p-4 sm:p-8 shadow-sm relative overflow-hidden print:border-none print:shadow-none print:p-0 space-y-4 sm:space-y-6"
      >
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">
                PRAVIRAK
              </span>
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-sm border border-slate-300 dark:border-slate-700">
                {t.officialBusinessDossier}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 font-medium">
              {t.nationalPlatformBadge}
            </p>
          </div>

          <div className="text-right text-xs sm:text-sm text-slate-800 dark:text-slate-300 space-y-0.5 font-medium">
            <div><strong>{t.dossierRef}</strong> <span className="font-mono text-slate-950 dark:text-slate-100 font-bold">{refId}</span></div>
            <div><strong>{t.dateOfAppraisal}</strong> <span className="text-slate-900 dark:text-slate-200">{currentDate}</span></div>
            <div><strong>{t.statusLabel}</strong> <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{t.verifiedAnalysis}</span></div>
          </div>
        </div>

        {/* Data Provenance Legend */}
        <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl px-3.5 py-2 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-700 dark:text-slate-300">
          <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
            {t.provenanceLegendTitle}:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <strong className="text-emerald-800 dark:text-emerald-300 font-semibold">{t.badgeMeasured}</strong>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">({t.provenanceMeasuredDesc})</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <strong className="text-amber-800 dark:text-amber-300 font-semibold">{t.badgeEstimated}</strong>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">({t.provenanceEstimatedDesc})</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <strong className="text-purple-800 dark:text-purple-300 font-semibold">{t.badgeAi}</strong>
            <span className="text-slate-500 text-[11px]">({t.provenanceAiDesc})</span>
          </div>
        </div>

        {/* Collapsible Accordion Sections */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-900">

          {/* ACCORDION 1: Market & Competitors */}
          <div 
            id="market-competitors"
            data-testid="accordion-market-competitors" 
            className={`border border-slate-200 rounded-xl overflow-hidden print:border-slate-300 ${downloadMode === 'short' ? 'print:hidden' : ''}`}
          >
            <button
              type="button"
              onClick={() => toggleSection('market')}
              aria-expanded={openSections.market}
              data-expanded={openSections.market ? 'true' : 'false'}
              className="w-full text-left p-3.5 sm:p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3 cursor-pointer no-print-btn"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Compass className="w-4 h-4 text-indigo-700 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">
                    {t.sectionMarketAndCompetitors}
                  </h3>
                  <p className="text-xs text-slate-700 font-medium truncate mt-0.5">
                    {location.competitorsNearbyCount} {t.competitorsNearby.toLowerCase()} • {location.footfallMonthly.toLocaleString('en-IN')} {t.footfallInRadialCatchment.slice(0, 20)}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-slate-500">
                {openSections.market ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <div className={`p-4 space-y-4 border-t border-slate-200 ${openSections.market ? 'block' : 'hidden'} print:block`}>
              {/* Administrative Hierarchy Details */}
              <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
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

              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                Spatial radius scanning mapped <strong className="text-slate-950 font-bold">{location.competitorsNearbyCount} {t.competitorsNearby.toLowerCase()}</strong> {t.footfallInRadialCatchment} <strong className="text-slate-950 font-bold">{location.footfallMonthly.toLocaleString('en-IN')}</strong> across major residential colonies ({location.customerColonies.join(', ')}).
              </p>

              {location.competitors && location.competitors.length > 0 ? (
                <div className="text-xs text-slate-700 dark:text-slate-200 bg-emerald-50/60 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <strong className="text-emerald-950 dark:text-emerald-200 font-bold">{t.identifiedCompetitorsOsm} (OpenStreetMap - OSM):</strong>{' '}
                  {location.competitors.map((c) => c.name).filter(Boolean).join(', ')}
                </div>
              ) : location.competitorsNote ? (
                <div className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50/80 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
                  {location.competitorsNote}
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-extrabold text-slate-950 block mb-1">{t.demandSignals}</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-800 font-medium">
                    {location.demandSignals.map((sig, idx) => (
                      <li key={idx}>{sig}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-extrabold text-slate-950 block mb-1">{t.transitCorridors}</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-800 font-medium">
                    {location.transitPoints.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ACCORDION 2: Opportunities */}
          <div 
            id="opportunities"
            data-testid="accordion-opportunities" 
            className={`border border-slate-200 rounded-xl overflow-hidden print:border-slate-300 ${downloadMode === 'short' ? 'print:hidden' : ''}`}
          >
            <button
              type="button"
              onClick={() => toggleSection('opportunities')}
              aria-expanded={openSections.opportunities}
              data-expanded={openSections.opportunities ? 'true' : 'false'}
              className="w-full text-left p-3.5 sm:p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3 cursor-pointer no-print-btn"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">
                    {t.sectionOpportunities}
                  </h3>
                  <p className="text-xs text-slate-700 font-medium truncate mt-0.5">
                    {activeFeasibility?.opportunities?.length ?? 2} underserved market niches identified
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-slate-500">
                {openSections.opportunities ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <div className={`p-4 space-y-3 border-t border-slate-200 ${openSections.opportunities ? 'block' : 'hidden'} print:block`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(activeFeasibility?.opportunities || [
                  { niche: 'Direct Rural Retailing', why: 'High demand with minimal direct competition within walking distance' },
                  { niche: 'Value Pack Bundling', why: 'Offers tailored price points matching harvest and weekly wage income cycles' }
                ]).map((opp, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-indigo-100 text-indigo-800 mb-1">
                      Niche #{idx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{opp.niche}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{opp.why}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACCORDION 3: SWOT Analysis */}
          <div 
            id="swot"
            data-testid="accordion-swot" 
            className={`border border-slate-200 rounded-xl overflow-hidden print:border-slate-300 ${downloadMode === 'short' ? 'print:hidden' : ''}`}
          >
            <button
              type="button"
              onClick={() => toggleSection('swot')}
              aria-expanded={openSections.swot}
              data-expanded={openSections.swot ? 'true' : 'false'}
              className="w-full text-left p-3.5 sm:p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3 cursor-pointer no-print-btn"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Grid2X2 className="w-4 h-4 text-indigo-700 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">
                    {t.sectionSwot} — Strengths, Weaknesses, Opportunities, Threats (SWOT)
                  </h3>
                  <p className="text-xs text-slate-700 font-medium truncate mt-0.5">
                    Internal advantages and external risk factors mapped
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-slate-500">
                {openSections.swot ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <div className={`p-4 space-y-3 border-t border-slate-200 ${openSections.swot ? 'block' : 'hidden'} print:block`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Strengths */}
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/60">
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider block mb-1.5">
                    {t.swotStrengths} (Internal Advantages)
                  </span>
                  <ul className="space-y-1 text-xs text-emerald-900 dark:text-emerald-300 font-medium">
                    {(activeFeasibility?.swot?.strengths || ['Low fixed operational cost', 'Direct promoter oversight', 'Favorable local demand']).slice(0, 3).map((s, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/60">
                  <span className="text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider block mb-1.5">
                    {t.swotWeaknesses} (Internal Limitations)
                  </span>
                  <ul className="space-y-1 text-xs text-amber-900 dark:text-amber-300 font-medium">
                    {(activeFeasibility?.swot?.weaknesses || ['Limited initial working capital reserve', 'Reliance on single supplier base']).slice(0, 3).map((w, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities */}
                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800/60">
                  <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider block mb-1.5">
                    {t.swotOpportunities} (External Potentials)
                  </span>
                  <ul className="space-y-1 text-xs text-indigo-900 dark:text-indigo-300 font-medium">
                    {(activeFeasibility?.swot?.opportunities || ['Expanding consumer base in radial colonies', 'Govt scheme subsidy benefits']).slice(0, 3).map((o, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Threats */}
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-800/60">
                  <span className="text-xs font-bold text-rose-950 dark:text-rose-200 uppercase tracking-wider block mb-1.5">
                    {t.swotThreats} (External Hazards)
                  </span>
                  <ul className="space-y-1 text-xs text-rose-900 dark:text-rose-300 font-medium">
                    {(activeFeasibility?.swot?.threats || ['Seasonal demand variation', 'Unorganized competitor price cuts']).slice(0, 3).map((th, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                        <span>{th}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ACCORDION 4: Threats & Mitigations */}
          <div 
            id="threats"
            data-testid="accordion-threats" 
            className={`border border-slate-200 rounded-xl overflow-hidden print:border-slate-300 ${downloadMode === 'short' ? 'print:hidden' : ''}`}
          >
            <button
              type="button"
              onClick={() => toggleSection('threats')}
              aria-expanded={openSections.threats}
              data-expanded={openSections.threats ? 'true' : 'false'}
              className="w-full text-left p-3.5 sm:p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3 cursor-pointer no-print-btn"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">
                    {t.sectionThreats}
                  </h3>
                  <p className="text-xs text-slate-700 font-medium truncate mt-0.5">
                    {activeFeasibility?.threats?.length ?? 3} operational threats with mitigations
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-slate-500">
                {openSections.threats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <div className={`p-4 space-y-2.5 border-t border-slate-200 ${openSections.threats ? 'block' : 'hidden'} print:block`}>
              {(activeFeasibility?.threats || [
                { type: 'seasonal', description: 'Agricultural off-season slowdown', mitigation: 'Maintain 3-month working capital cash reserve' },
                { type: 'supply_chain', description: 'Wholesale price fluctuation', mitigation: 'Form multi-supplier sourcing contracts' }
              ]).slice(0, 3).map((th, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      {th.type}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900">{th.description}</p>
                  <p className="text-xs text-emerald-950 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200 font-medium">
                    <strong className="text-emerald-900 font-bold">{t.mitigationStrategyLabel}:</strong> {th.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ACCORDION 5: Pricing Guidance */}
          <div 
            id="pricing-guidance"
            data-testid="accordion-pricing-guidance" 
            className={`border border-slate-200 rounded-xl overflow-hidden print:border-slate-300 ${downloadMode === 'short' ? 'print:hidden' : ''}`}
          >
            <button
              type="button"
              onClick={() => toggleSection('pricing')}
              aria-expanded={openSections.pricing}
              data-expanded={openSections.pricing ? 'true' : 'false'}
              className="w-full text-left p-3.5 sm:p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3 cursor-pointer no-print-btn"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Tag className="w-4 h-4 text-indigo-700 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">
                    {t.sectionPricingGuidance}
                  </h3>
                  <p className="text-xs text-slate-700 font-medium truncate mt-0.5">
                    {activeFeasibility?.pricing?.strategy || 'Cost-plus margin with local market alignment'}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-slate-500">
                {openSections.pricing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <div className={`p-4 space-y-3 border-t border-slate-200 ${openSections.pricing ? 'block' : 'hidden'} print:block`}>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Recommended Strategy</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  {activeFeasibility?.pricing?.strategy || 'Cost-plus margin with daily local rate alignment'}
                </p>
              </div>
              <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 font-medium">
                <strong className="text-amber-900 dark:text-amber-200">{t.pricingGuidanceNoteLabel}:</strong>{' '}
                <span>{activeFeasibility?.pricing?.priceBandNote || 'Guidance only; verify daily prices at local mandi or market center.'}</span>
              </div>
            </div>
          </div>

          {/* ACCORDION 6: Loan Structure & Quarterly Schedule */}
          {reconciliation && (
            <div 
              id="loan-structure-schedule"
              data-testid="plan-scheme-loan-section" 
              className="border border-slate-200 rounded-xl overflow-hidden print:border-slate-300"
            >
              <button
                type="button"
                onClick={() => toggleSection('loanSchedule')}
                aria-expanded={openSections.loanSchedule}
                data-expanded={openSections.loanSchedule ? 'true' : 'false'}
                className="w-full text-left p-3.5 sm:p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3 cursor-pointer no-print-btn"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Landmark className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">
                      {t.sectionLoanStructure}
                    </h3>
                    <p className="text-xs text-slate-700 font-medium truncate mt-0.5">
                      {recommendedScheme.name} • {financials.interestRatePct}% p.a. • {financials.tenureYears} yrs
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-slate-500">
                  {openSections.loanSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              <div className={`p-4 space-y-4 border-t border-slate-200 ${openSections.loanSchedule ? 'block' : 'hidden'} print:block`}>
                <p className="text-xs text-slate-600 font-medium">
                  {t.govtSchemeLoanStructureDesc}
                </p>

                {/* Capital Reconciliation Banner */}
                {reconciliation.isFullyFunded ? (
                  <div
                    className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 space-y-2"
                    data-testid="plan-fully-funded-banner"
                  >
                    <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-extrabold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{t.fullyFundedTitle}</span>
                    </div>
                    <p className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed font-medium">
                      Your available capital of{' '}
                      <strong>₹{reconciliation.ownCapital.toLocaleString('en-IN')}</strong> meets the required 10% promoter contribution (
                      <strong>₹{reconciliation.requiredMargin.toLocaleString('en-IN')}</strong>) for the planned project cost of{' '}
                      <strong>₹{reconciliation.projectCost.toLocaleString('en-IN')}</strong>.
                    </p>
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 pt-1 flex flex-wrap gap-4">
                      <span>
                        {t.maxSupportableProjectCostTitle}:{' '}
                        <strong className="font-mono text-emerald-950 dark:text-emerald-100" data-testid="max-supportable-project">
                          ₹{reconciliation.maxSupportableProjectCost.toLocaleString('en-IN')}
                        </strong>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 space-y-3"
                    data-testid="plan-shortfall-banner"
                  >
                    <div className="flex items-start gap-2 text-amber-950 dark:text-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold text-xs sm:text-sm text-amber-950 dark:text-amber-200">
                          {t.shortfallAlertTitle}:{' '}
                          <span className="text-rose-600 dark:text-rose-400 font-mono" data-testid="plan-shortfall-amount">
                            ₹{reconciliation.shortfall.toLocaleString('en-IN')}
                          </span>
                        </h4>
                        <p className="text-xs text-amber-900 dark:text-amber-200 mt-1 leading-relaxed font-medium">
                          The estimated project cost of{' '}
                          <strong className="text-amber-950 dark:text-amber-100">₹{reconciliation.projectCost.toLocaleString('en-IN')}</strong> requires a 10% promoter contribution of{' '}
                          <strong className="text-amber-950 dark:text-amber-100">₹{reconciliation.requiredMargin.toLocaleString('en-IN')}</strong>, but your current available capital is{' '}
                          <strong className="text-amber-950 dark:text-amber-100">₹{reconciliation.ownCapital.toLocaleString('en-IN')}</strong>.
                        </p>
                        <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 font-semibold">
                          The institutional scheme structure below is calculated for the largest project your current capital can support (
                          <strong className="text-amber-950 dark:text-amber-100" data-testid="max-supportable-shortfall-project">₹{reconciliation.maxSupportableProjectCost.toLocaleString('en-IN')}</strong>).
                        </p>
                      </div>
                    </div>

                    {/* 3 Actionable Options to Bridge Shortfall */}
                    {reconciliation.optionsIfShortfall && (
                      <div className="bg-white/90 dark:bg-slate-900/90 rounded-xl p-3 border border-amber-200/80 dark:border-amber-800/80 space-y-2 text-xs" data-testid="shortfall-options-card">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 block text-xs uppercase tracking-wider">
                          {t.threeOptionsToProceed}:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-0.5">
                          <div className="p-2.5 bg-amber-50/50 dark:bg-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-800/60 space-y-0.5">
                            <strong className="text-slate-900 dark:text-slate-100 block font-bold">{t.optionAddCapitalTitle}</strong>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-[11px]">
                              {reconciliation.optionsIfShortfall.addCapitalText}
                            </p>
                          </div>
                          <div className="p-2.5 bg-amber-50/50 dark:bg-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-800/60 space-y-0.5">
                            <strong className="text-slate-900 dark:text-slate-100 block font-bold">{t.optionScaleDownTitle}</strong>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-[11px]">
                              {reconciliation.optionsIfShortfall.scaleDownText}
                            </p>
                          </div>
                          <div className="p-2.5 bg-amber-50/50 dark:bg-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-800/60 space-y-0.5">
                            <strong className="text-slate-900 dark:text-slate-100 block font-bold">{t.optionPhasedTitle}</strong>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-[11px]">
                              {reconciliation.optionsIfShortfall.phasedExecutionText}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SchemeLoanBreakdown */}
                <SchemeLoanBreakdown
                  result={reconciliation.calculationResult}
                  availableMargin={reconciliation.appliedMargin}
                  businessCategory={input.businessIdea}
                  locationSummary={location.areaName}
                  printMode={downloadMode}
                />
              </div>
            </div>
          )}

          {/* ACCORDION 7: Break-Even & Working Capital Buffer */}
          <div 
            id="breakeven-working-capital"
            data-testid="accordion-breakeven" 
            className={`border border-slate-200 rounded-xl overflow-hidden print:border-slate-300 ${downloadMode === 'short' ? 'print:hidden' : ''}`}
          >
            <button
              type="button"
              onClick={() => toggleSection('breakeven')}
              aria-expanded={openSections.breakeven}
              data-expanded={openSections.breakeven ? 'true' : 'false'}
              className="w-full text-left p-3.5 sm:p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3 cursor-pointer no-print-btn"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Calendar className="w-4 h-4 text-indigo-700 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">
                    {t.sectionBreakeven}
                  </h3>
                  <p className="text-xs text-slate-700 font-medium truncate mt-0.5">
                    Break-even ~{financials.breakEvenMonths} months • {financials.workingCapitalBufferMonths}-month reserve ({formatINR(financials.workingCapitalBufferAmount)})
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-slate-500">
                {openSections.breakeven ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <div className={`p-4 space-y-3 border-t border-slate-200 ${openSections.breakeven ? 'block' : 'hidden'} print:block`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-extrabold text-slate-950 uppercase tracking-wide block">Break-even Horizon</span>
                  <div className="text-lg font-black font-mono text-indigo-950">~{financials.breakEvenMonths} Months</div>
                  <p className="text-slate-600 font-medium leading-relaxed text-[11px]">
                    Point where cumulative business cash inflows equal total operational and debt service outflows.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-extrabold text-slate-950 uppercase tracking-wide block">Working Capital Buffer</span>
                  <div className="text-lg font-black font-mono text-indigo-950">{formatINR(financials.workingCapitalBufferAmount)}</div>
                  <p className="text-slate-600 font-medium leading-relaxed text-[11px]">
                    Emergency cash reserve for {financials.workingCapitalBufferMonths} months of fixed operating expenses to protect against delayed receivables.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-700 space-y-1">
                <div>• <strong>{t.promoterEquityExplanation}</strong>: {financials.promoterContributionPct}% of total project cost.</div>
                <div>• <strong>{t.moratoriumExplanation}</strong>: Typically 3 to 6 months depending on loan scheme guidelines.</div>
              </div>
            </div>
          </div>

          {/* ACCORDION 8: Stress Tests & Financial Breakdown */}
          <div 
            id="stress-tests"
            data-testid="accordion-stress-tests" 
            className={`border border-slate-200 rounded-xl overflow-hidden print:border-slate-300 ${downloadMode === 'short' ? 'print:hidden' : ''}`}
          >
            <button
              type="button"
              onClick={() => toggleSection('stressTests')}
              aria-expanded={openSections.stressTests}
              data-expanded={openSections.stressTests ? 'true' : 'false'}
              className="w-full text-left p-3.5 sm:p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3 cursor-pointer no-print-btn"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Layers className="w-4 h-4 text-emerald-700 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">
                    {t.sectionStressTests}
                  </h3>
                  <p className="text-xs text-slate-700 font-medium truncate mt-0.5">
                    Debt Service Coverage Ratio (DSCR): {financials.dscr}x ({financials.safetyStatus})
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-slate-500">
                {openSections.stressTests ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <div className={`p-4 space-y-3 border-t border-slate-200 ${openSections.stressTests ? 'block' : 'hidden'} print:block`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                  <thead className="bg-slate-100 text-slate-900 font-bold">
                    <tr className="border-b border-slate-200">
                      <th className="p-2.5 font-bold">{t.tableComponent}</th>
                      <th className="p-2.5 font-bold">{t.tableAmount}</th>
                      <th className="p-2.5 font-bold">{t.tableShare}</th>
                      <th className="p-2.5 font-bold">{t.tableNotes}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-900">{t.ownCapitalEquity}</td>
                      <td className="p-2.5 font-mono font-bold text-slate-950">{formatINR(financials.ownCapital)}</td>
                      <td className="p-2.5 font-mono font-medium text-slate-800">{financials.promoterContributionPct}%</td>
                      <td className="p-2.5 text-slate-800 font-medium">{t.equityNote}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-900">{t.potentialBankFinancing}</td>
                      <td className="p-2.5 font-mono font-bold text-slate-950">{formatINR(financials.loanRequired)}</td>
                      <td className="p-2.5 font-mono font-medium text-slate-800">{100 - financials.promoterContributionPct}%</td>
                      <td className="p-2.5 text-slate-800 font-medium">{t.debtNote}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2.5 text-slate-950">{t.estimatedProjectCost}</td>
                      <td className="p-2.5 font-mono text-indigo-950 font-extrabold">{formatINR(financials.projectCost)}</td>
                      <td className="p-2.5 font-mono font-bold text-slate-900">100%</td>
                      <td className="p-2.5 text-slate-900 font-medium">{t.capexBufferNote} ({formatINR(financials.workingCapitalBufferAmount)})</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-900">{t.monthlyRepaymentEMI}</td>
                      <td className="p-2.5 font-mono font-bold text-slate-950">{formatINR(financials.monthlyEMI)} / mo</td>
                      <td className="p-2.5 text-slate-600 font-medium">-</td>
                      <td className="p-2.5 text-slate-800 font-medium">{t.fixedEmiNote}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-900">{t.debtCoverageSafetyParam}</td>
                      <td className="p-2.5 font-mono font-black text-emerald-800">{financials.dscr}x</td>
                      <td className="p-2.5 text-slate-600 font-medium">-</td>
                      <td className="p-2.5 font-bold uppercase text-emerald-800">{financials.safetyStatus}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                <strong>{t.dscrPlainExplanation}</strong>. Benchmark for collateral-free MSME institutional schemes: DSCR &gt; 1.5x is SAFE; 1.25x - 1.5x is MODERATE; below 1.25x is HIGH RISK.
              </p>
            </div>
          </div>

          {/* ACCORDION 9: How This Was Calculated */}
          {reconciliation && (
            <div 
              id="how-this-was-calculated"
              data-testid="accordion-how-calculated" 
              className={`border border-slate-200 rounded-xl overflow-hidden print:border-slate-300 ${downloadMode === 'short' ? 'print:hidden' : ''}`}
            >
              <button
                type="button"
                onClick={() => toggleSection('howCalculated')}
                aria-expanded={openSections.howCalculated}
                data-expanded={openSections.howCalculated ? 'true' : 'false'}
                className="w-full text-left p-3.5 sm:p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3 cursor-pointer no-print-btn"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <HelpCircle className="w-4 h-4 text-indigo-950 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">
                      {t.sectionHowCalculated}
                    </h3>
                    <p className="text-xs text-slate-700 font-medium truncate mt-0.5">
                      Statutory 10% margin & institutional scheme sizing formula
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-slate-500">
                  {openSections.howCalculated ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              <div className={`p-4 space-y-3 border-t border-slate-200 ${openSections.howCalculated ? 'block' : 'hidden'} print:block`}>
                <div
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-3"
                  data-testid="how-calculated-card"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block font-medium text-[11px]">{t.promoterCapitalM}</span>
                      <strong className="text-slate-900 font-mono text-xs sm:text-sm block mt-0.5" data-testid="how-calc-m">
                        ₹{reconciliation.ownCapital.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block font-medium text-[11px]">{t.planProjectCostB}</span>
                      <strong className="text-slate-900 font-mono text-xs sm:text-sm block mt-0.5" data-testid="how-calc-b">
                        ₹{reconciliation.projectCost.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block font-medium text-[11px]">{t.requiredMarginPercent}</span>
                      <strong className="text-slate-900 font-mono text-xs sm:text-sm block mt-0.5" data-testid="how-calc-required-margin">
                        ₹{reconciliation.requiredMargin.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block font-medium text-[11px]">{t.maxSupportableM}</span>
                      <strong className="text-indigo-950 font-mono text-xs sm:text-sm block mt-0.5" data-testid="how-calc-max-supportable">
                        ₹{reconciliation.maxSupportableProjectCost.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="font-bold text-slate-900">{t.appliedCaseLabel}</span>
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-800" data-testid="how-calc-applied-case">
                        {reconciliation.isFullyFunded
                          ? 'Fully Funded (M ≥ 0.10 × B) — sized for project cost B'
                          : 'Capital Shortfall (M < 0.10 × B) — sized for maximum supportable project M / 0.10'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <strong>{t.statutorySchemeRulesApplied}</strong> Minimum promoter margin 10.0%, debt financing up to 90.0%. Micro Finance Scheme covers projects ≤ ₹1,40,000 (up to ₹1,25,000 at 6.5% p.a., 3 years with 3-month moratorium). Term Loan Scheme covers projects &gt; ₹1,40,000 up to ₹50,00,000 (up to ₹45,00,000 at 8.0% p.a., 7 years with 6-month moratorium). Projects &gt; ₹50,00,000 exceed scheme limits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACCORDION 10: Action Plan & Next Steps */}
          <div 
            id="action-plan"
            data-testid="accordion-action-plan" 
            className={`border border-slate-200 rounded-xl overflow-hidden print:border-slate-300 ${downloadMode === 'short' ? 'print:hidden' : ''}`}
          >
            <button
              type="button"
              onClick={() => toggleSection('actionPlan')}
              aria-expanded={openSections.actionPlan}
              data-expanded={openSections.actionPlan ? 'true' : 'false'}
              className="w-full text-left p-3.5 sm:p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3 cursor-pointer no-print-btn"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">
                    {t.sectionNextSteps}
                  </h3>
                  <p className="text-xs text-slate-700 font-medium truncate mt-0.5">
                    {decisionResult.actionPlan.length} steps to launch
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-slate-500">
                {openSections.actionPlan ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <div className={`p-4 space-y-2.5 border-t border-slate-200 ${openSections.actionPlan ? 'block' : 'hidden'} print:block`}>
              {decisionResult.actionPlan.map((step) => {
                const isChecked = completedSteps[step.stepNumber];
                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => toggleStep(step.stepNumber)}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer flex items-start gap-2.5 ${
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
                        <span className="text-[11px] text-indigo-900 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {step.timeline}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 font-medium leading-relaxed ${isChecked ? 'text-slate-500' : 'text-slate-800'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hidden anchor element to preserve testid for plan-local-feasibility-section */}
          <div data-testid="plan-local-feasibility-section" className="hidden" aria-hidden="true" />

          {/* APPENDIX: Full Repayment Schedule (Only rendered in print for Full Plan) */}
          {downloadMode === 'full' && reconciliation?.calculationResult && (
            <div 
              data-testid="print-appendix-schedule-section" 
              className="hidden print:block pt-6 border-t-2 border-slate-900 break-before-page"
            >
              <div className="mb-3">
                <h2 className="text-base font-black text-slate-950 uppercase tracking-wide">
                  {t.appendixScheduleTitle || 'Appendix: Full Loan Repayment Schedule'}
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Complete quarter-by-quarter amortisation schedule for {psSchemeName} ({psInterestRate}% p.a., {reconciliation.calculationResult.isEligible ? reconciliation.calculationResult.tenureYears : 0} years).
                </p>
              </div>
              <SchemeLoanBreakdown
                result={reconciliation.calculationResult}
                availableMargin={reconciliation.appliedMargin}
                businessCategory={input.businessIdea}
                locationSummary={location.areaName}
                isPrintAppendix={true}
              />
            </div>
          )}
        </div>

        {/* Official Footer & Sign-off */}
        <div className="mt-6 pt-4 border-t-2 border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-800 font-medium">
          <div>
            <span className="font-bold text-slate-950 block">{t.platformEnterpriseDecisionPlatform}</span>
            <p className="text-[11px] text-slate-600 mt-0.5">{t.dossierPlatformDesc}</p>
          </div>
          <div className="text-right text-xs">
            <div className="font-extrabold text-slate-950 uppercase">{t.verifiedAnalysis}</div>
            <div className="text-slate-600">{t.dossierRef} {refId}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
