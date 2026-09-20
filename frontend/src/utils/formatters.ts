import { Language } from '../types';

export function getLocale(lang: Language = 'en'): string {
  switch (lang) {
    case 'hi':
      return 'hi-IN';
    case 'te':
      return 'te-IN';
    case 'en':
    default:
      return 'en-IN';
  }
}

/**
 * Formats a number according to Indian Currency standard (e.g. ₹10,00,000) using Intl
 */
export function formatCurrency(val: number, lang: Language = 'en'): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  const rounded = Math.round(val);
  return new Intl.NumberFormat(getLocale(lang), {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rounded);
}

/**
 * Formats a standard number with Indian grouping (e.g. 10,00,000)
 */
export function formatNumber(val: number, lang: Language = 'en'): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return new Intl.NumberFormat(getLocale(lang)).format(val);
}

/**
 * Formats a date using Intl locale
 */
export function formatDate(
  date: Date | string | number,
  lang: Language = 'en',
  options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' }
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(getLocale(lang), options).format(d);
}

/**
 * Formats numbers into localized Indian denominations (Lakh / Crore)
 */
export function formatLakhsCrores(val: number, lang: Language = 'en'): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0';

  const croreUnit = lang === 'hi' ? 'करोड़' : lang === 'te' ? 'కోట్లు' : 'Cr';
  const lakhUnit = lang === 'hi' ? 'लाख' : lang === 'te' ? 'లక్షలు' : 'Lakh';

  if (Math.abs(val) >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} ${croreUnit}`;
  }
  if (Math.abs(val) >= 100000) {
    return `₹${(val / 100000).toFixed(2)} ${lakhUnit}`;
  }
  return formatCurrency(val, lang);
}
