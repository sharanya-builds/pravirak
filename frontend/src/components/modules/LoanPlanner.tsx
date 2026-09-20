import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Building2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Download,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Calendar,
  Percent,
  Clock,
  Landmark,
  FileSpreadsheet
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  STATIC_LOCATIONS,
  OTHER_OPTION_VALUE,
  BUSINESS_CATEGORIES,
  StateData,
  DistrictData,
  BlockData
} from '../../data/locations';
import {
  calculatePS,
  PSCalculatorResult,
  PSCalculatorEligibleResult,
  MoratoriumInterestTreatment,
  RepaymentType,
  RepaymentQuarterRow
} from '../../engine/psCalculator';

export interface LoanPlannerProps {
  onContinueToFeasibility?: (
    planResult: PSCalculatorEligibleResult,
    category: string,
    locationSummary: string
  ) => void;
  onBackToHome?: () => void;
}

const PRESET_MARGINS = [10000, 50000, 100000, 500000];

export const LoanPlanner: React.FC<LoanPlannerProps> = ({
  onContinueToFeasibility,
  onBackToHome
}) => {
  const { t } = useLanguage();

  // Screen state
  const [activeScreen, setActiveScreen] = useState<'INPUTS' | 'RESULTS'>('INPUTS');

  // Input states
  const [selectedStateId, setSelectedStateId] = useState<string>('telangana');
  const [manualStateName, setManualStateName] = useState<string>('');

  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('jangaon');
  const [manualDistrictName, setManualDistrictName] = useState<string>('');

  const [selectedBlockId, setSelectedBlockId] = useState<string>('jangaon_mandal');
  const [manualBlockName, setManualBlockName] = useState<string>('');

  const [selectedVillageName, setSelectedVillageName] = useState<string>('Pembarthi');
  const [manualVillageName, setManualVillageName] = useState<string>('');

  const [marginInput, setMarginInput] = useState<string>('100000');
  const [marginError, setMarginError] = useState<string | null>(null);

  const [businessCategory, setBusinessCategory] = useState<string>('Dairy');
  const [manualCategoryName, setManualCategoryName] = useState<string>('');

  // Engine Options (interactive in Screen 2)
  const [moratoriumInterest, setMoratoriumInterest] = useState<MoratoriumInterestTreatment>('serviced');
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('equal_principal');
  const [isAssumptionsExpanded, setIsAssumptionsExpanded] = useState<boolean>(true);

  // Derived location objects
  const currentStateData: StateData | null = useMemo(() => {
    return STATIC_LOCATIONS.find((s) => s.id === selectedStateId) || null;
  }, [selectedStateId]);

  const districtList: DistrictData[] = useMemo(() => {
    return currentStateData ? currentStateData.districts : [];
  }, [currentStateData]);

  const currentDistrictData: DistrictData | null = useMemo(() => {
    return districtList.find((d) => d.id === selectedDistrictId) || null;
  }, [districtList, selectedDistrictId]);

  const blockList: BlockData[] = useMemo(() => {
    return currentDistrictData ? currentDistrictData.blocks : [];
  }, [currentDistrictData]);

  const currentBlockData: BlockData | null = useMemo(() => {
    return blockList.find((b) => b.id === selectedBlockId) || null;
  }, [blockList, selectedBlockId]);

  const villageList: string[] = useMemo(() => {
    return currentBlockData ? currentBlockData.villages : [];
  }, [currentBlockData]);

  // Synchronous handlers for cascading selections
  const handleStateChange = (nextStateId: string) => {
    setSelectedStateId(nextStateId);
    if (nextStateId !== OTHER_OPTION_VALUE) {
      const stateObj = STATIC_LOCATIONS.find((s) => s.id === nextStateId);
      if (stateObj && stateObj.districts.length > 0) {
        const firstDist = stateObj.districts[0];
        setSelectedDistrictId(firstDist.id);
        if (firstDist.blocks.length > 0) {
          const firstBlk = firstDist.blocks[0];
          setSelectedBlockId(firstBlk.id);
          if (firstBlk.villages.length > 0) {
            setSelectedVillageName(firstBlk.villages[0]);
          }
        }
      }
    }
  };

  const handleDistrictChange = (nextDistId: string) => {
    setSelectedDistrictId(nextDistId);
    if (nextDistId !== OTHER_OPTION_VALUE && currentStateData) {
      const distObj = currentStateData.districts.find((d) => d.id === nextDistId);
      if (distObj && distObj.blocks.length > 0) {
        const firstBlk = distObj.blocks[0];
        setSelectedBlockId(firstBlk.id);
        if (firstBlk.villages.length > 0) {
          setSelectedVillageName(firstBlk.villages[0]);
        }
      }
    }
  };

  const handleBlockChange = (nextBlockId: string) => {
    setSelectedBlockId(nextBlockId);
    if (nextBlockId !== OTHER_OPTION_VALUE && currentDistrictData) {
      const blkObj = currentDistrictData.blocks.find((b) => b.id === nextBlockId);
      if (blkObj && blkObj.villages.length > 0) {
        setSelectedVillageName(blkObj.villages[0]);
      }
    }
  };

  // Derived effective location display string
  const locationSummary = useMemo(() => {
    const sName = selectedStateId === OTHER_OPTION_VALUE ? manualStateName || 'Other State' : currentStateData?.name || 'Telangana';
    const dName = selectedDistrictId === OTHER_OPTION_VALUE ? manualDistrictName || 'Other District' : currentDistrictData?.name || '';
    const bName = selectedBlockId === OTHER_OPTION_VALUE ? manualBlockName || 'Other Block' : currentBlockData?.name || '';
    const vName = selectedVillageName === OTHER_OPTION_VALUE ? manualVillageName || 'Other Village' : selectedVillageName;

    return [vName, bName, dName, sName].filter(Boolean).join(', ');
  }, [
    selectedStateId,
    manualStateName,
    currentStateData,
    selectedDistrictId,
    manualDistrictName,
    currentDistrictData,
    selectedBlockId,
    manualBlockName,
    currentBlockData,
    selectedVillageName,
    manualVillageName
  ]);

  // Numeric margin value
  const parsedMargin = useMemo(() => {
    const cleaned = marginInput.replace(/,/g, '').trim();
    const val = Number(cleaned);
    return isNaN(val) ? 0 : val;
  }, [marginInput]);

  // Run pure psCalculator engine
  const calculationResult: PSCalculatorResult = useMemo(() => {
    return calculatePS(parsedMargin, {
      moratoriumInterest,
      repaymentType,
      roundToDecimals: true
    });
  }, [parsedMargin, moratoriumInterest, repaymentType]);

  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setMarginInput(raw);
    if (marginError) setMarginError(null);
  };

  const handlePresetSelect = (val: number) => {
    setMarginInput(val.toString());
    setMarginError(null);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedMargin <= 0) {
      setMarginError(t.marginPositiveError);
      return;
    }
    setMarginError(null);
    setActiveScreen('RESULTS');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Schedule totals
  const scheduleTotals = useMemo(() => {
    if (!calculationResult.isEligible || !calculationResult.schedule) {
      return { totalInterest: 0, totalPrincipal: 0, totalPaid: 0 };
    }
    const schedule = calculationResult.schedule;
    const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
    const totalPrincipal = schedule.reduce((sum, row) => sum + row.principal, 0);
    const totalPaid = schedule.reduce((sum, row) => sum + row.totalPayment, 0);
    return {
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPrincipal: Math.round(totalPrincipal * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100
    };
  }, [calculationResult]);

  // CSV download function
  const handleDownloadCsv = () => {
    if (!calculationResult.isEligible || !calculationResult.schedule) return;
    const rows: RepaymentQuarterRow[] = calculationResult.schedule;
    const headers = [
      'Quarter',
      'Opening Balance (INR)',
      'Interest (INR)',
      'Principal (INR)',
      'Total Payment (INR)',
      'Closing Balance (INR)',
      'Status'
    ];

    const csvLines = [
      `# PRAVIRAK Loan Planner Repayment Schedule`,
      `# Business Category: ${businessCategory === 'Other' ? manualCategoryName || 'Other' : businessCategory}`,
      `# Location: ${locationSummary}`,
      `# Scheme: ${calculationResult.schemeName}`,
      `# Project Cost: ${calculationResult.projectCost}`,
      `# Loan Amount: ${calculationResult.loanAmount}`,
      headers.join(','),
      ...rows.map((r) =>
        [
          r.quarter,
          r.openingBalance,
          r.interest,
          r.principal,
          r.totalPayment,
          r.closingBalance,
          r.isMoratorium ? 'Moratorium' : 'Amortization'
        ].join(',')
      ),
      [
        'Total',
        '',
        scheduleTotals.totalInterest,
        scheduleTotals.totalPrincipal,
        scheduleTotals.totalPaid,
        '0',
        ''
      ].join(',')
    ];

    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    try {
      if (typeof URL.createObjectURL === 'function') {
        const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `pravirak_loan_schedule_${calculationResult.schemeType.toLowerCase().replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch {
      // Safe fallback for test/node environments without full Blob URL support
    }
  };

  // Why selected one-liner
  const whySelectedText = useMemo(() => {
    if (!calculationResult.isEligible) return '';
    if (calculationResult.schemeType === 'Term Loan') {
      return `Project cost ₹${calculationResult.projectCost.toLocaleString('en-IN')} is above ₹1.40 Lakh threshold, qualifying for Term Loan Scheme (up to ₹50 Lakh).`;
    }
    return `Project cost ₹${calculationResult.projectCost.toLocaleString('en-IN')} is within the ₹1.40 Lakh ceiling, qualifying for Micro Finance Scheme.`;
  }, [calculationResult]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans" data-testid="loan-planner-root">
      {/* Header banner */}
      <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 mb-2">
              <Calculator className="w-3.5 h-3.5 text-indigo-950 dark:text-indigo-400" />
              <span>{t.loanPlannerBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.loanPlannerTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              {t.loanPlannerSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeScreen === 'INPUTS' && onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.navHome}</span>
              </button>
            )}

            {activeScreen === 'RESULTS' && (
              <button
                type="button"
                onClick={() => setActiveScreen('INPUTS')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-neutral-200 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                data-testid="edit-inputs-top-button"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.editInputsButton}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SCREEN 1: INPUTS */}
      {activeScreen === 'INPUTS' && (
        <form onSubmit={handleCalculate} className="space-y-6" data-testid="loan-planner-form">
          {/* Section 1: Location selection */}
          <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-neutral-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-100 dark:border-indigo-800">
                1
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Location Hierarchy</h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Cascading administrative geography or manual entry</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* State */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                  {t.stateLabel}
                </label>
                <select
                  value={selectedStateId}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                  data-testid="state-select"
                >
                  {STATIC_LOCATIONS.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                  <option value={OTHER_OPTION_VALUE}>{t.otherTypeManually}</option>
                </select>
                {selectedStateId === OTHER_OPTION_VALUE && (
                  <input
                    type="text"
                    value={manualStateName}
                    onChange={(e) => setManualStateName(e.target.value)}
                    placeholder={t.enterStateManually}
                    className="w-full mt-2 bg-white dark:bg-[#1C1C1C] border border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                )}
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                  {t.districtLabel}
                </label>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={selectedStateId === OTHER_OPTION_VALUE}
                  className="w-full bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:opacity-50 cursor-pointer"
                  data-testid="district-select"
                >
                  {districtList.map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {dist.name}
                    </option>
                  ))}
                  <option value={OTHER_OPTION_VALUE}>{t.otherTypeManually}</option>
                </select>
                {(selectedDistrictId === OTHER_OPTION_VALUE || selectedStateId === OTHER_OPTION_VALUE) && (
                  <input
                    type="text"
                    value={manualDistrictName}
                    onChange={(e) => setManualDistrictName(e.target.value)}
                    placeholder={t.enterDistrictManually}
                    className="w-full mt-2 bg-white dark:bg-[#1C1C1C] border border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                )}
              </div>

              {/* Block / Mandal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                  {t.blockLabel}
                </label>
                <select
                  value={selectedBlockId}
                  onChange={(e) => handleBlockChange(e.target.value)}
                  disabled={selectedDistrictId === OTHER_OPTION_VALUE || selectedStateId === OTHER_OPTION_VALUE}
                  className="w-full bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:opacity-50 cursor-pointer"
                  data-testid="block-select"
                >
                  {blockList.map((blk) => (
                    <option key={blk.id} value={blk.id}>
                      {blk.name}
                    </option>
                  ))}
                  <option value={OTHER_OPTION_VALUE}>{t.otherTypeManually}</option>
                </select>
                {(selectedBlockId === OTHER_OPTION_VALUE || selectedDistrictId === OTHER_OPTION_VALUE || selectedStateId === OTHER_OPTION_VALUE) && (
                  <input
                    type="text"
                    value={manualBlockName}
                    onChange={(e) => setManualBlockName(e.target.value)}
                    placeholder={t.enterBlockManually}
                    className="w-full mt-2 bg-white dark:bg-[#1C1C1C] border border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                )}
              </div>

              {/* Village / Gram Panchayat */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                  {t.villageLabel}
                </label>
                <select
                  value={selectedVillageName}
                  onChange={(e) => setSelectedVillageName(e.target.value)}
                  disabled={selectedBlockId === OTHER_OPTION_VALUE || selectedDistrictId === OTHER_OPTION_VALUE || selectedStateId === OTHER_OPTION_VALUE}
                  className="w-full bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:opacity-50 cursor-pointer"
                  data-testid="village-select"
                >
                  {villageList.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                  <option value={OTHER_OPTION_VALUE}>{t.otherTypeManually}</option>
                </select>
                {(selectedVillageName === OTHER_OPTION_VALUE || selectedBlockId === OTHER_OPTION_VALUE || selectedDistrictId === OTHER_OPTION_VALUE || selectedStateId === OTHER_OPTION_VALUE) && (
                  <input
                    type="text"
                    value={manualVillageName}
                    onChange={(e) => setManualVillageName(e.target.value)}
                    placeholder={t.enterVillageManually}
                    className="w-full mt-2 bg-white dark:bg-[#1C1C1C] border border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Margin Capital & Category */}
          <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-neutral-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-100 dark:border-indigo-800">
                2
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Margin Capital & Enterprise Type</h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Specify your available own promoter contribution (INR)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Margin input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 flex items-center justify-between">
                  <span>{t.marginCapitalLabel}</span>
                  {parsedMargin > 0 && (
                    <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-400" data-testid="margin-formatted-badge">
                      ₹{parsedMargin.toLocaleString('en-IN')}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-slate-400">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={marginInput}
                    onChange={handleMarginChange}
                    placeholder="1,00,000"
                    className={`w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-[#161616] border rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden ${
                      marginError
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 dark:border-neutral-800'
                    }`}
                    data-testid="margin-input"
                  />
                </div>
                {marginError && (
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400" data-testid="margin-error">
                    {marginError}
                  </p>
                )}

                {/* Preset Chips */}
                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-neutral-300 block mb-1.5">
                    Preset Values (INR):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_MARGINS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handlePresetSelect(preset)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          parsedMargin === preset
                            ? 'bg-indigo-950 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700'
                        }`}
                        data-testid={`preset-${preset}`}
                      >
                        {preset.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Business Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                  {t.businessCategoryLabel}
                </label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                  data-testid="category-select"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {businessCategory === 'Other' && (
                  <input
                    type="text"
                    value={manualCategoryName}
                    onChange={(e) => setManualCategoryName(e.target.value)}
                    placeholder={t.otherCategoryPlaceholder}
                    className="w-full mt-2 bg-white dark:bg-[#1C1C1C] border border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                )}

                <p className="text-[11px] text-slate-700 dark:text-neutral-300 pt-1 font-medium">
                  Directs scheme eligibility and industry debt underwriting guidelines.
                </p>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-indigo-950 text-white hover:bg-indigo-900 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                data-testid="calculate-button"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>{t.calculateButton}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* SCREEN 2: RESULTS */}
      {activeScreen === 'RESULTS' && (
        <div className="space-y-6" data-testid="loan-planner-results">
          {/* Results Metadata strip */}
          <div className="bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-neutral-300">
              <Building2 className="w-4 h-4 text-indigo-950 dark:text-indigo-400 shrink-0" />
              <span className="font-bold text-slate-900 dark:text-white" data-testid="summary-category">
                {businessCategory === 'Other' ? manualCategoryName || 'Other Enterprise' : businessCategory}
              </span>
              <span>•</span>
              <span className="truncate max-w-xs" data-testid="summary-location">{locationSummary}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 shrink-0">
              <span>Promoter Margin:</span>
              <span className="font-extrabold text-slate-900 dark:text-white" data-testid="summary-margin">
                ₹{parsedMargin.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* If Beyond Scheme Limits -> Show warning and assumptions, do NOT show schedule */}
          {!calculationResult.isEligible || calculationResult.beyondSchemeLimits ? (
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-3xl p-6 sm:p-8 space-y-4" data-testid="beyond-limits-notice">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-extrabold text-rose-900 dark:text-rose-200">
                    {t.beyondLimitsNoticeTitle}
                  </h3>
                  <p className="text-sm font-semibold text-rose-800 dark:text-rose-300 mt-1" data-testid="beyond-limits-message">
                    {calculationResult.message}
                  </p>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-black/30 rounded-2xl p-4 text-xs text-rose-950 dark:text-rose-200 space-y-1.5">
                <p className="font-bold">Observations:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {calculationResult.assumptions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveScreen('INPUTS')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                  data-testid="edit-inputs-beyond-limits"
                >
                  {t.editInputsButton}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Three Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Project Cost */}
                <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-1" data-testid="card-project-cost">
                  <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                    {t.projectCostCardTitle}
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white" data-testid="val-project-cost">
                    ₹{calculationResult.projectCost.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-neutral-300 font-medium">
                    {t.projectCostCardDesc}
                  </p>
                </div>

                {/* Maximum Loan */}
                <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-1" data-testid="card-max-loan">
                  <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                    {t.maxLoanCardTitle}
                  </span>
                  <div className="text-2xl font-black text-indigo-950 dark:text-indigo-400" data-testid="val-max-loan">
                    ₹{calculationResult.loanAmount.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-neutral-300 font-medium">
                    {calculationResult.cappedByScheme
                      ? `Capped at scheme ceiling of ₹${calculationResult.schemeMaxLoan.toLocaleString('en-IN')}`
                      : t.maxLoanCardDesc}
                  </p>
                </div>

                {/* Own Contribution */}
                <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-1" data-testid="card-own-contribution">
                  <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                    {t.ownContributionCardTitle}
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white" data-testid="val-own-contribution">
                    ₹{calculationResult.totalPromoterContribution.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-neutral-300 font-medium">
                    {calculationResult.cappedByScheme
                      ? `Includes ₹${calculationResult.shortfall.toLocaleString('en-IN')} cap shortfall`
                      : t.ownContributionCardDesc}
                  </p>
                </div>
              </div>

              {/* Scheme Selected Card */}
              <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4" data-testid="scheme-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-indigo-950 dark:text-indigo-400" />
                    <h3 className="text-lg font-black text-slate-900 dark:text-white" data-testid="scheme-name">
                      {calculationResult.schemeName}
                    </h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800" data-testid="scheme-type-badge">
                    {calculationResult.schemeType}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 dark:bg-[#141414] p-3 rounded-xl border border-slate-100 dark:border-neutral-800">
                    <span className="text-slate-700 dark:text-neutral-300 font-medium flex items-center gap-1.5 mb-1">
                      <Percent className="w-3.5 h-3.5 text-indigo-950" />
                      {t.schemeRateLabel}
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white" data-testid="scheme-rate">
                      {calculationResult.interestRatePct}% p.a.
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#141414] p-3 rounded-xl border border-slate-100 dark:border-neutral-800">
                    <span className="text-slate-700 dark:text-neutral-300 font-medium flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-950" />
                      {t.schemeTenureLabel}
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white" data-testid="scheme-tenure">
                      {calculationResult.tenureYears} Years ({calculationResult.totalQuarters} Quarters)
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#141414] p-3 rounded-xl border border-slate-100 dark:border-neutral-800">
                    <span className="text-slate-700 dark:text-neutral-300 font-medium flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-950" />
                      {t.schemeMoratoriumLabel}
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white" data-testid="scheme-moratorium">
                      {calculationResult.moratoriumMonths} Months ({calculationResult.moratoriumQuarters} Quarter{calculationResult.moratoriumQuarters > 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                {/* Routing Reason */}
                <div className="bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3 text-xs text-indigo-950 dark:text-indigo-200" data-testid="scheme-reason">
                  <span className="font-bold mr-1">Selection Reason:</span>
                  <span>{whySelectedText}</span>
                </div>
              </div>

              {/* Capped By Scheme Notice (if applicable) */}
              {calculationResult.cappedByScheme && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-5 space-y-2" data-testid="cap-notice">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
                    <h4 className="text-xs sm:text-sm font-extrabold text-amber-950 dark:text-amber-200">
                      {t.capNoticeTitle}
                    </h4>
                  </div>
                  <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                    The calculated 90% loan entitlement is{' '}
                    <strong>₹{calculationResult.maxLoan.toLocaleString('en-IN')}</strong>, but the scheme imposes a maximum ceiling of{' '}
                    <strong>₹{calculationResult.schemeMaxLoan.toLocaleString('en-IN')}</strong>.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-semibold pt-1 text-amber-950 dark:text-amber-200">
                    <div data-testid="cap-shortfall">
                      {t.shortfallAmountLabel}:{' '}
                      <span className="font-black text-rose-600 dark:text-rose-400">
                        ₹{calculationResult.shortfall.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div data-testid="cap-total-promoter">
                      {t.totalRequiredContribution}:{' '}
                      <span className="font-black">
                        ₹{calculationResult.totalPromoterContribution.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Repayment Schedule Table */}
              <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4" data-testid="schedule-section">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-neutral-800">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {t.scheduleTableTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      {t.scheduleTableSubtitle}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadCsv}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-950 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-100 dark:border-indigo-800 transition-colors cursor-pointer shrink-0"
                    data-testid="download-csv-button"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {t.downloadCsvButton}
                  </button>
                </div>

                {/* Mobile-first horizontal scroll table */}
                <div className="overflow-x-auto -mx-6 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-6 sm:px-0">
                    <table className="min-w-[650px] w-full text-xs text-left border-collapse" data-testid="repayment-table">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 font-bold bg-slate-50/70 dark:bg-[#141414]">
                          <th className="py-2.5 px-3">{t.thQuarter}</th>
                          <th className="py-2.5 px-3 text-right">{t.thOpeningBalance} (₹)</th>
                          <th className="py-2.5 px-3 text-right">{t.thInterest} (₹)</th>
                          <th className="py-2.5 px-3 text-right">{t.thPrincipal} (₹)</th>
                          <th className="py-2.5 px-3 text-right font-extrabold text-slate-900 dark:text-white">
                            {t.thTotalPayment} (₹)
                          </th>
                          <th className="py-2.5 px-3 text-right">{t.thClosingBalance} (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                        {calculationResult.schedule.map((row) => (
                          <tr
                            key={row.quarter}
                            className={`transition-colors ${
                              row.isMoratorium
                                ? 'bg-amber-50/50 dark:bg-amber-950/20 font-medium'
                                : 'hover:bg-slate-50/80 dark:hover:bg-[#141414]'
                            }`}
                            data-testid={`row-quarter-${row.quarter}`}
                            data-moratorium={row.isMoratorium ? 'true' : 'false'}
                          >
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="font-bold text-slate-900 dark:text-white mr-1.5">
                                Q{row.quarter}
                              </span>
                              {row.isMoratorium && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-extrabold bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200" data-testid={`badge-moratorium-${row.quarter}`}>
                                  {t.moratoriumBadge}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap text-slate-700 dark:text-neutral-300">
                              {row.openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap text-amber-700 dark:text-amber-400">
                              {row.interest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap text-slate-700 dark:text-neutral-300">
                              {row.principal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap font-bold text-indigo-950 dark:text-indigo-300">
                              {row.totalPayment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap font-medium text-slate-900 dark:text-white">
                              {row.closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-slate-300 dark:border-neutral-700 font-extrabold bg-slate-50 dark:bg-[#161616] text-slate-900 dark:text-white" data-testid="schedule-totals-row">
                          <td className="py-3 px-3">{t.totalsRowLabel}</td>
                          <td className="py-3 px-3 text-right">—</td>
                          <td className="py-3 px-3 text-right font-mono text-amber-700 dark:text-amber-400" data-testid="total-interest">
                            ₹{scheduleTotals.totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-right font-mono" data-testid="total-principal">
                            ₹{scheduleTotals.totalPrincipal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-indigo-950 dark:text-indigo-300" data-testid="total-paid">
                            ₹{scheduleTotals.totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-right font-mono">₹0.00</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* Assumptions & Live Config Collapsible */}
              <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4" data-testid="assumptions-section">
                <button
                  type="button"
                  onClick={() => setIsAssumptionsExpanded((prev) => !prev)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                  data-testid="assumptions-toggle"
                >
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-950 dark:text-indigo-400" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t.assumptionsTitle}
                    </h4>
                  </div>
                  {isAssumptionsExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {isAssumptionsExpanded && (
                  <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-neutral-800 text-xs">
                    {/* Live configuration controls */}
                    <div className="bg-slate-50 dark:bg-[#141414] p-4 rounded-2xl border border-slate-100 dark:border-neutral-800 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="font-bold text-slate-800 dark:text-neutral-200">
                          {t.moratoriumToggleLabel}:
                        </span>
                        <div className="inline-flex rounded-xl bg-slate-200 dark:bg-neutral-800 p-1" data-testid="moratorium-toggle-group">
                          <button
                            type="button"
                            onClick={() => setMoratoriumInterest('serviced')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              moratoriumInterest === 'serviced'
                                ? 'bg-white dark:bg-[#222222] text-indigo-950 dark:text-white shadow-xs'
                                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
                            }`}
                            data-testid="toggle-moratorium-serviced"
                          >
                            {t.moratoriumServiced}
                          </button>
                          <button
                            type="button"
                            onClick={() => setMoratoriumInterest('capitalised')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              moratoriumInterest === 'capitalised'
                                ? 'bg-white dark:bg-[#222222] text-indigo-950 dark:text-white shadow-xs'
                                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
                            }`}
                            data-testid="toggle-moratorium-capitalised"
                          >
                            {t.moratoriumCapitalised}
                          </button>
                        </div>
                      </div>

                      {/* Repayment Type */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-neutral-800">
                        <span className="font-bold text-slate-800 dark:text-neutral-200">
                          Amortization Style:
                        </span>
                        <div className="inline-flex rounded-xl bg-slate-200 dark:bg-neutral-800 p-1">
                          <button
                            type="button"
                            onClick={() => setRepaymentType('equal_principal')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              repaymentType === 'equal_principal'
                                ? 'bg-white dark:bg-[#222222] text-indigo-950 dark:text-white shadow-xs'
                                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
                            }`}
                          >
                            Equal Principal (Declining)
                          </button>
                          <button
                            type="button"
                            onClick={() => setRepaymentType('emi')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              repaymentType === 'emi'
                                ? 'bg-white dark:bg-[#222222] text-indigo-950 dark:text-white shadow-xs'
                                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
                            }`}
                          >
                            Quarterly EMI (Equal Total)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Assumptions list */}
                    <div className="space-y-1.5 text-slate-600 dark:text-neutral-400">
                      <p className="font-bold text-slate-800 dark:text-neutral-200">
                        Mathematical Assumptions Applied:
                      </p>
                      <ul className="list-disc pl-5 space-y-1" data-testid="assumptions-list">
                        {calculationResult.assumptions.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveScreen('INPUTS')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-neutral-200 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 transition-colors cursor-pointer"
                  data-testid="edit-inputs-bottom-button"
                >
                  ← {t.editInputsButton}
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDownloadCsv}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-slate-700 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    data-testid="download-csv-bottom-button"
                  >
                    <Download className="w-4 h-4" />
                    {t.downloadCsvButton}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onContinueToFeasibility && calculationResult.isEligible) {
                        onContinueToFeasibility(
                          calculationResult,
                          businessCategory === 'Other' ? manualCategoryName || 'Other' : businessCategory,
                          locationSummary
                        );
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-indigo-950 text-white hover:bg-indigo-900 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    data-testid="continue-feasibility-button"
                  >
                    <span>{t.continueToFeasibilityButton}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
