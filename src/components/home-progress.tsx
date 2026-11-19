"use client";

import Link from "next/link";
import { sessions } from "@/content/sessions";
import type { SessionId } from "@/content/types";
import { useHydrated } from "@/lib/hooks";
import { useProgress } from "@/lib/progress-store";
import { ArrowRightIcon, CheckIcon } from "./icons";
import { LinkPending } from "./link-pending";

export const ContinueCard = () => {
  const hydrated = useHydrated();
  const progress = useProgress((s) => s.sessions);
  const lastSessionId = useProgress((s) => s.lastSessionId);

  if (!hydrated) {
    return (
      <div className="h-44 animate-pulse rounded-[24px] bg-surface-muted" />
    );
  }

  const completedCount = sessions.filter((s) => progress[s.id]?.completed).length;
  const pct = Math.round((completedCount / sessions.length) * 100);

  const lastSession = sessions.find((s) => s.id === lastSessionId);
  const target =
    lastSession && !progress[lastSession.id]?.completed
      ? lastSession
      : sessions.find((s) => !progress[s.id]?.completed);

  if (!target) {
    return (
      <div className="nusuk-kiswah overflow-hidden rounded-[24px] p-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-bright/30 bg-gold-bright/12 px-3 py-1 text-xs font-medium tracking-wide text-gold-bright">
          <CheckIcon className="size-3.5" />
          Umroh selesai
        </span>
        <p className="mt-4 text-2xl font-semibold tracking-tight text-kiswah-fg">
          Alhamdulillah, semua sesi selesai.
        </p>
        <p className="mt-1.5 text-sm text-kiswah-muted">
          Semoga Allah menerima ibadahmu dan menjadikannya umroh yang mabrur.
        </p>
      </div>
    );
  }

  const started = Boolean(progress[target.id]);
  const stepIndex = progress[target.id]?.stepIndex ?? 0;

  return (
    <Link
      href={`/sesi/${target.id}/`}
      className="nusuk-kiswah group relative block overflow-hidden rounded-[24px] p-6 transition-transform active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-bright/30 bg-gold-bright/12 px-3 py-1 text-xs font-medium text-gold-bright">
            <span className="size-1.5 rounded-full bg-gold-bright" />
            {started ? "Sedang berjalan" : "Perjalanan umroh"}
          </span>
          <p className="mt-4 text-[1.75rem] font-semibold leading-tight tracking-tight text-kiswah-fg">
            {target.title}
          </p>
          <p className="mt-1 text-sm text-kiswah-muted">
            {started
              ? `Langkah ${stepIndex + 1} dari ${target.steps.length} · ${target.subtitle}`
              : target.subtitle}
          </p>
        </div>

        <span className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-full bg-gold-bright text-[#14130f] shadow-sm transition-transform group-hover:translate-x-0.5">
          <ArrowRightIcon className="size-5" />
        </span>
      </div>

      <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between text-xs text-kiswah-muted">
          <span>Progres manasik</span>
          <span className="font-medium tabular-nums text-kiswah-fg">
            {completedCount} dari {sessions.length} sesi
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/12">
          <div
            className="h-full rounded-full bg-gold-bright transition-[width] duration-300"
            style={{ width: `${Math.max(pct, started ? 8 : 0)}%` }}
          />
        </div>
      </div>

      <LinkPending />
    </Link>
  );
};

export const SessionMarker = ({
  id,
  index,
}: {
  id: SessionId;
  index: number;
}) => {
  const hydrated = useHydrated();
  const progress = useProgress((s) => s.sessions[id]);

  if (hydrated && progress?.completed) {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rawdah-soft text-rawdah">
        <CheckIcon className="size-4" />
      </span>
    );
  }

  if (hydrated && progress) {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold-soft text-sm font-semibold tabular-nums text-gold">
        {index + 1}
      </span>
    );
  }

  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted/70 text-sm font-medium tabular-nums text-muted">
      {index + 1}
    </span>
  );
};

export const SessionStatus = ({ id }: { id: SessionId }) => {
  const hydrated = useHydrated();
  const progress = useProgress((s) => s.sessions[id]);

  if (!hydrated || !progress) return null;

  if (progress.completed) {
    return (
      <span className="rounded-full bg-rawdah-soft px-2.5 py-0.5 text-xs font-medium text-rawdah">
        Selesai
      </span>
    );
  }

  return (
    <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-medium text-gold">
      Berjalan
    </span>
  );
};
