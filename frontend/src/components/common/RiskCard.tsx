import React from 'react';
import { AlertCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RiskCardProps {
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export const RiskCard: React.FC<RiskCardProps> = ({ title, severity, mitigation }) => {
  const { language } = useLanguage();

  const getSeverityBadge = () => {
    switch (severity) {
      case 'High':
        return {
          badge: 'bg-rose-100 text-rose-800 border-rose-300 font-bold dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
          border: 'border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-800/60',
          icon: <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        };
      case 'Medium':
        return {
          badge: 'bg-amber-100 text-amber-800 border-amber-300 font-bold dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
          border: 'border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/60',
          icon: <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        };
      case 'Low':
      default:
        return {
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
          border: 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800/60',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        };
    }
  };

  const getSeverityLabel = () => {
    if (language === 'te') {
      switch (severity) {
        case 'High': return 'అధిక నష్టం';
        case 'Medium': return 'మధ్యస్థ నష్టం';
        case 'Low': return 'తక్కువ నష్టం';
      }
    }
    if (language === 'hi') {
      switch (severity) {
        case 'High': return 'उच्च जोखिम';
        case 'Medium': return 'मध्यम जोखिम';
        case 'Low': return 'कम जोखिम';
      }
    }
    return `${severity} RISK`;
  };

  const style = getSeverityBadge();

  return (
    <div className={`rounded-2xl p-4 sm:p-5 border ${style.border} flex items-start gap-3.5 transition-all duration-200 shadow-sm card-hover-float cursor-default`}>
      {style.icon}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h4 className="text-sm sm:text-base font-bold text-slate-950 leading-snug">
            {title}
          </h4>
          <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md border uppercase shrink-0 ${style.badge}`}>
            {getSeverityLabel()}
          </span>
        </div>
        {/* Mitigation font is larger and darker */}
        <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium mt-1">
          <strong className="text-slate-950 font-bold">
            {language === 'te' ? 'ప్రవీరక్ నివారణ చర్య: ' : language === 'hi' ? 'प्रवीरक निवारण उपाय: ' : 'Pravirak Mitigation: '}
          </strong>
          {mitigation}
        </p>
      </div>
    </div>
  );
};
