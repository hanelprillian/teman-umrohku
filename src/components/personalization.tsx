"use client";

import type { Gender, Hand } from "@/lib/settings-store";

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
  <label className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-4 py-2">
    <span>
      <span className="block font-semibold">{label}</span>
      {description && <span className="block text-sm text-muted">{description}</span>}
    </span>
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
    className="grid gap-2 rounded-2xl border border-border bg-surface p-1.5"
    style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
  >
    {options.map((option) => (
      <button
        key={String(option.value)}
        type="button"
        onClick={() => onChange(option.value)}
        aria-pressed={value === option.value}
        className={`min-h-12 rounded-xl font-semibold ${
          value === option.value ? "bg-primary text-primary-foreground" : "text-muted"
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
    <p className="font-semibold">{title}</p>
    <p className="text-sm text-muted">{hint}</p>
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

    <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
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
    </div>
  </div>
);
