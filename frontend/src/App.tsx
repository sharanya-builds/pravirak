import React, { useMemo, useState } from 'react';
import {
  BusinessDecisionResult,
  BusinessInput,
  FinancialAnalysis,
  LocationData,
  SelectedLocation
} from './types';

import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageSelector } from './components/common/LanguageSelector';
import { ThemeToggle } from './components/common/ThemeToggle';
import { useBusinessStore } from './hooks/useBusinessStore';
import { SavedBusiness, reportApi } from './api/client';

import { LoginPage } from './components/auth/LoginPage';
import { AppShell } from './components/shell/AppShell';
import { PrimaryNavKey, ExplorerKey } from './components/shell/navigation';
import { SidePanelChatbot } from './components/chat/SidePanelChatbot';

import { LandingPage } from './components/modules/LandingPage';
import { NewBusinessFlow } from './components/modules/NewBusinessFlow';
import { ProgressIndicator } from './components/common/ProgressIndicator';
import { DecisionDashboard } from './components/modules/DecisionDashboard';
import { FinalBusinessPlan } from './components/modules/FinalBusinessPlan';
import { ExistingBusinessFlow } from './components/modules/ExistingBusinessFlow';
import { HomeDashboard } from './components/modules/HomeDashboard';
import { MyBusinesses } from './components/modules/MyBusinesses';
import { ReportsPage } from './components/modules/ReportsPage';

import { MarketExplorer } from './components/modules/explorers/MarketExplorer';
import { FinanceExplorer } from './components/modules/explorers/FinanceExplorer';
import { BusinessExplorer } from './components/modules/explorers/BusinessExplorer';
import { OperationsExplorer } from './components/modules/explorers/OperationsExplorer';
import { RiskExplorer } from './components/modules/explorers/RiskExplorer';
import { ComplianceExplorer } from './components/modules/explorers/ComplianceExplorer';
import { GrowthExplorer } from './components/modules/explorers/GrowthExplorer';
import { EvidenceExplorer } from './components/modules/explorers/EvidenceExplorer';
import { AskExplorer } from './components/modules/explorers/AskExplorer';

import { GOVERNMENT_SCHEMES } from './data/schemes';
import { computeFinancialAnalysis } from './engine/financialEngine';
import { synthesizeDecision } from './engine/decisionEngine';
import { analyzeLocationForBusiness } from './engine/locationAnalysisEngine';

import { HelpCircle, X, ShieldCheck } from 'lucide-react';

type AppView =
  | 'LANDING'
  | 'HOME'
  | 'MY_BUSINESSES'
  | 'REPORTS'
  | 'NEW_INPUT'
  | 'ANALYZING'
  | 'DECISION_DASHBOARD'
  | 'FINAL_PLAN'
  | 'EXISTING_BUSINESS'
  | `EXPLORE_${ExplorerKey}`;

const DEFAULT_LOCATION: SelectedLocation = {
  address: 'Madhapur Main Road, Hitec City, Hyderabad, Telangana - 500081',
  latitude: 17.4483,
  longitude: 78.3915,
  placeId: 'demo-madhapur-hyd',
  city: 'Hyderabad',
  state: 'Telangana',
  postalCode: '500081',
  source: 'DEMO_SAMPLE'
};

const DEFAULT_INPUT: BusinessInput = {
  businessIdea: 'I want to open a bakery and confectionery shop',
  category: 'bakery',
  location: DEFAULT_LOCATION,
  ownCapital: 150000,
  experience: 'Beginner (<1 yr)',
  existingSpace: 'Rented space',
  targetCustomers: 'General Public / Walk-ins',
  preferredScale: 'Small (Town/Zone)'
};

