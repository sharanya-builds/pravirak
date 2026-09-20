import React, { useEffect, useState } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useLanguage } from '../../context/LanguageContext';
import { getLocale } from '../../utils/formatters';

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  className?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  className = '',
  size = 'md',
  disabled = false
}) => {
  const { t, language } = useLanguage();
  const locale = getLocale(language);

  const [showErrorToast, setShowErrorToast] = useState(false);

  const { isSupported, isListening, error, startListening, stopListening, resetError } =
    useSpeechRecognition({
      lang: locale,
      onTranscript: (text) => {
        onTranscript(text);
      }
    });

  // Automatically show and dismiss error message
  useEffect(() => {
    if (error) {
      setShowErrorToast(true);
      const timer = setTimeout(() => {
        setShowErrorToast(false);
        resetError();
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowErrorToast(false);
    }
  }, [error, resetError]);

  // Gracefully hide if browser does not support Web Speech API
  if (!isSupported) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isListening) {
      stopListening();
    } else {
      resetError();
      startListening(locale);
    }
  };

  const isSmall = size === 'sm';
  const iconSize = isSmall ? 'w-4 h-4' : 'w-4.5 h-4.5';
  const buttonDimensions = isSmall ? 'p-1.5 rounded-lg' : 'p-2 rounded-xl';

  const isPermissionError = error === 'not-allowed' || error === 'permission-denied';
  const isNetworkError = error === 'network';
  const errorMessage = isPermissionError
    ? t.voiceInputErrorPermission
    : isNetworkError
    ? t.voiceInputErrorNetwork
    : t.voiceInputErrorGeneric;

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        title={isListening ? t.voiceInputStop : t.voiceInputStart}
        aria-label={isListening ? t.voiceInputStop : t.voiceInputStart}
        className={`transition-all cursor-pointer flex items-center justify-center border font-medium ${buttonDimensions} ${
          isListening
            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 ring-2 ring-rose-400/50 animate-pulse'
            : 'bg-white dark:bg-[#161616] text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-900 dark:hover:text-white shadow-2xs'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        data-testid="voice-input-button"
      >
        {isListening ? (
          <MicOff className={`${iconSize} text-rose-600 dark:text-rose-400`} />
        ) : (
          <Mic className={iconSize} />
        )}
      </button>

      {/* Listening pill indicator */}
      {isListening && (
        <span
          className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full shadow-md whitespace-nowrap pointer-events-none flex items-center gap-1 z-30 animate-bounce"
          data-testid="voice-listening-indicator"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          {t.voiceInputListening}
        </span>
      )}

      {/* Error state popup */}
      {showErrorToast && (
        <div
          role="alert"
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 p-2 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-40 border border-slate-800 flex items-start gap-1.5"
          data-testid="voice-error-toast"
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-tight text-slate-200">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};
