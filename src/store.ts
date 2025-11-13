import { atom } from "jotai";
import { ViewStack } from "./context/viewstack";
import { atomWithStorage } from "jotai/utils";

export const viewStackAtom = atom<ViewStack[]>([]);
export const themeAtom = atomWithStorage("kui-theme", "system");
export const popStateAtom = atom<any | null>(null);
