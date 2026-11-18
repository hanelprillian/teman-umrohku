"use client";

import Link from "next/link";
import { sessions } from "@/content/sessions";
import type { SessionId } from "@/content/types";
import { useHydrated } from "@/lib/hooks";
import { useProgress } from "@/lib/progress-store";
import { ArrowRightIcon, CheckIcon } from "./icons";

export const ContinueCard = () => {
  const hydrated = useHydrated();
  const progress = useProgress((s) => s.sessions);
  const lastSessionId = useProgress((s) => s.lastSessionId);

  if (!hydrated) {
    return <div className="h-28 animate-pulse rounded-3xl bg-surface-muted" />;
  }

  const lastSession = sessions.find((s) => s.id === lastSessionId);
  const target =
    lastSession && !progress[lastSession.id]?.completed
      ? lastSession
      : sessions.find((s) => !progress[s.id]?.completed);

  if (!target) {
    return (
      <div className="rounded-3xl bg-primary-soft p-5 text-primary-strong">
        <p className="text-lg font-bold">Alhamdulillah, semua sesi selesai.</p>
        <p className="mt-1 text-sm">Semoga umrohmu mabrur dan diterima Allah.</p>
      </div>
    );
  }

  const started = Boolean(progress[target.id]);
  const stepIndex = progress[target.id]?.stepIndex ?? 0;

  return (
    <Link
      href={`/sesi/${target.id}/`}
      className="flex items-center gap-4 rounded-3xl bg-primary p-5 text-primary-foreground shadow-lg active:bg-primary-strong"
    >
      <div className="flex-1">
        <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
          {started ? "Lanjutkan" : "Mulai"}
        </p>
        <p className="text-2xl font-extrabold">{target.title}</p>
        <p className="mt-0.5 text-sm opacity-90">
          {started
            ? `Langkah ${stepIndex + 1} dari ${target.steps.length}`
            : target.subtitle}
        </p>
      </div>
      <ArrowRightIcon className="size-7 shrink-0" />
    </Link>
  );
};

export const SessionStatus = ({ id }: { id: SessionId }) => {
  const hydrated = useHydrated();
  const progress = useProgress((s) => s.sessions[id]);

  if (!hydrated || !progress) return null;

  if (progress.completed) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary-strong">
        <CheckIcon className="size-3.5" /> Selesai
      </span>
    );
  }

  return (
    <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent">
      Berjalan
    </span>
  );
};
