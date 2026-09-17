import React from 'react';
import { SafetyStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  safetyStatus?: SafetyStatus;
  accent?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
  icon?: React.ReactNode;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  safetyStatus,
  accent = 'slate',
  icon,
  highlight = false
}) => {
  const { language } = useLanguage();

  const getSafetyBadge = (status: SafetyStatus) => {
    switch (status) {
      case 'SAFE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'WATCH':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'RISKY':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300 font-bold';
    }
  };

  const getSafetyLabel = (status: SafetyStatus) => {
    if (language === 'te') {
      switch (status) {
        case 'SAFE': return 'సురక్షితం';
        case 'WATCH': return 'జాగ్రత్త';
        case 'RISKY': return 'ప్రమాదకరం';
      }
    }
    if (language === 'hi') {
      switch (status) {
        case 'SAFE': return 'सुरक्षित';
        case 'WATCH': return 'निगरानी';
        case 'RISKY': return 'जोखिम';
      }
    }
    return status;
  };

  const getBorderColor = () => {
    if (highlight) return 'border-blue-900 ring-2 ring-blue-100';
    return 'border-slate-200 hover:border-slate-400';
  };

  // Format value to prevent overflow of numbers like ₹7,18,000 or units like / mo
  const renderValue = () => {
    const valStr = String(value);
    if (valStr.includes('/')) {
      const parts = valStr.split('/');
      const main = parts[0].trim();
      const unit = parts.slice(1).join('/').trim();
      return (
        <div className="flex items-baseline flex-wrap gap-x-1.5 overflow-hidden">
          <span className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-mono truncate max-w-full">
            {main}
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-600 font-sans shrink-0">
            /{unit}
          </span>
        </div>
      );
    }

    return (
      <div className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-mono truncate max-w-full">
        {value}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-2xl p-5 sm:p-5 lg:p-5 border-2 ${getBorderColor()} shadow-sm transition-all duration-200 flex flex-col justify-between overflow-hidden min-w-0 card-hover-float cursor-default`}>
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-1.5 mb-2.5 min-w-0">
          <span className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider truncate">
            {label}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {icon && <span className="text-slate-500">{icon}</span>}
            {safetyStatus && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getSafetyBadge(safetyStatus)}`}>
                {getSafetyLabel(safetyStatus)}
              </span>
            )}
          </div>
        </div>

        {renderValue()}

        {subtext && (
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-2 leading-snug line-clamp-2">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};
