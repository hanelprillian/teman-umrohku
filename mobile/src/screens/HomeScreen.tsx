import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowRightIcon,
  BookIcon,
  CheckIcon,
  ChevronRightIcon,
  InfoIcon,
  MarkIcon,
  SettingsIcon,
  ShieldIcon,
  UndoIcon,
} from "../components/icons";
import { KiswahSurface } from "../components/kiswah-surface";
import { setNavPending } from "../components/nav-pending-toast";
import { ThemeToggle } from "../components/theme-toggle";
import { sessions } from "../content/sessions";
import type { SessionId } from "../content/types";
import { useHydrated } from "../lib/hooks";
import { useProgress } from "../lib/progress-store";
import type { RootStackParamList } from "../navigation/types";
import { contentMaxWidth, type ThemeColors } from "../theme/colors";
import { fonts } from "../theme/fonts";
import { useThemeColors } from "../theme/ThemeContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const goNav = (fn: () => void) => {
  setNavPending(true);
  fn();
  setTimeout(() => setNavPending(false), 420);
};

const ContinueCard = ({ styles, c }: { styles: ReturnType<typeof createStyles>; c: ThemeColors }) => {
  const navigation = useNavigation<Nav>();
  const hydrated = useHydrated();
  const progress = useProgress((s) => s.sessions);
  const lastSessionId = useProgress((s) => s.lastSessionId);
  const resetAll = useProgress((s) => s.resetAll);
  const [confirmNew, setConfirmNew] = useState(false);

  if (!hydrated) return <View style={styles.skeleton} />;

  const completedCount = sessions.filter((s) => progress[s.id]?.completed).length;
  const pct = Math.round((completedCount / sessions.length) * 100);
  const lastSession = sessions.find((s) => s.id === lastSessionId);
  const target =
    lastSession && !progress[lastSession.id]?.completed
      ? lastSession
      : sessions.find((s) => !progress[s.id]?.completed);

  if (!target) {
    return (
      <KiswahSurface style={styles.kiswahCard}>
        <View style={styles.kiswahPad}>
          <View style={styles.badge}>
            <CheckIcon size={14} color={c.goldBright} />
            <Text style={styles.badgeText}>Umroh selesai</Text>
          </View>
          <Text style={styles.kiswahTitle}>
            Alhamdulillah, semua sesi selesai.
          </Text>
          <Text style={styles.kiswahSub}>
            Semoga Allah menerima ibadahmu dan menjadikannya umroh yang mabrur.
          </Text>
          <View style={styles.kiswahDivider}>
            {confirmNew ? (
              <View style={{ gap: 10 }}>
                <Text style={styles.kiswahSub}>
                  Reset semua 6 sesi dan mulai hitungan umroh baru dari awal?
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Pressable
                    style={[styles.goldBtn, { flex: 1 }]}
                    onPress={() => {
                      resetAll();
                      setConfirmNew(false);
                    }}
                  >
                    <Text style={styles.goldBtnText}>Ya, mulai baru</Text>
                  </Pressable>
                  <Pressable
                    style={styles.ghostBtn}
                    onPress={() => setConfirmNew(false)}
                  >
                    <Text style={styles.kiswahFg}>Batal</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                style={styles.ghostBtn}
                onPress={() => setConfirmNew(true)}
              >
                <UndoIcon size={16} color={c.goldBright} />
                <Text style={styles.kiswahFg}>Mulai umroh baru</Text>
              </Pressable>
            )}
          </View>
        </View>
      </KiswahSurface>
    );
  }

  const started = Boolean(progress[target.id]);
  const stepIndex = progress[target.id]?.stepIndex ?? 0;

  return (
    <Pressable
      onPress={() =>
        goNav(() => navigation.navigate("Session", { id: target.id }))
      }
    >
      <KiswahSurface style={styles.kiswahCard}>
        <View style={styles.kiswahPad}>
          <View style={styles.continueRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.badge}>
                <View style={styles.dot} />
                <Text style={styles.badgeText}>
                  {started ? "Sedang berjalan" : "Perjalanan umroh"}
                </Text>
              </View>
              <Text style={styles.kiswahTitle}>{target.title}</Text>
              <Text style={styles.kiswahSub}>
                {started
                  ? `Langkah ${stepIndex + 1} dari ${target.steps.length} · ${target.subtitle}`
                  : target.subtitle}
              </Text>
            </View>
            <View style={styles.arrowCircle}>
              <ArrowRightIcon size={20} color={c.onGold} />
            </View>
          </View>
          <View style={styles.kiswahDivider}>
            <View style={styles.progressMeta}>
              <Text style={styles.kiswahSub}>Progres manasik</Text>
              <Text style={[styles.kiswahFg, { fontSize: 12 }]}>
                {completedCount} dari {sessions.length} sesi
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${Math.max(pct, started ? 8 : 0)}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </KiswahSurface>
    </Pressable>
  );
};

