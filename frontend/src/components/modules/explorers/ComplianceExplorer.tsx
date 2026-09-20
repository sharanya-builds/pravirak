import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import { ExplorerShell, NoActiveAnalysis } from './ExplorerShell';
import { ComplianceCard } from '../../common/ComplianceCard';
import { getSectorCompliances } from '../../../data/compliances';
import { ActiveAnalysis } from './types';
import { useLanguage } from '../../../context/LanguageContext';

interface ComplianceExplorerProps {
  analysis: ActiveAnalysis | null;
  onBack: () => void;
  onStartNew: () => void;
}

export const ComplianceExplorer: React.FC<ComplianceExplorerProps> = ({ analysis, onBack, onStartNew }) => {
  const { t } = useLanguage();
  const compliances = analysis ? getSectorCompliances(analysis.input.businessIdea) : [];

  return (
    <ExplorerShell
      icon={ClipboardCheck}
      title={t.exploreCompliance}
      description={t.exploreComplianceDesc}
      onBack={onBack}
    >
      {!analysis ? (
        <NoActiveAnalysis onStartNew={onStartNew} />
      ) : (
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">{t.requiredLikelyLicensesTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compliances.map((item) => (
                <ComplianceCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">{t.implementationPlan306090}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Day 0–30', desc: 'Validation, location confirmation & supplier outreach' },
                { label: 'Day 31–60', desc: 'Licensing, finance closure & fit-out setup' },
                { label: 'Day 61–90', desc: 'Trial operations & official launch' }
              ].map((phase, idx) => {
                const steps = analysis.decisionResult.actionPlan.filter(
                  (a) => Math.floor((a.stepNumber - 1) / 2) === idx
                );
                return (
                  <div key={phase.label} className="bg-white rounded-2xl border border-slate-200 p-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 mb-1">
                      {phase.label}
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{phase.desc}</p>
                    <ul className="space-y-2">
                      {(steps.length > 0 ? steps : analysis.decisionResult.actionPlan.slice(idx * 2, idx * 2 + 2)).map(
                        (step) => (
                          <li key={step.stepNumber} className="text-xs text-slate-700 flex gap-2">
                            <span className="font-bold text-slate-400">{step.stepNumber}.</span>
                            <span>{step.title}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </ExplorerShell>
  );
};
