import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronDown,
  FileText,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Calendar,
  Landmark
} from 'lucide-react';
import {
  BusinessDecisionResult,
  BusinessInput,
  FinancialAnalysis,
  GovernmentScheme,
  Language,
  LocationData,
  LocalFeasibilityReport
} from '../../types';
import { DecisionCard } from '../common/DecisionCard';
import { EvidenceCard } from '../common/EvidenceCard';
import { MarketMap } from './MarketMap';
import { LocationComparison } from './LocationComparison';
import { LocalFeasibilityReportView } from './LocalFeasibilityReportView';
import { fetchLocalFeasibilityReport } from '../../services/localFeasibilityService';
import { FinancialFeasibility } from './FinancialFeasibility';
import { StressTest } from './StressTest';
import { SchemeRecommendations } from '../common/SchemeRecommendations';
import { ComplianceCard } from '../common/ComplianceCard';
import { SchemeLoanBreakdown } from '../common/SchemeLoanBreakdown';
import { reconcileSchemeLoan } from '../../engine/schemeReconciliation';
import { formatINR } from '../../engine/financialEngine';
import { getSectorCompliances } from '../../data/compliances';
import { TRANSLATIONS } from '../../data/translations';
import { formatLocationField } from '../../engine/locationParser';
import {
  SectionRegistryEntry,
  getRegistryEntryByHash,
  getRegistryEntryById,
  getRegistryEntryByLegacyKey,
  buildSectionHash
} from '../../data/sectionRegistry';

export type SectionKey = 'DECISION' | 'MAP' | 'LOCAL_FEASIBILITY' | 'FINANCIALS' | 'STRESS' | 'SCHEMES';

interface DecisionDashboardProps {
  businessInput: BusinessInput;
  baseLocation: LocationData;
  activeLocation: LocationData;
  financials: FinancialAnalysis;
  decisionResult: BusinessDecisionResult;
  schemes: GovernmentScheme[];
  currentLanguage: Language;
  isAlternativeAdopted: boolean;
  initialSection?: SectionKey;
  targetSectionId?: string;
  onToggleAlternativeLocation: () => void;
  onEditInputs: () => void;
  onViewFullDossier: () => void;
  onBackToSummary?: () => void;
  feasibilityReport?: LocalFeasibilityReport | null;
}

const SECTION_TITLES: Record<SectionKey, string> = {
  DECISION: '1. Decision & Evidence',
  MAP: '2. Market Map & Sites',
  LOCAL_FEASIBILITY: '3. Local Feasibility Report',
  FINANCIALS: '4. Financial Feasibility & Loan Amortization',
  STRESS: '5. Stress Testing',
  SCHEMES: '6. Schemes & Compliance'
};

const SECTION_ORDER: SectionKey[] = ['DECISION', 'MAP', 'LOCAL_FEASIBILITY', 'FINANCIALS', 'STRESS', 'SCHEMES'];

