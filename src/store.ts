import { atom } from "jotai";
import { ViewStack } from "./context/viewstack";
import { atomWithStorage } from "jotai/utils";
import { AutoUpdatePreference, UpdateBundle } from "./update";

export const viewStackAtom = atom<ViewStack[]>([]);
export const themeAtom = atomWithStorage("kui-theme", "system");
export const popStateAtom = atom<any | null>(null);
// `getOnInit` so the persisted value is available on the very first render;
// otherwise the update logic below sees the default and misfires before the
// async hydration lands.
export const autoUpdateAtom = atomWithStorage<AutoUpdatePreference>(
  "kui-auto-update-preference",
  AutoUpdatePreference.PRODUCTION,
  undefined,
  { getOnInit: true },
);
export const currentBundleAtom = atomWithStorage<UpdateBundle | null>(
  `kui-current-bundle`,
  null,
  undefined,
  { getOnInit: true },
);
