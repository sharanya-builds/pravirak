import { Language } from '../types';

export interface TranslationStrings {
  // App-level
  appName: string;
  tagline: string;
  subtitle: string;
  builtFor: string;
  ideasToLivelihoods: string;
  
  // Navigation
  navHome: string;
  navMyBusinesses: string;
  navNewAnalysis: string;
  navReports: string;
  navExploreHub: string;
  navNotifications: string;
  navHelpSupport: string;
  navSettings: string;
  navLogOut: string;
  navExitGuest: string;
  navViewProfile: string;
  navGoToDashboard: string;
  navLogIn: string;

  // Language
  langEnglish: string;
  langHindi: string;
  langTelugu: string;

  // Landing Page
  startNewBusiness: string;
  growExistingBusiness: string;
  howPravirakHelps: string;
  nationalPlatformBadge: string;
  heroDescription: string;
  enterAnyAddress: string;
  deterministicArithmetic: string;
  googleMapsIntegration: string;
  methodologyFramework: string;
  fiveStageDescription: string;
  step1Title: string;
  step1Description: string;
  step2Title: string;
  step2Description: string;
  step3Title: string;
  step3Description: string;
  step4Title: string;
  step4Description: string;
  step5Title: string;
  step5Description: string;
  trySampleBusiness: string;
  sampleCaseStudiesOnly: string;
  sampleDescription: string;
  evaluateSample: string;
  clickAnyCard: string;
  sampleBadge: string;
  capitalLabel: string;

  // Home Dashboard
  welcomeBack: string;
  welcomeToPravirak: string;
  startNewAnalysisDesc: string;
  myBusinessesTitle: string;
  myBusinessesDesc: string;
  noBusinessesYet: string;
  noBusinessesDesc: string;
  viewAll: string;
  runFirstAnalysis: string;
  quickActions: string;
  newAnalysis: string;
  exploreTools: string;

  // Login
  loginTitle: string;
  loginSubtitle: string;
  loginTab: string;
  registerTab: string;
  fullName: string;
  phoneOrEmail: string;
  password: string;
  loginButton: string;
  registerButton: string;
  orContinueAs: string;
  continueAsGuest: string;
  guestDisclaimer: string;
  browsingAsGuest: string;
  signedInAs: string;
  guestSession: string;

  // New Business Flow
  newVentureInitiation: string;
  tellPravirakAbout: string;
  threeQuickSteps: string;
  stepBusinessIdea: string;
  stepLocation: string;
  stepCapital: string;
  whatDoYouWantToStart: string;
  describeInOwnWords: string;
  describeHint: string;
  pickCommonIdea: string;
  whereStartBusiness: string;
  enterAreaLandmark: string;
  howMuchInvest: string;
  ownSavingsDesc: string;
  optionalDetails: string;
  refinesSubsidyMatching: string;
  priorExperience: string;
  shopAvailability: string;
  targetCustomers: string;
  preferredScale: string;
  beginnerExperience: string;
  moderateExperience: string;
  experiencedLevel: string;
  rentedSpace: string;
  ownedPremises: string;
  notYetSecured: string;
  generalPublic: string;
  studentsYouth: string;
  officesCorporate: string;
  wholesaleB2B: string;
  microScale: string;
  smallScale: string;
  mediumScale: string;
  cancelButton: string;
  backButton: string;
  continueButton: string;
  analyseMyBusiness: string;
  locationConfirmed: string;
  readyForNextStep: string;
  demoCaseStudies: string;
  trySampleInstead: string;
  sampleEnterprisesDesc: string;
  loadSampleParams: string;

  // Google Places Search
  searchPlaceholder: string;
  quickTestLocalities: string;
  geocodedBadge: string;

  // Google Map Preview
  locationConfirmation: string;
  mapPreview: string;
  googleMapsActive: string;
  osmLiveGeocoding: string;
  dragPinHint: string;
  confirmedAddress: string;
  cityLabel: string;
  stateLabel: string;
  coordinatesLabel: string;
  changeLocation: string;
  useThisLocation: string;
  mapNotice: string;
  mapNoticeGoogleFail: string;
  mapNoticeOSM: string;

  // Decision Dashboard
  businessTarget: string;
  locationLabel: string;
  ownCapital: string;
  editInputs: string;
  viewFullDossier: string;
  sectionDecision: string;
  sectionMap: string;
  sectionFinancials: string;
  sectionStress: string;
  sectionSchemes: string;
  sectionAdvisor: string;
  verifiableAuditTrail: string;
  whyThisDecision: string;
  multiSourceSynthesis: string;
  vulnerabilityAssessment: string;
  identifiedRiskFactors: string;
  whatShouldDoNext: string;
  stepComplete: string;
  finalStepReady: string;
  readyForDossier: string;
  askSpecificQuestions: string;
  askAiAdvisor: string;
  generateBusinessPlan: string;
  decisionLabel: string;
  mapLabel: string;
  financialsLabel: string;
  planLabel: string;

  // Decision Card
  yourDecision: string;
  localDemand: string;
  competition: string;
  locationFit: string;
  financialFeasibility: string;
  financialSafety: string;
  safe: string;
  watch: string;
  risky: string;
  confidence: string;
  evidence: string;

  // Financial Feasibility
  projectCost: string;
  potentialFinancing: string;
  monthlyEMI: string;
  breakEvenTimeline: string;
  monthlyRevenue: string;
  monthlyExpenses: string;
  monthlySurplus: string;
  capexBreakdown: string;
  workingCapitalBuffer: string;
  debtServiceCoverage: string;
  promoterContribution: string;
  loanRequired: string;
  interestRate: string;

  // Stress Test
  stressTestTitle: string;
  stressTestSubtitle: string;
  salesDecline: string;
  costIncrease: string;
  combinedShock: string;
  survivalMonths: string;

  // Schemes
  financingOptions: string;
  subsidizedCapital: string;
  matchedSchemesDesc: string;
  beforeYouStart: string;
  statutoryChecklist: string;
  requiredLicenses: string;
  searchingSchemes: string;
  showingStaticDataset: string;
  refreshButton: string;
  officialPortal: string;
  recommendedMatch: string;
  whyEligible: string;
  keyFormalCriteria: string;
  officialVerificationNote: string;
  verificationDisclaimer: string;
  nodalAgency: string;
  benefitLabel: string;
  eligibilityLabel: string;

  // Ask Pravirak
  askPravirakTitle: string;
  askPravirakSubtitle: string;
  typeYourQuestion: string;
  askButton: string;
  suggestedQuestions: string;

  // Reports
  reportsTitle: string;
  reportsDesc: string;
  noReportsYet: string;
  noReportsDesc: string;

  // My Businesses
  savedBusinesses: string;
  inProgress: string;
  analysisComplete: string;
  noSavedBusinesses: string;

  // Final Business Plan
  downloadBusinessPlan: string;
  startAnotherAnalysis: string;
  bankReadyReport: string;
  executionMilestones: string;

  // Explore Hub Items
  exploreMarket: string;
  exploreFinance: string;
  exploreBusiness: string;
  exploreOperations: string;
  exploreRisk: string;
  exploreCompliance: string;
  exploreGrowth: string;
  exploreEvidence: string;
  exploreAsk: string;

  // Location Comparison
  nextStepsTitle: string;
  considerThisLocation: string;
  currentLocation: string;
  alternativeLocation: string;

  // Progress Indicator
  analyzingBusiness: string;
  pleaseWait: string;

  // Misc
  close: string;
  submit: string;
  loading: string;
  error: string;
  retry: string;
  viewMore: string;
  seeLess: string;
  footerBuiltFor: string;
  footerNeverPromise: string;

  // Help Modal
  helpTitle: string;
  helpStep1: string;
  helpStep2: string;
  helpStep3: string;
  helpStep4: string;
  helpStep5: string;
  closeGuide: string;
  // Extended keys
  safeRepayment: string;
  safeExplanation: string;
  watchZone: string;
  watchExplanation: string;
  riskyBorrowing: string;
  riskyExplanation: string;
  financialFeasibilityTitle: string;
  deterministicCashflowDesc: string;
  ownCapitalEquity: string;
  promoterContributionSubtext: string;
  estimatedProjectCost: string;
  capexBufferSubtext: string;
  potentialBankFinancing: string;
  monthlyRepaymentEMI: string;
  monthlyCashflowTitle: string;
  projectedMonthlyRevenue: string;
  projectedMonthlyOpex: string;
  netCashSurplus: string;
  safetyEvaluation: string;
  itemizedCapexBreakdown: string;
  workingCapitalBufferMandatory: string;
  workingCapitalDesc: string;
  competitorsFilter: string;
  selectedOperatingSite: string;
  recommendedAlternativeSite: string;
  competingOutlets: string;
  complementaryAnchors: string;
  competitorsNearby: string;
  outletsUnit: string;
  demandSignals: string;
  perMonth: string;
  customerColonies: string;
  nearbyAnchors: string;
  sensitivityResilienceAnalysis: string;
  whatIfThingsGoWrong: string;
  resetScenario: string;
  salesDecrease: string;
  operatingCostsIncrease: string;
  rawMaterialCost: string;
  scenarioStressComparison: string;
  realTimeRecalculation: string;
  financialParameter: string;
  normalBaseline: string;
  stressedScenario: string;
  impactVariance: string;
  monthlyRevenueParam: string;
  operatingExpensesParam: string;
  monthlySurplusParam: string;
  bankLoanRepaymentParam: string;
  debtCoverageSafetyParam: string;
  scenarioDiagnosis: string;
  sensitivityDisclaimer: string;
  step5Message: string;
  dossierGenerationComplete: string;
  bankReadyDossierDesc: string;
  downloadPrintPlan: string;
  startAnotherAnalysisBtn: string;
  officialBusinessDossier: string;
  dossierRef: string;
  dateOfAppraisal: string;
  statusLabel: string;
  verifiedAnalysis: string;
  executiveSummary: string;
  marketOutlook: string;
  financialFeasibilitySchedule: string;
  matchedGovtScheme: string;
  actionPlanNextSteps: string;
  listen: string;
  stop: string;
  askEngineFooter: string;
  askInputPlaceholder: string;
  contextGroundedAdvisory: string;
  suggestedQuestionsLabel: string;
  askAboutAnalysis: string;

  // Additional UI & Table Keys
  nextStepMapMsg: string;
  nextStepMapCta: string;
  nextStepFinMsg: string;
  nextStepFinCta: string;
  nextStepStressMsg: string;
  nextStepStressCta: string;
  nextStepSchemesMsg: string;
  nextStepSchemesCta: string;
  matchedSchemesSub: string;
  statutoryChecklistSub: string;
  tableComponent: string;
  tableAmount: string;
  tableShare: string;
  tableNotes: string;
  equityNote: string;
  debtNote: string;
  capexBufferNote: string;
  fixedEmiNote: string;
  transitCorridors: string;
  dossierPlatformDesc: string;
  simFootfallCompetition: string;
  simOpexInflation: string;
  simRawMaterialInflation: string;
  fixedObligation: string;
  resilientUnderShock: string;
  degradedTo: string;
  marketMapTitle: string;
  geographicCatchmentAround: string;
  allLayers: string;
  anchorsFilter: string;
  demandHubsFilter: string;
  proposedBusinessSite: string;
  alternativeLocationMarker: string;
  geoCatchmentBadge: string;
  nonGoogleHeuristicNotice: string;
  distanceFromSite: string;
  dataOrigin: string;
  potentialFitGain: string;
  pointsLabel: string;
  activeBadge: string;
  locationFitUnit: string;
  whyAlternativeBetter: string;
  footfallAdvantage: string;
  footfallAdvantageSub: string;
  commercialLeaseRent: string;
  commercialRentSub: string;
  competitorDensity: string;
  competitorDensitySub: string;
  adoptingLocationNotice: string;
  adoptedClickRevert: string;
  higherFitBadge: string;
  noActiveAnalysisTitle: string;
  noActiveAnalysisDesc: string;
  startNewAnalysisArrow: string;
  exploreHubDesc: string;
  growExistingDesc: string;
  aiAdvisorThinking: string;
  aiAdvisorPoweredBy: string;
  maxSubsidyLabel: string;
  maxLimitLabel: string;
  stepLabel: string;
  askPravirakButton: string;
  closeChat: string;
  clearConversation: string;
  chatWelcome: string;
  chatDisclaimer: string;
  chatPlaceholder: string;
  askFloatingTooltip: string;
  evidenceFootfallTicket: string;
  opexIncludesSub: string;
  retainedNetProfitSub: string;
  itemsCount: string;

  // Administrative Hierarchy & Government Scheme Loan Structure
  districtLabel: string;
  blockLabel: string;
  villageLabel: string;
  projectCostCardTitle: string;
  projectCostCardDesc: string;
  maxLoanCardTitle: string;
  maxLoanCardDesc: string;
  ownContributionCardTitle: string;
  ownContributionCardDesc: string;
  schemeSelectedTitle: string;
  schemeRateLabel: string;
  schemeTenureLabel: string;
  schemeMoratoriumLabel: string;
  schemeWhySelected: string;
  capNoticeTitle: string;
  capNoticeDesc: string;
  shortfallAmountLabel: string;
  totalRequiredContribution: string;
  beyondLimitsNoticeTitle: string;
  scheduleTableTitle: string;
  scheduleTableSubtitle: string;
  thQuarter: string;
  thOpeningBalance: string;
  thInterest: string;
  thPrincipal: string;
  thTotalPayment: string;
  thClosingBalance: string;
  moratoriumBadge: string;
  totalsRowLabel: string;
  assumptionsTitle: string;
  moratoriumToggleLabel: string;
  moratoriumServiced: string;
  moratoriumCapitalised: string;
  downloadCsvButton: string;
  ownCapitalMarginLabel: string;
  notAvailableForAddress: string;
  govtSchemeLoanStructureTitle: string;
  govtSchemeLoanStructureDesc: string;
  howCalculatedTitle: string;
  shortfallAlertTitle: string;
  fullyFundedTitle: string;
  maxSupportableProjectCostTitle: string;
  threeOptionsToProceed: string;
  optionAddCapitalTitle: string;
  optionScaleDownTitle: string;
  optionPhasedTitle: string;

  // Data Provenance
  provenanceLegendTitle: string;
  badgeMeasured: string;
  badgeEstimated: string;
  badgeAi: string;
  provenanceMeasuredDesc: string;
  provenanceEstimatedDesc: string;
  provenanceAiDesc: string;

  // Local Feasibility Report
  localFeasibilityReportTitle: string;
  localFeasibilityReportSubtitle: string;
  marketReachTitle: string;
  opportunityAnalysisTitle: string;
  swotTitle: string;
  threatsTitle: string;
  competitorMapTitle: string;
  pricingGuidanceTitle: string;
  swotStrengths: string;
  swotWeaknesses: string;
  swotOpportunities: string;
  swotThreats: string;
  threatSupplyChain: string;
  threatSeasonal: string;
  threatSingleBuyer: string;
  threatOther: string;
  pricingGuidanceNoteLabel: string;
  competitorDensityNotice: string;
  loadingFeasibility: string;
  errorFeasibility: string;
  retryFeasibility: string;
  channelsLabel: string;
  catchmentRadiusLabel: string;
  competitorsIn5km: string;
  competitorsIn10km: string;
  densityPer10kLabel: string;
  aiReportBadge: string;
  templateReportBadge: string;

  // Audit Additions - Shell & Navigation
  browsingAsGuestNotice: string;
  platformFooterSub: string;
  platformEthos: string;
  platformTaglineBuiltFor: string;
  ariaNotifications: string;
  ariaOpenNav: string;
  guestUser: string;

  // Help Modal
  helpModalTitle: string;
  helpPoint1Title: string;
  helpPoint1Desc: string;
  helpPoint2Title: string;
  helpPoint2Desc: string;
  helpPoint3Title: string;
  helpPoint3Desc: string;
  helpPoint4Title: string;
  helpPoint4Desc: string;
  helpPoint5Title: string;
  helpPoint5Desc: string;

  // Explorer Descriptions
  exploreMarketDesc: string;
  exploreFinanceDesc: string;
  exploreBusinessDesc: string;
  exploreOperationsDesc: string;
  exploreRiskDesc: string;
  exploreComplianceDesc: string;
  exploreGrowthDesc: string;
  exploreEvidenceDesc: string;
  exploreAskDesc: string;

  // Final Business Plan & Scheme Loan Breakdown
  identifiedCompetitorsOsm: string;
  promoterCapitalM: string;
  planProjectCostB: string;
  requiredMarginPercent: string;
  maxSupportableM: string;
  appliedCaseLabel: string;
  statutorySchemeRulesApplied: string;
  platformEnterpriseDecisionPlatform: string;
  planCopiedAlert: string;
  shareSummaryTitle: string;
  observationsLabel: string;
  selectionReasonLabel: string;
  footfallInRadialCatchment: string;

  // Local Feasibility View
  loadingFeasibilityScanning: string;
  osm5kmScan: string;
  expanded10kmCatchment: string;
  calculatedAgainstPop: string;
  mitigationStrategyLabel: string;
  withinPrimary15kmZone: string;
  competitorNameHeader: string;
  distanceFromSiteHeader: string;
  categoryTagHeader: string;
  dataProvenanceHeader: string;
  feasibilityAssumptionsTitle: string;

  // Existing Business Flow
  includesStockRentWages: string;
  enterZeroIfDebtFree: string;
  adjustFinancialInputs: string;
  expansionRequiresOutlay: string;
  afterDebtServicingSurplus: string;
  currentMonthlyNetProfitLabel: string;
  monthlyTurnoverLabel: string;
  expansionCapitalNeededLabel: string;
  placeholderBusinessIdea: string;
  placeholderLocation: string;

  // Explorers & Dashboard
  whatShouldYouDoNext: string;
  higherScoringNearbyArea: string;
  scaleUpScenario15x: string;
  alreadyRunningThisBusiness: string;
  executionMilestonesTitle: string;
  comparableOpportunitiesTitle: string;
  businessTypeHeader: string;
  typicalCapexHeader: string;
  typicalRevenueHeader: string;
  typicalOpexHeader: string;
  nearbyTransitContext: string;
  transitPointsTitle: string;
  commercialHubsNearbyTitle: string;
  recommendedLoanAmountLabel: string;
  allMatchedSchemesTitle: string;
  identifiedRiskFactorsTitle: string;
  requiredLikelyLicensesTitle: string;
  implementationPlan306090: string;
  provenanceDisciplineNote: string;
  readAnswerAloud: string;
  backAriaLabel: string;
  askPravirakAriaLabel: string;
  closeChatAriaLabel: string;

  // Voice Input
  voiceInputStart: string;
  voiceInputStop: string;
  voiceInputListening: string;
  voiceInputErrorPermission: string;
  voiceInputErrorNetwork: string;
  voiceInputErrorGeneric: string;
  aiAnswerAttribution: string;
  voiceInputErrorServiceUnavailable: string;

  // Plan Presentation Redesign
  decisionSummaryTitle: string;
  oneSentenceReasonLabel: string;
  keyFiguresTitle: string;
  projectCostLabel: string;
  loanWithSchemeLabel: string;
  quarterlyPaymentLabel: string;
  afterMoratoriumLabel: string;
  topReasonsTitle: string;
  topRisksTitle: string;
  doThisFirstTitle: string;
  expandAll: string;
  collapseAll: string;
  shortPlan: string;
  shortPlanDesc: string;
  fullPlan: string;
  fullPlanDesc: string;
  showMore: string;
  showLess: string;
  sectionMarketAndCompetitors: string;
  sectionOpportunities: string;
  sectionSwot: string;
  sectionThreats: string;
  sectionPricingGuidance: string;
  sectionLoanStructure: string;
  sectionBreakeven: string;
  sectionStressTests: string;
  sectionHowCalculated: string;
  sectionNextSteps: string;
  dscrPlainExplanation: string;
  promoterEquityExplanation: string;
  moratoriumExplanation: string;

  // Repayment Schedule & Dossier Navigation
  firstPaymentAfterMoratorium: string;
  reducingPaymentNote: string;
  backToSummary: string;
  viewFullSchedule: string;
  hideFullSchedule: string;
  expandAllYears: string;
  collapseAllYears: string;
  yearLabel: string;
  yearTotalPayment: string;
  yearClosingBalance: string;
  interestOnlyQuarters: string;
  finalPayment: string;
  totalInterest: string;
  totalRepaid: string;
  compactSummaryTitle: string;
  appendixScheduleTitle: string;

  // Error & Progress & Map
  somethingWentWrong: string;
  unexpectedErrorDesc: string;
  reloadPage: string;
  publicVerificationChecklist: string;
  statusComplete: string;
  statusProcessing: string;
  proposedLocationTitle: string;
  typeLabel: string;
  dataOriginLabel: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    // App-level
    appName: 'PRAVIRAK',
    tagline: 'Make the right business decision before you invest.',
    subtitle: 'AI-assisted business decision platform',
    builtFor: 'Built for India\'s entrepreneurs',
    ideasToLivelihoods: 'Ideas to Livelihoods',

    // Navigation
    navHome: 'Home',
    navMyBusinesses: 'My Businesses',
    navNewAnalysis: 'New Analysis',
    navReports: 'Reports',
    navExploreHub: 'Explore Hub',
    navNotifications: 'Notifications',
    navHelpSupport: 'Help & Support',
    navSettings: 'Settings',
    navLogOut: 'Log Out',
    navExitGuest: 'Exit Guest Mode',
    navViewProfile: 'View Profile',
    navGoToDashboard: 'Go to Dashboard',
    navLogIn: 'Log In',

    // Language
    langEnglish: 'English',
    langHindi: 'हिन्दी',
    langTelugu: 'Telugu',

    // Landing Page
    startNewBusiness: 'START A NEW BUSINESS',
    growExistingBusiness: 'GROW MY EXISTING BUSINESS',
    howPravirakHelps: 'HOW PRAVIRAK HELPS',
    nationalPlatformBadge: 'National Business Decision Platform',
    heroDescription: 'Understand your local market, financial feasibility, government financing options and business risks before committing your savings.',
    enterAnyAddress: 'Enter ANY Indian Address or Locality',
    deterministicArithmetic: '100% Deterministic Financial Arithmetic',
    googleMapsIntegration: 'Google Maps Platform Integration',
    methodologyFramework: 'Methodology & Framework',
    fiveStageDescription: 'Five sequential verification stages designed to protect your personal capital and build a resilient business model.',
    step1Title: 'Understand Local Market',
    step1Description: 'Enter your exact operating address, map competing trade outlets, and evaluate customer footfall catchment.',
    step2Title: 'Check Financial Feasibility',
    step2Description: 'Itemize fixed machinery capex, enforce 3-month working capital liquidity buffer, and verify debt service safety.',
    step3Title: 'Find Financing Options',
    step3Description: 'Match your profile with official government schemes (PMEGP 35% subsidy, MUDRA Tarun, CGTMSE collateral-free cover).',
    step4Title: 'Test Business Risks',
    step4Description: 'Run deterministic stress-testing: see what happens if sales decline by 20% or raw material prices surge.',
    step5Title: 'Get Actionable Plan',
    step5Description: 'Receive an official bank-ready project report with 6 concrete execution milestones and statutory licenses.',
    trySampleBusiness: 'TRY A SAMPLE BUSINESS',
    sampleCaseStudiesOnly: 'Sample Case Studies Only',
    sampleDescription: 'These six sample enterprises demonstrate Pravirak\'s underwriting methodology. Scores are only computed after full analysis.',
    evaluateSample: 'Evaluate Sample',
    clickAnyCard: 'Click any card to launch a demo run',
    sampleBadge: 'Sample',
    capitalLabel: 'Capital',

