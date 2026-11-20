import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHydrated } from "../lib/hooks";
import { SPLASH_SESSION_KEY, useSettings } from "../lib/settings-store";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";
import { MarkIcon } from "./icons";
import { KiswahSurface } from "./kiswah-surface";

const HOLD_MS = 1550;
const REDUCED_HOLD_MS = 550;
const FADE_MS = 380;

/** Session-scoped: show splash once per app open when setting enabled. */
let splashShownThisLaunch = false;

export const SplashScreen = ({ onDone }: { onDone?: () => void }) => {
  const insets = useSafeAreaInsets();
  const hydrated = useHydrated();
  const showSplash = useSettings((s) => s.showSplash);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!hydrated || splashShownThisLaunch || !showSplash) return;
    setVisible(true);
  }, [hydrated, showSplash]);

  const dismiss = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    splashShownThisLaunch = true;
    timers.current.forEach(clearTimeout);
    setExiting(true);
    const id = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, FADE_MS);
    timers.current = [id];
  }, [onDone]);

  useEffect(() => {
    if (!visible) return;
    void AsyncStorage.setItem(SPLASH_SESSION_KEY, "1");
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (cancelled) return;
      const id = setTimeout(dismiss, reduced ? REDUCED_HOLD_MS : HOLD_MS);
      timers.current.push(id);
    });
    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
    };
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <Pressable
      onPress={dismiss}
      style={[styles.root, { opacity: exiting ? 0 : 1 }]}
    >
      <KiswahSurface style={StyleSheet.absoluteFill}>
        <View
          style={[
            styles.center,
            { paddingBottom: insets.bottom + 24, flex: 1 },
          ]}
        >
          <View style={styles.mark}>
            <MarkIcon size={40} color={colors.kiswahFg} />
          </View>
          <Text style={styles.arabic}>لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ</Text>
          <Text style={styles.brand}>Teman Umrohku</Text>
          <Text style={styles.tagline}>Panduan manasik di saku</Text>
          <Text style={styles.skip}>Ketuk untuk lewati</Text>
        </View>
      </KiswahSurface>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  mark: {
    width: 80,
    height: 80,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(197,165,77,0.35)",
    backgroundColor: "rgba(21,22,24,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  arabic: {
    marginTop: 28,
    fontFamily: fonts.arabic,
    fontSize: 28,
    color: "rgba(197,165,77,0.9)",
    textAlign: "center",
    writingDirection: "rtl",
  },
  brand: {
    marginTop: 8,
    fontFamily: fonts.sansSemi,
    fontSize: 24,
    color: colors.kiswahFg,
  },
  tagline: { marginTop: 4, fontSize: 13, color: colors.kiswahMuted },
  skip: {
    position: "absolute",
    bottom: 40,
    fontSize: 12,
    color: "rgba(166,170,176,0.6)",
  },
});