export const DecisionDashboard: React.FC<DecisionDashboardProps> = ({
  businessInput,
  baseLocation,
  activeLocation,
  financials,
  decisionResult,
  schemes,
  currentLanguage,
  isAlternativeAdopted,
  initialSection,
  targetSectionId,
  onToggleAlternativeLocation,
  onEditInputs,
  onViewFullDossier,
  onBackToSummary,
  feasibilityReport
}) => {
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(new Set([initialSection || 'DECISION']));
  const [pendingTargetId, setPendingTargetId] = useState<string | null>(targetSectionId || null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const t = TRANSLATIONS[currentLanguage];
  const sectorCompliances = getSectorCompliances(businessInput.businessIdea);

  const reconciliation = useMemo(() => {
    return reconcileSchemeLoan(
      financials.ownCapital ?? businessInput.ownCapital ?? 0,
      financials.projectCost
    );
  }, [financials.ownCapital, businessInput.ownCapital, financials.projectCost]);

  const [internalFeasibility, setInternalFeasibility] = useState<LocalFeasibilityReport | null>(null);
  const [feasibilityLoading, setFeasibilityLoading] = useState(false);
  const [feasibilityError, setFeasibilityError] = useState<string | null>(null);

  const activeFeasibilityReport = feasibilityReport !== undefined ? feasibilityReport : internalFeasibility;

  const loadFeasibilityReport = useCallback(async () => {
    setFeasibilityLoading(true);
    setFeasibilityError(null);
    try {
      const res = await fetchLocalFeasibilityReport({
        category: businessInput.category || businessInput.businessIdea,
        location: activeLocation,
        ownCapital: businessInput.ownCapital,
        projectCost: financials.projectCost,
        competitorCount: activeLocation.competitorsNearbyCount,
        catchmentPopulationEstimate: null,
        language: currentLanguage
      });
      setInternalFeasibility(res);
    } catch (err: any) {
      setFeasibilityError(err?.message || 'Failed to load report');
    } finally {
      setFeasibilityLoading(false);
    }
  }, [businessInput, financials.projectCost, activeLocation, currentLanguage]);

  useEffect(() => {
    if (feasibilityReport === undefined) {
      loadFeasibilityReport();
    }
  }, [feasibilityReport, loadFeasibilityReport]);

  // Smoothly scrolls to target element clearing the sticky top header (height 64px + 16px buffer = 80px)
  const scrollToTargetElement = useCallback((targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return false;

    const HEADER_OFFSET = 80;
    const rect = el.getBoundingClientRect();
    const absoluteTop = rect.top + (window.pageYOffset || window.scrollY || 0);
    const targetY = Math.max(0, absoluteTop - HEADER_OFFSET);

    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      } catch {
        // fallback to scrollIntoView
      }
    }
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      // ignore
    }

    el.classList.add('section-deep-highlight');
    setHighlightedId(targetId);

    setTimeout(() => {
      el.classList.remove('section-deep-highlight');
      setHighlightedId(null);
    }, 1500);

    return true;
  }, []);

  const jumpToRegistryEntry = useCallback((entry: SectionRegistryEntry, updateHash = true) => {
    // Expand ONLY the target tab (collapse others)
    setOpenSections(new Set([entry.tab]));
    setPendingTargetId(entry.sectionId);

    if (updateHash && typeof window !== 'undefined') {
      const targetHash = buildSectionHash(entry);
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
    }
  }, []);

  // Listen for browser URL hash changes (#section=swot, etc.)
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (!hash || hash === '#summary' || hash === '#') return;
      const entry = getRegistryEntryByHash(hash);
      if (entry) {
        jumpToRegistryEntry(entry, false);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [jumpToRegistryEntry]);

  // Handle initialSection or targetSectionId passed from props
  useEffect(() => {
    if (targetSectionId) {
      const entry =
        getRegistryEntryById(targetSectionId) ||
        getRegistryEntryByHash(targetSectionId) ||
        getRegistryEntryByLegacyKey(targetSectionId);
      if (entry) {
        jumpToRegistryEntry(entry, true);
        return;
      }
      setPendingTargetId(targetSectionId);
      return;
    }
    if (initialSection) {
      const entry = getRegistryEntryByLegacyKey(initialSection);
      if (entry) {
        jumpToRegistryEntry(entry, true);
      } else {
        setOpenSections(new Set([initialSection]));
        setPendingTargetId(`section-${initialSection}`);
      }
    }
  }, [initialSection, targetSectionId, jumpToRegistryEntry]);

  // Reactive scroll and highlight effect: executes once target element is mounted and settled
  useEffect(() => {
    if (!pendingTargetId) return;

    let timer: any;
    // Wait for the DOM reflow to finish after collapsing other sections and expanding target
    const rafId = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        const scrolled = scrollToTargetElement(pendingTargetId);
        if (scrolled) {
          setPendingTargetId(null);
        }
      }, 60);
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (timer) clearTimeout(timer);
    };
  }, [pendingTargetId, activeFeasibilityReport, openSections, scrollToTargetElement]);

  const sectionTitles: Record<SectionKey, string> = {
    DECISION: t.sectionDecision,
    MAP: t.sectionMap,
    LOCAL_FEASIBILITY: `3. ${t.localFeasibilityReportTitle}`,
    FINANCIALS: t.sectionFinancials,
    STRESS: t.sectionStress,
    SCHEMES: t.sectionSchemes
  };

  const openSection = (key: SectionKey) => {
    // Expand ONLY the target tab (collapse others)
    setOpenSections(new Set([key]));
    const entry = getRegistryEntryByLegacyKey(key);
    if (entry && typeof window !== 'undefined') {
      window.location.hash = buildSectionHash(entry);
    }
    setPendingTargetId(`section-${key}`);
  };

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        return next;
      }
      // Expand ONLY the target section (collapse others)
      return new Set([key]);
    });
    // When toggled down (expanded), always scroll smoothly to the beginning of this analysis card
    setPendingTargetId(`section-${key}`);
  };

  const advanceTo = (key: SectionKey) => openSection(key);

  const handleBackToSummary = () => {
    if (typeof window !== 'undefined') {
      window.location.hash = '#summary';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (onBackToSummary) {
      onBackToSummary();
    } else {
      onViewFullDossier();
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      {/* Top Operational Context Bar */}
      <div className="bg-white dark:bg-[#0D0D0D] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-neutral-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
          <div>
            <span className="text-slate-500 dark:text-neutral-400 block font-medium">{t.businessTarget}</span>
            <strong className="text-slate-900 dark:text-white text-sm">{businessInput.businessIdea}</strong>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-neutral-800 hidden sm:block"></div>
          <div>
            <span className="text-slate-500 dark:text-neutral-400 block font-medium">{t.locationLabel}</span>
            <strong className="text-slate-900 dark:text-white text-sm">
              {activeLocation.areaName}, {activeLocation.city}
            </strong>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-neutral-800 hidden sm:block"></div>
          <div>
            <span className="text-slate-500 dark:text-neutral-400 block font-medium">{t.ownCapital}</span>
            <strong className="text-slate-900 dark:text-white text-sm font-mono">
              {(financials.ownCapital ?? businessInput.ownCapital ?? 0).toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              })}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="back-to-summary-btn"
            onClick={handleBackToSummary}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#1A1A1A] dark:hover:bg-[#262626] rounded-lg border border-slate-200 dark:border-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>{t.backToSummary}</span>
          </button>
          <button
            onClick={onEditInputs}
            className="px-3.5 py-1.5 text-xs font-bold text-indigo-900 dark:text-white bg-indigo-50 dark:bg-[#1A1A1A] hover:bg-indigo-100 dark:hover:bg-[#262626] rounded-lg border border-indigo-200 dark:border-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-300" />
            <span>{t.editInputs}</span>
          </button>
          <button
            onClick={onViewFullDossier}
            className="px-4 py-1.5 text-xs font-extrabold text-white bg-[#1E3A8A] hover:bg-[#1E40AF] rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.viewFullDossier}</span>
          </button>
        </div>

        {/* Administrative Hierarchy Details */}
        <div className="w-full pt-2.5 mt-1 border-t border-slate-100 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div>
            <span className="text-slate-500 dark:text-neutral-400 block font-medium">{t.villageLabel}:</span>
            <span className="text-slate-800 dark:text-neutral-200 font-semibold" data-testid="dashboard-village">
              {formatLocationField(activeLocation.village || businessInput.location?.village)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-neutral-400 block font-medium">{t.blockLabel}:</span>
            <span className="text-slate-800 dark:text-neutral-200 font-semibold" data-testid="dashboard-block">
              {formatLocationField(activeLocation.block || businessInput.location?.block)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-neutral-400 block font-medium">{t.districtLabel}:</span>
            <span className="text-slate-800 dark:text-neutral-200 font-semibold" data-testid="dashboard-district">
              {formatLocationField(activeLocation.district || businessInput.location?.district)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-neutral-400 block font-medium">{t.stateLabel}:</span>
            <span className="text-slate-800 dark:text-neutral-200 font-semibold" data-testid="dashboard-state">
              {formatLocationField(activeLocation.state || businessInput.location?.state)}
            </span>
          </div>
        </div>
      </div>

      {/* Section index (jump-to) */}
      <div className="flex overflow-x-auto gap-1.5 p-1.5 bg-slate-200/70 dark:bg-[#141414] rounded-xl border border-slate-300/80 dark:border-neutral-800 text-xs font-bold">
        {SECTION_ORDER.map((key) => (
          <button
            key={key}
            onClick={() => openSection(key)}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer font-extrabold ${
              openSections.has(key) ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-700 dark:text-neutral-300 bg-white/60 dark:bg-[#1F1F1F] hover:bg-white dark:hover:bg-[#2A2A2A] hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            {sectionTitles[key]}
          </button>
        ))}
      </div>

      {/* One-line Data Provenance Legend */}
      <div className="bg-white dark:bg-[#0D0D0D] rounded-xl px-4 py-2.5 border border-slate-200 dark:border-neutral-800 shadow-2xs flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
        <span className="font-bold text-slate-800 dark:text-neutral-200 uppercase tracking-wider text-[11px]">
          {t.provenanceLegendTitle}:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <strong className="text-emerald-800 dark:text-emerald-300 font-semibold">{t.badgeMeasured}</strong>
          <span className="text-slate-500 text-[11px]">({t.provenanceMeasuredDesc})</span>
        </div>
        <span className="text-slate-300 dark:text-neutral-700 hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <strong className="text-amber-800 dark:text-amber-300 font-semibold">{t.badgeEstimated}</strong>
          <span className="text-slate-500 text-[11px]">({t.provenanceEstimatedDesc})</span>
        </div>
        <span className="text-slate-300 dark:text-neutral-700 hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <strong className="text-purple-800 dark:text-purple-300 font-semibold">{t.badgeAi}</strong>
          <span className="text-slate-500 text-[11px]">({t.provenanceAiDesc})</span>
        </div>
      </div>

      {/* SECTION 1: DECISION & EVIDENCE */}
      <Section id="DECISION" title={sectionTitles.DECISION} isOpen={openSections.has('DECISION')} onToggle={() => toggleSection('DECISION')} onBackToFinalPlan={handleBackToSummary}>
        <div className="space-y-6">
          <DecisionCard
            decisionResult={decisionResult}
            currentLanguage={currentLanguage}
            onScrollToEvidence={() => openSection('DECISION')}
            onScrollToFinancials={() => advanceTo('FINANCIALS')}
            onScrollToMap={() => advanceTo('MAP')}
          />

          <div className="bg-white dark:bg-[#0D0D0D] rounded-2xl border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6 border-b border-slate-200 dark:border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-400 uppercase tracking-wider block">
                  {t.verifiableAuditTrail}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">{t.whyThisDecision}</h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-neutral-400">{t.multiSourceSynthesis}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(decisionResult.evidenceList || []).map((item) => (
                <EvidenceCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <NextStepBanner
            step={currentLanguage === 'te' ? 'దశ 1/5 పూర్తయింది' : currentLanguage === 'hi' ? 'चरण 1/5 पूर्ण' : 'Step 1 of 5 Complete'}
            message={t.nextStepMapMsg}
            ctaLabel={t.nextStepMapCta}
            onClick={() => advanceTo('MAP')}
            onBackToFinalPlan={handleBackToSummary}
          />
        </div>
      </Section>

      {/* SECTION 2: MARKET MAP */}
      <Section id="MAP" title={sectionTitles.MAP} isOpen={openSections.has('MAP')} onToggle={() => toggleSection('MAP')} onBackToFinalPlan={handleBackToSummary}>
        <div className="space-y-6">
          <MarketMap location={activeLocation} onSelectAlternative={onToggleAlternativeLocation} />
          <LocationComparison
            location={baseLocation}
            onApplyAlternative={onToggleAlternativeLocation}
            isAlternativeApplied={isAlternativeAdopted}
          />
          <NextStepBanner
            step={currentLanguage === 'te' ? 'దశ 2/6 పూర్తయింది' : currentLanguage === 'hi' ? 'चरण 2/6 पूर्ण' : 'Step 2 of 6 Complete'}
            message="Review empirical micro-catchment reach, SWOT matrix, and qualitative pricing strategy."
            ctaLabel={t.localFeasibilityReportTitle}
            onClick={() => advanceTo('LOCAL_FEASIBILITY')}
            onBackToFinalPlan={handleBackToSummary}
          />
        </div>
      </Section>

      {/* SECTION 3: LOCAL FEASIBILITY REPORT */}
      <Section id="LOCAL_FEASIBILITY" title={sectionTitles.LOCAL_FEASIBILITY} isOpen={openSections.has('LOCAL_FEASIBILITY')} onToggle={() => toggleSection('LOCAL_FEASIBILITY')} onBackToFinalPlan={handleBackToSummary}>
        <div className="space-y-6">
          <LocalFeasibilityReportView
            report={activeFeasibilityReport}
            location={activeLocation}
            category={businessInput.category || businessInput.businessIdea}
            isLoading={feasibilityLoading}
            error={feasibilityError}
            onRetry={loadFeasibilityReport}
          />
          <NextStepBanner
            step={currentLanguage === 'te' ? 'దశ 3/6 పూర్తయింది' : currentLanguage === 'hi' ? 'चरण 3/6 पूर्ण' : 'Step 3 of 6 Complete'}
            message={t.nextStepFinMsg}
            ctaLabel={t.nextStepFinCta}
            onClick={() => advanceTo('FINANCIALS')}
            onBackToFinalPlan={handleBackToSummary}
          />
        </div>
      </Section>

      {/* SECTION 4: FINANCIALS */}
      <Section id="FINANCIALS" title={sectionTitles.FINANCIALS} isOpen={openSections.has('FINANCIALS')} onToggle={() => toggleSection('FINANCIALS')} onBackToFinalPlan={handleBackToSummary}>
        <div className="space-y-6">
          <FinancialFeasibility financials={financials} />

          {/* Loan Structure & Quarterly Repayment Schedule (psCalculator) */}
          <div id="analysis-loan-schedule-section" data-testid="analysis-loan-schedule-section" className="scroll-mt-24 transition-all duration-500 bg-white dark:bg-[#0D0D0D] rounded-2xl border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white">
                  {t.sectionLoanStructure}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                {reconciliation.calculationResult.isEligible ? reconciliation.calculationResult.schemeName : 'MSME Scheme Loan'} • {reconciliation.calculationResult.isEligible ? reconciliation.calculationResult.interestRatePct : financials.interestRatePct}% p.a. • {reconciliation.calculationResult.isEligible ? reconciliation.calculationResult.tenureYears : financials.tenureYears} years with {reconciliation.calculationResult.isEligible ? reconciliation.calculationResult.moratoriumMonths : 6}-month moratorium
              </p>
            </div>

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

            <SchemeLoanBreakdown
              result={reconciliation.calculationResult}
              availableMargin={reconciliation.appliedMargin}
              businessCategory={businessInput.businessIdea}
              locationSummary={activeLocation.areaName}
            />
          </div>

          {/* Break-Even & Working Capital Buffer Details */}
          <div id="analysis-breakeven-section" data-testid="analysis-breakeven-section" className="scroll-mt-24 transition-all duration-500 bg-white dark:bg-[#0D0D0D] rounded-2xl border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-neutral-800 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
              <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white">
                {t.sectionBreakeven}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-1">
                <span className="font-extrabold text-slate-950 dark:text-slate-100 uppercase tracking-wide block">Break-even Horizon</span>
                <div className="text-lg font-black font-mono text-indigo-950 dark:text-indigo-300">~{financials.breakEvenMonths} Months</div>
                <p className="text-slate-600 dark:text-neutral-400 font-medium leading-relaxed text-[11px]">
                  Point where cumulative business cash inflows equal total operational and debt service outflows.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-1">
                <span className="font-extrabold text-slate-950 dark:text-slate-100 uppercase tracking-wide block">Working Capital Buffer</span>
                <div className="text-lg font-black font-mono text-indigo-950 dark:text-indigo-300">{formatINR(financials.workingCapitalBufferAmount)}</div>
                <p className="text-slate-600 dark:text-neutral-400 font-medium leading-relaxed text-[11px]">
                  Emergency cash reserve for {financials.workingCapitalBufferMonths} months of fixed operating expenses to protect against delayed receivables.
                </p>
              </div>
            </div>
          </div>

          {/* How This Was Calculated (Statutory Formula) */}
          <div 
            id="how-this-was-calculated"
            data-testid="accordion-how-calculated" 
            className="bg-white dark:bg-[#0D0D0D] rounded-2xl border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 shadow-sm space-y-3"
          >
            <div className="border-b border-slate-100 dark:border-neutral-800 pb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white">
                  {t.sectionHowCalculated}
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Statutory 10% margin & institutional scheme sizing formula
                </p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-neutral-900 p-3 rounded-xl border border-slate-200 dark:border-neutral-800 font-mono text-xs text-slate-800 dark:text-neutral-200 space-y-1">
              <div>• Available Promoter Capital (M): <strong data-testid="how-calc-m">{formatINR(reconciliation.ownCapital)}</strong></div>
              <div>• Estimated Project Cost (B): <strong data-testid="how-calc-b">{formatINR(reconciliation.projectCost)}</strong></div>
              <div>• Statutory 10% Base Contribution: <strong>{formatINR(reconciliation.requiredMargin)}</strong></div>
              <div>• Sized Scheme Loan Amount (L): <strong>{formatINR(reconciliation.calculationResult.isEligible ? reconciliation.calculationResult.loan : 0)}</strong></div>
              {!reconciliation.isFullyFunded && (
                <div className="text-rose-600 dark:text-rose-400">• Capital Shortfall: <strong>{formatINR(reconciliation.shortfall)}</strong></div>
              )}
            </div>
          </div>

          <NextStepBanner
            step={currentLanguage === 'te' ? 'దశ 4/5 పూర్తయింది' : currentLanguage === 'hi' ? 'चरण 4/5 पूर्ण' : 'Step 4 of 5 Complete'}
            message={t.nextStepStressMsg}
            ctaLabel={t.nextStepStressCta}
            onClick={() => advanceTo('STRESS')}
            onBackToFinalPlan={handleBackToSummary}
          />
        </div>
      </Section>

      {/* SECTION 5: STRESS TEST */}
      <Section id="STRESS" title={sectionTitles.STRESS} isOpen={openSections.has('STRESS')} onToggle={() => toggleSection('STRESS')} onBackToFinalPlan={handleBackToSummary}>
        <div className="space-y-6">
          <StressTest financials={financials} categoryKey={businessInput.businessIdea} />
          <NextStepBanner
            step={currentLanguage === 'te' ? 'దశ 5/5 పూర్తయింది' : currentLanguage === 'hi' ? 'चरण 5/5 पूर्ण' : 'Step 5 of 5 Complete'}
            message={t.nextStepSchemesMsg}
            ctaLabel={t.nextStepSchemesCta}
            onClick={() => advanceTo('SCHEMES')}
            onBackToFinalPlan={handleBackToSummary}
          />
        </div>
      </Section>

      {/* SECTION 6: SCHEMES & COMPLIANCE */}
      <Section id="SCHEMES" title={sectionTitles.SCHEMES} isOpen={openSections.has('SCHEMES')} onToggle={() => toggleSection('SCHEMES')} onBackToFinalPlan={handleBackToSummary}>
        <div className="space-y-8">
          <div>
            <div className="mb-4">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-400 uppercase tracking-wider block">
                Other Government Schemes to Explore
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Additional Institutional Subsidies (PMEGP, MUDRA, CGTMSE)
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                Explore supplementary central & state subsidies matching your profile
              </p>
            </div>
            <div className="space-y-4">
              <SchemeRecommendations
                businessIdea={businessInput.businessIdea}
                category={businessInput.category}
                ownCapital={financials.ownCapital}
                city={activeLocation.city}
                state={activeLocation.state}
                staticFallback={schemes}
              />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-neutral-800 pt-6">
            <div className="mb-4">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
                {t.statutoryChecklist}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">{t.beforeYouStart}</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                {t.statutoryChecklistSub} ({businessInput.businessIdea})
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectorCompliances.map((item) => (
                <ComplianceCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">{t.finalStepReady}</div>
              <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {t.readyForDossier}
              </h4>
              <p className="text-sm text-slate-200 mt-1.5 font-medium leading-relaxed">
                {t.step5Message}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={onViewFullDossier}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>{t.generateBusinessPlan}</span>
                <ArrowRight className="w-4 h-4 text-emerald-100" />
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* BOTTOM ACTION CARD: Generate Business Plan / View Full Dossier */}
      <div 
        data-testid="bottom-generate-plan-container"
        className="bg-white dark:bg-[#0D0D0D] rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/60 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-6"
      >
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.finalStepReady}</span>
          </div>
          <h4 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white mt-1">
            {t.readyForDossier}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed font-medium">
            {t.step5Message}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={onEditInputs}
            className="flex-1 sm:flex-none px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>{t.editInputs}</span>
          </button>
          <button
            type="button"
            onClick={onViewFullDossier}
            data-testid="generate-plan-bottom-btn"
            className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
          >
            <FileText className="w-4 h-4 text-emerald-100" />
            <span>{t.generateBusinessPlan}</span>
            <ArrowRight className="w-4 h-4 text-emerald-100" />
          </button>
        </div>
      </div>

      {/* Floating Quick Return Button to Final Plan */}
      <aside aria-label="Quick navigation" className="fixed bottom-6 right-6 z-40 no-print">
        <button
          type="button"
          onClick={handleBackToSummary}
          data-testid="floating-back-to-plan-btn"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-full shadow-lg hover:shadow-xl font-extrabold text-xs transition-all cursor-pointer transform hover:-translate-y-0.5 border border-blue-400/40 backdrop-blur-sm"
          title="Back to Final Plan Cards"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300" />
          <span>Back to Plan Cards</span>
        </button>
      </aside>

      {/* Mobile bottom quick-jump bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-3 shadow-lg flex items-center justify-between gap-2">
        <button
          onClick={() => openSection('DECISION')}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg ${
            openSections.has('DECISION') ? 'bg-indigo-950 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {t.decisionLabel}
        </button>
        <button
          onClick={() => openSection('MAP')}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg ${
            openSections.has('MAP') ? 'bg-indigo-950 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {t.mapLabel}
        </button>
        <button
          onClick={() => openSection('FINANCIALS')}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg ${
            openSections.has('FINANCIALS') ? 'bg-indigo-950 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {t.financialsLabel}
        </button>
        <button
          onClick={onViewFullDossier}
          className="flex-1 py-2 text-center text-xs font-bold rounded-lg bg-emerald-600 text-white"
        >
          {t.planLabel}
        </button>
      </div>
    </div>
  );
};

const Section: React.FC<{
  id: SectionKey;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  onBackToFinalPlan?: () => void;
  children: React.ReactNode;
}> = ({ id, title, isOpen, onToggle, onBackToFinalPlan, children }) => (
  <div id={`section-${id}`} className="scroll-mt-28">
    <div className="w-full flex items-center justify-between bg-white dark:bg-[#0D0D0D] rounded-2xl border border-slate-200 dark:border-neutral-800 px-4 sm:px-5 py-3.5 sm:py-4 shadow-2xs hover:border-indigo-200 dark:hover:border-neutral-700 transition-colors">
      <button
        onClick={onToggle}
        data-testid={`accordion-btn-${id}`}
        data-open={isOpen ? 'true' : 'false'}
        className="flex-1 flex items-center justify-between cursor-pointer text-left mr-2"
      >
        <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">{title}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-neutral-400 transition-transform shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && onBackToFinalPlan && (
        <button
          type="button"
          data-testid={`back-to-plan-btn-${id}`}
          onClick={(e) => {
            e.stopPropagation();
            onBackToFinalPlan();
          }}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-900 dark:text-indigo-200 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 transition-colors shadow-2xs cursor-pointer"
          title="Back to Final Plan Cards"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">Back to Plan Cards</span>
          <span className="sm:hidden">Plan</span>
        </button>
      )}
    </div>
    {isOpen && <div className="mt-4">{children}</div>}
  </div>
);

const NextStepBanner: React.FC<{
  step: string;
  message: React.ReactNode;
  ctaLabel: string;
  onClick: () => void;
  onBackToFinalPlan?: () => void;
}> = ({ step, message, ctaLabel, onClick, onBackToFinalPlan }) => (
  <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
        <Sparkles className="w-3 h-3" />
        {step}
      </div>
      <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">What should you do next?</h4>
      <p className="text-xs text-slate-300 mt-1">{message}</p>
    </div>
    <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
      {onBackToFinalPlan && (
        <button
          type="button"
          onClick={onBackToFinalPlan}
          className="flex-1 sm:flex-none px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          <span>Back to Plan Cards</span>
        </button>
      )}
      <button
        onClick={onClick}
        className="flex-1 sm:flex-none px-5 py-3 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
      >
        <span>{ctaLabel}</span>
        <ArrowRight className="w-4 h-4 text-white" />
      </button>
    </div>
  </div>
);
