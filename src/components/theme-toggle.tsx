"use client";

import { useHydrated } from "@/lib/hooks";
import { resolveTheme, useSettings } from "@/lib/settings-store";
import { MoonIcon, SunIcon } from "./icons";

export const ThemeToggle = () => {
  const hydrated = useHydrated();
  const theme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);

  if (!hydrated) return null;

  const current = resolveTheme(theme);
  const next = current === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={current === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-foreground active:bg-surface-muted"
    >
      {current === "dark" ? (
        <SunIcon className="size-5 text-gold" />
      ) : (
        <MoonIcon className="size-5" />
      )}
    </button>
  );
};
