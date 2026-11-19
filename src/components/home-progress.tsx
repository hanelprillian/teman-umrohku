"use client";

import Link from "next/link";
import { sessions } from "@/content/sessions";
import type { SessionId } from "@/content/types";
import { useHydrated } from "@/lib/hooks";
import { useProgress } from "@/lib/progress-store";
import { CheckIcon } from "./icons";
import { LinkPending } from "./link-pending";

export const ContinueCard = () => {
  const hydrated = useHydrated();
  const progress = useProgress((s) => s.sessions);
  const lastSessionId = useProgress((s) => s.lastSessionId);

  if (!hydrated) {
    return <div className="h-24 animate-pulse rounded-2xl bg-surface-muted" />;
  }

  const lastSession = sessions.find((s) => s.id === lastSessionId);
  const target =
    lastSession && !progress[lastSession.id]?.completed
      ? lastSession
      : sessions.find((s) => !progress[s.id]?.completed);

  if (!target) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-4 py-4">
        <p className="font-display text-2xl text-primary-strong">Selesai.</p>
        <p className="mt-1 text-sm text-muted">Semoga umrohmu mabrur.</p>
      </div>
    );
  }

  const started = Boolean(progress[target.id]);
  const stepIndex = progress[target.id]?.stepIndex ?? 0;

  return (
    <Link
      href={`/sesi/${target.id}/`}
      className="relative block rounded-2xl border border-border border-l-4 border-l-primary bg-surface px-4 py-4 active:bg-surface-muted"
    >
      <div>
        <p className="text-sm font-medium text-primary-strong">
          {started ? "Lanjutkan" : "Mulai dari sini"}
        </p>
        <p className="font-display text-3xl leading-tight">{target.title}</p>
        <p className="mt-0.5 text-sm text-muted">
          {started
            ? `Langkah ${stepIndex + 1} dari ${target.steps.length}`
            : target.subtitle}
        </p>
      </div>
      <LinkPending />
    </Link>
  );
};

export const SessionStatus = ({ id }: { id: SessionId }) => {
  const hydrated = useHydrated();
  const progress = useProgress((s) => s.sessions[id]);

  if (!hydrated || !progress) return null;

  if (progress.completed) {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-primary-strong">
        <CheckIcon className="size-3.5" /> Selesai
      </span>
    );
  }

  return (
    <span className="text-xs font-medium text-accent">
      Berjalan
    </span>
  );
};
