import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
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
  CounterFocus,
  CounterPanel,
  CounterTapButton,
  type LapToast,
  UndoToast,
  useCounterFocus,
} from "../components/counter";
import { DalilList } from "../components/dalil";
import { ImmersiveRunner } from "../components/immersive-runner";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookIcon,
  CheckIcon,
  UndoIcon,
} from "../components/icons";
import { sessions as allSessions } from "../content/sessions";
import type { Session } from "../content/types";
import { useHydrated } from "../lib/hooks";
import { useProgress } from "../lib/progress-store";
import { useSettings } from "../lib/settings-store";
import type { RootStackParamList } from "../navigation/types";
import { contentMaxWidth, type ThemeColors } from "../theme/colors";
import { arabicLineHeight, arabicSize, fonts } from "../theme/fonts";
import { useThemeColors } from "../theme/ThemeContext";
import { setNavPending } from "../components/nav-pending-toast";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type R = RouteProp<RootStackParamList, "Session">;

const CompletedView = ({
  session,
  nextSession,
  hasLaterProgress,
  onReview,
  onRepeatThis,
  onRepeatFromHere,
}: {
  session: Session;
  nextSession?: Pick<Session, "id" | "title">;
  hasLaterProgress: boolean;
  onReview: () => void;
  onRepeatThis: () => void;
  onRepeatFromHere: () => void;
}) => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [confirmRepeat, setConfirmRepeat] = useState(false);
  const c = useThemeColors();
  const styles = useMemo(() => createSessionStyles(c), [c]);

  const go = (fn: () => void) => {
    setNavPending(true);
    fn();
    setTimeout(() => setNavPending(false), 420);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        paddingTop: Math.max(insets.top, 12) + 24,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 24,
        gap: 24,
        alignItems: "center",
        maxWidth: contentMaxWidth,
        width: "100%",
        alignSelf: "center",
      }}
      style={{ flex: 1, backgroundColor: c.background }}
    >
      <View style={styles.doneIcon}>
        <CheckIcon size={36} color={c.gold} />
      </View>
      <View style={{ alignItems: "center" }}>
        <View style={styles.doneBadge}>
          <Text style={{ color: c.gold, fontSize: 12, fontFamily: fonts.sansMedium }}>
            Sesi selesai
          </Text>
        </View>
        <Text style={styles.doneTitle}>{session.title}</Text>
        <Text style={styles.mutedCenter}>
          Alhamdulillah. Semoga Allah menerima ibadahmu.
        </Text>
      </View>

      <View style={{ width: "100%", gap: 12 }}>
        {nextSession ? (
          <Pressable
            style={styles.primaryBtn}
            onPress={() =>
              go(() => navigation.replace("Session", { id: nextSession.id }))
            }
          >
            <Text style={styles.primaryBtnText}>
              Lanjut: {nextSession.title}
            </Text>
            <ArrowRightIcon size={20} color={c.primaryFg} />
          </Pressable>
        ) : (
          <Pressable
            style={styles.primaryBtn}
            onPress={() => go(() => navigation.navigate("Home"))}
          >
            <Text style={styles.primaryBtnText}>Kembali ke beranda</Text>
          </Pressable>
        )}

        <Pressable style={styles.secondaryBtn} onPress={onReview}>
          <BookIcon size={16} color={c.gold} />
          <Text style={styles.secondaryBtnText}>
            Lihat lagi (tanpa reset)
          </Text>
        </Pressable>

        {confirmRepeat ? (
          <View style={styles.confirmBox}>
            <Text style={styles.sessionTitle}>
              Sesi setelah {session.title} sudah ada progresnya.
            </Text>
            <Text style={styles.muted}>
              Pilih mau ulangi sesi ini saja, atau reset dari sini sampai
              akhir.
            </Text>
            <Pressable style={styles.secondaryBtn} onPress={onRepeatThis}>
              <Text style={styles.secondaryBtnText}>
                Ulangi {session.title} saja
              </Text>
            </Pressable>
            <Pressable
              style={[styles.secondaryBtn, { backgroundColor: c.goldSoft }]}
              onPress={onRepeatFromHere}
            >
              <Text style={[styles.secondaryBtnText, { color: c.gold }]}>
                Reset dari {session.title} sampai akhir
              </Text>
            </Pressable>
            <Pressable onPress={() => setConfirmRepeat(false)}>
              <Text style={[styles.muted, { textAlign: "center" }]}>Batal</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.ghostBtn}
            onPress={() => {
              if (hasLaterProgress) setConfirmRepeat(true);
              else onRepeatThis();
            }}
          >
            <UndoIcon size={16} color={c.muted} />
            <Text style={[styles.secondaryBtnText, { color: c.muted }]}>
              Ulangi sesi ini
            </Text>
          </Pressable>
        )}

        {nextSession && (
          <Pressable onPress={() => go(() => navigation.navigate("Home"))}>
            <Text style={styles.linkHome}>Ke beranda</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};

const StandardRunner = ({
  session,
  onComplete,
  reviewing = false,
}: {
  session: Session;
  onComplete?: () => void;
  reviewing?: boolean;
}) => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const progress = useProgress((s) => s.sessions[session.id]);
  const setStep = useProgress((s) => s.setStep);
  const setCount = useProgress((s) => s.setCount);
  const completeSession = useProgress((s) => s.completeSession);
  const showLatin = useSettings((s) => s.showLatin);
  const showTranslation = useSettings((s) => s.showTranslation);
  const showDalil = useSettings((s) => s.showDalil);
  const gender = useSettings((s) => s.gender);
  const arabicScale = useSettings((s) => s.arabicScale);
  const fontScale = useSettings((s) => s.fontScale);
  const c = useThemeColors();
  const styles = useMemo(() => createSessionStyles(c), [c]);

  const totalSteps = session.steps.length;
  const stepIndex = Math.min(progress?.stepIndex ?? 0, totalSteps - 1);
  const step = session.steps[stepIndex];
  const count = progress?.counts[step.id] ?? 0;
  const laps = progress?.laps?.[step.id] ?? [];
  const counterDone = !step.counter || count >= step.counter.total;
  const isLastStep = stepIndex === totalSteps - 1;
  const [lapToast, setLapToast] = useState<LapToast | null>(null);
  const focus = useCounterFocus(step.counter ? step.id : undefined, !counterDone);

  const goNext = () => {
    if (isLastStep) {
      if (onComplete) onComplete();
      else completeSession(session.id);
    } else setStep(session.id, stepIndex + 1);
  };

  const goBack = () => setStep(session.id, Math.max(0, stepIndex - 1));

  const recordLap = () => {
    setCount(session.id, step.id, count + 1);
    setLapToast({ id: Date.now(), stepId: step.id, count: count + 1 });
  };

  const tips = (step.tips ?? []).filter(
    (t) => !t.audience || gender === "all" || t.audience === gender,
  );

  const toast = lapToast && step.counter && (
    <UndoToast
      key={lapToast.id}
      message={`${step.counter.unit} ${lapToast.count} tercatat`}
      onUndo={() => {
        setCount(session.id, lapToast.stepId, lapToast.count - 1);
        setLapToast(null);
      }}
      onDismiss={() => setLapToast(null)}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 12) + 10,
            borderBottomColor: c.border,
            backgroundColor: c.background,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            setNavPending(true);
            navigation.navigate("Home");
            setTimeout(() => setNavPending(false), 420);
          }}
          style={styles.backBtn}
          accessibilityLabel="Kembali"
        >
          <ArrowLeftIcon size={22} color={c.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{session.title}</Text>
          <Text style={styles.muted}>
            Langkah {stepIndex + 1} / {totalSteps}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 140 + insets.bottom,
          gap: 20,
          maxWidth: contentMaxWidth,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <Text style={[styles.stepTitle, { fontSize: 22 * fontScale }]}>
          {step.title}
          {step.optional ? " (opsional)" : ""}
        </Text>

        {step.counter && (
          <CounterPanel
            counter={step.counter}
            count={count}
            laps={laps}
            onUndo={() => setCount(session.id, step.id, Math.max(0, count - 1))}
            onExpand={focus.expand}
          />
        )}

        {step.instructions.map((line) => (
          <Text key={line} style={[styles.body, { fontSize: 15 * fontScale }]}>
            • {line}
          </Text>
        ))}

        {tips.map((tip) => (
          <Text
            key={tip.text}
            style={[
              styles.tip,
              tip.warning && { color: c.gold },
              { fontSize: 13 * fontScale },
            ]}
          >
            {tip.text}
          </Text>
        ))}

        {(step.duas ?? []).map((dua) => (
          <View key={dua.id} style={styles.duaCard}>
            {dua.title ? (
              <Text style={styles.duaTitle}>{dua.title}</Text>
            ) : null}
            <Text
              style={[
                styles.arabic,
                {
                  fontFamily: fonts.arabic,
                  fontSize: arabicSize(arabicScale),
                  lineHeight: arabicLineHeight(arabicScale),
                },
              ]}
            >
              {dua.arabic}
            </Text>
            {showLatin && (
              <Text style={[styles.latin, { fontSize: 14 * fontScale }]}>
                {dua.latin}
              </Text>
            )}
            {showTranslation && (
              <Text style={[styles.muted, { fontSize: 14 * fontScale }]}>
                {dua.translation}
              </Text>
            )}
            {dua.repeat ? (
              <Text style={styles.repeat}>{dua.repeat}</Text>
            ) : null}
            {showDalil && dua.dalil.length > 0 && (
              <DalilList items={dua.dalil} />
            )}
          </View>
        ))}

        {showDalil && step.dalil && step.dalil.length > 0 && (
          <DalilList items={step.dalil} />
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        {!focus.open && toast}
        {step.counter && !counterDone ? (
          <CounterTapButton
            counter={step.counter}
            count={count}
            onTap={recordLap}
          />
        ) : (
          <View style={{ flexDirection: "row", gap: 12 }}>
            {stepIndex > 0 && (
              <Pressable style={styles.navSide} onPress={goBack}>
                <ArrowLeftIcon size={24} color={c.foreground} />
              </Pressable>
            )}
            {step.optional && (
              <Pressable style={styles.navSkip} onPress={goNext}>
                <Text style={{ fontWeight: "600", color: c.muted }}>
                  Lewati
                </Text>
              </Pressable>
            )}
            <Pressable style={[styles.primaryBtn, { flex: 1 }]} onPress={goNext}>
              <Text style={styles.primaryBtnText}>
                {isLastStep
                  ? reviewing
                    ? "Selesai baca ulang"
                    : "Selesai sesi"
                  : "Lanjut"}
              </Text>
              {isLastStep ? (
                <CheckIcon size={20} color={c.primaryFg} />
              ) : (
                <ArrowRightIcon size={20} color={c.primaryFg} />
              )}
            </Pressable>
          </View>
        )}
      </View>

      {focus.open && step.counter && (
        <CounterFocus
          title={`${session.title} · ${step.title}`}
          counter={step.counter}
          count={count}
          laps={laps}
          onTap={recordLap}
          onClose={focus.close}
          toast={toast}
        />
      )}
    </View>
  );
};

export const SessionScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();
  const hydrated = useHydrated();
  const immersive = useSettings((s) => s.immersive);
  const session = allSessions.find((s) => s.id === route.params.id);
  const allProgress = useProgress((s) => s.sessions);
  const setStep = useProgress((s) => s.setStep);
  const resetSession = useProgress((s) => s.resetSession);
  const resetFromSession = useProgress((s) => s.resetFromSession);
  const [reviewing, setReviewing] = useState(false);
  const c = useThemeColors();
  const styles = useMemo(() => createSessionStyles(c), [c]);

  if (!session) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <Text style={{ color: c.foreground }}>Sesi tidak ditemukan</Text>
      </View>
    );
  }

  if (!hydrated) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <View style={styles.skeleton} />
      </View>
    );
  }

  const sessionIdx = allSessions.findIndex((s) => s.id === session.id);
  const nextSession = allSessions[sessionIdx + 1];
  const hasLaterProgress =
    sessionIdx !== -1 &&
    allSessions.slice(sessionIdx + 1).some((s) => Boolean(allProgress[s.id]));
  const completed = allProgress[session.id]?.completed;

  if (completed && !reviewing) {
    return (
      <CompletedView
        session={session}
        nextSession={nextSession}
        hasLaterProgress={hasLaterProgress}
        onReview={() => {
          setStep(session.id, 0, 0);
          setReviewing(true);
        }}
        onRepeatThis={() => resetSession(session.id)}
        onRepeatFromHere={() => resetFromSession(session.id)}
      />
    );
  }

  const finishReview = reviewing ? () => setReviewing(false) : undefined;

  if (immersive) {
    return (
      <ImmersiveRunner
        session={session}
        reviewing={reviewing}
        onComplete={finishReview}
        onBack={() => {
          setNavPending(true);
          navigation.navigate("Home");
          setTimeout(() => setNavPending(false), 420);
        }}
      />
    );
  }

  return (
    <StandardRunner
      session={session}
      reviewing={reviewing}
      onComplete={finishReview}
    />
  );
};

