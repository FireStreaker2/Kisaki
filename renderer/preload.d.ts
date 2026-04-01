declare global {
  interface Window {
    electron: {
      send: (channel: string, data?: unknown) => void;
      invoke: <T = unknown>(channel: string, data?: unknown) => Promise<T>;
      on: (channel: string, listener: (...args: any[]) => void) => () => void;
      receive: (channel: string, func: (...args: any[]) => void) => void;
    };
    electronAPI: {
      onText: (callback: (text: string) => void) => () => void;
      speakText: (payload: {
        text: string;
        voice?: string;
        speed?: number;
      }) => void;
    };
  }
}

export {};
