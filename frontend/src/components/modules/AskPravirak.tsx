import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Bot,
  Loader2,
  RotateCcw,
  Info
} from 'lucide-react';
import { BusinessDecisionResult, BusinessInput, FinancialAnalysis, LocationData } from '../../types';
import { generateContextualQnA, answerCustomQuestion } from '../../engine/aiAdvisorEngine';
import { advisorApi } from '../../api/client';
import { buildAnalysisContext } from '../../utils/buildAnalysisContext';
import { useLanguage } from '../../context/LanguageContext';
import { VoiceInputButton } from '../common/VoiceInputButton';

interface AskPravirakProps {
  input: BusinessInput;
  location: LocationData;
  financials: FinancialAnalysis;
  decisionResult: BusinessDecisionResult;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  /** True when answer came from LLM (vs local deterministic template) */
  aiGenerated?: boolean;
  /** Model string returned by the backend */
  model?: string;
  /** True when local fallback was used */
  fallback?: boolean;
  timestamp: string;
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const AskPravirak: React.FC<AskPravirakProps> = ({
  input,
  location,
  financials,
  decisionResult
}) => {
  const { t, language } = useLanguage();

  // Pre-generate the 6 grounded FAQ items (deterministic, no API call)
  const faqs = generateContextualQnA(input, location, financials, decisionResult, language);

  // Compact context sent to the backend for every LLM call
  const analysisContext = buildAnalysisContext(input, location, financials, decisionResult);

  // Chat history (session-scoped, reset on clear)
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [customQuery, setCustomQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Welcome message on mount / language change (only if history is empty)
  useEffect(() => {
    if (messages.length === 0) {
      const welcome =
        language === 'te'
          ? `నమస్తే! నేను మీ PRAVIRAK AI సలహాదారుని. క్రింది FAQ లు ఎంచుకోండి లేదా మీ స్వంత ప్రశ్న అడగండి.`
          : language === 'hi'
          ? `नमस्ते! मैं आपका PRAVIRAK AI सलाहकार हूँ। नीचे दिए गए सुझाए प्रश्नों में से चुनें या अपना खुद का प्रश्न पूछें।`
          : `Hello! I'm your PRAVIRAK AI Advisor. Select a suggested question below or ask your own.`;
      setMessages([
        { id: 'welcome-1', sender: 'assistant', text: welcome, aiGenerated: false, timestamp: nowTime() }
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Scroll to bottom on every new message or loading state change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // -------------------------------------------------------------------------
  // FAQ chip click — uses local deterministic template instantly (no API call)
  // -------------------------------------------------------------------------
  const handleSelectFaq = (faqId: string) => {
    stopSpeaking();
    const item = faqs.find((f) => f.id === faqId) || faqs[0];

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: item.question,
      timestamp: nowTime()
    };
    const assistantMsg: ChatMessage = {
      id: `faq-${Date.now()}`,
      sender: 'assistant',
      text: item.answer,
      aiGenerated: false, // deterministic template — no attribution line
      timestamp: nowTime()
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
  };

  // -------------------------------------------------------------------------
  // Custom query — calls /api/advisor/ask (LLM grounded on analysisContext)
  // -------------------------------------------------------------------------
  const handleCustomSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const question = customQuery.trim();
      if (!question || isLoading) return;

      // 500-char soft cap on the frontend too
      if (question.length > 500) {
        const warn =
          language === 'te'
            ? 'ప్రశ్న 500 అక్షరాల కంటే తక్కువగా ఉండాలి.'
            : language === 'hi'
            ? 'प्रश्न 500 अक्षरों से कम होना चाहिए।'
            : 'Please keep your question under 500 characters.';
        setMessages((prev) => [
          ...prev,
          { id: `warn-${Date.now()}`, sender: 'assistant', text: warn, aiGenerated: false, timestamp: nowTime() }
        ]);
        return;
      }

      stopSpeaking();
      setCustomQuery('');

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: question,
        timestamp: nowTime()
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await advisorApi.ask({ question, language, analysisContext });
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: res.answer,
          aiGenerated: true,
          fallback: res.fallback,
          model: res.model,
          timestamp: nowTime()
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        // Full offline fallback — use local deterministic engine
        const fallbackText = answerCustomQuestion(question, input, location, financials, decisionResult, language);
        const fallbackMsg: ChatMessage = {
          id: `fallback-${Date.now()}`,
          sender: 'assistant',
          text: fallbackText,
          aiGenerated: true,
          fallback: true,
          model: 'Pravirak Context Engine',
          timestamp: nowTime()
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [customQuery, isLoading, language, analysisContext, input, location, financials, decisionResult]
  );

  // -------------------------------------------------------------------------
  // Chat reset
  // -------------------------------------------------------------------------
  const handleReset = () => {
    stopSpeaking();
    setMessages([]);
    setCustomQuery('');
  };

  // -------------------------------------------------------------------------
  // TTS
  // -------------------------------------------------------------------------
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeakingMsgId(null);
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingMsgId === msgId) { stopSpeaking(); return; }
    stopSpeaking();
    const utt = new SpeechSynthesisUtterance(text.replace(/[*#_`>]/g, ' ').replace(/\s+/g, ' ').trim());
    utt.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utt.rate = 0.95;
    utt.onend = () => setSpeakingMsgId(null);
    utt.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="bg-white dark:bg-[#0D0D0D] rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col" style={{ minHeight: 520 }}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-neutral-800 bg-slate-900 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">{t.contextGroundedAdvisory}</div>
            <h3 className="text-sm sm:text-base font-bold text-white">{t.askAiAdvisor.toUpperCase()}</h3>
          </div>
        </div>
        <button
          onClick={handleReset}
          title={t.clearConversation}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* FAQ chips — deterministic, instant */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-[#111] shrink-0">
        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-neutral-500 mb-2 tracking-wider">{t.suggestedQuestionsLabel}</p>
        <div className="flex flex-wrap gap-1.5">
          {faqs.map((faq, idx) => {
            const chipThemes = [
              'bg-amber-50/80 text-amber-950 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200 dark:border-amber-900/50 hover:bg-amber-100',
              'bg-sky-50/80 text-sky-950 dark:bg-sky-950/30 dark:text-sky-300 border-sky-200 dark:border-sky-900/50 hover:bg-sky-100',
              'bg-emerald-50/80 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100',
              'bg-violet-50/80 text-violet-950 dark:bg-violet-950/30 dark:text-violet-300 border-violet-200 dark:border-violet-900/50 hover:bg-violet-100',
            ];
            return (
              <button
                key={faq.id}
                onClick={() => handleSelectFaq(faq.id)}
                disabled={isLoading}
                className={`text-[11px] sm:text-xs px-3 py-1.5 rounded-xl border transition-all text-left font-semibold cursor-pointer disabled:opacity-50 ${chipThemes[idx % chipThemes.length]}`}
              >
                {faq.question}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat message history */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 dark:bg-[#080D1A] min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#1E3A8A] text-white rounded-br-xs font-medium'
                  : 'bg-white dark:bg-[#11192C] text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-xs'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-900 dark:text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    PRAVIRAK ADVISOR
                  </span>
                  <button
                    onClick={() => handleSpeak(msg.id, msg.text)}
                    className="text-slate-400 hover:text-indigo-900 dark:hover:text-amber-300 p-0.5 rounded transition-colors cursor-pointer"
                    title={speakingMsgId === msg.id ? t.stop : t.listen}
                  >
                    {speakingMsgId === msg.id ? (
                      <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}

              <div className="whitespace-pre-wrap font-normal select-text">{msg.text}</div>

              {/* Attribution line — only for AI-generated answers (not FAQ chips or welcome) */}
              {msg.sender === 'assistant' && msg.aiGenerated && (
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/70 flex items-start gap-1 text-[10px] text-slate-500 dark:text-slate-500 leading-snug">
                  <Info className="w-3 h-3 shrink-0 mt-0.5 text-indigo-400 dark:text-indigo-500" />
                  <span>{t.aiAnswerAttribution}</span>
                  {msg.model && !msg.fallback && (
                    <span className="ml-auto font-mono italic text-[9px] text-slate-400 dark:text-slate-600 shrink-0 pl-1">
                      {msg.model.split('/').pop()}
                    </span>
                  )}
                </div>
              )}
            </div>

            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-indigo-900 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-xl px-3.5 py-2.5 w-fit animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-700 dark:text-indigo-400" />
            <span className="font-semibold">{t.aiAdvisorThinking}</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input bar */}
      <div className="p-3.5 bg-white dark:bg-[#0A0F1D] border-t border-slate-200 dark:border-slate-800 shrink-0">
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder={t.askInputPlaceholder}
              disabled={isLoading}
              maxLength={500}
              className="w-full text-xs sm:text-sm pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 font-medium disabled:opacity-60"
            />
            <div className="absolute right-2">
              <VoiceInputButton
                size="sm"
                disabled={isLoading}
                onTranscript={(spoken) =>
                  setCustomQuery((prev) => (prev.trim() ? `${prev.trim()} ${spoken}` : spoken))
                }
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !customQuery.trim()}
            className="p-2.5 bg-[#1E3A8A] hover:bg-blue-900 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0 cursor-pointer"
            title={t.askButton}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 text-center">
          {t.askAboutAnalysis}
        </p>
      </div>
    </div>
  );
};
