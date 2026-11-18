"use client";

import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const subscribeNoop = () => () => {};

export const useHydrated = () =>
  useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

export const useHeaderHeightVar = (headerRef: RefObject<HTMLElement | null>) => {
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const root = document.documentElement;
    const update = () =>
      root.style.setProperty("--header-h", `${header.offsetHeight}px`);

    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--header-h");
    };
  }, [headerRef]);
};

/** Whether any part of `element` is visible below the sticky session header. */
export const useVisibleBelowHeader = (element: HTMLElement | null) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!element) return;
    const headerHeight =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
      ) || 0;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: `-${headerHeight}px 0px 0px 0px` },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return element ? visible : false;
};

const SWIPE_MIN_PX = 50;
const WHEEL_MIN_DELTA = 40;
const WHEEL_IDLE_MS = 200;
const PAGE_LOCK_MS = 450;

const edges = (scroller: HTMLElement) => ({
  atTop: scroller.scrollTop <= 1,
  atBottom: scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2,
});

/**
 * Pages between slides only when a gesture *starts* at the edge of the active
 * slide's scroller, so the swipe that reaches the end of long content never
 * also turns the page.
 */
export const usePagedSwipe = ({
  stage,
  getScroller,
  onNext,
  onPrev,
}: {
  stage: HTMLElement | null;
  getScroller: () => HTMLElement | null | undefined;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const handlers = useRef({ getScroller, onNext, onPrev });

  useEffect(() => {
    handlers.current = { getScroller, onNext, onPrev };
  });

  useEffect(() => {
    if (!stage) return;

    let lockedUntil = 0;
    const page = (direction: "next" | "prev") => {
      if (performance.now() < lockedUntil) return;
      lockedUntil = performance.now() + PAGE_LOCK_MS;
      if (direction === "next") handlers.current.onNext();
      else handlers.current.onPrev();
    };

    let touch: { x: number; y: number; atTop: boolean; atBottom: boolean } | null = null;

    const onTouchStart = (event: TouchEvent) => {
      const scroller = handlers.current.getScroller();
      if (!scroller || event.touches.length !== 1) {
        touch = null;
        return;
      }
      const { clientX, clientY } = event.touches[0];
      touch = { x: clientX, y: clientY, ...edges(scroller) };
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!touch) return;
      const { clientX, clientY } = event.changedTouches[0];
      const dy = touch.y - clientY;
      const dx = touch.x - clientX;
      if (Math.abs(dy) >= SWIPE_MIN_PX && Math.abs(dy) > Math.abs(dx)) {
        if (dy > 0 && touch.atBottom) page("next");
        if (dy < 0 && touch.atTop) page("prev");
      }
      touch = null;
    };

    let wheel: { atTop: boolean; atBottom: boolean; delta: number; done: boolean } | null =
      null;
    let wheelIdle: ReturnType<typeof setTimeout> | undefined;

    const onWheel = (event: WheelEvent) => {
      const scroller = handlers.current.getScroller();
      if (!scroller) return;
      clearTimeout(wheelIdle);
      wheelIdle = setTimeout(() => {
        wheel = null;
      }, WHEEL_IDLE_MS);

      wheel ??= { ...edges(scroller), delta: 0, done: false };
      if (wheel.done) return;
      if ((event.deltaY > 0 && wheel.atBottom) || (event.deltaY < 0 && wheel.atTop)) {
        wheel.delta += event.deltaY;
      }
      if (Math.abs(wheel.delta) >= WHEEL_MIN_DELTA) {
        wheel.done = true;
        page(wheel.delta > 0 ? "next" : "prev");
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.defaultPrevented) return;
      const scroller = handlers.current.getScroller();
      if (!scroller) return;
      const { atTop, atBottom } = edges(scroller);
      if (["ArrowDown", "PageDown"].includes(event.key) && atBottom) page("next");
      if (["ArrowUp", "PageUp"].includes(event.key) && atTop) page("prev");
    };

    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchend", onTouchEnd, { passive: true });
    stage.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(wheelIdle);
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchend", onTouchEnd);
      stage.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [stage]);
};

export const useNow = (intervalMs: number) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
};

export const useWakeLock = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled || !("wakeLock" in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;
    let disposed = false;

    const request = async () => {
      try {
        const next = await navigator.wakeLock.request("screen");
        if (disposed) {
          await next.release();
          return;
        }
        sentinel = next;
      } catch {
        // Denied (e.g. low battery mode); the app still works without it.
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void request();
    };

    void request();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      void sentinel?.release();
    };
  }, [enabled]);
};
