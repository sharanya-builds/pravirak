import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Volume2, 
  VolumeX, 
  Bot,
  Loader2
} from 'lucide-react';
import { BusinessDecisionResult, BusinessInput, FinancialAnalysis, LocationData } from '../../types';
import { answerCustomQuestion, generateContextualQnA } from '../../engine/aiAdvisorEngine';
import { advisorApi } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

interface AskPravirakProps {
  input: BusinessInput;
  location: LocationData;
  financials: FinancialAnalysis;
  decisionResult: BusinessDecisionResult;
}

export const AskPravirak: React.FC<AskPravirakProps> = ({
  input,
  location,
  financials,
  decisionResult
}) => {
  const { t, language } = useLanguage();
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('why_location');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [activeAnswer, setActiveAnswer] = useState<string>('');
  const [activeQuestionTitle, setActiveQuestionTitle] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeModel, setActiveModel] = useState<string>('');

  // Pre-generate the 6 grounded Q&A items based on active user context and language
  const faqs = generateContextualQnA(input, location, financials, decisionResult, language);

  // Reset or update active answer when language changes
  useEffect(() => {
    const item = faqs.find((f) => f.id === selectedQuestionId) || faqs[0];
    if (item && selectedQuestionId !== 'custom') {
      setActiveQuestionTitle(item.question);
      setActiveAnswer(item.answer);
      setActiveModel('');
    }
  }, [language, selectedQuestionId]);

  // Set default answer on mount / question selection
  const handleSelectFaq = (faqId: string) => {
    const item = faqs.find((f) => f.id === faqId) || faqs[0];
    setSelectedQuestionId(item.id);
    setActiveQuestionTitle(item.question);
    setActiveAnswer(item.answer);
    setActiveModel('');
    stopSpeaking();
  };

  // Handle custom query submission with real conversational NLP LLM
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim() || isLoading) return;

    const userQuery = customQuery.trim();
    setSelectedQuestionId('custom');
    setActiveQuestionTitle(userQuery);
    setCustomQuery('');
    stopSpeaking();
    setIsLoading(true);

    advisorApi
      .ask({
        question: userQuery,
        businessIdea: input.businessIdea,
        category: input.category || input.businessIdea,
        location,
        financials,
        decision: decisionResult.decision,
        language
      })
      .then((res) => {
        if (res && res.answer) {
          setActiveAnswer(res.answer);
          if (res.model) {
            setActiveModel(res.model);
          }
        } else {
          throw new Error('Empty response');
        }
      })
      .catch(() => {
        // Deterministic local NLP fallback if network/API is unavailable
        const fallback = answerCustomQuestion(
          userQuery,
          input,
          location,
          financials,
          decisionResult,
          language
        );
        setActiveAnswer(fallback);
        setActiveModel('Pravirak Context Engine');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Text to Speech support for accessibility
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
    } else {
      const utterance = new SpeechSynthesisUtterance(activeAnswer);
      if (language === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (language === 'te') {
        utterance.lang = 'te-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div className="bg-white dark:bg-[#0D0D0D] rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      {/* Official Header */}
      <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-neutral-800 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              {t.contextGroundedAdvisory}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {t.askAiAdvisor.toUpperCase()}
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 font-medium">
          {t.askAboutAnalysis}
        </p>
      </div>

      <div className="p-5 sm:p-6">
        {/* Suggested Quick Question Chips */}
        <div className="mb-6">
          <label className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-[#D1D5DB] uppercase tracking-wide mb-3">
            {t.suggestedQuestionsLabel}
          </label>
          <div className="flex flex-wrap gap-2">
            {faqs.map((faq, idx) => {
              const chipThemes = [
                'bg-amber-50/80 text-amber-950 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200/90 dark:border-amber-900/50 hover:bg-amber-100',
                'bg-sky-50/80 text-sky-950 dark:bg-sky-950/30 dark:text-sky-300 border-sky-200/90 dark:border-sky-900/50 hover:bg-sky-100',
                'bg-emerald-50/80 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-900/50 hover:bg-emerald-100',
                'bg-violet-50/80 text-violet-950 dark:bg-violet-950/30 dark:text-violet-300 border-violet-200/90 dark:border-violet-900/50 hover:bg-violet-100',
              ];
              const inactiveClass = chipThemes[idx % chipThemes.length];

              return (
                <button
                  key={faq.id}
                  onClick={() => handleSelectFaq(faq.id)}
                  className={`text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border transition-all text-left font-semibold cursor-pointer ${
                    selectedQuestionId === faq.id
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm font-bold scale-[1.01]'
                      : inactiveClass
                  }`}
                >
                  {faq.question}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Question & Grounded AI Answer Display */}
        <div className="bg-slate-50 dark:bg-[#161616] rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-neutral-800 shadow-2xs mb-6">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-5 h-5 text-indigo-900 dark:text-indigo-400 shrink-0" />
              <h4 className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-[#D1D5DB] truncate">
                {activeQuestionTitle || t.askAiAdvisor}
              </h4>
            </div>

            {/* Read Aloud Audio Button */}
            {!isLoading && activeAnswer && (
              <button
                onClick={handleToggleSpeech}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors shrink-0 cursor-pointer ${
                  isSpeaking
                    ? 'bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                    : 'bg-indigo-50 text-indigo-900 dark:bg-neutral-800 dark:text-[#D1D5DB] border-indigo-200 dark:border-neutral-700 hover:bg-indigo-100'
                }`}
                title="Read answer aloud"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <span>{t.stop}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                    <span>{t.listen}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Answer or Loading Body */}
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-8 h-8 text-[#1E3A8A] animate-spin" />
              <div className="text-sm font-bold text-slate-800 dark:text-[#D1D5DB]">
                {t.aiAdvisorThinking}
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-sm">
                Evaluating location footfall, competition, capital buffer, and loan servicing metrics...
              </p>
            </div>
          ) : (
            <div className="pt-4 text-sm sm:text-base text-slate-950 dark:text-[#D1D5DB] leading-relaxed font-medium whitespace-pre-wrap">
              {activeAnswer}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs text-slate-700 dark:text-neutral-400 font-medium">
            <span>{t.askEngineFooter}</span>
            <span className="font-bold text-slate-900 dark:text-[#D1D5DB]">
              {activeModel ? activeModel : t.aiAdvisorPoweredBy}
            </span>
          </div>
        </div>

        {/* Ask Your Own Question Box */}
        <form onSubmit={handleCustomSubmit} className="relative">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customQuery}
              disabled={isLoading}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder={t.askInputPlaceholder}
              className="flex-1 bg-white dark:bg-[#161616] border border-slate-300 dark:border-neutral-700 text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-hidden text-slate-950 dark:text-[#D1D5DB] placeholder:text-slate-400 dark:placeholder:text-neutral-500 font-medium disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!customQuery.trim() || isLoading}
              className="bg-[#1E3A8A] text-white hover:bg-[#1E40AF] active:bg-[#172554] px-5 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-bold shrink-0 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <>
                  <span>{t.askButton}</span>
                  <Send className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
