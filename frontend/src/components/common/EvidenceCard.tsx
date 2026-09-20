import React from 'react';
import { Shield, Database, Eye, Cpu, Calendar } from 'lucide-react';
import { ConfidenceLevel, EvidenceItem, EvidenceType, Provenance } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface EvidenceBadgeProps {
  type?: EvidenceType;
  provenance?: Provenance;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ type, provenance }) => {
  const { language } = useLanguage();

  const isMeasured = provenance === 'MEASURED' || type === 'Observed' || type === 'Sourced';
  const isAi = provenance === 'AI_GENERATED' || type === 'AI interpretation';

  if (isMeasured) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
        <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        {language === 'hi' ? 'मापा गया (Measured)' : language === 'te' ? 'కొలిచినది (Measured)' : 'Measured'}
      </span>
    );
  }

  if (isAi) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
        <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
        {language === 'hi' ? 'एआई (AI)' : language === 'te' ? 'AI' : 'AI'}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
      <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      {language === 'hi' ? 'अनुमानित (Estimated)' : language === 'te' ? 'అంచనా (Estimated)' : 'Estimated'}
    </span>
  );
};

interface EvidenceCardProps {
  item: EvidenceItem;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ item }) => {
  const { language } = useLanguage();

  const getConfidenceBadge = (confidence: ConfidenceLevel) => {
    switch (confidence) {
      case 'HIGH':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'LOW':
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getConfidenceText = (confidence: ConfidenceLevel) => {
    if (language === 'te') {
      switch (confidence) {
        case 'HIGH': return 'అధిక విశ్వసనీయత';
        case 'MEDIUM': return 'మధ్యస్థ విశ్వసనీయత';
        case 'LOW': return 'సాధారణ విశ్వసనీయత';
      }
    }
    if (language === 'hi') {
      switch (confidence) {
        case 'HIGH': return 'उच्च विश्वसनीयता';
        case 'MEDIUM': return 'मध्यम विश्वसनीयता';
        case 'LOW': return 'सामान्य विश्वसनीयता';
      }
    }
    return `${confidence} CONFIDENCE`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <EvidenceBadge type={item.type} provenance={item.provenance} />

          <div className="flex items-center gap-2">
            {item.vintage && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {item.vintage}
              </span>
            )}
            <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md border uppercase ${getConfidenceBadge(item.confidence)}`}>
              {getConfidenceText(item.confidence)}
            </span>
          </div>
        </div>

        <h4 className="text-base sm:text-lg font-bold text-slate-950 leading-snug">
          {item.title}
        </h4>

        {/* Explanation font is larger and darker */}
        <p className="text-sm sm:text-base text-slate-900 mt-2.5 leading-relaxed font-medium">
          {item.detail}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="font-bold text-slate-800">
            {language === 'te' ? 'మూలం/వనరు:' : language === 'hi' ? 'स्रोत:' : 'Source:'}
          </span>
          <span className="text-slate-700">{item.source}</span>
        </div>
      </div>
    </div>
  );
};
