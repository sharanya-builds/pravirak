import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DecisionDashboard } from './DecisionDashboard';
import { LanguageProvider } from '../../context/LanguageContext';
import { BusinessInput, LocationData, FinancialAnalysis, BusinessDecisionResult, GovernmentScheme } from '../../types';

const mockInput: BusinessInput = {
  businessIdea: 'Flour Mill and Packaging',
  category: 'Agro Processing',
  location: {
    address: 'Pembarthi, Jangaon, Telangana',
    city: 'Jangaon',
    state: 'Telangana',
    village: 'Pembarthi',
    block: 'Jangaon Mandal',
    district: 'Jangaon',
    latitude: 17.84,
    longitude: 79.25,
    source: 'USER_INPUT'
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
  workingCapitalBufferAmount: 150000,
  ownCapital: 100000,
  promoterContributionPct: 10,
  loanRequired: 900000,
  interestRatePct: 8.0,
  tenureYears: 5,
  monthlyEMI: 17500,
  projectedMonthlyRevenue: 150000,
  projectedMonthlyOpex: 85000,
  monthlyGrossSurplus: 65000,
  monthlyNetSurplus: 47500,
  dscr: 2.7,
  safetyStatus: 'SAFE',
  breakEvenMonths: 7
};

const mockDecision: BusinessDecisionResult = {
  decision: 'START',
  headline: 'Strong local demand with low competitive density.',
  summaryExplanation: 'Unit economics and market capture support sustainable debt servicing.',
  pillars: {
    localDemand: { grade: 'Good', commentary: 'Strong demand' },
    competition: { grade: 'Good', commentary: 'Low competition' },
    locationFit: { grade: 'Good', commentary: 'High suitability' },
    financialFeasibility: { grade: 'Good', commentary: 'Profitable' }
  },
  locationFitAnalysis: {
    overallFitScore: 82,
    fitCategory: 'High Fit',
    factors: [],
    disclaimer: 'Mock disclaimer'
  },
  evidenceList: [],
  riskFactors: [
    { title: 'Seasonal power fluctuations', severity: 'Medium', mitigation: 'Backup generator' }
  ],
  actionPlan: [
    { stepNumber: 1, title: 'Procure site', description: 'Village lease', timeline: 'Week 1' }
  ]
};

const mockScheme: GovernmentScheme = {
  id: 'pmegp',
  name: 'Prime Minister Employment Generation Programme (PMEGP)',
  code: 'PMEGP',
  ministry: 'MSME',
  maxSubsidyText: '35%',
  maxLoanText: '₹50 Lakhs',
  interestRateText: '8-11%',
  tenureText: '7 Years',
  moratoriumText: '6 Months',
  collateralRequirement: 'Nil up to ₹10L',
  suitableProfile: 'Rural manufacturing',
  eligibilityCriteria: ['18+ age'],
  matchScore: 92,
  matchReasons: ['High capital match'],
  applicationPortalUrl: 'https://kviconline.gov.in',
  nodalAgency: 'KVIC'
};

describe('DecisionDashboard Component', () => {
  it('renders bottom generate plan button at the end of the dashboard and triggers onViewFullDossier', () => {
    const handleViewFullDossier = vi.fn();
    const handleEditInputs = vi.fn();

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
          onToggleAlternativeLocation={() => {}}
          onEditInputs={handleEditInputs}
          onViewFullDossier={handleViewFullDossier}
        />
      </LanguageProvider>
    );

    // Verify bottom action container exists at the end
    const bottomContainer = screen.getByTestId('bottom-generate-plan-container');
    expect(bottomContainer).toBeInTheDocument();

    // Verify bottom generate plan button exists
    const bottomBtn = screen.getByTestId('generate-plan-bottom-btn');
    expect(bottomBtn).toBeInTheDocument();

    // Click bottom button and verify callback
    fireEvent.click(bottomBtn);
    expect(handleViewFullDossier).toHaveBeenCalledTimes(1);
  });
});
