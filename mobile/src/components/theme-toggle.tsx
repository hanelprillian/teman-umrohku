import { Pressable, StyleSheet } from "react-native";
import { useHydrated } from "../lib/hooks";
import { useSettings } from "../lib/settings-store";
import { useTheme } from "../theme/ThemeContext";
import { MoonIcon, SunIcon } from "./icons";

export const ThemeToggle = () => {
  const hydrated = useHydrated();
  const setTheme = useSettings((s) => s.setTheme);
  const { colors: c, resolved } = useTheme();

  if (!hydrated) return null;

  const next = resolved === "dark" ? "light" : "dark";

  return (
    <Pressable
      onPress={() => setTheme(next)}
      accessibilityLabel={
        resolved === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"
      }
      style={[
        styles.btn,
        { borderColor: c.border, backgroundColor: c.surface },
      ]}
    >
      {resolved === "dark" ? (
        <SunIcon size={20} color={c.gold} />
      ) : (
        <MoonIcon size={20} color={c.muted} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
