import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Landmark, ExternalLink, Check, Info } from 'lucide-react';
import { GovernmentScheme } from '../../types';

interface SchemeCardProps {
  scheme: GovernmentScheme;
  isPrimaryRecommendation?: boolean;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  isPrimaryRecommendation = false
}) => {
  const { t, language } = useLanguage();

  const maxLoanLabel = language === 'te' ? 'గరిష్ట రుణం' : language === 'hi' ? 'अधिकतम ऋण' : 'Max Loan';
  const subsidyLabel = language === 'te' ? 'రాయితీ / సబ్సిడీ' : language === 'hi' ? 'सब्सिडी / राहत' : 'Subsidy / Relief';
  const interestLabel = language === 'te' ? 'వడ్డీ రేటు' : language === 'hi' ? 'ब्याज दर' : 'Interest Rate';
  const tenureLabel = language === 'te' ? 'కాలపరిమితి' : language === 'hi' ? 'अवधि और छूट' : 'Tenure & Grace';

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 ${
      isPrimaryRecommendation 
        ? 'border-indigo-600 border-t-4 border-t-teal-500 ring-2 ring-indigo-100 shadow-md' 
        : 'border-slate-200 shadow-md hover:border-slate-300'
    } p-6 sm:p-8 flex flex-col justify-between card-hover-float`}>
      <div>
        {/* Top Header */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${
              isPrimaryRecommendation ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm uppercase font-bold tracking-wider text-slate-600 block">
                {scheme.ministry}
              </span>
              <h4 className="text-lg sm:text-xl font-extrabold text-slate-950 leading-tight">
                {scheme.name}
              </h4>
            </div>
          </div>

          {isPrimaryRecommendation && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase tracking-wide">
              {scheme.matchScore}% {t.recommendedMatch}
            </span>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm sm:text-base">
          <div>
            <span className="text-sm text-slate-800 block uppercase font-bold">{maxLoanLabel}</span>
            <span className="font-extrabold text-slate-950 text-base sm:text-lg mt-0.5 block">{scheme.maxLoanText}</span>
          </div>
          <div>
            <span className="text-sm text-slate-800 block uppercase font-bold">{subsidyLabel}</span>
            <span className="font-extrabold text-indigo-950 text-base sm:text-lg mt-0.5 block">{scheme.maxSubsidyText}</span>
          </div>
          <div>
            <span className="text-sm text-slate-800 block uppercase font-bold">{interestLabel}</span>
            <span className="font-extrabold text-slate-950 text-base sm:text-lg mt-0.5 block">{scheme.interestRateText}</span>
          </div>
          <div>
            <span className="text-sm text-slate-800 block uppercase font-bold">{tenureLabel}</span>
            <span className="font-extrabold text-slate-950 text-base sm:text-lg mt-0.5 block">{scheme.tenureText}</span>
          </div>
        </div>

        {/* Why Matched / Eligibility explanation */}
        <div className="space-y-2 mb-4">
          <div className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-900"></span>
            {t.whyEligible}
          </div>
          <ul className="space-y-1.5">
            {scheme.matchReasons.map((reason, idx) => (
              <li key={idx} className="text-sm sm:text-base text-slate-800 font-medium flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Criteria Checklist */}
        <div className="border-t border-slate-100 pt-3">
          <div className="text-sm sm:text-base font-bold text-slate-900 mb-2">{t.keyFormalCriteria}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scheme.eligibilityCriteria.map((crit, idx) => (
              <div key={idx} className="text-sm sm:text-base text-slate-800 font-medium flex items-start gap-1.5">
                <span className="text-indigo-900 font-bold">•</span>
                <span>{crit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions & Disclaimers */}
      <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg p-3 mb-3.5 flex items-start gap-2.5 text-sm sm:text-base text-amber-950 dark:text-amber-200 font-medium leading-relaxed">
          <Info className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong className="font-bold text-amber-950 dark:text-amber-100">{t.officialVerificationNote}</strong> {t.verificationDisclaimer}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm sm:text-base text-slate-800 font-semibold">
            {t.nodalAgency} {scheme.nodalAgency}
          </span>
          <a
            href={scheme.applicationPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-xl text-sm sm:text-base font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <span>{t.officialPortal}</span>
            <ExternalLink className="w-4 h-4 text-amber-300" />
          </a>
        </div>
      </div>
    </div>
  );
};
