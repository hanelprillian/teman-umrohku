"use client";

import { rabbanaAtina } from "@/content/duas";
import { useHydrated } from "@/lib/hooks";
import { useProgress } from "@/lib/progress-store";
import { FONT_SCALES, type Theme, useSettings } from "@/lib/settings-store";
import { DuaCard } from "./dua-card";

const themeOptions: { value: Theme; label: string }[] = [
  { value: "system", label: "Otomatis" },
  { value: "light", label: "Terang" },
  { value: "dark", label: "Gelap" },
];

const Toggle = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <label className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-4">
    <span className="font-semibold">{label}</span>
    <input
      type="checkbox"
      role="switch"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="peer sr-only"
    />
    <span className="relative h-8 w-14 shrink-0 rounded-full bg-border transition-colors peer-checked:bg-primary after:absolute after:left-1 after:top-1 after:size-6 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-6 peer-focus-visible:ring-2 peer-focus-visible:ring-primary" />
  </label>
);

export const SettingsPanel = () => {
  const hydrated = useHydrated();
  const settings = useSettings();
  const resetAll = useProgress((s) => s.resetAll);

  if (!hydrated) {
    return <div className="h-96 animate-pulse rounded-3xl bg-surface-muted" />;
  }

  const scaleIndex = FONT_SCALES.indexOf(
    settings.fontScale as (typeof FONT_SCALES)[number],
  );
  const currentIndex = scaleIndex === -1 ? 1 : scaleIndex;

  const handleReset = () => {
    if (window.confirm("Hapus semua progres sesi? Hitungan putaran akan kembali ke 0.")) {
      resetAll();
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
          Ukuran huruf
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Perkecil huruf"
            disabled={currentIndex === 0}
            onClick={() => settings.setFontScale(FONT_SCALES[currentIndex - 1])}
            className="flex size-14 items-center justify-center rounded-2xl border border-border bg-surface text-lg font-bold disabled:opacity-40"
          >
            A−
          </button>
          <div className="flex flex-1 justify-center gap-1.5">
            {FONT_SCALES.map((scale, index) => (
              <span
                key={scale}
                className={`h-2 flex-1 rounded-full ${
                  index <= currentIndex ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Perbesar huruf"
            disabled={currentIndex === FONT_SCALES.length - 1}
            onClick={() => settings.setFontScale(FONT_SCALES[currentIndex + 1])}
            className="flex size-14 items-center justify-center rounded-2xl border border-border bg-surface text-2xl font-bold disabled:opacity-40"
          >
            A+
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
          Tampilan doa
        </h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
          <Toggle
            label="Tampilkan bacaan Latin"
            checked={settings.showLatin}
            onChange={settings.setShowLatin}
          />
          <Toggle
            label="Tampilkan arti"
            checked={settings.showTranslation}
            onChange={settings.setShowTranslation}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
          Tema
        </h2>
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-surface p-1.5">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => settings.setTheme(option.value)}
              aria-pressed={settings.theme === option.value}
              className={`min-h-12 rounded-xl font-semibold ${
                settings.theme === option.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
          Pratinjau
        </h2>
        <DuaCard dua={rabbanaAtina} />
      </section>

      <section>
        <button
          type="button"
          onClick={handleReset}
          className="min-h-14 w-full rounded-2xl border border-danger/40 font-semibold text-danger active:bg-danger-soft"
        >
          Reset semua progres
        </button>
      </section>
    </div>
  );
};
