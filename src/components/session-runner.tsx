"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { Session, Step } from "@/content/types";
import { useHydrated, useWakeLock } from "@/lib/hooks";
import { useProgress } from "@/lib/progress-store";
import { CounterPanel, CounterTapButton } from "./counter";
import { DalilList } from "./dalil";
import { DuaCard } from "./dua-card";
import { ArrowLeftIcon, ArrowRightIcon, BookIcon, CheckIcon } from "./icons";
import { TipList } from "./tip-list";

interface SessionRunnerProps {
  session: Session;
  nextSession?: Pick<Session, "id" | "title">;
}

const StepContent = ({ step }: { step: Step }) => (
  <div className="space-y-6">
    <ol className="space-y-3">
      {step.instructions.map((instruction, index) => (
        <li key={instruction} className="flex gap-3 text-reading">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-strong">
            {index + 1}
          </span>
          <span>{instruction}</span>
        </li>
      ))}
    </ol>

    {step.duas && step.duas.length > 0 && (
      <div className="space-y-4">
        {step.duas.map((dua) => (
          <DuaCard key={dua.id} dua={dua} />
        ))}
      </div>
    )}

    {step.tips && step.tips.length > 0 && <TipList tips={step.tips} />}

    {step.dalil && step.dalil.length > 0 && (
      <details className="group rounded-2xl border border-border bg-surface">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3.5 font-semibold">
          <BookIcon className="size-5 text-primary" />
          Dalil langkah ini
          <span className="ml-auto text-sm text-muted group-open:hidden">
            Lihat
          </span>
        </summary>
        <div className="border-t border-border px-4 py-4">
          <DalilList items={step.dalil} />
        </div>
      </details>
    )}
  </div>
);

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
          className="flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-lg font-bold text-primary-foreground"
        >
          Lanjut: {nextSession.title}
          <ArrowRightIcon className="size-5" />
        </Link>
      ) : (
        <Link
          href="/"
          className="flex min-h-16 items-center justify-center rounded-2xl bg-primary px-5 text-lg font-bold text-primary-foreground"
        >
          Kembali ke beranda
        </Link>
      )}
      <button
        type="button"
        onClick={onRepeat}
        className="min-h-14 rounded-2xl border border-border font-semibold text-muted"
      >
        Ulangi sesi ini
      </button>
      {nextSession && (
        <Link href="/" className="py-2 font-semibold text-muted underline">
          Ke beranda
        </Link>
      )}
    </div>
  </main>
);

export const SessionRunner = ({ session, nextSession }: SessionRunnerProps) => {
  const hydrated = useHydrated();
  const progress = useProgress((s) => s.sessions[session.id]);
  const setStep = useProgress((s) => s.setStep);
  const setCount = useProgress((s) => s.setCount);
  const completeSession = useProgress((s) => s.completeSession);
  const resetSession = useProgress((s) => s.resetSession);

  const totalSteps = session.steps.length;
  const stepIndex = Math.min(progress?.stepIndex ?? 0, totalSteps - 1);
  const step = session.steps[stepIndex];
  const count = progress?.counts[step.id] ?? 0;
  const counterDone = !step.counter || count >= step.counter.total;
  const isLastStep = stepIndex === totalSteps - 1;

  useWakeLock(hydrated);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stepIndex]);

  if (!hydrated) return <Skeleton />;

  if (progress?.completed) {
    return (
      <CompletedView
        session={session}
        nextSession={nextSession}
        onRepeat={() => resetSession(session.id)}
      />
    );
  }

  const goNext = () => {
    if (isLastStep) completeSession(session.id);
    else setStep(session.id, stepIndex + 1);
  };

  const goBack = () => setStep(session.id, Math.max(0, stepIndex - 1));

  return (
    <div className="min-h-dvh">
      <header className="pt-safe sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            aria-label="Kembali ke beranda"
            className="-ml-2 flex size-11 items-center justify-center rounded-full active:bg-surface-muted"
          >
            <ArrowLeftIcon className="size-6" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold leading-tight">
              {session.title}
            </p>
            <p className="text-sm text-muted">
              Langkah {stepIndex + 1} dari {totalSteps}
            </p>
          </div>
        </div>
        <div className="mx-auto flex max-w-xl gap-1 px-4 pb-3">
          {session.steps.map((s, index) => (
            <span
              key={s.id}
              className={`h-1.5 flex-1 rounded-full ${
                index <= stepIndex ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-xl space-y-6 px-4 pb-48 pt-5">
        <div>
          {step.counter && !counterDone && stepIndex > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="mb-2 flex items-center gap-1 text-sm font-semibold text-muted"
            >
              <ArrowLeftIcon className="size-4" /> Langkah sebelumnya
            </button>
          )}
          {step.optional && (
            <span className="mb-2 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
              Opsional · sunnah jika memungkinkan
            </span>
          )}
          <h1 className="text-2xl font-extrabold leading-tight">{step.title}</h1>
        </div>

        {step.counter && (
          <CounterPanel
            counter={step.counter}
            count={count}
            onUndo={() => setCount(session.id, step.id, Math.max(0, count - 1))}
          />
        )}

        <StepContent step={step} />
      </main>

      <footer className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-xl space-y-3 px-4 pt-3">
          {step.counter && !counterDone ? (
            <CounterTapButton
              counter={step.counter}
              count={count}
              onTap={() => setCount(session.id, step.id, count + 1)}
            />
          ) : (
            <div className="flex gap-3">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="Langkah sebelumnya"
                  className="flex min-h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border active:bg-surface-muted"
                >
                  <ArrowLeftIcon className="size-6" />
                </button>
              )}
              {step.optional && (
                <button
                  type="button"
                  onClick={goNext}
                  className="min-h-16 shrink-0 rounded-2xl border border-border px-5 font-semibold text-muted active:bg-surface-muted"
                >
                  Lewati
                </button>
              )}
              <button
                type="button"
                onClick={goNext}
                className="flex min-h-16 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-lg font-bold text-primary-foreground active:bg-primary-strong"
              >
                {isLastStep ? "Selesai sesi" : "Lanjut"}
                {isLastStep ? (
                  <CheckIcon className="size-5" />
                ) : (
                  <ArrowRightIcon className="size-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
