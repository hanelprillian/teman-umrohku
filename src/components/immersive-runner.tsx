"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Dua, Session, Step } from "@/content/types";
import { useHeightVar, usePagedSwipe, useVisibleBelowHeader } from "@/lib/hooks";
import { useProgress } from "@/lib/progress-store";
import { useSettings } from "@/lib/settings-store";
import { ActionButton } from "./action-button";
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
import { CheckIcon } from "./icons";
import { Badge, Card } from "./noor-ui";
import { LockToggle, ThumbPad } from "./scroll-lock";
import { SessionHeader } from "./session-header";
import { StepContent, StepTitle } from "./step-content";

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

const ChevronUpIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-6 animate-bounce"
    aria-hidden
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

const DuaSlideContent = ({ slide }: { slide: Slide & { dua: Dua } }) => {
  const { dua, step, slideIndex } = slide;
  const total = step.duas?.length ?? 1;
  const [firstDalil] = dua.dalil;

  return (
    <>
      <div className="flex flex-1 flex-col justify-center gap-6 py-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-primary">
            {step.title}
            {total > 1 && ` · Doa ${slideIndex} dari ${total}`}
          </p>
          {dua.title && (
            <p className="font-semibold text-muted-foreground">{dua.title}</p>
          )}
          {dua.repeat && (
            <Badge
              variant="outline"
              className="rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary"
            >
              {dua.repeat}
            </Badge>
          )}
        </div>
        <p dir="rtl" lang="ar" className="text-arabic-lg text-right text-foreground">
          {dua.arabic}
        </p>
        <p className="latin-text text-reading-lg font-medium italic text-primary">
          {dua.latin}
        </p>
        <p className="translation-text text-reading-lg text-muted-foreground">
          “{dua.translation}”
        </p>
      </div>

      <Card className="dalil-section overflow-hidden">
        <details className="group">
          <summary className="flex cursor-pointer items-center gap-3 px-4 py-3">
            <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
              {firstDalil.source}
              {dua.dalil.length > 1 && ` +${dua.dalil.length - 1}`}
            </span>
            <StatusBadge status={firstDalil.status} />
          </summary>
          <div className="border-t border-border px-4 py-3">
            <DalilList items={dua.dalil} />
          </div>
        </details>
      </Card>
    </>
  );
};

interface SlideEndProps {
  nextSlide?: Slide;
  gatedBy?: Step;
  onNext: () => void;
  onComplete: () => void;
}

const SlideEnd = ({
  nextSlide,
  gatedBy,
  onNext,
  onComplete,
}: SlideEndProps) => {
  if (nextSlide) {
    const label = nextSlide.dua
      ? `Doa: ${nextSlide.dua.title ?? nextSlide.step.title}`
      : `Langkah ${nextSlide.stepIndex + 1}: ${nextSlide.step.title}`;
    return (
      <button
        type="button"
        onClick={onNext}
        className="mt-6 flex w-full flex-col items-center gap-1 py-3 text-muted-foreground"
      >
        <ChevronUpIcon />
        <span className="max-w-full truncate text-sm">
          Berikutnya:{" "}
          <span className="font-semibold text-foreground">{label}</span>
        </span>
      </button>
    );
  }

  if (gatedBy?.counter) {
    return (
      <p className="mt-6 py-3 text-center text-sm font-semibold text-muted-foreground">
        Selesaikan {gatedBy.counter.total} {gatedBy.counter.unit} untuk lanjut
      </p>
    );
  }

  return (
    <ActionButton
      onAction={onComplete}
      className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-4 text-lg font-bold text-primary-foreground shadow-sm hover:bg-primary/92"
    >
      Selesai sesi <CheckIcon className="size-5" />
    </ActionButton>
  );
};

