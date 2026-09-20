import { useState, useEffect, useRef, useCallback } from 'react';

// Type definitions for Web Speech API
export interface SpeechRecognitionHookOptions {
  lang?: string;
  onTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
}

export interface UseSpeechRecognitionResult {
  isSupported: boolean;
  isListening: boolean;
  error: string | null;
  startListening: (overrideLang?: string) => void;
  stopListening: () => void;
  resetError: () => void;
}

// Check for Web Speech API constructor
function getSpeechRecognitionClass(): any {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

/**
 * Fallback locale map: some Chrome builds reject regional BCP-47 tags like
 * "en-IN" with a "language-not-supported" error. In that case we retry once
 * with a broader / more widely-supported tag.
 */
const LANG_FALLBACKS: Record<string, string> = {
  'en-IN': 'en-US',
  'hi-IN': 'hi',
  'te-IN': 'te',
};

export function useSpeechRecognition(options: SpeechRecognitionHookOptions = {}): UseSpeechRecognitionResult {
  const { lang = 'en-IN', onTranscript, onError, continuous = false, interimResults = false } = options;

  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);

  // Keep callback refs updated without re-triggering effects
  useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  const isSupported = typeof window !== 'undefined' && !!getSpeechRecognitionClass();

  const resetError = useCallback(() => { setError(null); }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* already stopped */ }
    }
    setIsListening(false);
  }, []);

  /**
   * Create and start a recognition instance for the given locale.
   * `isFallback` prevents infinite retries if even the fallback locale fails.
   */
  const createAndStart = useCallback(
    (locale: string, isFallback: boolean) => {
      const SpeechRecognitionClass = getSpeechRecognitionClass();
      if (!SpeechRecognitionClass) {
        setError('not-supported');
        return;
      }

      // Abort and detach any existing instance first
      if (recognitionRef.current) {
        const old = recognitionRef.current;
        recognitionRef.current = null;
        old.onstart = null;
        old.onresult = null;
        old.onerror = null;
        old.onend = null;
        try { old.abort(); } catch { /* ignore */ }
      }

      try {
        const recognition = new SpeechRecognitionClass();
        recognition.lang = locale;
        recognition.continuous = continuous;
        // Enable interim results so Chrome shows something; we only pass final results to onTranscript
        recognition.interimResults = interimResults;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          let transcriptText = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const item = event.results[i];
            // When interimResults is false every delivered result is final.
            // When interimResults is true, only pass confirmed final results.
            const isFinal = !interimResults || item?.isFinal !== false;
            if (isFinal && item && item[0] && item[0].transcript) {
              transcriptText += item[0].transcript;
            }
          }
          const trimmed = transcriptText.trim();
          if (trimmed && onTranscriptRef.current) {
            onTranscriptRef.current(trimmed);
          }
        };

        recognition.onerror = (event: any) => {
          const errType: string = event?.error || 'error';

          // "no-speech": the mic was open but the user didn't speak within the
          // timeout window. This is NOT an error — just close silently.
          if (errType === 'no-speech') {
            setIsListening(false);
            return;
          }

          // "language-not-supported" or "network": in many Chrome/Chromium builds,
          // unsupported or failed regional locales (like te-IN, hi-IN, en-IN) return
          // "network" or "language-not-supported". Retry once with a broader fallback locale.
          if ((errType === 'language-not-supported' || errType === 'network') && !isFallback) {
            const fallback = LANG_FALLBACKS[locale] || (locale !== 'en-US' ? 'en-US' : undefined);
            if (fallback) {
              setIsListening(false);
              // Small delay before retrying so Chrome releases the mic handle
              setTimeout(() => createAndStart(fallback, true), 150);
              return;
            }
          }

          // Propagate real errors
          setError(errType);
          setIsListening(false);
          if (onErrorRef.current) {
            onErrorRef.current(errType);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        const errMsg = err?.message || 'start-failed';
        setError(errMsg);
        setIsListening(false);
        if (onErrorRef.current) {
          onErrorRef.current(errMsg);
        }
      }
    },
    [continuous, interimResults]
  );

  const startListening = useCallback(
    (overrideLang?: string) => {
      const locale = overrideLang || lang;
      createAndStart(locale, false);
    },
    [lang, createAndStart]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
      }
    };
  }, []);

  return { isSupported, isListening, error, startListening, stopListening, resetError };
}
