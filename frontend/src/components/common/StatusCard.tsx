import React from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface StatusCardProps {
  status: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  message: string | React.ReactNode;
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  status,
  title,
  message,
  className = ''
}) => {
  const getStyles = () => {
    switch (status) {
      case 'success':
        return {
          bg: 'bg-emerald-50 text-emerald-950 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 text-amber-950 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800',
          icon: <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        };
      case 'danger':
        return {
          bg: 'bg-rose-50 text-rose-950 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800',
          icon: <XCircle className="w-5 h-5 text-rose-700 dark:text-rose-400 shrink-0 mt-0.5" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 text-blue-950 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-800',
          icon: <Info className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
        };
    }
  };

  const current = getStyles();

  return (
    <div className={`p-4 rounded-xl border ${current.bg} flex items-start gap-3 ${className}`}>
      {current.icon}
      <div className="flex-1 text-xs sm:text-sm leading-relaxed">
        {title && <div className="font-bold text-slate-900 dark:text-slate-100 mb-0.5">{title}</div>}
        <div>{message}</div>
      </div>
    </div>
  );
};
