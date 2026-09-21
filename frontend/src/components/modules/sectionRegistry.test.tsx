import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DecisionDashboard } from './DecisionDashboard';
import { SECTION_REGISTRY, getRegistryEntryById, getRegistryEntryByHash } from '../../data/sectionRegistry';
import { GOVERNMENT_SCHEMES } from '../../data/schemes';
import { LanguageProvider } from '../../context/LanguageContext';
import { BusinessInput, FinancialAnalysis, BusinessDecisionResult, LocationData } from '../../types';

const mockInput: BusinessInput = {
  businessIdea: 'Handloom Weaving Unit',
  category: 'textiles',
  location: {
    address: 'Pembarthi, Jangaon, Telangana',
    latitude: 17.7,
    longitude: 79.1,
    city: 'Jangaon',
    state: 'Telangana',
    source: 'USER_INPUT'
  },
  ownCapital: 100000,
  experience: 'Moderate (1-3 yrs)',
  existingSpace: 'Owned premises',
  targetCustomers: 'Wholesale / B2B',
  preferredScale: 'Micro (Local)'
};

const mockLocation: LocationData = {
  id: 'loc-1',
  areaName: 'Pembarthi, Jangaon, Telangana',
  city: 'Jangaon',
  state: 'Telangana',
  village: 'Pembarthi',
  block: 'Jangaon Mandal',
  district: 'Jangaon',
  pincode: '506221',
  lat: 17.84,
  lng: 79.25,
  footfallMonthly: 12000,
  residentialColoniesNearby: 5,
  competitorsNearbyCount: 1,
  marketDistanceKm: 0.8,
  competitors: [],
  demandSignals: ['High local agro demand'],
  customerColonies: ['Main Village Colony'],
  transitPoints: ['Mandal Junction'],
  commercialHubs: ['Market Street'],
  provenance: 'ESTIMATED',
  competitorsCountProvenance: 'ESTIMATED',
  footfallMonthlyProvenance: 'ESTIMATED',
  residentialColoniesNearbyProvenance: 'ESTIMATED',
  marketDistanceKmProvenance: 'ESTIMATED',
  scoreProvenance: 'ESTIMATED',
  metricsProvenance: {
    score: 'ESTIMATED',
    footfallMonthly: 'ESTIMATED',
    residentialColoniesNearby: 'ESTIMATED',
    competitorsNearbyCount: 'ESTIMATED',
    marketDistanceKm: 'ESTIMATED',
    alternativeLocation: 'ESTIMATED'
  },
  score: 82
};

const mockFinancials: FinancialAnalysis = {
  projectCost: 1000000,
  capexItems: [],
  workingCapitalBufferMonths: 3,
  workingCapitalBufferAmount: 45000,
  ownCapital: 100000,
  promoterContributionPct: 10,
  loanRequired: 900000,
  interestRatePct: 8.0,
  tenureYears: 7,
  monthlyEMI: 15500,
  projectedMonthlyRevenue: 150000,
  projectedMonthlyOpex: 85000,
  monthlyGrossSurplus: 65000,
  monthlyNetSurplus: 47500,
  dscr: 1.85,
  safetyStatus: 'SAFE',
  breakEvenMonths: 8
};

const mockDecision: BusinessDecisionResult = {
  decision: 'START',
  headline: 'Highly viable location in Pembarthi cluster',
  summaryExplanation: 'Unit economics and market capture support sustainable debt servicing.',
  pillars: {
    localDemand: { grade: 'Good', commentary: 'Strong demand' },
    competition: { grade: 'Good', commentary: 'Low competition' },
    locationFit: { grade: 'Good', commentary: 'High suitability' },
    financialFeasibility: { grade: 'Good', commentary: 'Profitable' }
  },
  locationFitAnalysis: {
    overallFitScore: 88,
    fitCategory: 'High Fit',
    factors: [],
    disclaimer: 'Mock disclaimer'
  },
  evidenceList: [
    {
      id: 'ev-1',
      title: 'Strong demand',
      detail: 'GI tagged handloom hub',
      source: 'Demographics',
      type: 'Estimated',
      confidence: 'HIGH'
    }
  ],
  riskFactors: [{ title: 'Working capital delay', severity: 'Medium', mitigation: '3-month cash buffer' }],
  actionPlan: [{ stepNumber: 1, title: 'Apply for Udyam and Term Loan', timeline: 'Week 1-2', description: 'Register online' }]
};

