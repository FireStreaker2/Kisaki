import { BrowserWindow } from "electron";
import path from "path";

export const createWindow = (
  name: string,
  options: Electron.BrowserWindowConstructorOptions
) => {
  const win = new BrowserWindow({
    show: false,
    resizable: true,
    fullscreenable: true,
    useContentSize: true, // content width/height match window
    autoHideMenuBar: true,
    ...options,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false, // sometimes fixes static loading issues
      ...options.webPreferences
    }
  });

  win.once("ready-to-show", () => win.show());

  return win;
};
