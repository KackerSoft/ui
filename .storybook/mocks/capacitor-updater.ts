// Mock for @capgo/capacitor-updater
export const CapacitorUpdater = {
  notifyAppReady: () => Promise.resolve(),
  download: () => Promise.resolve({ version: '' }),
  set: () => Promise.resolve(),
};
