"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Dua, Session, Step } from "@/content/types";
import { useVisibleBelowHeader } from "@/lib/hooks";
import { useProgress } from "@/lib/progress-store";
import { ActionButton } from "./action-button";
import {
  CounterFocus,
  CounterPanel,
  CounterStrip,
  CounterTapButton,
  type LapToast,
  UndoToast,
} from "./counter";
import { DalilList, StatusBadge } from "./dalil";
import { CheckIcon } from "./icons";
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
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            {step.title}
            {total > 1 && ` · Doa ${slideIndex} dari ${total}`}
          </p>
          {dua.title && <p className="font-semibold text-muted">{dua.title}</p>}
          {dua.repeat && (
            <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">
              {dua.repeat}
            </span>
          )}
        </div>
        <p dir="rtl" lang="ar" className="text-arabic-lg text-right">
          {dua.arabic}
        </p>
        <p className="latin-text text-reading-lg font-medium italic text-primary-strong">
          {dua.latin}
        </p>
        <p className="translation-text text-reading-lg">“{dua.translation}”</p>
      </div>

      <details className="dalil-section group rounded-2xl border border-border bg-surface">
        <summary className="flex cursor-pointer items-center gap-3 px-4 py-3">
          <span className="min-w-0 flex-1 truncate text-sm text-muted">
            {firstDalil.source}
            {dua.dalil.length > 1 && ` +${dua.dalil.length - 1}`}
          </span>
          <StatusBadge status={firstDalil.status} />
        </summary>
        <div className="border-t border-border px-4 py-3">
          <DalilList items={dua.dalil} />
        </div>
      </details>
    </>
  );
};

interface SlideEndProps {
  nextSlide?: Slide;
  gatedBy?: Step;
  onNext: () => void;
  onComplete: () => void;
}

