import { BrowserWindow } from "electron";
import path from "path";

export const createMainWindow = (
  name: string,
  options: Electron.BrowserWindowConstructorOptions
) => {
  const win = new BrowserWindow({
    show: false,
    resizable: true,
    fullscreenable: true,
    useContentSize: true,
    autoHideMenuBar: true,
    ...options,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
      ...options.webPreferences
    }
  });

  win.once("ready-to-show", () => win.show());

  return win;
};

export const createOverlayWindow = (
  name: string,
  options: Electron.BrowserWindowConstructorOptions = {}
) => {
  const { screen } = require("electron");

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const win = new BrowserWindow({
    x: width - 500 - 20,
    y: height - (options.height || 420) - 20,
    show: true,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    hasShadow: false,
    useContentSize: true,
    autoHideMenuBar: true,
    ...options,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
      ...options.webPreferences
    }
  });

  win.setAlwaysOnTop(true, "floating");

  return win;
};


