import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  receive: (channel: string, func: Function) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args))
});

contextBridge.exposeInMainWorld("electronAPI", {
  onText: (callback: (text: string) => void) => {
    const listener = (_event: any, text: string) => callback(text);
    ipcRenderer.on("selection-text", listener);

    // Return cleanup function if needed
    return () => ipcRenderer.removeListener("selection-text", listener);
  },
  speakText: (text: string) => {
    if (!text) return;
    ipcRenderer.send("speak-text", text); // optional Node-side TTS
  }
});