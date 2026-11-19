"use client";

import type { Gender, Hand } from "@/lib/settings-store";
import { Card, Switch } from "./noor-ui";

export const Toggle = ({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <label className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-4 py-3">
    <span className="min-w-0 flex-1">
      <span className="block font-semibold text-card-foreground">{label}</span>
      {description && (
        <span className="mt-0.5 block text-sm text-muted-foreground">
          {description}
        </span>
      )}
    </span>
    <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
  </label>
);

export const Segmented = <T extends string | boolean>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <div
    role="group"
    aria-label={label}
    className="grid gap-1.5 rounded-[var(--radius)] border border-border bg-muted/60 p-1.5"
    style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
  >
    {options.map((option) => (
      <button
        key={String(option.value)}
        type="button"
        onClick={() => onChange(option.value)}
        aria-pressed={value === option.value}
        className={`min-h-11 rounded-[var(--radius-md)] text-sm font-semibold transition-all ${
          value === option.value
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export interface Personalization {
  gender: Gender;
  hand: Hand;
  scrollLock: boolean;
  autoFocusCounter: boolean;
}

const genderOptions: { value: Gender; label: string }[] = [
  { value: "pria", label: "Pria" },
  { value: "wanita", label: "Wanita" },
  { value: "all", label: "Semua" },
];

const handOptions: { value: Hand; label: string }[] = [
  { value: "left", label: "Kiri" },
  { value: "right", label: "Kanan" },
];

const FieldLabel = ({ title, hint }: { title: string; hint: string }) => (
  <div className="mb-2 px-1">
    <p className="font-semibold text-foreground">{title}</p>
    <p className="text-sm text-muted-foreground">{hint}</p>
  </div>
);

export const PersonalizationFields = ({
  value,
  onChange,
}: {
  value: Personalization;
  onChange: (patch: Partial<Personalization>) => void;
}) => (
  <div className="space-y-5">
    <div>
      <FieldLabel
        title="Panduan untuk"
        hint="Tips dan larangan khusus untuk jenis kelamin lain disembunyikan."
      />
      <Segmented
        label="Panduan untuk"
        options={genderOptions}
        value={value.gender}
        onChange={(gender) => onChange({ gender })}
      />
    </div>

    <div>
      <FieldLabel
        title="Tangan untuk tombol"
        hint="Letak tombol ▲▼ saat geser dikunci, agar terjangkau ibu jari."
      />
      <Segmented
        label="Tangan untuk tombol"
        options={handOptions}
        value={value.hand}
        onChange={(hand) => onChange({ hand })}
      />
    </div>

    <Card className="divide-y divide-border overflow-hidden">
      <Toggle
        label="Kunci geser"
        description="Mode imersif: pindah dengan tombol ▲▼, cocok saat hujan atau tangan basah."
        checked={value.scrollLock}
        onChange={(scrollLock) => onChange({ scrollLock })}
      />
      <Toggle
        label="Hitungan layar penuh otomatis"
        description="Tombol hitung besar langsung terbuka di langkah tawaf dan sa'i."
        checked={value.autoFocusCounter}
        onChange={(autoFocusCounter) => onChange({ autoFocusCounter })}
      />
    </Card>
  </div>
);
