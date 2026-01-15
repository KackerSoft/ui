import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    // Merge custom configuration
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../src"),
        // Mock Capacitor dependencies
        "@capacitor/app": path.resolve(__dirname, "./mocks/capacitor-app.ts"),
        "@capacitor/core": path.resolve(__dirname, "./mocks/capacitor-core.ts"),
        "@capacitor/status-bar": path.resolve(__dirname, "./mocks/capacitor-status-bar.ts"),
        "@capgo/capacitor-updater": path.resolve(__dirname, "./mocks/capacitor-updater.ts"),
        "@aashu-dubey/capacitor-statusbar-safe-area": path.resolve(__dirname, "./mocks/capacitor-statusbar-safe-area.ts"),
        "@hugotomazi/capacitor-navigation-bar": path.resolve(__dirname, "./mocks/capacitor-navigation-bar.ts"),
      };
    }
    return config;
  },
};
export default config;
