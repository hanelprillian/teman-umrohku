"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";
import type { Session } from "@/content/types";
import { useHeightVar } from "@/lib/hooks";
import { ArrowLeftIcon } from "./icons";
import { IhramRulesButton } from "./ihram-rules";
import { LinkPending } from "./link-pending";

interface SessionHeaderProps {
  session: Session;
  stepIndex: number;
  compact?: boolean;
  actions?: ReactNode;
}

export const SessionHeader = ({
  session,
  stepIndex,
  compact = false,
  actions,
}: SessionHeaderProps) => {
  const [header, setHeader] = useState<HTMLElement | null>(null);
  useHeightVar(header, "--header-h");

  return (
    <header
      ref={setHeader}
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
          className="relative -ms-1 flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs transition-colors hover:bg-muted active:bg-muted"
        >
          <ArrowLeftIcon className="size-5" />
          <LinkPending />
        </Link>
        {compact ? (
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
            {session.title}
            <span className="font-normal text-muted-foreground">
              {" "}
              · Langkah {stepIndex + 1}/{session.steps.length}
            </span>
          </p>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold leading-tight text-foreground">
              {session.title}
            </p>
            <p className="text-sm text-muted-foreground">
              Langkah {stepIndex + 1} dari {session.steps.length}
            </p>
          </div>
        )}
        {actions}
        <IhramRulesButton variant={compact ? "icon" : "pill"} />
      </div>
      <div
        className={`mx-auto flex max-w-xl gap-1 px-4 ${compact ? "pb-2" : "pb-3"}`}
      >
        {session.steps.map((s, index) => (
          <span
            key={s.id}
            className={`flex-1 rounded-full transition-colors ${compact ? "h-1" : "h-1.5"} ${
              index <= stepIndex ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </header>
  );
};
