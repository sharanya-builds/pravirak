import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';

interface LanguageSelectorProps {
  variant?: 'header' | 'mobile' | 'minimal';
  className?: string;
}

interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  shortLabel: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', shortLabel: 'EN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', shortLabel: 'हिन्दी' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', shortLabel: 'తెలుగు' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'mobile') {
    return (
      <div className="w-full">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Select Language / भाषा / భాష
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {LANGUAGES.map((l) => {
            const isSelected = l.code === language;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => handleSelect(l.code)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {l.nativeLabel}
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-teal-200 bg-teal-50/80 hover:bg-teal-100/80 text-teal-900 transition-all flex items-center gap-1.5 shadow-2xs hover:border-teal-300 cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-teal-700" />
        <span>{currentLang.nativeLabel}</span>
        <ChevronDown className={`w-3 h-3 text-teal-700 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 divide-y divide-slate-100">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Language / भाषा / భాష
          </div>
          <div className="py-1">
            {LANGUAGES.map((l) => {
              const isSelected = l.code === language;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleSelect(l.code)}
                  className={`w-full px-3.5 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-teal-50 text-teal-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{l.nativeLabel}</span>
                    {l.code !== 'en' && (
                      <span className="text-[10px] text-slate-400 font-normal">({l.label})</span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