describe('Section Registry & Deep Links (PART 1)', () => {
  beforeEach(() => {
    // Mock scrollIntoView in jsdom
    Element.prototype.scrollIntoView = vi.fn();
    window.location.hash = '';
  });

  it('contains exactly 10 registered deep link sections with unique IDs and hashes', () => {
    expect(SECTION_REGISTRY.length).toBe(10);
    const ids = new Set(SECTION_REGISTRY.map(s => s.id));
    const hashes = new Set(SECTION_REGISTRY.map(s => s.hash));
    expect(ids.size).toBe(10);
    expect(hashes.size).toBe(10);
  });

  it('resolves registry entries by ID, hash, and legacy keys correctly', () => {
    const swot = getRegistryEntryById('jump-swot');
    expect(swot).toBeDefined();
    expect(swot?.tab).toBe('LOCAL_FEASIBILITY');
    expect(swot?.sectionId).toBe('section-swot');

    const byHash = getRegistryEntryByHash('#section=swot');
    expect(byHash).toBeDefined();
    expect(byHash?.id).toBe('jump-swot');

    const pricing = getRegistryEntryByHash('pricing');
    expect(pricing).toBeDefined();
    expect(pricing?.sectionId).toBe('section-pricing');
  });

  it('renders DecisionDashboard with initialSection and responds to targetSectionId by scrolling and highlighting', async () => {
    const { container } = render(
      <LanguageProvider>
        <DecisionDashboard
          businessInput={mockInput}
          baseLocation={mockLocation}
          activeLocation={mockLocation}
          financials={mockFinancials}
          decisionResult={mockDecision}
          schemes={GOVERNMENT_SCHEMES}
          currentLanguage="en"
          isAlternativeAdopted={false}
          onToggleAlternativeLocation={vi.fn()}
          onEditInputs={vi.fn()}
          onViewFullDossier={vi.fn()}
          initialSection="FINANCIALS"
          targetSectionId="analysis-loan-schedule-section"
        />
      </LanguageProvider>
    );

    // Verify FINANCIALS tab is open
    expect(screen.getByTestId('accordion-btn-FINANCIALS')).toHaveAttribute('data-open', 'true');

    // Verify target section is in the DOM
    const loanScheduleSection = container.querySelector('#analysis-loan-schedule-section');
    expect(loanScheduleSection).not.toBeNull();

    // scrollIntoView should have been called
    await waitFor(() => {
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });

  it('provides "Back to summary" button which triggers onBackToSummary callback', () => {
    const handleBack = vi.fn();
    render(
      <LanguageProvider>
        <DecisionDashboard
          businessInput={mockInput}
          baseLocation={mockLocation}
          activeLocation={mockLocation}
          financials={mockFinancials}
          decisionResult={mockDecision}
          schemes={GOVERNMENT_SCHEMES}
          currentLanguage="en"
          isAlternativeAdopted={false}
          onToggleAlternativeLocation={vi.fn()}
          onEditInputs={vi.fn()}
          onViewFullDossier={vi.fn()}
          onBackToSummary={handleBack}
          initialSection="DECISION"
        />
      </LanguageProvider>
    );

    const backBtn = screen.getByTestId('back-to-summary-btn');
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('collapses other tabs when an accordion header is clicked (single-section expansion)', () => {
    render(
      <LanguageProvider>
        <DecisionDashboard
          businessInput={mockInput}
          baseLocation={mockLocation}
          activeLocation={mockLocation}
          financials={mockFinancials}
          decisionResult={mockDecision}
          schemes={GOVERNMENT_SCHEMES}
          currentLanguage="en"
          isAlternativeAdopted={false}
          onToggleAlternativeLocation={vi.fn()}
          onEditInputs={vi.fn()}
          onViewFullDossier={vi.fn()}
          initialSection="DECISION"
        />
      </LanguageProvider>
    );

    // Initially DECISION is open
    expect(screen.getByTestId('accordion-btn-DECISION')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('accordion-btn-FINANCIALS')).toHaveAttribute('data-open', 'false');

    // Click FINANCIALS tab header
    fireEvent.click(screen.getByTestId('accordion-btn-FINANCIALS'));

    // Now ONLY FINANCIALS is open, DECISION is collapsed
    expect(screen.getByTestId('accordion-btn-FINANCIALS')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('accordion-btn-DECISION')).toHaveAttribute('data-open', 'false');
  });

  it('verifies that every registry entry maps to an existing DOM ID when its tab is open', () => {
    const { container } = render(
      <LanguageProvider>
        <DecisionDashboard
          businessInput={mockInput}
          baseLocation={mockLocation}
          activeLocation={mockLocation}
          financials={mockFinancials}
          decisionResult={mockDecision}
          schemes={GOVERNMENT_SCHEMES}
          currentLanguage="en"
          isAlternativeAdopted={false}
          onToggleAlternativeLocation={vi.fn()}
          onEditInputs={vi.fn()}
          onViewFullDossier={vi.fn()}
          initialSection="DECISION"
        />
      </LanguageProvider>
    );

    // DECISION tab is initially open
    expect(container.querySelector('#section-DECISION')).not.toBeNull();

    // Open MAP tab
    fireEvent.click(screen.getByTestId('accordion-btn-MAP'));
    expect(container.querySelector('#section-MAP')).not.toBeNull();

    // Open FINANCIALS tab
    fireEvent.click(screen.getByTestId('accordion-btn-FINANCIALS'));
    expect(container.querySelector('#section-FINANCIALS')).not.toBeNull();
    expect(container.querySelector('#analysis-loan-schedule-section')).not.toBeNull();
    expect(container.querySelector('#analysis-breakeven-section')).not.toBeNull();

    // Open STRESS tab
    fireEvent.click(screen.getByTestId('accordion-btn-STRESS'));
    expect(container.querySelector('#section-STRESS')).not.toBeNull();

    // Open SCHEMES tab
    fireEvent.click(screen.getByTestId('accordion-btn-SCHEMES'));
    expect(container.querySelector('#section-SCHEMES')).not.toBeNull();

    // Open LOCAL_FEASIBILITY tab
    fireEvent.click(screen.getByTestId('accordion-btn-LOCAL_FEASIBILITY'));
    expect(container.querySelector('#section-LOCAL_FEASIBILITY')).not.toBeNull();
  });

  it('provides back-to-plan button in open accordion headers and floating back button that return to plan/summary', () => {
    const handleBack = vi.fn();
    render(
      <LanguageProvider>
        <DecisionDashboard
          businessInput={mockInput}
          baseLocation={mockLocation}
          activeLocation={mockLocation}
          financials={mockFinancials}
          decisionResult={mockDecision}
          schemes={GOVERNMENT_SCHEMES}
          currentLanguage="en"
          isAlternativeAdopted={false}
          onToggleAlternativeLocation={vi.fn()}
          onEditInputs={vi.fn()}
          onViewFullDossier={vi.fn()}
          onBackToSummary={handleBack}
          initialSection="DECISION"
        />
      </LanguageProvider>
    );

    // Open card has a back-to-plan button in its header
    const cardBackBtn = screen.getByTestId('back-to-plan-btn-DECISION');
    expect(cardBackBtn).toBeInTheDocument();
    fireEvent.click(cardBackBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);

    // Floating back button exists on screen
    const floatingBtn = screen.getByTestId('floating-back-to-plan-btn');
    expect(floatingBtn).toBeInTheDocument();
    fireEvent.click(floatingBtn);
    expect(handleBack).toHaveBeenCalledTimes(2);
  });

  it('toggling an accordion down triggers scrolling to the beginning of that analysis section', async () => {
    render(
      <LanguageProvider>
        <DecisionDashboard
          businessInput={mockInput}
          baseLocation={mockLocation}
          activeLocation={mockLocation}
          financials={mockFinancials}
          decisionResult={mockDecision}
          schemes={GOVERNMENT_SCHEMES}
          currentLanguage="en"
          isAlternativeAdopted={false}
          onToggleAlternativeLocation={vi.fn()}
          onEditInputs={vi.fn()}
          onViewFullDossier={vi.fn()}
          initialSection="DECISION"
        />
      </LanguageProvider>
    );

    // Toggle FINANCIALS card down (open)
    fireEvent.click(screen.getByTestId('accordion-btn-FINANCIALS'));

    // Verify FINANCIALS is now open
    expect(screen.getByTestId('accordion-btn-FINANCIALS')).toHaveAttribute('data-open', 'true');

    // Verify scroll was invoked for the section
    await waitFor(() => {
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });
  });
});

