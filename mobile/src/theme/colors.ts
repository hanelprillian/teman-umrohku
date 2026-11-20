/** Nusuk palette — mirrored from web `globals.css` light theme. */
export const colors = {
  background: "#f8f7f4",
  surface: "#ffffff",
  surfaceMuted: "#f1efe9",
  foreground: "#1b1d20",
  muted: "#606770",
  border: "#e7e3d9",
  gold: "#9c7e2c",
  goldBright: "#c5a54d",
  goldSoft: "#f6f0df",
  kiswah: "#151618",
  kiswahElevated: "#202226",
  kiswahFg: "#f7f5ef",
  kiswahMuted: "#a6aab0",
  /** Light mode primary = Kiswah obsidian (NOT gold). */
  primary: "#1a1c1f",
  primaryStrong: "#0e1012",
  primaryFg: "#faf9f5",
  onGold: "#14130f",
} as const;

export const darkColors = {
  background: "#0d0e10",
  surface: "#16171a",
  surfaceMuted: "#202226",
  foreground: "#f4f2ec",
  /** Slightly brighter than web so secondary copy stays readable on RN. */
  muted: "#aeb3bc",
  border: "#26282d",
  gold: "#d4b55f",
  goldBright: "#e3c878",
  goldSoft: "#252014",
  kiswah: "#16171a",
  kiswahElevated: "#202226",
  kiswahFg: "#f5f3ed",
  kiswahMuted: "#b0b4ba",
  primary: "#d4b55f",
  primaryStrong: "#e3c878",
  primaryFg: "#13110c",
  onGold: "#14130f",
} as const;

export type ThemeColors = typeof colors;

/** Web `max-w-xl` — keep immersive/home content phone-width on wide web preview. */
export const contentMaxWidth = 576;
