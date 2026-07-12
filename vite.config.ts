import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Force a small allow-list of bare specifiers to be bundled, if ever needed.
const alwaysBundle: string[] = [];

// In library mode, externalize every bare import (anything not relative / absolute / alias).
// This matches the common React-library pattern: ship our code, let the consumer's bundler
// resolve every dependency from its own node_modules.
const isExternal = (id: string) => {
  if (alwaysBundle.includes(id)) return false;
  if (id.startsWith(".")) return false;
  if (id.startsWith("/")) return false;
  if (id.startsWith("@/")) return false;
  if (id.startsWith("src/")) return false;
  // Bare specifiers (react, @capacitor/core, jotai, etc.) and subpaths are external.
  return /^[a-zA-Z@]/.test(id);
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ["src", "global.d.ts"],
      tsconfigPath: "./tsconfig.types.json",
      rollupTypes: false,
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      src: resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2020",
    sourcemap: true,
    cssCodeSplit: false,
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      cssFileName: "index",
    },
    rollupOptions: {
      external: isExternal,
      output: {
        exports: "named",
      },
    },
  },
});