export const ImmersiveRunner = ({ session }: { session: Session }) => {
  const progress = useProgress((s) => s.sessions[session.id]);
  const setStep = useProgress((s) => s.setStep);
  const setCount = useProgress((s) => s.setCount);
  const completeSession = useProgress((s) => s.completeSession);

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
  const fallbackPosition = slides.findLastIndex(
    (slide) => slide.stepIndex <= (progress?.stepIndex ?? 0),
  );
  const activePosition = Math.max(
    0,
    savedPosition !== -1 ? savedPosition : fallbackPosition,
  );
  const activeSlide = slides[activePosition];
  const activeStep = activeSlide.step;
  const activeCount = counts[activeStep.id] ?? 0;
  const showTapButton =
    activeStep.counter !== undefined && activeCount < activeStep.counter.total;

  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  const panelVisible = useVisibleBelowHeader(panel);
  const activeIntroPosition = slides.findIndex(
    (slide) =>
      slide.stepIndex === activeSlide.stepIndex && slide.slideIndex === 0,
  );

  const scrollLock = useSettings((s) => s.scrollLock);

  const activeLaps = progress?.laps?.[activeStep.id] ?? [];
  const [lapToast, setLapToast] = useState<LapToast | null>(null);
  const focus = useCounterFocus(
    activeStep.counter ? activeStep.id : undefined,
    showTapButton,
  );
  const focusOpen = focus.open;
  const scrollPending = useRef(false);

  const recordLap = () => {
    scrollPending.current = true;
    setCount(session.id, activeStep.id, activeCount + 1);
    setLapToast({
      id: Date.now(),
      stepId: activeStep.id,
      count: activeCount + 1,
    });
  };

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

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("immersive-lock");
    return () => root.classList.remove("immersive-lock");
  }, []);

  const goTo = (position: number, edge: "top" | "bottom" = "top") => {
    const target = slides[position];
    if (!target) return;
    const scroller = slideRefs.current[position];
    if (scroller)
      scroller.scrollTop = edge === "top" ? 0 : scroller.scrollHeight;
    setStep(session.id, target.stepIndex, target.slideIndex);
  };

  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const [footer, setFooter] = useState<HTMLElement | null>(null);
  useHeightVar(footer, "--footer-h");
  usePagedSwipe({
    stage,
    enabled: !scrollLock,
    getScroller: () => slideRefs.current[activePosition],
    onNext: () => goTo(activePosition + 1),
    onPrev: () => goTo(activePosition - 1, "bottom"),
  });

  useEffect(() => {
    if (!scrollPending.current) return;
    scrollPending.current = false;
    const next = slides[activeIntroPosition + 1];
    const intro = slides[activeIntroPosition];
    if (next && intro && next.stepIndex === intro.stepIndex) goTo(activeIntroPosition + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to a new lap
  }, [activeCount]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SessionHeader
        session={session}
        stepIndex={activeSlide.stepIndex}
        compact
        actions={<LockToggle />}
      />

      <div
        ref={setStage}
        className={`relative flex-1 overflow-hidden ${scrollLock ? "touch-none" : ""}`}
      >
        {slides.map((slide, position) => {
          const { step } = slide;
          const count = counts[step.id] ?? 0;
          const counterPending =
            step.counter !== undefined && count < step.counter.total;
          const offset = position - activePosition;

          return (
            <section
              key={slide.key}
              ref={(element) => {
                slideRefs.current[position] = element;
              }}
              inert={offset !== 0}
              aria-label={
                slide.dua
                  ? `Doa: ${slide.dua.title ?? step.title}`
                  : `Langkah ${slide.stepIndex + 1}: ${step.title}`
              }
              className={`absolute inset-0 overscroll-contain transition-transform duration-[400ms] ease-out motion-reduce:transition-none ${
                scrollLock ? "overflow-hidden" : "overflow-y-auto"
              }`}
              style={{ transform: `translateY(${offset * 100}%)` }}
            >
              <div
                className={`mx-auto flex min-h-full max-w-xl flex-col px-5 ${
                  step.counter && slide.dua ? "pt-20" : "pt-5"
                } ${counterPending ? "pb-36" : "pb-safe"}`}
                style={
                  scrollLock
                    ? {
                        paddingBottom:
                          "calc(max(var(--footer-h, 0px), env(safe-area-inset-bottom)) + var(--spacing) * 44)",
                      }
                    : undefined
                }
              >
                {slide.dua ? (
                  <DuaSlideContent slide={{ ...slide, dua: slide.dua }} />
                ) : (
                  <div className="flex-1 space-y-6">
                    <p className="text-sm font-semibold text-primary">
                      Langkah {slide.stepIndex + 1} dari {steps.length}
                    </p>
                    <StepTitle step={step} />
                    {step.counter && (
                      <div
                        ref={step.id === activeStep.id ? setPanel : undefined}
                      >
                        <CounterPanel
                          counter={step.counter}
                          count={count}
                          laps={progress?.laps?.[step.id] ?? []}
                          onUndo={() =>
                            setCount(
                              session.id,
                              step.id,
                              Math.max(0, count - 1),
                            )
                          }
                          onExpand={focus.expand}
                        />
                      </div>
                    )}
                    <StepContent step={step} showDuas={false} />
                  </div>
                )}

                <SlideEnd
                  nextSlide={slides[position + 1]}
                  gatedBy={gatedBy}
                  onNext={() => goTo(position + 1)}
                  onComplete={() => completeSession(session.id)}
                />
              </div>
            </section>
          );
        })}
      </div>

      {activeStep.counter && (
        <CounterStrip
          counter={activeStep.counter}
          count={activeCount}
          visible={!panelVisible}
          onSelect={() => goTo(activeIntroPosition)}
        />
      )}

      {activeStep.counter && (showTapButton || toast) && !focusOpen && (
        <footer
          ref={setFooter}
          className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur"
        >
          <div className="mx-auto max-w-xl space-y-3 px-4 pt-3">
            {toast}
            {showTapButton && (
              <CounterTapButton
                counter={activeStep.counter}
                count={activeCount}
                onTap={recordLap}
              />
            )}
          </div>
        </footer>
      )}

      {focusOpen && activeStep.counter && (
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

      {scrollLock && !focusOpen && (
        <ThumbPad
          position={activePosition}
          getScroller={() => slideRefs.current[activePosition]}
          canPrev={activePosition > 0}
          canNext={activePosition < slides.length - 1}
          onPrev={() => goTo(activePosition - 1, "bottom")}
          onNext={() => goTo(activePosition + 1)}
        />
      )}
    </div>
  );
};
