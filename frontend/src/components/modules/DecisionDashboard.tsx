import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronDown,
  FileText,
  ArrowRight,
  Sparkles,
  Edit3
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
import { RiskCard } from '../common/RiskCard';
import { MarketMap } from './MarketMap';
import { LocationComparison } from './LocationComparison';
import { LocalFeasibilityReportView } from './LocalFeasibilityReportView';
import { fetchLocalFeasibilityReport } from '../../services/localFeasibilityService';
import { FinancialFeasibility } from './FinancialFeasibility';
import { StressTest } from './StressTest';
import { SchemeRecommendations } from '../common/SchemeRecommendations';
import { ComplianceCard } from '../common/ComplianceCard';
import { AskPravirak } from './AskPravirak';
import { getSectorCompliances } from '../../data/compliances';
import { TRANSLATIONS } from '../../data/translations';
import { formatLocationField } from '../../engine/locationParser';

type SectionKey = 'DECISION' | 'MAP' | 'LOCAL_FEASIBILITY' | 'FINANCIALS' | 'STRESS' | 'SCHEMES' | 'ADVISOR';

interface DecisionDashboardProps {
  businessInput: BusinessInput;
  baseLocation: LocationData;
  activeLocation: LocationData;
  financials: FinancialAnalysis;
  decisionResult: BusinessDecisionResult;
  schemes: GovernmentScheme[];
  currentLanguage: Language;
  isAlternativeAdopted: boolean;
  onToggleAlternativeLocation: () => void;
  onEditInputs: () => void;
  onViewFullDossier: () => void;
  feasibilityReport?: LocalFeasibilityReport | null;
}

const SECTION_TITLES: Record<SectionKey, string> = {
  DECISION: '1. Decision & Evidence',
  MAP: '2. Market Map & Sites',
  LOCAL_FEASIBILITY: '3. Local Feasibility Report',
  FINANCIALS: '4. Financial Feasibility',
  STRESS: '5. Stress Testing',
  SCHEMES: '6. Schemes & Compliance',
  ADVISOR: '7. Ask PRAVIRAK'
};

const SECTION_ORDER: SectionKey[] = ['DECISION', 'MAP', 'LOCAL_FEASIBILITY', 'FINANCIALS', 'STRESS', 'SCHEMES', 'ADVISOR'];

