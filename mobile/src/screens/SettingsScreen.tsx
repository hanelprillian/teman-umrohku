import { useNavigation } from "@react-navigation/native";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "../components/icons";
import { useHydrated } from "../lib/hooks";
import { useProgress } from "../lib/progress-store";
import {
  ARABIC_SCALES,
  FONT_SCALES,
  nearestScaleIndex,
  type Theme,
  useSettings,
} from "../lib/settings-store";
import { colors } from "../theme/colors";
import { useThemeColors } from "../theme/ThemeContext";

const ToggleRow = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <Pressable style={styles.row} onPress={() => onChange(!value)}>
    <Text style={styles.rowLabel}>{label}</Text>
    <View style={[styles.toggle, value && styles.toggleOn]}>
      <View style={[styles.knob, value && styles.knobOn]} />
    </View>
  </Pressable>
);

const ScaleRow = ({
  label,
  scales,
  value,
  onChange,
}: {
  label: string;
  scales: readonly number[];
  value: number;
  onChange: (v: number) => void;
}) => {
  const c = useThemeColors();
  const index = nearestScaleIndex(scales, value);
  return (
    <View style={styles.block}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.scaleRow}>
        <Pressable
          style={styles.scaleBtn}
          disabled={index === 0}
          onPress={() => onChange(scales[index - 1])}
        >
          <Text style={styles.scaleBtnText}>−</Text>
        </Pressable>
        <View style={styles.scaleTrack}>
          {scales.map((scale, i) => (
            <View
              key={scale}
              style={[
                styles.scaleSeg,
                i <= index && { backgroundColor: c.gold },
              ]}
            />
          ))}
        </View>
        <Pressable
          style={styles.scaleBtn}
          disabled={index === scales.length - 1}
          onPress={() => onChange(scales[index + 1])}
        >
          <Text style={styles.scaleBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const hydrated = useHydrated();
  const settings = useSettings();
  const resetAll = useProgress((s) => s.resetAll);
  const c = useThemeColors();

  const themeOptions: { value: Theme; label: string }[] = [
    { value: "system", label: "Otomatis" },
    { value: "light", label: "Terang" },
    { value: "dark", label: "Gelap" },
  ];

  if (!hydrated) {
    return (
      <View style={[styles.flex, { paddingTop: insets.top, backgroundColor: c.background }]}>
        <View style={[styles.skeleton, { backgroundColor: c.surfaceMuted }]} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: c.background }]}
      contentContainerStyle={{
        paddingTop: Math.max(insets.top, 12) + 16,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 20,
        gap: 24,
      }}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Kembali"
        >
          <ArrowLeftIcon size={22} color={c.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: c.foreground }]}>Pengaturan</Text>
      </View>

      <View>
        <Text style={styles.section}>Tampilan</Text>
        <View style={styles.card}>
          <View style={styles.block}>
            <Text style={styles.rowLabel}>Tema</Text>
            <View style={styles.chips}>
              {themeOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[
                    styles.chip,
                    settings.theme === opt.value && styles.chipActive,
                  ]}
                  onPress={() => settings.setTheme(opt.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      settings.theme === opt.value && styles.chipTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <ScaleRow
            label="Ukuran teks"
            scales={FONT_SCALES}
            value={settings.fontScale}
            onChange={settings.setFontScale}
          />
          <ScaleRow
            label="Ukuran Arab"
            scales={ARABIC_SCALES}
            value={settings.arabicScale}
            onChange={settings.setArabicScale}
          />
          <ToggleRow
            label="Tampilkan latin"
            value={settings.showLatin}
            onChange={settings.setShowLatin}
          />
          <ToggleRow
            label="Tampilkan terjemahan"
            value={settings.showTranslation}
            onChange={settings.setShowTranslation}
          />
          <ToggleRow
            label="Tampilkan dalil"
            value={settings.showDalil}
            onChange={settings.setShowDalil}
          />
        </View>
      </View>

      <View>
        <Text style={styles.section}>Personalisasi</Text>
        <View style={styles.card}>
          <View style={styles.block}>
            <Text style={styles.rowLabel}>Audience</Text>
            <View style={styles.chips}>
              {(
                [
                  ["all", "Semua"],
                  ["pria", "Pria"],
                  ["wanita", "Wanita"],
                ] as const
              ).map(([value, label]) => (
                <Pressable
                  key={value}
                  style={[
                    styles.chip,
                    settings.gender === value && styles.chipActive,
                  ]}
                  onPress={() => settings.setGender(value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      settings.gender === value && styles.chipTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={styles.block}>
            <Text style={styles.rowLabel}>Tangan tombol ▲▼</Text>
            <View style={styles.chips}>
              {(
                [
                  ["left", "Kiri"],
                  ["right", "Kanan"],
                ] as const
              ).map(([value, label]) => (
                <Pressable
                  key={value}
                  style={[
                    styles.chip,
                    settings.hand === value && styles.chipActive,
                  ]}
                  onPress={() => settings.setHand(value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      settings.hand === value && styles.chipTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <ToggleRow
            label="Mode immersive"
            value={settings.immersive}
            onChange={(v) => {
              settings.setImmersive(v);
              if (v) settings.setScrollLock(settings.scrollLock);
            }}
          />
          <ToggleRow
            label="Kunci geser (tombol ▲▼)"
            value={settings.scrollLock}
            onChange={(v) => {
              settings.setScrollLock(v);
              if (v) settings.setImmersive(true);
            }}
          />
          <ToggleRow
            label="Hitungan layar penuh otomatis"
            value={settings.autoFocusCounter}
            onChange={settings.setAutoFocusCounter}
          />
          <ToggleRow
            label="Tampilkan splash saat buka app"
            value={settings.showSplash}
            onChange={settings.setShowSplash}
          />
        </View>
      </View>

      <View>
        <Text style={styles.section}>Data</Text>
        <View style={styles.card}>
          <Pressable
            style={styles.row}
            onPress={() =>
              Alert.alert(
                "Reset progres?",
                "Hapus semua progres sesi? Hitungan putaran akan kembali ke 0.",
                [
                  { text: "Batal", style: "cancel" },
                  {
                    text: "Hapus",
                    style: "destructive",
                    onPress: () => resetAll(),
                  },
                ],
              )
            }
          >
            <Text style={[styles.rowLabel, { color: "#b42318" }]}>
              Hapus semua progres
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  skeleton: {
    margin: 20,
    height: 200,
    borderRadius: 24,
    backgroundColor: colors.surfaceMuted,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 22, fontWeight: "700", color: colors.foreground },
  section: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.muted,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  block: { padding: 16, gap: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  rowLabel: { fontSize: 15, fontWeight: "600", color: colors.foreground },
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
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
  },
  chipText: { fontSize: 13, color: colors.muted, fontWeight: "500" },
  chipTextActive: { color: colors.gold },
  scaleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  scaleBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  scaleBtnText: { fontSize: 20, fontWeight: "700", color: colors.foreground },
  scaleTrack: { flex: 1, flexDirection: "row", gap: 4 },
  scaleSeg: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.border,
  },
});
