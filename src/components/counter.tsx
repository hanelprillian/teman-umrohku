"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Audience, Counter, RoundHint } from "@/content/types";
import { useNow } from "@/lib/hooks";
import { useSettings } from "@/lib/settings-store";
import { ActionButton } from "./action-button";
import { CheckIcon, ExpandIcon, UndoIcon } from "./icons";
import { Badge, Button, Card, CardContent, Progress } from "./noor-ui";

const TAP_LOCK_MS = 2000;
const MOUNT_GUARD_MS = 700;
const UNDO_TOAST_MS = 5000;

const timeFormat = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
});
const formatTime = (time: number) => (time ? timeFormat.format(time) : "—");
const formatMinutes = (ms: number) => {
  const minutes = Math.floor(ms / 60_000);
  return minutes < 1 ? "<1 mnt" : `${minutes} mnt`;
};

const currentRound = (counter: Counter, count: number) =>
  counter.rounds[Math.min(count, counter.total - 1)];

/**
 * Full-screen counter state. With the auto setting on, it opens on every step
 * whose counter is still pending until the user closes it for that step.
 */
export const useCounterFocus = (
  stepId: string | undefined,
  pending: boolean,
) => {
  const autoFocusCounter = useSettings((s) => s.autoFocusCounter);
  const [manual, setManual] = useState(false);
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);

  return {
    open:
      stepId !== undefined &&
      (manual || (autoFocusCounter && pending && dismissedFor !== stepId)),
    expand: () => setManual(true),
    close: () => {
      setManual(false);
      setDismissedFor(stepId ?? null);
    },
  };
};

const audienceLabel: Record<Audience, string> = {
  pria: "Pria",
  wanita: "Wanita",
};

/** Gender-specific hints are hidden via CSS (`data-audience`) per the personalization setting. */
const RoundHints = ({
  hints,
  className = "",
  truncate = false,
}: {
  hints?: RoundHint[];
  className?: string;
  truncate?: boolean;
}) => {
  if (!hints?.length) return null;

  return (
    <span className={`block ${truncate ? "truncate" : ""} ${className}`}>
      {hints.map((hint) => (
        <span
          key={`${hint.audience}-${hint.text}`}
          data-audience={hint.audience}
          className={
            truncate
              ? "inline [&:not(:first-child)]:before:content-['_·_']"
              : "block"
          }
        >
          {hint.audience && (
            <span className="audience-prefix">
              {audienceLabel[hint.audience]}:{" "}
            </span>
          )}
          {hint.text}
        </span>
      ))}
    </span>
  );
};

const RoundDots = ({
  counter,
  count,
  large = false,
}: {
  counter: Counter;
  count: number;
  large?: boolean;
}) => (
  <ol
    className={`flex justify-between ${large ? "gap-2" : "gap-1.5"}`}
    aria-hidden
  >
    {counter.rounds.map((round, index) => {
      const isDone = index < count;
      const isCurrent = index === count;
      return (
        <li
          key={`${round.label}-${index}`}
          className={`flex aspect-square flex-1 items-center justify-center rounded-full font-bold transition-colors ${
            large ? "text-lg" : "text-sm"
          } ${
            isDone
              ? "bg-primary text-primary-foreground shadow-xs"
              : isCurrent
                ? "border-2 border-primary bg-primary/10 text-primary"
                : "border border-border bg-muted/40 text-muted-foreground"
          }`}
        >
          {isDone ? (
            <CheckIcon className={large ? "size-5" : "size-4"} />
          ) : (
            index + 1
          )}
        </li>
      );
    })}
  </ol>
);

const LastLap = ({
  laps,
  className = "",
}: {
  laps: number[];
  className?: string;
}) => {
  const now = useNow(30_000);
  const last = laps.at(-1);
  if (!last) return null;

  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      Terakhir tercatat{" "}
      <span className="font-semibold text-foreground">{formatTime(last)}</span>
      {" · "}
      {formatMinutes(now - last)} lalu
    </p>
  );
};

