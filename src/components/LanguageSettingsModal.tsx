import React, { useState } from 'react';
import {
  Globe,
  Volume2,
  X,
  Check,
  TrendingUp,
  Sliders,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { speakText, stopAnyActiveSpeech } from '../services/ttsService';

interface LanguageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSettingsModal: React.FC<LanguageSettingsModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, settings, updateSettings, t } = useLanguage();
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  if (!isOpen) return null;

  const voices: Array<{ id: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr'; name: string; desc: string }> = [
    { id: 'Kore', name: 'Kore (Default)', desc: language === 'id' ? 'Artikulatif, tenang, dan akademis' : 'Articulate, calm, and academic' },
    { id: 'Puck', name: 'Puck', desc: language === 'id' ? 'Energik, jelas, dan percaya diri' : 'Energetic, clear, and confident' },
    { id: 'Charon', name: 'Charon', desc: language === 'id' ? 'Formal, berwibawa, dan stabil' : 'Formal, authoritative, and steady' },
    { id: 'Fenrir', name: 'Fenrir', desc: language === 'id' ? 'Dalam, santai, dan naratif' : 'Deep, relaxed, and narrative' },
    { id: 'Zephyr', name: 'Zephyr', desc: language === 'id' ? 'Hangat dan ramah' : 'Warm and friendly' },
  ];

  const speechSpeeds = [
    { value: 0.8, label: '0.8x (Lambat)' },
    { value: 1.0, label: '1.0x (Normal)' },
    { value: 1.2, label: '1.2x (Cepat)' },
    { value: 1.5, label: '1.5x (Super)' },
  ];

  const handleTestVoice = async () => {
    if (isTestingVoice) {
      stopAnyActiveSpeech();
      setIsTestingVoice(false);
      return;
    }

    const testText =
      language === 'id'
        ? 'Halo! Saya asisten pembaca suara CendekiaKTI. Saya siap membacakan jurnal, naskah proposal, dan jawaban pembimbing riset Anda.'
        : 'Hello! I am the CendekiaKTI voice assistant. I am ready to read academic journals, proposal manuscripts, and mentor guidance for your research.';

    setIsTestingVoice(true);
    await speakText(testText, {
      voice: settings.ttsVoice,
      speed: settings.ttsSpeed,
      language: language,
      onStart: () => setIsTestingVoice(true),
      onEnd: () => setIsTestingVoice(false),
      onError: () => setIsTestingVoice(false),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">{t('languageSettings')}</h3>
              <p className="text-xs text-slate-500">
                {language === 'id' ? 'Sesuaikan bahasa antarmuka dan suara narator AI' : 'Customize interface language and AI voice narration'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopAnyActiveSpeech();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Language Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              {t('languageLabel')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage('id')}
                className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                  language === 'id'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    <span>🇮🇩</span>
                    <span>Bahasa Indonesia</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Standar KTI Nasional (OPSI / LKIR)</span>
                </div>
                {language === 'id' && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                  language === 'en'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    <span>🇺🇸</span>
                    <span>English</span>
                  </div>
                  <span className="text-[11px] text-slate-500">International Research Format</span>
                </div>
                {language === 'en' && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            </div>
          </div>

          {/* Voice Narrator (TTS) Settings */}
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>{t('ttsVoiceLabel')}</span>
              </label>

              <button
                type="button"
                onClick={handleTestVoice}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3 fill-blue-600" />
                <span>{isTestingVoice ? (language === 'id' ? 'Berhenti' : 'Stop') : (language === 'id' ? 'Uji Suara' : 'Test Voice')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {voices.map((v) => {
                const isSelected = settings.ttsVoice === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => updateSettings({ ttsVoice: v.id })}
                    className={`flex items-start justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 text-blue-900 font-medium ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{v.name}</div>
                      <div className="text-[11px] text-slate-500">{v.desc}</div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Speech Speed */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {t('ttsSpeedLabel')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {speechSpeeds.map((s) => {
                const isSelected = settings.ttsSpeed === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => updateSettings({ ttsSpeed: s.value })}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {s.label.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Automatic Economics Detection */}
          <div className="border-t border-slate-100 pt-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoDetectEconomics}
                onChange={(e) => updateSettings({ autoDetectEconomics: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'id' ? 'Deteksi Otomatis Riset Topik Ekonomi' : 'Auto-detect Economics Research Topics'}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {language === 'id'
                    ? 'Secara otomatis merekomendasikan data sekunder IHSG, Kurs Rupiah, dan indikator moneter saat mendeteksi topik ekonomi.'
                    : 'Automatically suggest secondary IDX, Rupiah FX, and macroeconomic time-series data when economics keywords are detected.'}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              stopAnyActiveSpeech();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};
