import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();
  const { language } = useLanguage();

  const title = isDark
    ? (language === 'te' ? 'లైట్ మోడ్‌కి మారండి' : language === 'hi' ? 'लाइट मोड में बदलें' : 'Switch to Light mode')
    : (language === 'te' ? 'డార్క్ మోడ్‌కి మారండి' : language === 'hi' ? 'डार्क मोड में बदलें' : 'Switch to Dark mode');

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={title}
      aria-label={title}
      className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
        isDark
          ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:text-amber-200 hover:border-amber-400/40 shadow-sm'
          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900 shadow-xs'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4.5 h-4.5 transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-300" />
      ) : (
        <Moon className="w-4.5 h-4.5 transition-transform duration-300 -rotate-12 hover:rotate-0 text-slate-700" />
      )}
    </button>
  );
};
