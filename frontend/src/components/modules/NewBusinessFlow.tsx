import React, { useRef, useState, useMemo } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ChevronDown,
  Layers,
  MapPin,
  CheckCircle2,
  Check,
  Landmark
} from 'lucide-react';
import { BusinessInput, SelectedLocation } from '../../types';
import { formatINR } from '../../engine/financialEngine';
import { calculatePS } from '../../engine/psCalculator';
import { PrimaryButton } from '../common/PrimaryButton';
import { GooglePlacesSearch, GooglePlacesSearchHandle } from '../common/GooglePlacesSearch';
import { GoogleMapPreview } from '../common/GoogleMapPreview';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { useLanguage } from '../../context/LanguageContext';

interface NewBusinessFlowProps {
  initialIdea?: string;
  initialLocation?: SelectedLocation;
  initialCapital?: number;
  onSubmit: (input: BusinessInput) => void;
  onCancel: () => void;
  onSelectSamplePreset?: (idea: string, location: SelectedLocation, capital: number) => void;
}

const DEFAULT_LOCATION: SelectedLocation = {
  address: 'Madhapur Main Road, Hitec City, Hyderabad, Telangana - 500081',
  latitude: 17.4483,
  longitude: 78.3915,
  placeId: 'demo-madhapur-hyd',
  city: 'Hyderabad',
  state: 'Telangana',
  postalCode: '500081',
  source: 'GOOGLE_PLACES'
};

const QUICK_IDEA_SUGGESTIONS = [
  'I want to open a bakery and confectionery shop',
  'Kirana / general store',
  'Cloud kitchen for tiffin and delivery',
  'Mobile phone repair shop',
  'Garments and apparel boutique',
  'Dairy and milk supply business'
];

const SAMPLE_CASE_STUDIES: Array<{
  title: string;
  category: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  capital: number;
  description: string;
}> = [
  {
    title: 'Bakery & Confectionery',
    category: 'Bakery',
    locality: '100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    lat: 12.9719,
    lng: 77.6412,
    capital: 150000,
    description: 'Double deck electric oven, chilled display counters, high evening footfall'
  },
  {
    title: 'Kirana & FMCG Retail',
    category: 'Kirana',
    locality: 'Godowlia Chowk',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    pincode: '221001',
    lat: 25.3076,
    lng: 83.0064,
    capital: 100000,
    description: 'Packaged grocery staples, pilgrim tourist pedestrian catchment'
  },
  {
    title: 'Student Snack Cafe & Bakery',
    category: 'Student Cafe',
    locality: 'Boring Road Chauraha',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800001',
    lat: 25.6154,
    lng: 85.1147,
    capital: 80000,
    description: 'Grab-and-go rolls, patties, cold drinks near 35+ coaching institutes'
  },
  {
    title: 'Dairy Farming & Chilling',
    category: 'Dairy',
    locality: 'Amul Dairy Road',
    city: 'Anand',
    state: 'Gujarat',
    pincode: '388001',
    lat: 22.5645,
    lng: 72.9289,
    capital: 200000,
    description: '5-8 high-yield crossbreed cows, bulk chilling tank & institutional supply'
  },
  {
    title: 'Cloud Kitchen & Delivery',
    category: 'Cloud Kitchen',
    locality: 'Madhapur / Cyber Towers',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    lat: 17.4483,
    lng: 78.3915,
    capital: 120000,
    description: 'Commercial cooking ranges, delivery app reach across tech corridors'
  },
  {
    title: 'Garments & Apparel Boutique',
    category: 'Garments',
    locality: 'Raja Park, Lane 1',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302004',
    lat: 26.8920,
    lng: 75.8270,
    capital: 180000,
    description: "Ethnic women's festive wear, high spending residential market"
  }
];

type Step = 1 | 2 | 3;

const STEP_META: { step: Step; label: string }[] = [
  { step: 1, label: 'Business Idea' },
  { step: 2, label: 'Location' },
  { step: 3, label: 'Capital' }
];

