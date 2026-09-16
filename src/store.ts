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
// Tracks the native base build version that was active when `currentBundleAtom`
// was set, so we can detect when the native app store build changes underneath
// a previously downloaded OTA bundle (in either direction), even if the new
// base build's version number is still lower than the bundle's version.
export const currentBundleBaseBuildAtom = atomWithStorage<number | null>(
  `kui-current-bundle-base-build`,
  null,
);
