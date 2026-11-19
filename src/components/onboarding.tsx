"use client";

import { useState } from "react";
import { useHydrated } from "@/lib/hooks";
import { useSettings } from "@/lib/settings-store";
import { type Personalization, PersonalizationFields } from "./personalization";

const OnboardingSheet = () => {
  const settings = useSettings();
  const [draft, setDraft] = useState<Personalization>({
    gender: settings.gender,
    hand: settings.hand,
    scrollLock: settings.scrollLock,
    autoFocusCounter: settings.autoFocusCounter,
  });

  const save = () => {
    settings.setPersonalization(draft.scrollLock ? { ...draft, immersive: true } : draft);
    settings.setOnboarded(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-background"
    >
      <div className="pt-safe pb-safe mx-auto flex min-h-full max-w-xl flex-col px-5">
        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={() => settings.setOnboarded(true)}
            className="min-h-11 rounded-full px-4 font-semibold text-muted active:bg-surface-muted"
          >
            Lewati
          </button>
        </div>

        <div className="mb-6">
          <span className="inline-block rounded-full bg-gold-soft px-3 py-1 text-xs font-medium text-gold">
            Teman Umrohku
          </span>
          <h1
            id="onboarding-title"
            className="mt-3 text-3xl font-semibold leading-tight tracking-tight"
          >
            Biar pas di tanganmu
          </h1>
          <p className="mt-2 text-sm text-muted">
            Empat pilihan singkat. Bisa diubah kapan saja di Pengaturan.
          </p>
        </div>

        <div className="flex-1">
          <PersonalizationFields
            value={draft}
            onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
          />
        </div>

        <div className="sticky bottom-0 -mx-5 mt-6 bg-background/95 px-5 py-4 backdrop-blur">
          <button
            type="button"
            onClick={save}
            className="min-h-14 w-full rounded-2xl bg-primary text-lg font-semibold text-primary-foreground active:bg-primary-strong"
          >
            Simpan & mulai
          </button>
        </div>
      </div>
    </div>
  );
};

/** Shown once on first open; skipping keeps the defaults. */
export const Onboarding = () => {
  const hydrated = useHydrated();
  const onboarded = useSettings((s) => s.onboarded);

  if (!hydrated || onboarded) return null;
  return <OnboardingSheet />;
};
