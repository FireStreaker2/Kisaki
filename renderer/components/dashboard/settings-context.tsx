"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

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
  volume: number;
  wakeWord: string;
  continuousListening: boolean;
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

interface MCPConfig {
  connected: boolean;
  serverUrl: string;
  apiKey: string;
  autoConnect: boolean;
  allowedTools: string[];
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
  mcpConfig: MCPConfig;
  metaConfig: MetaConfig;
}

interface SettingsContextType {
  // Companion
  personality: CompanionPersonality;
  setPersonality: (p: CompanionPersonality) => void;

  // Voice
  voiceConfig: VoiceConfig;
  setVoiceConfig: (v: VoiceConfig) => void;

  // Text Tools
  textToolsConfig: TextToolsConfig;
  setTextToolsConfig: (t: TextToolsConfig) => void;

  // AI Model
  aiModelConfig: AIModelConfig;
  setAIModelConfig: (a: AIModelConfig) => void;

  // MCP
  mcpConfig: MCPConfig;
  setMCPConfig: (m: MCPConfig) => void;

  // Meta (Dashboard)
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

  // Export all settings
  getAllSettings: () => AllSettings;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
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
    pitch: 1.0,
    volume: 0.8,
    wakeWord: "Hey Kisaki",
    continuousListening: false
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
    provider: "openai",
    model: "gpt-4o-mini",
    apiKey: "",
    useCustomEndpoint: false,
    customEndpoint: ""
  });

  const [mcpConfig, setMCPConfig] = useState<MCPConfig>({
    connected: false,
    serverUrl: "",
    apiKey: "",
    autoConnect: true,
    allowedTools: ["file-manager", "web-search", "calculator", "reminders"]
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
    mcpConfig,
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
        mcpConfig,
        setMCPConfig,
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
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
