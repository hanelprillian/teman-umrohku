import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "system" | "light" | "dark";
export type NoorTheme = "cozy" | "minimal" | "artistic" | "futuristic";
export type Density = "compact" | "comfortable" | "loose";
export type Gender = "all" | "pria" | "wanita";
export type Hand = "right" | "left";

export const NOOR_THEMES: {
  id: NoorTheme;
  name: string;
  tagline: string;
  swatches: [string, string, string];
}[] = [
  {
    id: "cozy",
    name: "Cozy",
    tagline: "Hangat, sudut lembut, nyaman dibaca lama",
    swatches: ["#f7f4ef", "#ea7a2e", "#d9a45b"],
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Bersih, tegas, fokus pada bacaan",
    swatches: ["#fcfcfd", "#6366f1", "#e5e5e5"],
  },
  {
    id: "artistic",
    name: "Artistic",
    tagline: "Tipografi serif bergaya buku & majalah",
    swatches: ["#fbfaf7", "#9933cc", "#f5be0b"],
  },
  {
    id: "futuristic",
    name: "Futuristic",
    tagline: "Gelap modern dengan aksen ungu & cyan",
    swatches: ["#121216", "#9947eb", "#19b5d9"],
  },
];

const THEME_META_COLOR: Record<NoorTheme, { light: string; dark: string }> = {
  cozy: { light: "#f7f4ef", dark: "#231e1a" },
  minimal: { light: "#fcfcfd", dark: "#1a1a1a" },
  artistic: { light: "#fbfaf7", dark: "#141414" },
  futuristic: { light: "#121216", dark: "#0b0b0e" },
};

export const DENSITY_SCALE: Record<Density, number> = {
  compact: 0.82,
  comfortable: 1,
  loose: 1.18,
};

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
  noorTheme: NoorTheme;
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
  onboarded: boolean;
  setTheme: (theme: Theme) => void;
  setNoorTheme: (noorTheme: NoorTheme) => void;
  setDensity: (density: Density) => void;
  setGender: (gender: Gender) => void;
  setHand: (hand: Hand) => void;
  setScrollLock: (scrollLock: boolean) => void;
  setAutoFocusCounter: (autoFocusCounter: boolean) => void;
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
      noorTheme: "cozy",
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
      onboarded: false,
      setTheme: (theme) => set({ theme }),
      setNoorTheme: (noorTheme) => set({ noorTheme }),
      setDensity: (density) => set({ density }),
      setGender: (gender) => set({ gender }),
      setHand: (hand) => set({ hand }),
      setScrollLock: (scrollLock) => set({ scrollLock }),
      setAutoFocusCounter: (autoFocusCounter) => set({ autoFocusCounter }),
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
      migrate: (persisted, version) => {
        const state = persisted as Partial<SettingsState>;
        if (version < 1) state.arabicScale = state.fontScale ?? 1;
        if (version < 2) state.noorTheme = "cozy";
        return state as SettingsState;
      },
    },
  ),
);

const VALID_NOOR = ["cozy", "minimal", "artistic", "futuristic"];

// Must stay in sync with applySettingsToDocument: runs before hydration to avoid a flash.
export const settingsInlineScript = `(function(){try{var s=(JSON.parse(localStorage.getItem("${SETTINGS_STORAGE_KEY}"))||{}).state||{};var d=document.documentElement;var t=s.theme||"system";if(t==="system")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var nt=${JSON.stringify(VALID_NOOR)}.indexOf(s.noorTheme)>=0?s.noorTheme:"cozy";var isDark=t==="dark"||nt==="futuristic";d.setAttribute("data-theme",isDark?"dark":"light");d.classList.toggle("dark",isDark);${JSON.stringify(VALID_NOOR)}.forEach(function(k){d.classList.remove("theme-"+k)});d.classList.add("theme-"+nt);d.style.setProperty("--font-scale",String(s.fontScale||1));d.style.setProperty("--arabic-scale",String(s.arabicScale||s.fontScale||1));d.style.setProperty("--density",String(${JSON.stringify(DENSITY_SCALE)}[s.density]||1));if(s.showLatin===false)d.setAttribute("data-hide-latin","");if(s.showTranslation===false)d.setAttribute("data-hide-translation","");if(s.showDalil!==true)d.setAttribute("data-hide-dalil","");if(s.gender==="pria"||s.gender==="wanita")d.setAttribute("data-gender",s.gender)}catch(e){}})()`;

export const resolveTheme = (theme: Theme): "light" | "dark" => {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const applySettingsToDocument = ({
  theme,
  noorTheme,
  fontScale,
  arabicScale,
  showLatin,
  showTranslation,
  showDalil,
  density,
  gender,
}: Pick<
  SettingsState,
  | "theme"
  | "noorTheme"
  | "fontScale"
  | "arabicScale"
  | "showLatin"
  | "showTranslation"
  | "showDalil"
  | "density"
  | "gender"
>) => {
  const root = document.documentElement;
  const resolved = resolveTheme(theme);
  const safeNoor: NoorTheme =
    noorTheme in THEME_META_COLOR ? noorTheme : "cozy";
  const isDark = resolved === "dark" || safeNoor === "futuristic";

  root.setAttribute("data-theme", isDark ? "dark" : "light");
  root.classList.toggle("dark", isDark);
  for (const name of VALID_NOOR) root.classList.remove(`theme-${name}`);
  root.classList.add(`theme-${safeNoor}`);

  root.style.setProperty("--font-scale", String(fontScale));
  root.style.setProperty("--arabic-scale", String(arabicScale));
  root.style.setProperty("--density", String(DENSITY_SCALE[density] ?? 1));
  root.toggleAttribute("data-hide-latin", !showLatin);
  root.toggleAttribute("data-hide-translation", !showTranslation);
  root.toggleAttribute("data-hide-dalil", !showDalil);
  if (gender === "all") root.removeAttribute("data-gender");
  else root.setAttribute("data-gender", gender);

  const metaColor = THEME_META_COLOR[safeNoor][resolved];
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", metaColor);
};
