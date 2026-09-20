import React, { useState } from 'react';
import { 
  TrendingUp, 
  Store, 
  DollarSign, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw,
  IndianRupee,
  Layers,
  MapPin
} from 'lucide-react';
import { ExistingBusinessDiagnosis, ExistingBusinessInput } from '../../types';
import { diagnoseExistingBusiness } from '../../engine/existingBusinessEngine';
import { formatINR } from '../../engine/financialEngine';
import { PrimaryButton } from '../common/PrimaryButton';
import { MetricCard } from '../common/MetricCard';
import { useLanguage } from '../../context/LanguageContext';

interface ExistingBusinessFlowProps {
  onBackToHome: () => void;
}

export const ExistingBusinessFlow: React.FC<ExistingBusinessFlowProps> = ({ onBackToHome }) => {
  const { t, language } = useLanguage();
  const [stage, setStage] = useState<'INPUT' | 'DIAGNOSIS'>('INPUT');

  // Input states
  const [businessType, setBusinessType] = useState('Kirana / Retail Store');
  const [location, setLocation] = useState('Varanasi, UP');
  const [monthlyRevenue, setMonthlyRevenue] = useState(250000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(195000);
  const [existingDebtEMI, setExistingDebtEMI] = useState(12000);
  const [primaryGoal, setPrimaryGoal] = useState<ExistingBusinessInput['primaryGoal']>('Open another outlet');
  const [currentEmployees, setCurrentEmployees] = useState(3);

  const [diagnosis, setDiagnosis] = useState<ExistingBusinessDiagnosis | null>(null);

  const handleRunDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    const result = diagnoseExistingBusiness({
      businessType,
      location,
      monthlyRevenue,
      monthlyExpenses,
      existingDebtMonthlyEMI: existingDebtEMI,
      primaryGoal,
      currentEmployees
    });
    setDiagnosis(result);
    setStage('DIAGNOSIS');
  };

  const goalsList: ExistingBusinessInput['primaryGoal'][] = [
    'Improve profit',
    'Increase sales',
    'Add products',
    'Expand distribution',
    'Open another outlet',
    'Enter another market'
  ];

  const getGoalLabel = (g: ExistingBusinessInput['primaryGoal']) => {
    if (language === 'te') {
      const map: Record<string, string> = {
        'Improve profit': 'లాభాన్ని మెరుగుపరచండి',
        'Increase sales': 'అమ్మకాలను పెంచండి',
        'Add products': 'కొత్త ఉత్పత్తులను జోడించండి',
        'Expand distribution': 'పంపిణీని విస్తరించండి',
        'Open another outlet': 'మరొక శాఖను తెరవండి',
        'Enter another market': 'మరొక మార్కెట్లోకి ప్రవేశించండి'
      };
      return map[g] || g;
    }
    if (language === 'hi') {
      const map: Record<string, string> = {
        'Improve profit': 'लाभ में सुधार करें',
        'Increase sales': 'बिक्री बढ़ाएँ',
        'Add products': 'उत्पाद जोड़ें',
        'Expand distribution': 'वितरण का विस्तार करें',
        'Open another outlet': 'एक और शाखा खोलें',
        'Enter another market': 'दूसरे बाज़ार में प्रवेश करें'
      };
      return map[g] || g;
    }
    return g;
  };

  const formTitle = language === 'te' 
    ? 'వ్యాపార ఆరోగ్య తనిఖీ & విస్తరణ సమీక్ష' 
    : language === 'hi' 
    ? 'व्यावसायिक स्वास्थ्य जांच एवं विस्तार समीक्षा' 
    : 'Diagnostic Health Check & Expansion Audit';

  const formDesc = language === 'te'
    ? 'మార్జిన్ లీకేజీలు, రుణ సామర్థ్యం మరియు వృద్ధి అవకాశాలను విశ్లేషించడానికి మీ ప్రస్తుత నెలవారీ నిర్వహణ గణాంకాలను అందించండి.'
    : language === 'hi'
    ? 'मार्जिन लीकेज, विस्तार ऋण क्षमता और विकास के अवसरों का मूल्यांकन करने के लिए अपने वर्तमान मासिक आंकड़े दर्ज करें।'
    : 'Provide your current monthly operating figures to evaluate margin leakages, expansion debt headroom, and growth avenues.';

  const lblBusinessType = language === 'te' ? 'వ్యాపార రకం' : language === 'hi' ? 'व्यवसाय का प्रकार' : 'Business Type';
  const lblLocation = language === 'te' ? 'ప్రస్తుత నిర్వహణ స్థానం' : language === 'hi' ? 'वर्तमान संचालन स्थान' : 'Current Operating Location';
  const lblRevenue = language === 'te' ? 'నెలవారీ ఆదాయం (స్థూల విక్రయాలు)' : language === 'hi' ? 'मासिक राजस्व (सकल बिक्री)' : 'Monthly Revenue (Gross Sales)';
  const lblExpenses = language === 'te' ? 'నెలవారీ నిర్వహణ ఖర్చులు' : language === 'hi' ? 'मासिक परिचालन व्यय' : 'Monthly Operating Expenses';
  const lblDebt = language === 'te' ? 'ప్రస్తుత నెలవారీ రుణం (EMI)' : language === 'hi' ? 'मौजूदा मासिक ऋण (EMI)' : 'Existing Monthly Debt (EMI)';
  const lblGoal = language === 'te' ? 'మీ ప్రాథమిక వృద్ధి లక్ష్యాన్ని ఎంచుకోండి' : language === 'hi' ? 'अपना प्राथमिक विकास लक्ष्य चुनें' : 'Select Your Primary Growth Objective';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 text-white flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-bold text-indigo-900 tracking-wider">
              {language === 'te' ? 'ఇప్పటికే ఉన్న వ్యాపార డయాగ్నస్టిక్' : language === 'hi' ? 'मौजूदा उद्यम निदान' : 'Existing Enterprise Diagnostic'}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t.growExistingBusiness}
            </h2>
          </div>
        </div>

        <button
          onClick={onBackToHome}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          ← {t.backButton}
        </button>
      </div>

      {stage === 'INPUT' ? (
        /* Input Form */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1">
            {formTitle}
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            {formDesc}
          </p>

          <form onSubmit={handleRunDiagnosis} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Business Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  {lblBusinessType}
                </label>
                <input
                  type="text"
                  required
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder={t.placeholderBusinessIdea}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Current Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  {lblLocation}
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t.placeholderLocation}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-900 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Financial Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lblRevenue}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min={10000}
                    step={5000}
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-900 font-mono font-bold text-slate-900"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Formatted: {formatINR(monthlyRevenue, language)}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lblExpenses}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min={5000}
                    step={5000}
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-900 font-mono font-bold text-slate-900"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">{t.includesStockRentWages}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lblDebt}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={existingDebtEMI}
                    onChange={(e) => setExistingDebtEMI(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-900 font-mono font-bold text-slate-900"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">{t.enterZeroIfDebtFree}</span>
              </div>
            </div>

            {/* Growth Goal Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                {lblGoal}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {goalsList.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setPrimaryGoal(g)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                      primaryGoal === g
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold'
                        : 'bg-indigo-50/50 text-indigo-950 border-indigo-200/70 hover:bg-indigo-100/70'
                    }`}
                  >
                    <span>{getGoalLabel(g)}</span>
                    {primaryGoal === g && <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <PrimaryButton
                type="submit"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto cursor-pointer"
              >
                {language === 'te' ? 'విశ్లేషించండి & వృద్ధి ప్రణాళికను పొందండి' : language === 'hi' ? 'निदान करें और विकास योजना बनाएं' : 'DIAGNOSE & GENERATE GROWTH PLAN'}
              </PrimaryButton>
            </div>
          </form>
        </div>
      ) : diagnosis ? (
        /* Diagnosis & Growth Output Screen */
        <div className="space-y-6">
          {/* Health Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-5">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Current Enterprise Health Status
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                  Diagnosis for {businessType} in {location}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-extrabold px-3 py-1 rounded-xl border uppercase ${
                  diagnosis.financialHealth === 'Healthy'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                    : diagnosis.financialHealth === 'Vulnerable'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                    : 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                }`}>
                  {diagnosis.financialHealth} UNIT ECONOMICS
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <MetricCard
                label={t.currentMonthlyNetProfitLabel}
                value={formatINR(diagnosis.currentMonthlyProfit)}
                subtext={`Operating margin of ${diagnosis.profitMarginPct}%`}
                accent="emerald"
              />

              <MetricCard
                label={t.monthlyTurnoverLabel}
                value={formatINR(monthlyRevenue)}
                subtext={`Annualized Run Rate: ${formatINR(monthlyRevenue * 12)}`}
              />

              <MetricCard
                label={t.expansionCapitalNeededLabel}
                value={formatINR(diagnosis.expansionRecommendation.requiredCapital)}
                subtext={`Recommended Route: ${diagnosis.expansionRecommendation.recommendedFinancing}`}
                highlight={true}
              />
            </div>

            {/* Diagnostic Findings */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Detailed Diagnostic Audit:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {diagnosis.diagnostics.map((diag, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-900 font-bold">•</span>
                    <span>{diag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Profit Opportunities */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-900" />
                Immediate Profit Unlock Opportunities:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {diagnosis.profitOpportunities.map((opp, idx) => (
                  <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{opp.title}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-900 border border-indigo-100">
                        {opp.effort}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-700 font-semibold mt-1">
                      Est. Bottom-line Gain: +{formatINR(opp.estimatedGainMonthly)} / month
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expansion Recommendation Box */}
            <div className="bg-indigo-50/70 rounded-xl p-5 border border-indigo-200">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h4 className="text-sm font-bold text-indigo-950">
                  Target Strategy: {diagnosis.expansionRecommendation.title}
                </h4>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase">
                  {diagnosis.expansionRecommendation.expansionSafety} REPAYMENT SAFETY
                </span>
              </div>

              <p className="text-xs text-indigo-900 leading-relaxed mb-4">
                {t.expansionRequiresOutlay} <strong>{formatINR(diagnosis.expansionRecommendation.requiredCapital)}</strong>. {t.afterDebtServicingSurplus} <strong>{formatINR(diagnosis.expansionRecommendation.newMonthlySurplus)}/month</strong>.
              </p>

              <div className="border-t border-indigo-200/80 pt-3">
                <span className="text-xs font-bold text-indigo-950 block mb-2">
                  90-Day Step-by-Step Action Roadmap:
                </span>
                <div className="space-y-1.5">
                  {diagnosis.expansionRecommendation.actionChecklist.map((step, idx) => (
                    <div key={idx} className="text-xs text-indigo-900 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-700 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setStage('INPUT')}
                className="text-xs font-bold text-indigo-900 hover:text-indigo-950 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.adjustFinancialInputs}</span>
              </button>

              <PrimaryButton
                onClick={() => window.print()}
                variant="primary"
                size="md"
              >
                {t.downloadBusinessPlan}
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
