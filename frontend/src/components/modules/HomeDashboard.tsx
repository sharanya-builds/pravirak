import React from 'react';
import { PlusCircle, TrendingUp, ArrowRight, Compass, FileText, Briefcase } from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';
import { BusinessCard } from '../common/BusinessCard';
import { SavedBusiness } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { EXPLORE_HUB_ITEMS } from '../shell/navigation';

interface HomeDashboardProps {
  businesses: SavedBusiness[];
  isLoading: boolean;
  onStartNew: () => void;
  onGrowExisting: () => void;
  onOpenBusiness: (business: SavedBusiness) => void;
  onViewAllBusinesses: () => void;
  onViewReports: () => void;
  onOpenExplorer: (key: (typeof EXPLORE_HUB_ITEMS)[number]['key']) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  businesses,
  isLoading,
  onStartNew,
  onGrowExisting,
  onOpenBusiness,
  onViewAllBusinesses,
  onViewReports,
  onOpenExplorer
}) => {
  const { user, isGuest } = useAuth();
  const { t } = useLanguage();
  const firstName = user?.name?.split(' ')[0];
  const greeting = firstName ? `${t.welcomeBack}, ${firstName}` : isGuest ? t.welcomeBack : t.welcomeToPravirak;

  return (
    <div className="space-y-8">
      {/* Greeting + primary CTA */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{greeting}</h1>
            <p className="text-sm text-slate-600 mt-1.5 max-w-lg">
              {t.startNewAnalysisDesc}
            </p>
          </div>
          <PrimaryButton
            onClick={onStartNew}
            variant="primary"
            size="lg"
            icon={<PlusCircle className="w-5 h-5" />}
            className="shrink-0 shadow-md hover:shadow-lg cursor-pointer"
          >
            {t.newAnalysis}
          </PrimaryButton>
        </div>
      </section>

      {/* My Businesses */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{t.myBusinessesTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.myBusinessesDesc}</p>
          </div>
          {businesses.length > 0 && (
            <button
              onClick={onViewAllBusinesses}
              className="text-xs font-bold text-indigo-900 hover:text-indigo-950 flex items-center gap-1 cursor-pointer"
            >
              {t.viewAll}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">{t.noBusinessesYet}</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {t.noBusinessesDesc}
            </p>
            <button
              onClick={onStartNew}
              className="text-xs font-bold text-indigo-900 hover:text-indigo-950 inline-flex items-center gap-1 cursor-pointer"
            >
              {t.runFirstAnalysis}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.slice(0, 6).map((b) => (
              <BusinessCard key={b.id} business={b} onOpen={onOpenBusiness} />
            ))}
          </div>
        )}
      </section>

      {/* Quick access: Reports + Explore Hub + Existing business */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onViewReports}
          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 text-left hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center mb-3 border border-indigo-100">
            <FileText className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-950">{t.navReports}</h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">{t.reportsDesc}</p>
        </button>

        <button
          onClick={() => onOpenExplorer('MARKET')}
          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 text-left hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center mb-3 border border-indigo-100">
            <Compass className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-950">{t.navExploreHub}</h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">{t.exploreHubDesc}</p>
        </button>

        <button
          onClick={onGrowExisting}
          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 text-left hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 border border-emerald-100">
            <TrendingUp className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-950">{t.growExistingBusiness}</h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">{t.growExistingDesc}</p>
        </button>
      </section>
    </div>
  );
};
