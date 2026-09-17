import React, { useMemo, useState } from 'react';
import { FileSearch } from 'lucide-react';
import { ExplorerShell, NoActiveAnalysis } from './ExplorerShell';
import { EvidenceCard } from '../../common/EvidenceCard';
import { ActiveAnalysis } from './types';
import { ConfidenceLevel } from '../../../types';

interface EvidenceExplorerProps {
  analysis: ActiveAnalysis | null;
  onBack: () => void;
  onStartNew: () => void;
}

const FILTERS: Array<ConfidenceLevel | 'ALL'> = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

export const EvidenceExplorer: React.FC<EvidenceExplorerProps> = ({ analysis, onBack, onStartNew }) => {
  const [filter, setFilter] = useState<ConfidenceLevel | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    if (!analysis) return [];
    if (filter === 'ALL') return analysis.decisionResult.evidenceList;
    return analysis.decisionResult.evidenceList.filter((e) => e.confidence === filter);
  }, [analysis, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    analysis?.decisionResult.evidenceList.forEach((e) => {
      c[e.confidence] = (c[e.confidence] || 0) + 1;
    });
    return c;
  }, [analysis]);

  return (
    <ExplorerShell icon={FileSearch} title="Evidence Explorer" description="Data sources and evidence quality" onBack={onBack}>
      {!analysis ? (
        <NoActiveAnalysis onStartNew={onStartNew} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {(['HIGH', 'MEDIUM', 'LOW'] as ConfidenceLevel[]).map((level) => (
              <div key={level} className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                <div className="text-2xl font-black text-slate-900">{counts[level] || 0}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                  {level} Confidence
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  filter === f ? 'bg-indigo-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f === 'ALL' ? 'All Evidence' : f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <EvidenceCard key={item.id} item={item} />
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Provenance discipline:</strong> PRAVIRAK distinguishes
            observed/map-derived, sourced, estimated, demo and AI-interpreted information so you always know
            how confident to be in each data point above.
          </div>
        </div>
      )}
    </ExplorerShell>
  );
};
