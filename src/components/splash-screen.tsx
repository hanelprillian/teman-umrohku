"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SPLASH_SESSION_KEY } from "@/lib/settings-store";
import { MarkIcon } from "./icons";

const HOLD_MS = 1550;
const REDUCED_HOLD_MS = 550;
const FADE_MS = 380;

export const SplashScreen = () => {
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismiss = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    timers.current.forEach(clearTimeout);
    setExiting(true);
    const id = setTimeout(() => {
      document.documentElement.removeAttribute("data-splash");
    }, FADE_MS);
    timers.current = [id];
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-splash")) return;

    try {
      sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    } catch {
      // Ignore storage failures in private browsing.
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const id = setTimeout(dismiss, reduced ? REDUCED_HOLD_MS : HOLD_MS);
    timers.current.push(id);

    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, [dismiss]);

  return (
    <div
      role="presentation"
      onClick={dismiss}
      className={`splash-screen nusuk-kiswah fixed inset-0 z-[100] flex-col items-center justify-center overflow-hidden border-0 px-6 text-center transition-opacity duration-[380ms] ease-out ${
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Expanding Noor light halo behind the Ka'bah emblem */}
      <div
        aria-hidden
        className="splash-glow pointer-events-none absolute size-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212, 181, 95, 0.28) 0%, rgba(212, 181, 95, 0.08) 42%, rgba(212, 181, 95, 0) 70%)",
        }}
      />

      <div className="splash-rise relative flex flex-col items-center">
        <span className="flex size-20 items-center justify-center rounded-[26px] border border-gold-bright/35 bg-[#151618]/90 text-kiswah-fg shadow-2xl">
          <MarkIcon className="size-10" />
        </span>

        <p
          dir="rtl"
          lang="ar"
          className="mt-7 font-arabic text-2xl leading-relaxed text-gold-bright/90"
        >
          لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ
        </p>

        <p className="mt-2 text-2xl font-semibold tracking-tight text-kiswah-fg">
          Teman Umrohku
        </p>
        <p className="mt-1 text-sm text-kiswah-muted">
          Panduan manasik di saku
        </p>
      </div>

      <span className="pb-safe absolute bottom-6 text-xs text-kiswah-muted/60">
        Ketuk untuk lewati
      </span>
    </div>
  );
};
