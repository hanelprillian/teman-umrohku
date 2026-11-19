"use client";

import type { ReactNode } from "react";
import { rabbanaAtina } from "@/content/duas";
import { useHydrated } from "@/lib/hooks";
import { useProgress } from "@/lib/progress-store";
import {
  ARABIC_SCALES,
  type Density,
  FONT_SCALES,
  NOOR_THEMES,
  nearestScaleIndex,
  type Theme,
  useSettings,
} from "@/lib/settings-store";
import { DuaCard } from "./dua-card";
import {
  CheckCircleIcon,
  DesktopIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
} from "./icons";
import { Button, Card } from "./noor-ui";
import { PersonalizationFields, Segmented, Toggle } from "./personalization";

const themeOptions: { value: Theme; label: string; icon: ReactNode }[] = [
  { value: "system", label: "Otomatis", icon: <DesktopIcon className="size-4" /> },
  { value: "light", label: "Terang", icon: <SunIcon className="size-4" /> },
  { value: "dark", label: "Gelap", icon: <MoonIcon className="size-4" /> },
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

const ScaleControl = ({
  label,
  sample,
  scales,
  value,
  onChange,
}: ScaleControlProps) => {
  const index = nearestScaleIndex(scales, value);

  return (
    <div className="space-y-3 p-4">
      <p className="font-semibold text-card-foreground">{label}</p>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Perkecil ${label}`}
          disabled={index === 0}
          onClick={() => onChange(scales[index - 1])}
          className="size-11 shrink-0 text-xl font-bold"
        >
          −
        </Button>
        <div className="flex flex-1 items-center gap-1.5">
          {scales.map((scale, scaleIndex) => (
            <span
              key={scale}
              className={`h-2 flex-1 rounded-full transition-colors ${
                scaleIndex <= index ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Perbesar ${label}`}
          disabled={index === scales.length - 1}
          onClick={() => onChange(scales[index + 1])}
          className="size-11 shrink-0 text-xl font-bold"
        >
          +
        </Button>
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
    return (
      <div className="h-96 animate-pulse rounded-[var(--radius)] bg-muted" />
    );
  }

  const handleReset = () => {
    if (
      window.confirm(
        "Hapus semua progres sesi? Hitungan putaran akan kembali ke 0.",
      )
    ) {
      resetAll();
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 flex items-center gap-2 px-1">
          <PaletteIcon className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-muted-foreground">
            Tema Noor UI
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {NOOR_THEMES.map((preset) => {
            const active = settings.noorTheme === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => settings.setNoorTheme(preset.id)}
                aria-pressed={active}
                className={`group flex flex-col gap-2.5 rounded-[var(--radius)] border p-3.5 text-start transition-all ${
                  active
                    ? "border-primary bg-primary/8 ring-2 ring-primary/25"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5" aria-hidden>
                    {preset.swatches.map((color, idx) => (
                      <span
                        key={`${preset.id}-${idx}`}
                        className="size-4 rounded-full border border-black/15"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {active && (
                    <CheckCircleIcon className="size-4 shrink-0 text-primary" />
                  )}
                </div>
                <div>
                  <span className="block font-semibold text-card-foreground">
                    {preset.name}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                    {preset.tagline}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-[var(--radius)] border border-border bg-muted/60 p-1.5">
          {themeOptions.map((option) => {
            const active = settings.theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => settings.setTheme(option.value)}
                aria-pressed={active}
                disabled={settings.noorTheme === "futuristic"}
                className={`flex min-h-11 items-center justify-center gap-1.5 rounded-[var(--radius-md)] text-sm font-semibold transition-all disabled:opacity-45 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            );
          })}
        </div>
        {settings.noorTheme === "futuristic" && (
          <p className="mt-2 px-1 text-xs text-muted-foreground">
            Tema Futuristic dioptimalkan untuk tampilan gelap.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-3 px-1 text-sm font-semibold text-muted-foreground">
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
        <h2 className="mb-3 px-1 text-sm font-semibold text-muted-foreground">
          Ukuran huruf
        </h2>
        <Card className="divide-y divide-border overflow-hidden">
          <ScaleControl
            label="Huruf Arab"
            sample={
              <span
                dir="rtl"
                lang="ar"
                className="font-arabic text-3xl leading-none"
              >
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
        </Card>
      </section>

      <section>
        <h2 className="mb-3 px-1 text-sm font-semibold text-muted-foreground">
          Kerapatan tampilan
        </h2>
        <Segmented
          label="Kerapatan tampilan"
          options={densityOptions}
          value={settings.density}
          onChange={settings.setDensity}
        />
        <p className="mt-2 px-1 text-sm text-muted-foreground">
          Atur jarak dan ukuran tombol. Pilih &ldquo;Rapat&rdquo; agar bacaan
          lebih banyak terlihat saat huruf besar.
        </p>
      </section>

      <section>
        <h2 className="mb-3 px-1 text-sm font-semibold text-muted-foreground">
          Tampilan doa
        </h2>
        <Card className="divide-y divide-border overflow-hidden">
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
        </Card>
      </section>

      <section>
        <h2 className="mb-3 px-1 text-sm font-semibold text-muted-foreground">
          Mode tampilan sesi
        </h2>
        <Segmented
          label="Mode tampilan sesi"
          options={[
            { value: false, label: "Standar" },
            { value: true, label: "Imersif" },
          ]}
          value={settings.immersive}
          onChange={settings.setImmersive}
        />
        <p className="mt-2 px-1 text-sm text-muted-foreground">
          {settings.immersive
            ? "Satu layar untuk setiap langkah dan setiap doa, fokus pada bacaan Arab dan artinya. Geser ke atas untuk lanjut."
            : "Pindah langkah dengan tombol Lanjut di bagian bawah layar."}
        </p>
      </section>

      <section>
        <h2 className="mb-3 px-1 text-sm font-semibold text-muted-foreground">
          Pratinjau
        </h2>
        <DuaCard dua={rabbanaAtina} />
      </section>

      <section>
        <Button
          type="button"
          variant="outline"
          size="xl"
          onClick={handleReset}
          className="h-14 w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Reset semua progres
        </Button>
      </section>
    </div>
  );
};
