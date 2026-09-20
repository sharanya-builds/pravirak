import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ChevronRight,
  MapPin,
  MessageSquare,
  Info
} from 'lucide-react';
import { BusinessDecisionResult, BusinessInput, FinancialAnalysis, LocationData } from '../../types';
import { advisorApi } from '../../api/client';
import { buildAnalysisContext } from '../../utils/buildAnalysisContext';
import { useLanguage } from '../../context/LanguageContext';
import { VoiceInputButton } from '../common/VoiceInputButton';

interface SidePanelChatbotProps {
  input?: BusinessInput | null;
  location?: LocationData | null;
  financials?: FinancialAnalysis | null;
  decisionResult?: BusinessDecisionResult | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  model?: string;
  aiGenerated?: boolean;
  timestamp: string;
}

export const SidePanelChatbot: React.FC<SidePanelChatbotProps> = ({
  input,
  location,
  financials,
  decisionResult
}) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested prompt chips based on language
  const suggestedPrompts = language === 'te' ? [
    'నా రుణం సురక్షితమేనా? (DSCR)',
    'ప్రారంభ పెట్టుబడిని ఎలా తగ్గించాలి?',
    'ఈ వ్యాపారానికి ఉత్తమ ప్రభుత్వ పథకాలు ఏవి?',
    'స్థానిక పోటీని ఎలా తట్టుకోవాలి?'
  ] : language === 'hi' ? [
    'क्या मेरा ऋण सुरक्षित है? (DSCR)',
    'शुरुआती पूंजी खर्च कैसे कम करें?',
    'इस व्यवसाय के लिए सबसे अच्छी सरकारी योजनाएं?',
    'स्थानीय प्रतिस्पर्धियों से कैसे आगे निकलें?'
  ] : [
    'Is my loan repayment safe? (DSCR)',
    'How can I reduce initial capex?',
    'What government subsidies can I claim?',
    'How do I handle local competition?'
  ];

  // Welcome message generator
  const getInitialWelcome = (): string => {
    if (language === 'te') {
      return input?.businessIdea 
        ? `నమస్తే! నేను మీ ప్రవీరక్ AI సలహాదారుని. మీ "${input.businessIdea}" (${location?.areaName || 'మీ స్థానం'}) వ్యాపారానికి సంబంధించిన ఆర్థిక అంశాలు, ప్రభుత్వ సబ్సిడీలు, మార్కెట్ పోటీ లేదా లైసెన్సులపై ఏ ప్రశ్నైనా అడగండి.`
        : 'నమస్తే! నేను మీ ప్రవీరక్ AI సలహాదారుని. భారతదేశంలో చిన్న వ్యాపార ప్రారంభం, రుణ భద్రత, లేదా ప్రభుత్వ పథకాలపై ఏదైనా సందేహం అడగండి.';
    }
    if (language === 'hi') {
      return input?.businessIdea 
        ? `नमस्ते! मैं आपका प्रवीरक AI सलाहकार हूँ। आपके "${input.businessIdea}" (${location?.areaName || 'आपके स्थान'}) व्यवसाय के वित्तीय पहलुओं, सरकारी सब्सिडी, बाज़ार प्रतिस्पर्धा या लाइसेंस पर कोई भी प्रश्न पूछें।`
        : 'नमस्ते! मैं आपका प्रवीरक AI सलाहकार हूँ। भारत में नए व्यवसाय शुरू करने, ऋण सुरक्षा, या सरकारी योजनाओं पर कोई भी प्रश्न पूछें।';
    }
    return input?.businessIdea 
      ? `Hello! I am your Pravirak AI Advisor. Ask me any question or doubt about your "${input.businessIdea}" in ${location?.areaName || 'your selected location'}—covering loan safety (DSCR), government subsidies, capex, or local market risks.`
      : 'Hello! I am your Pravirak AI Advisor. Ask me any question or doubt about starting a business in India, evaluating loan feasibility, or finding government subsidies.';
  };

  // Initialize or reset conversation when opened or language changes
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: getInitialWelcome(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [language, input?.businessIdea]);

  // Auto scroll down
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      stopSpeaking();
    }
  }, [isOpen]);

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    const cleanText = text.replace(/[*#_`>]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (language === 'te') utterance.lang = 'te-IN';
    else if (language === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isLoading) return;

    stopSpeaking();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputText('');
    setIsLoading(true);

    try {
      const analysisContext = (input && location && financials && decisionResult)
        ? buildAnalysisContext(input, location, financials, decisionResult)
        : {
            businessIdea: input?.businessIdea || 'Small Business Venture',
            businessCategory: input?.category || 'Retail & Services',
            location: location ? {
              village: location.village ?? null,
              block: location.block ?? null,
              district: location.district ?? null,
              state: location.state,
              areaName: location.areaName,
              city: location.city
            } : {
              village: null,
              block: null,
              district: null,
              state: 'India',
              areaName: 'Location',
              city: 'India'
            },
            ownCapital: financials?.ownCapital || 0,
            projectCost: financials?.projectCost || 0,
            loanRequired: financials?.loanRequired || 0,
            monthlyEMI: financials?.monthlyEMI || 0,
            quarterlyPayment: Math.round((financials?.monthlyEMI || 0) * 3),
            dscr: financials?.dscr || 0,
            safetyStatus: financials?.safetyStatus || 'UNKNOWN',
            decision: decisionResult?.decision || 'PENDING',
            competitorCount: location?.competitorsNearbyCount || 0,
            competitorCountProvenance: location?.competitorsCountProvenance || 'ESTIMATED',
            topRisks: (decisionResult?.riskFactors ?? []).slice(0, 3).map((r) => r.title),
            schemeName: null
          };

      const response = await advisorApi.ask({
        question: textToSend,
        language,
        analysisContext
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.answer || (language === 'te' ? 'సమాధానాన్ని పొందలేకపోయాము.' : language === 'hi' ? 'उत्तर प्राप्त करने में असमर्थ।' : 'Could not generate an answer at this time.'),
        model: response.model,
        aiGenerated: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: language === 'te' 
          ? `సలహాదారు సేవ అందుబాటులో లేదు. దయచేసి కాసేపటి తర్వాత ప్రయత్నించండి.`
          : language === 'hi' 
          ? `सलाहकार सेवा उपलब्ध नहीं है। कृपया थोड़ी देर बाद पुनः प्रयास करें।`
          : `Advisor service temporarily unavailable: ${err?.message || 'Please check your connection and try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: getInitialWelcome(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Side Panel Trigger Tab (Pinned to Right Edge, Never Obstructing Bottom Action Buttons) */}
      <aside 
        aria-label={t.askFloatingTooltip}
        className="no-print fixed right-0 top-1/2 -translate-y-1/2 z-40 group"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 pl-3.5 pr-2.5 py-2.5 bg-[#0A192F] hover:bg-slate-900 text-white rounded-l-2xl shadow-2xl border-2 border-r-0 border-amber-400/90 hover:border-amber-400 transition-all duration-200 cursor-pointer transform hover:-translate-x-1 active:scale-95"
          title={t.askFloatingTooltip}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            {/* Pulsing online indicator */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0A192F] animate-pulse"></span>
          </div>
          <div className="text-left pr-0.5">
            <div className="text-xs font-black tracking-wide text-white flex items-center gap-1">
              <span>{t.askPravirakButton}</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-[10px] text-slate-300 font-medium">
              AI Advisor
            </div>
          </div>
        </button>
      </aside>

      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 transition-opacity animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Slide-out Side Drawer Panel */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label={t.askPravirakAriaLabel}
        className={`fixed top-0 right-0 h-full w-[460px] max-w-[95vw] bg-white dark:bg-[#0C1222] border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-[#0A192F] text-white border-b border-slate-800 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white tracking-wide">
                  {t.askPravirakTitle}
                </h3>
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                  AI Grounded
                </span>
              </div>
              {input?.businessIdea && (
                <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-0.5 truncate max-w-[260px]">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{input.businessIdea} • {location?.city || 'India'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              title={t.clearConversation}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              title={t.closeChat}
              aria-label={t.closeChatAriaLabel}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Context Summary Strip */}
        {financials && (
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
            <div>
              DSCR: <span className={financials.dscr >= 1.5 ? 'text-emerald-700 dark:text-emerald-400 font-mono font-black' : 'text-amber-700 dark:text-amber-400 font-mono font-black'}>{financials.dscr}x</span>
            </div>
            <div>
              EMI: <span className="font-mono text-slate-900 dark:text-white font-black">₹{financials.monthlyEMI.toLocaleString('en-IN')}</span>
            </div>
            <div>
              Surplus: <span className="font-mono text-emerald-700 dark:text-emerald-400 font-black">₹{financials.monthlyNetSurplus.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 dark:bg-[#080D1A]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
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
                      className="text-slate-400 hover:text-indigo-900 dark:hover:text-amber-300 p-0.5 rounded-sm transition-colors cursor-pointer"
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
                
                <div className="whitespace-pre-wrap font-normal select-text">
                  {msg.text}
                </div>

                {/* Attribution line */}
                {msg.sender === 'assistant' && msg.aiGenerated && (
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/70 flex items-start gap-1 text-[10px] text-slate-500 dark:text-slate-500 leading-snug">
                    <Info className="w-3 h-3 shrink-0 mt-0.5 text-indigo-400 dark:text-indigo-500" />
                    <span>{t.aiAnswerAttribution}</span>
                  </div>
                )}

                {msg.model && (
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-right italic font-mono">
                    via {msg.model.split('/').pop()}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {/* Thinking Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-900 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-xl px-3.5 py-2.5 w-fit animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-700 dark:text-indigo-400" />
              <span className="font-semibold">{t.aiAdvisorThinking}</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Quick Question Chips */}
        <div className="p-2.5 bg-white dark:bg-[#0C1222] border-t border-slate-200 dark:border-slate-800 shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 px-1 flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-amber-500" />
            <span>{t.suggestedQuestions}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-950 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 transition-all text-left truncate max-w-full cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Drawer Footer Input Bar */}
        <div className="p-3.5 bg-white dark:bg-[#0A0F1D] border-t border-slate-200 dark:border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.chatPlaceholder}
                disabled={isLoading}
                className="w-full text-xs sm:text-sm pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 font-medium"
              />
              <div className="absolute right-2">
                <VoiceInputButton
                  size="sm"
                  disabled={isLoading}
                  onTranscript={(spokenText) => {
                    setInputText((prev) => (prev.trim() ? `${prev.trim()} ${spokenText}` : spokenText));
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 bg-[#1E3A8A] hover:bg-blue-900 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0 cursor-pointer"
              title={t.submit}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
            {t.aiAdvisorPoweredBy}
          </p>
        </div>
      </div>
    </>
  );
};
