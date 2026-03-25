import path from "path";
import { app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers/create-window";

const isProd = process.env.NODE_ENV === "production";

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
}

// Linux GPU drivers can cause Electron windows to become unresponsive.
if (process.platform === "linux") {
  app.disableHardwareAcceleration();

  // Extra Chromium stability flags for Linux compositor/GPU crashes.
  app.commandLine.appendSwitch("disable-gpu");
  app.commandLine.appendSwitch("disable-gpu-compositing");
  app.commandLine.appendSwitch("disable-dev-shm-usage");

  // Wayland compositors can cause input/render freezes for some Electron apps.
  // Default to X11 path unless the user explicitly overrides it.
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

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.on("unresponsive", () => {
    console.error("[main] BrowserWindow became unresponsive");
  });

  mainWindow.on("responsive", () => {
    console.info("[main] BrowserWindow recovered responsiveness");
  });

  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    console.error("[main] renderer process gone", details);
  });

  mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDesc) => {
    console.error("[main] page failed to load", { errorCode, errorDesc });
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
  }
})();

app.on("child-process-gone", (_event, details) => {
  console.error("[main] child process gone", details);
});

app.on("window-all-closed", () => app.quit());
