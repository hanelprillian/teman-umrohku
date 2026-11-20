import { useEffect, useState } from "react";
import { useProgress } from "./progress-store";
import { useSettings } from "./settings-store";

/** True after zustand persist has rehydrated from AsyncStorage. */
export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(
    () =>
      useProgress.persist.hasHydrated() && useSettings.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubProgress = useProgress.persist.onFinishHydration(() => {
      if (useSettings.persist.hasHydrated()) setHydrated(true);
    });
    const unsubSettings = useSettings.persist.onFinishHydration(() => {
      if (useProgress.persist.hasHydrated()) setHydrated(true);
    });
    if (
      useProgress.persist.hasHydrated() &&
      useSettings.persist.hasHydrated()
    ) {
      setHydrated(true);
    }
    return () => {
      unsubProgress();
      unsubSettings();
    };
  }, []);

  return hydrated;
};

export const useNow = (intervalMs: number) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
};
