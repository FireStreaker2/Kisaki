"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  translations,
  type Language,
  type TranslationKeys
} from "./translations";

interface I18nContextType {
  t: TranslationKeys;
  language: Language;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  language: Language;
}

export function I18nProvider({ children, language }: I18nProviderProps) {
  const t = translations[language] || translations.en;

  return (
    <I18nContext.Provider value={{ t, language }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