export const NewBusinessFlow: React.FC<NewBusinessFlowProps> = ({
  initialIdea = 'Stationery shop in Madhapur Hyderabad',
  initialLocation = DEFAULT_LOCATION,
  initialCapital = 100000,
  onSubmit,
  onCancel,
  onSelectSamplePreset
}) => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [businessIdea, setBusinessIdea] = useState(initialIdea);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>(initialLocation);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const [ownCapital, setOwnCapital] = useState(initialCapital);
  const [showSamples, setShowSamples] = useState(false);

  const stepMeta: { step: Step; label: string }[] = [
    { step: 1, label: t.stepBusinessIdea },
    { step: 2, label: t.stepLocation },
    { step: 3, label: t.stepCapital }
  ];

  const quickIdeas = language === 'te' ? [
    'బేకరీ మరియు మిఠాయిల దుకాణం',
    'కిరాణా / జనరల్ స్టోర్',
    'టిఫిన్ & డెలివరీ కోసం క్లౌడ్ కిచెన్',
    'మొబైల్ ఫోన్ రిపేర్ షాప్',
    'దుస్తులు & వస్త్ర బొటిక్',
    'పాల సరఫరా & డెయిరీ వ్యాపారం'
  ] : language === 'hi' ? [
    'बेकरी और कन्फेक्शनरी दुकान',
    'किराना / जनरल स्टोर',
    'टिफिन और डिलीवरी के लिए क्लाउड किचन',
    'मोबाइल फोन मरम्मत दुकान',
    'कपड़े और परिधान बुटीक',
    'डेयरी और दूध आपूर्ति व्यवसाय'
  ] : QUICK_IDEA_SUGGESTIONS;

  // Optional profile fields
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [experience, setExperience] = useState<BusinessInput['experience']>('Beginner (<1 yr)');
  const [existingSpace, setExistingSpace] = useState<BusinessInput['existingSpace']>('Rented space');
  const [targetCustomers, setTargetCustomers] = useState<BusinessInput['targetCustomers']>('General Public / Walk-ins');
  const [preferredScale, setPreferredScale] = useState<BusinessInput['preferredScale']>('Small (Town/Zone)');

  const placesSearchRef = useRef<GooglePlacesSearchHandle>(null);

  const handleLocationPicked = (loc: SelectedLocation) => {
    setSelectedLocation(loc);
    setIsLocationConfirmed(false);
  };

  const handleConfirmLocation = () => {
    setIsLocationConfirmed(true);
  };

  const handleChangeLocation = () => {
    setIsLocationConfirmed(false);
    placesSearchRef.current?.focusAndSelect();
  };

  const handleCoordinatesAdjusted = (lat: number, lng: number) => {
    setSelectedLocation((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = () => {
    onSubmit({
      businessIdea,
      category: businessIdea,
      location: selectedLocation,
      ownCapital,
      experience,
      existingSpace,
      targetCustomers,
      preferredScale
    });
  };

  const handleApplySamplePreset = (preset: (typeof SAMPLE_CASE_STUDIES)[0]) => {
    const loc: SelectedLocation = {
      address: `${preset.locality}, ${preset.city}, ${preset.state} - ${preset.pincode}`,
      latitude: preset.lat,
      longitude: preset.lng,
      placeId: `sample-${preset.city.toLowerCase()}`,
      city: preset.city,
      state: preset.state,
      postalCode: preset.pincode,
      source: 'DEMO_SAMPLE'
    };

    setBusinessIdea(preset.title);
    setSelectedLocation(loc);
    setOwnCapital(preset.capital);
    setIsLocationConfirmed(true);

    if (onSelectSamplePreset) {
      onSelectSamplePreset(preset.title, loc, preset.capital);
    }
  };

  const canContinueStep1 = businessIdea.trim().length >= 3;
  const canContinueStep2 = isLocationConfirmed;

  // Live loan scheme preview from psCalculator
  const liveSchemePreview = useMemo(() => {
    if (!ownCapital || isNaN(ownCapital) || ownCapital <= 0) return null;
    try {
      const res = calculatePS(ownCapital);
      if (res.isEligible) {
        return {
          eligible: true,
          text: `₹${ownCapital.toLocaleString('en-IN')} supports a project up to ₹${res.projectCost.toLocaleString('en-IN')} (${res.schemeName}, ${res.interestRatePct}%)`,
        };
      } else {
        return {
          eligible: false,
          text: res.message || `₹${ownCapital.toLocaleString('en-IN')} exceeds scheme limits (Maximum project cost ₹50,00,000)`,
        };
      }
    } catch {
      return null;
    }
  }, [ownCapital]);

  const goToStep = (step: Step) => {
    if (step === 2 && !canContinueStep1) return;
    if (step === 3 && !(canContinueStep1 && canContinueStep2)) return;
    setCurrentStep(step);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Wizard Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-10 pt-6 sm:pt-8 pb-5 border-b border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-900 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-indigo-900" />
              {t.newVentureInitiation}
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-slate-500 hover:text-slate-800 font-semibold"
            >
              {t.cancelButton}
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {t.tellPravirakAbout}
          </h2>
          <p className="text-sm text-slate-600 mt-1.5">
            {t.threeQuickSteps}
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-6">
            {stepMeta.map(({ step, label }, idx) => {
              const isDone =
                (step === 1 && canContinueStep1 && currentStep > 1) ||
                (step === 2 && canContinueStep2 && currentStep > 2);
              const isActive = currentStep === step;
              const isReachable = step === 1 || (step === 2 && canContinueStep1) || (step === 3 && canContinueStep1 && canContinueStep2);

              return (
                <React.Fragment key={step}>
                  <button
                    type="button"
                    onClick={() => goToStep(step)}
                    disabled={!isReachable}
                    className={`flex items-center gap-2 shrink-0 ${isReachable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 transition-all ${
                        isActive
                          ? 'bg-[#1E3A8A] text-white shadow-md ring-4 ring-blue-100'
                          : isDone
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4 text-white" /> : step}
                    </span>
                    <span
                      className={`text-sm font-bold hidden sm:inline ${
                        isActive ? 'text-[#1E3A8A] font-extrabold' : isDone ? 'text-emerald-700 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                  {idx < stepMeta.length - 1 && <div className="flex-1 h-0.5 bg-slate-200 rounded-full" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step body */}
        <div className="px-6 sm:px-10 py-7 sm:py-8">
          {/* STEP 1: Business Idea */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-base font-bold text-slate-900 mb-1.5">
                  {t.whatDoYouWantToStart} <span className="text-rose-600">*</span>
                </label>
                <p className="text-sm text-slate-600 mb-3">
                  {t.describeInOwnWords}
                </p>
                <div className="relative">
                  <textarea
                    required
                    rows={3}
                    value={businessIdea}
                    onChange={(e) => setBusinessIdea(e.target.value)}
                    placeholder={t.describeHint}
                    className="w-full text-base px-4 py-3.5 pr-12 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-900 focus:bg-white focus:outline-hidden text-slate-900 font-medium"
                  />
                  <div className="absolute right-3 bottom-3">
                    <VoiceInputButton
                      size="sm"
                      onTranscript={(spokenText) => {
                        setBusinessIdea((prev) => (prev.trim() ? `${prev.trim()} ${spokenText}` : spokenText));
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">{t.pickCommonIdea}</p>
                <div className="flex flex-wrap gap-2">
                  {quickIdeas.map((idea, idx) => {
                    const pillThemes = [
                      'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200/90',
                      'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-200/90',
                      'bg-sky-50 hover:bg-sky-100 text-sky-950 border-sky-200/90',
                      'bg-rose-50 hover:bg-rose-100 text-rose-950 border-rose-200/90',
                      'bg-teal-50 hover:bg-teal-100 text-teal-950 border-teal-200/90',
                      'bg-violet-50 hover:bg-violet-100 text-violet-950 border-violet-200/90',
                      'bg-orange-50 hover:bg-orange-100 text-orange-950 border-orange-200/90',
                    ];
                    const inactiveTheme = pillThemes[idx % pillThemes.length];

                    return (
                      <button
                        key={idea}
                        type="button"
                        onClick={() => setBusinessIdea(idea)}
                        className={`text-xs sm:text-sm px-3.5 py-2 rounded-xl border font-semibold transition-all cursor-pointer ${
                          businessIdea === idea
                            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm scale-[1.02] font-bold'
                            : inactiveTheme
                        }`}
                      >
                        {idea}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-base font-bold text-slate-900 mb-1.5">
                  {t.whereStartBusiness} <span className="text-rose-600">*</span>
                </label>
                <p className="text-sm text-slate-600 mb-3">
                  {t.enterAreaLandmark}
                </p>
                <GooglePlacesSearch ref={placesSearchRef} onLocationSelected={handleLocationPicked} initialValue={selectedLocation.address} />
              </div>

              <GoogleMapPreview
                location={selectedLocation}
                onConfirm={handleConfirmLocation}
                onChangeLocation={handleChangeLocation}
                onCoordinatesAdjusted={handleCoordinatesAdjusted}
              />

              {isLocationConfirmed && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-sm text-emerald-900 font-semibold">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                  <span>{t.locationConfirmed} {t.readyForNextStep}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Capital + optional profile */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-base font-bold text-slate-900 mb-1.5">
                  {t.ownCapitalMarginLabel} <span className="text-rose-600">*</span>
                </label>
                <p className="text-sm text-slate-600 mb-3">
                  {t.ownSavingsDesc}
                </p>
                <div className="relative max-w-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-bold text-lg">
                    ₹
                  </div>
                  <input
                    type="number"
                    required
                    min={20000}
                    max={5000000}
                    step={10000}
                    value={ownCapital}
                    onChange={(e) => setOwnCapital(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-900 focus:bg-white text-lg font-bold font-mono text-slate-900 focus:outline-hidden"
                  />
                </div>
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300/80 rounded-xl text-base font-black font-mono shadow-2xs">
                  <span>{formatINR(ownCapital)}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {[50000, 100000, 150000, 250000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setOwnCapital(amt)}
                      className={`text-xs sm:text-sm px-3.5 py-2 rounded-xl border font-mono font-bold transition-all cursor-pointer ${
                        ownCapital === amt
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-[1.02]'
                          : 'bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 border-emerald-300/80 hover:border-emerald-400'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>

                {/* Live scheme loan preview from psCalculator */}
                {liveSchemePreview && (
                  <div
                    className={`mt-4 p-3.5 rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-all ${
                      liveSchemePreview.eligible
                        ? 'bg-indigo-50/70 border-indigo-200/80 text-indigo-950'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                    data-testid="capital-live-preview"
                  >
                    <Landmark className="w-4 h-4 text-indigo-900 shrink-0" />
                    <span>{liveSchemePreview.text}</span>
                  </div>
                )}
              </div>

              {/* Optional Profile Accordion */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                  className="w-full p-4 bg-slate-50 hover:bg-slate-100/70 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5 text-indigo-900" />
                    <span className="text-sm font-bold text-slate-800">{t.optionalDetails}</span>
                    <span className="text-xs text-slate-500 font-normal hidden sm:inline">
                      {t.refinesSubsidyMatching}
                    </span>
                  </div>
                  <ChevronDown className={`w-4.5 h-4.5 text-slate-500 transition-transform ${showOptionalFields ? 'rotate-180' : ''}`} />
                </button>

                {showOptionalFields && (
                  <div className="p-4 sm:p-5 border-t border-slate-200 space-y-4 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                          {t.priorExperience}
                        </label>
                        <select
                          value={experience}
                          onChange={(e) => setExperience(e.target.value as any)}
                          className="w-full text-sm px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-800"
                        >
                          <option value="Beginner (<1 yr)">{t.beginnerExperience}</option>
                          <option value="Moderate (1-3 yrs)">{t.moderateExperience}</option>
                          <option value="Experienced (3+ yrs)">{t.experiencedLevel}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                          {t.shopAvailability}
                        </label>
                        <select
                          value={existingSpace}
                          onChange={(e) => setExistingSpace(e.target.value as any)}
                          className="w-full text-sm px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-800"
                        >
                          <option value="Rented space">{t.rentedSpace}</option>
                          <option value="Owned premises">{t.ownedPremises}</option>
                          <option value="Not yet secured">{t.notYetSecured}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                          {t.targetCustomers}
                        </label>
                        <select
                          value={targetCustomers}
                          onChange={(e) => setTargetCustomers(e.target.value as any)}
                          className="w-full text-sm px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-800"
                        >
                          <option value="General Public / Walk-ins">{t.generalPublic}</option>
                          <option value="Students & Youth">{t.studentsYouth}</option>
                          <option value="Offices & Corporate">{t.officesCorporate}</option>
                          <option value="Wholesale / B2B">{t.wholesaleB2B}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                          {t.preferredScale}
                        </label>
                        <select
                          value={preferredScale}
                          onChange={(e) => setPreferredScale(e.target.value as any)}
                          className="w-full text-sm px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-800"
                        >
                          <option value="Micro (Local)">{t.microScale}</option>
                          <option value="Small (Town/Zone)">{t.smallScale}</option>
                          <option value="Medium (Regional)">{t.mediumScale}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="px-6 sm:px-10 py-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => (s - 1) as Step)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backButton}
            </button>
          ) : (
            <span />
          )}

          {currentStep < 3 ? (
            <PrimaryButton
              type="button"
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              disabled={currentStep === 1 ? !canContinueStep1 : !canContinueStep2}
              onClick={() => setCurrentStep((s) => (s + 1) as Step)}
            >
              {t.continueButton}
            </PrimaryButton>
          ) : (
            <PrimaryButton
              type="button"
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={handleSubmit}
            >
              {t.analyseMyBusiness}
            </PrimaryButton>
          )}
        </div>
      </div>

      {/* Sample business studies — collapsed by default to keep the first screen simple */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSamples((v) => !v)}
          className="w-full flex items-center justify-between gap-2 p-5 sm:p-6 text-left cursor-pointer"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-1.5">
              {t.demoCaseStudies}
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">{t.trySampleInstead}</h3>
            <p className="text-sm text-slate-600 mt-0.5">
              {t.sampleEnterprisesDesc}
            </p>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${showSamples ? 'rotate-180' : ''}`} />
        </button>

        {showSamples && (
          <div className="px-5 sm:px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {SAMPLE_CASE_STUDIES.map((sample, idx) => (
              <div
                key={idx}
                onClick={() => handleApplySamplePreset(sample)}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
                      {t.sampleBadge}
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-700">{formatINR(sample.capital)}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-950 transition-colors">
                    {sample.title}
                  </h4>

                  <div className="text-sm text-slate-600 mt-0.5 mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {sample.locality}, {sample.city}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-snug">{sample.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 text-sm font-semibold text-indigo-900 flex items-center justify-between">
                  <span>{t.loadSampleParams}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