const SlideEnd = ({ nextSlide, gatedBy, onNext, onComplete }: SlideEndProps) => {
  if (nextSlide) {
    const label = nextSlide.dua
      ? `Doa: ${nextSlide.dua.title ?? nextSlide.step.title}`
      : `Langkah ${nextSlide.stepIndex + 1}: ${nextSlide.step.title}`;
    return (
      <button
        type="button"
        onClick={onNext}
        className="mt-6 flex w-full flex-col items-center gap-1 py-3 text-muted"
      >
        <ChevronUpIcon />
        <span className="max-w-full truncate text-sm">
          Berikutnya: <span className="font-semibold text-foreground">{label}</span>
        </span>
      </button>
    );
  }

  if (gatedBy?.counter) {
    return (
      <p className="mt-6 py-3 text-center text-sm font-semibold text-muted">
        Selesaikan {gatedBy.counter.total} {gatedBy.counter.unit} untuk lanjut
      </p>
    );
  }

  return (
    <ActionButton
      onAction={onComplete}
      className="mt-6 flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-lg font-bold text-primary-foreground active:bg-primary-strong"
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
  const activePosition = Math.max(0, savedPosition !== -1 ? savedPosition : fallbackPosition);
  const activeSlide = slides[activePosition];
  const activeStep = activeSlide.step;
  const activeCount = counts[activeStep.id] ?? 0;
  const showTapButton =
    activeStep.counter !== undefined && activeCount < activeStep.counter.total;

  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const initialPosition = useRef(activePosition);
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  const panelVisible = useVisibleBelowHeader(panel);
  const activeIntroPosition = slides.findIndex(
    (slide) => slide.stepIndex === activeSlide.stepIndex && slide.slideIndex === 0,
  );

  const activeLaps = progress?.laps?.[activeStep.id] ?? [];
  const [lapToast, setLapToast] = useState<LapToast | null>(null);
  const [focusOpen, setFocusOpen] = useState(false);
  const scrollPending = useRef(false);

  const recordLap = () => {
    scrollPending.current = true;
    setCount(session.id, activeStep.id, activeCount + 1);
    setLapToast({ id: Date.now(), stepId: activeStep.id, count: activeCount + 1 });
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
    root.classList.add("snap-steps");
    slideRefs.current[initialPosition.current]?.scrollIntoView({ block: "start" });
    return () => root.classList.remove("snap-steps");
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          const stepIndex = Number(element.dataset.step);
          const slideIndex = Number(element.dataset.slide);
          const current = useProgress.getState().sessions[session.id];
          if (current?.stepIndex !== stepIndex || current?.slideIndex !== slideIndex) {
            setStep(session.id, stepIndex, slideIndex);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    slideRefs.current
      .slice(0, slides.length)
      .forEach((slide) => slide && observer.observe(slide));

    return () => observer.disconnect();
  }, [session.id, setStep, slides.length]);

  useEffect(() => {
    const markTall = () => {
      const header = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
      ) || 0;
      const available = window.innerHeight - header;
      slideRefs.current.slice(0, slides.length).forEach((slide) => {
        if (slide) slide.toggleAttribute("data-tall", slide.offsetHeight > available + 1);
      });
    };

    const observer = new ResizeObserver(markTall);
    slideRefs.current
      .slice(0, slides.length)
      .forEach((slide) => slide && observer.observe(slide));
    window.addEventListener("resize", markTall);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", markTall);
    };
  }, [slides.length]);

  const scrollToSlide = (position: number) =>
    slideRefs.current[position]?.scrollIntoView({ behavior: "smooth", block: "start" });

  useEffect(() => {
    if (!scrollPending.current) return;
    scrollPending.current = false;
    requestAnimationFrame(() =>
      slideRefs.current[activeIntroPosition]?.scrollIntoView({ block: "start" }),
    );
  }, [activeCount, activeIntroPosition]);

  return (
    <div className="min-h-dvh">
      <SessionHeader
        session={session}
        stepIndex={activeSlide.stepIndex}
        compact
      />

      {slides.map((slide, position) => {
        const { step } = slide;
        const count = counts[step.id] ?? 0;
        const counterPending =
          step.counter !== undefined && count < step.counter.total;

        return (
          <section
            key={slide.key}
            ref={(element) => {
              slideRefs.current[position] = element;
            }}
            data-step={slide.stepIndex}
            data-slide={slide.slideIndex}
            aria-label={
              slide.dua
                ? `Doa: ${slide.dua.title ?? step.title}`
                : `Langkah ${slide.stepIndex + 1}: ${step.title}`
            }
            className={`snap-step mx-auto flex max-w-xl flex-col px-5 ${
              step.counter && slide.dua ? "pt-20" : "pt-5"
            } ${counterPending ? "pb-44" : "pb-safe"}`}
          >
            {slide.dua ? (
              <DuaSlideContent slide={{ ...slide, dua: slide.dua }} />
            ) : (
              <div className="flex-1 space-y-6">
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Langkah {slide.stepIndex + 1} dari {steps.length}
                </p>
                <StepTitle step={step} />
                {step.counter && (
                  <div ref={step.id === activeStep.id ? setPanel : undefined}>
                    <CounterPanel
                      counter={step.counter}
                      count={count}
                      laps={progress?.laps?.[step.id] ?? []}
                      onUndo={() =>
                        setCount(session.id, step.id, Math.max(0, count - 1))
                      }
                      onExpand={() => setFocusOpen(true)}
                    />
                  </div>
                )}
                <StepContent step={step} showDuas={false} />
              </div>
            )}

            <SlideEnd
              nextSlide={slides[position + 1]}
              gatedBy={gatedBy}
              onNext={() => scrollToSlide(position + 1)}
              onComplete={() => completeSession(session.id)}
            />
          </section>
        );
      })}

      {activeStep.counter && (
        <CounterStrip
          counter={activeStep.counter}
          count={activeCount}
          visible={!panelVisible}
          onSelect={() => scrollToSlide(activeIntroPosition)}
        />
      )}

      {activeStep.counter && (showTapButton || toast) && !focusOpen && (
        <footer className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
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
          onClose={() => setFocusOpen(false)}
          toast={toast}
        />
      )}
    </div>
  );
};
