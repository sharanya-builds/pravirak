/**
 * Pure functions for parsing and formatting Indian location hierarchies
 * (State, District, Block/Mandal/Tehsil, Village/Hamlet) from geocoding data.
 */

export interface LocationHierarchy {
  village: string | null;
  block: string | null;
  district: string | null;
  state: string | null;
}

export const NOT_AVAILABLE_TEXT = 'Not available for this address';

/**
 * Extracts standard administrative hierarchy from Nominatim address details
 * or equivalent geocoder response object.
 */
export function parseLocationHierarchy(addr: Record<string, any> | null | undefined): LocationHierarchy {
  if (!addr || typeof addr !== 'object') {
    return {
      village: null,
      block: null,
      district: null,
      state: null
    };
  }

  // Village / Gram Panchayat: village, hamlet, isolated_dwelling
  const village = (addr.village || addr.hamlet || addr.isolated_dwelling || '').trim() || null;

  // Block / Mandal / Tehsil / Taluk / Subdistrict
  const block = (
    addr.tehsil ||
    addr.taluk ||
    addr.mandal ||
    addr.subdistrict ||
    addr.county ||
    ''
  ).trim() || null;

  // District: state_district or district
  const district = (addr.state_district || addr.district || '').trim() || null;

  // State: state
  const state = (addr.state || '').trim() || null;

  return {
    village,
    block,
    district,
    state
  };
}

/**
 * Returns the field value if present, or "Not available for this address".
 * Never invents values.
 */
export function formatLocationField(
  val: string | null | undefined,
  fallback = NOT_AVAILABLE_TEXT
): string {
  if (!val || typeof val !== 'string' || !val.trim()) {
    return fallback;
  }
  return val.trim();
}
