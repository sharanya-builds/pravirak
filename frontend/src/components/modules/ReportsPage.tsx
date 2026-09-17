import React, { useEffect, useState } from 'react';
import { FileText, ArrowRight, Loader2 } from 'lucide-react';
import { reportApi, SavedReport } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface ReportsPageProps {
  onOpenReport: (report: SavedReport) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onOpenReport }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      setReports([]);
      return;
    }
    reportApi
      .list()
      .then(({ reports: list }) => setReports(list))
      .finally(() => setIsLoading(false));
  }, [user]);

  const openLabel = language === 'te' ? 'తెరవండి' : language === 'hi' ? 'खोलें' : 'Open';
  const loginToSave = language === 'te' 
    ? 'నివేదికలను సేవ్ చేయడానికి ఖాతాను సృష్టించండి లేదా లాగిన్ అవ్వండి'
    : language === 'hi'
    ? 'रिपोर्ट सहेजने के लिए खाता बनाएं या लॉग इन करें'
    : 'Create an account to save reports';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-950 tracking-tight">{t.reportsTitle}</h1>
        <p className="text-sm text-slate-800 font-medium mt-1">{t.reportsDesc}</p>
      </div>

      {!user ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-900">{loginToSave}</p>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
            {t.browsingAsGuest}
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16 text-indigo-600">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-900">{t.noReportsYet}</p>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
            {t.noReportsDesc}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <button
              key={r.id}
              onClick={() => onOpenReport(r)}
              className="w-full text-left bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center border border-indigo-100 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-950">{r.title}</p>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium truncate">{r.businessIdea}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-indigo-600 group-hover:text-indigo-700 shrink-0">
                <span>{openLabel}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
