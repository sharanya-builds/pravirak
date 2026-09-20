export type Language = 'en' | 'hi' | 'te';

export type DecisionState = 
  | 'START HERE' 
  | 'MOVE TO A BETTER LOCATION' 
  | 'RECONSIDER' 
  | 'REDUCE SCALE' 
  | 'VALIDATE FIRST' 
  | 'DON\'T BORROW YET'
  | 'START'
  | 'MOVE';

export type PillarGrade = 'Good' | 'Moderate' | 'Low' | 'High' | 'Suitable' | 'Stretched' | 'Unviable' | 'Poor';

export type SafetyStatus = 'SAFE' | 'WATCH' | 'RISKY';

export type EvidenceType = 'Observed' | 'Sourced' | 'Estimated' | 'AI interpretation';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type Provenance = 'OBSERVED' | 'SOURCED' | 'ESTIMATED' | 'DEMO' | 'AI INTERPRETATION';

export interface ScoreFactor {
  name: string;
  score: number; // 0-100
  label: string;
  provenance: Provenance;
  detail: string;
}

export interface LocationFitAnalysis {
  overallFitScore: number; // 0-100
  fitCategory: 'High Fit' | 'Moderate Fit' | 'Marginal Fit' | 'Poor Fit';
  factors: ScoreFactor[];
  disclaimer: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  detail: string;
  source: string;
  type: EvidenceType;
  vintage?: string;
  confidence: ConfidenceLevel;
}

export interface CompetitorPOI {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  lat: number;
  lng: number;
  estimatedTurnoverMonthly?: number;
  strength: 'Strong' | 'Moderate' | 'Weak';
  provenance?: 'OBSERVED' | 'SOURCED' | 'ESTIMATED' | 'DEMO / ESTIMATED DATA';
}

export interface ComplementaryBusinessPOI {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  lat: number;
  lng: number;
  synergy: string;
  provenance: 'OBSERVED' | 'SOURCED' | 'DEMO / ESTIMATED DATA';
}

export interface DemandOpportunityMarker {
  id: string;
  title: string;
  type: 'Residential Cluster' | 'Transit Hub' | 'Educational Institution' | 'Commercial Office';
  lat: number;
  lng: number;
  detail: string;
  provenance: 'OBSERVED' | 'SOURCED' | 'DEMO / ESTIMATED DATA';
}

export interface SelectedLocation {
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  city: string;
  state: string;
  village?: string | null;
  block?: string | null;
  district?: string | null;
  postalCode?: string;
  source: 'GOOGLE_PLACES' | 'USER_INPUT' | 'DEMO_SAMPLE' | 'OPENSTREETMAP' | 'USER_INPUT_APPROX';
}

export interface LocationData {
  id: string;
  city: string;
  state: string;
  village?: string | null;
  block?: string | null;
  district?: string | null;
  areaName: string;
  pincode: string;
  lat: number;
  lng: number;
  score?: number; // Only generated post-analysis!
  locationFit?: LocationFitAnalysis;
  footfallMonthly: number;
  residentialColoniesNearby: number;
  competitorsNearbyCount: number;
  marketDistanceKm: number;
  competitors: CompetitorPOI[];
  complementaryBusinesses?: ComplementaryBusinessPOI[];
  demandMarkers?: DemandOpportunityMarker[];
  demandSignals: string[];
  customerColonies: string[];
  transitPoints: string[];
  commercialHubs: string[];
  alternativeLocation?: {
    areaName: string;
    score: number;
    lat: number;
    lng: number;
    distanceKm: number;
    advantageReason: string;
    footfallGainPct: number;
    rentDifferentialPct: number;
    competitorDensity: 'Lower' | 'Similar' | 'Higher';
  };
}

export interface BusinessInput {
  businessIdea: string;
  category: string;
  location: SelectedLocation;
  ownCapital: number;
  experience?: 'Beginner (<1 yr)' | 'Moderate (1-3 yrs)' | 'Experienced (3+ yrs)';
  existingSpace?: 'Owned premises' | 'Rented space' | 'Not yet secured';
  targetCustomers?: 'General Public / Walk-ins' | 'Students & Youth' | 'Offices & Corporate' | 'Wholesale / B2B';
  preferredScale?: 'Micro (Local)' | 'Small (Town/Zone)' | 'Medium (Regional)';
}

export interface FinancialAnalysis {
  projectCost: number;
  capexItems: { item: string; amount: number; description: string }[];
  workingCapitalBufferMonths: number;
  workingCapitalBufferAmount: number;
  ownCapital: number;
  promoterContributionPct: number;
  loanRequired: number;
  interestRatePct: number;
  tenureYears: number;
  monthlyEMI: number;
  projectedMonthlyRevenue: number;
  projectedMonthlyOpex: number;
  monthlyGrossSurplus: number;
  monthlyNetSurplus: number; // Surplus after EMI
  dscr: number; // Debt Service Coverage Ratio
  safetyStatus: SafetyStatus;
  breakEvenMonths: number;
}

export interface StressResult {
  salesDropPct: number;
  opexIncreasePct: number;
  rawMaterialIncreasePct: number;
  stressedRevenue: number;
  stressedOpex: number;
  stressedOperatingProfit: number;
  monthlyEMI: number;
  stressedNetSurplus: number;
  stressedDSCR: number;
  stressedSafety: SafetyStatus;
  warningNote: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  code: string;
  ministry: string;
  maxSubsidyText: string;
  maxSubsidyPct?: number;
  maxLoanText: string;
  interestRateText: string;
  tenureText: string;
  moratoriumText: string;
  collateralRequirement: string;
  suitableProfile: string;
  eligibilityCriteria: string[];
  matchScore: number;
  matchReasons: string[];
  applicationPortalUrl: string;
  nodalAgency: string;
}

export interface ComplianceItem {
  id: string;
  title: string;
  authority: string;
  status: 'Required' | 'May be required' | 'Check locally';
  estimatedTimeline: string;
  estimatedFee: string;
  officialPortalUrl: string;
  portalName: string;
  whyNeeded: string;
}

export interface BusinessDecisionResult {
  decision: DecisionState;
  headline: string;
  summaryExplanation: string;
  pillars: {
    localDemand: { grade: PillarGrade; commentary: string };
    competition: { grade: PillarGrade; commentary: string };
    locationFit: { grade: PillarGrade; commentary: string };
    financialFeasibility: { grade: PillarGrade; commentary: string };
  };
  locationFitAnalysis: LocationFitAnalysis;
  evidenceList: EvidenceItem[];
  riskFactors: { title: string; severity: 'High' | 'Medium' | 'Low'; mitigation: string }[];
  actionPlan: { stepNumber: number; title: string; description: string; timeline: string }[];
}

export interface ExistingBusinessInput {
  businessType: string;
  location: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  existingDebtMonthlyEMI: number;
  primaryGoal: 
    | 'Improve profit'
    | 'Increase sales'
    | 'Add products'
    | 'Expand distribution'
    | 'Open another outlet'
    | 'Enter another market';
  currentEmployees: number;
}

export interface ExistingBusinessDiagnosis {
  currentMonthlyProfit: number;
  profitMarginPct: number;
  financialHealth: 'Healthy' | 'Vulnerable' | 'Stressed';
  diagnostics: string[];
  profitOpportunities: { title: string; estimatedGainMonthly: number; effort: 'Quick Win' | 'Medium Term' }[];
  expansionRecommendation: {
    title: string;
    requiredCapital: number;
    recommendedFinancing: string;
    newMonthlySurplus: number;
    expansionSafety: SafetyStatus;
    actionChecklist: string[];
  };
}
