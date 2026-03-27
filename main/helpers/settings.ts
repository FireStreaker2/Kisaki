import type { AllSettings } from "../../renderer/components/dashboard/settings-context";

export const defaultSettings: AllSettings = {
  personality: {
    name: "Kisaki",
    tone: "friendly",
    verbosity: "normal",
    humor: true
  },
  voiceConfig: {
    enabled: true,
    voice: "en-US-Neural2-C",
    speed: 0.9,
    pitch: 1.0,
    volume: 0.8,
    wakeWord: "Hey Kisaki",
    continuousListening: false
  },
  textToolsConfig: {
    explainEnabled: true,
    summarizeEnabled: true,
    translateEnabled: true,
    factCheckEnabled: true,
    defaultLanguage: "en",
    readingLevel: "simple",
    autoDetectLanguage: true
  },
  aiModelConfig: {
    provider: "openai",
    model: "gpt-4o-mini",
    apiKey: "",
    useCustomEndpoint: false,
    customEndpoint: ""
  },
  mcpConfig: {
    connected: false,
    serverUrl: "",
    apiKey: "",
    autoConnect: true,
    allowedTools: ["file-manager", "web-search", "calculator", "reminders"]
  },
  metaConfig: {
    theme: "light",
    fontSize: 18,
    highContrast: false,
    reducedMotion: false,
    soundEffects: true,
    notifications: true,
    autoSave: true,
    language: "en"
  }
};
