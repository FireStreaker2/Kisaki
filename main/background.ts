import path from "path";
import clipboard from "clipboardy";
import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
import { ipcMain } from "electron";
import say from "say";
import {
  createCompanionWindow,
  createMainWindow,
  createOverlayWindow
} from "./helpers/create-window";
import { defaultSettings } from "./helpers/settings";
import { AllSettings } from "../renderer/components/dashboard/settings-context";

let settings = defaultSettings;
const isProd = process.env.NODE_ENV === "production";

type SpeakPayload = string | { text: string; voice?: string; speed?: number };

const sayVoiceCandidatesById: Record<string, string[]> = {
  // Linux festival uses voice functions like (voice_cmu_us_slt_cg)
  "en-US-Neural2-C": [
    "voice_cmu_us_slt_cg",
    "samantha",
    "zira",
    "english-us",
    "en-us"
  ],
  "en-US-Neural2-D": [
    "voice_cmu_us_rms_cg",
    "alex",
    "david",
    "english-us",
    "en-us"
  ],
  "en-US-Neural2-F": [
    "voice_cmu_us_slt_cg",
    "victoria",
    "hazel",
    "english-us",
    "en-us"
  ],
  "en-GB-Neural2-B": [
    "voice_cmu_us_awb_cg",
    "daniel",
    "george",
    "english_rp",
    "en-gb"
  ],
  "en-GB-Neural2-C": [
    "voice_cmu_us_awb_cg",
    "moira",
    "hazel",
    "english_rp",
    "en-gb"
  ]
};

function clampSpeed(speed?: number): number | undefined {
  if (typeof speed !== "number" || Number.isNaN(speed)) return undefined;
  return Math.min(2, Math.max(0.5, speed));
}

function getLocaleCandidates(voiceId?: string): string[] {
  if (!voiceId || !voiceId.includes("-")) return [];
  const locale = voiceId.split("-Neural")[0]?.toLowerCase();
  if (!locale) return [];

  const [lang, region] = locale.split("-");
  const candidates = [locale, lang];

  if (region) {
    candidates.push(`${lang}_${region}`);
    candidates.push(`${lang}-${region}`);
    if (locale === "en-us") candidates.push("english-us");
    if (locale === "en-gb") candidates.push("english_rp");
  }

  return candidates;
}

function resolveSayVoice(voiceId?: string): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (!voiceId) {
      resolve(undefined);
      return;
    }

    // say.js on Linux/Festival does not reliably expose getInstalledVoices.
    // Use known festival voice functions directly.
    if (process.platform === "linux") {
      resolve(sayVoiceCandidatesById[voiceId]?.[0]);
      return;
    }

    (
      say as unknown as {
        getInstalledVoices: (
          callback: (error: unknown, installedVoices?: string[]) => void
        ) => void;
      }
    ).getInstalledVoices((error, installedVoices = []) => {
      if (error || !installedVoices || installedVoices.length === 0) {
        resolve(undefined);
        return;
      }

      const lowerInstalled = installedVoices.map((v) => v.toLowerCase());
      const configuredCandidates = sayVoiceCandidatesById[voiceId] ?? [];
      const localeCandidates = getLocaleCandidates(voiceId);
      const allCandidates = [...configuredCandidates, ...localeCandidates];

      for (const candidate of allCandidates) {
        const exactIndex = lowerInstalled.findIndex((v) => v === candidate);
        if (exactIndex >= 0) {
          resolve(installedVoices[exactIndex]);
          return;
        }
      }

      for (const candidate of allCandidates) {
        const partialIndex = lowerInstalled.findIndex((v) =>
          v.includes(candidate)
        );
        if (partialIndex >= 0) {
          resolve(installedVoices[partialIndex]);
          return;
        }
      }

      resolve(undefined);
    });
  });
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
}

// Linux GPU drivers can cause Electron windows to become unresponsive.
if (process.platform === "linux") {
  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch("disable-gpu");
  app.commandLine.appendSwitch("disable-gpu-compositing");
  app.commandLine.appendSwitch("disable-dev-shm-usage");
  app.commandLine.appendSwitch("enable-speech-dispatcher");
  app.commandLine.appendSwitch("enable-speech-synthesis");

  if (!process.env.ELECTRON_OZONE_PLATFORM_HINT) {
    app.commandLine.appendSwitch("ozone-platform-hint", "x11");
  }
}

process.on("uncaughtException", (error) => {
  console.error("[main] uncaughtException", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("[main] unhandledRejection", reason);
});

app.on("second-instance", () => {
  console.warn("[main] prevented second app instance");
});

if (isProd) serve({ directory: "app" });

(async () => {
  await app.whenReady();

  const mainWindow = createMainWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  const overlayWindow = createOverlayWindow("overlay", {
    width: 290,
    height: 200,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  const companionWindow = createCompanionWindow();

  if (isProd) {
    await mainWindow.loadURL("app://./home");
    await overlayWindow.loadURL("app://./overlay");
    await companionWindow.loadURL("app://./companion");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    await overlayWindow.loadURL(`http://localhost:${port}/overlay`);
    await companionWindow.loadURL(`http://localhost:${port}/companion`);
    overlayWindow.webContents.setZoomFactor(0.5);
  }

  let lastSelection = "";

  setInterval(async () => {
    try {
      const selection = await clipboard.read();

      if (selection && selection !== lastSelection) {
        lastSelection = selection;

        overlayWindow.showInactive();

        overlayWindow.webContents.send("selection-text", selection);
      }
    } catch (err) {
      console.error("Clipboard read error:", err);
    }
  }, 200); // check every 200ms
})();

app.on("child-process-gone", (_event, details) => {
  console.error("[main] child process gone", details);
});

app.on("window-all-closed", () => app.quit());

ipcMain.on("speak-text", async (_event, payload: SpeakPayload) => {
  const text = typeof payload === "string" ? payload : payload?.text;
  if (!text) return;

  const voiceId = typeof payload === "string" ? undefined : payload?.voice;
  const speed = clampSpeed(
    typeof payload === "string" ? undefined : payload?.speed
  );
  const resolvedVoice = await resolveSayVoice(voiceId);

  say.speak(text, resolvedVoice, speed);
});

ipcMain.on("restart-app", () => {
  app.relaunch();
  app.exit(0);
});

ipcMain.handle("get-settings", () => settings);
ipcMain.on("update-settings", (_, newSettings: Partial<AllSettings>) => {
  settings = { ...settings, ...newSettings };

  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send("settings-updated", settings);
  });
});
