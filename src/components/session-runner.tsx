"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Session } from "@/content/types";
import { useHydrated, useVisibleBelowHeader, useWakeLock } from "@/lib/hooks";
import { useProgress } from "@/lib/progress-store";
import { useSettings } from "@/lib/settings-store";
import {
  CounterFocus,
  CounterPanel,
  CounterStrip,
  CounterTapButton,
  type LapToast,
  UndoToast,
  useCounterFocus,
} from "./counter";
import { ActionButton } from "./action-button";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "./icons";
import { ImmersiveRunner } from "./immersive-runner";
import { LinkPending } from "./link-pending";
import { SessionHeader } from "./session-header";
import { StepContent, StepTitle } from "./step-content";

interface SessionRunnerProps {
  session: Session;
  nextSession?: Pick<Session, "id" | "title">;
}

const Skeleton = () => (
  <div className="mx-auto max-w-xl animate-pulse space-y-4 px-4 py-6">
    <div className="h-6 w-1/2 rounded bg-surface-muted" />
    <div className="h-40 rounded-2xl bg-surface-muted" />
    <div className="h-40 rounded-2xl bg-surface-muted" />
  </div>
);

const CompletedView = ({
  session,
  nextSession,
  onRepeat,
}: SessionRunnerProps & { onRepeat: () => void }) => (
  <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-6 px-6 py-10 text-center">
    <div className="flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
      <CheckIcon className="size-10" />
    </div>
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">
        Sesi selesai
      </p>
      <h1 className="mt-1 text-3xl font-extrabold">{session.title}</h1>
      <p className="mt-2 text-reading text-muted">
        Alhamdulillah. Semoga Allah menerima ibadahmu.
      </p>
    </div>
    <div className="flex w-full flex-col gap-3">
      {nextSession ? (
        <Link
          href={`/sesi/${nextSession.id}/`}
          className="relative flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-lg font-bold text-primary-foreground"
        >
          Lanjut: {nextSession.title}
          <ArrowRightIcon className="size-5" />
          <LinkPending />
        </Link>
      ) : (
        <Link
          href="/"
          className="relative flex min-h-16 items-center justify-center rounded-2xl bg-primary px-5 text-lg font-bold text-primary-foreground"
        >
          Kembali ke beranda
          <LinkPending />
        </Link>
      )}
      <ActionButton
        onAction={onRepeat}
        className="flex min-h-14 items-center justify-center rounded-2xl border border-border font-semibold text-muted"
      >
        Ulangi sesi ini
      </ActionButton>
      {nextSession && (
        <Link
          href="/"
          className="relative bg-background py-2 font-semibold text-muted underline"
        >
          Ke beranda
          <LinkPending />
        </Link>
      )}
    </div>
  </main>
);

const StandardRunner = ({ session }: { session: Session }) => {
  const progress = useProgress((s) => s.sessions[session.id]);
  const setStep = useProgress((s) => s.setStep);
  const setCount = useProgress((s) => s.setCount);
  const completeSession = useProgress((s) => s.completeSession);

  const totalSteps = session.steps.length;
  const stepIndex = Math.min(progress?.stepIndex ?? 0, totalSteps - 1);
  const step = session.steps[stepIndex];
  const count = progress?.counts[step.id] ?? 0;
  const counterDone = !step.counter || count >= step.counter.total;
  const isLastStep = stepIndex === totalSteps - 1;
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  const panelVisible = useVisibleBelowHeader(panel);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stepIndex]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const scrollPending = useRef(false);
  useEffect(() => {
    if (!scrollPending.current) return;
    scrollPending.current = false;
    requestAnimationFrame(scrollToTop);
  }, [count]);

  const goNext = () => {
    if (isLastStep) completeSession(session.id);
    else setStep(session.id, stepIndex + 1);
  };

  const goBack = () => setStep(session.id, Math.max(0, stepIndex - 1));

  const laps = progress?.laps?.[step.id] ?? [];
  const [lapToast, setLapToast] = useState<LapToast | null>(null);
  const focus = useCounterFocus(step.counter ? step.id : undefined, !counterDone);
  const focusOpen = focus.open;

  const recordLap = () => {
    scrollPending.current = true;
    setCount(session.id, step.id, count + 1);
    setLapToast({ id: Date.now(), stepId: step.id, count: count + 1 });
  };

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
    <div className="min-h-dvh">
      <SessionHeader session={session} stepIndex={stepIndex} />

      <main className="mx-auto max-w-xl space-y-6 px-4 pb-40 pt-5">
        <div>
          {step.counter && !counterDone && stepIndex > 0 && (
            <ActionButton
              onAction={goBack}
              className="mb-2 flex min-h-8 items-center gap-1 text-sm font-semibold text-muted"
            >
              <ArrowLeftIcon className="size-4" /> Langkah sebelumnya
            </ActionButton>
          )}
          <StepTitle step={step} />
        </div>

        {step.counter && (
          <div ref={setPanel}>
            <CounterPanel
              counter={step.counter}
              count={count}
              laps={laps}
              onUndo={() => setCount(session.id, step.id, Math.max(0, count - 1))}
              onExpand={focus.expand}
            />
          </div>
        )}

        <StepContent step={step} />
      </main>

      {step.counter && (
        <CounterStrip
          counter={step.counter}
          count={count}
          visible={!panelVisible}
          onSelect={scrollToTop}
        />
      )}

      <footer className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-xl space-y-3 px-4 pt-3">
          {!focusOpen && toast}
          {step.counter && !counterDone ? (
            <CounterTapButton counter={step.counter} count={count} onTap={recordLap} />
          ) : (
            <div className="flex gap-3">
              {stepIndex > 0 && (
                <ActionButton
                  onAction={goBack}
                  aria-label="Langkah sebelumnya"
                  className="flex min-h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border active:bg-surface-muted"
                >
                  <ArrowLeftIcon className="size-6" />
                </ActionButton>
              )}
              {step.optional && (
                <ActionButton
                  onAction={goNext}
                  className="flex min-h-16 shrink-0 items-center justify-center rounded-2xl border border-border px-5 font-semibold text-muted active:bg-surface-muted"
                >
                  Lewati
                </ActionButton>
              )}
              <ActionButton
                onAction={goNext}
                className="flex min-h-16 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-lg font-bold text-primary-foreground active:bg-primary-strong"
              >
                {isLastStep ? "Selesai sesi" : "Lanjut"}
                {isLastStep ? (
                  <CheckIcon className="size-5" />
                ) : (
                  <ArrowRightIcon className="size-5" />
                )}
              </ActionButton>
            </div>
          )}
        </div>
      </footer>

      {focusOpen && step.counter && (
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
    </div>
  );
};

export const SessionRunner = ({ session, nextSession }: SessionRunnerProps) => {
  const hydrated = useHydrated();
  const immersive = useSettings((s) => s.immersive);
  const completed = useProgress((s) => s.sessions[session.id]?.completed);
  const resetSession = useProgress((s) => s.resetSession);

  useWakeLock(hydrated);

  if (!hydrated) return <Skeleton />;

  if (completed) {
    return (
      <CompletedView
        session={session}
        nextSession={nextSession}
        onRepeat={() => resetSession(session.id)}
      />
    );
  }

  return immersive ? (
    <ImmersiveRunner session={session} />
  ) : (
    <StandardRunner session={session} />
  );
};
