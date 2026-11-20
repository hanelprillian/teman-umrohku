import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { asyncStorage } from "./storage";

export type Theme = "system" | "light" | "dark";
export type Density = "compact" | "comfortable" | "loose";
export type Gender = "all" | "pria" | "wanita";
export type Hand = "right" | "left";

export const DENSITY_SCALE: Record<Density, number> = {
  compact: 0.8,
  comfortable: 1,
  loose: 1.2,
};

export const SETTINGS_STORAGE_KEY = "pu-settings";
export const SPLASH_SESSION_KEY = "pu-splash-shown";
export const FONT_SCALES = [0.85, 1, 1.15, 1.3, 1.5] as const;
export const ARABIC_SCALES = [0.85, 1, 1.2, 1.4, 1.6, 1.8] as const;

export const nearestScaleIndex = (scales: readonly number[], value: number) =>
  scales.reduce(
    (best, scale, index) =>
      Math.abs(scale - value) < Math.abs(scales[best] - value) ? index : best,
    0,
  );

interface SettingsState {
  theme: Theme;
  fontScale: number;
  arabicScale: number;
  showLatin: boolean;
  showTranslation: boolean;
  showDalil: boolean;
  immersive: boolean;
  density: Density;
  gender: Gender;
  hand: Hand;
  scrollLock: boolean;
  autoFocusCounter: boolean;
  showSplash: boolean;
  onboarded: boolean;
  setTheme: (theme: Theme) => void;
  setDensity: (density: Density) => void;
  setGender: (gender: Gender) => void;
  setHand: (hand: Hand) => void;
  setScrollLock: (scrollLock: boolean) => void;
  setAutoFocusCounter: (autoFocusCounter: boolean) => void;
  setShowSplash: (showSplash: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
  setPersonalization: (
    values: Partial<
      Pick<
        SettingsState,
        "gender" | "hand" | "scrollLock" | "autoFocusCounter" | "immersive"
      >
    >,
  ) => void;
  setFontScale: (fontScale: number) => void;
  setArabicScale: (arabicScale: number) => void;
  setShowLatin: (showLatin: boolean) => void;
  setShowTranslation: (showTranslation: boolean) => void;
  setShowDalil: (showDalil: boolean) => void;
  setImmersive: (immersive: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      fontScale: 1,
      arabicScale: 1,
      showLatin: true,
      showTranslation: true,
      showDalil: false,
      immersive: false,
      density: "comfortable",
      gender: "all",
      hand: "right",
      scrollLock: false,
      autoFocusCounter: false,
      showSplash: true,
      onboarded: false,
      setTheme: (theme) => set({ theme }),
      setDensity: (density) => set({ density }),
      setGender: (gender) => set({ gender }),
      setHand: (hand) => set({ hand }),
      setScrollLock: (scrollLock) => set({ scrollLock }),
      setAutoFocusCounter: (autoFocusCounter) => set({ autoFocusCounter }),
      setShowSplash: (showSplash) => set({ showSplash }),
      setOnboarded: (onboarded) => set({ onboarded }),
      setPersonalization: (values) => set(values),
      setFontScale: (fontScale) => set({ fontScale }),
      setArabicScale: (arabicScale) => set({ arabicScale }),
      setShowLatin: (showLatin) => set({ showLatin }),
      setShowTranslation: (showTranslation) => set({ showTranslation }),
      setShowDalil: (showDalil) => set({ showDalil }),
      setImmersive: (immersive) => set({ immersive }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => asyncStorage),
      migrate: (persisted, version) => {
        const state = persisted as Partial<SettingsState>;
        if (version < 1) state.arabicScale = state.fontScale ?? 1;
        if (version < 2 && state.showSplash === undefined) state.showSplash = true;
        return state as SettingsState;
      },
    },
  ),
);
