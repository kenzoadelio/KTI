import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, AppSettings } from '../types';
import { translations, TranslationKey } from '../utils/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  t: (key: TranslationKey) => string;
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'id',
  ttsVoice: 'Kore',
  ttsSpeed: 1.0,
  autoDetectEconomics: true,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('cendekia_app_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('cendekia_app_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }, [settings]);

  const setLanguage = (lang: Language) => {
    setSettings((prev) => ({ ...prev, language: lang }));
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[settings.language] || translations.id;
    return dict[key] || translations.id[key] || String(key);
  };

  return (
    <LanguageContext.Provider
      value={{
        language: settings.language,
        setLanguage,
        settings,
        updateSettings,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
