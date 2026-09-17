import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, FileSearch, Sparkles } from 'lucide-react';

interface ProgressIndicatorProps {
  onComplete: () => void;
  businessName: string;
  locationName: string;
}

interface StepItem {
  id: number;
  label: string;
  detail: string;
}

const AUDIT_STEPS: StepItem[] = [
  { id: 1, label: 'Understanding business idea', detail: 'Parsing enterprise category, equipment profile & operational scale' },
  { id: 2, label: 'Checking local market', detail: 'Surveying pedestrian footfall indices & residential colony density' },
  { id: 3, label: 'Mapping competitors', detail: 'Querying OpenStreetMap POIs within 1.5 km radial catchment' },
  { id: 4, label: 'Finding demand signals', detail: 'Evaluating institutional buyers, evening snack habits & delivery reach' },
  { id: 5, label: 'Calculating financial feasibility', detail: 'Computing capex, opex, working capital buffer & exact monthly EMI' },
  { id: 6, label: 'Checking financing options', detail: 'Matching PMEGP, PM MUDRA & CGTMSE collateral-free limits' },
  { id: 7, label: 'Testing repayment risk', detail: 'Executing deterministic stress-testing across adverse sales & cost shocks' }
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  onComplete,
  businessName,
  locationName
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < AUDIT_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 700);
          return prev;
        }
      });
    }, 450); // total transition ~3.5 seconds

    return () => clearInterval(timer);
  }, [onComplete]);

  const progressPct = Math.round(((currentStepIndex + 1) / AUDIT_STEPS.length) * 100);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Official Header Badge */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-900/60 border border-indigo-700 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Pravirak Enterprise Audit Engine
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Synthesizing Decision Dossier
              </h2>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>
              Target: <strong className="text-white">{businessName}</strong>
            </span>
            <span>
              Location: <strong className="text-white">{locationName}</strong>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
              <span>Public Verification Checklist</span>
              <span className="font-mono text-emerald-400 font-bold">{progressPct}% Completed</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Step Checklist List */}
        <div className="p-5 sm:p-6 space-y-3 bg-white divide-y divide-slate-100">
          {AUDIT_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div key={step.id} className="pt-3 first:pt-0 flex items-start gap-3.5">
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300 bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold font-mono">
                      {step.id}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`text-xs sm:text-sm font-bold flex items-center justify-between ${
                    isDone ? 'text-slate-800' : isCurrent ? 'text-indigo-950' : 'text-slate-400'
                  }`}>
                    <span>{step.label}</span>
                    {isDone && <span className="text-[10px] text-emerald-700 font-semibold uppercase">Verified</span>}
                    {isCurrent && <span className="text-[10px] text-indigo-700 font-semibold uppercase animate-pulse">Processing...</span>}
                  </div>
                  <p className={`text-[11px] mt-0.5 ${
                    isCurrent ? 'text-slate-600 font-medium' : isDone ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            Applying deterministic arithmetic and regional banking guidelines. Please wait...
          </p>
        </div>
      </div>
    </div>
  );
};
