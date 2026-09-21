import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DecisionDashboard } from './DecisionDashboard';
import { FinalBusinessPlan } from './FinalBusinessPlan';
import { LanguageProvider } from '../../context/LanguageContext';
import { 
  BusinessInput, 
  LocationData, 
  FinancialAnalysis, 
  BusinessDecisionResult, 
  GovernmentScheme 
} from '../../types';

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
  projectCost: 1000000,
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
  riskFactors: [
    { title: 'Supply chain risk', severity: 'Medium', mitigation: 'Keep multi-supplier contract' }
  ],
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

describe('Deduplication & Single-Home Content Verification', () => {
  it('verifies DecisionDashboard Tab 1 does not duplicate risk factors block (lives under Threats)', () => {
    render(
      <LanguageProvider>
        <DecisionDashboard
          businessInput={mockInput}
          baseLocation={mockLocation}
          activeLocation={mockLocation}
          financials={mockFinancials}
          decisionResult={mockDecision}
          schemes={[mockScheme]}
          currentLanguage="en"
          isAlternativeAdopted={false}
          onToggleAlternativeLocation={vi.fn()}
          onEditInputs={vi.fn()}
          onViewFullDossier={vi.fn()}
        />
      </LanguageProvider>
    );

    // Tab 1 Decision view does NOT have the old duplicate Identified Business Risk Factors block
    expect(screen.queryByText(/Identified Business Risk Factors/i)).not.toBeInTheDocument();
  });

  it('verifies DecisionDashboard does not have "6. Ask Pravirak AI Advisor" tab (floating chatbot only)', () => {
    render(
      <LanguageProvider>
        <DecisionDashboard
          businessInput={mockInput}
          baseLocation={mockLocation}
          activeLocation={mockLocation}
          financials={mockFinancials}
          decisionResult={mockDecision}
          schemes={[mockScheme]}
          currentLanguage="en"
          isAlternativeAdopted={false}
          onToggleAlternativeLocation={vi.fn()}
          onEditInputs={vi.fn()}
          onViewFullDossier={vi.fn()}
        />
      </LanguageProvider>
    );

    // No Ask Pravirak tab
    expect(screen.queryByText(/Ask Pravirak AI Advisor/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('jump-to-ADVISOR')).not.toBeInTheDocument();
  });

  it('verifies FinalBusinessPlan renders the Jump to Section list on screen instead of on-screen accordions', () => {
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

    // Jump to section list is rendered on screen
    const jumpList = screen.getByTestId('jump-to-sections-list');
    expect(jumpList).toBeInTheDocument();
    expect(jumpList).toHaveClass('no-print');

    // The print dossier document is hidden on screen
    const printDoc = screen.getByTestId('print-dossier-document');
    expect(printDoc).toHaveClass('hidden');
    expect(printDoc).toHaveClass('print:block');

    // Clicking a jump button invokes onNavigateToSection with the correct section ID
    const jumpMarket = screen.getByTestId('jump-market');
    fireEvent.click(jumpMarket);
    expect(handleNavigate).toHaveBeenCalledWith('jump-market');

    const jumpFinancials = screen.getByTestId('jump-financials');
    fireEvent.click(jumpFinancials);
    expect(handleNavigate).toHaveBeenCalledWith('jump-financials');
  });

  it('verifies headline loan in Decision Summary card is derived from psCalculator with quarterly payment matching schedule', () => {
    render(
      <LanguageProvider>
        <FinalBusinessPlan
          input={mockInput}
          location={mockLocation}
          financials={mockFinancials}
          decisionResult={mockDecision}
          recommendedScheme={mockScheme}
          onReset={vi.fn()}
        />
      </LanguageProvider>
    );

    const summaryCard = screen.getByTestId('decision-summary-card');
    expect(summaryCard).toBeInTheDocument();

    // Sized via psCalculator: Term Loan Scheme, ₹9,00,000 at 8%
    expect(summaryCard).toHaveTextContent('9,00,000');
    expect(summaryCard).toHaveTextContent('Term Loan Scheme');
    expect(summaryCard).toHaveTextContent('8%');
    // First post-moratorium payment is ₹52,615
    expect(summaryCard).toHaveTextContent('52,615');
  });
});
