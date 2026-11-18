"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Session } from "@/content/types";
import { useHeaderHeightVar } from "@/lib/hooks";
import { ArrowLeftIcon } from "./icons";

interface SessionHeaderProps {
  session: Session;
  stepIndex: number;
  compact?: boolean;
}

export const SessionHeader = ({
  session,
  stepIndex,
  compact = false,
}: SessionHeaderProps) => {
  const headerRef = useRef<HTMLElement>(null);
  useHeaderHeightVar(headerRef);

  return (
    <header
      ref={headerRef}
      className="pt-safe sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur"
    >
      <div
        className={`mx-auto flex max-w-xl items-center gap-3 px-4 ${
          compact ? "py-1.5" : "py-3"
        }`}
      >
        <Link
          href="/"
          aria-label="Kembali ke beranda"
          className="-ml-2 flex size-11 items-center justify-center rounded-full active:bg-surface-muted"
        >
          <ArrowLeftIcon className="size-6" />
        </Link>
        {compact ? (
          <p className="min-w-0 flex-1 truncate text-sm font-semibold">
            {session.title}
            <span className="font-normal text-muted">
              {" "}
              · Langkah {stepIndex + 1}/{session.steps.length}
            </span>
          </p>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold leading-tight">{session.title}</p>
            <p className="text-sm text-muted">
              Langkah {stepIndex + 1} dari {session.steps.length}
            </p>
          </div>
        )}
      </div>
      <div className={`mx-auto flex max-w-xl gap-1 px-4 ${compact ? "pb-2" : "pb-3"}`}>
        {session.steps.map((s, index) => (
          <span
            key={s.id}
            className={`flex-1 rounded-full transition-colors ${compact ? "h-1" : "h-1.5"} ${
              index <= stepIndex ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
    </header>
  );
};
