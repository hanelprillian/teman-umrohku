import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts } from "../theme/fonts";
import { useThemeColors } from "../theme/ThemeContext";

type Listener = (pending: boolean) => void;
const listeners = new Set<Listener>();

/** Call before/around navigation so the toast appears (web LinkPending equivalent). */
export const setNavPending = (pending: boolean) => {
  listeners.forEach((l) => l(pending));
};

export const useNavPending = () => {
  useEffect(() => {
    setNavPending(true);
    const id = setTimeout(() => setNavPending(false), 420);
    return () => {
      clearTimeout(id);
      setNavPending(false);
    };
  }, []);
};

/** Bottom toast while a screen transition is in flight. */
export const NavPendingToast = () => {
  const c = useThemeColors();
  const insets = useSafeAreaInsets();
  const [pending, setPending] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const listener: Listener = (next) => setPending(next);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: pending ? 1 : 0,
      duration: pending ? 120 : 180,
      useNativeDriver: true,
    }).start();
  }, [pending, opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          opacity,
          bottom: Math.max(insets.bottom, 12) + 12,
        },
      ]}
    >
      <View
        style={[
          styles.toast,
          { backgroundColor: c.kiswah, borderColor: "rgba(197,165,77,0.25)" },
        ]}
      >
        <ActivityIndicator size="small" color={c.goldBright} />
        <Text style={[styles.text, { color: c.kiswahFg }]}>Memuat…</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 200,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  text: { fontFamily: fonts.sansMedium, fontSize: 13 },
});
