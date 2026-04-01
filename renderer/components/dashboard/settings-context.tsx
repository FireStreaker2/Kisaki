"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode
} from "react";

interface CompanionPersonality {
  name: string;
  tone: "friendly" | "professional" | "casual" | "caring";
  verbosity: "brief" | "normal" | "detailed";
  humor: boolean;
}
interface VoiceConfig {
  enabled: boolean;
  voice: string;
  speed: number;
  pitch: number;
}
interface TextToolsConfig {
  explainEnabled: boolean;
  summarizeEnabled: boolean;
  translateEnabled: boolean;
  factCheckEnabled: boolean;
  defaultLanguage: string;
  readingLevel: "simple" | "standard" | "advanced";
  autoDetectLanguage: boolean;
}
interface AIModelConfig {
  provider: string;
  model: string;
  apiKey: string;
  useCustomEndpoint: boolean;
  customEndpoint: string;
}
interface MetaConfig {
  theme: "light" | "dark" | "system";
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  soundEffects: boolean;
  notifications: boolean;
  autoSave: boolean;
  language: string;
}
export interface AllSettings {
  personality: CompanionPersonality;
  voiceConfig: VoiceConfig;
  textToolsConfig: TextToolsConfig;
  aiModelConfig: AIModelConfig;
  metaConfig: MetaConfig;
}

interface SettingsContextType {
  personality: CompanionPersonality;
  setPersonality: (p: CompanionPersonality) => void;

  voiceConfig: VoiceConfig;
  setVoiceConfig: (v: VoiceConfig) => void;

  textToolsConfig: TextToolsConfig;
  setTextToolsConfig: (t: TextToolsConfig) => void;

  aiModelConfig: AIModelConfig;
  setAIModelConfig: (a: AIModelConfig) => void;

  theme: "light" | "dark" | "system";
  setTheme: (t: "light" | "dark" | "system") => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  highContrast: boolean;
  setHighContrast: (h: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (r: boolean) => void;
  soundEffects: boolean;
  setSoundEffects: (s: boolean) => void;
  notifications: boolean;
  setNotifications: (n: boolean) => void;
  autoSave: boolean;
  setAutoSave: (a: boolean) => void;
  language: string;
  setLanguage: (l: string) => void;

  getAllSettings: () => AllSettings;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const isApplyingRemoteUpdate = useRef(false);

  const [personality, setPersonality] = useState<CompanionPersonality>({
    name: "Kisaki",
    tone: "friendly",
    verbosity: "normal",
    humor: true
  });

  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>({
    enabled: true,
    voice: "en-US-Neural2-C",
    speed: 0.9,
    pitch: 1.0
  });

  const [textToolsConfig, setTextToolsConfig] = useState<TextToolsConfig>({
    explainEnabled: true,
    summarizeEnabled: true,
    translateEnabled: true,
    factCheckEnabled: true,
    defaultLanguage: "en",
    readingLevel: "simple",
    autoDetectLanguage: true
  });

  const [aiModelConfig, setAIModelConfig] = useState<AIModelConfig>({
    provider: "cerebras",
    model: "meta-llama/Llama-3.1-8B-Instruct:cerebras",
    apiKey: "",
    useCustomEndpoint: false,
    customEndpoint: ""
  });

  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [fontSize, setFontSize] = useState(18);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState("en");

  const getAllSettings = (): AllSettings => ({
    personality,
    voiceConfig,
    textToolsConfig,
    aiModelConfig,
    metaConfig: {
      theme,
      fontSize,
      highContrast,
      reducedMotion,
      soundEffects,
      notifications,
      autoSave,
      language
    }
  });

  // ------------------------------
  // Electron IPC: fetch & sync settings
  // ------------------------------
  useEffect(() => {
    if (typeof window === "undefined" || !window.electron) {
      setIsHydrated(true);
      return;
    }

    // Initial fetch from main process
    window.electron
      .invoke<AllSettings>("get-settings")
      .then((s: AllSettings) => {
        isApplyingRemoteUpdate.current = true;
        setPersonality(s.personality);
        setVoiceConfig(s.voiceConfig);
        setTextToolsConfig(s.textToolsConfig);
        setAIModelConfig(s.aiModelConfig);
        setTheme(s.metaConfig.theme);
        setFontSize(s.metaConfig.fontSize);
        setHighContrast(s.metaConfig.highContrast);
        setReducedMotion(s.metaConfig.reducedMotion);
        setSoundEffects(s.metaConfig.soundEffects);
        setNotifications(s.metaConfig.notifications);
        setAutoSave(s.metaConfig.autoSave);
        setLanguage(s.metaConfig.language);
      })
      .finally(() => {
        setIsHydrated(true);
      });

    // Listen for updates from main process
    const unsubscribe = window.electron.on(
      "settings-updated",
      (s: AllSettings) => {
        isApplyingRemoteUpdate.current = true;
        setPersonality(s.personality);
        setVoiceConfig(s.voiceConfig);
        setTextToolsConfig(s.textToolsConfig);
        setAIModelConfig(s.aiModelConfig);
        setTheme(s.metaConfig.theme);
        setFontSize(s.metaConfig.fontSize);
        setHighContrast(s.metaConfig.highContrast);
        setReducedMotion(s.metaConfig.reducedMotion);
        setSoundEffects(s.metaConfig.soundEffects);
        setNotifications(s.metaConfig.notifications);
        setAutoSave(s.metaConfig.autoSave);
        setLanguage(s.metaConfig.language);
        setIsHydrated(true);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // ------------------------------
  // Sync changes to main process
  // ------------------------------
  useEffect(() => {
    if (typeof window === "undefined" || !window.electron || !isHydrated) {
      return;
    }

    if (isApplyingRemoteUpdate.current) {
      isApplyingRemoteUpdate.current = false;
      return;
    }

    window.electron.send("update-settings", getAllSettings());
  }, [
    isHydrated,
    personality,
    voiceConfig,
    textToolsConfig,
    aiModelConfig,
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
    <SettingsContext.Provider
      value={{
        personality,
        setPersonality,
        voiceConfig,
        setVoiceConfig,
        textToolsConfig,
        setTextToolsConfig,
        aiModelConfig,
        setAIModelConfig,
        theme,
        setTheme,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion,
        soundEffects,
        setSoundEffects,
        notifications,
        setNotifications,
        autoSave,
        setAutoSave,
        language,
        setLanguage,
        getAllSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}
