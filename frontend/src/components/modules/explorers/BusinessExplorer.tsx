import React from 'react';
import { Briefcase, CheckCircle2 } from 'lucide-react';
import { ExplorerShell, NoActiveAnalysis } from './ExplorerShell';
import { ActiveAnalysis } from './types';
import { BENCHMARKS, computeFinancialAnalysis, formatINR } from '../../../engine/financialEngine';
import { useLanguage } from '../../../context/LanguageContext';

interface BusinessExplorerProps {
  analysis: ActiveAnalysis | null;
  onBack: () => void;
  onStartNew: () => void;
}

const PILLAR_KEYS: Array<{ key: keyof ActiveAnalysis['decisionResult']['pillars']; labelKey: 'localDemand' | 'competition' | 'locationFit' | 'financialFeasibility' }> = [
  { key: 'localDemand', labelKey: 'localDemand' },
  { key: 'competition', labelKey: 'competition' },
  { key: 'locationFit', labelKey: 'locationFit' },
  { key: 'financialFeasibility', labelKey: 'financialFeasibility' }
];

export const BusinessExplorer: React.FC<BusinessExplorerProps> = ({ analysis, onBack, onStartNew }) => {
  const { t, language } = useLanguage();
  const alternativeArchetypes = Object.entries(BENCHMARKS)
    .filter(([key]) => !analysis || !analysis.input.businessIdea.toLowerCase().includes(key))
    .slice(0, 3);

  return (
    <ExplorerShell
      icon={Briefcase}
      title={t.exploreBusiness}
      description={t.exploreBusinessDesc}
      onBack={onBack}
    >
      {!analysis ? (
        <NoActiveAnalysis onStartNew={onStartNew} />
      ) : (
        <div className="space-y-6">
          {/* Decision pillar breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">{analysis.decisionResult.decision}</h3>
              <span className="text-[10px] font-bold uppercase text-indigo-900 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                Current Business
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PILLAR_KEYS.map(({ key, labelKey }) => (
                <div key={key} className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="text-xs font-black text-slate-900">{analysis.decisionResult.pillars[key].grade}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{t[labelKey]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution plan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3">{t.executionMilestonesTitle}</h3>
            <div className="space-y-2">
              {analysis.decisionResult.actionPlan.map((step) => (
                <div key={step.stepNumber} className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">{step.title}</span>
                    <span className="text-slate-400"> — {step.timeline}</span>
                    <p className="text-slate-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparable business opportunities */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">{t.comparableOpportunitiesTitle}</h3>
            <p className="text-xs text-slate-500 mb-3">
              How your current idea's typical economics compare with similar small-enterprise archetypes at the same scale.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="py-2 pr-4 font-semibold">{t.businessTypeHeader}</th>
                    <th className="py-2 pr-4 font-semibold">{t.typicalCapexHeader}</th>
                    <th className="py-2 pr-4 font-semibold">{t.typicalRevenueHeader}</th>
                    <th className="py-2 font-semibold">{t.typicalOpexHeader}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 bg-indigo-50/50 font-semibold text-slate-900">
                    <td className="py-2 pr-4">{analysis.input.businessIdea} (Yours)</td>
                    <td className="py-2 pr-4 font-mono">{formatINR(analysis.financials.projectCost, language)}</td>
                    <td className="py-2 pr-4 font-mono">{formatINR(analysis.financials.projectedMonthlyRevenue, language)}</td>
                    <td className="py-2 font-mono">{formatINR(analysis.financials.projectedMonthlyOpex, language)}</td>
                  </tr>
                  {alternativeArchetypes.map(([key, b]) => {
                    const alt = computeFinancialAnalysis(key, analysis.financials.ownCapital, 'Small (Town/Zone)');
                    return (
                      <tr key={key} className="border-b border-slate-100 text-slate-700">
                        <td className="py-2 pr-4">{b.category}</td>
                        <td className="py-2 pr-4 font-mono">{formatINR(alt.projectCost, language)}</td>
                        <td className="py-2 pr-4 font-mono">{formatINR(alt.projectedMonthlyRevenue, language)}</td>
                        <td className="py-2 font-mono">{formatINR(alt.projectedMonthlyOpex, language)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Comparison figures use PRAVIRAK's deterministic benchmark archetypes and your own capital amount; they are
              estimates, not location-verified evidence.
            </p>
          </div>
        </div>
      )}
    </ExplorerShell>
  );
};
