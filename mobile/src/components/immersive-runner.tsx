import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Dua, Session, Step } from "../content/types";
import { useProgress } from "../lib/progress-store";
import { useSettings } from "../lib/settings-store";
import { colors, contentMaxWidth } from "../theme/colors";
import { arabicLineHeight, arabicSize, fonts } from "../theme/fonts";
import { useThemeColors } from "../theme/ThemeContext";
import {
  CounterFocus,
  CounterPanel,
  CounterStrip,
  CounterTapButton,
  type LapToast,
  UndoToast,
  useCounterFocus,
} from "./counter";
import { DalilList, StatusBadge } from "./dalil";
import { CheckIcon, ChevronUpIcon } from "./icons";
import { LockToggle, ThumbPad } from "./scroll-lock";

interface Slide {
  key: string;
  step: Step;
  stepIndex: number;
  slideIndex: number;
  dua?: Dua;
}

const buildSlides = (steps: Step[]): Slide[] =>
  steps.flatMap((step, stepIndex) => [
    { key: step.id, step, stepIndex, slideIndex: 0 },
    ...(step.duas ?? []).map((dua, duaIndex) => ({
      key: `${step.id}-${dua.id}`,
      step,
      stepIndex,
      slideIndex: duaIndex + 1,
      dua,
    })),
  ]);

