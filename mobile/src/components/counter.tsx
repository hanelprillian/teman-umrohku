import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Audience, Counter, RoundHint } from "../content/types";
import { useNow } from "../lib/hooks";
import { useSettings } from "../lib/settings-store";
import { contentMaxWidth, colors as lightColors } from "../theme/colors";
import { useThemeColors } from "../theme/ThemeContext";
import { CheckIcon, ExpandIcon, UndoIcon } from "./icons";
import { KiswahSurface } from "./kiswah-surface";

/** Fallback for StyleSheet static keys (kiswah panel stays dark). */
const colors = lightColors;

const TAP_LOCK_MS = 2000;
const MOUNT_GUARD_MS = 700;
const UNDO_TOAST_MS = 5000;

const timeFormat = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
});
const formatTime = (time: number) => (time ? timeFormat.format(time) : "—");
const formatMinutes = (ms: number) => {
  const minutes = Math.floor(ms / 60_000);
  return minutes < 1 ? "<1 mnt" : `${minutes} mnt`;
};

const currentRound = (counter: Counter, count: number) =>
  counter.rounds[Math.min(count, counter.total - 1)];

export const useCounterFocus = (
  stepId: string | undefined,
  pending: boolean,
) => {
  const autoFocusCounter = useSettings((s) => s.autoFocusCounter);
  const [manual, setManual] = useState(false);
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);

  return {
    open:
      stepId !== undefined &&
      (manual || (autoFocusCounter && pending && dismissedFor !== stepId)),
    expand: () => setManual(true),
    close: () => {
      setManual(false);
      setDismissedFor(stepId ?? null);
    },
  };
};

const audienceLabel: Record<Audience, string> = {
  pria: "Pria",
  wanita: "Wanita",
};

const RoundHints = ({
  hints,
  muted = false,
}: {
  hints?: RoundHint[];
  muted?: boolean;
}) => {
  const c = useThemeColors();
  const gender = useSettings((s) => s.gender);
  if (!hints?.length) return null;
  const visible = hints.filter(
    (h) => !h.audience || gender === "all" || h.audience === gender,
  );
  if (!visible.length) return null;
  return (
    <View>
      {visible.map((hint) => (
        <Text
          key={`${hint.audience}-${hint.text}`}
          style={[
            styles.hint,
            { color: muted ? colors.kiswahMuted : c.muted },
          ]}
        >
          {hint.audience ? `${audienceLabel[hint.audience]}: ` : ""}
          {hint.text}
        </Text>
      ))}
    </View>
  );
};

const RoundDots = ({
  counter,
  count,
  large = false,
  onKiswah = false,
}: {
  counter: Counter;
  count: number;
  large?: boolean;
  onKiswah?: boolean;
}) => (
  <View style={styles.dotsRow}>
    {counter.rounds.map((round, index) => {
      const isDone = index < count;
      const isCurrent = index === count;
      return (
        <View
          key={`${round.label}-${index}`}
          style={[
            styles.dot,
            large && styles.dotLarge,
            isDone && (onKiswah ? styles.dotDoneKiswah : styles.dotDone),
            isCurrent && !isDone && (onKiswah ? styles.dotCurrentKiswah : styles.dotCurrent),
            !isDone && !isCurrent && (onKiswah ? styles.dotIdleKiswah : styles.dotIdle),
          ]}
        >
          {isDone ? (
            <CheckIcon
              size={large ? 20 : 14}
              color={onKiswah ? colors.onGold : "#fff"}
            />
          ) : (
            <Text
              style={[
                styles.dotText,
                large && { fontSize: 16 },
                {
                  color: isCurrent
                    ? onKiswah
                      ? colors.goldBright
                      : colors.gold
                    : onKiswah
                      ? colors.kiswahMuted
                      : colors.muted,
                },
              ]}
            >
              {index + 1}
            </Text>
          )}
        </View>
      );
    })}
  </View>
);

const LastLap = ({
  laps,
  onKiswah = false,
}: {
  laps: number[];
  onKiswah?: boolean;
}) => {
  const now = useNow(30_000);
  const last = laps.at(-1);
  if (!last) return null;
  return (
    <Text style={{ fontSize: 12, color: onKiswah ? colors.kiswahMuted : colors.muted }}>
      Terakhir tercatat{" "}
      <Text
        style={{
          fontWeight: "600",
          color: onKiswah ? colors.kiswahFg : colors.foreground,
        }}
      >
        {formatTime(last)}
      </Text>
      {" · "}
      {formatMinutes(now - last)} lalu
    </Text>
  );
};

