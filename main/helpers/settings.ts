import fs from "fs/promises";
import path from "path";
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

const SETTINGS_FILE_NAME = "settings.json";

function getSettingsFilePath(userDataPath: string): string {
  return path.join(userDataPath, SETTINGS_FILE_NAME);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function mergeSettings(
  base: AllSettings,
  incoming: Partial<AllSettings>
): AllSettings {
  return {
    ...base,
    ...incoming,
    personality: {
      ...base.personality,
      ...(incoming.personality ?? {})
    },
    voiceConfig: {
      ...base.voiceConfig,
      ...(incoming.voiceConfig ?? {})
    },
    textToolsConfig: {
      ...base.textToolsConfig,
      ...(incoming.textToolsConfig ?? {})
    },
    aiModelConfig: {
      ...base.aiModelConfig,
      ...(incoming.aiModelConfig ?? {})
    },
    metaConfig: {
      ...base.metaConfig,
      ...(incoming.metaConfig ?? {})
    }
  };
}

export async function loadPersistedSettings(
  userDataPath: string
): Promise<AllSettings> {
  const settingsFile = getSettingsFilePath(userDataPath);

  try {
    const raw = await fs.readFile(settingsFile, "utf8");
    const parsed: unknown = JSON.parse(raw);

    if (!isObject(parsed)) {
      return defaultSettings;
    }

    return mergeSettings(defaultSettings, parsed as Partial<AllSettings>);
  } catch {
    await persistSettings(userDataPath, defaultSettings);
    return defaultSettings;
  }
}

export async function persistSettings(
  userDataPath: string,
  settings: AllSettings
): Promise<void> {
  const settingsFile = getSettingsFilePath(userDataPath);
  await fs.mkdir(userDataPath, { recursive: true });
  await fs.writeFile(settingsFile, JSON.stringify(settings, null, 2), "utf8");
}
