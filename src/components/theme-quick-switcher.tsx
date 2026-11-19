"use client";

import { useEffect, useRef, useState } from "react";
import { useHydrated } from "@/lib/hooks";
import { NOOR_THEMES, type Theme, useSettings } from "@/lib/settings-store";
import {
  CheckCircleIcon,
  DesktopIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
} from "./icons";
import { Button } from "./noor-ui";

const modes: { value: Theme; label: string; icon: typeof SunIcon }[] = [
  { value: "system", label: "Auto", icon: DesktopIcon },
  { value: "light", label: "Terang", icon: SunIcon },
  { value: "dark", label: "Gelap", icon: MoonIcon },
];

export const ThemeQuickSwitcher = () => {
  const hydrated = useHydrated();
  const noorTheme = useSettings((s) => s.noorTheme);
  const theme = useSettings((s) => s.theme);
  const setNoorTheme = useSettings((s) => s.setNoorTheme);
  const setTheme = useSettings((s) => s.setTheme);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!hydrated) return null;

  return (
    <div ref={wrapRef} className="relative">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Ganti tema Noor UI"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="size-10 rounded-full"
      >
        <PaletteIcon className="size-5 text-primary" />
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Pilih tema Noor UI"
          className="absolute end-0 top-12 z-40 w-64 rounded-[var(--radius)] border border-border bg-popover p-3 text-popover-foreground shadow-xl"
        >
          <p className="mb-2 px-1 text-xs font-semibold text-muted-foreground">
            Tema Noor UI
          </p>
          <div className="space-y-1">
            {NOOR_THEMES.map((preset) => {
              const active = noorTheme === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setNoorTheme(preset.id)}
                  className={`flex w-full items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-start text-sm transition-colors ${
                    active
                      ? "bg-primary/12 font-semibold text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="flex gap-1" aria-hidden>
                    {preset.swatches.map((c, idx) => (
                      <span
                        key={idx}
                        className="size-3 rounded-full border border-black/15"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </span>
                  <span className="flex-1">{preset.name}</span>
                  {active && <CheckCircleIcon className="size-4 text-primary" />}
                </button>
              );
            })}
          </div>

          <div className="mt-2.5 border-t border-border pt-2.5">
            <div className="grid grid-cols-3 gap-1 rounded-[var(--radius-md)] bg-muted/70 p-1">
              {modes.map(({ value, label, icon: Icon }) => {
                const active = theme === value;
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={noorTheme === "futuristic"}
                    onClick={() => setTheme(value)}
                    className={`flex items-center justify-center gap-1 rounded-[var(--radius-sm)] py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${
                      active
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
