import React from 'react';
import { Landmark } from 'lucide-react';
import { ExplorerShell, NoActiveAnalysis } from './ExplorerShell';
import { MetricCard } from '../../common/MetricCard';
import { SchemeRecommendations } from '../../common/SchemeRecommendations';
import { formatINR } from '../../../engine/financialEngine';
import { GOVERNMENT_SCHEMES } from '../../../data/schemes';
import { ActiveAnalysis } from './types';
import { useLanguage } from '../../../context/LanguageContext';

interface FinanceExplorerProps {
  analysis: ActiveAnalysis | null;
  onBack: () => void;
  onStartNew: () => void;
}

export const FinanceExplorer: React.FC<FinanceExplorerProps> = ({ analysis, onBack, onStartNew }) => {
  const { t, language } = useLanguage();

  return (
    <ExplorerShell icon={Landmark} title={t.exploreFinance} description={t.exploreFinanceDesc} onBack={onBack}>
      {!analysis ? (
        <NoActiveAnalysis onStartNew={onStartNew} />
      ) : (
        <div className="space-y-6">
          {/* Government Eligibility vs Recommended Financing (kept separate per design direction) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
              <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3">
                {t.financingOptions}
              </div>
              <p className="text-xs text-slate-600 mb-4">
                {t.matchedSchemesDesc}
              </p>
              <div className="space-y-2">
                {GOVERNMENT_SCHEMES.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-xs bg-slate-50 rounded-lg px-3 py-2">
                    <span className="font-semibold text-slate-800">{s.name}</span>
                    <span className="text-slate-500">{s.matchScore}% match</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
                PRAVIRAK Recommended Financing
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">
                {formatINR(analysis.financials.loanRequired, language)}
              </p>
              <p className="text-xs text-slate-500 mt-1 mb-4">{t.recommendedLoanAmountLabel}</p>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3">
                If you start this business and take the recommended loan, your estimated monthly repayment is{' '}
                <strong className="font-mono">{formatINR(analysis.financials.monthlyEMI, language)}</strong>.
              </p>
            </div>
          </div>

          {/* Repayment-focused metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard label="Break-even Sales" value={formatINR(analysis.financials.projectedMonthlyRevenue, language)} accent="indigo" />
            <MetricCard
              label="Minimum Monthly Sales Target"
              value={formatINR(analysis.financials.monthlyEMI + analysis.financials.projectedMonthlyOpex, language)}
              accent="amber"
              subtext="Required to safely support repayment"
            />
            <MetricCard label={t.financialSafety} value={analysis.financials.safetyStatus} safetyStatus={analysis.financials.safetyStatus} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">{t.allMatchedSchemesTitle}</h3>
            <SchemeRecommendations
              businessIdea={analysis.input.businessIdea}
              category={analysis.input.category}
              ownCapital={analysis.financials.ownCapital}
              city={analysis.location.city}
              state={analysis.location.state}
              staticFallback={GOVERNMENT_SCHEMES}
            />
          </div>
        </div>
      )}
    </ExplorerShell>
  );
};