    // Home Dashboard
    welcomeBack: 'Welcome back',
    welcomeToPravirak: 'Welcome to PRAVIRAK',
    startNewAnalysisDesc: 'Start a new feasibility analysis, or continue one of your saved businesses below.',
    myBusinessesTitle: 'My Businesses',
    myBusinessesDesc: 'Your saved and in-progress feasibility analyses.',
    noBusinessesYet: 'No businesses yet',
    noBusinessesDesc: 'Run your first analysis to see it saved here automatically.',
    viewAll: 'View All',
    runFirstAnalysis: 'Run your first analysis',
    quickActions: 'Quick Actions',
    newAnalysis: 'New Analysis',
    exploreTools: 'Explore Tools',

    // Login
    loginTitle: 'Welcome to PRAVIRAK',
    loginSubtitle: 'Make the right business decision before you invest',
    loginTab: 'Log In',
    registerTab: 'Create Account',
    fullName: 'Full Name',
    phoneOrEmail: 'Phone or Email',
    password: 'Password',
    loginButton: 'Log In',
    registerButton: 'Create Account',
    orContinueAs: 'or continue without an account',
    continueAsGuest: 'Continue as Guest',
    guestDisclaimer: 'Guest sessions are saved on this device only. Create an account to sync across devices.',
    browsingAsGuest: 'Browsing as guest · Analyses save to this device only',
    signedInAs: 'Signed in as',
    guestSession: 'Guest session',

    // New Business Flow
    newVentureInitiation: 'New Venture Initiation',
    tellPravirakAbout: 'Tell PRAVIRAK About Your Business',
    threeQuickSteps: 'Three quick steps. PRAVIRAK checks your local market before you spend a rupee.',
    stepBusinessIdea: 'Business Idea',
    stepLocation: 'Location',
    stepCapital: 'Capital',
    whatDoYouWantToStart: 'What do you want to start?',
    describeInOwnWords: 'Describe it in your own words — e.g. "I want to open a bakery" or "Kirana store in my neighbourhood."',
    describeHint: 'e.g. Stationery shop in Madhapur Hyderabad',
    pickCommonIdea: 'Or pick a common idea to start faster:',
    whereStartBusiness: 'Where do you want to start this business?',
    enterAreaLandmark: 'Enter the area, landmark, address, or locality where you plan to operate.',
    howMuchInvest: 'How much can you invest?',
    ownSavingsDesc: 'Your own savings you can commit — without touching emergency family funds.',
    optionalDetails: 'Optional details',
    refinesSubsidyMatching: '(refines subsidy matching)',
    priorExperience: 'Prior experience in this trade',
    shopAvailability: 'Shop / land availability',
    targetCustomers: 'Target customers',
    preferredScale: 'Preferred scale',
    beginnerExperience: 'Beginner (first time)',
    moderateExperience: 'Moderate (1–3 years)',
    experiencedLevel: 'Experienced (3+ years)',
    rentedSpace: 'Will rent commercial space',
    ownedPremises: 'Self-owned shop / property',
    notYetSecured: 'Not yet secured',
    generalPublic: 'General public & walk-ins',
    studentsYouth: 'Students & youth',
    officesCorporate: 'Offices & corporate',
    wholesaleB2B: 'Wholesale & B2B',
    microScale: 'Micro (compact kiosk)',
    smallScale: 'Small (standard shop)',
    mediumScale: 'Medium (high-capacity unit)',
    cancelButton: 'Cancel',
    backButton: 'Back',
    continueButton: 'Continue',
    analyseMyBusiness: 'Analyse My Business',
    locationConfirmed: 'Location confirmed.',
    readyForNextStep: 'You\'re ready for the next step.',
    demoCaseStudies: 'Demo Case Studies',
    trySampleInstead: 'Or try a sample business instead',
    sampleEnterprisesDesc: 'Pre-filled Indian enterprise examples — good for exploring the platform quickly.',
    loadSampleParams: 'Load Sample Parameters',

    // Google Places Search
    searchPlaceholder: 'Search for an address, area, landmark or locality',
    quickTestLocalities: 'Quick Test Localities:',
    geocodedBadge: 'Geocoded',

    // Google Map Preview
    locationConfirmation: 'Location Confirmation & Map Preview',
    mapPreview: 'Map Preview',
    googleMapsActive: 'Google Maps Platform Active',
    osmLiveGeocoding: 'OpenStreetMap (Live Geocoding)',
    dragPinHint: '💡 Drag pin or click map to fine-tune exact site location',
    confirmedAddress: 'Confirmed Business Operating Address:',
    cityLabel: 'City',
    stateLabel: 'State',
    coordinatesLabel: 'Coordinates',
    changeLocation: 'Change Location',
    useThisLocation: 'Use This Location',
    mapNotice: 'Map Notice:',
    mapNoticeGoogleFail: 'Using OpenStreetMap with live Nominatim geocoding (Google Maps did not load — check your API key/billing). Pin position reflects your real searched address; drag it to fine-tune the exact spot.',
    mapNoticeOSM: 'Using OpenStreetMap with live Nominatim geocoding. Pin position reflects your real searched address; drag it to fine-tune the exact spot.',

    // Decision Dashboard
    businessTarget: 'Business Target:',
    locationLabel: 'Location:',
    ownCapital: 'Own Capital:',
    editInputs: 'Edit Inputs',
    viewFullDossier: 'View Full Dossier',
    sectionDecision: '1. Decision & Recommendation',
    sectionMap: '2. Market & Catchment Map',
    sectionFinancials: '4. Financial Feasibility & Loan Amortization',
    sectionStress: '5. Stress Testing',
    sectionSchemes: '6. Schemes & Compliance',
    sectionAdvisor: '6. Ask Pravirak AI Advisor',
    verifiableAuditTrail: 'Verifiable Audit Trail',
    whyThisDecision: 'WHY THIS DECISION?',
    multiSourceSynthesis: 'Multi-source data & estimates synthesis',
    vulnerabilityAssessment: 'Vulnerability Assessment',
    identifiedRiskFactors: 'Identified Business Risk Factors',
    whatShouldDoNext: 'What should you do next?',
    stepComplete: 'Complete',
    finalStepReady: 'Final Step Ready',
    readyForDossier: 'Ready for the final bank-ready dossier?',
    askSpecificQuestions: 'Ask PRAVIRAK specific questions or compile your final business plan report with 6 execution milestones.',
    askAiAdvisor: 'Ask AI Advisor',
    generateBusinessPlan: 'Generate Business Plan',
    decisionLabel: 'Decision',
    mapLabel: 'Map',
    financialsLabel: 'Financials',
    planLabel: 'Plan',

    // Decision Card
    yourDecision: 'YOUR PRAVIRAK DECISION',
    localDemand: 'LOCAL DEMAND',
    competition: 'COMPETITION',
    locationFit: 'LOCATION FIT',
    financialFeasibility: 'FINANCIAL FEASIBILITY',
    financialSafety: 'REPAYMENT SAFETY',
    safe: 'SAFE',
    watch: 'WATCH',
    risky: 'RISKY',
    confidence: 'Confidence',
    evidence: 'Evidence & Source',

    // Financial Feasibility
    projectCost: 'Estimated Project Cost',
    potentialFinancing: 'Potential Financing',
    monthlyEMI: 'Repayment (EMI)',
    breakEvenTimeline: 'Break-even Timeline',
    monthlyRevenue: 'Monthly Revenue',
    monthlyExpenses: 'Monthly Operating Expenses',
    monthlySurplus: 'Monthly Net Surplus',
    capexBreakdown: 'Capital Expenditure Breakdown',
    workingCapitalBuffer: 'Working Capital Buffer',
    debtServiceCoverage: 'Debt Service Coverage Ratio (DSCR)',
    promoterContribution: 'Promoter Contribution',
    loanRequired: 'Loan Required',
    interestRate: 'Interest Rate',

    // Stress Test
    stressTestTitle: 'WHAT IF THINGS GO WRONG?',
    stressTestSubtitle: 'Stress scenario simulation: see how your business withstands real-world shocks.',
    salesDecline: 'Sales Decline',
    costIncrease: 'Cost Increase',
    combinedShock: 'Combined Shock',
    survivalMonths: 'Survival Months',

    // Schemes
    financingOptions: 'FINANCING OPTIONS & SCHEMES',
    subsidizedCapital: 'Subsidized Capital & Guarantees',
    matchedSchemesDesc: 'Matched schemes based on required debt size',
    beforeYouStart: 'BEFORE YOU START (REGISTRATIONS)',
    statutoryChecklist: 'Statutory Regulatory Checklist',
    requiredLicenses: 'Required licenses, registrations and official government portals for',
    searchingSchemes: 'Searching official government sources for current schemes…',
    showingStaticDataset: 'Showing PRAVIRAK\'s static reference dataset',
    refreshButton: 'Refresh',
    officialPortal: 'Official Portal',
    recommendedMatch: 'RECOMMENDED MATCH',
    whyEligible: 'Why Potentially Eligible:',
    keyFormalCriteria: 'Key Formal Criteria:',
    officialVerificationNote: 'Official Verification Note:',
    verificationDisclaimer: 'Potentially eligible based on initial parameters. Final sanction is subject to formal verification, bank appraisal, and CIBIL score. Pravirak does not claim government ownership or guarantee loan approval.',
    nodalAgency: 'Nodal Agency:',
    benefitLabel: 'Benefit',
    eligibilityLabel: 'Eligibility',

    // Ask Pravirak
    askPravirakTitle: 'ASK PRAVIRAK',
    askPravirakSubtitle: 'Ask about the business analysis we created for you.',
    typeYourQuestion: 'Type your question here...',
    askButton: 'Ask',
    suggestedQuestions: 'Suggested Questions',

    // Reports
    reportsTitle: 'Reports',
    reportsDesc: 'Your generated business plan reports.',
    noReportsYet: 'No reports yet',
    noReportsDesc: 'Complete an analysis and generate a business plan to see reports here.',

    // My Businesses
    savedBusinesses: 'Saved Businesses',
    inProgress: 'In Progress',
    analysisComplete: 'Analysis Complete',
    noSavedBusinesses: 'No saved businesses',

    // Final Business Plan
    downloadBusinessPlan: 'DOWNLOAD BUSINESS PLAN',
    startAnotherAnalysis: 'START ANOTHER ANALYSIS',
    bankReadyReport: 'Bank-Ready Project Report',
    executionMilestones: 'Execution Milestones',

    // Explore Hub
    exploreMarket: 'Market Intelligence',
    exploreFinance: 'Financial Deep-Dive',
    exploreBusiness: 'Business Model',
    exploreOperations: 'Operations Setup',
    exploreRisk: 'Risk Assessment',
    exploreCompliance: 'Compliance & Licenses',
    exploreGrowth: 'Growth Strategy',
    exploreEvidence: 'Evidence Trail',
    exploreAsk: 'Ask PRAVIRAK',

    // Location Comparison
    nextStepsTitle: 'RECOMMENDED ACTION PLAN',
    considerThisLocation: 'CONSIDER THIS LOCATION',
    currentLocation: 'Current Location',
    alternativeLocation: 'Alternative Recommended Location',

    // Progress Indicator
    analyzingBusiness: 'Analyzing your business...',
    pleaseWait: 'Please wait while we crunch the numbers.',

    // Misc
    close: 'Close',
    submit: 'Submit',
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    viewMore: 'View More',
    seeLess: 'See Less',
    footerBuiltFor: 'Built for India\'s entrepreneurs • Unbiased public feasibility modeling',
    footerNeverPromise: 'Never promise profit. Deterministic financial math without hallucination.',

    // Help Modal
    helpTitle: 'How PRAVIRAK Works',
    helpStep1: 'Business Decision Platform: PRAVIRAK is not a generic chatbot. It performs rigorous deterministic underwriting across local market competition, location suitability, debt service safety, and sensitivity stress scenarios.',
    helpStep2: 'Deterministic Arithmetic: All debt, EMI, capex, and DSCR metrics are calculated using authoritative banking math. AI is only used to explain findings in accessible language.',
    helpStep3: 'Government Financing: We automatically check eligibility against official schemes like PMEGP, PM MUDRA, and CGTMSE to minimize debt interest drag.',
    helpStep4: 'Sensitive to Risk: We never guarantee profit. Every recommendation highlights the confidence level and underlying data vintage.',
    helpStep5: 'Explore Hub: Once you have an active analysis, use Explore Hub to dig deeper into market, finance, business, operations, risk, compliance, growth and evidence — or ask PRAVIRAK directly.',
    closeGuide: 'Close Guide',
    // Extended keys
    safeRepayment: 'Safe Repayment Capacity',
    safeExplanation: 'Cash surplus comfortably covers monthly loan repayments with strong safety buffer.',
    watchZone: 'Watch Zone (Moderate Risk)',
    watchExplanation: 'Surplus covers repayment but leaves minimal working capital buffer against revenue drops.',
    riskyBorrowing: 'High Borrowing Risk',
    riskyExplanation: 'Projected cashflow is insufficient to service requested debt safely. Default risk is elevated.',
    financialFeasibilityTitle: '3. Financial Feasibility & Viability',
    deterministicCashflowDesc: 'Deterministic cashflow model calculating debt service safety without inflated projections.',
    ownCapitalEquity: 'Own Capital (Equity)',
    promoterContributionSubtext: 'Promoter Contribution',
    estimatedProjectCost: 'Total Project Cost (Capex)',
    capexBufferSubtext: 'Includes fixed assets and initial working capital buffer',
    potentialBankFinancing: 'Required Bank Loan / Debt',
    monthlyRepaymentEMI: 'Monthly Loan EMI',
    monthlyCashflowTitle: 'Monthly Cash Flow Breakdown',
    projectedMonthlyRevenue: 'Projected Monthly Revenue',
    projectedMonthlyOpex: 'Projected Monthly Operating Expenses',
    netCashSurplus: 'Net Monthly Operating Surplus',
    safetyEvaluation: 'Safety Evaluation:',
    itemizedCapexBreakdown: 'Itemized Capital Expenditure Breakdown',
    workingCapitalBufferMandatory: 'Working Capital Buffer (Mandatory)',
    workingCapitalDesc: 'Cash reserve for initial stock, advance rent, and operating runway.',
    competitorsFilter: 'Competitors',
    selectedOperatingSite: 'Selected Operating Site',
    recommendedAlternativeSite: 'Recommended Alternative Site',
    competingOutlets: 'Competing Outlets',
    complementaryAnchors: 'Complementary Footfall Anchors',
    competitorsNearby: 'Competitors Nearby',
    outletsUnit: 'outlets within catchment',
    demandSignals: 'Monthly Footfall Density',
    perMonth: 'visitors / mo',
    customerColonies: 'Customer Catchment Colonies',
    nearbyAnchors: 'Nearby Footfall Anchors',
    sensitivityResilienceAnalysis: 'SENSITIVITY & RESILIENCE STRESS-TEST',
    whatIfThingsGoWrong: '4. What If Things Go Wrong?',
    resetScenario: 'Reset Scenario',
    salesDecrease: 'Sales Decrease (% drop in daily revenue)',
    operatingCostsIncrease: 'Operating Costs Increase (% surge in rent & utilities)',
    rawMaterialCost: 'Raw Material Cost Surge (% price spike)',
    scenarioStressComparison: 'Scenario Stress Comparison',
    realTimeRecalculation: 'Real-time Deterministic Recalculation',
    financialParameter: 'Financial Parameter',
    normalBaseline: 'Normal Baseline',
    stressedScenario: 'Stressed Scenario',
    impactVariance: 'Impact / Variance',
    monthlyRevenueParam: 'Monthly Gross Revenue',
    operatingExpensesParam: 'Total Operating Expenses',
    monthlySurplusParam: 'Net Monthly Cash Surplus',
    bankLoanRepaymentParam: 'Bank Loan Repayment (EMI)',
    debtCoverageSafetyParam: 'Debt Service Safety (DSCR)',
    scenarioDiagnosis: 'Scenario Diagnosis:',
    sensitivityDisclaimer: 'Deterministic stress simulations are calculated using banking formulas. We never hallucinate or guarantee profits.',
    step5Message: 'All 5 Feasibility Stages Evaluated',
    dossierGenerationComplete: 'Bank-Ready Business Dossier Prepared',
    bankReadyDossierDesc: 'Complete deterministic feasibility schedule ready for bank presentation, Mudra/PMEGP applications, and personal review.',
    downloadPrintPlan: 'Print / Save PDF Dossier',
    startAnotherAnalysisBtn: 'Start Another Analysis',
    officialBusinessDossier: 'PRAVIRAK Comprehensive Business Feasibility Dossier',
    dossierRef: 'Dossier Ref:',
    dateOfAppraisal: 'Date of Appraisal:',
    statusLabel: 'Status:',
    verifiedAnalysis: 'Analysis Complete & Evaluated',
    executiveSummary: 'Executive Summary & Appraisal Verdict',
    marketOutlook: 'Catchment Market & Demographic Outlook',
    financialFeasibilitySchedule: 'Deterministic Financial Schedule',
    matchedGovtScheme: 'Government Scheme Support & Subsidies',
    actionPlanNextSteps: 'Immediate Action Plan & Milestones',
    listen: 'Listen',
    stop: 'Stop',
    askEngineFooter: 'PRAVIRAK provides context-grounded deterministic guidance. We never hallucinate or give speculative financial advice.',
    askInputPlaceholder: 'Ask any question about this business, margins, licenses, or competition...',
    contextGroundedAdvisory: 'Context-Grounded Advisory',
    suggestedQuestionsLabel: 'Suggested Questions',
    askAboutAnalysis: 'Ask PRAVIRAK AI Advisor',

    // Additional UI & Table Keys
    nextStepMapMsg: 'Explore OpenStreetMap spatial layers and see if an alternative location gives higher viability.',
    nextStepMapCta: 'View Market Map',
    nextStepFinMsg: 'Now that you have reviewed location footfall and competition estimates, evaluate whether your capital covers machinery and debt repayment.',
    nextStepFinCta: 'Check Financial Feasibility',
    nextStepStressMsg: 'Before applying for bank loans, simulate what happens if customer demand drops by 20%.',
    nextStepStressCta: 'Test Economic Shocks (Stress Test)',
    nextStepSchemesMsg: 'Check which Central & State government schemes (PMEGP, MUDRA, CGTMSE) can provide subsidies or collateral-free loans.',
    nextStepSchemesCta: 'View Financing Schemes & Licenses',
    matchedSchemesSub: 'Matched schemes based on required debt size and promoter equity.',
    statutoryChecklistSub: 'Required licenses, registrations and official government portals.',
    tableComponent: 'Component',
    tableAmount: 'Amount (INR)',
    tableShare: 'Share (%)',
    tableNotes: 'Underwriting Notes',
    equityNote: 'Satisfies minimum 10% equity rule',
    debtNote: 'Eligible for priority sector collateral-free guarantee',
    capexBufferNote: 'Includes 3-month liquid reserve',
    fixedEmiNote: 'Benchmark @ 9.5% p.a. for 5 Years',
    transitCorridors: 'Transit & Access Corridors',
    dossierPlatformDesc: 'Generated for business evaluation and underwriting support.',
    simFootfallCompetition: 'Simulates lower customer footfall or local price competition.',
    simOpexInflation: 'Simulates rent hikes, electricity inflation or higher helper wages.',
    simRawMaterialInflation: 'Simulates commodity ingredient inflation (flour, oil, dairy, fuel).',
    fixedObligation: 'Unchanged obligation',
    resilientUnderShock: 'Resilient under shock',
    degradedTo: 'Degraded to',
    marketMapTitle: 'Real Market Map & Spatial Intelligence',
    geographicCatchmentAround: 'Geographic catchment around',
    allLayers: 'All Layers',
    anchorsFilter: 'Anchors',
    demandHubsFilter: 'Demand Hubs',
    proposedBusinessSite: 'Proposed Business Site',
    alternativeLocationMarker: 'Alternative Location',
    geoCatchmentBadge: 'Verifiable Geo-Catchment',
    nonGoogleHeuristicNotice: 'Non-Google analytical markers display benchmark heuristics labeled: DEMO / ESTIMATED DATA.',
    distanceFromSite: 'Distance from site',
    dataOrigin: 'Data Origin:',
    potentialFitGain: 'Potential Fit Gain:',
    pointsLabel: 'Points',
    activeBadge: 'ACTIVE',
    locationFitUnit: '/ 100 Location Fit',
    whyAlternativeBetter: 'Why This Alternative Location Is Better:',
    footfallAdvantage: 'Footfall Advantage',
    footfallAdvantageSub: 'Consistent commuter pedestrian capture.',
    commercialLeaseRent: 'Commercial Lease Rent',
    commercialRentSub: 'Directly improves monthly net cash surplus.',
    competitorDensity: 'Competitor Density',
    competitorDensitySub: 'Enables faster customer acquisition.',
    adoptingLocationNotice: 'Adopting this location updates your financial feasibility, revenue projections, and repayment safety in real-time.',
    adoptedClickRevert: 'ADOPTED (CLICK TO REVERT)',
    higherFitBadge: 'HIGHER FIT',
    noActiveAnalysisTitle: 'No active business analysis',
    noActiveAnalysisDesc: 'Run a New Analysis to see this explorer populated with your business\'s real evidence.',
    startNewAnalysisArrow: 'Start New Analysis →',
    exploreHubDesc: 'Dive into market, finance, risk and compliance modules.',
    growExistingDesc: 'Diagnose and plan expansion for a business you already run.',
    aiAdvisorThinking: 'Thinking & analyzing your business data...',
    aiAdvisorPoweredBy: 'Powered by Pravirak Conversational Intelligence Engine',
    maxSubsidyLabel: 'Max Subsidy:',
    maxLimitLabel: 'Max Limit:',
    stepLabel: 'Step',
    askPravirakButton: 'Ask Pravirak',
    closeChat: 'Close Chat',
    clearConversation: 'Clear Chat',
    chatWelcome: 'Ask any question or doubt about your business idea, loan schemes, market, or risks.',
    chatDisclaimer: 'Answers are tailored to your business profile with verified banking & market intelligence.',
    chatPlaceholder: 'Ask a question or doubt about your business...',
    askFloatingTooltip: 'Ask Pravirak AI Advisor',
    evidenceFootfallTicket: 'footfall & ticket size',
    opexIncludesSub: 'Raw materials, utilities & shop staff',
    retainedNetProfitSub: 'Retained net profit for entrepreneur',
    itemsCount: 'items',