export const CounterPanel = ({
  counter,
  count,
  laps,
  onUndo,
  onExpand,
}: {
  counter: Counter;
  count: number;
  laps: number[];
  onUndo: () => void;
  onExpand: () => void;
}) => {
  const done = count >= counter.total;
  const current = currentRound(counter, count);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <KiswahSurface style={styles.panel}>
      <View style={styles.panelInner}>
        <View style={styles.panelTop}>
          <View>
            <Text style={styles.panelCount}>
              {count}
              <Text style={styles.panelTotal}>/{counter.total}</Text>
            </Text>
            <Text style={styles.panelUnit}>{counter.unit} selesai</Text>
          </View>
          {count > 0 && (
            <Pressable style={styles.undoChip} onPress={onUndo}>
              <UndoIcon size={16} color={colors.kiswahFg} />
              <Text style={styles.undoChipText}>Batalkan 1</Text>
            </Pressable>
          )}
        </View>

        <View style={{ marginTop: 20 }}>
          <RoundDots counter={counter} count={count} onKiswah />
        </View>

        <View style={styles.nowBox}>
          {done ? (
            <Text style={styles.nowDone}>
              Alhamdulillah, {counter.total} {counter.unit} selesai
            </Text>
          ) : (
            <>
              <Text style={styles.nowLabel}>Sekarang</Text>
              <Text style={styles.nowTitle}>{current.label}</Text>
              <RoundHints hints={current.hints} muted />
            </>
          )}
        </View>

        {laps.length > 0 && (
          <Pressable
            onPress={() => setShowHistory((v) => !v)}
            style={{ marginTop: 16 }}
          >
            <LastLap laps={laps} onKiswah />
            {!showHistory && <Text style={styles.historyLink}>Riwayat</Text>}
          </Pressable>
        )}
        {showHistory && (
          <View style={styles.historyBox}>
            {laps.map((time, index) => {
              const previous = laps[index - 1];
              return (
                <View key={index} style={styles.historyRow}>
                  <Text
                    style={{
                      color: colors.kiswahMuted,
                      textTransform: "capitalize",
                    }}
                  >
                    {counter.unit} {index + 1}
                  </Text>
                  <Text style={{ color: colors.kiswahFg }}>
                    {formatTime(time)}
                    {previous > 0 && time > 0
                      ? ` (${formatMinutes(time - previous)})`
                      : ""}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {!done && (
          <Pressable style={styles.expandBtn} onPress={onExpand}>
            <ExpandIcon size={16} color={colors.goldBright} />
            <Text style={styles.expandText}>Mode hitung layar penuh</Text>
          </Pressable>
        )}
      </View>
    </KiswahSurface>
  );
};

/** Sticky strip under header — same as web CounterStrip (Tawaf / Sa'i). */
export const CounterStrip = ({
  counter,
  count,
  visible,
  onSelect,
}: {
  counter: Counter;
  count: number;
  visible: boolean;
  onSelect: () => void;
}) => {
  const c = useThemeColors();
  if (!visible) return null;
  const done = count >= counter.total;
  const current = currentRound(counter, count);

  return (
    <Pressable
      style={[
        styles.strip,
        {
          borderBottomColor: c.border,
          backgroundColor: c.surface,
        },
      ]}
      onPress={onSelect}
    >
      <View style={styles.stripInner}>
        <Text style={[styles.stripCount, { color: c.gold }]}>
          {count}
          <Text style={[styles.stripTotal, { color: c.muted }]}>
            /{counter.total}
          </Text>
        </Text>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={[styles.stripLabel, { color: c.foreground }]}
            numberOfLines={1}
          >
            {done ? `${counter.total} ${counter.unit} selesai` : current.label}
          </Text>
          {!done && <RoundHints hints={current.hints} />}
        </View>
        <View style={styles.stripDots}>
          {counter.rounds.map((round, index) => (
            <View
              key={`${round.label}-${index}`}
              style={[
                styles.stripDot,
                { backgroundColor: c.border },
                index < count
                  ? { backgroundColor: c.gold }
                  : index === count
                    ? {
                        borderWidth: 2,
                        borderColor: c.gold,
                        backgroundColor: "transparent",
                      }
                    : null,
              ]}
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
};

export const CounterTapButton = ({
  counter,
  count,
  onTap,
  large = false,
}: {
  counter: Counter;
  count: number;
  onTap: () => void;
  large?: boolean;
}) => {
  const [locked, setLocked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
    return () => clearTimeout(timer.current);
  }, []);

  const handleTap = () => {
    if (locked || Date.now() - mountedAt.current < MOUNT_GUARD_MS) return;
    onTap();
    try {
      Vibration.vibrate(40);
    } catch {
      // web / unsupported
    }
    setLocked(true);
    timer.current = setTimeout(() => setLocked(false), TAP_LOCK_MS);
  };

  const c = useThemeColors();

  return (
    <Pressable
      onPress={handleTap}
      disabled={locked}
      style={[
        styles.tapBtn,
        large && styles.tapBtnLarge,
        locked
          ? {
              backgroundColor: c.goldSoft,
              borderWidth: 1,
              borderColor: "rgba(156,126,44,0.3)",
            }
          : { backgroundColor: c.primary },
      ]}
    >
      {locked ? (
        <View style={styles.tapLockedRow}>
          <CheckIcon size={large ? 32 : 20} color={c.gold} />
          <Text
            style={[
              styles.tapLockedText,
              { color: c.gold },
              large && { fontSize: 28 },
            ]}
          >
            Tercatat
          </Text>
        </View>
      ) : (
        <>
          <Text
            style={[
              styles.tapMain,
              { color: c.primaryFg },
              large && { fontSize: 28 },
            ]}
          >
            Selesai {counter.unit} ke-{count + 1}
          </Text>
          <Text
            style={[
              styles.tapSub,
              { color: c.primaryFg },
              large && { fontSize: 15, marginTop: 6 },
            ]}
          >
            Tekan saat: {counter.tapLabel}
          </Text>
        </>
      )}
    </Pressable>
  );
};

export interface LapToast {
  id: number;
  stepId: string;
  count: number;
}

export const UndoToast = ({
  message,
  onUndo,
  onDismiss,
}: {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}) => {
  const dismiss = useRef(onDismiss);
  useEffect(() => {
    dismiss.current = onDismiss;
  });
  useEffect(() => {
    const id = setTimeout(() => dismiss.current(), UNDO_TOAST_MS);
    return () => clearTimeout(id);
  }, []);

  return (
    <View style={styles.toast}>
      <CheckIcon size={16} color={colors.goldBright} />
      <Text style={styles.toastMsg}>{message}</Text>
      <Pressable style={styles.toastUndo} onPress={onUndo}>
        <UndoIcon size={16} color={colors.goldBright} />
        <Text style={styles.toastUndoText}>Batalkan</Text>
      </Pressable>
    </View>
  );
};

export const CounterFocus = ({
  title,
  counter,
  count,
  laps,
  onTap,
  onClose,
  toast,
}: {
  title: string;
  counter: Counter;
  count: number;
  laps: number[];
  onTap: () => void;
  onClose: () => void;
  toast?: ReactNode;
}) => {
  const insets = useSafeAreaInsets();
  const done = count >= counter.total;
  const current = currentRound(counter, count);

  return (
    <Modal visible animationType="slide" presentationStyle="fullScreen">
      <View
        style={[
          styles.focusRoot,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.focusHeader}>
          <Text style={styles.focusTitle} numberOfLines={1}>
            {title}
          </Text>
          <Pressable style={styles.focusClose} onPress={onClose}>
            <Text style={styles.focusCloseText}>Tutup</Text>
          </Pressable>
        </View>

        <View style={styles.focusBody}>
          <Text style={styles.focusCount}>
            {count}
            <Text style={styles.focusTotal}>/{counter.total}</Text>
          </Text>
          <RoundDots counter={counter} count={count} large />
          {done ? (
            <Text style={styles.focusDone}>
              Alhamdulillah, {counter.total} {counter.unit} selesai
            </Text>
          ) : (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.focusRound}>{current.label}</Text>
              <RoundHints hints={current.hints} />
            </View>
          )}
          <LastLap laps={laps} />
        </View>

        <View style={styles.focusFooter}>
          {toast}
          {done ? (
            <Pressable style={styles.primaryBtn} onPress={onClose}>
              <Text style={styles.primaryBtnText}>Tutup & lanjutkan</Text>
            </Pressable>
          ) : (
            <CounterTapButton
              counter={counter}
              count={count}
              onTap={onTap}
              large
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  panel: {
    borderRadius: 24,
    overflow: "hidden",
  },
  panelInner: {
    padding: 20,
  },
  strip: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  stripInner: {
    maxWidth: contentMaxWidth,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  stripCount: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.gold,
    fontVariant: ["tabular-nums"],
  },
  stripTotal: { fontSize: 13, fontWeight: "500", color: colors.muted },
  stripLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.foreground,
  },
  stripDots: { flexDirection: "row", gap: 4 },
  stripDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  panelTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  panelCount: {
    fontSize: 48,
    fontWeight: "600",
    color: colors.goldBright,
    fontVariant: ["tabular-nums"],
  },
  panelTotal: { fontSize: 24, fontWeight: "500", color: colors.kiswahMuted },
  panelUnit: { marginTop: 4, fontSize: 12, fontWeight: "500", color: colors.kiswahMuted },
  undoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  undoChipText: { fontSize: 12, fontWeight: "500", color: colors.kiswahFg },
  dotsRow: { flexDirection: "row", justifyContent: "space-between", gap: 6 },
  dot: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  dotLarge: { minHeight: 44 },
  dotDone: { backgroundColor: colors.gold },
  dotDoneKiswah: { backgroundColor: colors.goldBright },
  dotCurrent: {
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft,
  },
  dotCurrentKiswah: {
    borderWidth: 2,
    borderColor: colors.goldBright,
    backgroundColor: "rgba(197,165,77,0.15)",
  },
  dotIdle: { borderWidth: 1, borderColor: colors.border },
  dotIdleKiswah: { borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },
  dotText: { fontSize: 13, fontWeight: "600" },
  nowBox: {
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(197,165,77,0.2)",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  nowLabel: { fontSize: 12, fontWeight: "500", color: "rgba(197,165,77,0.9)" },
  nowTitle: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: "600",
    color: colors.kiswahFg,
  },
  nowDone: { fontSize: 16, fontWeight: "600", color: colors.goldBright },
  hint: { fontSize: 13, color: colors.muted, marginTop: 2 },
  historyLink: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    color: colors.goldBright,
  },
  historyBox: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    gap: 6,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  expandBtn: {
    marginTop: 16,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  expandText: { fontSize: 13, fontWeight: "500", color: colors.kiswahFg },
  tapBtn: {
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tapBtnLarge: { minHeight: 180, borderRadius: 28, paddingVertical: 12 },
  tapBtnLocked: {
    backgroundColor: colors.goldSoft,
    borderWidth: 1,
    borderColor: "rgba(156,126,44,0.3)",
  },
  tapMain: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primaryFg,
    textAlign: "center",
  },
  /** Web: same `text-primary-foreground` + opacity-80 on dark primary. */
  tapSub: {
    marginTop: 2,
    fontSize: 12,
    color: colors.primaryFg,
    opacity: 0.8,
    textAlign: "center",
  },
  tapLockedRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  tapLockedText: { fontSize: 18, fontWeight: "600", color: colors.gold },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(197,165,77,0.25)",
    backgroundColor: colors.kiswah,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 8,
  },
  toastMsg: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: colors.kiswahFg,
  },
  toastUndo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    minHeight: 40,
  },
  toastUndoText: { fontSize: 13, fontWeight: "600", color: colors.goldBright },
  focusRoot: { flex: 1, backgroundColor: colors.background },
  focusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  focusTitle: { flex: 1, fontSize: 13, fontWeight: "500", color: colors.muted },
  focusClose: {
    minHeight: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  focusCloseText: { fontSize: 13, fontWeight: "500", color: colors.foreground },
  focusBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 24,
  },
  focusCount: {
    fontSize: 96,
    fontWeight: "600",
    color: colors.gold,
    fontVariant: ["tabular-nums"],
  },
  focusTotal: { fontSize: 40, fontWeight: "500", color: colors.muted },
  focusDone: { fontSize: 22, fontWeight: "600", color: colors.gold, textAlign: "center" },
  focusRound: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.foreground,
    textAlign: "center",
  },
  focusFooter: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  primaryBtn: {
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.primaryFg,
  },
});
