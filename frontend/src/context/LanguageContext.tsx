import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, TranslationStrings } from '../data/translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationStrings;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem('pravirak_language');
    if (stored === 'en' || stored === 'hi' || stored === 'te') return stored as Language;
  } catch { /* ignore */ }
  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try { localStorage.setItem('pravirak_language', lang); } catch { /* ignore */ }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'hi' : language === 'hi' ? 'te' : 'en');
  }, [language, setLanguage]);

  const t = useMemo(() => TRANSLATIONS[language] || TRANSLATIONS.en, [language]);

  const value = useMemo(() => ({ language, setLanguage, toggleLanguage, t }), [language, setLanguage, toggleLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
