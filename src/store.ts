import { atom } from "jotai";
import { ViewStack } from "./context/viewstack";
import { atomWithStorage } from "jotai/utils";
import { AutoUpdatePreference, UpdateBundle } from "./update";

export const viewStackAtom = atom<ViewStack[]>([]);
export const themeAtom = atomWithStorage("kui-theme", "system");
export const popStateAtom = atom<any | null>(null);
export const autoUpdateAtom = atomWithStorage<AutoUpdatePreference>(
  "kui-auto-update-preference",
  AutoUpdatePreference.PRODUCTION,
);
export const currentBundleAtom = atomWithStorage<UpdateBundle | null>(
  `kui-current-bundle`,
  null,
);
