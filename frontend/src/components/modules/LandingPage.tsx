import React from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  MapPin, 
  Landmark, 
  ShieldAlert, 
  FileSpreadsheet, 
  Sparkles, 
  CheckCircle2, 
  Store,
  Building2,
  PieChart,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Language, SelectedLocation } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { PrimaryButton } from '../common/PrimaryButton';

interface LandingPageProps {
  currentLanguage: Language;
  onStartNewBusiness: () => void;
  onGrowExistingBusiness: () => void;
  onSelectPreset: (idea: string, location: SelectedLocation, capital: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentLanguage,
  onStartNewBusiness,
  onGrowExistingBusiness,
  onSelectPreset
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const samplePresets: Array<{
    title: string;
    locationName: string;
    location: SelectedLocation;
    capital: number;
    badge: string;
    description: string;
  }> = [
    {
      title: 'Bakery & Confectionery',
      locationName: 'Indiranagar, Bengaluru',
      location: {
        address: '100 Feet Road, Indiranagar, Bengaluru, Karnataka - 560038',
        latitude: 12.9719,
        longitude: 77.6412,
        placeId: 'sample-bengaluru-indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        source: 'DEMO_SAMPLE'
      },
      capital: 150000,
      badge: 'Sample Case Study',
      description: 'Double deck oven, display chiller, high evening tech office footfall'
    },
    {
      title: 'Kirana & FMCG Store',
      locationName: 'Godowlia Chowk, Varanasi',
      location: {
        address: 'Godowlia Chowk, Varanasi, Uttar Pradesh - 221001',
        latitude: 25.3076,
        longitude: 83.0064,
        placeId: 'sample-varanasi-godowlia',
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        postalCode: '221001',
        source: 'DEMO_SAMPLE'
      },
      capital: 100000,
      badge: 'Sample Case Study',
      description: 'Staples, packaged goods, high pilgrim tourist pedestrian flow'
    },
    {
      title: 'Student Snack Cafe & Bakery',
      locationName: 'Boring Road, Patna',
      location: {
        address: 'Boring Road Crossing, Patna, Bihar - 800001',
        latitude: 25.6154,
        longitude: 85.1147,
        placeId: 'sample-patna-boringroad',
        city: 'Patna',
        state: 'Bihar',
        postalCode: '800001',
        source: 'DEMO_SAMPLE'
      },
      capital: 80000,
      badge: 'Sample Case Study',
      description: 'Grab-and-go rolls, patties & cold beverages near 35+ coaching centers'
    },
    {
      title: 'Dairy Farming & Chilling',
      locationName: 'Amul Dairy Road, Anand',
      location: {
        address: 'Amul Dairy Road, Anand, Gujarat - 388001',
        latitude: 22.5645,
        longitude: 72.9289,
        placeId: 'sample-anand-dairyroad',
        city: 'Anand',
        state: 'Gujarat',
        postalCode: '388001',
        source: 'DEMO_SAMPLE'
      },
      capital: 200000,
      badge: 'Sample Case Study',
      description: '5-8 high-yield crossbreed cows, bulk chilling tank & institutional supply'
    },
    {
      title: 'Cloud Kitchen / Delivery Hub',
      locationName: 'Madhapur, Hyderabad',
      location: {
        address: 'Madhapur Main Road, Hitec City, Hyderabad, Telangana - 500081',
        latitude: 17.4483,
        longitude: 78.3915,
        placeId: 'sample-hyderabad-madhapur',
        city: 'Hyderabad',
        state: 'Telangana',
        postalCode: '500081',
        source: 'DEMO_SAMPLE'
      },
      capital: 120000,
      badge: 'Sample Case Study',
      description: 'Commercial ranges, deep freezers, corporate meal delivery radius'
    },
    {
      title: 'Garments & Apparel Boutique',
      locationName: 'Raja Park, Jaipur',
      location: {
        address: 'Raja Park, Lane 1, Jaipur, Rajasthan - 302004',
        latitude: 26.8920,
        longitude: 75.8270,
        placeId: 'sample-jaipur-rajapark',
        city: 'Jaipur',
        state: 'Rajasthan',
        postalCode: '302004',
        source: 'DEMO_SAMPLE'
      },
      capital: 180000,
      badge: 'Sample Case Study',
      description: 'Ethnic festive collections, high residential shopping density'
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* Hero Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-12 lg:p-16 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 dark:hidden rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#161616] border border-slate-200 dark:border-neutral-800 text-xs font-semibold text-slate-700 dark:text-[#D1D5DB] mb-5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.nationalPlatformBadge}</span>
            <span className="text-slate-300 dark:text-neutral-700">|</span>
            <span className="text-indigo-900 dark:text-[#D1D5DB] font-bold">{t.builtFor}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-5">
            {t.tagline}
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-2xl">
            {t.heroDescription}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <PrimaryButton
              onClick={onStartNewBusiness}
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto shadow-md hover:shadow-lg cursor-pointer"
            >
              {t.startNewBusiness}
            </PrimaryButton>

            <PrimaryButton
              onClick={onGrowExistingBusiness}
              variant="secondary"
              size="lg"
              icon={<TrendingUp className="w-5 h-5 text-slate-700 dark:text-[#CBD5E1]" />}
              className="w-full sm:w-auto cursor-pointer"
            >
              {t.growExistingBusiness}
            </PrimaryButton>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.enterAnyAddress}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.deterministicArithmetic}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.googleMapsIntegration}</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW PRAVIRAK HELPS (5 Numbered Cards) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-12 shadow-xs">
        <div className="max-w-2xl mb-8">
          <div className="text-xs font-bold text-slate-500 dark:text-[#9CA3AF] uppercase tracking-wider mb-1">
            {t.methodologyFramework}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t.howPravirakHelps}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.fiveStageDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 border-t-4 border-t-sky-500 relative flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#0F1E36] text-sky-400 border border-sky-500/30 font-black font-mono text-sm flex items-center justify-center mb-3 shadow-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                {t.step1Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step1Description}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 border-t-4 border-t-amber-500 relative flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#0F1E36] text-amber-400 border border-amber-500/30 font-black font-mono text-sm flex items-center justify-center mb-3 shadow-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                {t.step2Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step2Description}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 border-t-4 border-t-emerald-500 relative flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#0F1E36] text-emerald-400 border border-emerald-500/30 font-black font-mono text-sm flex items-center justify-center mb-3 shadow-xs">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                {t.step3Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step3Description}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 border-t-4 border-t-violet-500 relative flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#0F1E36] text-violet-300 border border-violet-500/30 font-black font-mono text-sm flex items-center justify-center mb-3 shadow-xs">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                {t.step4Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step4Description}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 border-t-4 border-t-rose-500 relative flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#0F1E36] text-rose-400 border border-rose-500/30 font-black font-mono text-sm flex items-center justify-center mb-3 shadow-xs">
                5
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                {t.step5Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step5Description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECONDARY SECTION: TRY A SAMPLE BUSINESS (Demo Case Studies Only) */}
      <section className="bg-slate-100/70 rounded-3xl border border-slate-200 p-6 sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-1">
              {t.sampleCaseStudiesOnly}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {t.trySampleBusiness}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.sampleDescription}
            </p>
          </div>
          <span className="text-xs text-slate-500">{t.clickAnyCard}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {samplePresets.map((preset, idx) => {
            const colors = [
              { badge: 'bg-amber-50 text-amber-900 border-amber-200', text: 'text-amber-700' },
              { badge: 'bg-emerald-50 text-emerald-900 border-emerald-200', text: 'text-emerald-700' },
              { badge: 'bg-sky-50 text-sky-900 border-sky-200', text: 'text-sky-700' },
              { badge: 'bg-rose-50 text-rose-900 border-rose-200', text: 'text-rose-700' },
              { badge: 'bg-teal-50 text-teal-900 border-teal-200', text: 'text-teal-700' },
              { badge: 'bg-violet-50 text-violet-900 border-violet-200', text: 'text-violet-700' },
            ];
            const theme = colors[idx % colors.length];

            return (
              <div
                key={idx}
                onClick={() => onSelectPreset(preset.title, preset.location, preset.capital)}
                className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${theme.badge}`}>
                      {t.sampleBadge}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      ₹{(preset.capital).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0F1E36] transition-colors">
                    {preset.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-slate-600 mt-1 mb-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{preset.locationName}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {preset.description}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold ${theme.text}`}>
                  <span>Evaluate Sample</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
