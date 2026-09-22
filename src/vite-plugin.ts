import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";

// Real on-disk location of this package (follows the node_modules symlink when
// the package is `pnpm link`-ed into a consumer for local development).
// Works in both the ESM and CJS builds: __dirname is native in CJS, and the
// import.meta.url branch is dead code there (never evaluated) so it's safe.
declare const __dirname: string | undefined;
const moduleDir =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));
const here = fs.realpathSync(moduleDir);
const packageRoot = path.resolve(here, "..");
const srcDir = path.join(packageRoot, "src");

// Only real npm installs ship "dist" (see package.json "files"); a linked/monorepo
// checkout has the full repo on disk, so "src" is present too.
const isLinked = fs.existsSync(srcDir);

/**
 * Vite plugin for consuming @kacker/ui.
 * - Linked/monorepo dev: resolves the package straight to its TSX source, so edits
 *   get real React Fast Refresh instead of waiting on a separate dist build.
 * - Real npm install: no-ops, letting normal node_modules resolution handle it.
 *
 * Tailwind class scanning + the shared theme/`.kui-*` CSS are handled separately
 * by importing "@kacker/ui/tailwind" in your CSS (see package.json exports) —
 * that's a real file, not something this plugin needs to resolve.
 */
export default function kackerUI(): Plugin {
  return {
    name: "kacker-ui",
    // must win over vite's built-in resolver for the source-aliasing below
    enforce: "pre",
    config(config) {
      if (!isLinked) return;
      // extend (never replace) the allow-list: providing our own array here would
      // otherwise override vite's default, which normally includes the app root
      const root = path.resolve(config.root ?? process.cwd());
      return {
        server: {
          fs: {
            allow: [...(config.server?.fs?.allow ?? []), root, packageRoot],
          },
        },
        optimizeDeps: {
          exclude: [...(config.optimizeDeps?.exclude ?? []), "@kacker/ui"],
        },
      };
    },
    async resolveId(id, importer, options) {
      if (!isLinked) return null;

      let mapped: string | null = null;
      if (id === "@kacker/ui") mapped = path.join(srcDir, "index.tsx");
      else if (id === "@kacker/ui/style.css")
        mapped = path.join(srcDir, "index.css");
      else if (id === "@kacker/ui/tailwind")
        mapped = path.join(srcDir, "tailwind.css");
      // kacker_ui's own source uses "@/*" and "src/*" aliases scoped to itself;
      // only rewrite those when the importer is inside this package.
      else if (importer?.startsWith(srcDir)) {
        if (id.startsWith("@/")) mapped = path.join(srcDir, id.slice(2));
        else if (id === "src/index.css")
          mapped = path.join(srcDir, "index.css");
        else if (id.startsWith("src/")) mapped = path.join(srcDir, id.slice(4));
      }
      if (!mapped) return null;
      // delegate back to Vite's resolver for extension/index-file inference
      return this.resolve(mapped, importer, { ...options, skipSelf: true });
    },
  };
}
