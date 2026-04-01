"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
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
  companionName?: string;
}

function withCompanionName(value: unknown, companionName: string): unknown {
  if (typeof value === "string") {
    return value.replaceAll("Kisaki", companionName);
  }

  if (Array.isArray(value)) {
    return value.map((item) => withCompanionName(item, companionName));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        withCompanionName(nestedValue, companionName)
      ])
    );
  }

  return value;
}

export function I18nProvider({
  children,
  language,
  companionName
}: I18nProviderProps) {
  const baseTranslations = translations[language] || translations.en;
  const normalizedCompanionName = companionName?.trim() || "Kisaki";
  const t = useMemo(
    () =>
      withCompanionName(
        baseTranslations,
        normalizedCompanionName
      ) as TranslationKeys,
    [baseTranslations, normalizedCompanionName]
  );

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
