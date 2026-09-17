import React from 'react';
import { MapPin, IndianRupee, ChevronRight, Clock } from 'lucide-react';
import { SavedBusiness } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

interface BusinessCardProps {
  business: SavedBusiness;
  onOpen: (business: SavedBusiness) => void;
}

function getCategoryDesign(idea: string) {
  const q = (idea || '').toLowerCase();
  if (q.includes('bake') || q.includes('cake') || q.includes('bread') || q.includes('pastry') || q.includes('sweet') || q.includes('cookie')) {
    return {
      accentBorder: 'border-l-4 border-l-amber-500 hover:border-amber-400',
      badgeBg: 'bg-amber-50 dark:bg-[#231502] text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      iconEmoji: '🥖',
      categoryTag: 'Bakery & Sweets',
      capitalBg: 'bg-amber-50 dark:bg-[#1E1202] text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    };
  }
  if (q.includes('dairy') || q.includes('milk') || q.includes('cow') || q.includes('buffalo') || q.includes('cattle')) {
    return {
      accentBorder: 'border-l-4 border-l-sky-500 hover:border-sky-400',
      badgeBg: 'bg-sky-50 dark:bg-[#041829] text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      iconEmoji: '🥛',
      categoryTag: 'Dairy & Milk',
      capitalBg: 'bg-sky-50 dark:bg-[#031524] text-sky-900 dark:text-sky-300 border-sky-200 dark:border-sky-800'
    };
  }
  if (q.includes('kiran') || q.includes('grocery') || q.includes('store') || q.includes('supermarket') || q.includes('ration') || q.includes('provision')) {
    return {
      accentBorder: 'border-l-4 border-l-emerald-500 hover:border-emerald-400',
      badgeBg: 'bg-emerald-50 dark:bg-[#042114] text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      iconEmoji: '🛒',
      categoryTag: 'Kirana & FMCG',
      capitalBg: 'bg-emerald-50 dark:bg-[#041F14] text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
    };
  }
  if (q.includes('kitchen') || q.includes('food') || q.includes('restaurant') || q.includes('cafe') || q.includes('tiffin') || q.includes('biryani') || q.includes('snack')) {
    return {
      accentBorder: 'border-l-4 border-l-orange-500 hover:border-orange-400',
      badgeBg: 'bg-orange-50 dark:bg-[#241202] text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      iconEmoji: '🍳',
      categoryTag: 'Kitchen & Dining',
      capitalBg: 'bg-orange-50 dark:bg-[#1F1002] text-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800'
    };
  }
  if (q.includes('cloth') || q.includes('garment') || q.includes('fashion') || q.includes('textile') || q.includes('tailor') || q.includes('saree') || q.includes('boutique')) {
    return {
      accentBorder: 'border-l-4 border-l-purple-500 hover:border-purple-400',
      badgeBg: 'bg-purple-50 dark:bg-[#1C082B] text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      iconEmoji: '👗',
      categoryTag: 'Apparel & Boutique',
      capitalBg: 'bg-purple-50 dark:bg-[#180524] text-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800'
    };
  }
  if (q.includes('mobile') || q.includes('phone') || q.includes('repair') || q.includes('laptop') || q.includes('electronic')) {
    return {
      accentBorder: 'border-l-4 border-l-cyan-500 hover:border-cyan-400',
      badgeBg: 'bg-cyan-50 dark:bg-[#031D22] text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      iconEmoji: '📱',
      categoryTag: 'Electronics Repair',
      capitalBg: 'bg-cyan-50 dark:bg-[#02181C] text-cyan-900 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
    };
  }
  if (q.includes('station') || q.includes('book') || q.includes('xerox') || q.includes('print')) {
    return {
      accentBorder: 'border-l-4 border-l-teal-500 hover:border-teal-400',
      badgeBg: 'bg-teal-50 dark:bg-[#04201E] text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      iconEmoji: '📚',
      categoryTag: 'Stationery & Xerox',
      capitalBg: 'bg-teal-50 dark:bg-[#031C1A] text-teal-900 dark:text-teal-300 border-teal-200 dark:border-teal-800'
    };
  }
  if (q.includes('pharm') || q.includes('medic') || q.includes('drug') || q.includes('health') || q.includes('clinic')) {
    return {
      accentBorder: 'border-l-4 border-l-rose-500 hover:border-rose-400',
      badgeBg: 'bg-rose-50 dark:bg-[#25060E] text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      iconEmoji: '💊',
      categoryTag: 'Pharmacy & Health',
      capitalBg: 'bg-rose-50 dark:bg-[#20040A] text-rose-900 dark:text-rose-300 border-rose-200 dark:border-rose-800'
    };
  }
  return {
    accentBorder: 'border-l-4 border-l-indigo-500 hover:border-indigo-400',
    badgeBg: 'bg-indigo-50 dark:bg-[#121026] text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    iconEmoji: '🏢',
    categoryTag: 'MSME Venture',
    capitalBg: 'bg-indigo-50 dark:bg-[#0E0E22] text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
  };
}

function statusStyles(status: string) {
  switch (status) {
    case 'Ready to Proceed':
      return 'bg-emerald-50 dark:bg-[#052215] text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    case 'Analysis Complete':
      return 'bg-slate-100 dark:bg-[#1C1C1C] text-slate-800 dark:text-neutral-200 border-slate-300 dark:border-neutral-700';
    case 'Needs Review':
      return 'bg-amber-50 dark:bg-[#221402] text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    case 'Draft':
    default:
      return 'bg-slate-100 dark:bg-[#181818] text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-800';
  }
}

function getLocalizedStatus(status: string, lang: string) {
  if (lang === 'te') {
    switch (status) {
      case 'Ready to Proceed': return 'ముందుకు వెళ్ళవచ్చు';
      case 'Analysis Complete': return 'విశ్లేషణ పూర్తయింది';
      case 'Needs Review': return 'సమీక్ష అవసరం';
      case 'Draft': return 'చిత్తుప్రతి';
      default: return status;
    }
  }
  if (lang === 'hi') {
    switch (status) {
      case 'Ready to Proceed': return 'शुरू करने के लिए तैयार';
      case 'Analysis Complete': return 'विश्लेषण पूर्ण';
      case 'Needs Review': return 'समीक्षा आवश्यक';
      case 'Draft': return 'प्रारूप';
      default: return status;
    }
  }
  return status;
}

function timeAgo(dateStr: string | undefined | null, lang: string) {
  if (!dateStr) return lang === 'te' ? 'ఇప్పుడే' : lang === 'hi' ? 'अभी' : 'recently';
  let d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    d = new Date(dateStr.replace(' ', 'T'));
  }
  if (isNaN(d.getTime())) {
    const n = Number(dateStr);
    if (!isNaN(n) && n > 0) d = new Date(n);
  }
  if (isNaN(d.getTime())) {
    return lang === 'te' ? 'ఇప్పుడే' : lang === 'hi' ? 'अभी' : 'recently';
  }
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return lang === 'te' ? 'ఇప్పుడే' : lang === 'hi' ? 'अभी' : 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, onOpen }) => {
  const { language, t } = useLanguage();
  const continueLabel = language === 'te' ? 'కొనసాగించండి' : language === 'hi' ? 'आगे बढ़ें' : 'Continue';
  const updatedLabel = language === 'te' ? 'నవీకరించబడింది' : language === 'hi' ? 'अद्यतित' : 'Updated';
  const design = getCategoryDesign(business.businessIdea);

  return (
    <button
      onClick={() => onOpen(business)}
      className={`w-full text-left bg-white dark:bg-[#111111] rounded-2xl border-2 border-slate-200 dark:border-neutral-800 ${design.accentBorder} p-5 sm:p-6 shadow-sm transition-all group card-hover-float cursor-pointer`}
    >
      {/* Top row: Category tag + Status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{design.iconEmoji}</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${design.badgeBg}`}>
            {design.categoryTag}
          </span>
        </div>
        <span
          className={`shrink-0 text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${statusStyles(
            business.status
          )}`}
        >
          {getLocalizedStatus(business.status, language)}
        </span>
      </div>

      {/* Business title: soft off-white, no glare */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#D1D5DB] line-clamp-2 leading-snug mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
        {business.businessIdea}
      </h3>

      {/* Location & Capital */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-neutral-400 font-medium mb-3">
        {business.locationName && (
          <span className="flex items-center gap-1 min-w-0 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{business.locationName}</span>
          </span>
        )}
        {business.ownCapital != null && (
          <span className={`flex items-center gap-1 font-mono font-bold px-2.5 py-0.5 rounded-lg border text-xs sm:text-sm ${design.capitalBg}`}>
            <IndianRupee className="w-3.5 h-3.5" />
            {business.ownCapital.toLocaleString('en-IN')}
          </span>
        )}
      </div>

      {/* Bottom row: Time + Action */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-neutral-800">
        <span className="flex items-center gap-1 text-xs sm:text-sm text-slate-500 dark:text-neutral-400 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {updatedLabel} {timeAgo(business.updatedAt, language)}
        </span>
        <span className="flex items-center gap-0.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-neutral-200 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
          {continueLabel}
          <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </button>
  );
};
