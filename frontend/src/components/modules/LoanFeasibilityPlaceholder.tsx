import React from 'react';
import { ArrowLeft, Clock, FileCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { PSCalculatorEligibleResult } from '../../engine/psCalculator';

interface LoanFeasibilityPlaceholderProps {
  planResult: PSCalculatorEligibleResult | null;
  businessCategory: string;
  locationSummary: string;
  onBackToPlanner: () => void;
}

export const LoanFeasibilityPlaceholder: React.FC<LoanFeasibilityPlaceholderProps> = ({
  planResult,
  businessCategory,
  locationSummary,
  onBackToPlanner,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        onClick={onBackToPlanner}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-950 dark:text-indigo-400 hover:text-indigo-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.backToPlannerButton}
      </button>

      <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-1">
              <span>{t.feasibilityPlaceholderTitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {businessCategory || 'MSME Enterprise'} — Bank Feasibility Report
            </h1>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
          {t.feasibilityPlaceholderDesc}
        </p>

        {planResult && (
          <div className="bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-900 dark:text-indigo-400" />
              Loan Plan Parameters Queued for Feasibility Assessment
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-700 dark:text-neutral-300 font-medium block">Business Category</span>
                <span className="font-bold text-slate-900 dark:text-white">{businessCategory}</span>
              </div>
              <div>
                <span className="text-slate-700 dark:text-neutral-300 font-medium block">Location</span>
                <span className="font-bold text-slate-900 dark:text-white">{locationSummary || 'Telangana'}</span>
              </div>
              <div>
                <span className="text-slate-700 dark:text-neutral-300 font-medium block">Project Cost</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{planResult.projectCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-700 dark:text-neutral-300 font-medium block">Sanctioned Loan</span>
                <span className="font-bold text-indigo-950 dark:text-indigo-400">
                  ₹{planResult.loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2 border-t border-slate-200 dark:border-neutral-800">
              <div>
                <span className="text-slate-700 dark:text-neutral-300 font-medium block">Selected Scheme</span>
                <span className="font-bold text-slate-900 dark:text-white">{planResult.schemeName}</span>
              </div>
              <div>
                <span className="text-slate-700 dark:text-neutral-300 font-medium block">Interest Rate</span>
                <span className="font-bold text-slate-900 dark:text-white">{planResult.interestRatePct}% p.a.</span>
              </div>
              <div>
                <span className="text-slate-700 dark:text-neutral-300 font-medium block">Tenure / Quarters</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {planResult.tenureYears} Yrs ({planResult.totalQuarters} Quarters)
                </span>
              </div>
              <div>
                <span className="text-slate-700 dark:text-neutral-300 font-medium block">Moratorium</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {planResult.moratoriumMonths} Mos ({planResult.moratoriumQuarters} Qtr)
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <button
            onClick={onBackToPlanner}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-indigo-950 text-white hover:bg-indigo-900 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {t.backToPlannerButton}
          </button>
        </div>
      </div>
    </div>
  );
};
