// Mock for @capacitor/app
export const App = {
  addListener: () => ({ remove: () => {} }),
  removeAllListeners: () => Promise.resolve(),
};
