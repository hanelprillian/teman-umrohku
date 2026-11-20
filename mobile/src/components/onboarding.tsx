import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHydrated } from "../lib/hooks";
import type { Gender, Hand } from "../lib/settings-store";
import { useSettings } from "../lib/settings-store";
import { colors } from "../theme/colors";

export interface Personalization {
  gender: Gender;
  hand: Hand;
  scrollLock: boolean;
  autoFocusCounter: boolean;
}

const Segmented = <T extends string | boolean>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <View style={styles.segment}>
    {options.map((option) => (
      <Pressable
        key={String(option.value)}
        style={[
          styles.segmentBtn,
          value === option.value && styles.segmentBtnActive,
        ]}
        onPress={() => onChange(option.value)}
      >
        <Text
          style={[
            styles.segmentText,
            value === option.value && styles.segmentTextActive,
          ]}
        >
          {option.label}
        </Text>
      </Pressable>
    ))}
  </View>
);

const Toggle = ({
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
  <Pressable style={styles.toggleRow} onPress={() => onChange(!checked)}>
    <View style={{ flex: 1 }}>
      <Text style={styles.toggleLabel}>{label}</Text>
      {description ? (
        <Text style={styles.toggleDesc}>{description}</Text>
      ) : null}
    </View>
    <View style={[styles.toggle, checked && styles.toggleOn]}>
      <View style={[styles.knob, checked && styles.knobOn]} />
    </View>
  </Pressable>
);

const PersonalizationFields = ({
  value,
  onChange,
}: {
  value: Personalization;
  onChange: (patch: Partial<Personalization>) => void;
}) => (
  <View style={{ gap: 20 }}>
    <View>
      <Text style={styles.fieldTitle}>Panduan untuk</Text>
      <Text style={styles.fieldHint}>
        Tips dan larangan khusus untuk jenis kelamin lain disembunyikan.
      </Text>
      <Segmented
        options={[
          { value: "pria" as const, label: "Pria" },
          { value: "wanita" as const, label: "Wanita" },
          { value: "all" as const, label: "Semua" },
        ]}
        value={value.gender}
        onChange={(gender) => onChange({ gender })}
      />
    </View>
    <View>
      <Text style={styles.fieldTitle}>Tangan untuk tombol</Text>
      <Text style={styles.fieldHint}>
        Letak tombol ▲▼ saat geser dikunci, agar terjangkau ibu jari.
      </Text>
      <Segmented
        options={[
          { value: "left" as const, label: "Kiri" },
          { value: "right" as const, label: "Kanan" },
        ]}
        value={value.hand}
        onChange={(hand) => onChange({ hand })}
      />
    </View>
    <View style={styles.toggleCard}>
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
    </View>
  </View>
);

const OnboardingSheet = () => {
  const insets = useSafeAreaInsets();
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
    <Modal visible animationType="slide">
      <View
        style={[
          styles.sheet,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <View style={styles.skipRow}>
          <Pressable onPress={() => settings.setOnboarded(true)}>
            <Text style={styles.skip}>Lewati</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Teman Umrohku</Text>
          </View>
          <Text style={styles.title}>Biar pas di tanganmu</Text>
          <Text style={styles.subtitle}>
            Empat pilihan singkat. Bisa diubah kapan saja di Pengaturan.
          </Text>
          <PersonalizationFields
            value={draft}
            onChange={(patch) => setDraft((c) => ({ ...c, ...patch }))}
          />
        </ScrollView>
        <View style={styles.footer}>
          <Pressable style={styles.saveBtn} onPress={save}>
            <Text style={styles.saveText}>Simpan & mulai</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export const Onboarding = () => {
  const hydrated = useHydrated();
  const onboarded = useSettings((s) => s.onboarded);
  if (!hydrated || onboarded) return null;
  return <OnboardingSheet />;
};

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: colors.background },
  skipRow: { alignItems: "flex-end", paddingHorizontal: 16 },
  skip: {
    minHeight: 44,
    paddingHorizontal: 16,
    fontWeight: "600",
    color: colors.muted,
    textAlignVertical: "center",
    lineHeight: 44,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: colors.goldSoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12, fontWeight: "500", color: colors.gold },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.foreground,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 13, color: colors.muted, marginBottom: 8 },
  fieldTitle: { fontSize: 15, fontWeight: "600", color: colors.foreground },
  fieldHint: { fontSize: 13, color: colors.muted, marginBottom: 8, marginTop: 2 },
  segment: {
    flexDirection: "row",
    gap: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 6,
  },
  segmentBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentBtnActive: { backgroundColor: colors.primary },
  segmentText: { fontWeight: "600", color: colors.muted },
  segmentTextActive: { color: colors.primaryFg },
  toggleCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  toggleLabel: { fontWeight: "600", color: colors.foreground },
  toggleDesc: { fontSize: 13, color: colors.muted, marginTop: 2 },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    padding: 2,
  },
  toggleOn: { backgroundColor: colors.gold },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  knobOn: { alignSelf: "flex-end" },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  saveBtn: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { fontSize: 17, fontWeight: "600", color: colors.primaryFg },
});
