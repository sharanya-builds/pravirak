import React from 'react';
import { Sparkles, ArrowRight, TrendingUp, CheckCircle, MapPin } from 'lucide-react';
import { LocationData } from '../../types';
import { PrimaryButton } from '../common/PrimaryButton';
import { useLanguage } from '../../context/LanguageContext';

interface LocationComparisonProps {
  location: LocationData;
  onApplyAlternative: () => void;
  isAlternativeApplied?: boolean;
}

export const LocationComparison: React.FC<LocationComparisonProps> = ({
  location,
  onApplyAlternative,
  isAlternativeApplied = false
}) => {
  const alt = location.alternativeLocation;
  const { t } = useLanguage();
  if (!alt) return null;

  const currentFit = location.score || 76;
  const altFit = alt.score;

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              {t.nextStepsTitle}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {t.locationFit}: {location.areaName} vs {alt.areaName}
            </h3>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-indigo-200 font-semibold">
          {t.potentialFitGain} <strong className="text-emerald-400 font-bold">+{altFit - currentFit} {t.pointsLabel}</strong>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Side by Side Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Current Location Card */}
          <div className={`p-4 sm:p-5 rounded-xl border transition-all ${
            isAlternativeApplied ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-indigo-50/40 border-indigo-200 ring-2 ring-indigo-950/10'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {t.currentLocation}
              </span>
              {!isAlternativeApplied && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-slate-900 text-white">
                  {t.activeBadge}
                </span>
              )}
            </div>

            <div className="text-sm sm:text-base font-extrabold text-slate-950 mb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="truncate">{location.areaName}</span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-950 font-mono">
                {currentFit}
              </span>
              <span className="text-xs text-slate-800 font-bold">{t.locationFitUnit}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 mt-2.5 leading-relaxed font-medium">
              Subject to standard commercial rentals and existing competitor density ({location.competitorsNearbyCount} nearby outlets).
            </p>
          </div>

          {/* Alternative Location Card */}
          <div className={`p-4 sm:p-5 rounded-xl border transition-all ${
            isAlternativeApplied ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-600/20' : 'bg-emerald-50/50 border-emerald-300'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                {t.alternativeLocation}
              </span>
              {isAlternativeApplied ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-emerald-700 text-white flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> {t.activeBadge}
                </span>
              ) : (
                <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-emerald-200 text-emerald-900">
                  {t.higherFitBadge}
                </span>
              )}
            </div>

            <div className="text-sm sm:text-base font-extrabold text-slate-950 mb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{alt.areaName}</span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-900 font-mono">
                {altFit}
              </span>
              <span className="text-xs text-emerald-800 font-bold">{t.locationFitUnit}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-900 mt-2.5 leading-relaxed font-semibold">
              {alt.advantageReason}
            </p>
          </div>
        </div>

        {/* Advantage Highlights */}
        <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 mb-5">
          <h4 className="text-xs sm:text-sm font-bold text-slate-950 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-900" />
            {t.whyAlternativeBetter}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <div className="text-slate-800 font-bold">{t.footfallAdvantage}</div>
              <div className="text-base font-extrabold text-emerald-700 mt-0.5 font-mono">
                +{alt.footfallGainPct}%
              </div>
              <div className="text-xs text-slate-800 font-medium mt-1">{t.footfallAdvantageSub}</div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <div className="text-slate-800 font-bold">{t.commercialLeaseRent}</div>
              <div className="text-base font-extrabold text-emerald-700 mt-0.5 font-mono">
                {Math.abs(alt.rentDifferentialPct)}%
              </div>
              <div className="text-xs text-slate-800 font-medium mt-1">{t.commercialRentSub}</div>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <div className="text-slate-800 font-bold">{t.competitorDensity}</div>
              <div className="text-base font-extrabold text-indigo-950 mt-0.5">
                {alt.competitorDensity}
              </div>
              <div className="text-xs text-slate-800 font-medium mt-1">{t.competitorDensitySub}</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs sm:text-sm text-slate-900 font-medium text-center sm:text-left">
            {t.adoptingLocationNotice}
          </p>

          <PrimaryButton
            onClick={onApplyAlternative}
            variant={isAlternativeApplied ? 'secondary' : 'primary'}
            size="md"
            icon={isAlternativeApplied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            {isAlternativeApplied ? t.adoptedClickRevert : t.considerThisLocation.toUpperCase()}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
