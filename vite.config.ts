import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { copyFileSync } from "node:fs";

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

// tailwind.css is a plain asset for consumers to `@import` — it must ship verbatim
// (its @source/@import directives are meant for the *consumer's* Tailwind build, not ours).
function copyTailwindCss(): Plugin {
  return {
    name: "copy-tailwind-css",
    closeBundle() {
      copyFileSync(
        resolve(__dirname, "src/tailwind.css"),
        resolve(__dirname, "dist/tailwind.css"),
      );
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    copyTailwindCss(),
    dts({
      include: ["src", "global.d.ts"],
      tsconfigPath: "./tsconfig.types.json",
      bundleTypes: false,
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
      entry: {
        index: resolve(__dirname, "src/index.tsx"),
        "vite-plugin": resolve(__dirname, "src/vite-plugin.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        format === "es" ? `${entryName}.js` : `${entryName}.cjs`,
      cssFileName: "index",
    },
    rollupOptions: {
      external: isExternal,
      onwarn(warning, warn) {
        // src/vite-plugin.ts uses import.meta.url only on the ESM branch of a
        // __dirname-vs-import.meta feature check; it's dead code in the cjs
        // build (never evaluated there), so this warning is a false positive.
        if (warning.code === "EMPTY_IMPORT_META") return;
        warn(warning);
      },
      output: {
        exports: "named",
      },
    },
  },
});
