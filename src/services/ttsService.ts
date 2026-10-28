// Clean markdown symbols to make spoken speech natural and fluent
export function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown headers
    .replace(/#{1,6}\s+/g, '')
    // Remove bold and italic markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Remove markdown links but keep anchor text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bullet points and numbered list markers
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Replace multiple newlines or spaces with single spaces
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

let activeAudio: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function stopAnyActiveSpeech() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  activeUtterance = null;
}

export async function speakText(
  text: string,
  options: {
    voice?: string;
    speed?: number;
    language?: 'id' | 'en';
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  } = {}
): Promise<{ stop: () => void }> {
  stopAnyActiveSpeech();

  const clean = cleanTextForSpeech(text);
  if (!clean) {
    options.onEnd?.();
    return { stop: () => {} };
  }

  const speed = options.speed || 1.0;
  const lang = options.language || 'id';
  const voice = options.voice || 'Kore';

  // Strategy 1: Attempt Gemini 3.8 Flash Lite TTS server-side
  try {
    const res = await fetch('/api/gemini/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: clean.slice(0, 1500), // Max chunk for responsive synthesis
        voice,
        language: lang,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.audioBase64) {
        const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        const audio = new Audio(audioSrc);
        audio.playbackRate = speed;
        activeAudio = audio;

        audio.onplay = () => options.onStart?.();
        audio.onended = () => {
          activeAudio = null;
          options.onEnd?.();
        };
        audio.onerror = () => {
          activeAudio = null;
          // Fallback to browser synthesis
          speakWithBrowserSpeech(clean, speed, lang, options);
        };

        await audio.play();
        return {
          stop: () => {
            if (activeAudio) {
              activeAudio.pause();
              activeAudio.currentTime = 0;
              activeAudio = null;
            }
            options.onEnd?.();
          },
        };
      }
    }
  } catch (err) {
    console.warn('Gemini TTS endpoint unavailable, falling back to Web Speech API:', err);
  }

  // Strategy 2: Web Speech API Fallback (always works client-side)
  speakWithBrowserSpeech(clean, speed, lang, options);

  return {
    stop: () => stopAnyActiveSpeech(),
  };
}

function speakWithBrowserSpeech(
  cleanText: string,
  speed: number,
  language: 'id' | 'en',
  options: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onError?.(new Error('Browser tidak mendukung audio speech synthesis.'));
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = speed;
  utterance.lang = language === 'id' ? 'id-ID' : 'en-US';

  // Select suitable voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find((v) =>
    language === 'id'
      ? v.lang.startsWith('id') || v.name.toLowerCase().includes('indonesia')
      : v.lang.startsWith('en')
  );
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  utterance.onstart = () => options.onStart?.();
  utterance.onend = () => {
    activeUtterance = null;
    options.onEnd?.();
  };
  utterance.onerror = (e) => {
    activeUtterance = null;
    options.onError?.(e);
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}
