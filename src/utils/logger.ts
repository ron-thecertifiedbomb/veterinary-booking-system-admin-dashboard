const isDev = __DEV__;

export const logger = {
  info: (message: string, data?: unknown) => {
    if (isDev) {
      console.log(`ℹ️ ${message}`, data ?? "");
    }
  },

  warn: (message: string, data?: unknown) => {
    if (isDev) {
      console.warn(`⚠️ ${message}`, data ?? "");
    }
  },

  error: (message: string, data?: unknown) => {
    if (isDev) {
      console.error(`❌ ${message}`, data ?? "");
    }
  },
};
``;
