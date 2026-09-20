import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Bell,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  HelpCircle,
  Settings,
  Home,
  Briefcase,
  PlusCircle,
  FileText
} from 'lucide-react';
import { EXPLORE_HUB_ITEMS, ExplorerKey, PrimaryNavKey } from './navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { ThemeToggle } from '../common/ThemeToggle';

interface AppShellProps {
  activeNav: PrimaryNavKey | null;
  businessContext?: { businessIdea: string; locationName: string } | null;
  onNavigate: (key: PrimaryNavKey) => void;
  onOpenExplorer: (key: ExplorerKey) => void;
  onOpenHelp: () => void;
  onLogoClick: () => void;
  children: React.ReactNode;
}

const PRIMARY_NAV: { key: PrimaryNavKey; label: string; icon: typeof Home }[] = [
  { key: 'HOME', label: 'Home', icon: Home },
  { key: 'MY_BUSINESSES', label: 'My Businesses', icon: Briefcase },
  { key: 'NEW_ANALYSIS', label: 'New Analysis', icon: PlusCircle },
  { key: 'REPORTS', label: 'Reports', icon: FileText }
];

export const AppShell: React.FC<AppShellProps> = ({
  activeNav,
  businessContext,
  onNavigate,
  onOpenExplorer,
  onOpenHelp,
  onLogoClick,
  children
}) => {
  const { user, isGuest, logout } = useAuth();
  const { t, language } = useLanguage();
  const [exploreOpen, setExploreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerExploreOpen, setDrawerExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const guestLabel = t.guestUser;
  const displayName = user?.name || guestLabel;
  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col font-sans">
      {/* Desktop top nav */}
      <header className="no-print sticky top-0 z-40 bg-white dark:bg-[#0A0A0A] border-b border-slate-200 dark:border-neutral-800 shadow-xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: logo */}
          <button onClick={onLogoClick} className="flex items-center gap-2.5 shrink-0 group cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-indigo-950 flex items-center justify-center text-amber-400 border border-indigo-900 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none group-hover:text-indigo-950 dark:group-hover:text-indigo-400">
                PRAVIRAK
              </div>
              <div className="text-[10px] text-slate-500 dark:text-neutral-400 leading-none mt-0.5">{t.ideasToLivelihoods}</div>
            </div>
          </button>

          {/* Center: desktop nav */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-xl p-1">
            {[
              { key: 'HOME' as PrimaryNavKey, label: t.navHome, icon: Home },
              { key: 'MY_BUSINESSES' as PrimaryNavKey, label: t.navMyBusinesses, icon: Briefcase },
              { key: 'NEW_ANALYSIS' as PrimaryNavKey, label: t.navNewAnalysis, icon: PlusCircle },
              { key: 'REPORTS' as PrimaryNavKey, label: t.navReports, icon: FileText }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeNav === item.key
                    ? 'bg-white dark:bg-[#222222] text-indigo-950 dark:text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C1C1C]'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div ref={exploreRef} className="relative">
              <button
                onClick={() => setExploreOpen((o) => !o)}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{t.navExploreHub}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${exploreOpen ? 'rotate-180' : ''}`} />
              </button>

              {exploreOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[560px] max-w-[90vw] bg-white dark:bg-[#0D0D0D] rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xl p-3 grid grid-cols-2 gap-1 z-50">
                  {EXPLORE_HUB_ITEMS.map((item) => {
                    const localizedLabel = {
                      MARKET: t.exploreMarket,
                      FINANCE: t.exploreFinance,
                      BUSINESS: t.exploreBusiness,
                      OPERATIONS: t.exploreOperations,
                      RISK: t.exploreRisk,
                      COMPLIANCE: t.exploreCompliance,
                      GROWTH: t.exploreGrowth,
                      EVIDENCE: t.exploreEvidence,
                      ASK: t.exploreAsk,
                    }[item.key] || item.label;

                    const localizedDescription = {
                      MARKET: t.exploreMarketDesc,
                      FINANCE: t.exploreFinanceDesc,
                      BUSINESS: t.exploreBusinessDesc,
                      OPERATIONS: t.exploreOperationsDesc,
                      RISK: t.exploreRiskDesc,
                      COMPLIANCE: t.exploreComplianceDesc,
                      GROWTH: t.exploreGrowthDesc,
                      EVIDENCE: t.exploreEvidenceDesc,
                      ASK: t.exploreAskDesc,
                    }[item.key] || item.description;

                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          setExploreOpen(false);
                          onOpenExplorer(item.key);
                        }}
                        className="flex items-start gap-3 text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">{localizedLabel}</div>
                          <div className="text-xs text-slate-700 dark:text-neutral-300 mt-0.5 font-medium">{localizedDescription}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right: theme toggle + language + notifications + profile */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector variant="header" />
            <button
              className="p-2 rounded-lg text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer"
              aria-label={t.ariaNotifications}
            >
              <Bell className="w-4.5 h-4.5" />
            </button>

            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-950 text-amber-400 text-[11px] font-bold flex items-center justify-center">
                  {initials || <User className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-neutral-200 max-w-[90px] truncate">{displayName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#0D0D0D] rounded-xl border border-slate-200 dark:border-neutral-800 shadow-xl py-1.5 z-50">
                  <div className="px-3.5 py-2 border-b border-slate-100 dark:border-neutral-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-neutral-400">{isGuest ? t.guestSession : user?.phone || user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onOpenHelp();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-[#1A1A1A] flex items-center gap-2 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    {t.navHelpSupport}
                  </button>
                  <button className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-[#1A1A1A] flex items-center gap-2 cursor-pointer">
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    {t.navSettings}
                  </button>
                  <div className="border-t border-slate-100 dark:border-neutral-800 mt-1 pt-1">
                    <button
                      onClick={logout}
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {isGuest ? t.navExitGuest : t.navLogOut}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-[#1A1A1A]"
            aria-label={t.ariaOpenNav}
          >
            <Menu className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Contextual business bar (visible when inside an analysis) */}
        {businessContext && (
          <div className="border-t border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-[#0A0A0A] px-4 sm:px-6 py-2 flex items-center gap-2 text-[11px] text-slate-600 dark:text-neutral-300 overflow-x-auto">
            <span className="font-semibold text-slate-800 dark:text-white shrink-0">{businessContext.businessIdea}</span>
            <span className="text-slate-300 dark:text-neutral-600">•</span>
            <span className="shrink-0">{businessContext.locationName}</span>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setDrawerOpen(false)} />
          <div className="relative ml-auto w-[85%] max-w-sm h-full bg-white dark:bg-[#0D0D0D] shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-black text-slate-900 dark:text-white">PRAVIRAK</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ThemeToggle />
                <button onClick={() => setDrawerOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Profile section */}
            <div className="p-4 border-b border-slate-100 dark:border-neutral-800 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-indigo-950 text-amber-400 text-sm font-bold flex items-center justify-center">
                {initials || <User className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenHelp();
                  }}
                  className="text-[11px] text-indigo-900 dark:text-indigo-400 font-semibold cursor-pointer"
                >
                  {t.navViewProfile}
                </button>
              </div>
            </div>

            <div className="p-3 border-b border-slate-100 dark:border-neutral-800">
              <LanguageSelector variant="mobile" />
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {[
                { key: 'HOME' as PrimaryNavKey, label: t.navHome, icon: Home },
                { key: 'MY_BUSINESSES' as PrimaryNavKey, label: t.navMyBusinesses, icon: Briefcase },
                { key: 'NEW_ANALYSIS' as PrimaryNavKey, label: t.navNewAnalysis, icon: PlusCircle },
                { key: 'REPORTS' as PrimaryNavKey, label: t.navReports, icon: FileText }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key);
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    activeNav === item.key ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-white font-bold' : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-[#1A1A1A]'
                  }`}
                >
                  <item.icon className="w-4.5 h-4.5" />
                  {item.label}
                </button>
              ))}

              {/* Explore hub expandable */}
              <button
                onClick={() => setDrawerExploreOpen((o) => !o)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-[#1A1A1A] cursor-pointer"
              >
                <span>{t.navExploreHub}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${drawerExploreOpen ? 'rotate-180' : ''}`} />
              </button>

              {drawerExploreOpen && (
                <div className="pl-3 space-y-0.5">
                  {EXPLORE_HUB_ITEMS.map((item) => {
                    const localizedLabel = {
                      MARKET: t.exploreMarket,
                      FINANCE: t.exploreFinance,
                      BUSINESS: t.exploreBusiness,
                      OPERATIONS: t.exploreOperations,
                      RISK: t.exploreRisk,
                      COMPLIANCE: t.exploreCompliance,
                      GROWTH: t.exploreGrowth,
                      EVIDENCE: t.exploreEvidence,
                      ASK: t.exploreAsk,
                    }[item.key] || item.label;

                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          onOpenExplorer(item.key);
                          setDrawerOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                      >
                        <item.icon className="w-3.5 h-3.5 text-slate-400" />
                        {localizedLabel}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
                <button
                  onClick={() => {
                    onOpenHelp();
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <HelpCircle className="w-4.5 h-4.5" />
                  {t.navHelpSupport}
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                  <Settings className="w-4.5 h-4.5" />
                  {t.navSettings}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  {isGuest ? t.navExitGuest : t.navLogOut}
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>

      {/* Footer */}
      <footer className="no-print bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-amber-400 font-bold">
              P
            </div>
            <div>
              <span className="font-extrabold text-white text-sm">PRAVIRAK</span>
              <p className="text-[11px] text-slate-500">{t.platformFooterSub}</p>
            </div>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-500">
            <p>{t.platformTaglineBuiltFor}</p>
            <p className="mt-0.5">{t.platformEthos}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
