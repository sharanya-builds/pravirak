import React from 'react';
import { Loader2 } from 'lucide-react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-white text-slate-800 border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-2xs';
      case 'danger':
        return 'bg-rose-700 text-white hover:bg-rose-800 border-transparent shadow-xs';
      case 'outline':
        return 'bg-transparent text-[#1E3A8A] border-2 border-[#1E3A8A] hover:bg-blue-50 font-bold';
      case 'primary':
      default:
        return 'bg-[#1E3A8A] text-white hover:bg-[#1E40AF] active:bg-[#172554] border border-[#3B82F6]/40 shadow-md hover:shadow-lg shadow-blue-900/25 active:scale-[0.99] font-extrabold';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3.5 py-2 text-xs font-bold min-h-[36px]';
      case 'lg':
        return 'px-7 py-3.5 text-sm sm:text-base font-extrabold min-h-[48px] tracking-wide';
      case 'md':
      default:
        return 'px-5 py-2.5 text-xs sm:text-sm font-bold min-h-[44px]';
    }
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-amber-300" />
      ) : icon ? (
        <span className="shrink-0 flex items-center justify-center">{icon}</span>
      ) : null}
      <span className="font-extrabold tracking-wide">{children}</span>
    </button>
  );
};
