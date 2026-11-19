"use client";

import { rabbanaAtina } from "@/content/duas";
import { useHydrated } from "@/lib/hooks";
import { useProgress } from "@/lib/progress-store";
import type { ReactNode } from "react";
import {
  ARABIC_SCALES,
  type Density,
  FONT_SCALES,
  nearestScaleIndex,
  type Theme,
  useSettings,
} from "@/lib/settings-store";
import { DuaCard } from "./dua-card";
import { PersonalizationFields, Toggle } from "./personalization";

const themeOptions: { value: Theme; label: string }[] = [
  { value: "system", label: "Otomatis" },
  { value: "light", label: "Terang" },
  { value: "dark", label: "Gelap" },
];

const densityOptions: { value: Density; label: string }[] = [
  { value: "compact", label: "Rapat" },
  { value: "comfortable", label: "Nyaman" },
  { value: "loose", label: "Lega" },
];

interface ScaleControlProps {
  label: string;
  sample: ReactNode;
  scales: readonly number[];
  value: number;
  onChange: (value: number) => void;
}

const ScaleControl = ({ label, sample, scales, value, onChange }: ScaleControlProps) => {
  const index = nearestScaleIndex(scales, value);

  return (
    <div className="space-y-3 p-4">
      <p className="font-semibold">{label}</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Perkecil ${label}`}
          disabled={index === 0}
          onClick={() => onChange(scales[index - 1])}
          className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border text-xl font-bold disabled:opacity-40"
        >
          −
        </button>
        <div className="flex flex-1 items-center gap-1.5">
          {scales.map((scale, scaleIndex) => (
            <span
              key={scale}
              className={`h-2 flex-1 rounded-full ${
                scaleIndex <= index ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label={`Perbesar ${label}`}
          disabled={index === scales.length - 1}
          onClick={() => onChange(scales[index + 1])}
          className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border text-xl font-bold disabled:opacity-40"
        >
          +
        </button>
        <span className="flex w-8 justify-center text-primary" aria-hidden>
          {sample}
        </span>
      </div>
    </div>
  );
};

export const SettingsPanel = () => {
  const hydrated = useHydrated();
  const settings = useSettings();
  const resetAll = useProgress((s) => s.resetAll);

  if (!hydrated) {
    return <div className="h-96 animate-pulse rounded-3xl bg-surface-muted" />;
  }

  const handleReset = () => {
    if (window.confirm("Hapus semua progres sesi? Hitungan putaran akan kembali ke 0.")) {
      resetAll();
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-medium text-muted">
          Personalisasi
        </h2>
        <PersonalizationFields
          value={settings}
          onChange={(patch) =>
            settings.setPersonalization(
              patch.scrollLock ? { ...patch, immersive: true } : patch,
            )
          }
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted">
          Ukuran huruf
        </h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
          <ScaleControl
            label="Huruf Arab"
            sample={
              <span dir="rtl" lang="ar" className="font-arabic text-3xl leading-none">
                أَ
              </span>
            }
            scales={ARABIC_SCALES}
            value={settings.arabicScale}
            onChange={settings.setArabicScale}
          />
          <ScaleControl
            label="Teks (Latin, arti, petunjuk)"
            sample={<span className="text-lg font-bold">A</span>}
            scales={FONT_SCALES}
            value={settings.fontScale}
            onChange={settings.setFontScale}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted">
          Kerapatan tampilan
        </h2>
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-surface p-1.5">
          {densityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => settings.setDensity(option.value)}
              aria-pressed={settings.density === option.value}
              className={`min-h-12 rounded-xl font-semibold ${
                settings.density === option.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="mt-2 px-1 text-sm text-muted">
          Atur jarak dan ukuran tombol. Pilih &ldquo;Rapat&rdquo; agar bacaan lebih banyak
          terlihat saat huruf besar.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted">
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
          <Toggle
            label="Tampilkan dalil & sumber"
            checked={settings.showDalil}
            onChange={settings.setShowDalil}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted">
          Mode tampilan sesi
        </h2>
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-surface p-1.5">
          {[
            { value: false, label: "Standar" },
            { value: true, label: "Imersif" },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => settings.setImmersive(option.value)}
              aria-pressed={settings.immersive === option.value}
              className={`min-h-12 rounded-xl font-semibold ${
                settings.immersive === option.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="mt-2 px-1 text-sm text-muted">
          {settings.immersive
            ? "Satu layar untuk setiap langkah dan setiap doa, fokus pada bacaan Arab dan artinya. Geser ke atas untuk lanjut."
            : "Pindah langkah dengan tombol Lanjut di bagian bawah layar."}
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted">
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
        <h2 className="mb-3 text-sm font-medium text-muted">
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