const DuaSlideContent = ({ slide }: { slide: Slide & { dua: Dua } }) => {
  const { dua, step, slideIndex } = slide;
  const total = step.duas?.length ?? 1;
  const [firstDalil] = dua.dalil;
  const [dalilOpen, setDalilOpen] = useState(false);
  const c = useThemeColors();
  const showLatin = useSettings((s) => s.showLatin);
  const showTranslation = useSettings((s) => s.showTranslation);
  const showDalil = useSettings((s) => s.showDalil);
  const arabicScale = useSettings((s) => s.arabicScale);

  return (
    <View style={{ flex: 1, gap: 24, paddingVertical: 16, justifyContent: "center" }}>
      <View style={{ gap: 8 }}>
        <Text style={[styles.goldMeta, { color: c.gold }]}>
          {step.title}
          {total > 1 ? ` · Doa ${slideIndex} dari ${total}` : ""}
        </Text>
        {dua.title ? (
          <Text style={[styles.duaTitle, { color: c.foreground }]}>
            {dua.title}
          </Text>
        ) : null}
        {dua.repeat ? (
          <View style={[styles.repeatPill, { backgroundColor: c.goldSoft }]}>
            <Text style={[styles.repeatText, { color: c.gold }]}>
              {dua.repeat}
            </Text>
          </View>
        ) : null}
      </View>
      <Text
        style={[
          styles.arabic,
          {
            fontFamily: fonts.arabic,
            fontSize: arabicSize(arabicScale, true),
            lineHeight: arabicLineHeight(arabicScale, true),
            color: c.foreground,
          },
        ]}
      >
        {dua.arabic}
      </Text>
      {showLatin && (
        <Text style={[styles.latin, { color: c.gold }]}>{dua.latin}</Text>
      )}
      {showTranslation && (
        <Text style={[styles.translation, { color: c.muted }]}>
          “{dua.translation}”
        </Text>
      )}
      {showDalil && firstDalil && (
        <View
          style={[
            styles.dalilCard,
            { borderColor: c.border, backgroundColor: c.surface },
          ]}
        >
          <Pressable
            style={styles.dalilSummary}
            onPress={() => setDalilOpen((v) => !v)}
          >
            <Text style={[styles.dalilSource, { color: c.muted }]} numberOfLines={1}>
              {firstDalil.source}
              {dua.dalil.length > 1 ? ` +${dua.dalil.length - 1}` : ""}
            </Text>
            <StatusBadge status={firstDalil.status} />
          </Pressable>
          {dalilOpen && (
            <View style={[styles.dalilBody, { borderTopColor: c.border }]}>
              <DalilList items={dua.dalil} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const StepIntro = ({
  slide,
  totalSteps,
  count,
  laps,
  onUndo,
  onExpand,
}: {
  slide: Slide;
  totalSteps: number;
  count: number;
  laps: number[];
  onUndo: () => void;
  onExpand: () => void;
}) => {
  const c = useThemeColors();
  const { step } = slide;
  const gender = useSettings((s) => s.gender);
  const tips = (step.tips ?? []).filter(
    (t) => !t.audience || gender === "all" || t.audience === gender,
  );

  return (
    <View style={{ gap: 20 }}>
      <Text style={[styles.goldMeta, { color: c.gold }]}>
        Langkah {slide.stepIndex + 1} dari {totalSteps}
      </Text>
      <Text style={[styles.stepTitle, { color: c.foreground }]}>
        {step.title}
        {step.optional ? " (opsional)" : ""}
      </Text>
      {step.counter && (
        <CounterPanel
          counter={step.counter}
          count={count}
          laps={laps}
          onUndo={onUndo}
          onExpand={onExpand}
        />
      )}
      {step.instructions.map((line) => (
        <Text key={line} style={[styles.body, { color: c.foreground }]}>
          • {line}
        </Text>
      ))}
      {tips.map((tip) => (
        <Text
          key={tip.text}
          style={[styles.tip, { color: tip.warning ? c.gold : c.muted }]}
        >
          {tip.text}
        </Text>
      ))}
    </View>
  );
};

const SlideEnd = ({
  nextSlide,
  gatedBy,
  reviewing,
  onNext,
  onComplete,
}: {
  nextSlide?: Slide;
  gatedBy?: Step;
  reviewing?: boolean;
  onNext: () => void;
  onComplete: () => void;
}) => {
  const c = useThemeColors();
  if (nextSlide) {
    const label = nextSlide.dua
      ? `Doa: ${nextSlide.dua.title ?? nextSlide.step.title}`
      : `Langkah ${nextSlide.stepIndex + 1}: ${nextSlide.step.title}`;
    return (
      <Pressable style={styles.nextCue} onPress={onNext}>
        <ChevronUpIcon size={24} color={c.muted} />
        <Text style={[styles.nextCueText, { color: c.muted }]} numberOfLines={2}>
          Berikutnya:{" "}
          <Text style={{ fontFamily: fonts.sansSemi, color: c.foreground }}>
            {label}
          </Text>
        </Text>
      </Pressable>
    );
  }
  if (gatedBy?.counter) {
    return (
      <Text style={[styles.gateText, { color: c.muted }]}>
        Selesaikan {gatedBy.counter.total} {gatedBy.counter.unit} untuk lanjut
      </Text>
    );
  }
  // Complete CTA is sticky in the footer (web-like), not inside the scroll.
  return <View style={{ height: 24 }} />;
};

/** Match web `transition-transform duration-[400ms] ease-out`. */
const PAGE_MS = 400;
const SWIPE_MIN_PX = 56;
const SWIPE_VELOCITY = 0.55;

const easeOut = Easing.bezier(0, 0, 0.2, 1);

export const ImmersiveRunner = ({
  session,
  reviewing = false,
  onComplete,
  onBack,
}: {
  session: Session;
  reviewing?: boolean;
  onComplete?: () => void;
  onBack: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const c = useThemeColors();
  const progress = useProgress((s) => s.sessions[session.id]);
  const setStep = useProgress((s) => s.setStep);
  const setCount = useProgress((s) => s.setCount);
  const completeSession = useProgress((s) => s.completeSession);
  const scrollLock = useSettings((s) => s.scrollLock);

  const { steps } = session;
  const counts = progress?.counts ?? {};
  const gateIndex = steps.findIndex(
    (step) => step.counter && (counts[step.id] ?? 0) < step.counter.total,
  );
  const gatedBy = gateIndex === -1 ? undefined : steps[gateIndex];
  const visibleSteps = gatedBy ? steps.slice(0, gateIndex + 1) : steps;
  const slides = buildSlides(visibleSteps);

  const savedPosition = slides.findIndex(
    (slide) =>
      slide.stepIndex === (progress?.stepIndex ?? 0) &&
      slide.slideIndex === (progress?.slideIndex ?? 0),
  );
  let fallbackPosition = 0;
  slides.forEach((slide, i) => {
    if (slide.stepIndex <= (progress?.stepIndex ?? 0)) fallbackPosition = i;
  });
  const storePosition = Math.max(
    0,
    savedPosition !== -1 ? savedPosition : fallbackPosition,
  );

  const [activePosition, setActivePosition] = useState(storePosition);
  const [stageH, setStageH] = useState(0);
  const indexAnim = useRef(new Animated.Value(storePosition)).current;
  const animating = useRef(false);
  const positionRef = useRef(storePosition);
  const stageHRef = useRef(0);
  const slideCountRef = useRef(slides.length);
  const animateToRef = useRef<(position: number) => void>(() => {});
  const scrollEdges = useRef({ atTop: true, atBottom: true });
  const [panelVisible, setPanelVisible] = useState(true);
  const [edgeState, setEdgeState] = useState({ atTop: true, atBottom: true });
  const scrollPending = useRef(false);
  const scrollRefs = useRef<Array<{ scrollTo: (o: { y: number; animated?: boolean }) => void } | null>>([]);
  const indexNodes = useRef<Animated.Value[]>([]);
  slideCountRef.current = slides.length;
  while (indexNodes.current.length < slides.length) {
    indexNodes.current.push(new Animated.Value(indexNodes.current.length));
  }

  const activeSlide = slides[activePosition] ?? slides[0];
  const activeStep = activeSlide.step;
  const activeCount = counts[activeStep.id] ?? 0;
  const showTapButton =
    activeStep.counter !== undefined && activeCount < activeStep.counter.total;

  const activeIntroPosition = slides.findIndex(
    (slide) =>
      slide.stepIndex === activeSlide.stepIndex && slide.slideIndex === 0,
  );

  const activeLaps = progress?.laps?.[activeStep.id] ?? [];
  const [lapToast, setLapToast] = useState<LapToast | null>(null);
  const focus = useCounterFocus(
    activeStep.counter ? activeStep.id : undefined,
    showTapButton,
  );

  const persist = useCallback(
    (position: number) => {
      const target = slides[position];
      if (!target) return;
      setStep(session.id, target.stepIndex, target.slideIndex);
    },
    [slides, session.id, setStep],
  );

  const animateTo = useCallback(
    (position: number) => {
      const clamped = Math.max(0, Math.min(slideCountRef.current - 1, position));
      if (clamped === positionRef.current && !animating.current) {
        Animated.timing(indexAnim, {
          toValue: clamped,
          duration: PAGE_MS,
          easing: easeOut,
          useNativeDriver: true,
        }).start();
        return;
      }
      animating.current = true;
      positionRef.current = clamped;
      setActivePosition(clamped);
      persist(clamped);
      scrollRefs.current[clamped]?.scrollTo({ y: 0, animated: false });
      scrollEdges.current = { atTop: true, atBottom: true };
      setEdgeState({ atTop: true, atBottom: true });
      setPanelVisible(true);
      Animated.timing(indexAnim, {
        toValue: clamped,
        duration: PAGE_MS,
        easing: easeOut,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) animating.current = false;
      });
    },
    [indexAnim, persist],
  );
  animateToRef.current = animateTo;

  // Keep local pager in sync if store jumps (e.g. reset).
  useEffect(() => {
    if (storePosition === positionRef.current) return;
    positionRef.current = storePosition;
    setActivePosition(storePosition);
    indexAnim.setValue(storePosition);
  }, [storePosition, indexAnim]);

  const goTo = useCallback((position: number) => {
    if (animating.current) return;
    animateToRef.current(position);
  }, []);

  const recordLap = () => {
    scrollPending.current = true;
    setCount(session.id, activeStep.id, activeCount + 1);
    setLapToast({
      id: Date.now(),
      stepId: activeStep.id,
      count: activeCount + 1,
    });
  };

  useEffect(() => {
    if (!scrollPending.current) return;
    scrollPending.current = false;
    const next = slides[activeIntroPosition + 1];
    const intro = slides[activeIntroPosition];
    if (next && intro && next.stepIndex === intro.stepIndex) {
      goTo(activeIntroPosition + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCount]);

  const onStageLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    stageHRef.current = h;
    setStageH(h);
  };

  const onSlideScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const atTop = contentOffset.y <= 2;
    const atBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 2;
    scrollEdges.current = { atTop, atBottom };
    setEdgeState({ atTop, atBottom });
    setPanelVisible(contentOffset.y < 120);
  };

  const scrollLockRef = useRef(scrollLock);
  scrollLockRef.current = scrollLock;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => {
        if (scrollLockRef.current || animating.current || stageHRef.current <= 0)
          return false;
        if (Math.abs(g.dy) < 10 || Math.abs(g.dy) <= Math.abs(g.dx)) return false;
        const { atTop, atBottom } = scrollEdges.current;
        if (g.dy < 0 && !atBottom) return false; // swipe up → next only at bottom
        if (g.dy > 0 && !atTop) return false; // swipe down → prev only at top
        return true;
      },
      onPanResponderGrant: () => {
        indexAnim.stopAnimation((value) => {
          indexAnim.setValue(value);
        });
      },
      onPanResponderMove: (_, g) => {
        const h = stageHRef.current || 1;
        const next = positionRef.current - g.dy / h;
        const max = Math.max(0, slideCountRef.current - 1);
        const clamped =
          next < 0 ? next * 0.35 : next > max ? max + (next - max) * 0.35 : next;
        indexAnim.setValue(clamped);
      },
      onPanResponderRelease: (_, g) => {
        const h = stageHRef.current || 1;
        const projected = positionRef.current - g.dy / h;
        let target = positionRef.current;
        if (
          g.dy < -SWIPE_MIN_PX ||
          g.vy < -SWIPE_VELOCITY ||
          projected > positionRef.current + 0.35
        ) {
          target = positionRef.current + 1;
        } else if (
          g.dy > SWIPE_MIN_PX ||
          g.vy > SWIPE_VELOCITY ||
          projected < positionRef.current - 0.35
        ) {
          target = positionRef.current - 1;
        }
        animateToRef.current(target);
      },
      onPanResponderTerminate: () => animateToRef.current(positionRef.current),
    }),
  ).current;

  useEffect(() => {
    positionRef.current = Math.min(positionRef.current, slides.length - 1);
  }, [slides.length]);

  const toast = lapToast && activeStep.counter && (
    <UndoToast
      key={lapToast.id}
      message={`${activeStep.counter.unit} ${lapToast.count} tercatat`}
      onUndo={() => {
        setCount(session.id, lapToast.stepId, lapToast.count - 1);
        setLapToast(null);
      }}
      onDismiss={() => setLapToast(null)}
    />
  );

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: Math.max(insets.top, 12) + 8,
          backgroundColor: c.background,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          { borderBottomColor: c.border, paddingBottom: 14 },
        ]}
      >
        <Pressable
          onPress={onBack}
          style={styles.backBtn}
          accessibilityLabel="Kembali"
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: c.foreground,
            }}
          >
            ←
          </Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: c.foreground }]}>
            {session.title}
          </Text>
          <Text style={[styles.headerSub, { color: c.muted }]}>
            Langkah {activeSlide.stepIndex + 1} / {steps.length}
          </Text>
        </View>
        <LockToggle />
      </View>

      {activeStep.counter && (
        <CounterStrip
          counter={activeStep.counter}
          count={activeCount}
          visible={activeSlide.slideIndex > 0 || !panelVisible}
          onSelect={() => goTo(activeIntroPosition)}
        />
      )}

      <View
        style={styles.stage}
        onLayout={onStageLayout}
        {...(scrollLock ? {} : panResponder.panHandlers)}
      >
        {stageH > 0 &&
          slides.map((slide, position) => {
            const count = counts[slide.step.id] ?? 0;
            // Same as web: translateY = (position - activeIndex) * height
            const translateY = Animated.multiply(
              Animated.subtract(indexNodes.current[position], indexAnim),
              stageH,
            );
            // Keep ±1 neighbors mounted for smooth peek during drag.
            const nearby = Math.abs(position - activePosition) <= 1;

            return (
              <Animated.View
                key={slide.key}
                pointerEvents={position === activePosition ? "auto" : "none"}
                style={[
                  styles.slide,
                  {
                    height: stageH,
                    paddingBottom: showTapButton ? 140 : insets.bottom + 16,
                    transform: [{ translateY }],
                    opacity: nearby ? 1 : 0,
                  },
                ]}
              >
                <ScrollView
                  ref={(ref) => {
                    scrollRefs.current[position] = ref;
                  }}
                  scrollEnabled={!scrollLock && position === activePosition}
                  onScroll={onSlideScroll}
                  scrollEventThrottle={16}
                  bounces
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop:
                      slide.dua && slide.step.counter
                        ? 16
                        : 12,
                    paddingBottom: 24,
                    minHeight: stageH * 0.65,
                    maxWidth: contentMaxWidth,
                    width: "100%",
                    alignSelf: "center",
                  }}
                >
                  {slide.dua ? (
                    <DuaSlideContent slide={{ ...slide, dua: slide.dua }} />
                  ) : (
                    <StepIntro
                      slide={slide}
                      totalSteps={steps.length}
                      count={count}
                      laps={progress?.laps?.[slide.step.id] ?? []}
                      onUndo={() =>
                        setCount(
                          session.id,
                          slide.step.id,
                          Math.max(0, count - 1),
                        )
                      }
                      onExpand={focus.expand}
                    />
                  )}
                  {position === activePosition && (
                    <SlideEnd
                      nextSlide={slides[position + 1]}
                      gatedBy={gatedBy}
                      reviewing={reviewing}
                      onNext={() => goTo(position + 1)}
                      onComplete={() =>
                        onComplete
                          ? onComplete()
                          : completeSession(session.id)
                      }
                    />
                  )}
                </ScrollView>
              </Animated.View>
            );
          })}
      </View>

      {(() => {
        const isLastSlide = activePosition >= slides.length - 1;
        const canComplete = isLastSlide && !gatedBy && !showTapButton;
        const showFooter =
          !focus.open &&
          ((activeStep.counter && (showTapButton || toast)) || canComplete);
        if (!showFooter) return null;
        return (
          <View
            style={[
              styles.footer,
              {
                paddingBottom: Math.max(insets.bottom, 12) + 12,
                borderTopColor: c.border,
                backgroundColor: c.background,
              },
            ]}
          >
            {toast}
            {showTapButton && activeStep.counter ? (
              <CounterTapButton
                counter={activeStep.counter}
                count={activeCount}
                onTap={recordLap}
              />
            ) : canComplete ? (
              <Pressable
                style={[styles.completeBtn, { backgroundColor: c.primary }]}
                onPress={() =>
                  onComplete ? onComplete() : completeSession(session.id)
                }
              >
                <Text style={[styles.completeBtnText, { color: c.primaryFg }]}>
                  {reviewing ? "Selesai baca ulang" : "Selesai sesi"}
                </Text>
                <CheckIcon size={20} color={c.primaryFg} />
              </Pressable>
            ) : null}
          </View>
        );
      })()}

      {focus.open && activeStep.counter && (
        <CounterFocus
          title={`${session.title} · ${activeStep.title}`}
          counter={activeStep.counter}
          count={activeCount}
          laps={activeLaps}
          onTap={recordLap}
          onClose={focus.close}
          toast={toast}
        />
      )}

      {scrollLock && !focus.open && (
        <ThumbPad
          canPrev={activePosition > 0}
          canNext={activePosition < slides.length - 1}
          onPrev={() => goTo(activePosition - 1)}
          onNext={() => goTo(activePosition + 1)}
          atTop={edgeState.atTop}
          atBottom={edgeState.atBottom}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: colors.foreground },
  headerSub: { fontSize: 12, color: colors.muted },
  stage: { flex: 1, overflow: "hidden" },
  slide: {
    ...StyleSheet.absoluteFill,
  },
  goldMeta: { fontSize: 12, fontWeight: "500", color: colors.gold },
  stepTitle: { fontSize: 22, fontWeight: "700", color: colors.foreground },
  body: { fontSize: 15, lineHeight: 22, color: colors.foreground },
  tip: { fontSize: 13, lineHeight: 20, color: colors.muted },
  duaTitle: { fontSize: 16, fontWeight: "600", color: colors.foreground },
  repeatPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: colors.goldSoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  repeatText: { fontSize: 12, fontWeight: "500", color: colors.gold },
  arabic: {
    textAlign: "right",
    color: colors.foreground,
    writingDirection: "rtl",
  },
  latin: {
    fontSize: 17,
    fontStyle: "italic",
    fontWeight: "500",
    color: colors.gold,
  },
  translation: { fontSize: 17, color: colors.muted, lineHeight: 26 },
  dalilCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  dalilSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dalilSource: { flex: 1, fontSize: 13, color: colors.muted },
  dalilBody: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
  },
  nextCue: {
    marginTop: 24,
    alignItems: "center",
    gap: 4,
    paddingVertical: 12,
  },
  nextCueText: { fontSize: 13, color: colors.muted, maxWidth: "100%" },
  gateText: {
    marginTop: 24,
    paddingVertical: 12,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
  },
  completeBtn: {
    minHeight: 64,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  completeBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.primaryFg,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
});
