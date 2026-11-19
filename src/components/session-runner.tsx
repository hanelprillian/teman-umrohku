"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sessions as allSessions } from "@/content/sessions";
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
import { ArrowLeftIcon, ArrowRightIcon, BookIcon, CheckIcon, UndoIcon } from "./icons";
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
  hasLaterProgress,
  onReview,
  onRepeatThis,
  onRepeatFromHere,
}: SessionRunnerProps & {
  hasLaterProgress: boolean;
  onReview: () => void;
  onRepeatThis: () => void;
  onRepeatFromHere: () => void;
}) => {
  const [confirmRepeat, setConfirmRepeat] = useState(false);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <div className="flex size-20 items-center justify-center rounded-full border border-rawdah/25 bg-rawdah-soft text-rawdah">
        <CheckIcon className="size-9" />
      </div>
      <div>
        <span className="inline-block rounded-full bg-gold-soft px-3 py-1 text-xs font-medium text-gold">
          Sesi selesai
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {session.title}
        </h1>
        <p className="mt-2 text-reading text-muted">
          Alhamdulillah. Semoga Allah menerima ibadahmu.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3">
        {nextSession ? (
          <Link
            href={`/sesi/${nextSession.id}/`}
            className="relative flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-base font-semibold text-primary-foreground shadow-sm"
          >
            Lanjut: {nextSession.title}
            <ArrowRightIcon className="size-5" />
            <LinkPending />
          </Link>
        ) : (
          <Link
            href="/"
            className="relative flex min-h-14 items-center justify-center rounded-2xl bg-primary px-5 text-base font-semibold text-primary-foreground shadow-sm"
          >
            Kembali ke beranda
            <LinkPending />
          </Link>
        )}

        <ActionButton
          onAction={onReview}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-surface text-sm font-medium text-foreground active:bg-surface-muted"
        >
          <BookIcon className="size-4 text-gold" />
          Lihat lagi (tanpa reset)
        </ActionButton>

        {confirmRepeat ? (
          <div className="nusuk-card space-y-2.5 rounded-2xl p-4 text-left">
            <p className="text-sm font-semibold text-foreground">
              Sesi setelah {session.title} sudah ada progresnya.
            </p>
            <p className="text-xs leading-relaxed text-muted">
              Pilih mau ulangi sesi ini saja, atau reset dari sini sampai akhir.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <ActionButton
                onAction={onRepeatThis}
                className="flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface-muted/70 px-4 text-sm font-medium text-foreground active:bg-surface-muted"
              >
                Ulangi {session.title} saja
              </ActionButton>
              <ActionButton
                onAction={onRepeatFromHere}
                className="flex min-h-11 items-center justify-center rounded-xl border border-gold/35 bg-gold-soft px-4 text-sm font-medium text-gold active:opacity-85"
              >
                Reset dari {session.title} sampai akhir
              </ActionButton>
              <button
                type="button"
                onClick={() => setConfirmRepeat(false)}
                className="min-h-10 text-xs font-medium text-muted"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <ActionButton
            onAction={() => {
              if (hasLaterProgress) setConfirmRepeat(true);
              else onRepeatThis();
            }}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-background text-sm font-medium text-muted active:bg-surface-muted"
          >
            <UndoIcon className="size-4" />
            Ulangi sesi ini
          </ActionButton>
        )}

        {nextSession && (
          <Link
            href="/"
            className="relative bg-background py-2 text-sm font-medium text-muted underline underline-offset-4"
          >
            Ke beranda
            <LinkPending />
          </Link>
        )}
      </div>
    </main>
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
    if (isLastStep) {
      if (onComplete) onComplete();
      else completeSession(session.id);
    } else setStep(session.id, stepIndex + 1);
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
                {isLastStep
                  ? reviewing
                    ? "Selesai baca ulang"
                    : "Selesai sesi"
                  : "Lanjut"}
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
  const allProgress = useProgress((s) => s.sessions);
  const completed = allProgress[session.id]?.completed;
  const setStep = useProgress((s) => s.setStep);
  const resetSession = useProgress((s) => s.resetSession);
  const resetFromSession = useProgress((s) => s.resetFromSession);
  const [reviewing, setReviewing] = useState(false);

  useWakeLock(hydrated);

  if (!hydrated) return <Skeleton />;

  const sessionIdx = allSessions.findIndex((s) => s.id === session.id);
  const hasLaterProgress =
    sessionIdx !== -1 &&
    allSessions.slice(sessionIdx + 1).some((s) => Boolean(allProgress[s.id]));

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

  return immersive ? (
    <ImmersiveRunner
      session={session}
      reviewing={reviewing}
      onComplete={finishReview}
    />
  ) : (
    <StandardRunner
      session={session}
      reviewing={reviewing}
      onComplete={finishReview}
    />
  );
};
