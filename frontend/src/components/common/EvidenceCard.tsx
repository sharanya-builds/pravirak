import React from 'react';
import { Shield, Database, Eye, Cpu, Calendar } from 'lucide-react';
import { ConfidenceLevel, EvidenceItem, EvidenceType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface EvidenceBadgeProps {
  type: EvidenceType;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ type }) => {
  const { language } = useLanguage();

  const getLabel = () => {
    if (language === 'te') {
      switch (type) {
        case 'Observed': return 'పరిశీలించినది (OBSERVED)';
        case 'Sourced': return 'ప్రభుత్వ వనరు (SOURCED)';
        case 'Estimated': return 'అంచనా వేసినది (ESTIMATED)';
        case 'AI interpretation': return 'AI వివరణ';
      }
    }
    if (language === 'hi') {
      switch (type) {
        case 'Observed': return 'अवलोकित (OBSERVED)';
        case 'Sourced': return 'सार्वजनिक स्रोत (SOURCED)';
        case 'Estimated': return 'अनुमानित (ESTIMATED)';
        case 'AI interpretation': return 'AI व्याख्या';
      }
    }
    switch (type) {
      case 'Observed': return 'OBSERVED';
      case 'Sourced': return 'SOURCED';
      case 'Estimated': return 'ESTIMATED';
      case 'AI interpretation': return 'AI INTERPRETATION';
    }
  };

  switch (type) {
    case 'Observed':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300">
          <Eye className="w-3.5 h-3.5 text-emerald-600" />
          {getLabel()}
        </span>
      );
    case 'Sourced':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-300">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          {getLabel()}
        </span>
      );
    case 'Estimated':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-300">
          <Shield className="w-3.5 h-3.5 text-amber-600" />
          {getLabel()}
        </span>
      );
    case 'AI interpretation':
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-purple-50 text-purple-900 border border-purple-300">
          <Cpu className="w-3.5 h-3.5 text-purple-600" />
          {getLabel()}
        </span>
      );
  }
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
          <EvidenceBadge type={item.type} />

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
