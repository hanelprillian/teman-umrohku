"use client";

import { useEffect, useRef, useState } from "react";
import type { Counter } from "@/content/types";
import { CheckIcon, UndoIcon } from "./icons";

const TAP_LOCK_MS = 2000;

interface CounterPanelProps {
  counter: Counter;
  count: number;
  onUndo: () => void;
}

export const CounterPanel = ({ counter, count, onUndo }: CounterPanelProps) => {
  const done = count >= counter.total;
  const current = counter.rounds[Math.min(count, counter.total - 1)];

  return (
    <section
      aria-label={`Penghitung ${counter.unit}`}
      className="rounded-3xl border border-border bg-surface p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <div aria-live="polite">
          <p
            key={count}
            className="animate-pop text-5xl font-extrabold tabular-nums text-primary"
          >
            {count}
            <span className="text-2xl font-bold text-muted">/{counter.total}</span>
          </p>
          <p className="mt-1 text-sm font-medium text-muted">
            {counter.unit} selesai
          </p>
        </div>
        {count > 0 && (
          <button
            type="button"
            onClick={onUndo}
            className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-semibold text-muted active:bg-surface-muted"
          >
            <UndoIcon className="size-4" />
            Batalkan 1
          </button>
        )}
      </div>

      <ol className="mt-5 flex justify-between gap-1.5" aria-hidden>
        {counter.rounds.map((round, index) => {
          const isDone = index < count;
          const isCurrent = index === count;
          return (
            <li
              key={`${round.label}-${index}`}
              className={`flex aspect-square flex-1 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                isDone
                  ? "bg-primary text-primary-foreground"
                  : isCurrent
                    ? "border-2 border-primary text-primary"
                    : "border border-border text-muted"
              }`}
            >
              {isDone ? <CheckIcon className="size-4" /> : index + 1}
            </li>
          );
        })}
      </ol>

      <div className="mt-5 rounded-2xl bg-primary-soft px-4 py-3">
        {done ? (
          <p className="text-lg font-bold text-primary-strong">
            Alhamdulillah, {counter.total} {counter.unit} selesai
          </p>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-strong/80">
              Sekarang
            </p>
            <p className="text-xl font-bold text-primary-strong">
              {current.label}
            </p>
            {current.hint && (
              <p className="mt-0.5 text-sm font-medium text-primary-strong/90">
                {current.hint}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

interface CounterStripProps {
  counter: Counter;
  count: number;
  visible: boolean;
  onSelect: () => void;
}

export const CounterStrip = ({ counter, count, visible, onSelect }: CounterStripProps) => {
  const done = count >= counter.total;
  const current = counter.rounds[Math.min(count, counter.total - 1)];

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
        className="mx-auto flex w-full max-w-xl items-center gap-3 border-b border-border bg-surface/95 px-4 py-2.5 text-left shadow-sm backdrop-blur"
      >
        <span className="text-2xl font-extrabold tabular-nums text-primary">
          {count}
          <span className="text-base font-bold text-muted">/{counter.total}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold">
            {done ? `${counter.total} ${counter.unit} selesai` : current.label}
          </span>
          {!done && current.hint && (
            <span className="block truncate text-xs text-muted">{current.hint}</span>
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
}

export const CounterTapButton = ({ counter, count, onTap }: CounterTapButtonProps) => {
  const [locked, setLocked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleTap = () => {
    if (locked) return;
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
      className={`flex min-h-24 w-full flex-col items-center justify-center rounded-3xl px-4 py-3 text-center shadow-lg transition-[transform,background-color] active:scale-[0.98] ${
        locked
          ? "bg-primary-soft text-primary-strong"
          : "bg-primary text-primary-foreground"
      }`}
    >
      {locked ? (
        <span className="flex items-center gap-2 text-xl font-bold">
          <CheckIcon className="size-6" /> Tercatat
        </span>
      ) : (
        <>
          <span className="text-xl font-extrabold">
            Selesai {counter.unit} ke-{count + 1}
          </span>
          <span className="mt-0.5 text-sm font-medium opacity-90">
            Tekan saat: {counter.tapLabel}
          </span>
        </>
      )}
    </button>
  );
};