    // Administrative Hierarchy & Government Scheme Loan Structure
    districtLabel: 'District',
    blockLabel: 'Block / Mandal',
    villageLabel: 'Village / Gram Panchayat',
    projectCostCardTitle: 'Project Cost',
    projectCostCardDesc: 'Calculated as Available Margin / 0.10 (10% promoter contribution)',
    maxLoanCardTitle: 'Maximum Loan',
    maxLoanCardDesc: 'Up to 90% of Project Cost, capped by Scheme Maximum Limit',
    ownContributionCardTitle: 'Own Contribution',
    ownContributionCardDesc: 'Base margin required + any shortfall required by scheme cap',
    schemeSelectedTitle: 'Scheme Selected',
    schemeRateLabel: 'Interest Rate',
    schemeTenureLabel: 'Total Tenure',
    schemeMoratoriumLabel: 'Moratorium Period',
    schemeWhySelected: 'Selection Reason',
    capNoticeTitle: 'Scheme Loan Cap Applied',
    capNoticeDesc: 'The calculated 90% loan exceeds the scheme maximum limit. An own-contribution shortfall must be funded by the promoter.',
    shortfallAmountLabel: 'Own-Contribution Shortfall',
    totalRequiredContribution: 'Total Required Own Contribution',
    beyondLimitsNoticeTitle: 'Beyond Scheme Limits',
    scheduleTableTitle: 'Quarterly Repayment Schedule',
    scheduleTableSubtitle: 'Quarter-by-quarter breakdown of opening balance, interest, principal, and closing balance.',
    thQuarter: 'Quarter',
    thOpeningBalance: 'Opening Balance',
    thInterest: 'Interest',
    thPrincipal: 'Principal',
    thTotalPayment: 'Total Payment',
    thClosingBalance: 'Closing Balance',
    moratoriumBadge: 'Moratorium (Interest-Only)',
    totalsRowLabel: 'Total Repayment',
    assumptionsTitle: 'Engine Assumptions & Options',
    moratoriumToggleLabel: 'Moratorium Interest Treatment',
    moratoriumServiced: 'Serviced (Interest-only payments)',
    moratoriumCapitalised: 'Capitalised (Added to Principal)',
    downloadCsvButton: 'Download Schedule (CSV)',
    ownCapitalMarginLabel: 'Your own capital (margin money)',
    notAvailableForAddress: 'Not available for this address',
    govtSchemeLoanStructureTitle: 'Government Scheme Loan Structure',
    govtSchemeLoanStructureDesc: 'Institutional credit packaging based on statutory 10% promoter contribution and priority lending norms.',
    howCalculatedTitle: 'How this was calculated',
    shortfallAlertTitle: 'Promoter Capital Shortfall Detected',
    fullyFundedTitle: 'Promoter Contribution Fully Met',
    maxSupportableProjectCostTitle: 'Maximum Supportable Project Size',
    threeOptionsToProceed: 'Recommended Options to Bridge Capital Shortfall',
    optionAddCapitalTitle: '1. Infuse Additional Capital',
    optionScaleDownTitle: '2. Scale Down Initial Capex',
    optionPhasedTitle: '3. Execute in Phased Rollout',

    // Data Provenance
    provenanceLegendTitle: 'Data Provenance',
    badgeMeasured: 'Measured',
    badgeEstimated: 'Estimated',
    badgeAi: 'AI',
    provenanceMeasuredDesc: 'Real API / OSM',
    provenanceEstimatedDesc: 'Model estimate / benchmark',
    provenanceAiDesc: 'LLM reasoning',

    // Local Feasibility Report
    localFeasibilityReportTitle: 'Local Feasibility Report',
    localFeasibilityReportSubtitle: 'Empirical micro-catchment analysis and strategic feasibility assessment.',
    marketReachTitle: '1. Market Reach & Catchment',
    opportunityAnalysisTitle: '2. Opportunity Analysis',
    swotTitle: '3. SWOT Analysis',
    threatsTitle: '4. Threats & Mitigations',
    competitorMapTitle: '5. Competitor Map (OpenStreetMap)',
    pricingGuidanceTitle: '6. Pricing Guidance',
    swotStrengths: 'Strengths',
    swotWeaknesses: 'Weaknesses',
    swotOpportunities: 'Opportunities',
    swotThreats: 'Threats',
    threatSupplyChain: 'Supply Chain Risk',
    threatSeasonal: 'Seasonal Risk',
    threatSingleBuyer: 'Customer Concentration Risk',
    threatOther: 'Operational Risk',
    pricingGuidanceNoteLabel: 'Pricing Band Notice',
    competitorDensityNotice: 'Competitor density per 10,000 omitted (population census count not available for this rural micro-market)',
    loadingFeasibility: 'Compiling Local Feasibility Report...',
    errorFeasibility: 'Unable to contact live advisor. Showing deterministic template fallback.',
    retryFeasibility: 'Retry Analysis',
    channelsLabel: 'Key Distribution Channels',
    catchmentRadiusLabel: 'Catchment Radius',
    competitorsIn5km: 'Competitors within 5 km',
    competitorsIn10km: 'Competitors within 10 km',
    densityPer10kLabel: 'Density per 10,000 population',
    aiReportBadge: 'AI Generated',
    templateReportBadge: 'Deterministic Template',

    // Audit Additions - Shell & Navigation
    browsingAsGuestNotice: 'Browsing as guest · Analyses save to this device only',
    platformFooterSub: 'AI-assisted business decision platform for Indian entrepreneurs',
    platformEthos: 'Never promise profit. Deterministic financial math without hallucination.',
    platformTaglineBuiltFor: "Built for India's entrepreneurs • Unbiased public feasibility modeling",
    ariaNotifications: 'Notifications',
    ariaOpenNav: 'Open navigation menu',
    guestUser: 'Guest',

    // Help Modal
    helpModalTitle: 'How PRAVIRAK Works',
    helpPoint1Title: '1. Business Decision Platform:',
    helpPoint1Desc: 'PRAVIRAK is not a generic chatbot. It performs rigorous deterministic underwriting across local market competition, location suitability, debt service safety, and sensitivity stress scenarios.',
    helpPoint2Title: '2. Deterministic Arithmetic:',
    helpPoint2Desc: 'All debt, EMI, capex, and DSCR metrics are calculated using authoritative banking math. AI is only used to explain findings in accessible language.',
    helpPoint3Title: '3. Government Financing:',
    helpPoint3Desc: 'We automatically check eligibility against official schemes like PMEGP, PM MUDRA, and CGTMSE to minimize debt interest drag.',
    helpPoint4Title: '4. Sensitive to Risk:',
    helpPoint4Desc: 'We never guarantee profit. Every recommendation highlights the confidence level and underlying data vintage.',
    helpPoint5Title: '5. Explore Hub:',
    helpPoint5Desc: 'Once you have an active analysis, use Explore Hub to dig deeper into market, finance, business, operations, risk, compliance, growth and evidence — or ask PRAVIRAK directly.',

    // Explorer Descriptions
    exploreMarketDesc: 'Local demand and markets',
    exploreFinanceDesc: 'Schemes, loans and eligibility',
    exploreBusinessDesc: 'Business opportunities and comparisons',
    exploreOperationsDesc: 'Suppliers, infrastructure and logistics',
    exploreRiskDesc: 'Risks, seasonality and stress scenarios',
    exploreComplianceDesc: 'Licences, registrations and approvals',
    exploreGrowthDesc: 'Expansion and new opportunities',
    exploreEvidenceDesc: 'Data sources and evidence quality',
    exploreAskDesc: 'Questions about the current analysis',

    // Final Business Plan & Scheme Loan Breakdown
    identifiedCompetitorsOsm: 'Identified Competitors (OpenStreetMap):',
    promoterCapitalM: 'Promoter Capital (M):',
    planProjectCostB: 'Plan Project Cost (B):',
    requiredMarginPercent: '10% Required Margin (0.10×B):',
    maxSupportableM: 'Max Supportable (M / 0.10):',
    appliedCaseLabel: 'Applied Case:',
    statutorySchemeRulesApplied: 'Statutory scheme rules & thresholds applied:',
    platformEnterpriseDecisionPlatform: 'Pravirak Enterprise Decision Platform',
    planCopiedAlert: 'Business Plan Summary copied to clipboard for sharing!',
    shareSummaryTitle: 'Share summary',
    observationsLabel: 'Observations:',
    selectionReasonLabel: 'Selection Reason:',
    footfallInRadialCatchment: 'across 5 km and 10 km radial catchments. Monthly estimated consumer pedestrian footfall stands at',

    // Local Feasibility View
    loadingFeasibilityScanning: 'Scanning spatial catchment radius (5 km & 10 km) via OpenStreetMap and compiling multi-dimensional feasibility schedule.',
    osm5kmScan: 'OpenStreetMap 5 km radial scan',
    expanded10kmCatchment: 'Expanded 10 km trade catchment',
    calculatedAgainstPop: 'Calculated against verified population',
    mitigationStrategyLabel: 'Mitigation Strategy:',
    withinPrimary15kmZone: 'within the primary 5 km & 10 km zones of',
    competitorNameHeader: 'Competitor Name',
    distanceFromSiteHeader: 'Distance from Site',
    categoryTagHeader: 'Category Tag',
    dataProvenanceHeader: 'Data Provenance',
    feasibilityAssumptionsTitle: 'Feasibility Model Assumptions:',

    // Existing Business Flow
    includesStockRentWages: 'Includes stock purchase, rent & wages',
    enterZeroIfDebtFree: 'Enter 0 if currently debt-free',
    adjustFinancialInputs: 'Adjust Financial Inputs',
    expansionRequiresOutlay: 'Executing this initiative requires capital outlay of',
    afterDebtServicingSurplus: 'After debt servicing, projected new monthly net cash surplus reaches',
    currentMonthlyNetProfitLabel: 'Current Monthly Net Profit',
    monthlyTurnoverLabel: 'Monthly Turnover',
    expansionCapitalNeededLabel: 'Expansion Capital Needed',
    placeholderBusinessIdea: 'e.g. Kirana Store, Garment Retail, Bakery',
    placeholderLocation: 'e.g. Sigra, Varanasi or Indiranagar, Bengaluru',

    // Explorers & Dashboard
    whatShouldYouDoNext: 'What should you do next?',
    higherScoringNearbyArea: 'Higher-Scoring Nearby Area',
    scaleUpScenario15x: 'Scale-Up Scenario (1.5x Capital)',
    alreadyRunningThisBusiness: 'Already running this business?',
    executionMilestonesTitle: 'Execution Milestones',
    comparableOpportunitiesTitle: 'Comparable Business Opportunities',
    businessTypeHeader: 'Business Type',
    typicalCapexHeader: 'Typical Capex',
    typicalRevenueHeader: 'Typical Monthly Revenue',
    typicalOpexHeader: 'Typical Monthly Opex',
    nearbyTransitContext: 'Nearby Transit & Commercial Context',
    transitPointsTitle: 'Transit Points',
    commercialHubsNearbyTitle: 'Commercial Hubs Nearby',
    recommendedLoanAmountLabel: 'Recommended loan amount',
    allMatchedSchemesTitle: 'All Matched Schemes',
    identifiedRiskFactorsTitle: 'Identified Risk Factors',
    requiredLikelyLicensesTitle: 'Required & Likely-Required Licenses',
    implementationPlan306090: '30 / 60 / 90-Day Implementation Plan',
    provenanceDisciplineNote: 'Provenance discipline: Every metric displays its origin (Measured via verified registry, Estimated via audited arithmetic, or Sourced from public census benchmarks).',
    readAnswerAloud: 'Read answer aloud',
    backAriaLabel: 'Back',
    askPravirakAriaLabel: 'Ask Pravirak Chatbot',
    closeChatAriaLabel: 'Close chat',

    // Voice Input
    voiceInputStart: 'Start voice input',
    voiceInputStop: 'Stop listening',
    voiceInputListening: 'Listening...',
    voiceInputErrorPermission: 'Microphone access blocked. Please allow microphone permissions in your browser.',
    voiceInputErrorNetwork: 'Voice recognition needs an internet connection. Please check your network.',
    voiceInputErrorGeneric: 'Could not recognize speech. Please try speaking again.',
    aiAnswerAttribution: 'AI-generated explanation. Numbers come from PRAVIRAK\u2019s calculations.',
    voiceInputErrorServiceUnavailable: 'Voice recognition service is unavailable in this browser. Please type directly or check browser microphone settings.',

    // Plan Presentation Redesign
    decisionSummaryTitle: 'Decision Summary',
    oneSentenceReasonLabel: 'Decision Reason',
    keyFiguresTitle: 'Key Financial Figures',
    projectCostLabel: 'Project Cost',
    loanWithSchemeLabel: 'Loan & Scheme',
    quarterlyPaymentLabel: 'First payment after moratorium',
    afterMoratoriumLabel: 'after moratorium',
    topReasonsTitle: 'Top 3 Positive Indicators',
    topRisksTitle: 'Top 3 Critical Risks to Watch',
    doThisFirstTitle: 'Do This First',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
    shortPlan: 'Short Plan',
    shortPlanDesc: 'Summary & loan schedule (max 2 pages)',
    fullPlan: 'Full Plan',
    fullPlanDesc: 'Complete dossier with detailed appendix',
    showMore: 'Show More',
    showLess: 'Show Less',
    sectionMarketAndCompetitors: 'Market & Competitors',
    sectionOpportunities: 'Opportunities & Underserved Niches',
    sectionSwot: 'SWOT Analysis',
    sectionThreats: 'Operational Threats & Mitigations',
    sectionPricingGuidance: 'Pricing Guidance',
    sectionLoanStructure: 'Loan Structure & Quarterly Schedule',
    sectionBreakeven: 'Break-Even & Working Capital Buffer',
    sectionStressTests: 'Stress Tests & Sensitivity',
    sectionHowCalculated: 'How This Was Calculated',
    sectionNextSteps: 'Action Plan & Next Steps',
    dscrPlainExplanation: 'Debt coverage safety ratio (surplus vs EMI) — ability of profits to repay the loan',
    promoterEquityExplanation: 'Promoter Contribution (Margin Money) — your own cash investment',
    moratoriumExplanation: 'Moratorium — repayment holiday before principal EMIs start',

    // Repayment Schedule & Dossier Navigation
    firstPaymentAfterMoratorium: 'First payment after moratorium',
    reducingPaymentNote: 'Later payments reduce each quarter as interest falls',
    backToSummary: 'Back to summary',
    viewFullSchedule: 'View full schedule ({n} quarters)',
    hideFullSchedule: 'Hide full schedule',
    expandAllYears: 'Expand all years',
    collapseAllYears: 'Collapse all years',
    yearLabel: 'Year {y}',
    yearTotalPayment: 'Year Total Payment',
    yearClosingBalance: 'Closing Balance',
    interestOnlyQuarters: 'Interest-only Quarters',
    finalPayment: 'Final Payment',
    totalInterest: 'Total Interest',
    totalRepaid: 'Total Repaid',
    compactSummaryTitle: 'Repayment Summary',
    appendixScheduleTitle: 'Appendix: Complete Quarterly Repayment Schedule',

