import { Pressable, StyleSheet, View } from "react-native";
import { useSettings } from "../lib/settings-store";
import { useThemeColors } from "../theme/ThemeContext";
import { ChevronDownIcon, ChevronUpIcon, LockIcon, UnlockIcon } from "./icons";

export const LockToggle = () => {
  const c = useThemeColors();
  const scrollLock = useSettings((s) => s.scrollLock);
  const setScrollLock = useSettings((s) => s.setScrollLock);
  const setImmersive = useSettings((s) => s.setImmersive);

  return (
    <Pressable
      accessibilityLabel={scrollLock ? "Buka kunci geser" : "Kunci geser, pakai tombol"}
      onPress={() => {
        const next = !scrollLock;
        setScrollLock(next);
        if (next) setImmersive(true);
      }}
      style={[
        styles.lockBtn,
        {
          borderColor: scrollLock ? c.gold : c.border,
          backgroundColor: scrollLock ? c.goldSoft : c.surface,
        },
      ]}
    >
      {scrollLock ? (
        <LockIcon size={20} color={c.gold} />
      ) : (
        <UnlockIcon size={20} color={c.muted} />
      )}
    </Pressable>
  );
};

/**
 * Web ThumbPad: circular 64px, gold-soft when paging up, primary when paging down.
 * "Geser" label removed — web only shows chevrons.
 */
export const ThumbPad = ({
  canPrev,
  canNext,
  onPrev,
  onNext,
  atTop = true,
  atBottom = true,
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  atTop?: boolean;
  atBottom?: boolean;
}) => {
  const c = useThemeColors();
  const hand = useSettings((s) => s.hand);
  const pagesUp = atTop;
  const pagesDown = atBottom;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.pad, hand === "left" ? { left: 16 } : { right: 16 }]}
    >
      <Pressable
        style={[
          styles.padBtn,
          pagesUp
            ? {
                borderColor: "rgba(156,126,44,0.5)",
                backgroundColor: c.goldSoft,
              }
            : {
                borderColor: c.border,
                backgroundColor: c.surface,
              },
          pagesUp && !canPrev && styles.padDisabled,
        ]}
        disabled={pagesUp && !canPrev}
        onPress={onPrev}
        accessibilityLabel={pagesUp ? "Slide sebelumnya" : "Gulir ke atas"}
      >
        <ChevronUpIcon
          size={28}
          color={pagesUp ? c.gold : c.foreground}
        />
      </Pressable>
      <Pressable
        style={[
          styles.padBtn,
          pagesDown
            ? { borderColor: c.primary, backgroundColor: c.primary }
            : { borderColor: c.border, backgroundColor: c.surface },
          pagesDown && !canNext && styles.padDisabled,
        ]}
        disabled={pagesDown && !canNext}
        onPress={onNext}
        accessibilityLabel={pagesDown ? "Slide berikutnya" : "Gulir ke bawah"}
      >
        <ChevronDownIcon
          size={28}
          color={pagesDown ? c.primaryFg : c.foreground}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  lockBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pad: {
    position: "absolute",
    bottom: 120,
    zIndex: 30,
    gap: 12,
  },
  padBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#141412",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  padDisabled: { opacity: 0.3 },
});
