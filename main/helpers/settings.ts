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
    pitch: 1.0
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
    provider: "cerebras",
    model: "meta-llama/Llama-3.1-8B-Instruct:cerebras",
    apiKey: "",
    useCustomEndpoint: false,
    customEndpoint: ""
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
