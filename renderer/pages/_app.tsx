import "./globals.css";
import { useEffect } from "react";
import { Inter } from "next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SettingsProvider } from "@/components/dashboard/settings-context";
import { useSettings } from "@/components/dashboard/settings-context";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import type { Language } from "@/lib/i18n/translations";

const inter = Inter({ subsets: ["latin"] });

function resolveLanguage(language: string): Language {
  const supportedLanguages = new Set([
    "en",
    "es",
    "fr",
    "zh",
    "de",
    "it",
    "pt"
  ]);
  return supportedLanguages.has(language) ? (language as Language) : "en";
}

interface AppShellProps {
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
}

function AppShell({ Component, pageProps }: AppShellProps) {
  const {
    personality,
    theme,
    fontSize,
    highContrast,
    reducedMotion,
    soundEffects,
    notifications,
    autoSave,
    language
  } = useSettings();

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }

    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const resolvedTheme =
        theme === "system" ? (mediaQuery.matches ? "dark" : "light") : theme;
      root.classList.toggle("dark", resolvedTheme === "dark");
      root.dataset.theme = resolvedTheme;
      root.dataset.themePreference = theme;
    };

    applyTheme();

    if (theme !== "system") {
      return;
    }

    const onThemeChange = () => applyTheme();
    mediaQuery.addEventListener("change", onThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", onThemeChange);
    };
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }

    const root = document.documentElement;
    root.style.setProperty("--app-font-size", `${fontSize}px`);
    root.classList.toggle("high-contrast", highContrast);
    root.classList.toggle("reduced-motion", reducedMotion);
    root.dataset.soundEffects = soundEffects ? "enabled" : "disabled";
    root.dataset.notifications = notifications ? "enabled" : "disabled";
    root.dataset.autoSave = autoSave ? "enabled" : "disabled";
    root.lang = resolveLanguage(language);

    window.dispatchEvent(
      new CustomEvent("kisaki:meta-settings-changed", {
        detail: {
          theme,
          fontSize,
          highContrast,
          reducedMotion,
          soundEffects,
          notifications,
          autoSave,
          language: resolveLanguage(language)
        }
      })
    );
  }, [
    theme,
    fontSize,
    highContrast,
    reducedMotion,
    soundEffects,
    notifications,
    autoSave,
    language
  ]);

  return (
    <I18nProvider
      language={resolveLanguage(language)}
      companionName={personality.name}
    >
      <main className={`${inter.className} h-screen w-screen`}>
        <Component {...pageProps} />
      </main>
    </I18nProvider>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />

        <title>Kisaki</title>
      </Head>
      <SettingsProvider>
        <AppShell Component={Component} pageProps={pageProps} />
      </SettingsProvider>
    </>
  );
}
