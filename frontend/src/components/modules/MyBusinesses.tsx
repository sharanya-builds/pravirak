import React, { useMemo, useState } from 'react';
import { Search, PlusCircle, Briefcase, X } from 'lucide-react';
import { SavedBusiness } from '../../api/client';
import { BusinessCard } from '../common/BusinessCard';
import { PrimaryButton } from '../common/PrimaryButton';
import { useLanguage } from '../../context/LanguageContext';

interface MyBusinessesProps {
  businesses: SavedBusiness[];
  isLoading: boolean;
  onOpenBusiness: (business: SavedBusiness) => void;
  onStartNew: () => void;
}

const STATUS_FILTERS = ['All', 'Draft', 'Analysis Complete', 'Needs Review', 'Ready to Proceed'] as const;

export const MyBusinesses: React.FC<MyBusinessesProps> = ({
  businesses,
  isLoading,
  onOpenBusiness,
  onStartNew
}) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>('All');

  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);

    return (businesses || []).filter((b) => {
      // Defensive string extraction across all potential search fields
      const idea = (b.businessIdea || '').toLowerCase();
      const loc = (b.locationName || '').toLowerCase();
      const cat = (b.category || '').toLowerCase();
      const status = (b.status || '').toLowerCase();
      const decision = (b.decision || '').toLowerCase();
      const capital = b.ownCapital != null ? String(b.ownCapital) : '';

      const searchable = `${idea} ${loc} ${cat} ${status} ${decision} ${capital}`;
      const matchesQuery = terms.length === 0 || terms.every((term) => searchable.includes(term));

      // Robust case-insensitive status matching
      const matchesStatus =
        statusFilter === 'All' ||
        status === statusFilter.toLowerCase() ||
        status.replace(/[\s_-]+/g, '') === statusFilter.toLowerCase().replace(/[\s_-]+/g, '');

      return matchesQuery && matchesStatus;
    });
  }, [businesses, query, statusFilter]);

  const searchPlaceholder = language === 'te'
    ? 'వ్యాపార ఆలోచన, వర్గం లేదా స్థానం ద్వారా వెతకండి...'
    : language === 'hi'
    ? 'व्यवसाय विचार, श्रेणी या स्थान द्वारा खोजें...'
    : 'Search by business idea, category, or location...';

  const getStatusLabel = (s: string) => {
    if (language === 'te') {
      switch (s) {
        case 'All': return 'అన్నీ';
        case 'Draft': return 'చిత్తుప్రతి';
        case 'Analysis Complete': return 'విశ్లేషణ పూర్తయింది';
        case 'Needs Review': return 'సమీక్ష అవసరం';
        case 'Ready to Proceed': return 'ముందుకు వెళ్ళవచ్చు';
      }
    }
    if (language === 'hi') {
      switch (s) {
        case 'All': return 'सभी';
        case 'Draft': return 'प्रारूप';
        case 'Analysis Complete': return 'विश्लेषण पूर्ण';
        case 'Needs Review': return 'समीक्षा आवश्यक';
        case 'Ready to Proceed': return 'शुरू करने के लिए तैयार';
      }
    }
    return s;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-[#D1D5DB] tracking-tight">{t.myBusinessesTitle}</h1>
          <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
            {businesses.length} {language === 'te' ? 'సేవ్ చేయబడిన విశ్లేషణలు' : language === 'hi' ? 'సहेजे गए विश्लेषण' : businesses.length === 1 ? 'saved analysis' : 'saved analyses'}
          </p>
        </div>
        <PrimaryButton onClick={onStartNew} variant="primary" icon={<PlusCircle className="w-4.5 h-4.5" />}>
          {t.newAnalysis}
        </PrimaryButton>
      </div>

      {/* Search + filters */}
      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-neutral-800 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full text-sm pl-9 pr-9 py-2.5 border border-slate-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:outline-hidden bg-slate-50 dark:bg-[#141414] text-slate-900 dark:text-[#D1D5DB] placeholder:text-slate-400 dark:placeholder:text-neutral-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-[#1E3A8A] text-white shadow-xs font-bold'
                  : 'bg-slate-100 dark:bg-[#181818] text-slate-700 dark:text-[#D1D5DB] hover:bg-slate-200 dark:hover:bg-[#242424] border border-slate-200 dark:border-neutral-800'
              }`}
            >
              {getStatusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-100 dark:bg-[#161616] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-50 dark:bg-[#141414] border border-dashed border-slate-300 dark:border-neutral-800 rounded-2xl p-10 text-center">
          <Briefcase className="w-8 h-8 text-slate-400 dark:text-neutral-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800 dark:text-[#D1D5DB]">
            {language === 'te' ? 'శోధనకు సరిపోలే వ్యాపారాలు లేవు' : language === 'hi' ? 'आपकी खोज से मेल खाने वाले कोई व्यवसाय नहीं हैं' : 'No businesses match your search'}
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            {language === 'te' ? 'వేరొక పదం లేదా ఫిల్టర్‌ని ప్రయత్నించండి.' : language === 'hi' ? 'कोई भिन्न खोज शब्द या फ़िल्टर आज़माएँ।' : 'Try a different keyword or clear your filter.'}
          </p>
          {(query || statusFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setStatusFilter('All');
              }}
              className="mt-3 px-3.5 py-1.5 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-[#1E40AF] rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              {language === 'te' ? 'అన్ని ఫిల్టర్‌లను తీసివేయండి' : language === 'hi' ? 'सभी फ़िल्टर रीसेट करें' : 'Reset All Filters'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <BusinessCard key={b.id} business={b} onOpen={onOpenBusiness} />
          ))}
        </div>
      )}
    </div>
  );
};
