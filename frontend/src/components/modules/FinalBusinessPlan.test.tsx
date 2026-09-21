import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FinalBusinessPlan } from './FinalBusinessPlan';
import { LanguageProvider } from '../../context/LanguageContext';
import { BusinessInput, LocationData, FinancialAnalysis, BusinessDecisionResult, GovernmentScheme } from '../../types';

const mockInput: BusinessInput = {
  businessIdea: 'Dairy Farm and Milk Chilling',
  category: 'Dairy',
  location: {
    address: 'Pembarthi, Jangaon, Telangana',
    city: 'Jangaon',
    state: 'Telangana',
    village: 'Pembarthi',
    block: 'Jangaon Mandal',
    district: 'Jangaon',
    latitude: 17.84,
    longitude: 79.25,
    source: 'OPENSTREETMAP'
  },
  ownCapital: 100000
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
  footfallMonthly: 15000,
  residentialColoniesNearby: 6,
  competitorsNearbyCount: 2,
  marketDistanceKm: 1.0,
  competitors: [],
  demandSignals: ['High local dairy demand'],
  customerColonies: ['Colony 1'],
  transitPoints: ['Main bus stop'],
  commercialHubs: ['Market square'],
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
  }
};

const mockFinancials: FinancialAnalysis = {
  projectCost: 1000000, // 10,00,000 -> 10% is 1,00,000 (M = 1,00,000 matches!)
  capexItems: [],
  workingCapitalBufferMonths: 3,
  workingCapitalBufferAmount: 50000,
  ownCapital: 100000,
  promoterContributionPct: 10,
  loanRequired: 900000,
  interestRatePct: 8,
  tenureYears: 7,
  monthlyEMI: 15000,
  projectedMonthlyRevenue: 90000,
  projectedMonthlyOpex: 40000,
  monthlyGrossSurplus: 50000,
  monthlyNetSurplus: 35000,
  dscr: 1.8,
  safetyStatus: 'SAFE',
  breakEvenMonths: 8
};

const mockDecision: BusinessDecisionResult = {
  decision: 'START HERE',
  headline: 'Feasible and bankable',
  summaryExplanation: 'Strong demand and viability',
  pillars: {
    localDemand: { grade: 'Good', commentary: 'Strong' },
    competition: { grade: 'Good', commentary: 'Low' },
    locationFit: { grade: 'Good', commentary: 'High' },
    financialFeasibility: { grade: 'Good', commentary: 'Sufficient' }
  },
  locationFitAnalysis: {
    overallFitScore: 85,
    fitCategory: 'High Fit',
    factors: [],
    disclaimer: 'Mock disclaimer'
  },
  evidenceList: [],
  riskFactors: [],
  actionPlan: [
    { stepNumber: 1, title: 'Secure Premises', description: 'Lease or purchase', timeline: 'Week 1-2' }
  ]
};

const mockScheme: GovernmentScheme = {
  id: 'term-loan',
  name: 'Term Loan Scheme',
  code: 'TL-01',
  ministry: 'MSME',
  nodalAgency: 'NABARD',
  matchScore: 92,
  matchReasons: ['Profile matches'],
  maxSubsidyText: 'Up to 25%',
  maxLoanText: 'Up to ₹45.00 Lakh',
  interestRateText: '8% p.a.',
  tenureText: '7 years',
  moratoriumText: '6 months',
  collateralRequirement: 'CGTMSE covered',
  suitableProfile: 'Rural entrepreneurs',
  eligibilityCriteria: ['Rural entrepreneurs'],
  applicationPortalUrl: 'https://example.com'
};

const renderPlan = (overrides?: {
  input?: Partial<BusinessInput>;
  location?: Partial<LocationData>;
  financials?: Partial<FinancialAnalysis>;
}) => {
  const input = { ...mockInput, ...(overrides?.input || {}) };
  const location = { ...mockLocation, ...(overrides?.location || {}) };
  const financials = { ...mockFinancials, ...(overrides?.financials || {}) };

  return render(
    <LanguageProvider>
      <FinalBusinessPlan
        input={input}
        location={location}
        financials={financials}
        decisionResult={mockDecision}
        recommendedScheme={mockScheme}
        onReset={vi.fn()}
      />
    </LanguageProvider>
  );
};

