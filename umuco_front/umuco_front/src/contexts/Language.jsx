import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations } from '../translations';
import { useAuth } from './AuthContext';

const LanguageContext = createContext();

const mapLanguageCode = (lang) => {
  const codeToDb = {
    'en': 'English (UK)',
    'rw': 'Kinyarwanda',
    'fr': 'French (France)'
  };
  const dbToCode = {
    'English (UK)': 'en',
    'Kinyarwanda': 'rw',
    'French (France)': 'fr'
  };
  if (codeToDb[lang]) return codeToDb[lang];
  if (dbToCode[lang]) return dbToCode[lang];
  return 'en';
};

export function LanguageProvider({ children }) {
  const { user, updateUser } = useAuth();
  const [language, setLanguageState] = useState(() => localStorage.getItem('umuco_language') || 'en');

  useEffect(() => {
    if (user?.language) {
      const code = mapLanguageCode(user.language);
      setLanguageState(code);
    }
  }, [user?.language]);

  const setLanguage = useCallback(async (newLang) => {
    setLanguageState(newLang);
    localStorage.setItem('umuco_language', newLang);
    if (user?.id) updateUser({ language: mapLanguageCode(newLang) });
  }, [user?.id, updateUser]);

  const t = (key, params) => {
    const val = translations[language]?.[key] ?? translations.en?.[key] ?? key;
    if (val !== null && typeof val === 'object') return key;
    if (!params || typeof val !== 'string') return val;
    return val.replace(/\{(\w+)\}/g, (match, name) => (
      Object.prototype.hasOwnProperty.call(params, name) && params[name] != null
        ? String(params[name])
        : match
    ));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isSaving: false }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
