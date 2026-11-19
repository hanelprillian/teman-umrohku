"use client";

import { useRef } from "react";
import {
  allowed,
  allowedDalil,
  fidyah,
  forgetting,
  type IhramRule,
  prohibitions,
} from "@/content/larangan";
import type { Audience } from "@/content/types";
import { DalilList } from "./dalil";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CloseIcon,
  ShieldIcon,
} from "./icons";
import { Button, Callout, Card, CardContent } from "./noor-ui";

const groups: { title: string; audience?: Audience }[] = [
  { title: "Pria & wanita" },
  { title: "Khusus pria", audience: "pria" },
  { title: "Khusus wanita", audience: "wanita" },
];

const RuleItem = ({ rule }: { rule: IhramRule }) => (
  <li>
    <Card className="bg-card shadow-xs">
      <CardContent className="p-4">
        <p className="text-base font-bold text-card-foreground">{rule.title}</p>
        {rule.detail && (
          <p className="mt-1 text-reading text-muted-foreground">
            {rule.detail}
          </p>
        )}
        <div className="dalil-section mt-3 border-t border-border pt-3">
          <DalilList items={rule.dalil} />
        </div>
      </CardContent>
    </Card>
  </li>
);

const IhramRulesContent = () => (
  <div className="space-y-8">
    <Callout type="warning" className="my-0 text-reading">
      Berlaku sejak <strong>niat ihram di miqat</strong> sampai{" "}
      <strong>tahallul</strong> (mencukur/memotong rambut setelah sa&apos;i).
    </Callout>

    {groups.map((group) => (
      <section key={group.title} data-audience={group.audience}>
        <h3 className="mb-3 px-1 text-sm font-semibold text-muted-foreground">
          {group.title}
        </h3>
        <ol className="space-y-3">
          {prohibitions
            .filter((rule) => rule.audience === group.audience)
            .map((rule) => (
              <RuleItem key={rule.title} rule={rule} />
            ))}
        </ol>
      </section>
    ))}

    <section>
      <h3 className="mb-3 px-1 text-sm font-semibold text-muted-foreground">
        Yang boleh dilakukan
      </h3>
      <Card>
        <CardContent className="p-4">
          <ul className="space-y-2.5">
            {allowed.map((item) => (
              <li key={item} className="flex gap-3 text-reading">
                <CheckCircleIcon className="mt-1 size-5 shrink-0 text-success" />
                <span>{item}</span>
              </li>
            ))}
            <li className="dalil-section border-t border-border pt-3">
              <DalilList items={allowedDalil} />
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>

    <section>
      <h3 className="mb-3 px-1 text-sm font-semibold text-muted-foreground">
        Kalau terlanjur melanggar
      </h3>
      <div className="space-y-3">
        {[forgetting, fidyah].map((item) => (
          <Card key={item.text}>
            <CardContent className="p-4">
              <p className="text-reading">{item.text}</p>
              <div className="dalil-section mt-3 border-t border-border pt-3">
                <DalilList items={item.dalil} />
              </div>
            </CardContent>
          </Card>
        ))}
        <p className="px-1 text-sm text-muted-foreground">
          Untuk kasus yang meragukan, tanyakan langsung kepada pembimbing/ustadz
          rombongan.
        </p>
      </div>
    </section>
  </div>
);

export const IhramRulesButton = ({
  variant,
}: {
  variant: "icon" | "pill" | "card" | "row";
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => {
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      {variant === "icon" ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={open}
          aria-label="Larangan ihram"
          className="size-10 shrink-0 rounded-full"
        >
          <ShieldIcon className="size-5 text-warning" />
        </Button>
      ) : variant === "pill" ? (
        <Button
          type="button"
          variant="outline"
          onClick={open}
          aria-label="Larangan ihram"
          className="min-h-10 shrink-0 rounded-full px-3 text-sm font-semibold"
        >
          <ShieldIcon className="size-4 text-warning" />
          Larangan
        </Button>
      ) : (
        <button
          type="button"
          onClick={open}
          className={`flex w-full items-center gap-3.5 text-start transition-colors hover:bg-muted/50 active:bg-muted ${
            variant === "row"
              ? "px-4 py-3.5"
              : "rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm"
          }`}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-warning/15 text-warning-foreground">
            <ShieldIcon className="size-5 text-warning" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-card-foreground">
              Larangan ihram
            </span>
            <span className="block text-sm text-muted-foreground">
              Yang tidak boleh &amp; fidyahnya
            </span>
          </span>
          {variant === "card" ? (
            <ArrowRightIcon className="size-5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
          )}
        </button>
      )}

      <dialog
        ref={dialogRef}
        aria-label="Larangan ihram"
        onClose={() => {
          document.body.style.overflow = "";
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="mx-auto mb-0 mt-auto max-h-[88dvh] w-full max-w-xl overflow-hidden rounded-t-[var(--radius)] border border-b-0 border-border bg-background p-0 text-foreground shadow-xl backdrop:bg-black/60 backdrop:backdrop-blur-xs"
      >
        <div className="flex max-h-[88dvh] flex-col">
          <div className="flex items-center gap-3 border-b border-border bg-card px-5 py-3.5">
            <ShieldIcon className="size-6 text-warning" />
            <h2 className="flex-1 text-lg font-bold">Larangan ihram</h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={close}
              aria-label="Tutup"
              className="size-10 rounded-full"
            >
              <CloseIcon className="size-5" />
            </Button>
          </div>
          <div className="pb-safe overflow-y-auto overscroll-contain px-5 pt-5">
            <IhramRulesContent />
          </div>
        </div>
      </dialog>
    </>
  );
};
