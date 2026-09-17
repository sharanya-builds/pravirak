import React, { useMemo } from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { ExplorerShell, NoActiveAnalysis } from './ExplorerShell';
import { ActiveAnalysis } from './types';
import { computeFinancialAnalysis, formatINR } from '../../../engine/financialEngine';
import { MetricCard } from '../../common/MetricCard';

interface GrowthExplorerProps {
  analysis: ActiveAnalysis | null;
  onBack: () => void;
  onStartNew: () => void;
  onGrowExisting: () => void;
}

export const GrowthExplorer: React.FC<GrowthExplorerProps> = ({ analysis, onBack, onStartNew, onGrowExisting }) => {
  const scaledUp = useMemo(() => {
    if (!analysis) return null;
    // Model a 1.5x capital scale-up scenario at the same location tier
    const scaledCapital = Math.round(analysis.financials.ownCapital * 1.5);
    return computeFinancialAnalysis(analysis.input.businessIdea, scaledCapital, 'Medium (Regional)');
  }, [analysis]);

  return (
    <ExplorerShell icon={TrendingUp} title="Growth Explorer" description="Expansion and new opportunities" onBack={onBack}>
      {!analysis ? (
        <NoActiveAnalysis onStartNew={onStartNew} />
      ) : (
        <div className="space-y-6">
          {/* Alternative location upside */}
          {analysis.location.alternativeLocation && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900">Higher-Scoring Nearby Area</h3>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                <strong>{analysis.location.alternativeLocation.areaName}</strong> scores{' '}
                <strong>{analysis.location.alternativeLocation.score}/100</strong> for this business type versus your
                current location's evidence-derived score. Worth a site visit before committing.
              </p>
            </div>
          )}

          {/* Scale-up scenario */}
          {scaledUp && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Scale-Up Scenario (1.5x Capital)</h3>
              <p className="text-xs text-slate-500 mb-4">
                A deterministic projection of what a larger version of this business could look like, modeled at a
                higher operational tier.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MetricCard label="Projected Monthly Revenue" value={formatINR(scaledUp.projectedMonthlyRevenue)} accent="emerald" />
                <MetricCard label="Estimated Project Cost" value={formatINR(scaledUp.projectCost)} accent="indigo" />
                <MetricCard label="Break-even" value={`${scaledUp.breakEvenMonths} months`} accent="amber" />
              </div>
            </div>
          )}

          {/* Existing business growth path */}
          <div className="bg-indigo-950 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold">Already running this business?</h3>
              <p className="text-xs text-indigo-200 mt-1">
                Use the Existing Business flow to diagnose your current numbers and get a tailored growth plan.
              </p>
            </div>
            <button
              onClick={onGrowExisting}
              className="shrink-0 px-4 py-2 bg-amber-400 text-indigo-950 rounded-lg text-xs font-bold hover:bg-amber-300 transition-colors"
            >
              Grow Existing Business
            </button>
          </div>
        </div>
      )}
    </ExplorerShell>
  );
};