export const DecisionDashboard: React.FC<DecisionDashboardProps> = ({
  businessInput,
  baseLocation,
  activeLocation,
  financials,
  decisionResult,
  schemes,
  currentLanguage,
  isAlternativeAdopted,
  onToggleAlternativeLocation,
  onEditInputs,
  onViewFullDossier,
  feasibilityReport
}) => {
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(new Set(['DECISION']));
  const t = TRANSLATIONS[currentLanguage];
  const sectorCompliances = getSectorCompliances(businessInput.businessIdea);

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

  const sectionTitles: Record<SectionKey, string> = {
    DECISION: t.sectionDecision,
    MAP: t.sectionMap,
    LOCAL_FEASIBILITY: `3. ${t.localFeasibilityReportTitle}`,
    FINANCIALS: t.sectionFinancials,
    STRESS: t.sectionStress,
    SCHEMES: t.sectionSchemes,
    ADVISOR: t.sectionAdvisor
  };

  const openSection = (key: SectionKey) => {
    setOpenSections((prev) => new Set(prev).add(key));
    requestAnimationFrame(() => {
      document.getElementById(`section-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const advanceTo = (key: SectionKey) => openSection(key);

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
              {financials.ownCapital.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              })}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
      <Section id="DECISION" title={sectionTitles.DECISION} isOpen={openSections.has('DECISION')} onToggle={() => toggleSection('DECISION')}>
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
              {decisionResult.evidenceList.map((item) => (
                <EvidenceCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0D0D0D] rounded-2xl border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm">
            <div className="mb-5 border-b border-slate-200 dark:border-neutral-800 pb-3">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
                {t.vulnerabilityAssessment}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{t.identifiedRiskFactors}</h3>
            </div>
            <div className="space-y-3">
              {decisionResult.riskFactors.map((rf, idx) => (
                <RiskCard key={idx} title={rf.title} severity={rf.severity} mitigation={rf.mitigation} />
              ))}
            </div>
          </div>

          <NextStepBanner
            step={currentLanguage === 'te' ? 'దశ 1/5 పూర్తయింది' : currentLanguage === 'hi' ? 'चरण 1/5 पूर्ण' : 'Step 1 of 5 Complete'}
            message={t.nextStepMapMsg}
            ctaLabel={t.nextStepMapCta}
            onClick={() => advanceTo('MAP')}
          />
        </div>
      </Section>

      {/* SECTION 2: MARKET MAP */}
      <Section id="MAP" title={sectionTitles.MAP} isOpen={openSections.has('MAP')} onToggle={() => toggleSection('MAP')}>
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
          />
        </div>
      </Section>

      {/* SECTION 3: LOCAL FEASIBILITY REPORT */}
      <Section id="LOCAL_FEASIBILITY" title={sectionTitles.LOCAL_FEASIBILITY} isOpen={openSections.has('LOCAL_FEASIBILITY')} onToggle={() => toggleSection('LOCAL_FEASIBILITY')}>
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
          />
        </div>
      </Section>

      {/* SECTION 3: FINANCIALS */}
      <Section id="FINANCIALS" title={sectionTitles.FINANCIALS} isOpen={openSections.has('FINANCIALS')} onToggle={() => toggleSection('FINANCIALS')}>
        <div className="space-y-6">
          <FinancialFeasibility financials={financials} />
          <NextStepBanner
            step={currentLanguage === 'te' ? 'దశ 3/5 పూర్తయింది' : currentLanguage === 'hi' ? 'चरण 3/5 पूर्ण' : 'Step 3 of 5 Complete'}
            message={t.nextStepStressMsg}
            ctaLabel={t.nextStepStressCta}
            onClick={() => advanceTo('STRESS')}
          />
        </div>
      </Section>

      {/* SECTION 4: STRESS TEST */}
      <Section id="STRESS" title={sectionTitles.STRESS} isOpen={openSections.has('STRESS')} onToggle={() => toggleSection('STRESS')}>
        <div className="space-y-6">
          <StressTest financials={financials} categoryKey={businessInput.businessIdea} />
          <NextStepBanner
            step={currentLanguage === 'te' ? 'దశ 4/5 పూర్తయింది' : currentLanguage === 'hi' ? 'चरण 4/5 पूर्ण' : 'Step 4 of 5 Complete'}
            message={t.nextStepSchemesMsg}
            ctaLabel={t.nextStepSchemesCta}
            onClick={() => advanceTo('SCHEMES')}
          />
        </div>
      </Section>

      {/* SECTION 5: SCHEMES & COMPLIANCE */}
      <Section id="SCHEMES" title={sectionTitles.SCHEMES} isOpen={openSections.has('SCHEMES')} onToggle={() => toggleSection('SCHEMES')}>
        <div className="space-y-8">
          <div>
            <div className="mb-4">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
                {t.subsidizedCapital}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{t.financingOptions}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {t.matchedSchemesSub} ({financials.loanRequired.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0
                })})
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

          <div className="border-t border-slate-200 pt-6">
            <div className="mb-4">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                {t.statutoryChecklist}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{t.beforeYouStart}</h3>
              <p className="text-xs text-slate-500 mt-1">
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
                onClick={() => advanceTo('ADVISOR')}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{t.askAiAdvisor}</span>
              </button>
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

      {/* SECTION 6: ASK PRAVIRAK */}
      <Section id="ADVISOR" title={sectionTitles.ADVISOR} isOpen={openSections.has('ADVISOR')} onToggle={() => toggleSection('ADVISOR')}>
        <AskPravirak input={businessInput} location={activeLocation} financials={financials} decisionResult={decisionResult} />
      </Section>

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
  children: React.ReactNode;
}> = ({ id, title, isOpen, onToggle, children }) => (
  <div id={`section-${id}`} className="scroll-mt-24">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between bg-white dark:bg-[#0D0D0D] rounded-2xl border border-slate-200 dark:border-neutral-800 px-5 py-4 shadow-2xs hover:border-indigo-200 dark:hover:border-neutral-700 transition-colors"
    >
      <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">{title}</span>
      <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && <div className="mt-4">{children}</div>}
  </div>
);

const NextStepBanner: React.FC<{
  step: string;
  message: React.ReactNode;
  ctaLabel: string;
  onClick: () => void;
}> = ({ step, message, ctaLabel, onClick }) => (
  <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
        <Sparkles className="w-3 h-3" />
        {step}
      </div>
      <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">What should you do next?</h4>
      <p className="text-xs text-slate-300 mt-1">{message}</p>
    </div>
    <button
      onClick={onClick}
      className="w-full sm:w-auto px-5 py-3 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors shrink-0 cursor-pointer"
    >
      <span>{ctaLabel}</span>
      <ArrowRight className="w-4 h-4 text-white" />
    </button>
  </div>
);
