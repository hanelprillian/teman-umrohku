"use client";

import { useEffect, useLayoutEffect } from "react";
import { applySettingsToDocument, useSettings } from "@/lib/settings-store";

export const SettingsSync = () => {
  const theme = useSettings((s) => s.theme);
  const fontScale = useSettings((s) => s.fontScale);
  const arabicScale = useSettings((s) => s.arabicScale);
  const showLatin = useSettings((s) => s.showLatin);
  const showTranslation = useSettings((s) => s.showTranslation);
  const showDalil = useSettings((s) => s.showDalil);
  const density = useSettings((s) => s.density);

  useLayoutEffect(() => {
    applySettingsToDocument({
      theme,
      fontScale,
      arabicScale,
      showLatin,
      showTranslation,
      showDalil,
      density,
    });
  }, [theme, fontScale, arabicScale, showLatin, showTranslation, showDalil, density]);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () =>
      applySettingsToDocument(useSettings.getState());
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  return null;
};
