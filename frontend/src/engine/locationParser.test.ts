import { describe, it, expect } from 'vitest';
import {
  parseLocationHierarchy,
  formatLocationField,
  NOT_AVAILABLE_TEXT
} from './locationParser';

describe('locationParser', () => {
  describe('parseLocationHierarchy', () => {
    it('parses complete address details correctly', () => {
      const addr = {
        village: 'Pembarthi',
        tehsil: 'Jangaon Mandal',
        state_district: 'Jangaon',
        state: 'Telangana'
      };

      const result = parseLocationHierarchy(addr);

      expect(result).toEqual({
        village: 'Pembarthi',
        block: 'Jangaon Mandal',
        district: 'Jangaon',
        state: 'Telangana'
      });
    });

    it('falls back to alternative block keys (taluk, mandal, subdistrict, county)', () => {
      expect(parseLocationHierarchy({ mandal: 'Bachannapet' }).block).toBe('Bachannapet');
      expect(parseLocationHierarchy({ taluk: 'Rahata Taluka' }).block).toBe('Rahata Taluka');
      expect(parseLocationHierarchy({ subdistrict: 'Bikram Sub' }).block).toBe('Bikram Sub');
      expect(parseLocationHierarchy({ county: 'Warangal County' }).block).toBe('Warangal County');
    });

    it('falls back to alternative village keys (hamlet, isolated_dwelling)', () => {
      expect(parseLocationHierarchy({ hamlet: 'Alimpur Hamlet' }).village).toBe('Alimpur Hamlet');
      expect(parseLocationHierarchy({ isolated_dwelling: 'Dardapally Dhani' }).village).toBe('Dardapally Dhani');
    });

    it('falls back to district key if state_district is absent', () => {
      expect(parseLocationHierarchy({ district: 'Warangal' }).district).toBe('Warangal');
    });

    it('handles partial address details without inventing values', () => {
      const addr = {
        state: 'Telangana',
        city: 'Hyderabad'
      };

      const result = parseLocationHierarchy(addr);

      expect(result).toEqual({
        village: null,
        block: null,
        district: null,
        state: 'Telangana'
      });
    });

    it('handles empty address object', () => {
      const result = parseLocationHierarchy({});
      expect(result).toEqual({
        village: null,
        block: null,
        district: null,
        state: null
      });
    });

    it('handles null and undefined input gracefully', () => {
      expect(parseLocationHierarchy(null)).toEqual({
        village: null,
        block: null,
        district: null,
        state: null
      });
      expect(parseLocationHierarchy(undefined)).toEqual({
        village: null,
        block: null,
        district: null,
        state: null
      });
    });

    it('trims whitespace and converts empty strings to null', () => {
      const addr = {
        village: '   ',
        block: '  ',
        district: ' Jangaon ',
        state: ' Telangana '
      };

      const result = parseLocationHierarchy(addr);

      expect(result).toEqual({
        village: null,
        block: null,
        district: 'Jangaon',
        state: 'Telangana'
      });
    });
  });

  describe('formatLocationField', () => {
    it('returns the field string when present and valid', () => {
      expect(formatLocationField('Pembarthi')).toBe('Pembarthi');
      expect(formatLocationField('  Jangaon  ')).toBe('Jangaon');
    });

    it('returns fallback text when field is null, undefined, or empty', () => {
      expect(formatLocationField(null)).toBe(NOT_AVAILABLE_TEXT);
      expect(formatLocationField(undefined)).toBe(NOT_AVAILABLE_TEXT);
      expect(formatLocationField('')).toBe(NOT_AVAILABLE_TEXT);
      expect(formatLocationField('   ')).toBe(NOT_AVAILABLE_TEXT);
    });

    it('allows custom fallback text', () => {
      expect(formatLocationField(null, 'N/A')).toBe('N/A');
    });
  });
});
