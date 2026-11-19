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
import { ArrowRightIcon, CheckIcon, CloseIcon, ShieldIcon } from "./icons";

const groups: { title: string; audience?: Audience }[] = [
  { title: "Pria & wanita" },
  { title: "Khusus pria", audience: "pria" },
  { title: "Khusus wanita", audience: "wanita" },
];

const RuleItem = ({ rule }: { rule: IhramRule }) => (
  <li className="rounded-2xl border border-border bg-surface p-4">
    <p className="text-lg font-bold">{rule.title}</p>
    {rule.detail && <p className="mt-1 text-reading text-muted">{rule.detail}</p>}
    <div className="dalil-section mt-3 border-t border-border pt-3">
      <DalilList items={rule.dalil} />
    </div>
  </li>
);

const IhramRulesContent = () => (
  <div className="space-y-8">
    <p className="rounded-2xl bg-accent-soft px-4 py-3 text-reading">
      Berlaku sejak <strong>niat ihram di miqat</strong> sampai <strong>tahallul</strong>{" "}
      (mencukur/memotong rambut setelah sa&apos;i).
    </p>

    {groups.map((group) => (
      <section key={group.title} data-audience={group.audience}>
        <h3 className="mb-3 text-sm font-medium text-muted">
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
      <h3 className="mb-3 text-sm font-medium text-muted">
        Yang boleh dilakukan
      </h3>
      <ul className="space-y-2.5 rounded-2xl border border-border bg-surface p-4">
        {allowed.map((item) => (
          <li key={item} className="flex gap-3 text-reading">
            <CheckIcon className="mt-1 size-5 shrink-0 text-primary" />
            {item}
          </li>
        ))}
        <li className="dalil-section border-t border-border pt-3">
          <DalilList items={allowedDalil} />
        </li>
      </ul>
    </section>

    <section>
      <h3 className="mb-3 text-sm font-medium text-muted">
        Kalau terlanjur melanggar
      </h3>
      <div className="space-y-3">
        {[forgetting, fidyah].map((item) => (
          <div key={item.text} className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-reading">{item.text}</p>
            <div className="dalil-section mt-3 border-t border-border pt-3">
              <DalilList items={item.dalil} />
            </div>
          </div>
        ))}
        <p className="px-1 text-sm text-muted">
          Untuk kasus yang meragukan, tanyakan langsung kepada pembimbing/ustadz rombongan.
        </p>
      </div>
    </section>
  </div>
);

export const IhramRulesButton = ({ variant }: { variant: "icon" | "pill" | "card" | "row" }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => {
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={open}
          aria-label="Larangan ihram"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border active:bg-surface-muted"
        >
          <ShieldIcon className="size-5 text-accent" />
        </button>
      ) : variant === "pill" ? (
        <button
          type="button"
          onClick={open}
          aria-label="Larangan ihram"
          className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-semibold active:bg-surface-muted"
        >
          <ShieldIcon className="size-4 text-accent" />
          Larangan
        </button>
      ) : (
        <button
          type="button"
          onClick={open}
          className={`flex w-full items-center gap-3 text-left active:bg-surface-muted ${
            variant === "row"
              ? "border-t border-border px-4 py-3.5"
              : "rounded-2xl border border-border bg-surface p-4"
          }`}
        >
          {variant === "card" && (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <ShieldIcon className="size-6" />
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className={`block ${variant === "row" ? "font-medium" : "text-lg font-bold"}`}>
              Larangan ihram
            </span>
            <span className="block text-sm text-muted">Yang tidak boleh, dan fidyahnya</span>
          </span>
          {variant === "card" && <ArrowRightIcon className="size-5 shrink-0 text-muted" />}
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
        className="mx-auto mb-0 mt-auto max-h-[88dvh] w-full max-w-xl overflow-hidden rounded-t-3xl bg-background p-0 text-foreground backdrop:bg-black/60"
      >
        <div className="flex max-h-[88dvh] flex-col">
          <div className="flex items-center gap-3 border-b border-border px-5 py-3">
            <ShieldIcon className="size-6 text-accent" />
            <h2 className="flex-1 text-xl font-extrabold">Larangan ihram</h2>
            <button
              type="button"
              onClick={close}
              aria-label="Tutup"
              className="flex size-11 items-center justify-center rounded-full active:bg-surface-muted"
            >
              <CloseIcon className="size-6" />
            </button>
          </div>
          <div className="pb-safe overflow-y-auto overscroll-contain px-5 pt-5">
            <IhramRulesContent />
          </div>
        </div>
      </dialog>
    </>
  );
};
