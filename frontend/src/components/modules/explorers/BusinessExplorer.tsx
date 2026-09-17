import React from 'react';
import { Briefcase, CheckCircle2 } from 'lucide-react';
import { ExplorerShell, NoActiveAnalysis } from './ExplorerShell';
import { ActiveAnalysis } from './types';
import { BENCHMARKS, computeFinancialAnalysis, formatINR } from '../../../engine/financialEngine';

interface BusinessExplorerProps {
  analysis: ActiveAnalysis | null;
  onBack: () => void;
  onStartNew: () => void;
}

const PILLAR_LABELS: Array<{ key: keyof ActiveAnalysis['decisionResult']['pillars']; label: string }> = [
  { key: 'localDemand', label: 'Local Demand' },
  { key: 'competition', label: 'Competition' },
  { key: 'locationFit', label: 'Location Fit' },
  { key: 'financialFeasibility', label: 'Financial Feasibility' }
];

export const BusinessExplorer: React.FC<BusinessExplorerProps> = ({ analysis, onBack, onStartNew }) => {
  const alternativeArchetypes = Object.entries(BENCHMARKS)
    .filter(([key]) => !analysis || !analysis.input.businessIdea.toLowerCase().includes(key))
    .slice(0, 3);

  return (
    <ExplorerShell
      icon={Briefcase}
      title="Business Explorer"
      description="Business opportunities and comparisons"
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
              {PILLAR_LABELS.map(({ key, label }) => (
                <div key={key} className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="text-xs font-black text-slate-900">{analysis.decisionResult.pillars[key].grade}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution plan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Execution Milestones</h3>
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
            <h3 className="text-sm font-bold text-slate-900 mb-3">Comparable Business Opportunities</h3>
            <p className="text-xs text-slate-500 mb-3">
              How your current idea's typical economics compare with similar small-enterprise archetypes at the same scale.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="py-2 pr-4 font-semibold">Business Type</th>
                    <th className="py-2 pr-4 font-semibold">Typical Capex</th>
                    <th className="py-2 pr-4 font-semibold">Typical Monthly Revenue</th>
                    <th className="py-2 font-semibold">Typical Monthly Opex</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 bg-indigo-50/50 font-semibold text-slate-900">
                    <td className="py-2 pr-4">{analysis.input.businessIdea} (Yours)</td>
                    <td className="py-2 pr-4 font-mono">{formatINR(analysis.financials.projectCost)}</td>
                    <td className="py-2 pr-4 font-mono">{formatINR(analysis.financials.projectedMonthlyRevenue)}</td>
                    <td className="py-2 font-mono">{formatINR(analysis.financials.projectedMonthlyOpex)}</td>
                  </tr>
                  {alternativeArchetypes.map(([key, b]) => {
                    const alt = computeFinancialAnalysis(key, analysis.financials.ownCapital, 'Small (Town/Zone)');
                    return (
                      <tr key={key} className="border-b border-slate-100 text-slate-700">
                        <td className="py-2 pr-4">{b.category}</td>
                        <td className="py-2 pr-4 font-mono">{formatINR(alt.projectCost)}</td>
                        <td className="py-2 pr-4 font-mono">{formatINR(alt.projectedMonthlyRevenue)}</td>
                        <td className="py-2 font-mono">{formatINR(alt.projectedMonthlyOpex)}</td>
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
