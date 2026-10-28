import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2, Play, Square } from 'lucide-react';
import { speakText, stopAnyActiveSpeech } from '../services/ttsService';
import { useLanguage } from '../context/LanguageContext';

interface AudioSpeechPlayerProps {
  text: string;
  label?: string;
  size?: 'sm' | 'md';
  variant?: 'button' | 'icon' | 'badge';
  className?: string;
}

export const AudioSpeechPlayer: React.FC<AudioSpeechPlayerProps> = ({
  text,
  label,
  size = 'sm',
  variant = 'button',
  className = '',
}) => {
  const { language, settings } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup on unmount if this player was active
      if (isPlaying) {
        stopAnyActiveSpeech();
      }
    };
  }, [isPlaying]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying) {
      stopAnyActiveSpeech();
      setIsPlaying(false);
      return;
    }

    if (!text || text.trim().length === 0) return;

    setIsLoading(true);
    try {
      await speakText(text, {
        voice: settings.ttsVoice,
        speed: settings.ttsSpeed,
        language: language,
        onStart: () => {
          setIsLoading(false);
          setIsPlaying(true);
        },
        onEnd: () => {
          setIsLoading(false);
          setIsPlaying(false);
        },
        onError: () => {
          setIsLoading(false);
          setIsPlaying(false);
        },
      });
    } catch {
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const buttonText = label || (isPlaying ? (language === 'id' ? 'Hentikan' : 'Stop') : (language === 'id' ? 'Dengarkan' : 'Listen'));

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        title={isPlaying ? 'Hentikan Audio' : 'Dengarkan Teks'}
        className={`p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer ${
          isPlaying ? 'text-blue-600 bg-blue-50 animate-pulse' : ''
        } ${className}`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        ) : isPlaying ? (
          <Square className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    );
  }
  if (variant === 'badge') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
          isPlaying
            ? 'bg-slate-900 text-white shadow-2xs'
            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
        } ${className}`}
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : isPlaying ? (
          <>
            <span className="flex gap-0.5 items-end h-3">
              <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce"></span>
              <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:150ms]"></span>
              <span className="w-0.5 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]"></span>
            </span>
            <span>{buttonText}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3 h-3" />
            <span>{buttonText}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`inline-flex items-center gap-1.5 font-medium transition-all rounded-lg cursor-pointer ${
        size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'
      } ${
        isPlaying
          ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 hover:text-slate-900'
      } ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
      ) : isPlaying ? (
        <>
          <span className="flex gap-0.5 items-end h-3">
            <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce"></span>
            <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:150ms]"></span>
            <span className="w-0.5 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]"></span>
          </span>
          <span>{buttonText}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-slate-500" />
          <span>{buttonText}</span>
        </>
      )}
    </button>
  );
};
