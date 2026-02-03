import React, { createContext, useContext, useState, useEffect } from "react";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

const translations = { en, fr };

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [t, setT] = useState(translations[language]);

  useEffect(() => {
    setT(translations[language]);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: (key) => t[key] || key,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
