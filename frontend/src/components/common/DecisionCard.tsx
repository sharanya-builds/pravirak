import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRightCircle, 
  Scale, 
  Ban, 
  TrendingUp, 
  Users, 
  MapPin, 
  WalletCards,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { BusinessDecisionResult, DecisionState, Language, PillarGrade, Provenance } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface DecisionCardProps {
  decisionResult: BusinessDecisionResult;
  currentLanguage?: Language;
  onScrollToEvidence?: () => void;
  onScrollToFinancials?: () => void;
  onScrollToMap?: () => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  decisionResult,
  onScrollToEvidence,
  onScrollToFinancials,
  onScrollToMap
}) => {
  const [showLocationFitBreakdown, setShowLocationFitBreakdown] = useState(false);
  const { t, language } = useLanguage();
  const { decision, headline, summaryExplanation, pillars, locationFitAnalysis } = decisionResult;

  // Localized decision themes
  const getDecisionTheme = (state: DecisionState) => {
    switch (state) {
      case 'START HERE':
      case 'START':
        return {
          badgeBg: 'bg-emerald-700 text-white',
          borderAccent: 'border-emerald-600 dark:border-emerald-500',
          bgLight: 'bg-emerald-50/70 dark:bg-[#041C12]',
          icon: <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400 shrink-0" />,
          label: language === 'te' ? 'ఇక్కడ ప్రారంభించండి' : language === 'hi' ? 'यहाँ से शुरू करें' : 'START HERE',
          description: language === 'te' 
            ? 'అనుకూలమైన నష్ట-లాభ సమతుల్యతతో అద్భుతమైన స్థాన అనుకూలత.'
            : language === 'hi' 
            ? 'अनुकूल जोखिम-इनाम संतुलन के साथ उत्कृष्ट स्थान उपयुक्तता।'
            : 'High location fit with favorable risk-reward alignment.'
        };
      case 'MOVE TO A BETTER LOCATION':
      case 'MOVE':
        return {
          badgeBg: 'bg-amber-600 text-white',
          borderAccent: 'border-amber-500 dark:border-amber-500',
          bgLight: 'bg-amber-50/70 dark:bg-[#1C1202]',
          icon: <ArrowRightCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 dark:text-amber-400 shrink-0" />,
          label: language === 'te' ? 'మంచి స్థానానికి మారండి' : language === 'hi' ? 'बेहतर स्थान पर जाएं' : 'MOVE TO A BETTER LOCATION',
          description: language === 'te'
            ? 'ప్రస్తుత స్థలంలో అధిక పోటీ; సమీపంలో మెరుగైన స్థలం గుర్తించబడింది.'
            : language === 'hi'
            ? 'वर्तमान स्थल पर अत्यधिक प्रतिस्पर्धा; पास में बेहतर विकल्प उपलब्ध।'
            : 'Saturated competition at current site; superior alternative identified nearby.'
        };
      case 'REDUCE SCALE':
        return {
          badgeBg: 'bg-amber-700 text-white',
          borderAccent: 'border-amber-600 dark:border-amber-500',
          bgLight: 'bg-amber-50/70 dark:bg-[#1C1202]',
          icon: <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 dark:text-amber-400 shrink-0" />,
          label: language === 'te' ? 'పరిమాణాన్ని తగ్గించండి' : language === 'hi' ? 'पैमाना कम करें' : 'REDUCE SCALE',
          description: language === 'te'
            ? 'రుణ భారం మీ ప్రారంభ పెట్టుబడి సురక్షిత పరిమితిని మించిపోయింది.'
            : language === 'hi'
            ? 'ऋण का बोझ आपकी शुरुआती व्यक्तिगत पूंजी की सुरक्षित सीमा से अधिक है।'
            : 'Debt burden exceeds safe limits for initial promoter equity.'
        };
      case 'VALIDATE FIRST':
        return {
          badgeBg: 'bg-sky-700 text-white',
          borderAccent: 'border-sky-600 dark:border-sky-500',
          bgLight: 'bg-sky-50/70 dark:bg-[#031522]',
          icon: <Info className="w-8 h-8 sm:w-10 sm:h-10 text-sky-600 dark:text-sky-400 shrink-0" />,
          label: language === 'te' ? 'ముందుగా ధృవీకరించండి' : language === 'hi' ? 'पहले परीक्षण करें' : 'VALIDATE FIRST',
          description: language === 'te'
            ? 'పెద్ద పెట్టుబడి పెట్టేముందు కస్టమర్ల కొనుగోలు ఆసక్తిని పరీక్షించండి.'
            : language === 'hi'
            ? 'स्थिर पूंजी लगाने से पहले ग्राहकों की मांग का परीक्षण करें।'
            : 'Test consumer willingness to pay before committing fixed capex.'
        };
      case 'DON\'T BORROW YET':
        return {
          badgeBg: 'bg-rose-700 text-white',
          borderAccent: 'border-rose-600 dark:border-rose-500',
          bgLight: 'bg-rose-50/70 dark:bg-[#1C0508]',
          icon: <Ban className="w-8 h-8 sm:w-10 sm:h-10 text-rose-600 dark:text-rose-400 shrink-0" />,
          label: language === 'te' ? 'ఇప్పుడే రుణం తీసుకోవద్దు' : language === 'hi' ? 'अभी ऋण न लें' : 'DON\'T BORROW YET',
          description: language === 'te'
            ? 'రుణ చెల్లింపు కవరేజ్ ప్రమాదకరంగా ఉంది; సొంత నిధులతో ప్రారంభించండి.'
            : language === 'hi'
            ? 'ऋण सेवा कवरेज संवेदनशील है; व्यक्तिगत बचत से शुरू करें।'
            : 'Debt service coverage is vulnerable; boot-strap or start with personal funds.'
        };
      case 'RECONSIDER':
      default:
        return {
          badgeBg: 'bg-rose-700 text-white',
          borderAccent: 'border-rose-600 dark:border-rose-500',
          bgLight: 'bg-rose-50/70 dark:bg-[#1C0508]',
          icon: <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-rose-600 dark:text-rose-400 shrink-0" />,
          label: language === 'te' ? 'పునరాలోచించండి' : language === 'hi' ? 'पुनर्विचार करें' : 'RECONSIDER',
          description: language === 'te'
            ? 'ప్రతికూల లాభ మార్జిన్లు లేదా అధిక స్థానిక పోటీ.'
            : language === 'hi'
            ? 'प्रतिकूल यूनिट अर्थशास्त्र या अत्यधिक स्थानीय बाज़ार संतृप्ति।'
            : 'Unfavorable unit economics or excessive local saturation.'
        };
    }
  };

  const theme = getDecisionTheme(decision);

  const getPillarGradeLabel = (grade: PillarGrade): string => {
    if (language === 'te') {
      switch (grade) {
        case 'Good': return 'మంచిది';
        case 'Suitable': return 'అనుకూలం';
        case 'Low': return 'తక్కువ (అనుకూలం)';
        case 'Moderate': return 'మధ్యస్థం';
        case 'Stretched': return 'ఒత్తిడితో కూడినది';
        case 'High': return 'ఎక్కువ';
        case 'Unviable': return 'సాధ్యం కానిది';
        case 'Poor': return 'బలహీనం';
        default: return grade;
      }
    }
    if (language === 'hi') {
      switch (grade) {
        case 'Good': return 'अच्छा';
        case 'Suitable': return 'उपयुक्त';
        case 'Low': return 'कम (अनुकूल)';
        case 'Moderate': return 'मध्यम';
        case 'Stretched': return 'तनावपूर्ण';
        case 'High': return 'उच्च';
        case 'Unviable': return 'अव्यवहार्य';
        case 'Poor': return 'कमज़ोर';
        default: return grade;
      }
    }
    return grade;
  };

  const getPillarPill = (grade: PillarGrade) => {
    switch (grade) {
      case 'Good':
      case 'Suitable':
      case 'Low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'Moderate':
      case 'Stretched':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'High':
      case 'Unviable':
      case 'Poor':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300 font-bold';
    }
  };

  const getProvenanceBadge = (prov: Provenance) => {
    switch (prov) {
      case 'MEASURED':
      case 'OBSERVED':
      case 'SOURCED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'AI_GENERATED':
      case 'AI INTERPRETATION':
        return 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
      case 'ESTIMATED':
      case 'DEMO':
      default:
        return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
    }
  };

  const provenanceLabel = (prov: Provenance): string => {
    const isMeasured = prov === 'MEASURED' || prov === 'OBSERVED' || prov === 'SOURCED';
    const isAi = prov === 'AI_GENERATED' || prov === 'AI INTERPRETATION';

    if (language === 'hi') {
      if (isMeasured) return 'मापा गया (Measured)';
      if (isAi) return 'एआई (AI)';
      return 'अनुमानित (Estimated)';
    }
    if (language === 'te') {
      if (isMeasured) return 'కొలిచినది (Measured)';
      if (isAi) return 'AI';
      return 'అంచనా (Estimated)';
    }
    if (isMeasured) return 'Measured';
    if (isAi) return 'AI';
    return 'Estimated';
  };

  return (
    <div className={`bg-white dark:bg-[#0A0A0A] rounded-2xl border-2 ${theme.borderAccent} shadow-sm overflow-hidden transition-all`}>
      {/* Official Header Banner */}
      <div className="bg-slate-900 text-white px-5 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase">
            {t.yourDecision}
          </h2>
        </div>
        <div className="text-[11px] text-slate-300 font-medium">
          {language === 'te' 
            ? 'ఖచ్చితమైన బ్యాంకింగ్ అండర్‌రైటింగ్ ఇంజిన్ • లాభాల కల్పిత హామీలు ఇవ్వదు'
            : language === 'hi'
            ? 'कठोर बैंकिंग अंडरराइटिंग इंजन • लाभ का झूठा वादा कभी नहीं'
            : 'Deterministic Underwriting Engine • Never Promises Profit'}
        </div>
      </div>

      {/* Main Core Recommendation Area */}
      <div className={`p-5 sm:p-8 ${theme.bgLight} border-b border-slate-200 dark:border-neutral-800`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {theme.icon}
            <div>
              <div className="text-xs uppercase font-bold text-slate-600 dark:text-neutral-300 tracking-wider">
                {language === 'te' ? 'వేదిక నిర్ణయ ఫలితం' : language === 'hi' ? 'మंच का निर्णय परिणाम' : 'Platform Decision Outcome'}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className={`inline-block px-4 py-1.5 rounded-xl font-black text-xl sm:text-2xl tracking-wide shadow-xs ${theme.badgeBg}`}>
                  {theme.label}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-neutral-200 hidden md:inline">
                  {theme.description}
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right w-full sm:w-auto">
            <span className="text-[11px] font-bold text-slate-600 dark:text-neutral-400 block uppercase tracking-wider">
              {language === 'te' ? 'అండర్‌రైటింగ్ ప్రమాణం' : language === 'hi' ? 'अंडरराइटिंग मानक' : 'Underwriting Standard'}
            </span>
            <span className="text-xs text-slate-700 dark:text-neutral-300 font-semibold">
              {language === 'te' 
                ? 'ధృవీకరించదగిన మార్కెట్ డేటా మరియు ఆర్థిక భద్రత ఆధారంగా నిష్పక్షపాత విశ్లేషణ'
                : language === 'hi'
                ? 'सत्यापनीय बाज़ार संकेतों और वित्तीय सुरक्षा पर आधारित निष्पक्ष मूल्यांकन'
                : 'Objective appraisal based on verifiable market signals & financial safety'}
            </span>
          </div>
        </div>

        {/* Headline & Concise Explanation - BIGGER & DARKER FONTS */}
        <div className="mt-5 bg-white dark:bg-[#0D0D0D] rounded-2xl p-5 sm:p-6 border border-slate-300 dark:border-neutral-800 shadow-sm">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 dark:text-white leading-snug">
            {headline}
          </h3>
          <p className="text-sm sm:text-base text-slate-900 dark:text-neutral-200 mt-2.5 leading-relaxed font-medium">
            {summaryExplanation}
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="p-5 sm:p-8 bg-slate-50/60 dark:bg-[#0A0A0A]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-indigo-900 dark:bg-indigo-400 rounded-xs"></span>
            {language === 'te' ? 'నాలుగు మూల్యాంకన స్తంభాలు' : language === 'hi' ? 'चार मूल्यांकन स्तंभ' : 'Four Evaluation Pillars'}
          </h4>
          <span className="text-xs font-semibold text-slate-600 dark:text-neutral-400">
            {language === 'te' ? 'వివరాల కోసం క్లిక్ చేయండి' : language === 'hi' ? 'विवरण के लिए क्लिक करें' : 'Tap Location Fit for factor provenance'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {/* Pillar 1: Local Demand */}
          <div 
            onClick={onScrollToEvidence}
            className="bg-white dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-2xs hover:border-indigo-300 dark:hover:border-neutral-600 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-800 dark:text-neutral-200">
                <TrendingUp className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                <span className="text-xs font-bold uppercase">{t.localDemand}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-md border ${getPillarPill(pillars.localDemand.grade)}`}>
                {getPillarGradeLabel(pillars.localDemand.grade)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-neutral-300 leading-relaxed font-medium group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
              {pillars.localDemand.commentary}
            </p>
          </div>

          {/* Pillar 2: Competition */}
          <div 
            onClick={onScrollToMap}
            className="bg-white dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-2xs hover:border-indigo-300 dark:hover:border-neutral-600 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-800 dark:text-neutral-200">
                <Users className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                <span className="text-xs font-bold uppercase">{t.competition}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-md border ${getPillarPill(pillars.competition.grade)}`}>
                {getPillarGradeLabel(pillars.competition.grade)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-neutral-300 leading-relaxed font-medium group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
              {pillars.competition.commentary}
            </p>
          </div>

          {/* Pillar 3: Location Fit */}
          <div 
            onClick={() => setShowLocationFitBreakdown(!showLocationFitBreakdown)}
            className={`p-4 rounded-xl border transition-all cursor-pointer group ${
              showLocationFitBreakdown ? 'bg-indigo-50/50 dark:bg-[#14142B] border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-950/10' : 'bg-white dark:bg-[#121212] border-slate-200 dark:border-neutral-800 shadow-2xs hover:border-indigo-300 dark:hover:border-neutral-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-800 dark:text-neutral-200">
                <MapPin className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                <span className="text-xs font-bold uppercase">{t.locationFit}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black font-mono text-indigo-950 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                  {locationFitAnalysis.overallFitScore}/100
                </span>
                {showLocationFitBreakdown ? <ChevronUp className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-neutral-300 leading-relaxed font-medium group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
              {locationFitAnalysis.fitCategory}: {pillars.locationFit.commentary}
            </p>
          </div>

          {/* Pillar 4: Financial Feasibility */}
          <div 
            onClick={onScrollToFinancials}
            className="bg-white dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-2xs hover:border-indigo-300 dark:hover:border-neutral-600 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-800 dark:text-neutral-200">
                <WalletCards className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                <span className="text-xs font-bold uppercase">{t.financialFeasibility}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-md border ${getPillarPill(pillars.financialFeasibility.grade)}`}>
                {getPillarGradeLabel(pillars.financialFeasibility.grade)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-neutral-300 leading-relaxed font-medium group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
              {pillars.financialFeasibility.commentary}
            </p>
          </div>
        </div>

        {/* DETAILED LOCATION FIT FACTORS BREAKDOWN WITH PROVENANCE */}
        {showLocationFitBreakdown && (
          <div className="bg-white dark:bg-[#0E0E0E] rounded-xl p-4 sm:p-5 border border-indigo-200 dark:border-neutral-800 shadow-sm mt-3 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-900 dark:text-indigo-400" />
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'te' 
                    ? `స్థాన అనుకూలత కారకాల విశ్లేషణ (స్కోరు: ${locationFitAnalysis.overallFitScore}/100)`
                    : language === 'hi'
                    ? `स्थान उपयुक्तता कारक विश्लेषण (स्कोर: ${locationFitAnalysis.overallFitScore}/100)`
                    : `Location Fit Factor Breakdown (Score: ${locationFitAnalysis.overallFitScore}/100)`}
                </h5>
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase">
                {language === 'te' ? 'ఆడిట్ చేయబడిన డేటా ఆధారాలు' : language === 'hi' ? 'सत्यापित डेटा प्रमाण' : 'Audited Factor Provenance'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs mb-3">
              {locationFitAnalysis.factors.map((factor, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 dark:bg-[#161616] rounded-xl border border-slate-200 dark:border-neutral-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{factor.name}</span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm border uppercase ${getProvenanceBadge(factor.provenance)}`}>
                        {provenanceLabel(factor.provenance)}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 dark:text-neutral-200 font-medium leading-relaxed mt-1">
                      {factor.detail}
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-neutral-400 font-medium">
                      {language === 'te' ? 'మూల్యాంకనం:' : language === 'hi' ? 'मूल्यांकन:' : 'Evaluation:'}
                    </span>
                    <strong className="text-indigo-950 dark:text-indigo-300 font-bold">{factor.label} ({factor.score}/100)</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50/80 dark:bg-[#1A1202] p-3 rounded-xl border border-amber-200 dark:border-amber-900 flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200 font-medium leading-relaxed">
              <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>{language === 'te' ? 'డేటా ఆధారాల సూచన:' : language === 'hi' ? 'डेटा प्रमाण सूचना:' : 'Data Provenance Notice:'}</strong>{' '}
                {language === 'te'
                  ? 'ఆధారాల ట్యాగ్‌లు ఈ అంశాలు నిజమైన APIల ద్వారా కొలవబడ్డాయా (Measured), మోడల్స్ ద్వారా అంచనా వేయబడ్డాయా (Estimated) లేదా AI ద్వారా రూపొందించబడ్డాయా (AI) అని స్పష్టంగా సూచిస్తాయి.'
                  : language === 'hi'
                  ? 'प्रमाण टैग स्पष्ट रूप से दर्शाते हैं कि कारक वास्तविक API द्वारा मापे गए हैं (Measured), मॉडल द्वारा अनुमानित हैं (Estimated) या AI द्वारा उत्पन्न हैं (AI)।'
                  : 'Provenance tags show data origin: Measured from real APIs, Estimated via models and benchmarks, or AI Generated.'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
