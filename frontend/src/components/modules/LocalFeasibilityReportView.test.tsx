import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocalFeasibilityReportView } from './LocalFeasibilityReportView';
import { LanguageProvider } from '../../context/LanguageContext';
import { LocalFeasibilityReport, LocationData } from '../../types';

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
  competitors: [
    {
      id: 'c1',
      name: 'Balaji Dairy & Sweets',
      distanceKm: 0.4,
      type: 'dairy',
      lat: 17.842,
      lng: 79.252,
      provenance: 'MEASURED'
    },
    {
      id: 'c2',
      name: 'Sri Krishna Milk Center',
      distanceKm: 0.9,
      type: 'dairy',
      lat: 17.845,
      lng: 79.255,
      provenance: 'MEASURED'
    }
  ],
  demandSignals: ['High local dairy demand'],
  customerColonies: ['Colony 1'],
  transitPoints: ['Main bus stop'],
  commercialHubs: ['Market square'],
  provenance: 'MEASURED',
  competitorsCountProvenance: 'MEASURED',
  footfallMonthlyProvenance: 'ESTIMATED',
  residentialColoniesNearbyProvenance: 'ESTIMATED',
  marketDistanceKmProvenance: 'ESTIMATED',
  scoreProvenance: 'ESTIMATED',
  metricsProvenance: {
    score: 'ESTIMATED',
    footfallMonthly: 'ESTIMATED',
    residentialColoniesNearby: 'ESTIMATED',
    competitorsNearbyCount: 'MEASURED',
    marketDistanceKm: 'ESTIMATED',
    alternativeLocation: 'ESTIMATED'
  }
};

const mockReport: LocalFeasibilityReport = {
  marketReach: {
    catchmentKm: 7,
    summary: 'Captures daily customer traffic within a 7 km radius of Pembarthi.',
    distributionChannels: ['Direct shop counter', 'Local weekly haat'],
    competitors5kmCount: 3,
    competitors10kmCount: 8,
    competitors5kmProvenance: 'MEASURED',
    competitors10kmProvenance: 'MEASURED',
    population5km: null,
    population10km: null,
    densityPer10kAt5km: null,
    densityPer10kAt10km: null
  },
  opportunities: [
    {
      niche: 'Morning fresh buffalo milk and paneer packs',
      why: 'Strong morning commute route without dedicated cold storage outlet.'
    },
    {
      niche: 'Festival advance bulk order bookings',
      why: 'Direct proprietor trust within the village community.'
    }
  ],
  swot: {
    strengths: ['Direct local milk procurement from village farmers', 'Low rental premises cost'],
    weaknesses: ['Limited chiller storage without working capital'],
    opportunities: ['Supplying weekly market stalls on Tuesdays'],
    threats: ['Summer milk yield drop', 'Wholesale feed price inflation']
  },
  threats: [
    {
      type: 'supply_chain',
      description: 'Cattle feed price inflation during dry months.',
      mitigation: 'Tie up advance fodder contracts with 2 local dairy cooperatives.'
    },
    {
      type: 'seasonal',
      description: 'Milk production fluctuation during summer peak.',
      mitigation: 'Build curd and paneer capacity to preserve surplus margins.'
    }
  ],
  pricing: {
    strategy: 'Cost-plus margin with daily local rate alignment',
    priceBandNote: 'Guidance, verify with local mandi/market rates (text guidance only).'
  },
  assumptions: [
    'Owner directly oversees chilling and counter sales.',
    'Tenancy remains stable for 12 months.'
  ],
  aiGenerated: true,
  provenance: 'AI_GENERATED'
};

describe('LocalFeasibilityReportView Component', () => {
  it('renders loading state when isLoading is true', () => {
    render(
      <LanguageProvider>
        <LocalFeasibilityReportView
          report={null}
          location={mockLocation}
          category="Dairy"
          isLoading={true}
        />
      </LanguageProvider>
    );

    expect(screen.getByText(/Compiling Local Feasibility Report/i)).toBeInTheDocument();
  });

  it('renders error state with retry button when error occurs', () => {
    const handleRetry = vi.fn();

    render(
      <LanguageProvider>
        <LocalFeasibilityReportView
          report={null}
          location={mockLocation}
          category="Dairy"
          error="Network timeout connecting to advisor"
          onRetry={handleRetry}
        />
      </LanguageProvider>
    );

    expect(screen.getByText(/Network timeout connecting to advisor/i)).toBeInTheDocument();
    const retryBtn = screen.getByText(/Retry Analysis/i);
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledOnce();
  });

  it('renders all six required subsections when report is provided', () => {
    render(
      <LanguageProvider>
        <LocalFeasibilityReportView
          report={mockReport}
          location={mockLocation}
          category="Dairy"
        />
      </LanguageProvider>
    );

    // 1. Market reach
    expect(screen.getByText(/Market Reach & Catchment/i)).toBeInTheDocument();
    expect(screen.getByText(/Captures daily customer traffic within a 7 km radius/i)).toBeInTheDocument();
    expect(screen.getByText(/Direct shop counter/i)).toBeInTheDocument();
    expect(screen.getByText(/Competitors within 5 km/i)).toBeInTheDocument();
    expect(screen.getByText(/Competitors within 10 km/i)).toBeInTheDocument();
    // Population density omitted notice
    expect(screen.getByText(/Competitor density per 10,000 omitted/i)).toBeInTheDocument();

    // 2. Opportunity analysis
    expect(screen.getByText(/Opportunity Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Morning fresh buffalo milk and paneer packs/i)).toBeInTheDocument();
    expect(screen.getByText(/Strong morning commute route/i)).toBeInTheDocument();

    // 3. SWOT analysis (2x2 grid)
    expect(screen.getByText(/SWOT Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Direct local milk procurement/i)).toBeInTheDocument();
    expect(screen.getByText(/Limited chiller storage/i)).toBeInTheDocument();
    expect(screen.getByText(/Supplying weekly market stalls/i)).toBeInTheDocument();
    expect(screen.getByText(/Summer milk yield drop/i)).toBeInTheDocument();

    // 4. Threats
    expect(screen.getByText(/Threats & Mitigations/i)).toBeInTheDocument();
    expect(screen.getByText(/Cattle feed price inflation during dry months/i)).toBeInTheDocument();
    expect(screen.getByText(/Tie up advance fodder contracts/i)).toBeInTheDocument();

    // 5. Competitor map (from Overpass)
    expect(screen.getByText(/Competitor Map \(OpenStreetMap\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Balaji Dairy & Sweets/i)).toBeInTheDocument();
    expect(screen.getByText(/Sri Krishna Milk Center/i)).toBeInTheDocument();

    // 6. Pricing guidance
    expect(screen.getByText(/Pricing Guidance/i)).toBeInTheDocument();
    expect(screen.getByText(/Cost-plus margin with daily local rate alignment/i)).toBeInTheDocument();
    expect(screen.getByText(/Guidance, verify with local mandi\/market rates/i)).toBeInTheDocument();
  });

  it('renders provenance badges (AI, Measured, Estimated) correctly', () => {
    render(
      <LanguageProvider>
        <LocalFeasibilityReportView
          report={mockReport}
          location={mockLocation}
          category="Dairy"
        />
      </LanguageProvider>
    );

    // AI Generated badge
    expect(screen.getByText('AI Generated')).toBeInTheDocument();
    // Measured badges
    const measuredBadges = screen.getAllByText('Measured');
    expect(measuredBadges.length).toBeGreaterThan(0);
  });
});
