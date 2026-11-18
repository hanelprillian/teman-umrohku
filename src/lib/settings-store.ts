import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "system" | "light" | "dark";

export const SETTINGS_STORAGE_KEY = "pu-settings";
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
  setTheme: (theme: Theme) => void;
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
      setTheme: (theme) => set({ theme }),
      setFontScale: (fontScale) => set({ fontScale }),
      setArabicScale: (arabicScale) => set({ arabicScale }),
      setShowLatin: (showLatin) => set({ showLatin }),
      setShowTranslation: (showTranslation) => set({ showTranslation }),
      setShowDalil: (showDalil) => set({ showDalil }),
      setImmersive: (immersive) => set({ immersive }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as Partial<SettingsState>;
        if (version < 1) state.arabicScale = state.fontScale ?? 1;
        return state as SettingsState;
      },
    },
  ),
);

// Must stay in sync with applySettingsToDocument: runs before hydration to avoid a flash.
export const settingsInlineScript = `(function(){try{var s=(JSON.parse(localStorage.getItem("${SETTINGS_STORAGE_KEY}"))||{}).state||{};var d=document.documentElement;var t=s.theme||"system";if(t==="system")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.setAttribute("data-theme",t);d.style.setProperty("--font-scale",String(s.fontScale||1));d.style.setProperty("--arabic-scale",String(s.arabicScale||s.fontScale||1));if(s.showLatin===false)d.setAttribute("data-hide-latin","");if(s.showTranslation===false)d.setAttribute("data-hide-translation","");if(s.showDalil!==true)d.setAttribute("data-hide-dalil","")}catch(e){}})()`;

export const resolveTheme = (theme: Theme): "light" | "dark" => {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const applySettingsToDocument = ({
  theme,
  fontScale,
  arabicScale,
  showLatin,
  showTranslation,
  showDalil,
}: Pick<
  SettingsState,
  "theme" | "fontScale" | "arabicScale" | "showLatin" | "showTranslation" | "showDalil"
>) => {
  const root = document.documentElement;
  const resolved = resolveTheme(theme);
  root.setAttribute("data-theme", resolved);
  root.style.setProperty("--font-scale", String(fontScale));
  root.style.setProperty("--arabic-scale", String(arabicScale));
  root.toggleAttribute("data-hide-latin", !showLatin);
  root.toggleAttribute("data-hide-translation", !showTranslation);
  root.toggleAttribute("data-hide-dalil", !showDalil);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", resolved === "dark" ? "#0b1311" : "#faf7f0");
};
