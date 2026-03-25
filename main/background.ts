import path from "path";
import clipboard from "clipboardy";
import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
import {
  createCompanionWindow,
  createMainWindow,
  createOverlayWindow
} from "./helpers/create-window";

const isProd = process.env.NODE_ENV === "production";

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

  // ----------------------------------------------------
  // ✅ INSERT APPROACH A — PRIMARY CLIPBOARD POLLING
  // ----------------------------------------------------
  let lastSelection = "";

  setInterval(async () => {
    try {
      const selection = await clipboard.read(); // reads PRIMARY on Linux

      if (selection && selection !== lastSelection) {
        lastSelection = selection;

        // Show overlay without stealing focus
        overlayWindow.showInactive();

        // Send the selected text to the overlay React app
        overlayWindow.webContents.send("selection-text", selection);
      }
    } catch (err) {
      console.error("Clipboard read error:", err);
    }
  }, 200); // check every 200ms
  // ----------------------------------------------------
})();

app.on("child-process-gone", (_event, details) => {
  console.error("[main] child process gone", details);
});

app.on("window-all-closed", () => app.quit());
