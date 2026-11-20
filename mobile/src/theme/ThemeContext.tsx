import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import { useSettings, type Theme } from "../lib/settings-store";
import { colors, darkColors, type ThemeColors } from "./colors";

export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  colors: ThemeColors;
  resolved: ResolvedTheme;
  isDark: boolean;
  preference: Theme;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors,
  resolved: "light",
  isDark: false,
  preference: "system",
});

export const resolveTheme = (
  preference: Theme,
  system: ResolvedTheme | null | undefined,
): ResolvedTheme => {
  if (preference === "system") return system === "dark" ? "dark" : "light";
  return preference;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const preference = useSettings((s) => s.theme);
  const system = useColorScheme();
  const value = useMemo(() => {
    const resolved = resolveTheme(preference, system);
    return {
      preference,
      resolved,
      isDark: resolved === "dark",
      colors: (resolved === "dark" ? darkColors : colors) as ThemeColors,
    };
  }, [preference, system]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export const useThemeColors = () => useContext(ThemeContext).colors;
