import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
} from "@expo-google-fonts/ibm-plex-sans-arabic";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  ScheherazadeNew_400Regular,
  ScheherazadeNew_700Bold,
} from "@expo-google-fonts/scheherazade-new";

export const fontAssets = {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  ScheherazadeNew_400Regular,
  ScheherazadeNew_700Bold,
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
};

export const fonts = {
  sans: "PlusJakartaSans_400Regular",
  sansMedium: "PlusJakartaSans_500Medium",
  sansSemi: "PlusJakartaSans_600SemiBold",
  sansBold: "PlusJakartaSans_700Bold",
  /** Scheherazade New — same as web `--font-scheherazade`. */
  arabic: "ScheherazadeNew_400Regular",
  arabicBold: "ScheherazadeNew_700Bold",
  arabicUi: "IBMPlexSansArabic_400Regular",
} as const;

/** Web `.text-arabic` ≈ 1.9rem; `.text-arabic-lg` ≈ 2.5rem (at scale 1). */
export const arabicSize = (scale: number, large = false) =>
  (large ? 40 : 30.4) * scale;

export const arabicLineHeight = (scale: number, large = false) =>
  arabicSize(scale, large) * (large ? 2.12 : 2.18);
