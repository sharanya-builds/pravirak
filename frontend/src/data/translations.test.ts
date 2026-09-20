import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from './translations';

describe('Translations Parity Test across en, hi, and te', () => {
  const enKeys = Object.keys(TRANSLATIONS.en) as Array<keyof typeof TRANSLATIONS.en>;
  const hiKeys = Object.keys(TRANSLATIONS.hi) as Array<keyof typeof TRANSLATIONS.hi>;
  const teKeys = Object.keys(TRANSLATIONS.te) as Array<keyof typeof TRANSLATIONS.te>;

  it('has equal key count across en, hi, and te dictionaries', () => {
    expect(hiKeys.length).toBe(enKeys.length);
    expect(teKeys.length).toBe(enKeys.length);
  });

  it('every key present in en exists in hi with a non-empty string', () => {
    const missingInHi: string[] = [];
    const emptyInHi: string[] = [];

    for (const key of enKeys) {
      if (!(key in TRANSLATIONS.hi)) {
        missingInHi.push(key);
      } else if (typeof TRANSLATIONS.hi[key] !== 'string' || TRANSLATIONS.hi[key].trim().length === 0) {
        emptyInHi.push(key);
      }
    }

    expect(missingInHi).toEqual([]);
    expect(emptyInHi).toEqual([]);
  });

  it('every key present in en exists in te with a non-empty string', () => {
    const missingInTe: string[] = [];
    const emptyInTe: string[] = [];

    for (const key of enKeys) {
      if (!(key in TRANSLATIONS.te)) {
        missingInTe.push(key);
      } else if (typeof TRANSLATIONS.te[key] !== 'string' || TRANSLATIONS.te[key].trim().length === 0) {
        emptyInTe.push(key);
      }
    }

    expect(missingInTe).toEqual([]);
    expect(emptyInTe).toEqual([]);
  });

  it('no orphaned keys exist in hi or te that are absent from en', () => {
    const extraInHi = hiKeys.filter((k) => !enKeys.includes(k as any));
    const extraInTe = teKeys.filter((k) => !enKeys.includes(k as any));

    expect(extraInHi).toEqual([]);
    expect(extraInTe).toEqual([]);
  });
});
