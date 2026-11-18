import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "system" | "light" | "dark";

export const SETTINGS_STORAGE_KEY = "pu-settings";
export const FONT_SCALES = [0.85, 1, 1.15, 1.3, 1.5] as const;

interface SettingsState {
  theme: Theme;
  fontScale: number;
  showLatin: boolean;
  showTranslation: boolean;
  setTheme: (theme: Theme) => void;
  setFontScale: (fontScale: number) => void;
  setShowLatin: (showLatin: boolean) => void;
  setShowTranslation: (showTranslation: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      fontScale: 1,
      showLatin: true,
      showTranslation: true,
      setTheme: (theme) => set({ theme }),
      setFontScale: (fontScale) => set({ fontScale }),
      setShowLatin: (showLatin) => set({ showLatin }),
      setShowTranslation: (showTranslation) => set({ showTranslation }),
    }),
    { name: SETTINGS_STORAGE_KEY },
  ),
);

// Must stay in sync with applySettingsToDocument: runs before hydration to avoid a flash.
export const settingsInlineScript = `(function(){try{var s=(JSON.parse(localStorage.getItem("${SETTINGS_STORAGE_KEY}"))||{}).state||{};var d=document.documentElement;var t=s.theme||"system";if(t==="system")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.setAttribute("data-theme",t);d.style.setProperty("--font-scale",String(s.fontScale||1));if(s.showLatin===false)d.setAttribute("data-hide-latin","");if(s.showTranslation===false)d.setAttribute("data-hide-translation","")}catch(e){}})()`;

export const resolveTheme = (theme: Theme): "light" | "dark" => {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const applySettingsToDocument = ({
  theme,
  fontScale,
  showLatin,
  showTranslation,
}: Pick<SettingsState, "theme" | "fontScale" | "showLatin" | "showTranslation">) => {
  const root = document.documentElement;
  const resolved = resolveTheme(theme);
  root.setAttribute("data-theme", resolved);
  root.style.setProperty("--font-scale", String(fontScale));
  root.toggleAttribute("data-hide-latin", !showLatin);
  root.toggleAttribute("data-hide-translation", !showTranslation);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", resolved === "dark" ? "#0b1311" : "#faf7f0");
};
