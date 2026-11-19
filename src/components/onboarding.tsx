"use client";

import { useState } from "react";
import { useHydrated } from "@/lib/hooks";
import { useSettings } from "@/lib/settings-store";
import { Badge, Button } from "./noor-ui";
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
    settings.setPersonalization(
      draft.scrollLock ? { ...draft, immersive: true } : draft,
    );
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
          <Button
            type="button"
            variant="ghost"
            onClick={() => settings.setOnboarded(true)}
            className="min-h-11 rounded-full px-4 text-muted-foreground"
          >
            Lewati
          </Button>
        </div>

        <div className="mb-6 space-y-2">
          <Badge
            variant="outline"
            className="rounded-full border-primary/30 bg-primary/10 text-primary"
          >
            Teman Umrohku
          </Badge>
          <h1
            id="onboarding-title"
            className="text-3xl font-bold leading-tight text-foreground"
          >
            Biar pas di tanganmu
          </h1>
          <p className="text-muted-foreground">
            Empat pilihan. Bisa diubah kapan saja di Pengaturan.
          </p>
        </div>

        <div className="flex-1">
          <PersonalizationFields
            value={draft}
            onChange={(patch) =>
              setDraft((current) => ({ ...current, ...patch }))
            }
          />
        </div>

        <div className="sticky bottom-0 -mx-5 mt-6 border-t border-border bg-background/95 px-5 py-4 backdrop-blur">
          <Button
            type="button"
            variant="primary"
            size="xl"
            onClick={save}
            className="h-14 w-full text-base font-semibold"
          >
            Simpan &amp; mulai
          </Button>
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