    // Error & Progress & Map
    somethingWentWrong: 'Something went wrong',
    unexpectedErrorDesc: 'An unexpected error occurred. Please refresh the page or return to dashboard.',
    reloadPage: 'Reload Page',
    publicVerificationChecklist: 'Public Verification Checklist',
    statusComplete: 'Complete',
    statusProcessing: 'Processing...',
    proposedLocationTitle: 'Proposed Business Operating Location',
    typeLabel: 'Type:',
    dataOriginLabel: 'Data Origin:',
  },

  hi: {
    // App-level
    appName: 'प्रवीरक',
    tagline: 'निवेश करने से पहले सही व्यावसायिक निर्णय लें।',
    subtitle: 'AI-सहायक व्यावसायिक निर्णय मंच',
    builtFor: 'भारत के उद्यमियों के लिए निर्मित',
    ideasToLivelihoods: 'विचार से आजीविका तक',

    // Navigation
    navHome: 'होम',
    navMyBusinesses: 'मेरे व्यवसाय',
    navNewAnalysis: 'नया विश्लेषण',
    navReports: 'रिपोर्ट',
    navExploreHub: 'एक्सप्लोर हब',
    navNotifications: 'सूचनाएं',
    navHelpSupport: 'सहायता एवं समर्थन',
    navSettings: 'सेटिंग्स',
    navLogOut: 'लॉग आउट',
    navExitGuest: 'गेस्ट मोड बंद करें',
    navViewProfile: 'प्रोफ़ाइल देखें',
    navGoToDashboard: 'डैशबोर्ड पर जाएं',
    navLogIn: 'लॉग इन',

    // Language
    langEnglish: 'English',
    langHindi: 'हिन्दी',
    langTelugu: 'तेलुगु',

    // Landing Page
    startNewBusiness: 'नया व्यवसाय शुरू करें',
    growExistingBusiness: 'मौजूदा व्यवसाय बढ़ाएं',
    howPravirakHelps: 'प्रवीरक कैसे मदद करता है',
    nationalPlatformBadge: 'राष्ट्रीय व्यावसायिक निर्णय मंच',
    heroDescription: 'अपनी बचत लगाने से पहले अपने स्थानीय बाज़ार, वित्तीय व्यवहार्यता, सरकारी वित्तपोषण विकल्प और व्यावसायिक जोखिमों को समझें।',
    enterAnyAddress: 'कोई भी भारतीय पता दर्ज करें',
    deterministicArithmetic: '100% नियतात्मक वित्तीय गणना',
    googleMapsIntegration: 'Google Maps एकीकरण',
    methodologyFramework: 'कार्यप्रणाली एवं ढांचा',
    fiveStageDescription: 'आपकी व्यक्तिगत पूंजी की सुरक्षा और एक मजबूत व्यवसाय मॉडल बनाने के लिए पांच क्रमिक सत्यापन चरण।',
    step1Title: 'स्थानीय बाज़ार समझें',
    step1Description: 'अपना सटीक संचालन पता दर्ज करें, प्रतिस्पर्धी व्यापार दुकानों का मानचित्र बनाएं, और ग्राहक फुटफॉल का मूल्यांकन करें।',
    step2Title: 'वित्तीय व्यवहार्यता जांचें',
    step2Description: 'स्थिर मशीनरी पूंजीगत व्यय का विवरण, 3 महीने का कार्यशील पूंजी बफर लागू करें, और ऋण सेवा सुरक्षा सत्यापित करें।',
    step3Title: 'वित्तपोषण विकल्प खोजें',
    step3Description: 'अपनी प्रोफ़ाइल को आधिकारिक सरकारी योजनाओं (PMEGP 35% सब्सिडी, मुद्रा तरुण, CGTMSE) से मिलान करें।',
    step4Title: 'व्यावसायिक जोखिम परीक्षण करें',
    step4Description: 'तनाव परीक्षण चलाएं: देखें कि बिक्री 20% घटने या कच्चे माल की कीमतें बढ़ने पर क्या होता है।',
    step5Title: 'कार्ययोजना प्राप्त करें',
    step5Description: '6 ठोस कार्यान्वयन लक्ष्यों और वैधानिक लाइसेंसों के साथ बैंक-तैयार प्रोजेक्ट रिपोर्ट प्राप्त करें।',
    trySampleBusiness: 'नमूना व्यवसाय आज़माएं',
    sampleCaseStudiesOnly: 'केवल नमूना केस स्टडी',
    sampleDescription: 'ये छह नमूना उद्यम प्रवीरक की मूल्यांकन पद्धति प्रदर्शित करते हैं। स्कोर पूर्ण विश्लेषण के बाद ही गणना किए जाते हैं।',
    evaluateSample: 'नमूना मूल्यांकन करें',
    clickAnyCard: 'डेमो चलाने के लिए किसी भी कार्ड पर क्लिक करें',
    sampleBadge: 'नमूना',
    capitalLabel: 'पूंजी',

    // Home Dashboard
    welcomeBack: 'वापसी पर स्वागत है',
    welcomeToPravirak: 'प्रवीरक में आपका स्वागत है',
    startNewAnalysisDesc: 'नया व्यवहार्यता विश्लेषण शुरू करें, या नीचे अपने सहेजे गए व्यवसायों में से एक जारी रखें।',
    myBusinessesTitle: 'मेरे व्यवसाय',
    myBusinessesDesc: 'आपके सहेजे गए और प्रगति में व्यवहार्यता विश्लेषण।',
    noBusinessesYet: 'अभी कोई व्यवसाय नहीं',
    noBusinessesDesc: 'अपना पहला विश्लेषण चलाएं, यह स्वचालित रूप से यहां सहेजा जाएगा।',
    viewAll: 'सभी देखें',
    runFirstAnalysis: 'पहला विश्लेषण चलाएं',
    quickActions: 'त्वरित कार्रवाइयां',
    newAnalysis: 'नया विश्लेषण',
    exploreTools: 'उपकरण एक्सप्लोर करें',

    // Login
    loginTitle: 'प्रवीरक में आपका स्वागत है',
    loginSubtitle: 'निवेश करने से पहले सही व्यावसायिक निर्णय लें',
    loginTab: 'लॉग इन',
    registerTab: 'खाता बनाएं',
    fullName: 'पूरा नाम',
    phoneOrEmail: 'फ़ोन या ईमेल',
    password: 'पासवर्ड',
    loginButton: 'लॉग इन करें',
    registerButton: 'खाता बनाएं',
    orContinueAs: 'या बिना खाते के जारी रखें',
    continueAsGuest: 'गेस्ट के रूप में जारी रखें',
    guestDisclaimer: 'गेस्ट सत्र केवल इस डिवाइस पर सहेजे जाते हैं। विभिन्न उपकरणों में सिंक करने के लिए खाता बनाएं।',
    browsingAsGuest: 'गेस्ट के रूप में ब्राउज़ कर रहे हैं · विश्लेषण केवल इस डिवाइस पर सहेजे जाएंगे',
    signedInAs: 'इस रूप में लॉग इन',
    guestSession: 'गेस्ट सत्र',

    // New Business Flow
    newVentureInitiation: 'नए उद्यम की शुरुआत',
    tellPravirakAbout: 'प्रवीरक को अपने व्यवसाय के बारे में बताएं',
    threeQuickSteps: 'तीन आसान चरण। प्रवीरक एक रुपया खर्च करने से पहले आपके स्थानीय बाज़ार की जांच करता है।',
    stepBusinessIdea: 'व्यवसाय विचार',
    stepLocation: 'स्थान',
    stepCapital: 'पूंजी',
    whatDoYouWantToStart: 'आप क्या शुरू करना चाहते हैं?',
    describeInOwnWords: 'अपने शब्दों में बताएं — जैसे "मैं बेकरी खोलना चाहता हूं" या "मेरे मोहल्ले में किराना दुकान।"',
    describeHint: 'जैसे: स्टेशनरी दुकान, बेकरी, किराना स्टोर',
    pickCommonIdea: 'या तेज़ शुरुआत के लिए एक सामान्य विचार चुनें:',
    whereStartBusiness: 'आप यह व्यवसाय कहां शुरू करना चाहते हैं?',
    enterAreaLandmark: 'वह क्षेत्र, लैंडमार्क, पता, या इलाका दर्ज करें जहां आप संचालन करना चाहते हैं।',
    howMuchInvest: 'आप कितना निवेश कर सकते हैं?',
    ownSavingsDesc: 'आपकी अपनी बचत जो आप लगा सकते हैं — आपातकालीन पारिवारिक धन को छुए बिना।',
    optionalDetails: 'वैकल्पिक विवरण',
    refinesSubsidyMatching: '(सब्सिडी मिलान को बेहतर करता है)',
    priorExperience: 'इस व्यापार में पूर्व अनुभव',
    shopAvailability: 'दुकान / ज़मीन की उपलब्धता',
    targetCustomers: 'लक्षित ग्राहक',
    preferredScale: 'पसंदीदा पैमाना',
    beginnerExperience: 'शुरुआती (पहली बार)',
    moderateExperience: 'मध्यम (1-3 वर्ष)',
    experiencedLevel: 'अनुभवी (3+ वर्ष)',
    rentedSpace: 'व्यावसायिक स्थान किराए पर लेंगे',
    ownedPremises: 'स्वामित्व वाली दुकान / संपत्ति',
    notYetSecured: 'अभी तय नहीं',
    generalPublic: 'आम जनता और वॉक-इन',
    studentsYouth: 'छात्र और युवा',
    officesCorporate: 'कार्यालय और कॉर्पोरेट',
    wholesaleB2B: 'थोक और B2B',
    microScale: 'सूक्ष्म (छोटा कियोस्क)',
    smallScale: 'छोटा (मानक दुकान)',
    mediumScale: 'मध्यम (उच्च-क्षमता इकाई)',
    cancelButton: 'रद्द करें',
    backButton: 'वापस',
    continueButton: 'आगे बढ़ें',
    analyseMyBusiness: 'मेरे व्यवसाय का विश्लेषण करें',
    locationConfirmed: 'स्थान पुष्टि हो गई।',
    readyForNextStep: 'आप अगले चरण के लिए तैयार हैं।',
    demoCaseStudies: 'डेमो केस स्टडी',
    trySampleInstead: 'या इसके बजाय एक नमूना व्यवसाय आज़माएं',
    sampleEnterprisesDesc: 'पूर्व-भरे भारतीय उद्यम उदाहरण — प्लेटफ़ॉर्म को जल्दी एक्सप्लोर करने के लिए उपयोगी।',
    loadSampleParams: 'नमूना पैरामीटर लोड करें',

    // Google Places Search
    searchPlaceholder: 'पता, क्षेत्र, लैंडमार्क या इलाका खोजें',
    quickTestLocalities: 'त्वरित परीक्षण इलाके:',
    geocodedBadge: 'जियोकोडेड',

    // Google Map Preview
    locationConfirmation: 'स्थान पुष्टि एवं मानचित्र पूर्वावलोकन',
    mapPreview: 'मानचित्र पूर्वावलोकन',
    googleMapsActive: 'Google Maps सक्रिय',
    osmLiveGeocoding: 'OpenStreetMap (लाइव जियोकोडिंग)',
    dragPinHint: '💡 सटीक स्थान के लिए पिन खींचें या मानचित्र पर क्लिक करें',
    confirmedAddress: 'पुष्टि किया गया व्यावसायिक संचालन पता:',
    cityLabel: 'शहर',
    stateLabel: 'राज्य',
    coordinatesLabel: 'निर्देशांक',
    changeLocation: 'स्थान बदलें',
    useThisLocation: 'यह स्थान उपयोग करें',
    mapNotice: 'मानचित्र सूचना:',
    mapNoticeGoogleFail: 'लाइव जियोकोडिंग के साथ OpenStreetMap का उपयोग (Google Maps लोड नहीं हुआ)। पिन स्थिति आपके खोजे गए पते को दर्शाती है।',
    mapNoticeOSM: 'लाइव जियोकोडिंग के साथ OpenStreetMap का उपयोग। पिन स्थिति आपके खोजे गए पते को दर्शाती है।',

    // Decision Dashboard
    businessTarget: 'व्यवसाय लक्ष्य:',
    locationLabel: 'स्थान:',
    ownCapital: 'स्वयं की पूंजी:',
    editInputs: 'विवरण संपादित करें',
    viewFullDossier: 'पूरा डोजियर देखें',
    sectionDecision: '1. निर्णय एवं सिफ़ारिश',
    sectionMap: '2. बाज़ार एवं स्थल मानचित्र',
    sectionFinancials: '4. वित्तीय व्यवहार्यता एवं ऋण परिशोधन',
    sectionStress: '5. तनाव परीक्षण',
    sectionSchemes: '6. योजनाएं एवं अनुपालन',
    sectionAdvisor: '6. प्रवीरक एआई सलाहकार से पूछें',
    verifiableAuditTrail: 'सत्यापन योग्य ऑडिट ट्रेल',
    whyThisDecision: 'यह निर्णय क्यों?',
    multiSourceSynthesis: 'बहु-स्रोत डेटा और अनुमान संश्लेषण',
    vulnerabilityAssessment: 'जोखिम मूल्यांकन',
    identifiedRiskFactors: 'पहचाने गए व्यावसायिक जोखिम कारक',
    whatShouldDoNext: 'आगे क्या करना चाहिए?',
    stepComplete: 'पूर्ण',
    finalStepReady: 'अंतिम चरण तैयार',
    readyForDossier: 'बैंक-तैयार अंतिम डोजियर के लिए तैयार?',
    askSpecificQuestions: 'प्रवीरक से विशिष्ट प्रश्न पूछें या 6 कार्यान्वयन लक्ष्यों के साथ अपनी अंतिम व्यवसाय योजना रिपोर्ट संकलित करें।',
    askAiAdvisor: 'AI सलाहकार से पूछें',
    generateBusinessPlan: 'व्यवसाय योजना बनाएं',
    decisionLabel: 'निर्णय',
    mapLabel: 'मानचित्र',
    financialsLabel: 'वित्तीय',
    planLabel: 'योजना',

    // Decision Card
    yourDecision: 'आपका प्रवीरक निर्णय',
    localDemand: 'स्थानीय मांग',
    competition: 'प्रतिस्पर्धा',
    locationFit: 'स्थान उपयुक्तता',
    financialFeasibility: 'वित्तीय व्यवहार्यता',
    financialSafety: 'ऋण चुकौती सुरक्षा',
    safe: 'सुरक्षित',
    watch: 'सतर्क',
    risky: 'जोखिमपूर्ण',
    confidence: 'विश्वसनीयता',
    evidence: 'साक्ष्य एवं स्रोत',

    // Financial Feasibility
    projectCost: 'अनुमानित कुल परियोजना लागत',
    potentialFinancing: 'संभावित बैंक ऋण सहायता',
    monthlyEMI: 'मासिक किस्त (EMI)',
    breakEvenTimeline: 'लागत-वसूली समयसीमा',
    monthlyRevenue: 'मासिक राजस्व',
    monthlyExpenses: 'मासिक संचालन व्यय',
    monthlySurplus: 'मासिक शुद्ध अधिशेष',
    capexBreakdown: 'पूंजीगत व्यय विवरण',
    workingCapitalBuffer: 'कार्यशील पूंजी बफर',
    debtServiceCoverage: 'ऋण सेवा कवरेज अनुपात (DSCR)',
    promoterContribution: 'प्रवर्तक योगदान',
    loanRequired: 'आवश्यक ऋण',
    interestRate: 'ब्याज दर',

    // Stress Test
    stressTestTitle: 'यदि परिस्थितियां प्रतिकूल हों तो?',
    stressTestSubtitle: 'तनाव परिदृश्य सिमुलेशन: जानें कि मंदी या लागत वृद्धि में आपका व्यवसाय कैसे टिकेगा।',
    salesDecline: 'बिक्री में गिरावट',
    costIncrease: 'लागत वृद्धि',
    combinedShock: 'संयुक्त प्रभाव',
    survivalMonths: 'जीवन काल (महीने)',

    // Schemes
    financingOptions: 'सरकारी योजनाएं एवं वित्तीय विकल्प',
    subsidizedCapital: 'सब्सिडी वाली पूंजी एवं गारंटी',
    matchedSchemesDesc: 'आवश्यक ऋण राशि के आधार पर मिलान की गई योजनाएं',
    beforeYouStart: 'शुरू करने से पहले (पंजीकरण)',
    statutoryChecklist: 'वैधानिक नियामक जांच सूची',
    requiredLicenses: 'आवश्यक लाइसेंस, पंजीकरण और आधिकारिक सरकारी पोर्टल:',
    searchingSchemes: 'वर्तमान योजनाओं के लिए आधिकारिक सरकारी स्रोतों की खोज हो रही है…',
    showingStaticDataset: 'प्रवीरक का स्थिर संदर्भ डेटासेट दिखा रहे हैं',
    refreshButton: 'रिफ्रेश',
    officialPortal: 'आधिकारिक पोर्टल',
    recommendedMatch: 'अनुशंसित मिलान',
    whyEligible: 'संभावित रूप से पात्र क्यों:',
    keyFormalCriteria: 'प्रमुख औपचारिक मानदंड:',
    officialVerificationNote: 'आधिकारिक सत्यापन नोट:',
    verificationDisclaimer: 'प्रारंभिक मापदंडों के आधार पर संभावित रूप से पात्र। अंतिम स्वीकृति औपचारिक सत्यापन, बैंक मूल्यांकन और CIBIL स्कोर के अधीन है। प्रवीरक सरकारी स्वामित्व का दावा नहीं करता और ऋण स्वीकृति की गारंटी नहीं देता।',
    nodalAgency: 'नोडल एजेंसी:',
    benefitLabel: 'लाभ',
    eligibilityLabel: 'पात्रता',

    // Ask Pravirak
    askPravirakTitle: 'प्रवीरक से पूछें',
    askPravirakSubtitle: 'हमने आपके लिए जो व्यवसाय विश्लेषण तैयार किया है, उसके बारे में पूछें।',
    typeYourQuestion: 'अपना प्रश्न यहां टाइप करें...',
    askButton: 'पूछें',
    suggestedQuestions: 'सुझाए गए प्रश्न',

    // Reports
    reportsTitle: 'रिपोर्ट',
    reportsDesc: 'आपकी जनरेट की गई व्यवसाय योजना रिपोर्ट।',
    noReportsYet: 'अभी कोई रिपोर्ट नहीं',
    noReportsDesc: 'यहां रिपोर्ट देखने के लिए विश्लेषण पूरा करें और व्यवसाय योजना बनाएं।',

    // My Businesses
    savedBusinesses: 'सहेजे गए व्यवसाय',
    inProgress: 'प्रगति में',
    analysisComplete: 'विश्लेषण पूर्ण',
    noSavedBusinesses: 'कोई सहेजा गया व्यवसाय नहीं',

    // Final Business Plan
    downloadBusinessPlan: 'व्यवसाय योजना डाउनलोड करें',
    startAnotherAnalysis: 'नया विश्लेषण शुरू करें',
    bankReadyReport: 'बैंक-तैयार प्रोजेक्ट रिपोर्ट',
    executionMilestones: 'कार्यान्वयन लक्ष्य',

    // Explore Hub
    exploreMarket: 'बाज़ार बुद्धिमत्ता',
    exploreFinance: 'वित्तीय गहन विश्लेषण',
    exploreBusiness: 'व्यवसाय मॉडल',
    exploreOperations: 'संचालन सेटअप',
    exploreRisk: 'जोखिम मूल्यांकन',
    exploreCompliance: 'अनुपालन एवं लाइसेंस',
    exploreGrowth: 'विकास रणनीति',
    exploreEvidence: 'साक्ष्य ट्रेल',
    exploreAsk: 'प्रवीरक से पूछें',

    // Location Comparison
    nextStepsTitle: 'सुझाए गए अगले कदम',
    considerThisLocation: 'इस स्थान पर विचार करें',
    currentLocation: 'वर्तमान स्थान',
    alternativeLocation: 'वैकल्पिक अनुशंसित स्थान',

    // Progress Indicator
    analyzingBusiness: 'आपके व्यवसाय का विश्लेषण हो रहा है...',
    pleaseWait: 'कृपया प्रतीक्षा करें, हम आंकड़ों की गणना कर रहे हैं।',

    // Misc
    close: 'बंद करें',
    submit: 'जमा करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    retry: 'पुनः प्रयास करें',
    viewMore: 'और देखें',
    seeLess: 'कम देखें',
    footerBuiltFor: 'भारत के उद्यमियों के लिए निर्मित • निष्पक्ष सार्वजनिक व्यवहार्यता मॉडलिंग',
    footerNeverPromise: 'लाभ का वादा कभी नहीं। बिना भ्रम के नियतात्मक वित्तीय गणित।',

    // Help Modal
    helpTitle: 'प्रवीरक कैसे काम करता है',
    helpStep1: 'व्यावसायिक निर्णय मंच: प्रवीरक एक सामान्य चैटबॉट नहीं है। यह स्थानीय बाज़ार प्रतिस्पर्धा, स्थान उपयुक्तता, ऋण सेवा सुरक्षा, और संवेदनशीलता तनाव परिदृश्यों पर कठोर नियतात्मक मूल्यांकन करता है।',
    helpStep2: 'नियतात्मक गणित: सभी ऋण, EMI, पूंजीगत व्यय, और DSCR मेट्रिक्स आधिकारिक बैंकिंग गणित का उपयोग करके गणना किए जाते हैं। AI का उपयोग केवल निष्कर्षों को सुलभ भाषा में समझाने के लिए किया जाता है।',
    helpStep3: 'सरकारी वित्तपोषण: हम स्वचालित रूप से PMEGP, PM मुद्रा, और CGTMSE जैसी आधिकारिक योजनाओं के विरुद्ध पात्रता जांचते हैं।',
    helpStep4: 'जोखिम के प्रति संवेदनशील: हम कभी लाभ की गारंटी नहीं देते। प्रत्येक सिफारिश विश्वास स्तर और अंतर्निहित डेटा की ताज़गी को उजागर करती है।',
    helpStep5: 'एक्सप्लोर हब: एक बार आपका सक्रिय विश्लेषण हो जाने पर, बाज़ार, वित्त, व्यवसाय, संचालन, जोखिम, अनुपालन, विकास और साक्ष्य में गहराई से जानने के लिए एक्सप्लोर हब का उपयोग करें।',
    closeGuide: 'गाइड बंद करें',
    // Extended keys
    safeRepayment: 'सुरक्षित ऋण चुकाने की क्षमता',
    safeExplanation: 'मासिक अधिशेष मजबूत सुरक्षा बफर के साथ मासिक ऋण ईएमआई को आसानी से पूरा करता है।',
    watchZone: 'वॉच ज़ोन (मध्यम जोखिम)',
    watchExplanation: 'अधिशेष ईएमआई चुका सकता है लेकिन राजस्व में गिरावट के खिलाफ बहुत कम कार्यशील पूंजी बफर छोड़ता है।',
    riskyBorrowing: 'उच्च उधार जोखिम',
    riskyExplanation: 'अनुमानित नकदी प्रवाह सुरक्षित रूप से ऋण चुकाने के लिए अपर्याप्त है। डिफ़ॉल्ट जोखिम अधिक है।',
    financialFeasibilityTitle: '3. वित्तीय व्यवहार्यता और लाभप्रदता',
    deterministicCashflowDesc: 'ऋण चुकाने की सुरक्षा की गणना करने वाला निश्चित नकदी प्रवाह मॉडल बिना अतिरंजित अनुमानों के।',
    ownCapitalEquity: 'स्वयं की पूंजी (इक्विटी)',
    promoterContributionSubtext: 'प्रवर्तक योगदान',
    estimatedProjectCost: 'कुल परियोजना लागत (कैपेक्स)',
    capexBufferSubtext: 'स्थिर संपत्ति और प्रारंभिक कार्यशील पूंजी बफर शामिल है',
    potentialBankFinancing: 'आवश्यक बैंक ऋण / देनदारी',
    monthlyRepaymentEMI: 'मासिक ऋण ईएमआई',
    monthlyCashflowTitle: 'मासिक नकदी प्रवाह विवरण',
    projectedMonthlyRevenue: 'अनुमानित मासिक राजस्व',
    projectedMonthlyOpex: 'अनुमानित मासिक परिचालन व्यय',
    netCashSurplus: 'शुद्ध मासिक परिचालन अधिशेष',
    safetyEvaluation: 'सुरक्षा मूल्यांकन:',
    itemizedCapexBreakdown: 'मदवार पूंजीगत व्यय विवरण',
    workingCapitalBufferMandatory: 'कार्यशील पूंजी बफर (अनिवार्य)',
    workingCapitalDesc: 'प्रारंभिक स्टॉक, अग्रिम किराया और परिचालन के लिए आरक्षित नकदी।',
    competitorsFilter: 'प्रतियोगी',
    selectedOperatingSite: 'चयनित संचालन स्थल',
    recommendedAlternativeSite: 'अनुशंसित वैकल्पिक स्थल',
    competingOutlets: 'प्रतिस्पर्धी आउटलेट',
    complementaryAnchors: 'पूरक ग्राहक आकर्षण केंद्र',
    competitorsNearby: 'आसपास के प्रतिस्पर्धी',
    outletsUnit: 'कैचमेंट क्षेत्र में दुकानें',
    demandSignals: 'मासिक ग्राहक घनत्व',
    perMonth: 'आगंतुक / माह',
    customerColonies: 'ग्राहक कैचमेंट बस्तियां',
    nearbyAnchors: 'आसपास के प्रमुख आकर्षण',
    sensitivityResilienceAnalysis: 'संवेदनशीलता एवं लचीलापन तनाव परीक्षण',
    whatIfThingsGoWrong: '4. यदि परिस्थितियां प्रतिकूल हों तो?',
    resetScenario: 'परिदृश्य रीसेट करें',
    salesDecrease: 'बिक्री में गिरावट (दैनिक राजस्व में % कमी)',
    operatingCostsIncrease: 'परिचालन लागत में वृद्धि (किराया और उपयोगिताओं में % वृद्धि)',
    rawMaterialCost: 'कच्चे माल की लागत में उछाल (% मूल्य वृद्धि)',
    scenarioStressComparison: 'परिदृश्य तनाव तुलना',
    realTimeRecalculation: 'वास्तविक समय में निश्चित पुनर्गणना',
    financialParameter: 'वित्तीय पैरामीटर',
    normalBaseline: 'सामान्य आधार रेखा',
    stressedScenario: 'तनावग्रस्त परिदृश्य',
    impactVariance: 'प्रभाव / अंतर',
    monthlyRevenueParam: 'मासिक सकल राजस्व',
    operatingExpensesParam: 'कुल परिचालन व्यय',
    monthlySurplusParam: 'शुद्ध मासिक नकदी अधिशेष',
    bankLoanRepaymentParam: 'बैंक ऋण चुकौती (ईएमआई)',
    debtCoverageSafetyParam: 'ऋण सेवा सुरक्षा (DSCR)',
    scenarioDiagnosis: 'परिदृश्य निदान:',
    sensitivityDisclaimer: 'तनाव सिमुलेशन बैंकिंग सूत्रों का उपयोग करके गणना किए जाते हैं। हम कभी लाभ की गारंटी नहीं देते।',
    step5Message: 'सभी 5 व्यवहार्यता चरणों का मूल्यांकन संपन्न',
    dossierGenerationComplete: 'बैंक-रेडी बिजनेस डोजियर तैयार',
    bankReadyDossierDesc: 'बैंक प्रस्तुति, मुद्रा/PMEGP आवेदनों और व्यक्तिगत समीक्षा के लिए पूर्ण व्यवहार्यता अनुसूची तैयार है।',
    downloadPrintPlan: 'प्रिंट / सेव पीडीएफ डोजियर',
    startAnotherAnalysisBtn: 'अन्य विश्लेषण शुरू करें',
    officialBusinessDossier: 'प्रवीरक व्यापक व्यावसायिक व्यवहार्यता डोजियर',
    dossierRef: 'डोजियर संदर्भ:',
    dateOfAppraisal: 'मूल्यांकन तिथि:',
    statusLabel: 'स्थिति:',
    verifiedAnalysis: 'विश्लेषण पूर्ण एवं मूल्यांकित',
    executiveSummary: 'कार्यकारी सारांश एवं मूल्यांकन निर्णय',
    marketOutlook: 'कैचमेंट बाजार और जनसांख्यिकीय दृष्टिकोण',
    financialFeasibilitySchedule: 'निश्चित वित्तीय अनुसूची',
    matchedGovtScheme: 'सरकारी योजना सहायता और सब्सिडी',
    actionPlanNextSteps: 'तत्काल कार्य योजना और मील के पत्थर',
    listen: 'सुनें',
    stop: 'रोकें',
    askEngineFooter: 'प्रवीरक संदर्भ-आधारित निश्चित मार्गदर्शन प्रदान करता है। हम कभी अटकलबाजी या काल्पनिक सलाह नहीं देते।',
    askInputPlaceholder: 'इस व्यवसाय, मार्जिन, लाइसेंस या प्रतिस्पर्धा के बारे में कोई भी प्रश्न पूछें...',
    contextGroundedAdvisory: 'संदर्भ-आधारित परामर्श',
    suggestedQuestionsLabel: 'सुझाए गए प्रश्न',
    askAboutAnalysis: 'प्रवीरक AI सलाहकार से पूछें',

    // Additional UI & Table Keys
    nextStepMapMsg: 'ओपनस्ट्रीटमैप स्थानिक परतों का अन्वेषण करें और देखें कि क्या कोई वैकल्पिक स्थान उच्च व्यवहार्यता देता है।',
    nextStepMapCta: 'बाज़ार मानचित्र देखें',
    nextStepFinMsg: 'अब जब आपने स्थान, फुटफॉल और प्रतिस्पर्धा के अनुमानों की समीक्षा कर ली है, तो मूल्यांकन करें कि क्या आपकी पूंजी मशीनरी और ऋण चुकौती को कवर करती है।',
    nextStepFinCta: 'वित्तीय व्यवहार्यता जांचें',
    nextStepStressMsg: 'बैंक ऋण के लिए आवेदन करने से पहले अनुकरण करें कि मांग में 20% की गिरावट आने पर क्या होगा।',
    nextStepStressCta: 'आर्थिक झटके का परीक्षण (तनाव परीक्षण)',
    nextStepSchemesMsg: 'जांचें कि केंद्र एवं राज्य सरकार की कौन सी योजनाएं (PMEGP, मुद्रा, CGTMSE) सब्सिडी या बिना गारंटी के ऋण प्रदान कर सकती हैं।',
    nextStepSchemesCta: 'वित्तपोषण योजनाएं एवं लाइसेंस देखें',
    matchedSchemesSub: 'आवश्यक ऋण आकार और प्रमोटर इक्विटी पर आधारित मिलान योजनाएं।',
    statutoryChecklistSub: 'आवश्यक लाइसेंस, पंजीकरण और आधिकारिक सरकारी पोर्टल।',
    tableComponent: 'घटक',
    tableAmount: 'राशि (रुपये)',
    tableShare: 'हिस्सा (%)',
    tableNotes: 'अंडरराइटिंग नोट्स',
    equityNote: 'न्यूनतम 10% इक्विटी नियम को पूरा करता है',
    debtNote: 'प्राथमिकता क्षेत्र संपार्श्विक-मुक्त गारंटी के लिए पात्र',
    capexBufferNote: '3-महीने के लिक्विड रिजर्व सहित',
    fixedEmiNote: 'मानक @ 9.5% वार्षिक 5 वर्षों के लिए',
    transitCorridors: 'पारगमन एवं आवागमन गलियारे',
    dossierPlatformDesc: 'व्यावसायिक मूल्यांकन और ऋण सहायता के लिए निर्मित।',
    simFootfallCompetition: 'कम ग्राहक फुटफॉल या स्थानीय मूल्य प्रतिस्पर्धा का अनुकरण करता है।',
    simOpexInflation: 'किराया वृद्धि, बिजली या वेतन मुद्रास्फीति का अनुकरण करता है।',
    simRawMaterialInflation: 'कच्चे माल की कीमतों (आटा, तेल, डेयरी, ईंधन) में वृद्धि का अनुकरण करता है।',
    fixedObligation: 'अपरिवर्तित दायित्व',
    resilientUnderShock: 'झटके में भी लचीला',
    degradedTo: 'तक गिर गया',
    marketMapTitle: 'वास्तविक बाज़ार मानचित्र एवं स्थानिक विश्लेषण',
    geographicCatchmentAround: 'के आसपास भौगोलिक क्षेत्र',
    allLayers: 'सभी परतें',
    anchorsFilter: 'एंकर संस्थान',
    demandHubsFilter: 'मांग केंद्र',
    proposedBusinessSite: 'प्रस्तावित व्यावसायिक स्थल',
    alternativeLocationMarker: 'वैकल्पिक स्थल',
    geoCatchmentBadge: 'सत्यापनीय भू-क्षेत्र',
    nonGoogleHeuristicNotice: 'गैर-गूगल विश्लेषणात्मक संकेतक मानक अनुमानों को DEMO / ESTIMATED DATA के रूप में प्रदर्शित करते हैं।',
    distanceFromSite: 'स्थल से दूरी',
    dataOrigin: 'डेटा का स्रोत:',
    potentialFitGain: 'संभावित स्कोर लाभ:',
    pointsLabel: 'अंक',
    activeBadge: 'सक्रिय',
    locationFitUnit: '/ 100 स्थान उपयुक्तता',
    whyAlternativeBetter: 'यह वैकल्पिक स्थान क्यों बेहतर है:',
    footfallAdvantage: 'फुटफॉल लाभ',
    footfallAdvantageSub: 'निरंतर आवागमन करने वाले ग्राहक।',
    commercialLeaseRent: 'व्यावसायिक लीज किराया',
    commercialRentSub: 'मासिक शुद्ध अधिशेष में सीधे सुधार करता है।',
    competitorDensity: 'प्रतिस्पर्धी घनत्व',
    competitorDensitySub: 'तेजी से ग्राहक अधिग्रहण में सहायक।',
    adoptingLocationNotice: 'इस स्थान को अपनाने से आपकी वित्तीय व्यवहार्यता, राजस्व अनुमान और ऋण सुरक्षा तुरंत अपडेट हो जाएगी।',
    adoptedClickRevert: 'स्वीकृत (वापस करने के लिए क्लिक करें)',
    higherFitBadge: 'अधिक उपयुक्त',
    noActiveAnalysisTitle: 'कोई सक्रिय व्यापार विश्लेषण नहीं',
    noActiveAnalysisDesc: 'अपने व्यवसाय के वास्तविक साक्ष्यों को देखने के लिए नया विश्लेषण चलाएं।',
    startNewAnalysisArrow: 'नया विश्लेषण शुरू करें →',
    exploreHubDesc: 'बाज़ार, वित्त, जोखिम और अनुपालन मॉड्यूल का अन्वेषण करें।',
    growExistingDesc: 'अपने मौजूदा व्यवसाय के विस्तार का निदान और योजना बनाएं।',
    aiAdvisorThinking: 'आपके व्यावसायिक डेटा का विश्लेषण कर रहा है...',
    aiAdvisorPoweredBy: 'प्रवीरक संवादात्मक AI इंजन द्वारा संचालित',
    maxSubsidyLabel: 'अधिकतम सब्सिडी:',
    maxLimitLabel: 'अधिकतम सीमा:',
    stepLabel: 'चरण',
    askPravirakButton: 'प्रवीरक से पूछें',
    closeChat: 'चैट बंद करें',
    clearConversation: 'चैट साफ़ करें',
    chatWelcome: 'अपने व्यावसायिक विचार, ऋण योजनाओं, बाज़ार या जोखिमों के बारे में कोई भी प्रश्न या संदेह पूछें।',
    chatDisclaimer: 'उत्तर आपके व्यावसायिक प्रोफ़ाइल के अनुसार सत्यापित बैंकिंग और बाज़ार ज्ञान से तैयार किए गए हैं।',
    chatPlaceholder: 'अपने व्यवसाय के बारे में कोई प्रश्न या संदेह पूछें...',
    askFloatingTooltip: 'प्रवीरक AI सलाहकार से पूछें',
    evidenceFootfallTicket: 'ग्राहकों की संख्या और बिल राशि',
    opexIncludesSub: 'कच्चा माल, बिजली-पानी और दुकान कर्मचारी',
    retainedNetProfitSub: 'उद्यमी के लिए शुद्ध लाभ',
    itemsCount: 'मदें',

    // Administrative Hierarchy & Government Scheme Loan Structure
    districtLabel: 'ज़िला',
    blockLabel: 'ब्लॉक / मंडल',
    villageLabel: 'गाँव / ग्राम पंचायत',
    projectCostCardTitle: 'परियोजना लागत',
    projectCostCardDesc: 'उपलब्ध मार्जिन / 0.10 के रूप में आकलित (10% उद्यमी अंशदान)',
    maxLoanCardTitle: 'अधिकतम ऋण',
    maxLoanCardDesc: 'परियोजना लागत का 90% तक, योजना की अधिकतम सीमा द्वारा सीमित',
    ownContributionCardTitle: 'स्वयं का अंशदान',
    ownContributionCardDesc: 'मूल मार्जिन आवश्यकता + योजना सीमा के कारण आवश्यक अंतर राशि',
    schemeSelectedTitle: 'चयनित योजना',
    schemeRateLabel: 'ब्याज दर',
    schemeTenureLabel: 'कुल अवधि',
    schemeMoratoriumLabel: 'अधिस्थगन (Moratorium) अवधि',
    schemeWhySelected: 'चयन का कारण',
    capNoticeTitle: 'योजना ऋण सीमा लागू',
    capNoticeDesc: 'परिकलित 90% ऋण योजना की अधिकतम सीमा से अधिक है। शेष अंतर राशि उद्यमी को स्वयं वहन करनी होगी।',
    shortfallAmountLabel: 'अतिरिक्त अंशदान आवश्यकता (Shortfall)',
    totalRequiredContribution: 'कुल आवश्यक स्वयं का अंशदान',
    beyondLimitsNoticeTitle: 'योजना सीमाओं से बाहर',
    scheduleTableTitle: 'त्रैमासिक पुनर्भुगतान अनुसूची',
    scheduleTableSubtitle: 'आरंभिक शेष, ब्याज, मूलधन, और अंतिम शेष का त्रैमासिक विवरण।',
    thQuarter: 'तिमाही (Quarter)',
    thOpeningBalance: 'आरंभिक शेष',
    thInterest: 'ब्याज',
    thPrincipal: 'मूलधन',
    thTotalPayment: 'कुल भुगतान',
    thClosingBalance: 'अंतिम शेष',
    moratoriumBadge: 'अधिस्थगन (केवल ब्याज)',
    totalsRowLabel: 'कुल भुगतान',
    assumptionsTitle: 'इंजन मान्यताएं और विकल्प',
    moratoriumToggleLabel: 'अधिस्थगन ब्याज प्रबंधन',
    moratoriumServiced: 'भुगतान किया गया (केवल ब्याज)',
    moratoriumCapitalised: 'पूंजीकृत (मूलधन में जोड़ा गया)',
    downloadCsvButton: 'अनुसूची डाउनलोड करें (CSV)',
    ownCapitalMarginLabel: 'आपकी अपनी पूंजी (मार्जिन मनी)',
    notAvailableForAddress: 'इस पते के लिए उपलब्ध नहीं है',
    govtSchemeLoanStructureTitle: 'सरकारी योजना ऋण संरचना',
    govtSchemeLoanStructureDesc: 'वैधानिक 10% प्रवर्तक अंशदान और प्राथमिकता प्राप्त क्षेत्र ऋण मानदंडों पर आधारित संस्थागत ऋण संरचना।',
    howCalculatedTitle: 'इसकी गणना कैसे की गई',
    shortfallAlertTitle: 'पूंजी की कमी (Shortfall) पाई गई',
    fullyFundedTitle: 'प्रवर्तक अंशदान पूर्ण रूप से संतुष्ट',
    maxSupportableProjectCostTitle: 'अधिकतम समर्थित परियोजना आकार',
    threeOptionsToProceed: 'पूंजी की कमी को पूरा करने के 3 अनुशंसित विकल्प',
    optionAddCapitalTitle: '1. अतिरिक्त पूंजी जोड़ें',
    optionScaleDownTitle: '2. प्रारंभिक पूंजीगत व्यय कम करें',
    optionPhasedTitle: '3. चरणबद्ध तरीके से लागू करें',

    // Data Provenance
    provenanceLegendTitle: 'डेटा स्रोत (Provenance)',
    badgeMeasured: 'मापा गया (Measured)',
    badgeEstimated: 'अनुमानित (Estimated)',
    badgeAi: 'एआई (AI)',
    provenanceMeasuredDesc: 'वास्तविक API / OSM',
    provenanceEstimatedDesc: 'मॉडल अनुमान / बेंचमार्क',
    provenanceAiDesc: 'एलएलएम विश्लेषण',

    // Local Feasibility Report
    localFeasibilityReportTitle: 'स्थानीय व्यवहार्यता रिपोर्ट (Local Feasibility Report)',
    localFeasibilityReportSubtitle: 'स्थानिक कैचमेंट विश्लेषण और रणनीतिक व्यवहार्यता मूल्यांकन।',
    marketReachTitle: '1. बाज़ार पहुंच और कैचमेंट',
    opportunityAnalysisTitle: '2. अवसर विश्लेषण (अनछुए क्षेत्र)',
    swotTitle: '3. स्वाट (SWOT) विश्लेषण',
    threatsTitle: '4. व्यावसायिक खतरे और समाधान',
    competitorMapTitle: '5. प्रतिस्पर्धी मानचित्र (OpenStreetMap)',
    pricingGuidanceTitle: '6. मूल्य निर्धारण मार्गदर्शन',
    swotStrengths: 'ताकत (Strengths)',
    swotWeaknesses: 'कमजोरियां (Weaknesses)',
    swotOpportunities: 'अवसर (Opportunities)',
    swotThreats: 'खतरे (Threats)',
    threatSupplyChain: 'आपूर्ति श्रृंखला जोखिम',
    threatSeasonal: 'मौसमी जोखिम',
    threatSingleBuyer: 'ग्राहक निर्भरता जोखिम',
    threatOther: 'परिचालन जोखिम',
    pricingGuidanceNoteLabel: 'मूल्य निर्धारण सूचना',
    competitorDensityNotice: 'प्रति 10,000 आबादी पर घनत्व छोड़ दिया गया है (इस ग्रामीण क्षेत्र के लिए जनसंख्या डेटा उपलब्ध नहीं है)',
    loadingFeasibility: 'स्थानीय व्यवहार्यता रिपोर्ट तैयार की जा रही है...',
    errorFeasibility: 'लाइव सलाहकार से संपर्क नहीं हो सका। निश्चित टेम्पलेट प्रदर्शित।',
    retryFeasibility: 'पुनः प्रयास करें',
    channelsLabel: 'प्रमुख वितरण चैनल',
    catchmentRadiusLabel: 'कैचमेंट दायरा',
    competitorsIn5km: '5 किमी के दायरे में प्रतिस्पर्धी',
    competitorsIn10km: '10 किमी के दायरे में प्रतिस्पर्धी',
    densityPer10kLabel: 'प्रति 10,000 आबादी पर घनत्व',
    aiReportBadge: 'AI विश्लेषित',
    templateReportBadge: 'निश्चित टेम्पलेट',

    // Audit Additions - Shell & Navigation
    browsingAsGuestNotice: 'अतिथि के रूप में ब्राउज़ कर रहे हैं · विश्लेषण केवल इसी डिवाइस पर सहेजे जाएंगे',
    platformFooterSub: 'भारतीय उद्यमियों के लिए एआई-सहायता प्राप्त व्यावसायिक निर्णय मंच',
    platformEthos: 'कभी भी लाभ का झूठा वादा न करें। बिना किसी भ्रम के सटीक वित्तीय गणना।',
    platformTaglineBuiltFor: 'भारत के उद्यमियों के लिए निर्मित • निष्पक्ष सार्वजनिक व्यवहार्यता मॉडलिंग',
    ariaNotifications: 'सूचनाएं',
    ariaOpenNav: 'नेविगेशन मेनू खोलें',
    guestUser: 'अतिथि',

    // Help Modal
    helpModalTitle: 'प्रवीरक कैसे काम करता है',
    helpPoint1Title: '1. व्यावसायिक निर्णय मंच:',
    helpPoint1Desc: 'प्रवीरक कोई सामान्य चैटबॉट नहीं है। यह स्थानीय बाजार प्रतिस्पर्धा, स्थान उपयुक्तता, ऋण सेवा सुरक्षा और संवेदनशीलता तनाव परिदृश्यों पर सटीक और पारदर्शी मूल्यांकन करता है।',
    helpPoint2Title: '2. सटीक अंकगणित:',
    helpPoint2Desc: 'सभी ऋण, ईएमआई, पूंजीगत व्यय और डीएससीआर मेट्रिक्स आधिकारिक बैंकिंग गणित का उपयोग करके गिने जाते हैं। एआई का उपयोग केवल निष्कर्षों को सरल भाषा में समझाने के लिए किया जाता है।',
    helpPoint3Title: '3. सरकारी वित्तपोषण:',
    helpPoint3Desc: 'हम ब्याज के बोझ को कम करने के लिए PMEGP, PM MUDRA और CGTMSE जैसी आधिकारिक योजनाओं के विरुद्ध पात्रता की स्वचालित जांच करते हैं।',
    helpPoint4Title: '4. जोखिम के प्रति संवेदनशील:',
    helpPoint4Desc: 'हम कभी मुनाफे की गारंटी नहीं देते। प्रत्येक सिफ़ारिश विश्वास स्तर और अंतर्निहित डेटा स्रोत को स्पष्ट रूप से दर्शाती है।',
    helpPoint5Title: '5. एक्सप्लोर हब:',
    helpPoint5Desc: 'सक्रिय विश्लेषण मिलने के बाद, बाजार, वित्त, व्यापार, संचालन, जोखिम, अनुपालन, विकास और साक्ष्यों की गहराई से जांच करने के लिए एक्सप्लोर हब का उपयोग करें - या सीधे प्रवीरक से पूछें।',

    // Explorer Descriptions
    exploreMarketDesc: 'स्थानीय मांग और बाजार',
    exploreFinanceDesc: 'योजनाएं, ऋण और पात्रता',
    exploreBusinessDesc: 'व्यावसायिक अवसर और तुलना',
    exploreOperationsDesc: 'आपूर्तिकर्ता, बुनियादी ढांचा और रसद',
    exploreRiskDesc: 'जोखिम, मौसमी प्रभाव और तनाव परिदृश्य',
    exploreComplianceDesc: 'लाइसेंस, पंजीकरण और अनुमोदन',
    exploreGrowthDesc: 'विस्तार और नए अवसर',
    exploreEvidenceDesc: 'डेटा स्रोत और साक्ष्य गुणवत्ता',
    exploreAskDesc: 'वर्तमान विश्लेषण के बारे में प्रश्न',

    // Final Business Plan & Scheme Loan Breakdown
    identifiedCompetitorsOsm: 'पहचाने गए प्रतिस्पर्धी (OpenStreetMap):',
    promoterCapitalM: 'प्रवर्तक पूंजी (M):',
    planProjectCostB: 'योजना परियोजना लागत (B):',
    requiredMarginPercent: '10% आवश्यक मार्जिन (0.10×B):',
    maxSupportableM: 'अधिकतम समर्थित लागत (M / 0.10):',
    appliedCaseLabel: 'लागू स्थिति:',
    statutorySchemeRulesApplied: 'वैधानिक योजना नियम एवं सीमाएं लागू:',
    platformEnterpriseDecisionPlatform: 'प्रवीरक एंटरप्राइज निर्णय मंच',
    planCopiedAlert: 'साझा करने के लिए व्यावसायिक योजना का सारांश क्लिपबोर्ड पर कॉपी किया गया!',
    shareSummaryTitle: 'सारांश साझा करें',
    observationsLabel: 'अवलोकन:',
    selectionReasonLabel: 'चयन का कारण:',
    footfallInRadialCatchment: '5 किमी और 10 किमी के दायरे में। अनुमानित मासिक ग्राहक फुटफॉल है',

    // Local Feasibility View
    loadingFeasibilityScanning: 'OpenStreetMap के माध्यम से 5 किमी और 10 किमी के दायरे को स्कैन किया जा रहा है और बहु-आयामी व्यवहार्यता रिपोर्ट तैयार की जा रही है।',
    osm5kmScan: 'OpenStreetMap 5 किमी रेडियल स्कैन',
    expanded10kmCatchment: 'विस्तारित 10 किमी व्यापार क्षेत्र',
    calculatedAgainstPop: 'सत्यापित जनसंख्या के आधार पर गणना',
    mitigationStrategyLabel: 'निवारण रणनीति:',
    withinPrimary15kmZone: 'के प्राथमिक 5 किमी व 10 किमी क्षेत्र में',
    competitorNameHeader: 'प्रतिस्पर्धी का नाम',
    distanceFromSiteHeader: 'स्थान से दूरी',
    categoryTagHeader: 'श्रेणी टैग',
    dataProvenanceHeader: 'डेटा स्रोत / प्रामाणिकता',
    feasibilityAssumptionsTitle: 'व्यवहार्यता मॉडल की मान्यताएं:',

    // Existing Business Flow
    includesStockRentWages: 'स्टॉक खरीद, किराया और वेतन शामिल है',
    enterZeroIfDebtFree: 'यदि वर्तमान में कोई ऋण नहीं है तो 0 दर्ज करें',
    adjustFinancialInputs: 'वित्तीय इनपुट समायोजित करें',
    expansionRequiresOutlay: 'इस पहल को क्रियान्वित करने के लिए पूंजीगत व्यय की आवश्यकता है:',
    afterDebtServicingSurplus: 'ऋण चुकाने के बाद, अनुमानित नया मासिक शुद्ध नकद अधिशेष पहुंचता है:',
    currentMonthlyNetProfitLabel: 'वर्तमान मासिक शुद्ध लाभ',
    monthlyTurnoverLabel: 'मासिक कारोबार (टर्नओवर)',
    expansionCapitalNeededLabel: 'आवश्यक विस्तार पूंजी',
    placeholderBusinessIdea: 'उदा. किराना स्टोर, वस्त्र भंडार, बेकरी',
    placeholderLocation: 'उदा. सिगरा, वाराणसी या इंदिरानगर, बेंगलुरु',

    // Explorers & Dashboard
    whatShouldYouDoNext: 'आपको आगे क्या करना चाहिए?',
    higherScoringNearbyArea: 'उच्च स्कोर वाला नजदीकी क्षेत्र',
    scaleUpScenario15x: 'विस्तार परिदृश्य (1.5x पूंजी)',
    alreadyRunningThisBusiness: 'क्या पहले से ही यह व्यवसाय चला रहे हैं?',
    executionMilestonesTitle: 'कार्यान्वयन के चरण',
    comparableOpportunitiesTitle: 'समान व्यावसायिक अवसर',
    businessTypeHeader: 'व्यवसाय प्रकार',
    typicalCapexHeader: 'सामान्य पूंजीगत व्यय (Capex)',
    typicalRevenueHeader: 'सामान्य मासिक राजस्व',
    typicalOpexHeader: 'सामान्य मासिक संचालन व्यय (Opex)',
    nearbyTransitContext: 'नजदीकी पारगमन और वाणिज्यिक संदर्भ',
    transitPointsTitle: 'पारगमन बिंदु (बस/ट्रेन/मेट्रो)',
    commercialHubsNearbyTitle: 'नजदीकी वाणिज्यिक केंद्र',
    recommendedLoanAmountLabel: 'अनुशंसित ऋण राशि',
    allMatchedSchemesTitle: 'सभी मेल खाने वाली योजनाएं',
    identifiedRiskFactorsTitle: 'पहचाने गए जोखिम कारक',
    requiredLikelyLicensesTitle: 'आवश्यक और संभावित लाइसेंस',
    implementationPlan306090: '30 / 60 / 90-दिनों की कार्यान्वयन योजना',
    provenanceDisciplineNote: 'प्रामाणिकता अनुशासन: प्रत्येक मीट्रिक अपनी उत्पत्ति प्रदर्शित करता है (सत्यापित रजिस्ट्री के माध्यम से मापा गया, ऑडिट किए गए अंकगणित के माध्यम से अनुमानित, या सार्वजनिक जनगणना मानकों से प्राप्त)।',
    readAnswerAloud: 'उत्तर बोलकर सुनाएं',
    backAriaLabel: 'वापस',
    askPravirakAriaLabel: 'प्रवीरक चैटबॉट से पूछें',
    closeChatAriaLabel: 'चैट बंद करें',

    // Voice Input
    voiceInputStart: 'वॉइस इनपुट शुरू करें',
    voiceInputStop: 'सुनना बंद करें',
    voiceInputListening: 'सुन रहे हैं...',
    voiceInputErrorPermission: 'माइक्रोफ़ोन अनुमति अवरुद्ध है। कृपया अपने ब्राउज़र में अनुमति दें।',
    voiceInputErrorNetwork: 'वॉइस पहचान के लिए इंटरनेट कनेक्शन चाहिए। कृपया नेटवर्क जांचें।',
    voiceInputErrorGeneric: 'आवाज़ पहचानी नहीं जा सकी। कृपया पुनः बोलें।',
    aiAnswerAttribution: 'AI-जनित विवरण। संख्याएँ PRAVIRAK की गणनाओं से आती हैं।',
    voiceInputErrorServiceUnavailable: 'इस ब्राउज़र में वॉइस पहचान सेवा उपलब्ध नहीं है। कृपया लिखकर दर्ज करें।',

    // Plan Presentation Redesign
    decisionSummaryTitle: 'निर्णय सारांश',
    oneSentenceReasonLabel: 'निर्णय का कारण',
    keyFiguresTitle: 'प्रमुख वित्तीय आंकड़े',
    projectCostLabel: 'परियोजना लागत',
    loanWithSchemeLabel: 'ऋण और योजना',
    quarterlyPaymentLabel: 'मोरेटोरियम के बाद पहला भुगतान',
    afterMoratoriumLabel: 'मोराटोरियम के बाद',
    topReasonsTitle: 'शीर्ष 3 सकारात्मक कारण',
    topRisksTitle: 'शीर्ष 3 महत्वपूर्ण जोखिम',
    doThisFirstTitle: 'पहले यह कदम उठाएं',
    expandAll: 'सभी खोलें',
    collapseAll: 'सभी बंद करें',
    shortPlan: 'संक्षिप्त योजना',
    shortPlanDesc: 'सारांश और ऋण अनुसूची (अधिकतम 2 पृष्ठ)',
    fullPlan: 'पूर्ण योजना',
    fullPlanDesc: 'विस्तृत परिशिष्ट सहित संपूर्ण डोजियर',
    showMore: 'और देखें',
    showLess: 'कम देखें',
    sectionMarketAndCompetitors: 'बाजार और प्रतियोगी',
    sectionOpportunities: 'अवसर और विशिष्ट बाजार',
    sectionSwot: 'SWOT विश्लेषण',
    sectionThreats: 'व्यावसायिक खतरे और शमन',
    sectionPricingGuidance: 'मूल्य निर्धारण मार्गदर्शन',
    sectionLoanStructure: 'ऋण संरचना और त्रैमासिक अनुसूची',
    sectionBreakeven: 'ब्रेक-इवेन और कार्यशील पूंजी',
    sectionStressTests: 'तनाव परीक्षण और संवेदनशीलता',
    sectionHowCalculated: 'इसकी गणना कैसे की गई',
    sectionNextSteps: 'कार्य योजना और अगले कदम',
    dscrPlainExplanation: 'ऋण सुरक्षा अनुपात (अधिशेष बनाम ईएमआई) — लाभ से ऋण चुकाने की क्षमता',
    promoterEquityExplanation: 'प्रमोटर योगदान (मार्जिन मनी) — आपका स्वयं का नकद निवेश',
    moratoriumExplanation: 'मोराटोरियम — मूल ईएमआई शुरू होने से पहले चुकौती की छूट',

    // Repayment Schedule & Dossier Navigation
    firstPaymentAfterMoratorium: 'मोरेटोरियम के बाद पहला भुगतान',
    reducingPaymentNote: 'जैसे-जैसे ब्याज कम होता है, बाद के भुगतान हर तिमाही कम होते हैं',
    backToSummary: 'सारांश पर वापस जाएं',
    viewFullSchedule: 'पूर्ण अनुसूची देखें ({n} तिमाही)',
    hideFullSchedule: 'पूर्ण अनुसूची छुपाएं',
    expandAllYears: 'सभी वर्ष विस्तारित करें',
    collapseAllYears: 'सभी वर्ष संक्षिप्त करें',
    yearLabel: 'वर्ष {y}',
    yearTotalPayment: 'वार्षिक कुल भुगतान',
    yearClosingBalance: 'अंतिम शेष',
    interestOnlyQuarters: 'केवल ब्याज वाली तिमाहियां',
    finalPayment: 'अंतिम भुगतान',
    totalInterest: 'कुल ब्याज',
    totalRepaid: 'कुल चुकाया गया',
    compactSummaryTitle: 'पुनर्भुगतान सारांश',
    appendixScheduleTitle: 'परिशिष्ट: पूर्ण त्रैमासिक पुनर्भुगतान अनुसूची',

    // Error & Progress & Map
    somethingWentWrong: 'कुछ गलत हो गया',
    unexpectedErrorDesc: 'एक अप्रत्याशित त्रुटि हुई। कृपया पृष्ठ को रीफ़्रेश करें या डैशबोर्ड पर वापस जाएं।',
    reloadPage: 'पेज रीलोड करें',
    publicVerificationChecklist: 'सार्वजनिक सत्यापन चेकलिस्ट',
    statusComplete: 'पूर्ण',
    statusProcessing: 'प्रसंस्करण जारी है...',
    proposedLocationTitle: 'प्रस्तावित व्यावसायिक संचालन स्थान',
    typeLabel: 'प्रकार:',
    dataOriginLabel: 'डेटा का स्रोत:',
  },

  te: {
    appName: 'ప్రవీరక్ (PRAVIRAK)',
    tagline: 'మీరు పెట్టుబడి పెట్టే ముందు సరైన వ్యాపార నిర్ణయం తీసుకోండి.',
    subtitle: 'AI ఆధారిత వ్యాపార నిర్ణయ వేదిక',
    builtFor: 'భారతదేశ పారిశ్రామికవేత్తల కోసం రూపొందించబడింది',
    ideasToLivelihoods: 'ఆలోచనల నుండి జీవనోపాధి వరకు',
    navHome: 'హోమ్',
    navMyBusinesses: 'నా వ్యాపారాలు',
    navNewAnalysis: 'కొత్త విశ్లేషణ',
    navReports: 'నివేదికలు',
    navExploreHub: 'ఎక్స్‌ప్లోర్ హబ్',
    navNotifications: 'నోటిఫికేషన్లు',
    navHelpSupport: 'సహాయం & మద్దతు',
    navSettings: 'సెట్టింగ్‌లు',
    navLogOut: 'లాగ్ అవుట్',
    navExitGuest: 'గెస్ట్ మోడ్ నుండి నిష్క్రమించండి',
    navViewProfile: 'ప్రొఫైల్ చూడండి',
    navGoToDashboard: 'డ్యాష్‌బోర్డ్‌కు వెళ్లండి',
    navLogIn: 'లాగిన్',
    langEnglish: 'English',
    langHindi: 'हिन्दी',
    langTelugu: 'తెలుగు',
    startNewBusiness: 'కొత్త వ్యాపారాన్ని ప్రారంభించండి',
    growExistingBusiness: 'ప్రస్తుత వ్యాపారాన్ని విస్తరించండి',
    howPravirakHelps: 'ప్రవీరక్ ఎలా సహాయపడుతుంది',
    nationalPlatformBadge: 'జాతీయ వ్యాపార నిర్ణయ వేదిక',
    heroDescription: 'కఠినమైన స్థానిక పరిశోధన, భారతీయ బ్యాంకింగ్ లెక్కలు మరియు ప్రభుత్వం ఆమోదించిన నిధుల విశ్లేషణతో మీ వ్యాపార ఆలోచనను ధృవీకరించండి.',
    enterAnyAddress: 'భారతదేశంలోని ఏదైనా చిరునామా లేదా ప్రాంతాన్ని నమోదు చేయండి',
    deterministicArithmetic: '100% స్పష్టమైన ఆర్థిక మరియు బ్యాంకింగ్ లెక్కలు',
    googleMapsIntegration: 'ఓపెన్‌స్ట్రీట్‌మ్యాప్స్ & మ్యాప్ విశ్లేషణ',
    methodologyFramework: 'విధానం & కార్యాచరణ',
    fiveStageDescription: 'స్థానాన్ని ఎంచుకోవడం నుండి బ్యాంక్ రుణ నివేదికను పొందడం వరకు 5 దశల ప్రక్రియ.',
    step1Title: 'స్థానిక మార్కెట్‌ను అర్థం చేసుకోండి',
    step1Description: 'స్థానిక డిమాండ్, పోటీ మరియు కస్టమర్ రద్దీని నిజ సమయంలో అంచనా వేయండి.',
    step2Title: 'సరైన స్థానాన్ని ఎంచుకోండి',
    step2Description: 'ప్రజల రాకపోకలు, అద్దె ఖర్చులు మరియు ప్రాంత అనుకూలతను సరిచూడండి.',
    step3Title: 'వాస్తవిక ఆర్థిక అంచనా',
    step3Description: 'మూలధన వ్యయం, నెలవారీ ఖర్చులు, లాభ మార్జిన్లు మరియు బ్రేక్-ఈవెన్ కాలపరిమితిని లెక్కించండి.',
    step4Title: 'ఒత్తిడి పరీక్ష & నష్టాల విశ్లేషణ',
    step4Description: 'అమ్మకాలు తగ్గితే లేదా ఖర్చులు పెరిగితే వ్యాపారం ఎంతకాలం నిలబడుతుందో తనిఖీ చేయండి.',
    step5Title: 'ప్రభుత్వ పథకాలు & బ్యాంక్ నివేదిక',
    step5Description: 'PMEGP, ముద్రా వంటి రాయితీ పథకాల అర్హతను గుర్తించి ప్రాజెక్ట్ నివేదికను సిద్ధం చేయండి.',
    trySampleBusiness: 'నమూనా వ్యాపారాన్ని ప్రయత్నించండి',
    sampleCaseStudiesOnly: 'నమూనా అధ్యయనాలు మాత్రమే',
    sampleDescription: 'భారతీయ మార్కెట్లలో వివిధ వ్యాపారాలు ఎలా విశ్లేషించబడతాయో చూడటానికి ఒక నమూనాను ఎంచుకోండి.',
    evaluateSample: 'నమూనాను పరిశీలించండి',
    clickAnyCard: 'డెమో రన్ ప్రారంభించడానికి ఏదైనా కార్డుపై క్లిక్ చేయండి',
    sampleBadge: 'నమూనా',
    capitalLabel: 'మూలధనం:',
    welcomeBack: 'తిరిగి స్వాగతం',
    welcomeToPravirak: 'ప్రవీరక్‌కు స్వాగతం',
    startNewAnalysisDesc: 'మీ తదుపరి వ్యాపార ఆలోచన కోసం కొత్త సాధ్యాసాధ్యాల విశ్లేషణను ప్రారంభించండి.',
    myBusinessesTitle: 'నా వ్యాపారాలు',
    myBusinessesDesc: 'మీరు సేవ్ చేసిన మరియు పురోగతిలో ఉన్న సాధ్యాసాధ్యాల నివేదికలు.',
    noBusinessesYet: 'ఇంకా వ్యాపారాలు లేవు',
    noBusinessesDesc: 'సమగ్ర నివేదికను చూడటానికి మీ మొదటి వ్యాపార విశ్లేషణను ప్రారంభించండి.',
    viewAll: 'అన్నీ చూడండి',
    runFirstAnalysis: 'మొదటి విశ్లేషణను ప్రారంభించండి',
    quickActions: 'త్వరిత చర్యలు',
    newAnalysis: 'కొత్త విశ్లేషణ',
    exploreTools: 'పరికరాలను అన్వేషించండి',
    loginTitle: 'ప్రవీరక్‌కు స్వాగతం',
    loginSubtitle: 'నిజమైన వ్యాపార సాధ్యాసాధ్యాలను అంచనా వేయండి',
    loginTab: 'లాగిన్',
    registerTab: 'ఖాతాను సృష్టించండి',
    fullName: 'పూర్తి పేరు',
    phoneOrEmail: 'ఫోన్ లేదా ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    loginButton: 'లాగిన్ చేయండి',
    registerButton: 'ఖాతా తెరవండి',
    orContinueAs: 'లేదా ఇలా కొనసాగించండి',
    continueAsGuest: 'అతిథిగా కొనసాగండి (Guest)',
    guestDisclaimer: 'గెస్ట్ మోడ్‌లో డేటా ఈ బ్రౌజర్‌లో మాత్రమే సేవ్ చేయబడుతుంది.',
    browsingAsGuest: 'గెస్ట్‌గా బ్రౌజ్ చేస్తున్నారు · విశ్లేషణలు ఈ పరికరంలో మాత్రమే సేవ్ అవుతాయి',
    signedInAs: 'లాగిన్ అయ్యారు:',
    guestSession: 'గెస్ట్ సెషన్',
    newVentureInitiation: 'కొత్త వ్యాపార ప్రారంభం',
    tellPravirakAbout: 'మీ వ్యాపారం గురించి ప్రవీరక్‌కు తెలియజేయండి',
    threeQuickSteps: 'మూడు సాధారణ దశలు: ఆలోచన, స్థానం మరియు మీ పెట్టుబడి.',
    stepBusinessIdea: 'వ్యాపార ఆలోచన',
    stepLocation: 'వ్యాపార స్థానం',
    stepCapital: 'పెట్టుబడి మూలధనం',
    whatDoYouWantToStart: 'మీరు ఏ వ్యాపారాన్ని ప్రారంభించాలనుకుంటున్నారు?',
    describeInOwnWords: 'మీ స్వంత మాటలలో వివరించండి (ఉదా: బేకరీ, కిరాణా, క్లౌడ్ కిచెన్, మొబైల్ రిపేర్).',
    describeHint: 'ఉదా: నేను కాఫీ షాప్ మరియు స్నాక్స్ వ్యాపారాన్ని ప్రారంభించాలనుకుంటున్నాను...',
    pickCommonIdea: 'లేదా సాధారణ ఆలోచనను ఎంచుకోండి:',
    whereStartBusiness: 'మీరు వ్యాపారాన్ని ఎక్కడ ప్రారంభించాలనుకుంటున్నారు?',
    enterAreaLandmark: 'ప్రాంతం, ల్యాండ్‌మార్క్ లేదా పిన్‌కోడ్‌ను నమోదు చేయండి.',
    howMuchInvest: 'మీరు ఎంత పెట్టుబడి పెట్టగలరు?',
    ownSavingsDesc: 'మీ స్వంత పొదుపు లేదా అందుబాటులో ఉన్న ప్రారంభ మూలధనం.',
    optionalDetails: 'ఐచ్ఛిక వివరాలు',
    refinesSubsidyMatching: '(ప్రభుత్వ రాయితీ పథకాల అర్హతను మరింత స్పష్టంగా నిర్ణయిస్తుంది)',
    priorExperience: 'మునుపటి అనుభవం',
    shopAvailability: 'దుకాణం లభ్యత',
    targetCustomers: 'లక్ష్య కస్టమర్లు',
    preferredScale: 'ఇష్టపడే పరిమాణం',
    beginnerExperience: 'ప్రారంభకుడు (< 1 సంవత్సరం)',
    moderateExperience: 'మధ్యస్థం (1-3 సంవత్సరాలు)',
    experiencedLevel: 'అనుభవజ్ఞుడు (3+ సంవత్సరాలు)',
    rentedSpace: 'అద్దె స్థలం',
    ownedPremises: 'సొంత స్థలం',
    notYetSecured: 'ఇంకా ఖరారు కాలేదు',
    generalPublic: 'సాధారణ ప్రజలు / బాటసారులు',
    studentsYouth: 'విద్యార్థులు & యువత',
    officesCorporate: 'కార్యాలయాలు / ఉద్యోగులు',
    wholesaleB2B: 'హోల్‌సేల్ / B2B వ్యాపారులు',
    microScale: 'మైక్రో (స్థానిక పరిధి)',
    smallScale: 'చిన్న స్థాయి (పట్టణ పరిధి)',
    mediumScale: 'మధ్యస్థ స్థాయి (జిల్లా పరిధి)',
    cancelButton: 'రద్దు చేయండి',
    backButton: 'వెనుకకు',
    continueButton: 'కొనసాగించండి',
    analyseMyBusiness: 'నా వ్యాపారాన్ని విశ్లేషించండి',
    locationConfirmed: 'స్థానం నిర్ధారించబడింది.',
    readyForNextStep: 'తదుపరి దశకు మీరు సిద్ధంగా ఉన్నారు.',
    demoCaseStudies: 'డెమో కేస్ స్టడీలు',
    trySampleInstead: 'లేదా ఒక నమూనా వ్యాపారాన్ని ప్రయత్నించండి',
    sampleEnterprisesDesc: 'పూర్వ-నింపిన భారతీయ వ్యాపార నమూనాలను లోడ్ చేయండి.',
    loadSampleParams: 'నమూనా వివరాలను లోడ్ చేయండి',
    searchPlaceholder: 'చిరునామా, ప్రాంతం లేదా పిన్‌కోడ్ కోసం శోధించండి',
    quickTestLocalities: 'త్వరిత పరీక్ష స్థలాలు:',
    geocodedBadge: 'జియోకోడెడ్',
    locationConfirmation: 'స్థాన నిర్ధారణ & మ్యాప్ ప్రివ్యూ',
    mapPreview: 'మ్యాప్ ప్రివ్యూ',
    googleMapsActive: 'గూగుల్ మ్యాప్స్ సక్రియంగా ఉంది',
    osmLiveGeocoding: 'ఓపెన్‌స్ట్రీట్‌మ్యాప్ (లైవ్ జియోకోడింగ్)',
    dragPinHint: 'సరైన స్థలాన్ని సర్దుబాటు చేయడానికి పిన్‌ను లాగండి లేదా మ్యాప్‌పై క్లిక్ చేయండి.',
    confirmedAddress: 'నిర్ధారించబడిన వ్యాపార చిరునామా:',
    cityLabel: 'నగరం / పట్టణం',
    stateLabel: 'రాష్ట్రం',
    coordinatesLabel: 'కోఆర్డినేట్లు',
    changeLocation: 'స్థానాన్ని మార్చండి',
    useThisLocation: 'ఈ స్థానాన్ని ఉపయోగించండి',
    mapNotice: 'మ్యాప్ సూచన',
    mapNoticeGoogleFail: 'ఓపెన్‌స్ట్రీట్‌మ్యాప్స్ లైవ్ మోడ్‌లో నడుస్తోంది.',
    mapNoticeOSM: 'ఉచిత, వేగవంతమైన ఓపెన్‌స్ట్రీట్‌మ్యాప్ ద్వారా ఉపగ్రహ మరియు వీధి మ్యాప్ చూపబడుతోంది.',
    businessTarget: 'వ్యాపార లక్ష్యం:',
    locationLabel: 'స్థానం:',
    ownCapital: 'సొంత మూలధనం:',
    editInputs: 'వివరాలను సవరించండి',
    viewFullDossier: 'పూర్తి నివేదికను చూడండి',
    sectionDecision: '1. వ్యాపార నిర్ణయం & సిఫార్సు',
    sectionMap: '2. మార్కెట్ & క్యాచ్‌మెంట్ మ్యాప్',
    sectionFinancials: '4. ఆర్థిక సాధ్యత & రుణ చెల్లింపులు',
    sectionStress: '5. ఒత్తిడి పరీక్ష & నష్టాల తనిఖీ',
    sectionSchemes: '6. ప్రభుత్వ పథకాలు & అనుమతులు',
    sectionAdvisor: '6. ప్రవీరక్ ఏఐ సలహాదారుని అడగండి',
    verifiableAuditTrail: 'ధృవీకరించదగిన ఆడిట్ వివరాలు',
    whyThisDecision: 'ఈ నిర్ణయానికి కారణాలు',
    multiSourceSynthesis: 'బహుళ వనరుల డేటా మరియు అంచనాల సంశ్లేషణ',
    vulnerabilityAssessment: 'నష్టాల & సంక్షోభాల అంచనా',
    identifiedRiskFactors: 'గుర్తించబడిన వ్యాపార నష్ట కారకాలు',
    whatShouldDoNext: 'తదుపరి మీరు ఏమి చేయాలి?',
    stepComplete: '5 లో {n} దశ పూర్తయింది',
    finalStepReady: 'చివరి దశ సిద్ధంగా ఉంది',
    readyForDossier: 'బ్యాంక్ రుణ నివేదికను రూపొందించడానికి సిద్ధంగా ఉన్నారా?',
    askSpecificQuestions: 'ఈ వ్యాపారం గురించి నిర్దిష్ట ప్రశ్నలు అడగండి',
    askAiAdvisor: 'AI సలహాదారుని అడగండి',
    generateBusinessPlan: 'బ్యాంక్ వ్యాపార ప్రణాళికను రూపొందించండి',
    decisionLabel: 'నిర్ణయం',
    mapLabel: 'మ్యాప్',
    financialsLabel: 'ఆర్థికం',
    planLabel: 'ప్రణాళిక',
    yourDecision: 'మీ వ్యాపార నిర్ణయం',
    localDemand: 'స్థానిక డిమాండ్',
    competition: 'పోటీ స్థాయి',
    locationFit: 'స్థాన అనుకూలత',
    financialFeasibility: 'ఆర్థిక సాధ్యాసాధ్యాలు',
    financialSafety: 'ఆర్థిక భద్రత',
    safe: 'సురక్షితం',
    watch: 'జాగ్రత్త అవసరం',
    risky: 'ప్రమాదకరం',
    confidence: 'విశ్వసనీయత',
    evidence: 'ఆధారాలు',
    projectCost: 'మొత్తం ప్రాజెక్ట్ వ్యయం',
    potentialFinancing: 'సాధ్యమయ్యే రుణం',
    monthlyEMI: 'అంచనా వేసిన నెలవారీ EMI',
    breakEvenTimeline: 'బ్రేక్-ఈవెన్ కాలపరిమితి',
    monthlyRevenue: 'నెలవారీ అంచనా ఆదాయం',
    monthlyExpenses: 'నెలవారీ నిర్వహణ ఖర్చులు',
    monthlySurplus: 'నెలవారీ నికర లాభం (మిగులు)',
    capexBreakdown: 'మూలధన వ్యయ వివరాలు',
    workingCapitalBuffer: 'వర్కింగ్ క్యాపిటల్ నిల్వ',
    debtServiceCoverage: 'రుణ చెల్లింపు కవరేజ్ నిష్పత్తి (DSCR)',
    promoterContribution: 'యజమాని పెట్టుబడి (ఈక్విటీ)',
    loanRequired: 'అవసరమైన బ్యాంకు రుణం',
    interestRate: 'వడ్డీ రేటు',
    stressTestTitle: 'ఆర్థిక ఒత్తిడి పరీక్ష',
    stressTestSubtitle: 'ప్రతికూల పరిస్థితులలో వ్యాపార మనుగడ అంచనా',
    salesDecline: 'అమ్మకాలు 20% తగ్గితే',
    costIncrease: 'ఖర్చులు 15% పెరిగితే',
    combinedShock: 'రెండు షాక్‌లు కలిస్తే',
    survivalMonths: 'నగదు నిల్వల మనుగడ వ్యవధి',
    financingOptions: 'రుణ మరియు సబ్సిడీ ఎంపికలు',
    subsidizedCapital: 'రాయితీ మూలధనం & ప్రభుత్వ పథకాలు',
    matchedSchemesDesc: 'మీ ప్రొఫైల్ ఆధారంగా అర్హత ఉన్న కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ పథకాలు.',
    beforeYouStart: 'మీరు ప్రారంభించే ముందు చట్టబద్ధ నిబంధనలు',
    statutoryChecklist: 'చట్టబద్ధ నిబంధనలు & అనుమతుల చెక్‌లిస్ట్',
    requiredLicenses: 'అవసరమైన లైసెన్సులు & రిజిస్ట్రేషన్లు',
    searchingSchemes: 'అధికారిక ప్రభుత్వ వనరులను శోధిస్తోంది...',
    showingStaticDataset: 'ప్రవీరక్ అధికారిక ప్రభుత్వ నిబంధనల డేటాసెట్ నుండి చూపబడుతోంది',
    refreshButton: 'రిఫ్రెష్ చేయండి',
    officialPortal: 'అధికారిక పోర్టల్',
    recommendedMatch: 'సిఫార్సు చేయబడిన పథకం',
    whyEligible: 'మీరు ఎందుకు అర్హులు:',
    keyFormalCriteria: 'ప్రధాన అధికారిక అర్హతా ప్రమాణాలు:',
    officialVerificationNote: 'అధికారిక ధృవీకరణ గమనిక:',
    verificationDisclaimer: 'నిబంధనల ప్రకారం దరఖాస్తును సంబంధిత నోడల్ బ్యాంక్ శాఖ లేదా ఆన్‌లైన్ పోర్టల్‌లో ధృవీకరించుకోవాలి.',
    nodalAgency: 'నోడల్ ఏజెన్సీ:',
    benefitLabel: 'ప్రయోజనం:',
    eligibilityLabel: 'అర్హత:',
    askPravirakTitle: 'ప్రవీరక్ AI ని అడగండి',
    askPravirakSubtitle: 'మీ నిర్దిష్ట వ్యాపార ప్రశ్నలకు తక్షణ విశ్లేషణ పొందండి',
    typeYourQuestion: 'మీ ప్రశ్నను టైప్ చేయండి...',
    askButton: 'అడగండి',
    suggestedQuestions: 'సూచించిన ప్రశ్నలు:',
    reportsTitle: 'వ్యాపార సాధ్యాసాధ్యాల నివేదికలు',
    reportsDesc: 'మీరు విశ్లేషించిన అన్ని వ్యాపారాల సమగ్ర ప్రణాళికలు మరియు నివేదికలు.',
    noReportsYet: 'ఇంకా నివేదికలు లేవు',
    noReportsDesc: 'నివేదికను రూపొందించడానికి ఒక విశ్లేషణను పూర్తి చేయండి.',
    savedBusinesses: 'సేవ్ చేసిన వ్యాపారాలు',
    inProgress: 'పురోగతిలో ఉంది',
    analysisComplete: 'విశ్లేషణ పూర్తయింది',
    noSavedBusinesses: 'సేవ్ చేసిన వ్యాపారాలు ఏవీ లేవు',
    downloadBusinessPlan: 'వ్యాపార ప్రణాళికను డౌన్‌లోడ్ చేయండి (PDF)',
    startAnotherAnalysis: 'మరో వ్యాపార విశ్లేషణను ప్రారంభించండి',
    bankReadyReport: 'బ్యాంక్ సమర్పణకు సిద్ధమైన ప్రాజెక్ట్ నివేదిక',
    executionMilestones: 'వ్యాపార ప్రారంభ మైలురాళ్లు',
    exploreMarket: 'మార్కెట్ డిమాండ్ & పోటీ',
    exploreFinance: 'ఆర్థిక సాధ్యాసాధ్యాలు',
    exploreBusiness: 'వ్యాపార నమూనా',
    exploreOperations: 'కార్యాచరణ & నిర్వహణ',
    exploreRisk: 'నష్టాల అంచనా',
    exploreCompliance: 'నిబంధనలు & లైసెన్సులు',
    exploreGrowth: 'వృద్ధి వ్యూహం',
    exploreEvidence: 'డేటా సాక్ష్యాధారాలు',
    exploreAsk: 'ప్రవీరక్‌ను అడగండి',
    nextStepsTitle: 'సూచించిన తదుపరి చర్యలు',
    considerThisLocation: 'ఈ స్థలాన్ని పరిశీలించండి',
    currentLocation: 'ప్రస్తుత స్థానం',
    alternativeLocation: 'ప్రత్యామ్నాయ అనుకూల స్థానం',
    analyzingBusiness: 'మీ వ్యాపారాన్ని విశ్లేషిస్తోంది...',
    pleaseWait: 'దయచేసి వేచి ఉండండి, లెక్కలను పూర్తి చేస్తున్నాము.',
    close: 'మూసివేయండి',
    submit: 'సమర్పించండి',
    loading: 'లోడ్ అవుతోంది...',
    error: 'లోపం',
    retry: 'మళ్లీ ప్రయత్నించండి',
    viewMore: 'మరిన్ని చూడండి',
    seeLess: 'తక్కువ చూడండి',
    footerBuiltFor: 'భారతదేశ పారిశ్రామికవేత్తల కోసం రూపొందించబడింది • నిష్పక్షపాత సాధ్యాసాధ్యాల మోడలింగ్',
    footerNeverPromise: 'లాభాల కల్పిత హామీలు ఎప్పుడూ ఇవ్వము. గందరగోళం లేని స్పష్టమైన ఆర్థిక లెక్కలు.',
    helpTitle: 'ప్రవీరక్ ఎలా పనిచేస్తుంది',
    helpStep1: 'వ్యాపార నిర్ణయ వేదిక: ప్రవీరక్ సాధారణ చాట్‌బాట్ కాదు. ఇది స్థానిక మార్కెట్ పోటీ, స్థాన అనుకూలత, రుణ చెల్లింపు భద్రత మరియు నష్టాల పరిస్థితులను కచ్చితమైన బ్యాంకింగ్ ప్రమాణాలతో లెక్కిస్తుంది.',
    helpStep2: 'స్పష్టమైన లెక్కలు: అన్ని రుణాలు, EMI, మూలధన వ్యయం మరియు DSCR మెట్రిక్స్ అధికారిక బ్యాంకింగ్ గణితం ఆధారంగా లెక్కించబడతాయి. AI కేవలం సులభమైన వివరణ కోసం మాత్రమే ఉపయోగించబడుతుంది.',
    helpStep3: 'ప్రభుత్వ నిధులు: PMEGP, PM ముద్రా మరియు CGTMSE వంటి అధికారిక పథకాల అర్హతను మేము స్వయంచాలకంగా తనిఖీ చేస్తాము.',
    helpStep4: 'నష్టాల పట్ల స్పృహ: మేము లాభాలకు ఎప్పుడూ హామీ ఇవ్వము. ప్రతి సిఫార్సు వాస్తవ డేటా మరియు ఆధారాలపై ఆధారపడి ఉంటుంది.',
    helpStep5: 'ఎక్స్‌ప్లోర్ హబ్: మీ విశ్లేషణ పూర్తయిన తర్వాత, మార్కెట్, ఫైనాన్స్, రిస్క్ మరియు చట్టపరమైన అనుమతుల గురించి లోతుగా తెలుసుకోవడానికి ఎక్స్‌ప్లోర్ హబ్‌ను ఉపయోగించండి.',
    closeGuide: 'గైడ్‌ను మూసివేయండి',
    // Extended keys
    safeRepayment: 'సురక్షిత రుణ చెల్లింపు సామర్థ్యం',
    safeExplanation: 'నగదు మిగులు బలమైన రక్షణతో నెలవారీ రుణ ఈఎంఐని సౌకర్యవంతంగా కవర్ చేస్తుంది.',
    watchZone: 'పర్యవేక్షణ జోన్ (మితమైన నష్టం)',
    watchExplanation: 'మిగులు ఈఎంఐని చెల్లిస్తుంది కానీ ఆదాయం తగ్గినప్పుడు చాలా తక్కువ వర్కింగ్ క్యాపిటల్ మిగులుతుంది.',
    riskyBorrowing: 'అధిక రుణ నష్టం',
    riskyExplanation: 'అంచనా వేసిన నగదు ప్రవాహం అప్పును సురక్షితంగా తీర్చడానికి సరిపోదు. డిఫాల్ట్ నష్టం ఎక్కువ.',
    financialFeasibilityTitle: '3. ఆర్థిక సాధ్యాసాధ్యాలు మరియు మనుగడ',
    deterministicCashflowDesc: 'అధిక అంచనాలు లేకుండా రుణ భద్రతను లెక్కించే కచ్చితమైన నగదు ప్రవాహ మోడల్.',
    ownCapitalEquity: 'సొంత మూలధనం (ఈక్విటీ)',
    promoterContributionSubtext: 'ప్రమోటర్ వాటా',
    estimatedProjectCost: 'మొత్తం ప్రాజెక్ట్ ఖర్చు (క్యాపెక్స్)',
    capexBufferSubtext: 'స్థిర ఆస్తులు మరియు ప్రారంభ వర్కింగ్ క్యాపిటల్ బఫర్ కలుపుకొని',
    potentialBankFinancing: 'అవసరమైన బ్యాంకు రుణం / అప్పు',
    monthlyRepaymentEMI: 'నెలవారీ లోన్ ఈఎంఐ',
    monthlyCashflowTitle: 'నెలవారీ నగదు ప్రవాహ వివరాలు',
    projectedMonthlyRevenue: 'అంచనా వేసిన నెలవారీ ఆదాయం',
    projectedMonthlyOpex: 'అంచనా వేసిన నెలవారీ నిర్వహణ ఖర్చులు',
    netCashSurplus: 'నికర నెలవారీ నిర్వహణ మిగులు',
    safetyEvaluation: 'భద్రతా మూల్యాంకనం:',
    itemizedCapexBreakdown: 'వివరమైన మూలధన వ్యయ విభజన',
    workingCapitalBufferMandatory: 'వర్కింగ్ క్యాపిటల్ బఫర్ (తప్పనిసరి)',
    workingCapitalDesc: 'ప్రారంభ సరుకు, ముందస్తు అద్దె మరియు నిర్వహణ కోసం నగదు నిల్వ.',
    competitorsFilter: 'పోటీదారులు',
    selectedOperatingSite: 'ఎంచుకున్న వ్యాపార స్థలం',
    recommendedAlternativeSite: 'సిఫార్సు చేయబడిన ప్రత్యామ్నాయ స్థలం',
    competingOutlets: 'పోటీ అవుట్‌లెట్లు',
    complementaryAnchors: 'గ్రాహక ఆకర్షణ కేంద్రాలు',
    competitorsNearby: 'సమీపంలోని పోటీదారులు',
    outletsUnit: 'పరిధిలోని దుకాణాలు',
    demandSignals: 'నెలవారీ రద్దీ సాంద్రత',
    perMonth: 'సందర్శకులు / నెల',
    customerColonies: 'కస్టమర్ పరిసర ప్రాంతాలు',
    nearbyAnchors: 'సమీప రద్దీ కేంద్రాలు',
    sensitivityResilienceAnalysis: 'సున్నితత్వం మరియు తట్టుకునే శక్తి ఒత్తిడి పరీక్ష',
    whatIfThingsGoWrong: '4. అనుకోని నష్టాలు ఎదురైతే?',
    resetScenario: 'రీసెట్ చేయండి',
    salesDecrease: 'అమ్మకాల తగ్గుదల (రోజువారీ ఆదాయంలో % తగ్గుదల)',
    operatingCostsIncrease: 'నిర్వహణ ఖర్చుల పెరుగుదల (అద్దె, బిల్లులలో % పెరుగుదల)',
    rawMaterialCost: 'ముడి సరుకుల ధరల పెరుగుదల (% ధర పెరుగుదల)',
    scenarioStressComparison: 'ఒత్తిడి పరిణామాల పోలిక',
    realTimeRecalculation: 'రియల్ టైమ్ కచ్చితమైన పునఃపరిశీలన',
    financialParameter: 'ఆర్థిక అంశం',
    normalBaseline: 'సాధారణ అంచనా',
    stressedScenario: 'ప్రతికూల పరిస్థితి',
    impactVariance: 'ప్రభావం / మార్పు',
    monthlyRevenueParam: 'నెలవారీ స్థూల ఆదాయం',
    operatingExpensesParam: 'మొత్తం నిర్వహణ ఖర్చులు',
    monthlySurplusParam: 'నికర నెలవారీ నగదు మిగులు',
    bankLoanRepaymentParam: 'బ్యాంకు రుణ చెల్లింపు (ఈఎంఐ)',
    debtCoverageSafetyParam: 'రుణ చెల్లింపు భద్రత (DSCR)',
    scenarioDiagnosis: 'పరిస్థితి విశ్లేషణ:',
    sensitivityDisclaimer: 'ఒత్తిడి అనుకరణలు బ్యాంకింగ్ సూత్రాల ప్రకారం లెక్కించబడతాయి. మేము ఎప్పుడూ లాభాలకు కల్పిత హామీలు ఇవ్వము.',
    step5Message: 'అన్ని 5 సాధ్యాసాధ్యాల దశలు పూర్తయ్యాయి',
    dossierGenerationComplete: 'బ్యాంకు సమర్పణకు వ్యాపార ప్రణాళిక సిద్ధమైంది',
    bankReadyDossierDesc: 'బ్యాంకు సమర్పణ, ముద్రా/PMEGP దరఖాస్తులు మరియు వ్యక్తిగత సమీక్ష కోసం పూర్తి సాధ్యాసాధ్యాల నివేదిక సిద్ధంగా ఉంది.',
    downloadPrintPlan: 'ప్రింట్ / పీడీఎఫ్ సేవ్ చేయండి',
    startAnotherAnalysisBtn: 'మరొక విశ్లేషణ ప్రారంభించండి',
    officialBusinessDossier: 'ప్రవీరక్ సమగ్ర వ్యాపార సాధ్యాసాధ్యాల నివేదిక',
    dossierRef: 'నివేదిక సంఖ్య:',
    dateOfAppraisal: 'విశ్లేషణ తేదీ:',
    statusLabel: 'స్థితి:',
    verifiedAnalysis: 'విశ్లేషణ పూర్తయింది & అంచనా వేయబడింది',
    executiveSummary: 'కార్యనిర్వాహక సారాంశం మరియు విశ్లేషణ తీర్పు',
    marketOutlook: 'మార్కెట్ మరియు జనాభా వివరాలు',
    financialFeasibilitySchedule: 'కచ్చితమైన ఆర్థిక ప్రణాళిక',
    matchedGovtScheme: 'ప్రభుత్వ పథకాల మద్దతు మరియు రాయితీలు',
    actionPlanNextSteps: 'తక్షణ కార్యాచరణ ప్రణాళిక మరియు మైలురాళ్ళు',
    listen: 'వినండి',
    stop: 'ఆపండి',
    askEngineFooter: 'ప్రవీరక్ సందర్భోచిత కచ్చితమైన మార్గదర్శకత్వాన్ని అందిస్తుంది. మేము ఎప్పుడూ ఊహాజనిత సలహాలు ఇవ్వము.',
    askInputPlaceholder: 'ఈ వ్యాపారం, లాభాల మార్జిన్, లైసెన్సులు లేదా పోటీ గురించి ఏదైనా ప్రశ్న అడగండి...',
    contextGroundedAdvisory: 'సందర్భోచిత సలహా సేవ',
    suggestedQuestionsLabel: 'సూచించిన ప్రశ్నలు',
    askAboutAnalysis: 'ప్రవీరక్ AI సలహాదారుని అడగండి',

    // Additional UI & Table Keys
    nextStepMapMsg: 'ఓపెన్‌స్ట్రీట్‌మ్యాప్ ప్రాదేశిక పొరలను అన్వేషించండి మరియు ప్రత్యామ్నాయ స్థానం ఎక్కువ లాభదాయకతను ఇస్తుందో లేదో చూడండి.',
    nextStepMapCta: 'మార్కెట్ మ్యాప్ చూడండి',
    nextStepFinMsg: 'ఇప్పుడు మీరు స్థానం, రద్దీ మరియు పోటీ అంచనాలను సమీక్షించిన తర్వాత, మీ పెట్టుబడి యంత్రాలు మరియు రుణ వాయిదాలను కవర్ చేస్తుందో లేదో అంచనా వేయండి.',
    nextStepFinCta: 'ఆర్థిక సాధ్యాసాధ్యాలను తనిఖీ చేయండి',
    nextStepStressMsg: 'బ్యాంకు రుణాల కోసం దరఖాస్తు చేసుకునే ముందు కస్టమర్ల డిమాండ్ 20% తగ్గితే ఏమి జరుగుతుందో తెలుసుకోండి.',
    nextStepStressCta: 'ఆర్థిక ఒడిదుడుకుల పరీక్ష (ఒత్తిడి పరీక్ష)',
    nextStepSchemesMsg: 'కేంద్ర & రాష్ట్ర ప్రభుత్వ పథకాలు (PMEGP, ముద్రా, CGTMSE) రాయితీలు లేదా పూచీకత్తు లేని రుణాలను ఎలా అందించగలవో తనిఖీ చేయండి.',
    nextStepSchemesCta: 'ఆర్థిక పథకాలు & లైసెన్సులు చూడండి',
    matchedSchemesSub: 'అవసరమైన రుణ పరిమాణం మరియు ప్రమోటర్ పెట్టుబడి ఆధారంగా సరిపోలిన పథకాలు.',
    statutoryChecklistSub: 'అవసరమైన లైసెన్సులు, రిజిస్ట్రేషన్లు మరియు అధికారిక ప్రభుత్వ పోర్టల్స్.',
    tableComponent: 'విభాగం',
    tableAmount: 'మొత్తం (రూపాయలు)',
    tableShare: 'వాటా (%)',
    tableNotes: 'అండర్‌రైటింగ్ గమనికలు',
    equityNote: 'కనీస 10% సొంత పెట్టుబడి నిబంధనను సంతృప్తిపరుస్తుంది',
    debtNote: 'ప్రాధాన్యతా రంగ పూచీకత్తు లేని రుణ గ్యారెంటీకి అర్హత',
    capexBufferNote: '3 నెలల వర్కింగ్ క్యాపిటల్ రిజర్వ్‌తో సహా',
    fixedEmiNote: 'ప్రామాణిక రేటు @ 9.5% 5 సంవత్సరాల కాలపరిమితికి',
    transitCorridors: 'రవాణా మరియు రాకపోకల మార్గాలు',
    dossierPlatformDesc: 'వ్యాపార మూల్యాంకనం మరియు బ్యాంక్ రుణ మంజూరు కోసం రూపొందించబడింది.',
    simFootfallCompetition: 'తక్కువ పాదచారుల రద్దీ లేదా స్థానిక ధరల పోటీని అనుకరిస్తుంది.',
    simOpexInflation: 'అద్దె పెంపు, విద్యుత్ బిల్లులు లేదా జీతాల పెరుగుదలను అనుకరిస్తుంది.',
    simRawMaterialInflation: 'ముడి సరుకుల ధరల (పిండి, నూనె, పాలు, ఇంధనం) పెరుగుదలను అనుకరిస్తుంది.',
    fixedObligation: 'స్థిరమైన చెల్లింపు',
    resilientUnderShock: 'ప్రమాదాలను తట్టుకోగలదు',
    degradedTo: 'కు పడిపోయింది',
    marketMapTitle: 'రియల్ మార్కెట్ మ్యాప్ & స్థానిక విశ్లేషణ',
    geographicCatchmentAround: 'చుట్టుపక్కల భౌగోళిక పరిధి',
    allLayers: 'అన్ని లేయర్లు',
    anchorsFilter: 'ఆధార సంస్థలు',
    demandHubsFilter: 'డిమాండ్ కేంద్రాలు',
    proposedBusinessSite: 'ప్రతిపాదిత వ్యాపార స్థలం',
    alternativeLocationMarker: 'ప్రత్యామ్నాయ స్థలం',
    geoCatchmentBadge: 'ధృవీకరించదగిన భౌగోళిక పరిధి',
    nonGoogleHeuristicNotice: 'నాన్-గూగుల్ సూచికలు ప్రామాణిక బెంచ్‌మార్క్‌లను DEMO / ESTIMATED DATA గా ప్రదర్శిస్తాయి.',
    distanceFromSite: 'వ్యాపార స్థలం నుండి దూరం',
    dataOrigin: 'డేటా మూలం:',
    potentialFitGain: 'సాధ్యమయ్యే అదనపు స్కోరు:',
    pointsLabel: 'పాయింట్లు',
    activeBadge: 'ప్రస్తుతం',
    locationFitUnit: '/ 100 స్థల అనుకూలత',
    whyAlternativeBetter: 'ఈ ప్రత్యామ్నాయ స్థలం ఎందుకు మెరుగైనది:',
    footfallAdvantage: 'పాదచారుల రద్దీ ప్రయోజనం',
    footfallAdvantageSub: 'స్థిరమైన పాదచారుల రాకపోకలు.',
    commercialLeaseRent: 'వాణిజ్య లీజు అద్దె',
    commercialRentSub: 'నెలవారీ నికర మిగులును నేరుగా పెంచుతుంది.',
    competitorDensity: 'పోటీదారుల సాంద్రత',
    competitorDensitySub: 'వేగంగా కస్టమర్లను ఆకర్షించవచ్చు.',
    adoptingLocationNotice: 'ఈ స్థలాన్ని ఎంచుకోవడం ద్వారా మీ ఆర్థిక ప్రణాళిక, ఆదాయ అంచనాలు మరియు రుణ భద్రత తక్షణమే నవీకరించబడతాయి.',
    adoptedClickRevert: 'ఎంచుకోబడింది (తిరిగి మార్చడానికి క్లిక్ చేయండి)',
    higherFitBadge: 'మరింత అనుకూలం',
    noActiveAnalysisTitle: 'యాక్టివ్ వ్యాపార విశ్లేషణ ఏదీ లేదు',
    noActiveAnalysisDesc: 'మీ వ్యాపార వివరాలతో ఈ ఎక్స్‌ప్లోరర్‌ను చూడటానికి కొత్త విశ్లేషణను ప్రారంభించండి.',
    startNewAnalysisArrow: 'కొత్త విశ్లేషణ ప్రారంభించండి →',
    exploreHubDesc: 'మార్కెట్, ఫైనాన్స్, రిస్క్ మరియు అనుమతుల మాడ్యూళ్లను అన్వేషించండి.',
    growExistingDesc: 'మీరు ఇప్పటికే నడుపుతున్న వ్యాపార విస్తరణను ప్లాన్ చేయండి.',
    aiAdvisorThinking: 'మీ వ్యాపార డేటాను విశ్లేషిస్తోంది...',
    aiAdvisorPoweredBy: 'ప్రవీరక్ సంభాషణా AI ఇంజిన్ ద్వారా ఆధారితం',
    maxSubsidyLabel: 'గరిష్ట సబ్సిడీ:',
    maxLimitLabel: 'గరిష్ట పరిమితి:',
    stepLabel: 'దశ',
    askPravirakButton: 'ప్రవీరక్ అడగండి',
    closeChat: 'చాట్ మూసివేయండి',
    clearConversation: 'చాట్ క్లియర్ చేయండి',
    chatWelcome: 'మీ వ్యాపార ఆలోచన, రుణ పథకాలు, మార్కెట్ లేదా రిస్క్‌ల గురించి ఏదైనా ప్రశ్న లేదా సందేహం అడగండి.',
    chatDisclaimer: 'ధృవీకరించబడిన బ్యాంకింగ్ & మార్కెట్ విజ్ఞానంతో సమాధానాలు మీ వ్యాపారానికి అనుకూలంగా అందించబడతాయి.',
    chatPlaceholder: 'మీ వ్యాపారం గురించి ప్రశ్న లేదా సందేహాన్ని అడగండి...',
    askFloatingTooltip: 'ప్రవీరక్ AI సలహాదారుని అడగండి',
    evidenceFootfallTicket: 'పాదచారుల సంఖ్య & సగటు బిల్లు',
    opexIncludesSub: 'ముడి సరుకులు, విద్యుత్ & సిబ్బంది ఖర్చులు',
    retainedNetProfitSub: 'వ్యవస్థాపకుడి నికర లాభం',
    itemsCount: 'వస్తువులు',

    // Administrative Hierarchy & Government Scheme Loan Structure
    districtLabel: 'జిల్లా',
    blockLabel: 'మండలం / బ్లాక్',
    villageLabel: 'గ్రామం / గ్రామ పంచాయితీ',
    projectCostCardTitle: 'ప్రాజెక్ట్ వ్యయం',
    projectCostCardDesc: 'అందుబాటులో ఉన్న మార్జిన్ / 0.10 గా లెక్కించబడింది (10% వ్యవస్థాపక వాటా)',
    maxLoanCardTitle: 'గరిష్ట రుణం',
    maxLoanCardDesc: 'ప్రాజెక్ట్ వ్యయంలో 90% వరకు, పథకం గరిష్ట పరిమితికి లోబడి ఉంటుంది',
    ownContributionCardTitle: 'స్వంత పెట్టుబడి',
    ownContributionCardDesc: 'ప్రాథమిక మార్జిన్ + పథకం పరిమితి వల్ల అవసరమైన అదనపు వాటా',
    schemeSelectedTitle: 'ఎంపిక చేయబడిన పథకం',
    schemeRateLabel: 'వడ్డీ రేటు',
    schemeTenureLabel: 'మొత్తం కాలపరిమితి',
    schemeMoratoriumLabel: 'మొరటోరియం కాలం',
    schemeWhySelected: 'ఎంపికకు కారణం',
    capNoticeTitle: 'పథకం రుణ పరిమితి వర్తించబడింది',
    capNoticeDesc: 'లెక్కించిన 90% రుణం పథకం గరిష్ట పరిమితిని మించిపోయింది. మిగిలిన అదనపు వాటాను వ్యవస్థాపకుడే సమకూర్చాలి.',
    shortfallAmountLabel: 'అదనపు సొంత పెట్టుబడి అవసరం (Shortfall)',
    totalRequiredContribution: 'మొత్తం అవసరమైన స్వంత పెట్టుబడి',
    beyondLimitsNoticeTitle: 'పథకం పరిమితులకు మించిపోయింది',
    scheduleTableTitle: 'త్రైమాసిక రీపేమెంట్ షెడ్యూల్',
    scheduleTableSubtitle: 'ప్రారంభ నిల్వ, వడ్డీ, అసలు మరియు ముగింపు నిల్వల త్రైమాసిక వివరాలు.',
    thQuarter: 'త్రైమాసికం (Quarter)',
    thOpeningBalance: 'ప్రారంభ నిల్వ',
    thInterest: 'వడ్డీ',
    thPrincipal: 'అసలు',
    thTotalPayment: 'మొత్తం చెల్లింపు',
    thClosingBalance: 'ముగింపు నిల్వ',
    moratoriumBadge: 'మొరటోరియం (వడ్డీ మాత్రమే)',
    totalsRowLabel: 'మొత్తం రీపేమెంట్',
    assumptionsTitle: 'ఇంజిన్ ఊహలు మరియు ఎంపికలు',
    moratoriumToggleLabel: 'మొరటోరియం వడ్డీ నిర్వహణ',
    moratoriumServiced: 'సర్వీస్ చేయబడింది (వడ్డీ మాత్రమే చెల్లింపు)',
    moratoriumCapitalised: 'మూలధనం చేయబడింది (అసలుకు జోడించబడింది)',
    downloadCsvButton: 'షెడ్యూల్ డౌన్‌లోడ్ చేయండి (CSV)',
    ownCapitalMarginLabel: 'మీ స్వంత మూలధనం (మార్జిన్ మనీ)',
    notAvailableForAddress: 'ఈ చిరునామాకు అందుబాటులో లేదు',
    govtSchemeLoanStructureTitle: 'ప్రభుత్వ పథకం రుణ నిర్మాణం',
    govtSchemeLoanStructureDesc: 'చట్టబద్ధమైన 10% వ్యవస్థాపక సహకారం మరియు ప్రాధాన్యత రంగ రుణ నిబంధనల ఆధారంగా రూపొందించిన రుణ నిర్మాణం.',
    howCalculatedTitle: 'ఇది ఎలా లెక్కించబడింది',
    shortfallAlertTitle: 'మూలధన కొరత (Shortfall) గుర్తించబడింది',
    fullyFundedTitle: 'వ్యవస్థాపక వాటా పూర్తిగా సమకూరింది',
    maxSupportableProjectCostTitle: 'గరిష్టంగా మద్దతు ఇవ్వగల ప్రాజెక్ట్ పరిమాణం',
    threeOptionsToProceed: 'మూలధన కొరతను అధిగమించడానికి 3 సిఫార్సు చేసిన మార్గాలు',
    optionAddCapitalTitle: '1. అదనపు మూలధనాన్ని చేర్చండి',
    optionScaleDownTitle: '2. ప్రారంభ ప్రాజెక్ట్ పరిమాణాన్ని తగ్గించండి',
    optionPhasedTitle: '3. దశలవారీగా ప్రారంభించండి',

    // Data Provenance
    provenanceLegendTitle: 'డేటా మూలం (Provenance)',
    badgeMeasured: 'వాస్తవికమైనది (Measured)',
    badgeEstimated: 'అంచనా (Estimated)',
    badgeAi: 'AI',
    provenanceMeasuredDesc: 'నిజమైన API / OSM',
    provenanceEstimatedDesc: 'మోడల్ అంచనా / బెంచ్‌మార్క్',
    provenanceAiDesc: 'LLM విశ్లేషణ',

    // Local Feasibility Report
    localFeasibilityReportTitle: 'స్థానిక సాధ్యాసాధ్యాల నివేదిక (Local Feasibility Report)',
    localFeasibilityReportSubtitle: 'ప్రాంతీయ క్యాచ్‌మెంట్ విశ్లేషణ మరియు వ్యాపార సాధ్యత అంచనా.',
    marketReachTitle: '1. మార్కెట్ పరిధి & క్యాచ్‌మెంట్',
    opportunityAnalysisTitle: '2. అవకాశాల విశ్లేషణ',
    swotTitle: '3. SWOT విశ్లేషణ',
    threatsTitle: '4. వ్యాపార ముప్పులు & పరిష్కారాలు',
    competitorMapTitle: '5. పోటీదారుల మ్యాప్ (OpenStreetMap)',
    pricingGuidanceTitle: '6. ధరల మార్గదర్శకత్వం',
    swotStrengths: 'బలాలు (Strengths)',
    swotWeaknesses: 'బలహీనతలు (Weaknesses)',
    swotOpportunities: 'అవకాశాలు (Opportunities)',
    swotThreats: 'ముప్పులు (Threats)',
    threatSupplyChain: 'సరఫరా గొలుసు ముప్పు',
    threatSeasonal: 'సీజనల్ ముప్పు',
    threatSingleBuyer: 'కస్టమర్ ఆధారిత ముప్పు',
    threatOther: 'ఇతర కార్యాచరణ ముప్పు',
    pricingGuidanceNoteLabel: 'ధరల మార్గదర్శక సూచన',
    competitorDensityNotice: 'జనాభా గణాంకాలు అందుబాటులో లేనందున ప్రతి 10,000 జనాభాకు పోటీ సాంద్రత నిలిపివేయబడింది',
    loadingFeasibility: 'స్థానిక సాధ్యాసాధ్యాల నివేదిక రూపొందించబడుతోంది...',
    errorFeasibility: 'లైవ్ నివేదికను రూపొందించడంలో విఫలమైంది. ఖచ్చితమైన టెంప్లేట్ చూపబడుతోంది.',
    retryFeasibility: 'మళ్లీ ప్రయత్నించండి',
    channelsLabel: 'ప్రధాన పంపిణీ మార్గాలు',
    catchmentRadiusLabel: 'క్యాచ్‌మెంట్ పరిధి',
    competitorsIn5km: '5 కి.మీ పరిధిలోని పోటీదారులు',
    competitorsIn10km: '10 కి.మీ పరిధిలోని పోటీదారులు',
    densityPer10kLabel: 'ప్రతి 10,000 జనాభాకు సాంద్రత',
    aiReportBadge: 'AI విశ్లేషణ',
    templateReportBadge: 'ఖచ్చితమైన టెంప్లేట్',

    // Audit Additions - Shell & Navigation
    browsingAsGuestNotice: 'అతిథిగా బ్రౌజ్ చేస్తున్నారు · విశ్లేషణలు ఈ పరికరంలో మాత్రమే భద్రపరచబడతాయి',
    platformFooterSub: 'భారతీయ వ్యవస్థాపకుల కోసం AI-ఆధారిత వ్యాపార నిర్ణయ వేదిక',
    platformEthos: 'లాభాన్ని ఎప్పుడూ హామీ ఇవ్వవద్దు. ఊహలకు తావులేని ఖచ్చితమైన ఆర్థిక గణన.',
    platformTaglineBuiltFor: 'భారతీయ వ్యవస్థాపకుల కోసం నిర్మించబడింది • నిష్పక్షపాత ప్రజా సాధ్యాసాధ్యాల మోడలింగ్',
    ariaNotifications: 'నోటిఫికేషన్‌లు',
    ariaOpenNav: 'నావిగేషన్ మెనూ తెరవండి',
    guestUser: 'అతిథి',

    // Help Modal
    helpModalTitle: 'ప్రవీరక్ ఎలా పనిచేస్తుంది',
    helpPoint1Title: '1. వ్యాపార నిర్ణయ వేదిక:',
    helpPoint1Desc: 'ప్రవీరక్ సాధారణ చాట్‌బాట్ కాదు. ఇది స్థానిక మార్కెట్ పోటీ, స్థల అనుకూలత, రుణ చెల్లింపు భద్రత మరియు ఒత్తిడి పరీక్ష పరిస్థితులపై ఖచ్చితమైన విశ్లేషణను అందిస్తుంది.',
    helpPoint2Title: '2. ఖచ్చితమైన అంకగణితం:',
    helpPoint2Desc: 'రుణం, ఈఎంఐ, పెట్టుబడి మరియు డిఎస్‌సిఆర్ గణాంకాలన్నీ అధికారిక బ్యాంకింగ్ సూత్రాల ద్వారా లెక్కించబడతాయి. AI కేవలం ఫలితాలను సులభమైన భాషలో వివరించడానికి మాత్రమే ఉపయోగించబడుతుంది.',
    helpPoint3Title: '3. ప్రభుత్వ ఆర్థిక సహాయం:',
    helpPoint3Desc: 'వడ్డీ భారాన్ని తగ్గించడానికి మేము PMEGP, PM MUDRA మరియు CGTMSE వంటి అధికారిక ప్రభుత్వ పథకాల అర్హతను స్వయంచాలకంగా తనిఖీ చేస్తాము.',
    helpPoint4Title: '4. నష్టభయాల పట్ల జాగ్రత్త:',
    helpPoint4Desc: 'మేము ఎప్పుడూ లాభాలకు హామీ ఇవ్వము. ప్రతి సిఫార్సు డేటా మూలం మరియు విశ్వసనీయత స్థాయిని స్పష్టంగా తెలియజేస్తుంది.',
    helpPoint5Title: '5. ఎక్స్‌ప్లోర్ హబ్:',
    helpPoint5Desc: 'విశ్లేషణ పూర్తయిన తర్వాత, మార్కెట్, ఫైనాన్స్, కార్యకలాపాలు, నష్టాలు, లైసెన్సులు మరియు వృద్ధి అవకాశాలను లోతుగా తెలుసుకోవడానికి ఎక్స్‌ప్లోర్ హబ్‌ను ఉపయోగించండి - లేదా ప్రవీరక్‌ను నేరుగా అడగండి.',

    // Explorer Descriptions
    exploreMarketDesc: 'స్థానిక డిమాండ్ మరియు మార్కెట్లు',
    exploreFinanceDesc: 'పథకాలు, రుణాలు మరియు అర్హత',
    exploreBusinessDesc: 'వ్యాపార అవకాశాలు మరియు పోలికలు',
    exploreOperationsDesc: 'సరఫరాదారులు, మౌలిక సదుపాయాలు మరియు లాజిస్టిక్స్',
    exploreRiskDesc: 'నష్టాలు, కాలానుగుణ మార్పులు మరియు ఒత్తిడి పరిస్థితులు',
    exploreComplianceDesc: 'లైసెన్సులు, రిజిస్ట్రేషన్లు మరియు అనుమతులు',
    exploreGrowthDesc: 'వ్యాపార విస్తరణ మరియు కొత్త అవకాశాలు',
    exploreEvidenceDesc: 'డేటా వనరులు మరియు సాక్ష్యాల నాణ్యత',
    exploreAskDesc: 'ప్రస్తుత విశ్లేషణపై సందేహాలు',

    // Final Business Plan & Scheme Loan Breakdown
    identifiedCompetitorsOsm: 'గుర్తించిన పోటీదారులు (OpenStreetMap):',
    promoterCapitalM: 'ప్రమోటర్ పెట్టుబడి (M):',
    planProjectCostB: 'ప్రణాళికా ప్రాజెక్ట్ వ్యయం (B):',
    requiredMarginPercent: '10% తప్పనిసరి మార్జిన్ (0.10×B):',
    maxSupportableM: 'గరిష్టంగా మద్దతు ఇవ్వగల వ్యయం (M / 0.10):',
    appliedCaseLabel: 'వర్తించిన నిబంధన:',
    statutorySchemeRulesApplied: 'వర్తించిన చట్టబద్ధమైన పథక నిబంధనలు మరియు పరిమితులు:',
    platformEnterpriseDecisionPlatform: 'ప్రవీరక్ ఎంటర్‌ప్రైజ్ నిర్ణయ వేదిక',
    planCopiedAlert: 'షేర్ చేయడానికి వ్యాపార ప్రణాళిక సారాంశం క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది!',
    shareSummaryTitle: 'సారాంశాన్ని పంచుకోండి',
    observationsLabel: 'గమనికలు:',
    selectionReasonLabel: 'ఎంపిక కారణం:',
    footfallInRadialCatchment: '5 కి.మీ & 10 కి.మీ పరిధిలో. అంచనా వేసిన నెలవారీ కస్టమర్ రద్దీ',

    // Local Feasibility View
    loadingFeasibilityScanning: 'OpenStreetMap ద్వారా 5 కి.మీ & 10 కి.మీ ప్రాంతాన్ని స్కాన్ చేస్తూ బహుముఖ సాధ్యాసాధ్యాల నివేదికను రూపొందిస్తున్నాము.',
    osm5kmScan: 'OpenStreetMap 5 కి.మీ విస్తీర్ణ స్కాన్',
    expanded10kmCatchment: 'విస్తరించిన 10 కి.మీ వ్యాపార ప్రాంతం',
    calculatedAgainstPop: 'ధృవీకరించబడిన జనాభా ఆధారంగా లెక్కించబడింది',
    mitigationStrategyLabel: 'పరిష్కార వ్యూహం:',
    withinPrimary15kmZone: 'యొక్క ప్రధాన 5 కి.మీ & 10 కి.మీ పరిధిలో',
    competitorNameHeader: 'పోటీదారు పేరు',
    distanceFromSiteHeader: 'వ్యాపార స్థలం నుండి దూరం',
    categoryTagHeader: 'వర్గం ట్యాగ్',
    dataProvenanceHeader: 'డేటా మూలం',
    feasibilityAssumptionsTitle: 'సాధ్యాసాధ్యాల మోడల్ ఊహలు:',

    // Existing Business Flow
    includesStockRentWages: 'సరుకుల కొనుగోలు, అద్దె మరియు జీతాలు కలిపి',
    enterZeroIfDebtFree: 'ప్రస్తుతం రుణం లేకపోతే 0 నమోదు చేయండి',
    adjustFinancialInputs: 'ఆర్థిక వివరాలను సవరించండి',
    expansionRequiresOutlay: 'ఈ విస్తరణను ప్రారంభించడానికి అవసరమైన పెట్టుబడి:',
    afterDebtServicingSurplus: 'రుణ వాయిదాలు చెల్లించిన తర్వాత, కొత్త నెలవారీ నికర మిగులు నగదు:',
    currentMonthlyNetProfitLabel: 'ప్రస్తుత నెలవారీ నికర లాభం',
    monthlyTurnoverLabel: 'నెలవారీ టర్నోవర్',
    expansionCapitalNeededLabel: 'విస్తరణకు అవసరమైన పెట్టుబడి',
    placeholderBusinessIdea: 'ఉదా. కిరాణా షాప్, దుస్తుల వ్యాపారం, బేకరీ',
    placeholderLocation: 'ఉదా. సిగ్రా, వారణాసి లేదా ఇందిరానగర్, బెంగళూరు',

    // Explorers & Dashboard
    whatShouldYouDoNext: 'మీరు తర్వాత ఏమి చేయాలి?',
    higherScoringNearbyArea: 'ఎక్కువ స్కోరు ఉన్న సమీప ప్రాంతం',
    scaleUpScenario15x: 'విస్తరణ పరిస్థితి (1.5 రెట్ల పెట్టుబడి)',
    alreadyRunningThisBusiness: 'ఇప్పటికే ఈ వ్యాపారం నడుపుతున్నారా?',
    executionMilestonesTitle: 'అమలు దశలు',
    comparableOpportunitiesTitle: 'సరిపోలే వ్యాపార అవకాశాలు',
    businessTypeHeader: 'వ్యాపార రకం',
    typicalCapexHeader: 'సాధారణ ప్రాజెక్ట్ ఖర్చు',
    typicalRevenueHeader: 'సాధారణ నెలవారీ ఆదాయం',
    typicalOpexHeader: 'సాధారణ నెలవారీ నిర్వహణ ఖర్చు',
    nearbyTransitContext: 'సమీప రవాణా మరియు వాణిజ్య వివరాలు',
    transitPointsTitle: 'రవాణా కేంద్రాలు',
    commercialHubsNearbyTitle: 'సమీప వాణిజ్య కేంద్రాలు',
    recommendedLoanAmountLabel: 'సిఫార్సు చేయబడిన రుణ మొత్తం',
    allMatchedSchemesTitle: 'సరిపోలిన అన్ని పథకాలు',
    identifiedRiskFactorsTitle: 'గుర్తించిన ప్రమాద అంశాలు',
    requiredLikelyLicensesTitle: 'తప్పనిసరి మరియు అవసరమైన లైసెన్సులు',
    implementationPlan306090: '30 / 60 / 90 రోజుల కార్యాచరణ ప్రణాళిక',
    provenanceDisciplineNote: 'డేటా క్రమశిక్షణ: ప్రతి కొలమానం దాని మూలాన్ని స్పష్టంగా చూపుతుంది (ధృవీకరించబడిన రిజిస్ట్రీ నుండి సేకరించబడింది, లెక్కల ద్వారా అంచనా వేయబడింది లేదా పబ్లిక్ సెన్సస్ బెంచ్‌మార్క్‌ల నుండి పొందబడింది).',
    readAnswerAloud: 'సమాధానాన్ని బిగ్గరగా చదవండి',
    backAriaLabel: 'వెనుకకు',
    askPravirakAriaLabel: 'ప్రవీరక్ చాట్‌బాట్‌ను అడగండి',
    closeChatAriaLabel: 'చాట్ మూసివేయండి',

    // Voice Input
    voiceInputStart: 'వాయిస్ ఇన్‌పుట్ ప్రారంభించండి',
    voiceInputStop: 'వినడం ఆపండి',
    voiceInputListening: 'వింటున్నారు...',
    voiceInputErrorPermission: 'మైక్రోఫోన్ అనుమతి నిరోధించబడింది. దయచేసి బ్రౌజర్‌లో అనుమతించండి.',
    voiceInputErrorNetwork: 'వాయిస్ గుర్తింపుకు ఇంటర్నెట్ అవసరం. దయచేసి నెట్‌వర్క్ తనిఖీ చేయండి.',
    voiceInputErrorGeneric: 'వాయిస్‌ను గుర్తించలేకపోయాము. దయచేసి మళ్ళీ మాట్లాడండి.',
    aiAnswerAttribution: 'AI రూపొందించిన వివరణ. సంఖ్యలు PRAVIRAK లెక్కల నుండి వస్తాయి.',
    voiceInputErrorServiceUnavailable: 'ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సేవ అందుబాటులో లేదు. దయచేసి నేరుగా టైప్ చేయండి.',

    // Plan Presentation Redesign
    decisionSummaryTitle: 'నిర్ణయ సారాంశం',
    oneSentenceReasonLabel: 'నిర్ణయం కారణం',
    keyFiguresTitle: 'ముఖ్య ఆర్థిక గణాంకాలు',
    projectCostLabel: 'ప్రాజెక్ట్ ఖర్చు',
    loanWithSchemeLabel: 'రుణం & పథకం',
    quarterlyPaymentLabel: 'మొరటోరియం తర్వాత మొదటి చెల్లింపు',
    afterMoratoriumLabel: 'మొరటోరియం తర్వాత',
    topReasonsTitle: 'టాప్ 3 సానుకూల కారణాలు',
    topRisksTitle: 'గమనించవలసిన టాప్ 3 ప్రమాదాలు',
    doThisFirstTitle: 'ముందుగా ఇది చేయండి',
    expandAll: 'అన్నీ విస్తరించండి',
    collapseAll: 'అన్నీ మూసివేయండి',
    shortPlan: 'సంక్షిప్త ప్రణాళిక',
    shortPlanDesc: 'సారాంశం & రుణ షెడ్యూల్ (గరిష్టంగా 2 పేజీలు)',
    fullPlan: 'పూర్తి ప్రణాళిక',
    fullPlanDesc: 'వివరణాత్మక అనుబంధంతో పూర్తి నివేదిక',
    showMore: 'మరిన్ని చూడండి',
    showLess: 'తక్కువ చూడండి',
    sectionMarketAndCompetitors: 'మార్కెట్ & పోటీదారులు',
    sectionOpportunities: 'అవకాశాలు & అనువైన విభాగాలు',
    sectionSwot: 'SWOT విశ్లేషణ',
    sectionThreats: 'కార్యాచరణ బెదిరింపులు & పరిష్కారాలు',
    sectionPricingGuidance: 'ధరల మార్గదర్శకత్వం',
    sectionLoanStructure: 'రుణ నిర్మాణం & త్రైమాసిక షెడ్యూల్',
    sectionBreakeven: 'బ్రేక్-ఈవెన్ & వర్కింగ్ క్యాపిటల్ బఫర్',
    sectionStressTests: 'స్ట్రెస్ టెస్ట్‌లు & సున్నితత్వ విశ్లేషణ',
    sectionHowCalculated: 'ఇది ఎలా లెక్కించబడింది',
    sectionNextSteps: 'కార్యాచరణ ప్రణాళిక & తదుపరి దశలు',
    dscrPlainExplanation: 'రుణ రక్షణ భద్రతా నిష్పత్తి (మిగులు vs ఈఎంఐ) — లాభాల నుండి రుణం తిరిగి చెల్లించే సామర్థ్యం',
    promoterEquityExplanation: 'ప్రమోటర్ వాటా (మార్జిన్ మనీ) — మీ స్వంత నగదు పెట్టుబడి',
    moratoriumExplanation: 'మొరటోరియం — అసలు ఈఎంఐ ప్రారంభానికి ముందు చెల్లింపు విరామం',

    // Repayment Schedule & Dossier Navigation
    firstPaymentAfterMoratorium: 'మొరటోరియం తర్వాత మొదటి చెల్లింపు',
    reducingPaymentNote: 'వడ్డీ తగ్గేకొద్దీ తర్వాతి త్రైమాసిక చెల్లింపులు తగ్గుతాయి',
    backToSummary: 'సారాంశానికి తిరిగి వెళ్లండి',
    viewFullSchedule: 'పూర్తి షెడ్యూల్ చూడండి ({n} త్రైమాసికాలు)',
    hideFullSchedule: 'పూర్తి షెడ్యూల్ దాచండి',
    expandAllYears: 'అన్ని సంవత్సరాలను విస్తరించండి',
    collapseAllYears: 'అన్ని సంవత్సరాలను కుదించండి',
    yearLabel: 'సంవత్సరం {y}',
    yearTotalPayment: 'వార్షిక మొత్తం చెల్లింపు',
    yearClosingBalance: 'ముగింపు నిల్వ',
    interestOnlyQuarters: 'వడ్డీ మాత్రమే చెల్లించే త్రైమాసికాలు',
    finalPayment: 'చివరి చెల్లింపు',
    totalInterest: 'మొత్తం వడ్డీ',
    totalRepaid: 'మొత్తం తిరిగి చెల్లించినది',
    compactSummaryTitle: 'రుణ చెల్లింపు సారాంశం',
    appendixScheduleTitle: 'అనుబంధం: పూర్తి త్రైమాసిక రుణ చెల్లింపు షెడ్యూల్',

    // Error & Progress & Map
    somethingWentWrong: 'ఏదో పొరపాటు జరిగింది',
    unexpectedErrorDesc: 'అనుకోని లోపం ఏర్పడింది. దయచేసి పేజీని రీఫ్రెష్ చేయండి లేదా డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి.',
    reloadPage: 'పేజీని మళ్లీ లోడ్ చేయండి',
    publicVerificationChecklist: 'పబ్లిక్ వెరిఫికేషన్ చెక్‌లిస్ట్',
    statusComplete: 'పూర్తయింది',
    statusProcessing: 'ప్రాసెస్ అవుతోంది...',
    proposedLocationTitle: 'ప్రతిపాదిత వ్యాపార నిర్వహణ స్థలం',
    typeLabel: 'రకం:',
    dataOriginLabel: 'డేటా మూలం:',
  }
};