const createSessionStyles = (c: ThemeColors) =>
  StyleSheet.create({
    centered: { flex: 1, alignItems: "center", justifyContent: "center" },
    skeleton: {
      width: "80%",
      height: 160,
      borderRadius: 16,
      backgroundColor: c.surfaceMuted,
    },
    doneIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: "rgba(156,126,44,0.25)",
      backgroundColor: c.goldSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    doneBadge: {
      borderRadius: 999,
      backgroundColor: c.goldSoft,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    doneTitle: {
      marginTop: 12,
      fontSize: 28,
      fontFamily: fonts.sansSemi,
      color: c.foreground,
      textAlign: "center",
    },
    mutedCenter: {
      marginTop: 8,
      fontSize: 15,
      color: c.muted,
      textAlign: "center",
    },
    muted: { fontSize: 13, color: c.muted, lineHeight: 20 },
    primaryBtn: {
      minHeight: 56,
      borderRadius: 16,
      backgroundColor: c.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 20,
    },
    primaryBtnText: {
      fontSize: 16,
      fontFamily: fonts.sansBold,
      color: c.primaryFg,
    },
    secondaryBtn: {
      minHeight: 48,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 16,
    },
    secondaryBtnText: {
      fontSize: 14,
      fontFamily: fonts.sansMedium,
      color: c.foreground,
    },
    ghostBtn: {
      minHeight: 48,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.background,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    confirmBox: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      padding: 16,
      gap: 10,
    },
    sessionTitle: {
      fontSize: 14,
      fontFamily: fonts.sansSemi,
      color: c.foreground,
    },
    linkHome: {
      textAlign: "center",
      color: c.muted,
      textDecorationLine: "underline",
      paddingVertical: 8,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
    },
    backBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 16,
      fontFamily: fonts.sansSemi,
      color: c.foreground,
    },
    stepTitle: {
      fontFamily: fonts.sansBold,
      color: c.foreground,
    },
    body: { color: c.foreground, lineHeight: 22 },
    tip: { color: c.muted, lineHeight: 20 },
    duaCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      padding: 16,
      gap: 10,
    },
    duaTitle: { fontFamily: fonts.sansSemi, color: c.foreground },
    arabic: {
      textAlign: "right",
      color: c.foreground,
      writingDirection: "rtl",
    },
    latin: { color: c.muted, fontStyle: "italic" },
    repeat: { fontSize: 12, fontFamily: fonts.sansMedium, color: c.gold },
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderTopWidth: 1,
      borderTopColor: c.border,
      backgroundColor: c.background,
      paddingHorizontal: 16,
      paddingTop: 12,
      gap: 12,
    },
    navSide: {
      width: 64,
      minHeight: 64,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
    },
    navSkip: {
      minHeight: 64,
      paddingHorizontal: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
    },
  });
