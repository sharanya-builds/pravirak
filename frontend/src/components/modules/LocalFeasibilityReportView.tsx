import React, { useState } from 'react';
import { LocalFeasibilityReport, LocationData, Provenance } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  Compass,
  Lightbulb,
  Grid2X2,
  AlertTriangle,
  MapPin,
  Tag,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldAlert,
  Store
} from 'lucide-react';

interface LocalFeasibilityReportViewProps {
  report: LocalFeasibilityReport | null;
  location: LocationData;
  category: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isPrintView?: boolean;
}

export const LocalFeasibilityReportView: React.FC<LocalFeasibilityReportViewProps> = ({
  report,
  location,
  category,
  isLoading = false,
  error = null,
  onRetry,
  isPrintView = false
}) => {
  const { t } = useLanguage();
  const [showAllOpps, setShowAllOpps] = useState(false);
  const [showAllSwot, setShowAllSwot] = useState(false);
  const [showAllThreats, setShowAllThreats] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
          {t.loadingFeasibility}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {t.loadingFeasibilityScanning}
        </p>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="bg-rose-50 rounded-2xl border border-rose-200 p-6 text-center">
        <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
        <p className="text-sm font-semibold text-rose-900 mb-3">{error || t.errorFeasibility}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t.retryFeasibility}
          </button>
        )}
      </div>
    );
  }

  if (!report) return null;

  const renderBadge = (provenance?: Provenance | string) => {
    if (provenance === 'MEASURED' || provenance === 'OBSERVED') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          {t.badgeMeasured}
        </span>
      );
    }
    if (provenance === 'AI_GENERATED') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
          {t.badgeAi}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
        {t.badgeEstimated}
      </span>
    );
  };

  const getThreatBadge = (type: string) => {
    switch (type) {
      case 'supply_chain':
        return { label: t.threatSupplyChain, color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'seasonal':
        return { label: t.threatSeasonal, color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'single_buyer':
        return { label: t.threatSingleBuyer, color: 'bg-rose-100 text-rose-800 border-rose-300' };
      default:
        return { label: t.threatOther, color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  return (
    <div className={`space-y-6 ${isPrintView ? 'text-slate-900' : ''}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-indigo-500/30 border border-indigo-400/40 rounded-md text-[11px] font-bold uppercase tracking-wider text-indigo-200">
              {category}
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-300 font-medium truncate max-w-xs sm:max-w-md">
              {location.areaName}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            {t.localFeasibilityReportTitle}
          </h2>
          <p className="text-xs text-indigo-200/90 mt-0.5">
            {t.localFeasibilityReportSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {report.aiGenerated ? (
            <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-200 border border-purple-400/30 rounded-lg font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              {t.aiReportBadge}
            </span>
          ) : (
            <span className="text-xs px-3 py-1 bg-amber-500/20 text-amber-200 border border-amber-400/30 rounded-lg font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {t.templateReportBadge}
            </span>
          )}
        </div>
      </div>

      {/* Subsection 1: Market Reach & Catchment */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-950">
              {t.marketReachTitle}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 font-mono">
              {report.marketReach.catchmentKm} km
            </span>
            {renderBadge(report.provenance)}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium mb-4">
          {report.marketReach.summary}
        </p>

        {/* Deterministic Catchment Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {/* 5 km Count */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-600">{t.competitorsIn5km}</span>
              {renderBadge(report.marketReach.competitors5kmProvenance || 'ESTIMATED')}
            </div>
            <div className="text-xl font-extrabold text-slate-950 font-mono">
              {report.marketReach.competitors5kmCount ?? location.competitorsNearbyCount}
            </div>
            <span className="text-[11px] text-slate-500">{t.osm5kmScan}</span>
          </div>

          {/* 10 km Count */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-600">{t.competitorsIn10km}</span>
              {renderBadge(report.marketReach.competitors10kmProvenance || 'ESTIMATED')}
            </div>
            <div className="text-xl font-extrabold text-slate-950 font-mono">
              {report.marketReach.competitors10kmCount ?? Math.max(location.competitorsNearbyCount, 5)}
            </div>
            <span className="text-[11px] text-slate-500">{t.expanded10kmCatchment}</span>
          </div>

          {/* Density per 10,000 */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-600">{t.densityPer10kLabel}</span>
              {renderBadge('MEASURED')}
            </div>
            {report.marketReach.densityPer10kAt5km !== null && report.marketReach.densityPer10kAt5km !== undefined ? (
              <>
                <div className="text-xl font-extrabold text-indigo-950 font-mono">
                  {report.marketReach.densityPer10kAt5km} / 10k
                </div>
                <span className="text-[11px] text-slate-500">{t.calculatedAgainstPop}</span>
              </>
            ) : (
              <div className="text-[11px] text-slate-500 font-medium leading-tight mt-1">
                {t.competitorDensityNotice}
              </div>
            )}
          </div>
        </div>

        {/* Distribution Channels */}
        <div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            {t.channelsLabel}:
          </span>
          <div className="flex flex-wrap gap-2">
            {report.marketReach.distributionChannels.map((ch, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-semibold"
              >
                <Store className="w-3.5 h-3.5 text-indigo-600" />
                {ch}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Subsection 2: Opportunity Analysis (Underserved Niches) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-950">
              {t.opportunityAnalysisTitle}
            </h3>
          </div>
          {renderBadge(report.provenance)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {(showAllOpps ? report.opportunities : report.opportunities.slice(0, 3)).map((opp, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-indigo-100 text-indigo-800 mb-2">
                  Niche #{idx + 1}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">{opp.niche}</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{opp.why}</p>
              </div>
            </div>
          ))}
        </div>
        {report.opportunities.length > 3 && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => setShowAllOpps(!showAllOpps)}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
            >
              {showAllOpps ? t.showLess : `${t.showMore} (${report.opportunities.length - 3})`}
            </button>
          </div>
        )}
      </section>

      {/* Subsection 3: SWOT Analysis (2x2 Grid) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
              <Grid2X2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-950">
                {t.swotTitle}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Strengths, Weaknesses, Opportunities, Threats (SWOT)
              </p>
            </div>
          </div>
          {renderBadge(report.provenance)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs sm:text-sm font-extrabold text-emerald-950 uppercase tracking-wider">
                {t.swotStrengths} (Internal Advantages)
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-emerald-900 font-medium">
              {(showAllSwot ? report.swot.strengths : report.swot.strengths.slice(0, 3)).map((s, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <h4 className="text-xs sm:text-sm font-extrabold text-amber-950 uppercase tracking-wider">
                {t.swotWeaknesses} (Internal Limitations)
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-900 font-medium">
              {(showAllSwot ? report.swot.weaknesses : report.swot.weaknesses.slice(0, 3)).map((w, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2.5">
              <TrendingUp className="w-4 h-4 text-indigo-700" />
              <h4 className="text-xs sm:text-sm font-extrabold text-indigo-950 uppercase tracking-wider">
                {t.swotOpportunities} (External Potentials)
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-indigo-900 font-medium">
              {(showAllSwot ? report.swot.opportunities : report.swot.opportunities.slice(0, 3)).map((o, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
            <div className="flex items-center gap-2 mb-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              <h4 className="text-xs sm:text-sm font-extrabold text-rose-950 uppercase tracking-wider">
                {t.swotThreats} (External Hazards)
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-rose-900 font-medium">
              {(showAllSwot ? report.swot.threats : report.swot.threats.slice(0, 3)).map((th, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{th}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {(report.swot.strengths.length > 3 || report.swot.weaknesses.length > 3 || report.swot.opportunities.length > 3 || report.swot.threats.length > 3) && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowAllSwot(!showAllSwot)}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
            >
              {showAllSwot ? t.showLess : t.showMore}
            </button>
          </div>
        )}
      </section>

      {/* Subsection 4: Threats & Mitigations */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-950">
              {t.threatsTitle}
            </h3>
          </div>
          {renderBadge(report.provenance)}
        </div>

        <div className="space-y-3">
          {(showAllThreats ? report.threats : report.threats.slice(0, 3)).map((threat, idx) => {
            const badge = getThreatBadge(threat.type);
            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-900 font-semibold mb-2">
                  {threat.description}
                </p>
                <div className="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs text-emerald-950">
                  <strong className="font-bold text-emerald-900">{t.mitigationStrategyLabel}</strong>{' '}
                  <span className="font-medium">{threat.mitigation}</span>
                </div>
              </div>
            );
          })}
        </div>
        {report.threats.length > 3 && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => setShowAllThreats(!showAllThreats)}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
            >
              {showAllThreats ? t.showLess : `${t.showMore} (${report.threats.length - 3})`}
            </button>
          </div>
        )}
      </section>

      {/* Subsection 5: Competitor Map (from Overpass) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-950">
                {t.competitorMapTitle} (OpenStreetMap - OSM)
              </h3>
            </div>
          </div>
          {renderBadge(location.competitorsCountProvenance || 'MEASURED')}
        </div>

        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed mb-3">
          Spatial scan mapped <strong className="font-bold text-slate-950">{location.competitorsNearbyCount} {t.competitorsNearby.toLowerCase()}</strong> {t.withinPrimary15kmZone} <span className="font-semibold text-slate-900">{location.areaName}</span>.
        </p>

        {location.competitors && location.competitors.length > 0 ? (
          <div className="overflow-x-auto border border-slate-200 rounded-xl mb-3">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 font-bold">{t.competitorNameHeader}</th>
                  <th className="p-2.5 font-bold">{t.distanceFromSiteHeader}</th>
                  <th className="p-2.5 font-bold">{t.categoryTagHeader}</th>
                  <th className="p-2.5 font-bold">{t.dataProvenanceHeader}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {location.competitors.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{c.name}</td>
                    <td className="p-2.5 font-mono text-slate-700">{c.distanceKm} km</td>
                    <td className="p-2.5 text-slate-600 uppercase text-[10px]">{c.type || 'Shop'}</td>
                    <td className="p-2.5">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        OpenStreetMap (Measured)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 font-medium mb-3">
            {location.competitorsNote || 'No OpenStreetMap data found for this area (common in villages); count is a model estimate.'}
          </div>
        )}
      </section>

      {/* Subsection 6: Pricing Guidance */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
              <Tag className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-950">
              {t.pricingGuidanceTitle}
            </h3>
          </div>
          {renderBadge(report.provenance)}
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Recommended Pricing Strategy:
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              {report.pricing.strategy}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 font-medium leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>{t.pricingGuidanceNoteLabel}:</span>
            </div>
            <p>{report.pricing.priceBandNote}</p>
          </div>
        </div>
      </section>

      {/* Assumptions Footer */}
      {report.assumptions && report.assumptions.length > 0 && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
          <span className="font-bold text-slate-800 block mb-1">{t.feasibilityAssumptionsTitle}</span>
          <ul className="list-disc list-inside space-y-1 font-medium">
            {report.assumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