function AppShellRouter() {
  const { user, isGuest, isLoading, logout, continueAsGuest } = useAuth();
  const { language: currentLanguage, t } = useLanguage();
  const { businesses, isLoading: businessesLoading, saveBusiness } = useBusinessStore();

  const [currentView, setCurrentView] = useState<AppView>('LANDING');
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Active business state
  const [businessInput, setBusinessInput] = useState<BusinessInput>(DEFAULT_INPUT);
  const [activeBusinessDbId, setActiveBusinessDbId] = useState<number | null>(null);
  const [isAlternativeAdopted, setIsAlternativeAdopted] = useState(false);
  const [hasActiveAnalysis, setHasActiveAnalysis] = useState(false);

  // Derive base location analysis from the current business input
  const baseLocation: LocationData = useMemo(() => {
    return analyzeLocationForBusiness(businessInput.businessIdea, businessInput.location);
  }, [businessInput.businessIdea, businessInput.location]);

  const activeLocation: LocationData = useMemo(() => {
    if (isAlternativeAdopted && baseLocation.alternativeLocation) {
      return {
        ...baseLocation,
        areaName: baseLocation.alternativeLocation.areaName,
        score: baseLocation.alternativeLocation.score,
        lat: baseLocation.alternativeLocation.lat,
        lng: baseLocation.alternativeLocation.lng,
        competitorsNearbyCount: Math.max(3, baseLocation.competitorsNearbyCount - 8),
        footfallMonthly: Math.round(
          baseLocation.footfallMonthly * (1 + baseLocation.alternativeLocation.footfallGainPct / 100)
        ),
        demandSignals: [
          'High accessibility with 34% lower commercial deposit overheads',
          ...baseLocation.demandSignals
        ]
      };
    }
    return baseLocation;
  }, [baseLocation, isAlternativeAdopted]);

  const financials: FinancialAnalysis = useMemo(() => {
    const capexAdjust = isAlternativeAdopted ? 620000 : undefined;
    return computeFinancialAnalysis(
      businessInput.businessIdea,
      businessInput.ownCapital,
      businessInput.preferredScale,
      capexAdjust
    );
  }, [businessInput, isAlternativeAdopted]);

  const decisionResult: BusinessDecisionResult = useMemo(() => {
    return synthesizeDecision(businessInput, activeLocation, financials, currentLanguage);
  }, [businessInput, activeLocation, financials, currentLanguage]);

  const schemes = GOVERNMENT_SCHEMES;

  // Not authenticated and not guest -> show login
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !isGuest) {
    return (
      <LoginPage
        onAuthenticated={() => setCurrentView('HOME')}
        onContinueAsGuest={() => {
          continueAsGuest();
          setCurrentView('LANDING');
        }}
      />
    );
  }

  // --- Actions ---
  const handleStartNew = () => {
    setIsAlternativeAdopted(false);
    setActiveBusinessDbId(null);
    setCurrentView('NEW_INPUT');
  };

  const handleSelectPreset = (idea: string, location: SelectedLocation, capital: number) => {
    setIsAlternativeAdopted(false);
    setActiveBusinessDbId(null);
    setBusinessInput((prev) => ({
      ...prev,
      businessIdea: idea,
      category: idea,
      location,
      ownCapital: capital
    }));
    setCurrentView('ANALYZING');
  };

  const handleFormSubmit = (input: BusinessInput) => {
    setIsAlternativeAdopted(false);
    setBusinessInput(input);
    setCurrentView('ANALYZING');
  };

  const handleAnalysisComplete = async () => {
    setHasActiveAnalysis(true);
    setCurrentView('DECISION_DASHBOARD');

    // Auto-save to My Businesses
    try {
      const saved = await saveBusiness({
        id: activeBusinessDbId ?? undefined,
        businessIdea: businessInput.businessIdea,
        category: businessInput.category,
        locationId: activeLocation.id,
        locationName: `${activeLocation.areaName}, ${activeLocation.city}`,
        ownCapital: businessInput.ownCapital,
        status: 'Analysis Complete',
        decision: decisionResult.decision,
        snapshot: { input: businessInput, location: activeLocation, financials, decisionResult }
      });
      setActiveBusinessDbId(saved.id);
    } catch {
      // Non-fatal: analysis still shows even if save fails (e.g. offline)
    }
  };

  const toggleAlternativeLocation = () => setIsAlternativeAdopted((prev) => !prev);

  const openSavedBusiness = (business: SavedBusiness) => {
    const snapshot = business.snapshot;
    if (snapshot?.input) {
      setBusinessInput(snapshot.input);
      setIsAlternativeAdopted(false);
      setActiveBusinessDbId(business.id);
      setHasActiveAnalysis(true);
      setCurrentView('DECISION_DASHBOARD');
    }
  };

  const handleViewFullDossier = async () => {
    setCurrentView('FINAL_PLAN');
    if (user && activeBusinessDbId) {
      try {
        await reportApi.create({
          businessId: activeBusinessDbId,
          title: `${businessInput.businessIdea} — Business Project Report`
        });
      } catch {
        // ignore report logging failures
      }
    }
  };

  const handleOpenExplorer = (key: ExplorerKey) => setCurrentView(`EXPLORE_${key}` as AppView);

  const activeAnalysis = hasActiveAnalysis
    ? { input: businessInput, location: activeLocation, financials, decisionResult }
    : null;

  const navForView: PrimaryNavKey | null = (() => {
    if (currentView === 'HOME') return 'HOME';
    if (currentView === 'MY_BUSINESSES') return 'MY_BUSINESSES';
    if (currentView === 'REPORTS') return 'REPORTS';
    if (['NEW_INPUT', 'ANALYZING', 'DECISION_DASHBOARD', 'FINAL_PLAN'].includes(currentView)) return 'NEW_ANALYSIS';
    return null;
  })();

  const businessContext =
    currentView === 'DECISION_DASHBOARD' || currentView === 'FINAL_PLAN' || currentView.startsWith('EXPLORE_')
      ? hasActiveAnalysis
        ? { businessIdea: businessInput.businessIdea, locationName: `${activeLocation.areaName}, ${activeLocation.city}` }
        : null
      : null;

  // Landing page (guests, before choosing) is shown with a minimal branded header for a marketing feel
  if (currentView === 'LANDING') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-950 flex items-center justify-center text-amber-400 border border-indigo-900">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black tracking-tight text-slate-900 leading-none">PRAVIRAK</div>
                <div className="text-[10px] text-slate-500 leading-none mt-0.5">Ideas to Livelihoods</div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <LanguageSelector variant="header" />
              {user ? (
                <button
                  onClick={() => setCurrentView('HOME')}
                  className="text-xs font-extrabold text-white bg-[#1E3A8A] hover:bg-[#1E40AF] px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {t.navGoToDashboard || 'Go to Dashboard'}
                </button>
              ) : (
                <button
                  onClick={logout}
                  className="text-xs font-bold text-indigo-950 hover:text-indigo-900 px-4 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 transition-all font-bold cursor-pointer"
                >
                  {t.navLogIn || 'Log In'}
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <LandingPage
            currentLanguage={currentLanguage}
            onStartNewBusiness={handleStartNew}
            onGrowExistingBusiness={() => setCurrentView('EXISTING_BUSINESS')}
            onSelectPreset={handleSelectPreset}
          />
        </div>
        <footer className="text-center text-[11px] text-slate-400 py-6">
          {user ? (
            <span>Signed in as {user.name}</span>
          ) : (
            <span>Browsing as guest · Analyses save to this device only</span>
          )}
        </footer>
      </div>
    );
  }

  return (
    <AppShell
      activeNav={navForView}
      businessContext={businessContext}
      onNavigate={(key) => {
        if (key === 'HOME') setCurrentView('HOME');
        if (key === 'MY_BUSINESSES') setCurrentView('MY_BUSINESSES');
        if (key === 'NEW_ANALYSIS') handleStartNew();
        if (key === 'REPORTS') setCurrentView('REPORTS');
      }}
      onOpenExplorer={handleOpenExplorer}
      onOpenHelp={() => setHelpModalOpen(true)}
      onLogoClick={() => setCurrentView('HOME')}
    >
      {currentView === 'HOME' && (
        <HomeDashboard
          businesses={businesses}
          isLoading={businessesLoading}
          onStartNew={handleStartNew}
          onGrowExisting={() => setCurrentView('EXISTING_BUSINESS')}
          onOpenBusiness={openSavedBusiness}
          onViewAllBusinesses={() => setCurrentView('MY_BUSINESSES')}
          onViewReports={() => setCurrentView('REPORTS')}
          onOpenExplorer={handleOpenExplorer}
        />
      )}

      {currentView === 'MY_BUSINESSES' && (
        <MyBusinesses
          businesses={businesses}
          isLoading={businessesLoading}
          onOpenBusiness={openSavedBusiness}
          onStartNew={handleStartNew}
        />
      )}

      {currentView === 'REPORTS' && <ReportsPage onOpenReport={() => setCurrentView('FINAL_PLAN')} />}

      {currentView === 'NEW_INPUT' && (
        <NewBusinessFlow
          initialIdea={businessInput.businessIdea}
          initialLocation={businessInput.location}
          initialCapital={businessInput.ownCapital}
          onSubmit={handleFormSubmit}
          onCancel={() => setCurrentView(user || isGuest ? 'HOME' : 'LANDING')}
        />
      )}

      {currentView === 'ANALYZING' && (
        <ProgressIndicator
          businessName={businessInput.businessIdea}
          locationName={baseLocation.areaName}
          onComplete={handleAnalysisComplete}
        />
      )}

      {currentView === 'DECISION_DASHBOARD' && (
        <DecisionDashboard
          businessInput={businessInput}
          baseLocation={baseLocation}
          activeLocation={activeLocation}
          financials={financials}
          decisionResult={decisionResult}
          schemes={schemes}
          currentLanguage={currentLanguage}
          isAlternativeAdopted={isAlternativeAdopted}
          onToggleAlternativeLocation={toggleAlternativeLocation}
          onEditInputs={() => setCurrentView('NEW_INPUT')}
          onViewFullDossier={handleViewFullDossier}
        />
      )}

      {currentView === 'FINAL_PLAN' && (
        <FinalBusinessPlan
          input={businessInput}
          location={activeLocation}
          financials={financials}
          decisionResult={decisionResult}
          recommendedScheme={schemes[0]}
          onReset={() => setCurrentView('NEW_INPUT')}
        />
      )}

      {currentView === 'EXISTING_BUSINESS' && (
        <ExistingBusinessFlow onBackToHome={() => setCurrentView(user || isGuest ? 'HOME' : 'LANDING')} />
      )}

      {currentView === 'EXPLORE_MARKET' && (
        <MarketExplorer
          analysis={activeAnalysis}
          baseLocation={hasActiveAnalysis ? baseLocation : null}
          isAlternativeApplied={isAlternativeAdopted}
          onToggleAlternative={toggleAlternativeLocation}
          onBack={() => setCurrentView('HOME')}
          onStartNew={handleStartNew}
        />
      )}
      {currentView === 'EXPLORE_FINANCE' && (
        <FinanceExplorer analysis={activeAnalysis} onBack={() => setCurrentView('HOME')} onStartNew={handleStartNew} />
      )}
      {currentView === 'EXPLORE_BUSINESS' && (
        <BusinessExplorer analysis={activeAnalysis} onBack={() => setCurrentView('HOME')} onStartNew={handleStartNew} />
      )}
      {currentView === 'EXPLORE_OPERATIONS' && (
        <OperationsExplorer analysis={activeAnalysis} onBack={() => setCurrentView('HOME')} onStartNew={handleStartNew} />
      )}
      {currentView === 'EXPLORE_RISK' && (
        <RiskExplorer analysis={activeAnalysis} onBack={() => setCurrentView('HOME')} onStartNew={handleStartNew} />
      )}
      {currentView === 'EXPLORE_COMPLIANCE' && (
        <ComplianceExplorer analysis={activeAnalysis} onBack={() => setCurrentView('HOME')} onStartNew={handleStartNew} />
      )}
      {currentView === 'EXPLORE_GROWTH' && (
        <GrowthExplorer
          analysis={activeAnalysis}
          onBack={() => setCurrentView('HOME')}
          onStartNew={handleStartNew}
          onGrowExisting={() => setCurrentView('EXISTING_BUSINESS')}
        />
      )}
      {currentView === 'EXPLORE_EVIDENCE' && (
        <EvidenceExplorer analysis={activeAnalysis} onBack={() => setCurrentView('HOME')} onStartNew={handleStartNew} />
      )}
      {currentView === 'EXPLORE_ASK' && (
        <AskExplorer analysis={activeAnalysis} onBack={() => setCurrentView('HOME')} onStartNew={handleStartNew} />
      )}

      {/* Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setHelpModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-900 mb-3 border border-indigo-100">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">How PRAVIRAK Works</h3>
            <div className="text-xs text-slate-600 mt-2 space-y-3 leading-relaxed">
              <p>
                <strong>1. Business Decision Platform:</strong> PRAVIRAK is not a generic chatbot. It performs
                rigorous deterministic underwriting across local market competition, location suitability, debt
                service safety, and sensitivity stress scenarios.
              </p>
              <p>
                <strong>2. Deterministic Arithmetic:</strong> All debt, EMI, capex, and DSCR metrics are calculated
                using authoritative banking math. AI is only used to explain findings in accessible language.
              </p>
              <p>
                <strong>3. Government Financing:</strong> We automatically check eligibility against official
                schemes like PMEGP, PM MUDRA, and CGTMSE to minimize debt interest drag.
              </p>
              <p>
                <strong>4. Sensitive to Risk:</strong> We never guarantee profit. Every recommendation highlights
                the confidence level and underlying data vintage.
              </p>
              <p>
                <strong>5. Explore Hub:</strong> Once you have an active analysis, use Explore Hub to dig deeper
                into market, finance, business, operations, risk, compliance, growth and evidence — or ask
                PRAVIRAK directly.
              </p>
            </div>
            <button
              onClick={() => setHelpModalOpen(false)}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

      {/* Floating Side Panel Chatbot (Ask Pravirak) */}
      <SidePanelChatbot
        input={hasActiveAnalysis ? businessInput : null}
        location={hasActiveAnalysis ? activeLocation : null}
        financials={hasActiveAnalysis ? financials : null}
        decisionResult={hasActiveAnalysis ? decisionResult : null}
      />
    </AppShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <AppShellRouter />
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
