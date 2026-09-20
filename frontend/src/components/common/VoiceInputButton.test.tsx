import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { VoiceInputButton } from './VoiceInputButton';
import { LanguageProvider, useLanguage } from '../../context/LanguageContext';

// Mock SpeechRecognition helper
class MockSpeechRecognition {
  lang = '';
  continuous = false;
  interimResults = false;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  onresult: ((event: any) => void) | null = null;

  start = vi.fn(() => {
    if (this.onstart) {
      this.onstart();
    }
  });

  stop = vi.fn(() => {
    if (this.onend) {
      this.onend();
    }
  });

  abort = vi.fn(() => {
    if (this.onend) {
      this.onend();
    }
  });
}

describe('VoiceInputButton with Web Speech API', () => {
  const originalSpeechRecognition = (window as any).SpeechRecognition;
  const originalWebkitSpeechRecognition = (window as any).webkitSpeechRecognition;

  beforeEach(() => {
    localStorage.clear();
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;
  });

  afterEach(() => {
    (window as any).SpeechRecognition = originalSpeechRecognition;
    (window as any).webkitSpeechRecognition = originalWebkitSpeechRecognition;
    vi.clearAllMocks();
  });

  it('hides the button completely on unsupported browsers (e.g. Firefox) without crashing', () => {
    // Neither SpeechRecognition nor webkitSpeechRecognition is defined
    const handleTranscript = vi.fn();
    const { container } = render(
      <LanguageProvider>
        <VoiceInputButton onTranscript={handleTranscript} />
      </LanguageProvider>
    );

    expect(screen.queryByTestId('voice-input-button')).toBeNull();
    expect(container.firstChild).toBeNull();
  });

  it('renders microphone button when Web Speech API is supported', () => {
    (window as any).SpeechRecognition = MockSpeechRecognition;
    const handleTranscript = vi.fn();

    render(
      <LanguageProvider>
        <VoiceInputButton onTranscript={handleTranscript} />
      </LanguageProvider>
    );

    const button = screen.getByTestId('voice-input-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Start voice input');
  });

  it('sets recognition.lang to en-IN for English, hi-IN for Hindi, and te-IN for Telugu', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lastInstance: any = null;
    (window as any).SpeechRecognition = class extends MockSpeechRecognition {
      constructor() {
        super();
        lastInstance = this as unknown as MockSpeechRecognition;
      }
    };

    const TestLangWrapper: React.FC = () => {
      const { setLanguage } = useLanguage();
      return (
        <div>
          <button onClick={() => setLanguage('hi')}>Switch to Hindi</button>
          <button onClick={() => setLanguage('te')}>Switch to Telugu</button>
          <VoiceInputButton onTranscript={vi.fn()} />
        </div>
      );
    };

    const { rerender } = render(
      <LanguageProvider>
        <TestLangWrapper />
      </LanguageProvider>
    );

    // Test English (default)
    const micButton = screen.getByTestId('voice-input-button');
    fireEvent.click(micButton);
    expect(lastInstance?.lang).toBe('en-IN');
    fireEvent.click(micButton); // stop

    // Switch to Hindi
    fireEvent.click(screen.getByText('Switch to Hindi'));
    fireEvent.click(micButton);
    expect(lastInstance?.lang).toBe('hi-IN');
    fireEvent.click(micButton); // stop

    // Switch to Telugu
    fireEvent.click(screen.getByText('Switch to Telugu'));
    fireEvent.click(micButton);
    expect(lastInstance?.lang).toBe('te-IN');
  });

  it('shows listening indicator and toggles listening state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lastInstance: any = null;
    (window as any).SpeechRecognition = class extends MockSpeechRecognition {
      constructor() {
        super();
        lastInstance = this as unknown as MockSpeechRecognition;
      }
    };

    render(
      <LanguageProvider>
        <VoiceInputButton onTranscript={vi.fn()} />
      </LanguageProvider>
    );

    const button = screen.getByTestId('voice-input-button');
    expect(screen.queryByTestId('voice-listening-indicator')).toBeNull();

    // Click to start
    fireEvent.click(button);
    expect(lastInstance?.start).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('voice-listening-indicator')).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Stop listening');

    // Click to stop
    fireEvent.click(button);
    expect(lastInstance?.stop).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('voice-listening-indicator')).toBeNull();
  });

  it('puts transcript into the input field and allows user editing', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lastInstance: any = null;
    (window as any).SpeechRecognition = class extends MockSpeechRecognition {
      constructor() {
        super();
        lastInstance = this as unknown as MockSpeechRecognition;
      }
    };

    // Component modeling the business idea field with VoiceInputButton
    const IdeaInputForm: React.FC = () => {
      const [text, setText] = useState('');
      return (
        <div>
          <textarea
            data-testid="idea-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <VoiceInputButton
            onTranscript={(spoken) => {
              setText((prev) => (prev ? `${prev} ${spoken}` : spoken));
            }}
          />
        </div>
      );
    };

    render(
      <LanguageProvider>
        <IdeaInputForm />
      </LanguageProvider>
    );

    const textarea = screen.getByTestId('idea-textarea') as HTMLTextAreaElement;
    const micButton = screen.getByTestId('voice-input-button');

    expect(textarea.value).toBe('');

    // Start voice input
    fireEvent.click(micButton);

    // Simulate speech recognition delivering a transcript
    act(() => {
      if (lastInstance?.onresult) {
        lastInstance.onresult({
          resultIndex: 0,
          results: [
            [
              { transcript: 'Organic Bakery in Jangaon' }
            ]
          ]
        });
      }
    });

    // Transcript is in the field
    expect(textarea.value).toBe('Organic Bakery in Jangaon');

    // User can edit the transcript directly before submitting
    fireEvent.change(textarea, {
      target: { value: 'Organic Bakery in Jangaon near Market Yard' }
    });
    expect(textarea.value).toBe('Organic Bakery in Jangaon near Market Yard');
  });

  it('displays error message when permission is denied (not-allowed)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lastInstance: any = null;
    (window as any).SpeechRecognition = class extends MockSpeechRecognition {
      constructor() {
        super();
        lastInstance = this as unknown as MockSpeechRecognition;
      }
    };

    render(
      <LanguageProvider>
        <VoiceInputButton onTranscript={vi.fn()} />
      </LanguageProvider>
    );

    const button = screen.getByTestId('voice-input-button');
    fireEvent.click(button);

    // Simulate permission denied error from browser
    act(() => {
      if (lastInstance?.onerror) {
        lastInstance.onerror({ error: 'not-allowed' });
      }
    });

    const errorToast = screen.getByTestId('voice-error-toast');
    expect(errorToast).toBeInTheDocument();
    expect(errorToast).toHaveTextContent(/Microphone access blocked/i);
  });
});
