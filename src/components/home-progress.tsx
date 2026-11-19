"use client";

import Link from "next/link";
import { sessions } from "@/content/sessions";
import type { SessionId } from "@/content/types";
import { useHydrated } from "@/lib/hooks";
import { useProgress } from "@/lib/progress-store";
import { ArrowRightIcon, CheckCircleIcon } from "./icons";
import { LinkPending } from "./link-pending";
import { Badge, Card, CardContent, Progress } from "./noor-ui";

export const ContinueCard = () => {
  const hydrated = useHydrated();
  const progress = useProgress((s) => s.sessions);
  const lastSessionId = useProgress((s) => s.lastSessionId);

  if (!hydrated) {
    return (
      <div className="h-32 animate-pulse rounded-[var(--radius)] bg-muted" />
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
      <Card className="border-success/40 bg-success/10 shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
            <CheckCircleIcon className="size-7" />
          </span>
          <div>
            <p className="text-xl font-bold text-foreground">
              Alhamdulillah, selesai.
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Semua 6 sesi manasik telah diselesaikan. Semoga umrohmu mabrur.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const started = Boolean(progress[target.id]);
  const stepIndex = progress[target.id]?.stepIndex ?? 0;

  return (
    <Link href={`/sesi/${target.id}/`} className="group relative block">
      <Card className="overflow-hidden border-primary/25 bg-card shadow-sm transition-all active:scale-[0.99] group-hover:border-primary/50 group-hover:shadow-md">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Badge
                variant="outline"
                className="mb-2 rounded-full border-primary/30 bg-primary/10 text-xs font-semibold text-primary"
              >
                {started ? "Lanjutkan sesi" : "Mulai dari sini"}
              </Badge>
              <p className="text-2xl font-bold leading-tight text-card-foreground">
                {target.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {started
                  ? `Langkah ${stepIndex + 1} dari ${target.steps.length} · ${target.subtitle}`
                  : target.subtitle}
              </p>
            </div>
            <span className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform group-hover:translate-x-0.5">
              <ArrowRightIcon className="size-5" />
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Progres manasik</span>
              <span className="tabular-nums">
                {completedCount}/{sessions.length} sesi
              </span>
            </div>
            <Progress value={pct} className="h-2" />
          </div>
        </CardContent>
      </Card>
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
      <Badge
        variant="outline"
        className="gap-1 rounded-full border-success/40 bg-success/10 text-xs text-success-foreground"
      >
        <CheckCircleIcon className="size-3.5" />
        Selesai
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="rounded-full border-warning/40 bg-warning/10 text-xs text-warning-foreground"
    >
      Berjalan
    </Badge>
  );
};
