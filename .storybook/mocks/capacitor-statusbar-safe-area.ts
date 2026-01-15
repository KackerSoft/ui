// Mock for @aashu-dubey/capacitor-statusbar-safe-area
export const SafeArea = {
  getSafeAreaInsets: () => Promise.resolve({ insets: { top: 0, right: 0, bottom: 0, left: 0 } }),
};
