import React from 'react';
import {
  FileText,
  Compass,
  Lightbulb,
  Grid2X2,
  ShieldAlert,
  Tag,
  Landmark,
  Calendar,
  AlertTriangle,
  Award
} from 'lucide-react';
import { SectionKey } from '../components/modules/DecisionDashboard';

export interface SectionRegistryEntry {
  /** Unique identifier for the jump card button and DOM anchor */
  id: string;
  /** Main tab in the Analysis View (DecisionDashboard) */
  tab: SectionKey;
  /** Target DOM element ID to scroll to and highlight within the tab */
  sectionId: string;
  /** URL hash fragment (e.g. #section=swot) */
  hash: string;
  /** Key in TRANSLATIONS for label, or fallback label */
  labelKey: string;
  defaultLabel: string;
  /** Short description explaining what this section contains */
  defaultDesc: string;
  /** Lucide icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Color theme classes */
  color: string;
  bgColor: string;
}

/**
 * Single Source of Truth for all Dossier Jump-to-Section cards and Deep Links.
 * Maps each jump card to its active tab and DOM element ID in the Analysis View.
 */
export const SECTION_REGISTRY: SectionRegistryEntry[] = [
  {
    id: 'jump-decision',
    tab: 'DECISION',
    sectionId: 'section-DECISION',
    hash: 'decision',
    labelKey: 'decisionSummaryTitle',
    defaultLabel: '1. Executive Recommendation',
    defaultDesc: 'Decision rationale & 4-pillar scores',
    icon: FileText,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900/40'
  },
  {
    id: 'jump-market',
    tab: 'MAP',
    sectionId: 'section-MAP',
    hash: 'market',
    labelKey: 'sectionMarketAndCompetitors',
    defaultLabel: '2. Market & Competitors',
    defaultDesc: 'Catchment radii, footfall & competitor pins',
    icon: Compass,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40'
  },
  {
    id: 'jump-opportunities',
    tab: 'LOCAL_FEASIBILITY',
    sectionId: 'section-opportunities',
    hash: 'opportunities',
    labelKey: 'sectionOpportunities',
    defaultLabel: '3. Opportunities & Demand',
    defaultDesc: 'Footfall, unserved demand & customer colonies',
    icon: Lightbulb,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40'
  },
  {
    id: 'jump-swot',
    tab: 'LOCAL_FEASIBILITY',
    sectionId: 'section-swot',
    hash: 'swot',
    labelKey: 'sectionSwot',
    defaultLabel: '4. SWOT Analysis',
    defaultDesc: 'Strengths, weaknesses, opportunities & threats',
    icon: Grid2X2,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/40'
  },
  {
    id: 'jump-threats',
    tab: 'LOCAL_FEASIBILITY',
    sectionId: 'section-threats',
    hash: 'threats',
    labelKey: 'sectionThreats',
    defaultLabel: '5. Threats & Mitigations',
    defaultDesc: 'Operational risks, supply chain & risk mitigations',
    icon: ShieldAlert,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40'
  },
  {
    id: 'jump-pricing',
    tab: 'LOCAL_FEASIBILITY',
    sectionId: 'section-pricing',
    hash: 'pricing',
    labelKey: 'sectionPricingGuidance',
    defaultLabel: '6. Pricing Guidance',
    defaultDesc: 'Pricing strategy, margin targets & sensitivity',
    icon: Tag,
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/40'
  },
  {
    id: 'jump-financials',
    tab: 'FINANCIALS',
    sectionId: 'analysis-loan-schedule-section',
    hash: 'loan-schedule',
    labelKey: 'sectionLoanStructure',
    defaultLabel: '7. Loan Structure & Schedule',
    defaultDesc: 'Scheme routing, tenure, interest & quarterly schedule',
    icon: Landmark,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40'
  },
  {
    id: 'jump-breakeven',
    tab: 'FINANCIALS',
    sectionId: 'analysis-breakeven-section',
    hash: 'breakeven',
    labelKey: 'sectionBreakeven',
    defaultLabel: '8. Break-Even & Buffer',
    defaultDesc: 'Break-even horizon & working capital emergency reserve',
    icon: Calendar,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40'
  },
  {
    id: 'jump-stress',
    tab: 'STRESS',
    sectionId: 'section-STRESS',
    hash: 'stress',
    labelKey: 'sectionStressTests',
    defaultLabel: '9. Stress Tests & Sensitivity',
    defaultDesc: 'Revenue drops, expense surges & DSCR resilience',
    icon: AlertTriangle,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/40'
  },
  {
    id: 'jump-schemes',
    tab: 'SCHEMES',
    sectionId: 'section-SCHEMES',
    hash: 'schemes',
    labelKey: 'sectionSchemes',
    defaultLabel: '10. Schemes & Compliance',
    defaultDesc: 'PMEGP, MUDRA, CGTMSE & statutory checklist',
    icon: Award,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-100 dark:border-cyan-900/40'
  }
];

/**
 * Find registry entry by URL hash (supports '#section=swot' or 'swot')
 */
export function getRegistryEntryByHash(hashString: string): SectionRegistryEntry | undefined {
  if (!hashString) return undefined;
  const clean = hashString.replace(/^#/, '');
  // Match '#section=name' or just '#name'
  const match = clean.match(/^(?:section=)?([a-zA-Z0-9_-]+)/);
  if (!match) return undefined;
  const key = match[1].toLowerCase();

  return SECTION_REGISTRY.find(
    (e) => e.hash.toLowerCase() === key || e.id.toLowerCase() === key || e.sectionId.toLowerCase() === key
  );
}

/**
 * Find registry entry by jump card id (e.g. 'jump-swot')
 */
export function getRegistryEntryById(id: string): SectionRegistryEntry | undefined {
  return SECTION_REGISTRY.find((e) => e.id === id);
}

/**
 * Find registry entry by sectionKey legacy string (e.g. 'SWOT', 'FINANCIALS')
 */
export function getRegistryEntryByLegacyKey(key: string): SectionRegistryEntry | undefined {
  const upper = key.toUpperCase();
  switch (upper) {
    case 'DECISION':
      return SECTION_REGISTRY.find((e) => e.id === 'jump-decision');
    case 'MAP':
      return SECTION_REGISTRY.find((e) => e.id === 'jump-market');
    case 'OPPORTUNITIES':
      return SECTION_REGISTRY.find((e) => e.id === 'jump-opportunities');
    case 'SWOT':
      return SECTION_REGISTRY.find((e) => e.id === 'jump-swot');
    case 'THREATS':
      return SECTION_REGISTRY.find((e) => e.id === 'jump-threats');
    case 'PRICING':
      return SECTION_REGISTRY.find((e) => e.id === 'jump-pricing');
    case 'FINANCIALS':
    case 'LOAN_SCHEDULE':
      return SECTION_REGISTRY.find((e) => e.id === 'jump-financials');
    case 'BREAKEVEN':
      return SECTION_REGISTRY.find((e) => e.id === 'jump-breakeven');
    case 'STRESS':
      return SECTION_REGISTRY.find((e) => e.id === 'jump-stress');
    case 'SCHEMES':
      return SECTION_REGISTRY.find((e) => e.id === 'jump-schemes');
    default:
      return getRegistryEntryByHash(key) || getRegistryEntryById(key);
  }
}

/**
 * Construct URL hash for given registry entry
 */
export function buildSectionHash(entryOrHash: SectionRegistryEntry | string): string {
  const hash = typeof entryOrHash === 'string' ? entryOrHash : entryOrHash.hash;
  return `#section=${hash}`;
}
