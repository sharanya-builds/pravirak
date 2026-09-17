import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { ExplorerShell, NoActiveAnalysis } from './ExplorerShell';
import { StressTest } from '../StressTest';
import { ActiveAnalysis } from './types';

interface RiskExplorerProps {
  analysis: ActiveAnalysis | null;
  onBack: () => void;
  onStartNew: () => void;
}

export const RiskExplorer: React.FC<RiskExplorerProps> = ({ analysis, onBack, onStartNew }) => {
  return (
    <ExplorerShell icon={ShieldAlert} title="Risk Explorer" description="Risks, seasonality and stress scenarios" onBack={onBack}>
      {!analysis ? (
        <NoActiveAnalysis onStartNew={onStartNew} />
      ) : (
        <div className="space-y-6">
          <StressTest financials={analysis.financials} categoryKey={analysis.input.businessIdea} />

          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Identified Risk Factors</h3>
            <div className="space-y-3">
              {analysis.decisionResult.riskFactors.map((rf, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{rf.title}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        rf.severity === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : rf.severity === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {rf.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{rf.mitigation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ExplorerShell>
  );
};
