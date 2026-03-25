import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  receive: (channel: string, func: Function) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args))
});

contextBridge.exposeInMainWorld("electronAPI", {
  onText: (cb: (arg0: any) => void) => ipcRenderer.on("selection-text", (_, text) => cb(text))
});