"use client";

import {
  type RefObject,
  useEffect,
  useLayoutEffect,
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