const LapHistory = ({ counter, laps }: { counter: Counter; laps: number[] }) => (
  <details className="group mt-4">
    <summary className="flex cursor-pointer items-center justify-between gap-3">
      <LastLap laps={laps} />
      <span className="shrink-0 text-sm font-semibold text-primary group-open:hidden">
        Riwayat
      </span>
    </summary>
    <ol className="mt-3 space-y-1.5 rounded-[var(--radius-md)] border border-border bg-muted/40 p-3 text-sm">
      {laps.map((time, index) => {
        const previous = laps[index - 1];
        return (
          <li key={index} className="flex justify-between gap-3">
            <span className="capitalize text-muted-foreground">
              {counter.unit} {index + 1}
            </span>
            <span className="tabular-nums font-medium">
              {formatTime(time)}
              {previous > 0 && time > 0 && (
                <span className="text-muted-foreground">
                  {" "}
                  ({formatMinutes(time - previous)})
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  </details>
);

interface CounterPanelProps {
  counter: Counter;
  count: number;
  laps: number[];
  onUndo: () => void;
  onExpand: () => void;
}

export const CounterPanel = ({
  counter,
  count,
  laps,
  onUndo,
  onExpand,
}: CounterPanelProps) => {
  const done = count >= counter.total;
  const current = currentRound(counter, count);
  const pct = Math.min(100, Math.round((count / counter.total) * 100));

  return (
    <Card
      aria-label={`Penghitung ${counter.unit}`}
      className="overflow-hidden border-border bg-card shadow-sm"
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div aria-live="polite">
            <p
              key={count}
              className="animate-pop text-5xl font-extrabold tabular-nums text-primary"
            >
              {count}
              <span className="text-2xl font-bold text-muted-foreground">
                /{counter.total}
              </span>
            </p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {counter.unit} selesai
            </p>
          </div>
          {count > 0 && (
            <ActionButton
              onAction={onUndo}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-background px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted active:bg-muted"
            >
              <UndoIcon className="size-4" />
              Batalkan 1
            </ActionButton>
          )}
        </div>

        <Progress value={pct} className="mt-4 h-1.5" />

        <div className="mt-4">
          <RoundDots counter={counter} count={count} />
        </div>

        <div
          className={`mt-5 rounded-[var(--radius-md)] border px-4 py-3 ${
            done
              ? "border-success/35 bg-success/10 text-success-foreground"
              : "border-primary/25 bg-primary/10 text-foreground"
          }`}
        >
          {done ? (
            <p className="text-lg font-bold">
              Alhamdulillah, {counter.total} {counter.unit} selesai
            </p>
          ) : (
            <>
              <Badge
                variant="outline"
                className="mb-1 rounded-full border-primary/30 bg-card/80 text-[11px] font-semibold text-primary"
              >
                Sekarang
              </Badge>
              <p className="text-xl font-bold text-foreground">
                {current.label}
              </p>
              <RoundHints
                hints={current.hints}
                className="mt-0.5 text-sm font-medium text-muted-foreground"
              />
            </>
          )}
        </div>

        {laps.length > 0 && <LapHistory counter={counter} laps={laps} />}

        {!done && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onExpand}
            className="mt-4 h-12 w-full gap-2 font-semibold"
          >
            <ExpandIcon className="size-5" /> Mode hitung layar penuh
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

interface CounterStripProps {
  counter: Counter;
  count: number;
  visible: boolean;
  onSelect: () => void;
}

export const CounterStrip = ({
  counter,
  count,
  visible,
  onSelect,
}: CounterStripProps) => {
  const done = count >= counter.total;
  const current = currentRound(counter, count);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 z-20 transition-[opacity,transform] duration-200 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      }`}
      style={{ top: "var(--header-h, 0px)" }}
    >
      <button
        type="button"
        tabIndex={visible ? 0 : -1}
        onClick={onSelect}
        className="mx-auto flex w-full max-w-xl items-center gap-3 border-b border-border bg-card/95 px-4 py-2.5 text-start shadow-sm backdrop-blur"
      >
        <span className="text-2xl font-extrabold tabular-nums text-primary">
          {count}
          <span className="text-base font-bold text-muted-foreground">
            /{counter.total}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-card-foreground">
            {done ? `${counter.total} ${counter.unit} selesai` : current.label}
          </span>
          {!done && (
            <RoundHints
              hints={current.hints}
              className="text-xs text-muted-foreground"
              truncate
            />
          )}
        </span>
        <span className="flex gap-1" aria-hidden>
          {counter.rounds.map((round, index) => (
            <span
              key={`${round.label}-${index}`}
              className={`size-2.5 rounded-full ${
                index < count
                  ? "bg-primary"
                  : index === count
                    ? "border-2 border-primary"
                    : "bg-border"
              }`}
            />
          ))}
        </span>
      </button>
    </div>
  );
};

interface CounterTapButtonProps {
  counter: Counter;
  count: number;
  onTap: () => void;
  large?: boolean;
}

export const CounterTapButton = ({
  counter,
  count,
  onTap,
  large = false,
}: CounterTapButtonProps) => {
  const [locked, setLocked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = performance.now();
    return () => clearTimeout(timer.current);
  }, []);

  const handleTap = () => {
    // Swallows the second half of a double tap on the button this one replaced (e.g. "Lanjut").
    if (locked || performance.now() - mountedAt.current < MOUNT_GUARD_MS) return;
    onTap();
    navigator.vibrate?.(40);
    setLocked(true);
    timer.current = setTimeout(() => setLocked(false), TAP_LOCK_MS);
  };

  return (
    <button
      type="button"
      onClick={handleTap}
      disabled={locked}
      className={`flex w-full flex-col items-center justify-center rounded-[var(--radius)] px-4 text-center shadow-lg transition-[transform,background-color] active:scale-[0.98] ${
        large ? "min-h-[38dvh] py-3" : "min-h-16 py-2"
      } ${
        locked
          ? "border border-success/40 bg-success/15 text-success-foreground"
          : "bg-primary text-primary-foreground hover:bg-primary/92"
      }`}
    >
      {locked ? (
        <span
          className={`flex items-center gap-2 font-bold ${large ? "text-3xl" : "text-lg"}`}
        >
          <CheckIcon className={large ? "size-8" : "size-5"} /> Tercatat
        </span>
      ) : (
        <>
          <span
            className={`font-extrabold leading-tight ${large ? "text-3xl" : "text-lg"}`}
          >
            Selesai {counter.unit} ke-{count + 1}
          </span>
          <span
            className={`font-medium opacity-90 ${large ? "mt-1 text-lg" : "text-xs"}`}
          >
            Tekan saat: {counter.tapLabel}
          </span>
        </>
      )}
    </button>
  );
};

export interface LapToast {
  id: number;
  stepId: string;
  count: number;
}

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}

/** Render with a `key` per tap so the timer restarts. */
export const UndoToast = ({ message, onUndo, onDismiss }: UndoToastProps) => {
  const dismiss = useRef(onDismiss);

  useEffect(() => {
    dismiss.current = onDismiss;
  });

  useEffect(() => {
    const id = setTimeout(() => dismiss.current(), UNDO_TOAST_MS);
    return () => clearTimeout(id);
  }, []);

  return (
    <div
      role="status"
      className="relative flex items-center gap-3 overflow-hidden rounded-[var(--radius)] bg-foreground py-2 pe-2 ps-4 text-background shadow-lg"
    >
      <CheckIcon className="size-5 shrink-0" />
      <p className="min-w-0 flex-1 font-semibold first-letter:uppercase">
        {message}
      </p>
      <button
        type="button"
        onClick={onUndo}
        className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-[var(--radius-md)] bg-background px-3 font-bold text-foreground active:opacity-80"
      >
        <UndoIcon className="size-4" /> Batalkan
      </button>
      <span
        aria-hidden
        className="animate-toast-timer absolute inset-x-0 bottom-0 h-1 origin-left bg-primary"
        style={{ animationDuration: `${UNDO_TOAST_MS}ms` }}
      />
    </div>
  );
};

interface CounterFocusProps {
  title: string;
  counter: Counter;
  count: number;
  laps: number[];
  onTap: () => void;
  onClose: () => void;
  toast?: ReactNode;
}

export const CounterFocus = ({
  title,
  counter,
  count,
  laps,
  onTap,
  onClose,
  toast,
}: CounterFocusProps) => {
  const done = count >= counter.total;
  const current = currentRound(counter, count);

  useEffect(() => {
    const { style } = document.body;
    const previous = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = previous;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Hitung ${counter.unit} layar penuh`}
      className="pt-safe fixed inset-0 z-50 flex flex-col bg-background"
    >
      <div className="mx-auto flex w-full max-w-xl items-center gap-3 px-4 py-3">
        <p className="min-w-0 flex-1 truncate font-semibold text-muted-foreground">
          {title}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="min-h-10 shrink-0 rounded-full px-4"
        >
          Tutup
        </Button>
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-6 text-center">
        <p
          key={count}
          aria-live="polite"
          className="animate-pop text-[7rem] font-extrabold leading-none tabular-nums text-primary"
        >
          {count}
          <span className="text-5xl font-bold text-muted-foreground">
            /{counter.total}
          </span>
        </p>
        <RoundDots counter={counter} count={count} large />
        {done ? (
          <p className="text-2xl font-bold text-success">
            Alhamdulillah, {counter.total} {counter.unit} selesai
          </p>
        ) : (
          <div>
            <p className="text-3xl font-extrabold text-foreground">
              {current.label}
            </p>
            <RoundHints
              hints={current.hints}
              className="mt-1 text-lg text-muted-foreground"
            />
          </div>
        )}
        <LastLap laps={laps} />
      </div>

      <div className="pb-safe mx-auto w-full max-w-xl space-y-3 px-4 pt-2">
        {toast}
        {done ? (
          <Button
            type="button"
            variant="primary"
            size="xl"
            onClick={onClose}
            className="h-16 w-full text-lg font-bold"
          >
            Tutup &amp; lanjutkan
          </Button>
        ) : (
          <CounterTapButton counter={counter} count={count} onTap={onTap} large />
        )}
      </div>
    </div>
  );
};
