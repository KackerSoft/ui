# Kacker UI

A standalone React component library built with Vite + Tailwind v4.

## Installation

```bash
pnpm add @kacker/ui
# or
npm i @kacker/ui
```

In your app's entry file, import the bundled styles once:

```ts
import "@kacker/ui/style.css";
```

## Local development against a consumer app

The workflow below uses pnpm's global link, which creates a symlink in your
consumer app's `node_modules` **without modifying its `package.json`**. When you
later run `pnpm install` in the consumer, the registry version is restored
automatically — no cleanup needed before pushing.

### One-time setup

```bash
# 1. In THIS repo (kacker_ui):
pnpm install
pnpm link --global

# 2. In the consumer app:
pnpm link --global @kacker/ui
```

### Day-to-day

```bash
# In kacker_ui — rebuilds on every save into dist/
pnpm dev

# In the consumer app — start as usual
pnpm dev
```

Any save here triggers a rebuild; the consumer's Vite dev server detects the
change in its linked `node_modules/@kacker/ui` and reloads.

### Recommended consumer Vite config (for clean HMR)

Vite pre-bundles `node_modules` deps by default, which can blunt HMR for linked
packages. Add this to the consumer's `vite.config.ts`:

```ts
export default defineConfig({
  optimizeDeps: {
    exclude: ["@kacker/ui"],
  },
  server: {
    watch: {
      // follow the symlink so file changes are picked up
      followSymlinks: true,
    },
  },
});
```

### Unlinking

```bash
# In the consumer app:
pnpm unlink --global @kacker/ui
pnpm install   # restores the published version
```

## Scripts

| Script          | Purpose                                   |
| --------------- | ----------------------------------------- |
| `pnpm dev`      | Build in watch mode (for local linking)   |
| `pnpm build`    | Production build (ESM + CJS + d.ts + CSS) |
| `pnpm ver-sync` | Bump patch version in `package.json`      |

## Build output

`dist/` contains:

- `index.js` — ESM bundle
- `index.cjs` — CommonJS bundle
- `index.d.ts` — type declarations
- `index.css` — bundled styles (consumer imports via `@kacker/ui/style.css`)
