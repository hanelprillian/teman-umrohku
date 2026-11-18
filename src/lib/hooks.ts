"use client";

import { useEffect, useSyncExternalStore } from "react";

const subscribeNoop = () => () => {};

export const useHydrated = () =>
  useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

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
