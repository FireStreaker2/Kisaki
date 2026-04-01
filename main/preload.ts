import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  invoke: (channel: string, data?: any) => ipcRenderer.invoke(channel, data),
  on: (channel: string, listener: (...args: any[]) => void) => {
    const wrapped = (_event: Electron.IpcRendererEvent, ...args: any[]) => {
      listener(...args);
    };

    ipcRenderer.on(channel, wrapped);
    return () => ipcRenderer.removeListener(channel, wrapped);
  },
  off: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.removeListener(
      channel,
      listener as unknown as (...args: any[]) => void
    );
  },
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
  speakText: (payload: { text: string; voice?: string; speed?: number }) => {
    if (!payload?.text) return;
    ipcRenderer.send("speak-text", payload); // Node-side TTS
  },
  openExternal: (url: string) => {
    if (!url) return;
    ipcRenderer.send("open-external", url);
  }
});