const SessionMarker = ({
  id,
  index,
  styles,
  c,
}: {
  id: SessionId;
  index: number;
  styles: ReturnType<typeof createStyles>;
  c: ThemeColors;
}) => {
  const hydrated = useHydrated();
  const progress = useProgress((s) => s.sessions[id]);

  if (hydrated && progress?.completed) {
    return (
      <View style={[styles.marker, styles.markerDone]}>
        <CheckIcon size={16} color={c.onGold} />
      </View>
    );
  }
  if (hydrated && progress) {
    return (
      <View style={[styles.marker, styles.markerActive]}>
        <Text style={styles.markerActiveText}>{index + 1}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.marker, styles.markerIdle]}>
      <Text style={styles.markerIdleText}>{index + 1}</Text>
    </View>
  );
};

const SessionStatus = ({
  id,
  styles,
  c,
}: {
  id: SessionId;
  styles: ReturnType<typeof createStyles>;
  c: ThemeColors;
}) => {
  const hydrated = useHydrated();
  const progress = useProgress((s) => s.sessions[id]);
  if (!hydrated || !progress) return null;
  if (progress.completed) {
    return (
      <View style={styles.statusPill}>
        <Text style={styles.statusText}>Selesai</Text>
      </View>
    );
  }
  return (
    <View style={[styles.statusPill, styles.statusRunning]}>
      <Text style={[styles.statusText, { color: c.gold }]}>Berjalan</Text>
    </View>
  );
};

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const c = useThemeColors();
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{
        paddingTop: Math.max(insets.top, 12) + 16,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 20,
        maxWidth: contentMaxWidth,
        width: "100%",
        alignSelf: "center",
      }}
    >
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.markWrap}>
            <MarkIcon size={24} color={c.kiswahFg} />
          </View>
          <View>
            <Text style={styles.brandTitle}>Teman Umrohku</Text>
            <Text style={styles.brandSub}>Panduan manasik di saku</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <ThemeToggle />
          <Pressable
            style={styles.iconBtn}
            onPress={() => goNav(() => navigation.navigate("Settings"))}
            accessibilityLabel="Pengaturan"
          >
            <SettingsIcon size={20} color={c.muted} />
          </Pressable>
        </View>
      </View>

      <ContinueCard styles={styles} c={c} />

      <View style={{ marginTop: 32 }}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Urutan manasik</Text>
          <Text style={styles.brandSub}>{sessions.length} tahapan</Text>
        </View>
        <View style={styles.card}>
          {sessions.map((session, index) => (
            <Pressable
              key={session.id}
              style={[
                styles.sessionRow,
                index < sessions.length - 1 && styles.sessionRowBorder,
              ]}
              onPress={() =>
                goNav(() => navigation.navigate("Session", { id: session.id }))
              }
            >
              <SessionMarker id={session.id} index={index} styles={styles} c={c} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.sessionSub}>{session.subtitle}</Text>
              </View>
              <SessionStatus id={session.id} styles={styles} c={c} />
              <ChevronRightIcon size={16} color={c.muted} />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 32 }}>
        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
          Rujukan cepat
        </Text>
        <View style={styles.quickGrid}>
          <Pressable
            style={styles.quickTile}
            onPress={() => goNav(() => navigation.navigate("Doas"))}
          >
            <View style={styles.quickIcon}>
              <BookIcon size={20} color={c.gold} />
            </View>
            <Text style={styles.sessionTitle}>Kumpulan doa</Text>
            <Text style={styles.sessionSub}>Semua bacaan & pencarian</Text>
          </Pressable>
          <Pressable
            style={styles.quickTile}
            onPress={() => goNav(() => navigation.navigate("IhramRules"))}
          >
            <View style={styles.quickIcon}>
              <ShieldIcon size={20} color={c.gold} />
            </View>
            <Text style={styles.sessionTitle}>Larangan ihram</Text>
            <Text style={styles.sessionSub}>Aturan & fidyahnya</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.disclaimer}>
        <InfoIcon size={16} color={c.gold} />
        <Text style={styles.disclaimerText}>
          Disusun dari Al-Qur'an dan hadits beserta sumbernya, masih dalam
          peninjauan. Bila ragu, tanyakan kepada pembimbing rombonganmu.
        </Text>
      </View>
    </ScrollView>
  );
};

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    skeleton: {
      height: 176,
      borderRadius: 24,
      backgroundColor: c.surfaceMuted,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      gap: 12,
    },
    headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
    brand: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
    markWrap: {
      width: 44,
      height: 44,
      borderRadius: 16,
      backgroundColor: c.kiswah,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(197,165,77,0.3)",
    },
    brandTitle: {
      fontFamily: fonts.sansSemi,
      fontSize: 20,
      color: c.foreground,
      letterSpacing: -0.3,
    },
    brandSub: { fontSize: 12, color: c.muted, marginTop: 2 },
    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    kiswahCard: { borderRadius: 24, overflow: "hidden" },
    kiswahPad: { padding: 24 },
    badge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: "rgba(197,165,77,0.3)",
      backgroundColor: "rgba(197,165,77,0.12)",
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    badgeText: {
      fontFamily: fonts.sansMedium,
      fontSize: 12,
      color: c.goldBright,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: c.goldBright,
    },
    kiswahTitle: {
      marginTop: 16,
      fontFamily: fonts.sansSemi,
      fontSize: 26,
      color: c.kiswahFg,
      letterSpacing: -0.3,
    },
    kiswahSub: { marginTop: 6, fontSize: 13, color: c.kiswahMuted, lineHeight: 18 },
    kiswahFg: {
      color: c.kiswahFg,
      fontSize: 12,
      fontFamily: fonts.sansMedium,
    },
    kiswahDivider: {
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.1)",
    },
    continueRow: { flexDirection: "row", gap: 16 },
    arrowCircle: {
      marginTop: 4,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.goldBright,
      alignItems: "center",
      justifyContent: "center",
    },
    progressMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    barTrack: {
      height: 6,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.12)",
      overflow: "hidden",
    },
    barFill: {
      height: "100%",
      borderRadius: 999,
      backgroundColor: c.goldBright,
    },
    goldBtn: {
      minHeight: 40,
      borderRadius: 12,
      backgroundColor: c.goldBright,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
    },
    goldBtnText: {
      fontSize: 12,
      fontFamily: fonts.sansSemi,
      color: c.onGold,
    },
    ghostBtn: {
      minHeight: 40,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.15)",
      backgroundColor: "rgba(255,255,255,0.06)",
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    sectionHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    sectionTitle: {
      fontFamily: fonts.sansSemi,
      fontSize: 14,
      color: c.foreground,
    },
    card: {
      backgroundColor: c.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
      shadowColor: "#141412",
      shadowOpacity: 0.03,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
    sessionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    sessionRowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    sessionTitle: {
      fontFamily: fonts.sansSemi,
      fontSize: 16,
      color: c.foreground,
    },
    sessionSub: { marginTop: 2, fontSize: 13, color: c.muted, lineHeight: 18 },
    marker: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    markerDone: { backgroundColor: c.goldBright },
    markerActive: {
      borderWidth: 2,
      borderColor: c.gold,
      backgroundColor: c.goldSoft,
    },
    markerActiveText: {
      fontSize: 14,
      fontFamily: fonts.sansSemi,
      color: c.gold,
    },
    markerIdle: {
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceMuted,
    },
    markerIdleText: {
      fontSize: 14,
      fontFamily: fonts.sansMedium,
      color: c.muted,
    },
    statusPill: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceMuted,
      paddingHorizontal: 10,
      paddingVertical: 2,
    },
    statusRunning: {
      borderColor: "rgba(156,126,44,0.3)",
      backgroundColor: c.goldSoft,
    },
    statusText: {
      fontSize: 12,
      fontFamily: fonts.sansMedium,
      color: c.foreground,
    },
    quickGrid: { flexDirection: "row", gap: 12 },
    quickTile: {
      flex: 1,
      backgroundColor: c.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      gap: 8,
      shadowColor: "#141412",
      shadowOpacity: 0.03,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
    quickIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: c.goldSoft,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    disclaimer: {
      marginTop: 32,
      flexDirection: "row",
      gap: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    disclaimerText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 18,
      color: c.muted,
    },
  });
