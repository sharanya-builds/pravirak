import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { SelectedLocation } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface GooglePlacesSearchProps {
  onLocationSelected: (location: SelectedLocation) => void;
  initialValue?: string;
}

interface KnownIndianLocation {
  name: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
}

const INDIAN_GEODATA: KnownIndianLocation[] = [
  // Hyderabad
  { name: 'Madhapur', locality: 'Hitec City / Cyberabad', city: 'Hyderabad', state: 'Telangana', pincode: '500081', lat: 17.4483, lng: 78.3915 },
  { name: 'Kukatpally', locality: 'KPHB Colony / JNTU', city: 'Hyderabad', state: 'Telangana', pincode: '500072', lat: 17.4933, lng: 78.3995 },
  { name: 'Gachibowli', locality: 'Financial District', city: 'Hyderabad', state: 'Telangana', pincode: '500032', lat: 17.4401, lng: 78.3489 },
  { name: 'Banjara Hills', locality: 'Road No. 12', city: 'Hyderabad', state: 'Telangana', pincode: '500034', lat: 17.4156, lng: 78.4350 },
  { name: 'Jubilee Hills', locality: 'Check Post / Road 36', city: 'Hyderabad', state: 'Telangana', pincode: '500033', lat: 17.4319, lng: 78.4073 },
  { name: 'Ameerpet', locality: 'Commercial Education Hub', city: 'Hyderabad', state: 'Telangana', pincode: '500016', lat: 17.4375, lng: 78.4482 },
  { name: 'Secunderabad', locality: 'Clock Tower / Station Road', city: 'Hyderabad', state: 'Telangana', pincode: '500003', lat: 17.4399, lng: 78.4983 },
  // Bengaluru
  { name: 'Indiranagar', locality: '100 Feet Road / CMH Rd', city: 'Bengaluru', state: 'Karnataka', pincode: '560038', lat: 12.9719, lng: 77.6412 },
  { name: 'Koramangala', locality: 'Sony World Signal / 5th Block', city: 'Bengaluru', state: 'Karnataka', pincode: '560095', lat: 12.9352, lng: 77.6245 },
  { name: 'Whitefield', locality: 'ITPL Main Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560066', lat: 12.9698, lng: 77.7500 },
  { name: 'HSR Layout', locality: '27th Main Commercial Sector', city: 'Bengaluru', state: 'Karnataka', pincode: '560102', lat: 12.9121, lng: 77.6446 },
  { name: 'Jayanagar', locality: '4th Block Shopping Complex', city: 'Bengaluru', state: 'Karnataka', pincode: '560011', lat: 12.9308, lng: 77.5838 },
  // Patna
  { name: 'Boring Road', locality: 'Chauraha / AN College', city: 'Patna', state: 'Bihar', pincode: '800001', lat: 25.6154, lng: 85.1147 },
  { name: 'Kankarbagh', locality: 'Main Road / Colony', city: 'Patna', state: 'Bihar', pincode: '800020', lat: 25.5941, lng: 85.1558 },
  { name: 'Bailey Road', locality: 'Saguna More / Raja Bazar', city: 'Patna', state: 'Bihar', pincode: '800014', lat: 25.6093, lng: 85.0841 },
  // Varanasi
  { name: 'Godowlia Chowk', locality: 'Dashashwamedh Road', city: 'Varanasi', state: 'Uttar Pradesh', pincode: '221001', lat: 25.3076, lng: 83.0064 },
  { name: 'Sigra', locality: 'Commercial Belt / IP Mall', city: 'Varanasi', state: 'Uttar Pradesh', pincode: '221002', lat: 25.3176, lng: 82.9875 },
  // Anand
  { name: 'Amul Dairy Road', locality: 'Gamdi / Station Rd', city: 'Anand', state: 'Gujarat', pincode: '388001', lat: 22.5645, lng: 72.9289 },
  { name: 'Vallabh Vidyanagar', locality: 'SP University Campus', city: 'Anand', state: 'Gujarat', pincode: '388120', lat: 22.5528, lng: 72.9239 },
  // Jaipur
  { name: 'Raja Park', locality: 'Lane 1 / Fashion Street', city: 'Jaipur', state: 'Rajasthan', pincode: '302004', lat: 26.8920, lng: 75.8270 },
  { name: 'Malviya Nagar', locality: 'Calgiri Marg / WTP Mall', city: 'Jaipur', state: 'Rajasthan', pincode: '302017', lat: 26.8539, lng: 75.8193 },
  { name: 'Mansarovar', locality: 'Madhyam Marg Market', city: 'Jaipur', state: 'Rajasthan', pincode: '302020', lat: 26.8624, lng: 75.7610 },
  // Delhi NCR
  { name: 'Connaught Place', locality: 'Inner Circle', city: 'New Delhi', state: 'Delhi', pincode: '110001', lat: 28.6315, lng: 77.2167 },
  { name: 'Lajpat Nagar', locality: 'Central Market', city: 'New Delhi', state: 'Delhi', pincode: '110024', lat: 28.5677, lng: 77.2433 },
  { name: 'Chandni Chowk', locality: 'Main Bazaar', city: 'Delhi', state: 'Delhi', pincode: '110006', lat: 28.6506, lng: 77.2303 },
  // Mumbai & Pune
  { name: 'Andheri West', locality: 'Lokhandwala Complex', city: 'Mumbai', state: 'Maharashtra', pincode: '400053', lat: 19.1363, lng: 72.8277 },
  { name: 'Dadar West', locality: 'Shivaji Park / Station Market', city: 'Mumbai', state: 'Maharashtra', pincode: '400028', lat: 19.0222, lng: 72.8436 },
  { name: 'Kothrud', locality: 'Paud Road / Karve Statue', city: 'Pune', state: 'Maharashtra', pincode: '411038', lat: 18.5074, lng: 73.8077 },
  // Kolkata & Chennai
  { name: 'Salt Lake', locality: 'Sector 5 Tech Park', city: 'Kolkata', state: 'West Bengal', pincode: '700091', lat: 22.5804, lng: 88.4378 },
  { name: 'T Nagar', locality: 'Ranganathan Street', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017', lat: 13.0418, lng: 80.2341 },
  // Rural / Village entries
  { name: 'Konne', locality: 'Bachannapet Mandal', city: 'Jangaon', state: 'Telangana', pincode: '506221', lat: 17.8420, lng: 79.2510 },
  { name: 'Bachannapet', locality: 'Jangaon District', city: 'Jangaon', state: 'Telangana', pincode: '506221', lat: 17.8180, lng: 79.2390 },
  { name: 'Narsampet', locality: 'Warangal Rural District', city: 'Narsampet', state: 'Telangana', pincode: '506132', lat: 17.9268, lng: 79.8950 },
  { name: 'Loni', locality: 'Rahata Taluka', city: 'Ahmednagar', state: 'Maharashtra', pincode: '413736', lat: 19.6180, lng: 74.6520 },
  { name: 'Masauli', locality: 'Ramnagar Block', city: 'Barabanki', state: 'Uttar Pradesh', pincode: '225414', lat: 26.9520, lng: 81.3980 },
  { name: 'Bikram', locality: 'Bikram Block', city: 'Patna Rural', state: 'Bihar', pincode: '801108', lat: 25.4520, lng: 84.8510 },
  { name: 'Talwandi Sabo', locality: 'Damdama Sahib Road', city: 'Bathinda', state: 'Punjab', pincode: '151302', lat: 29.9820, lng: 75.0890 },
  { name: 'Anekal', locality: 'Bengaluru Rural District', city: 'Anekal', state: 'Karnataka', pincode: '562106', lat: 12.7110, lng: 77.6950 },
  { name: 'Kishangarh Renwal', locality: 'Jaipur Rural', city: 'Kishangarh Renwal', state: 'Rajasthan', pincode: '303702', lat: 27.0480, lng: 75.5960 },
  { name: 'Rajapur', locality: 'Ratnagiri District', city: 'Rajapur', state: 'Maharashtra', pincode: '416702', lat: 16.6564, lng: 73.5197 },
  { name: 'Gadag', locality: 'Gadag-Betageri', city: 'Gadag', state: 'Karnataka', pincode: '582101', lat: 15.4193, lng: 75.6240 },
  { name: 'Khammam', locality: 'Bus Stand Area', city: 'Khammam', state: 'Telangana', pincode: '507001', lat: 17.2473, lng: 80.1514 },
  { name: 'Karim Nagar', locality: 'Jagtial Road', city: 'Karimnagar', state: 'Telangana', pincode: '505001', lat: 18.4386, lng: 79.1288 },
  { name: 'Narasaraopet', locality: 'Guntur District', city: 'Narasaraopet', state: 'Andhra Pradesh', pincode: '522601', lat: 16.2343, lng: 80.0484 },
];

interface PlaceCandidate {
  description: string;
  placeId?: string;
  mainText: string;
  secondaryText: string;
  locationData?: KnownIndianLocation;
  resolved?: SelectedLocation;
}

async function geocodeWithNominatim(query: string, signal?: AbortSignal): Promise<SelectedLocation[]> {
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:4000/api';

  try {
    const res = await fetch(`${apiBase}/geocode/search?q=${encodeURIComponent(query)}`, { signal });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.results) && data.results.length > 0) return data.results as SelectedLocation[];
    }
  } catch {
    // fallback to direct Nominatim
  }

  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=10&countrycodes=in&accept-language=en&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Nominatim request failed (${res.status})`);
  const data: any[] = await res.json();
  return data.map((item) => {
    const addr = item.address || {};
    const city = addr.city || addr.town || addr.village || addr.hamlet || addr.municipality || addr.locality || addr.suburb || addr.county || addr.state_district || 'Unknown';
    return {
      address: item.display_name as string,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      placeId: `osm-${item.place_id}`,
      city,
      state: addr.state || '',
      postalCode: addr.postcode || '',
      source: 'OPENSTREETMAP' as const,
    };
  });
}

export interface GooglePlacesSearchHandle {
  focusAndSelect: () => void;
}

export const GooglePlacesSearch = React.forwardRef<GooglePlacesSearchHandle, GooglePlacesSearchProps>(({
  onLocationSelected,
  initialValue = ''
}, ref) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState(initialValue);
  const [predictions, setPredictions] = useState<PlaceCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isResolvingSelection, setIsResolvingSelection] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const nominatimAbortRef = useRef<AbortController | null>(null);
  const geocodeRequestIdRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    focusAndSelect: () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setPredictions([]);
      setIsDropdownOpen(false);
      return;
    }
    const timer = setTimeout(() => runGeocoding(query.trim()), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const runGeocoding = (input: string) => {
    setIsLoading(true);
    setGeocodeError(null);

    const q = input.toLowerCase().trim();
    const queryParts = q.split(/[,\s\/]+/).map(p => p.trim().toLowerCase()).filter(p => p.length >= 2);
    const localMatches = INDIAN_GEODATA.filter((item) => {
      const nameL = item.name.toLowerCase();
      const cityL = item.city.toLowerCase();
      const localityL = item.locality.toLowerCase();
      const stateL = item.state.toLowerCase();
      return queryParts.some(part =>
        nameL.includes(part) || part.includes(nameL) ||
        cityL.includes(part) || part.includes(cityL) ||
        localityL.includes(part) ||
        stateL.includes(part) ||
        item.pincode.includes(part)
      );
    });

    const localPredictions: PlaceCandidate[] = localMatches.map((m) => ({
      description: `${m.name}, ${m.locality}, ${m.city}, ${m.state} - ${m.pincode}`,
      placeId: `pvk-local-${m.name.toLowerCase().replace(/\s+/g, '-')}`,
      mainText: m.name,
      secondaryText: `${m.locality}, ${m.city}, ${m.state} (${m.pincode})`,
      locationData: m,
    }));

    setPredictions(localPredictions);
    setIsDropdownOpen(localPredictions.length > 0);

    nominatimAbortRef.current?.abort();
    const controller = new AbortController();
    nominatimAbortRef.current = controller;
    const requestId = ++geocodeRequestIdRef.current;

    geocodeWithNominatim(input, controller.signal)
      .then((results) => {
        if (geocodeRequestIdRef.current !== requestId) return;
        setIsLoading(false);
        const osmPredictions: PlaceCandidate[] = results.map((loc) => ({
          description: loc.address,
          placeId: loc.placeId,
          mainText: loc.address.split(',')[0],
          secondaryText: loc.address.split(',').slice(1, 4).join(',').trim(),
          resolved: loc,
        }));

        const deduped = osmPredictions.filter(
          (o) =>
            !localMatches.some(
              (l) =>
                o.resolved &&
                Math.abs(l.lat - o.resolved.latitude) < 0.0015 &&
                Math.abs(l.lng - o.resolved.longitude) < 0.0015
            )
        );

        const merged = [...localPredictions, ...deduped];
        setPredictions(merged);
        setIsDropdownOpen(merged.length > 0);
        if (merged.length === 0) {
          setGeocodeError(
            language === 'te'
              ? `"${input}" కోసం స్థానం కనుగొనబడలేదు. దగ్గరి ల్యాండ్మార్క్ లేదా PIN కోడ్ ప్రయత్నించండి.`
              : language === 'hi'
              ? `"${input}" के लिए कोई स्थान नहीं मिला। पास के लैंडमार्क या PIN कोड आज़माएँ।`
              : `No matching location found for "${input}". Try a nearby landmark, locality, or PIN code.`
          );
        }
      })
      .catch((err) => {
        if (geocodeRequestIdRef.current !== requestId) return;
        setIsLoading(false);
        if (localPredictions.length === 0) {
          setGeocodeError(
            err?.name === 'AbortError'
              ? (language === 'te' ? 'స్థాన శోధన గడువు తీరింది. మళ్ళీ ప్రయత్నించండి.' : language === 'hi' ? 'स्थान खोज समय समाप्त हो गया। पुनः प्रयास करें।' : 'Location search timed out. Please try again.')
              : (language === 'te' ? 'స్థాన శోధన సేవను చేరుకోలేకపోయింది.' : language === 'hi' ? 'स्थान खोज सेवा से कनेक्ट नहीं हो सका।' : 'Could not reach the location search service.')
          );
        }
      });
  };

  const handleSelectPrediction = async (prediction: PlaceCandidate) => {
    setIsDropdownOpen(false);

    // Already resolved
    if (prediction.resolved) {
      setQuery(prediction.resolved.address); // Show FULL address
      onLocationSelected(prediction.resolved);
      return;
    }

    // Local DB
    if (prediction.locationData) {
      const loc = prediction.locationData;
      const fullAddress = `${loc.name}, ${loc.locality}, ${loc.city}, ${loc.state} - ${loc.pincode}`;
      setQuery(fullAddress);
      onLocationSelected({
        address: fullAddress,
        latitude: loc.lat,
        longitude: loc.lng,
        placeId: prediction.placeId,
        city: loc.city,
        state: loc.state,
        postalCode: loc.pincode,
        source: 'DEMO_SAMPLE',
      });
      return;
    }

    // Fallback: geocode the typed text
    setIsResolvingSelection(true);
    setGeocodeError(null);
    try {
      const results = await geocodeWithNominatim(prediction.description);
      setIsResolvingSelection(false);
      if (results.length > 0) {
        setQuery(results[0].address); // Full address
        onLocationSelected(results[0]);
        return;
      }
    } catch { /* ignore */ }

    setIsResolvingSelection(false);
    setQuery(prediction.description);
    setGeocodeError(
      language === 'te'
        ? `"${prediction.description}" కోసం పిన్ ఉంచబడింది. మ్యాప్పై సరైన స్థానానికి లాగండి.`
        : language === 'hi'
        ? `"${prediction.description}" के लिए पिन रखा गया। सटीक स्थान के लिए मानचित्र पर खींचें।`
        : `Pin placed for "${prediction.description}". Drag on map to fine-tune.`
    );
    onLocationSelected({
      address: prediction.description,
      latitude: 17.3850,
      longitude: 78.4867,
      placeId: `custom-${Date.now()}`,
      city: 'Unknown',
      state: 'Unknown',
      postalCode: '',
      source: 'USER_INPUT_APPROX',
    });
  };

  const handleClear = () => {
    setQuery('');
    setPredictions([]);
    setIsDropdownOpen(false);
    setGeocodeError(null);
  };

  const QUICK_LOCALITIES = [
    { label: language === 'te' ? 'మాధాపూర్, హైదరాబాద్' : language === 'hi' ? 'मधापुर, हैदराबाद' : 'Madhapur, Hyderabad', query: 'Madhapur, Hyderabad' },
    { label: language === 'te' ? 'బోరింగ్ రోడ్, పాట్నా' : language === 'hi' ? 'बोरिंग रोड, पटना' : 'Boring Road, Patna', query: 'Boring Road, Patna' },
    { label: language === 'te' ? 'కొన్నె, జనగాం (గ్రామీణ)' : language === 'hi' ? 'कोन्ने, जनगांव (ग्रामीण)' : 'Konne, Jangaon (Rural)', query: 'Konne, Bachannapet, Jangaon, Telangana' },
    { label: language === 'te' ? 'లోని, అహ్మద్నగర్ (గ్రామీణ)' : language === 'hi' ? 'लोनी, अहमदनगर (ग्रामीण)' : 'Loni, Ahmednagar (Rural)', query: 'Loni, Rahata, Ahmednagar, Maharashtra' },
    { label: language === 'te' ? 'మాసౌలి, బారాబంకి (గ్రామీణ)' : language === 'hi' ? 'मसौली, बाराबंकी (ग्रामीण)' : 'Masauli, Barabanki (Rural)', query: 'Masauli, Barabanki, Uttar Pradesh' },
    { label: language === 'te' ? 'నర్సారావుపేట, ఆంధ్రప్రదేశ్' : language === 'hi' ? 'नरसरावपेट, आंध्रप्रदेश' : 'Narasaraopet, Andhra Pradesh', query: 'Narasaraopet, Guntur, Andhra Pradesh' },
  ];

  const searchPlaceholder = language === 'te'
    ? 'చిరునామా, ప్రాంతం, ల్యాండ్మార్క్ లేదా గ్రామం వెతకండి...'
    : language === 'hi'
    ? 'पता, क्षेत्र, लैंडमार्क या गांव खोजें...'
    : 'Search full address, area, village, landmark or PIN code...';

  const quickLabel = language === 'te' ? 'త్వరిత స్థాన సూచనలు:' : language === 'hi' ? 'त्वरित स्थान सुझाव:' : 'Quick Locations:';

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          {isLoading || isResolvingSelection ? (
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          ) : (
            <Search className="w-5 h-5 text-slate-400" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (predictions.length > 0) setIsDropdownOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim().length >= 2) {
              e.preventDefault();
              setIsDropdownOpen(false);
              handleSelectPrediction({ description: query.trim(), mainText: query.trim(), secondaryText: '' });
            }
          }}
          placeholder={searchPlaceholder}
          className="w-full pl-12 pr-10 py-4 bg-white dark:bg-[#141414] border-2 border-slate-300 dark:border-neutral-700 rounded-xl text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:bg-white dark:focus:bg-[#161616] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all shadow-sm"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-neutral-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {geocodeError && (
        <div className="mt-2 text-sm text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-[#1F1404] border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 font-medium">
          {geocodeError}
        </div>
      )}

      {/* Autocomplete Dropdown */}
      {isDropdownOpen && predictions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#0D0D0D] rounded-xl shadow-2xl border-2 border-slate-200 dark:border-neutral-800 z-50 overflow-hidden divide-y divide-slate-100 dark:divide-neutral-800 max-h-80 overflow-y-auto">
          {predictions.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPrediction(p)}
              className="w-full text-left p-4 hover:bg-indigo-50 dark:hover:bg-[#1A1A1A] transition-colors flex items-start gap-3 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-[#1F1F1F] group-hover:bg-indigo-100 dark:group-hover:bg-[#2A2A2A] flex items-center justify-center text-slate-500 dark:text-neutral-400 group-hover:text-indigo-700 dark:group-hover:text-white shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                  {p.mainText}
                  {p.resolved?.source === 'OPENSTREETMAP' && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full px-1.5 py-0.5 shrink-0">
                      OSM
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 font-medium">
                  {p.secondaryText}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Quick Locality Shortcuts */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-extrabold text-slate-700 dark:text-neutral-300">{quickLabel}</span>
        {QUICK_LOCALITIES.map((example) => (
          <button
            key={example.query}
            type="button"
            onClick={() => {
              setQuery(example.query);
              runGeocoding(example.query);
            }}
            className="px-3 py-1.5 bg-sky-50/80 hover:bg-sky-100 dark:bg-[#141414] dark:hover:bg-[#202020] text-sky-950 dark:text-neutral-200 font-bold rounded-xl transition-all border border-sky-200/80 dark:border-neutral-700 hover:border-sky-300 dark:hover:border-neutral-500 text-xs shadow-2xs cursor-pointer active:scale-95"
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
});

GooglePlacesSearch.displayName = 'GooglePlacesSearch';