describe('FinalBusinessPlan - Government Scheme Loan Structure & Location', () => {
  it('displays administrative location hierarchy with complete data', () => {
    renderPlan();

    expect(screen.getByTestId('plan-village')).toHaveTextContent('Pembarthi');
    expect(screen.getByTestId('plan-block')).toHaveTextContent('Jangaon Mandal');
    expect(screen.getByTestId('plan-district')).toHaveTextContent('Jangaon');
    expect(screen.getByTestId('plan-state')).toHaveTextContent('Telangana');
  });

  it('displays "Not available for this address" when location hierarchy fields are missing', () => {
    renderPlan({
      location: {
        village: null,
        block: null,
        district: null,
        state: ''
      },
      input: {
        location: {
          ...mockInput.location,
          village: null,
          block: null,
          district: null,
          state: ''
        }
      }
    });

    expect(screen.getByTestId('plan-village')).toHaveTextContent('Not available for this address');
    expect(screen.getByTestId('plan-block')).toHaveTextContent('Not available for this address');
    expect(screen.getByTestId('plan-district')).toHaveTextContent('Not available for this address');
  });

  it('renders Case 1 (M >= 0.10 * B: Fully Funded) with supportable project and How Calculated card', () => {
    // M = 1,50,000, B = 10,00,000. 10% required is 1,00,000.
    renderPlan({
      input: { ownCapital: 150000 },
      financials: { projectCost: 1000000, ownCapital: 150000 }
    });

    expect(screen.getByTestId('plan-scheme-loan-section')).toBeInTheDocument();
    expect(screen.getByTestId('plan-fully-funded-banner')).toBeInTheDocument();
    expect(screen.getByTestId('max-supportable-project')).toHaveTextContent('15,00,000');

    // How calculated card
    expect(screen.getByTestId('how-calculated-card')).toBeInTheDocument();
    expect(screen.getByTestId('how-calc-m')).toHaveTextContent('1,50,000');
    expect(screen.getByTestId('how-calc-b')).toHaveTextContent('10,00,000');
    expect(screen.getByTestId('how-calc-required-margin')).toHaveTextContent('1,00,000');
    expect(screen.getByTestId('how-calc-max-supportable')).toHaveTextContent('15,00,000');
    expect(screen.getByTestId('how-calc-applied-case')).toHaveTextContent('Fully Funded');

    // Embedded SchemeLoanBreakdown
    expect(screen.getByTestId('scheme-loan-breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('val-project-cost')).toHaveTextContent('10,00,000');
    expect(screen.getByTestId('val-max-loan')).toHaveTextContent('9,00,000');
  });

  it('renders Case 2 (M < 0.10 * B: Capital Shortfall) with shortfall alert and 3 options', () => {
    // M = 50,000, B = 10,00,000. 10% required is 1,00,000. Shortfall = 50,000.
    // Max supportable project is 5,00,000.
    renderPlan({
      input: { ownCapital: 50000 },
      financials: { projectCost: 1000000, ownCapital: 50000 }
    });

    expect(screen.getByTestId('plan-scheme-loan-section')).toBeInTheDocument();
    expect(screen.getByTestId('plan-shortfall-banner')).toBeInTheDocument();
    expect(screen.getByTestId('plan-shortfall-amount')).toHaveTextContent('50,000');
    expect(screen.getByTestId('max-supportable-shortfall-project')).toHaveTextContent('5,00,000');

    // 3 Options to bridge shortfall
    expect(screen.getByTestId('shortfall-options-card')).toBeInTheDocument();
    expect(screen.getByText(/1\. Infuse Additional Capital/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Scale Down Initial Capex/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Execute in Phased Rollout/i)).toBeInTheDocument();

    // Sized for supportable project cost 5,00,000
    expect(screen.getByTestId('scheme-loan-breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('val-project-cost')).toHaveTextContent('5,00,000');
    expect(screen.getByTestId('val-max-loan')).toHaveTextContent('4,50,000');
  });

  it('hides the scheme loan section gracefully if capital is missing or zero', () => {
    renderPlan({
      input: { ownCapital: 0 }
    });

    expect(screen.queryByTestId('plan-scheme-loan-section')).not.toBeInTheDocument();
  });
});

describe('FinalBusinessPlan - Presentation Redesign (Decision Summary & Accordions)', () => {
  it('renders Decision Summary card with key numbers and derived reasons/risks without extra calls', () => {
    renderPlan();

    const summaryCard = screen.getByTestId('decision-summary-card');
    expect(summaryCard).toBeInTheDocument();

    // Decision badge and headline
    expect(summaryCard).toHaveTextContent('START HERE');
    expect(summaryCard).toHaveTextContent('Strong demand and viability');

    // 3 Key Figures
    expect(summaryCard).toHaveTextContent('10,00,000'); // Project cost
    expect(summaryCard).toHaveTextContent('9,00,000');  // Loan amount
    expect(summaryCard).toHaveTextContent('Term Loan Scheme'); // Scheme name
    expect(summaryCard).toHaveTextContent('8%'); // Interest rate
    expect(summaryCard).toHaveTextContent('52,615'); // Quarterly payment after moratorium from psCalculator schedule

    // Top reasons and risks
    expect(summaryCard).toHaveTextContent(/Top 3 Positive Indicators/i);
    expect(summaryCard).toHaveTextContent(/Top 3 Critical Risks/i);

    // "Do this first" next step
    expect(summaryCard).toHaveTextContent(/Do This First/i);
    expect(summaryCard).toHaveTextContent('Secure Premises');
  });

  it('renders all section accordions collapsed by default and toggles correctly', () => {
    renderPlan();

    // Accordions exist
    const marketAccordion = screen.getByTestId('accordion-market-competitors');
    const opportunitiesAccordion = screen.getByTestId('accordion-opportunities');
    const swotAccordion = screen.getByTestId('accordion-swot');
    const threatsAccordion = screen.getByTestId('accordion-threats');
    const pricingAccordion = screen.getByTestId('accordion-pricing-guidance');
    const breakevenAccordion = screen.getByTestId('accordion-breakeven');
    const stressAccordion = screen.getByTestId('accordion-stress-tests');
    const howCalcAccordion = screen.getByTestId('accordion-how-calculated');
    const actionPlanAccordion = screen.getByTestId('accordion-action-plan');

    expect(marketAccordion).toBeInTheDocument();
    expect(opportunitiesAccordion).toBeInTheDocument();
    expect(swotAccordion).toBeInTheDocument();
    expect(threatsAccordion).toBeInTheDocument();
    expect(pricingAccordion).toBeInTheDocument();
    expect(breakevenAccordion).toBeInTheDocument();
    expect(stressAccordion).toBeInTheDocument();
    expect(howCalcAccordion).toBeInTheDocument();
    expect(actionPlanAccordion).toBeInTheDocument();

    // Collapsed by default (button aria-expanded is false)
    const marketBtn = marketAccordion.querySelector('button');
    expect(marketBtn).toHaveAttribute('aria-expanded', 'false');

    // Click to expand
    fireEvent.click(marketBtn!);
    expect(marketBtn).toHaveAttribute('aria-expanded', 'true');

    // Click again to collapse
    fireEvent.click(marketBtn!);
    expect(marketBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders Jump to Section list on screen and navigates to the matching section', () => {
    const handleNavigate = vi.fn();
    render(
      <LanguageProvider>
        <FinalBusinessPlan
          input={mockInput}
          location={mockLocation}
          financials={mockFinancials}
          decisionResult={mockDecision}
          recommendedScheme={mockScheme}
          onReset={vi.fn()}
          onNavigateToSection={handleNavigate}
        />
      </LanguageProvider>
    );

    const jumpList = screen.getByTestId('jump-to-sections-list');
    expect(jumpList).toBeInTheDocument();

    const jumpMarket = screen.getByTestId('jump-market');
    fireEvent.click(jumpMarket);
    expect(handleNavigate).toHaveBeenCalledWith('MARKET');
  });

  it('supports Short plan vs Full plan download mode toggling', () => {
    renderPlan();

    const shortBtn = screen.getByTestId('download-mode-short');
    const fullBtn = screen.getByTestId('download-mode-full');

    expect(shortBtn).toBeInTheDocument();
    expect(fullBtn).toBeInTheDocument();

    // Short plan is active by default
    expect(shortBtn).toHaveClass('font-bold');

    // Toggle to Full plan
    fireEvent.click(fullBtn);
    expect(fullBtn).toHaveClass('font-bold');
  });

  it('asserts no section was removed and all critical previous IDs/testids exist in the DOM', () => {
    renderPlan();

    // Critical section IDs and testids from the original document
    expect(screen.getByTestId('plan-village')).toBeInTheDocument();
    expect(screen.getByTestId('plan-block')).toBeInTheDocument();
    expect(screen.getByTestId('plan-district')).toBeInTheDocument();
    expect(screen.getByTestId('plan-state')).toBeInTheDocument();
    expect(screen.getByTestId('plan-scheme-loan-section')).toBeInTheDocument();
    expect(screen.getByTestId('plan-fully-funded-banner')).toBeInTheDocument();
    expect(screen.getByTestId('max-supportable-project')).toBeInTheDocument();
    expect(screen.getByTestId('how-calculated-card')).toBeInTheDocument();
    expect(screen.getByTestId('how-calc-m')).toBeInTheDocument();
    expect(screen.getByTestId('how-calc-b')).toBeInTheDocument();
    expect(screen.getByTestId('how-calc-required-margin')).toBeInTheDocument();
    expect(screen.getByTestId('how-calc-max-supportable')).toBeInTheDocument();
    expect(screen.getByTestId('how-calc-applied-case')).toBeInTheDocument();
    expect(screen.getByTestId('scheme-loan-breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('val-project-cost')).toBeInTheDocument();
    expect(screen.getByTestId('val-max-loan')).toBeInTheDocument();
    expect(screen.getByTestId('plan-local-feasibility-section')).toBeInTheDocument();
  });
});

