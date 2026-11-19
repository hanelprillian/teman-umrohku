"use client";

import { useEffect, useRef, useState } from "react";
import { edges } from "@/lib/hooks";
import { useSettings } from "@/lib/settings-store";
import { ChevronDownIcon, ChevronUpIcon, LockIcon, UnlockIcon } from "./icons";

const PRESS_LOCK_MS = 400;
const SCROLL_STEP_RATIO = 0.8;

export const LockToggle = () => {
  const scrollLock = useSettings((s) => s.scrollLock);
  const setScrollLock = useSettings((s) => s.setScrollLock);

  return (
    <button
      type="button"
      onClick={() => setScrollLock(!scrollLock)}
      aria-pressed={scrollLock}
      aria-label={scrollLock ? "Buka kunci geser" : "Kunci geser, pakai tombol"}
      className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
        scrollLock
          ? "border-primary bg-primary text-primary-foreground shadow-xs"
          : "border-border bg-card text-muted-foreground hover:bg-muted active:bg-muted"
      }`}
    >
      {scrollLock ? (
        <LockIcon className="size-5" />
      ) : (
        <UnlockIcon className="size-5" />
      )}
    </button>
  );
};

const readFooterHeight = () =>
  parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--footer-h"),
  ) || 0;

interface ThumbPadProps {
  /** Active slide position; re-reads the scroller when it changes. */
  position: number;
  getScroller: () => HTMLElement | null | undefined;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * One-hand replacement for swiping: each press scrolls most of a screen, and
 * pages to the neighbouring slide once the content edge is reached.
 */
export const ThumbPad = ({
  position,
  getScroller,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: ThumbPadProps) => {
  const hand = useSettings((s) => s.hand);
  const [edge, setEdge] = useState({ atTop: true, atBottom: true });
  const lockedUntil = useRef(0);
  const scrollerGetter = useRef(getScroller);

  useEffect(() => {
    scrollerGetter.current = getScroller;
  });

  useEffect(() => {
    const scroller = scrollerGetter.current();
    if (!scroller) return;
    const update = () => setEdge(edges(scroller));
    const frame = requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
    scroller.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      scroller.removeEventListener("scroll", update);
    };
  }, [position]);

  const move = (direction: "up" | "down") => {
    const scroller = getScroller();
    if (!scroller) return;
    const now = performance.now();
    if (now < lockedUntil.current) return;
    lockedUntil.current = now + PRESS_LOCK_MS;

    const { atTop, atBottom } = edges(scroller);
    const distance =
      (scroller.clientHeight - readFooterHeight()) * SCROLL_STEP_RATIO;
    if (direction === "down") {
      if (atBottom) onNext();
      else scroller.scrollBy({ top: distance, behavior: "smooth" });
    } else if (atTop) onPrev();
    else scroller.scrollBy({ top: -distance, behavior: "smooth" });
  };

  const pagesDown = edge.atBottom;
  const pagesUp = edge.atTop;
  const buttonClass =
    "flex size-16 items-center justify-center rounded-full border shadow-lg transition-[transform,background-color,opacity] active:scale-95 disabled:opacity-30";

  return (
    <div
      className={`fixed z-20 flex flex-col gap-3 ${hand === "left" ? "start-4" : "end-4"}`}
      style={{
        bottom:
          "calc(max(var(--footer-h, 0px), env(safe-area-inset-bottom)) + 1rem)",
      }}
    >
      <button
        type="button"
        onClick={() => move("up")}
        disabled={pagesUp && !canPrev}
        aria-label={pagesUp ? "Slide sebelumnya" : "Gulir ke atas"}
        className={`${buttonClass} ${
          pagesUp
            ? "border-primary bg-primary/15 text-primary"
            : "border-border bg-card/95 text-card-foreground backdrop-blur"
        }`}
      >
        <ChevronUpIcon className="size-7" weight="bold" />
      </button>
      <button
        type="button"
        onClick={() => move("down")}
        disabled={pagesDown && !canNext}
        aria-label={pagesDown ? "Slide berikutnya" : "Gulir ke bawah"}
        className={`${buttonClass} ${
          pagesDown
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card/95 text-card-foreground backdrop-blur"
        }`}
      >
        <ChevronDownIcon className="size-7" weight="bold" />
      </button>
    </div>
  );
};
