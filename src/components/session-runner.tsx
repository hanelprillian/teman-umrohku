"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Session } from "@/content/types";
import { useHydrated, useVisibleBelowHeader, useWakeLock } from "@/lib/hooks";
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
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, CheckIcon } from "./icons";
import { ImmersiveRunner } from "./immersive-runner";
import { LinkPending } from "./link-pending";
import { Badge } from "./noor-ui";
import { SessionHeader } from "./session-header";
import { StepContent, StepTitle } from "./step-content";

interface SessionRunnerProps {
  session: Session;
  nextSession?: Pick<Session, "id" | "title">;
}

const Skeleton = () => (
  <div className="mx-auto max-w-xl animate-pulse space-y-4 px-4 py-6">
    <div className="h-6 w-1/2 rounded-[var(--radius-sm)] bg-muted" />
    <div className="h-40 rounded-[var(--radius)] bg-muted" />
    <div className="h-40 rounded-[var(--radius)] bg-muted" />
  </div>
);

const CompletedView = ({
  session,
  nextSession,
  onRepeat,
}: SessionRunnerProps & { onRepeat: () => void }) => (
  <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-6 px-6 py-10 text-center">
    <div className="flex size-20 items-center justify-center rounded-full bg-success/15 text-success">
      <CheckCircleIcon className="size-12" />
    </div>
    <div>
      <Badge
        variant="outline"
        className="mb-2 rounded-full border-success/40 bg-success/10 text-success-foreground"
      >
        Sesi selesai
      </Badge>
      <h1 className="text-3xl font-extrabold text-foreground">
        {session.title}
      </h1>
      <p className="mt-2 text-reading text-muted-foreground">
        Alhamdulillah. Semoga Allah menerima ibadahmu.
      </p>
    </div>
    <div className="flex w-full flex-col gap-3">
      {nextSession ? (
        <Link
          href={`/sesi/${nextSession.id}/`}
          className="relative flex min-h-14 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-5 text-lg font-bold text-primary-foreground shadow-sm hover:bg-primary/92"
        >
          Lanjut: {nextSession.title}
          <ArrowRightIcon className="size-5" />
          <LinkPending />
        </Link>
      ) : (
        <Link
          href="/"
          className="relative flex min-h-14 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-lg font-bold text-primary-foreground shadow-sm hover:bg-primary/92"
        >
          Kembali ke beranda
          <LinkPending />
        </Link>
      )}
      <ActionButton
        onAction={onRepeat}
        className="flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-border bg-card font-semibold text-muted-foreground hover:bg-muted"
      >
        Ulangi sesi ini
      </ActionButton>
      {nextSession && (
        <Link
          href="/"
          className="relative py-2 font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
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
    const dua = document.querySelector<HTMLElement>("[data-first-dua]");
    if (!dua) return;
    const headerH =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
      ) || 0;
    const top = dua.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
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
              className="mb-2 flex min-h-8 items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
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
              onUndo={() =>
                setCount(session.id, step.id, Math.max(0, count - 1))
              }
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
            <CounterTapButton
              counter={step.counter}
              count={count}
              onTap={recordLap}
            />
          ) : (
            <div className="flex gap-3">
              {stepIndex > 0 && (
                <ActionButton
                  onAction={goBack}
                  aria-label="Langkah sebelumnya"
                  className="flex min-h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius)] border border-border bg-card text-foreground shadow-xs hover:bg-muted active:bg-muted"
                >
                  <ArrowLeftIcon className="size-5" />
                </ActionButton>
              )}
              {step.optional && (
                <ActionButton
                  onAction={goNext}
                  className="flex min-h-14 shrink-0 items-center justify-center rounded-[var(--radius)] border border-border bg-card px-5 font-semibold text-muted-foreground hover:bg-muted active:bg-muted"
                >
                  Lewati
                </ActionButton>
              )}
              <ActionButton
                onAction={goNext}
                className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-4 text-lg font-bold text-primary-foreground shadow-sm hover:bg-primary/92"
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
