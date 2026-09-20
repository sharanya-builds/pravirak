import React, { useEffect, useState } from 'react';
import { Sparkles, ExternalLink, RefreshCcw, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { schemeApi, GroundedScheme, SchemeRecommendationResult } from '../../api/client';
import { SchemeCard } from './SchemeCard';
import { GovernmentScheme } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface SchemeRecommendationsProps {
  businessIdea: string;
  category?: string;
  ownCapital: number;
  city?: string;
  state?: string;
  staticFallback: GovernmentScheme[];
}

function ConfidenceBadge({ confidence }: { confidence: GroundedScheme['confidence'] }) {
  const { t } = useLanguage();
  const styles =
    confidence === 'HIGH'
      ? 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800'
      : confidence === 'MEDIUM'
      ? 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800'
      : 'bg-slate-200 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
  return (
    <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${styles}`}>
      {confidence} {t.confidence.toUpperCase()}
    </span>
  );
}

const GroundedSchemeCard: React.FC<{ scheme: GroundedScheme }> = ({ scheme }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-7 shadow-sm card-hover-float">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="text-lg sm:text-xl font-extrabold text-slate-950 leading-tight">
            {scheme.name}
          </h4>
          {scheme.issuingAuthority && (
            <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mt-1">
              {scheme.issuingAuthority}
            </p>
          )}
        </div>
        <ConfidenceBadge confidence={scheme.confidence} />
      </div>

      <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed mb-4">
        {scheme.summary}
      </p>

      {scheme.benefitHighlights && scheme.benefitHighlights.length > 0 && (
        <div className="mb-3 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/90">
          <p className="text-xs font-black uppercase tracking-wider text-emerald-900 mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            {t.benefitLabel}
          </p>
          <ul className="space-y-1">
            {scheme.benefitHighlights.map((b, i) => (
              <li key={i} className="text-sm sm:text-base text-slate-900 font-semibold flex items-start gap-2">
                <span className="text-emerald-700 font-black">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {scheme.eligibilityHighlights && scheme.eligibilityHighlights.length > 0 && (
        <div className="mb-4 bg-blue-50/70 p-3.5 rounded-xl border border-blue-200/90">
          <p className="text-xs font-black uppercase tracking-wider text-blue-950 mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1E3A8A]"></span>
            {t.eligibilityLabel}
          </p>
          <ul className="space-y-1">
            {scheme.eligibilityHighlights.map((e, i) => (
              <li key={i} className="text-sm sm:text-base text-slate-900 font-semibold flex items-start gap-2">
                <span className="text-[#1E3A8A] font-black">•</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-slate-200 text-xs sm:text-sm text-slate-700 font-bold">
        <span className="flex items-center gap-1.5 font-mono">
          <Clock className="w-4 h-4 text-slate-500" />
          {scheme.freshness || 'undated'}
        </span>
        <a
          href={scheme.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#1E3A8A] hover:text-[#1E40AF] hover:bg-blue-100 font-black transition-all border border-blue-200"
        >
          <span>{scheme.sourceName || 'msme.gov.in'}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export const SchemeRecommendations: React.FC<SchemeRecommendationsProps> = ({
  businessIdea,
  category,
  ownCapital,
  city,
  state,
  staticFallback
}) => {
  const { t } = useLanguage();
  const [result, setResult] = useState<SchemeRecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRequested, setHasRequested] = useState(false);

  const fetchGrounded = async () => {
    setIsLoading(true);
    setError(null);
    setHasRequested(true);
    try {
      const res = await schemeApi.recommend({ businessIdea, category, ownCapital, city, state });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reach the scheme lookup service.');
    } finally {
      setIsLoading(false);
    }
  };

  // Attempt an AI-grounded lookup once per business context; falls back silently.
  useEffect(() => {
    fetchGrounded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessIdea, ownCapital, city, state]);

  const showGrounded = result?.grounded && result.schemes.length > 0;

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50 border-2 border-blue-200 rounded-2xl px-5 py-3 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-900 font-extrabold">
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 text-[#1E3A8A] animate-pulse" />
              <span>{t.searchingSchemes}</span>
            </>
          ) : showGrounded ? (
            <>
              <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
              <span>
                {result?.groundedViaSearch === false
                  ? `AI-matched via ${result?.model || 'AI'} (live search unavailable this run — verify sources below)`
                  : `AI-grounded results · live web search via ${result?.model || 'OpenRouter'}`}
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
              <span>{t.showingStaticDataset}</span>
            </>
          )}
        </div>
        {!isLoading && (
          <button
            onClick={fetchGrounded}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-[#1E3A8A] hover:bg-blue-100/60 text-xs sm:text-sm font-extrabold transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>{t.refreshButton}</span>
          </button>
        )}
      </div>

      {!isLoading && !showGrounded && hasRequested && (
        <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
          <span>
            {error ||
              result?.reason ||
              'Live scheme grounding is connecting...'}{' '}
            Showing PRAVIRAK's curated reference schemes below — verify current details on the
            official scheme portal before applying.
          </span>
        </div>
      )}

      {/* AI-grounded schemes */}
      {showGrounded && (
        <div className="space-y-4">
          {result!.schemes.map((s, idx) => (
            <GroundedSchemeCard key={idx} scheme={s} />
          ))}
          <p className="text-xs sm:text-sm text-slate-600 font-medium px-1">
            Generated {result?.generatedAt ? new Date(result.generatedAt).toLocaleString('en-IN') : ''} using{' '}
            <strong className="text-slate-900 font-bold">{result?.model || 'an AI model via OpenRouter'}</strong>
            {result?.groundedViaSearch === false
              ? ' from model knowledge (live web search grounding was not available on this model/key)'
              : ' with live web search grounding'}
            . Always confirm current terms on official portals before applying.
          </p>
        </div>
      )}

      {/* Static fallback */}
      {!isLoading && !showGrounded && (
        <div className="space-y-4">
          {staticFallback.map((scheme, idx) => (
            <SchemeCard key={scheme.id} scheme={scheme} isPrimaryRecommendation={idx === 0} />
          ))}
        </div>
      )}
    </div>
  );
};
