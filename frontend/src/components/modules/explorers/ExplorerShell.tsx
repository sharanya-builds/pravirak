import React from 'react';
import { ArrowLeft, LucideIcon } from 'lucide-react';

interface ExplorerShellProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onBack: () => void;
  children: React.ReactNode;
}

export const ExplorerShell: React.FC<ExplorerShellProps> = ({ icon: Icon, title, description, onBack, children }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-indigo-950 text-amber-400 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

import { useLanguage } from '../../../context/LanguageContext';

export const NoActiveAnalysis: React.FC<{ onStartNew: () => void }> = ({ onStartNew }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center">
      <p className="text-sm font-semibold text-slate-700">{t.noActiveAnalysisTitle}</p>
      <p className="text-xs text-slate-500 mt-1 mb-4">
        {t.noActiveAnalysisDesc}
      </p>
      <button onClick={onStartNew} className="text-xs font-bold text-indigo-900 hover:text-indigo-950">
        {t.startNewAnalysisArrow}
      </button>
    </div>
  );
};
