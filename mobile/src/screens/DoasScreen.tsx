import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "../components/icons";
import { sessions } from "../content/sessions";
import type { Dua } from "../content/types";
import { useSettings } from "../lib/settings-store";
import { colors, contentMaxWidth } from "../theme/colors";
import { arabicLineHeight, arabicSize, fonts } from "../theme/fonts";

const allDuas = (): Dua[] => {
  const map = new Map<string, Dua>();
  for (const session of sessions) {
    for (const step of session.steps) {
      for (const dua of step.duas ?? []) {
        map.set(dua.id, dua);
      }
    }
  }
  return [...map.values()];
};

export const DoasScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const showLatin = useSettings((s) => s.showLatin);
  const showTranslation = useSettings((s) => s.showTranslation);
  const arabicScale = useSettings((s) => s.arabicScale);
  const duas = useMemo(() => allDuas(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return duas;
    return duas.filter(
      (d) =>
        d.title?.toLowerCase().includes(q) ||
        d.latin.toLowerCase().includes(q) ||
        d.translation.toLowerCase().includes(q) ||
        d.arabic.includes(query.trim()),
    );
  }, [duas, query]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Kembali"
        >
          <ArrowLeftIcon size={22} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>Kumpulan doa</Text>
      </View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Cari doa…"
        placeholderTextColor={colors.muted}
        style={styles.search}
      />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 24,
          gap: 12,
          maxWidth: contentMaxWidth,
          width: "100%",
          alignSelf: "center",
        }}
      >
        {filtered.map((dua) => (
          <View key={dua.id} style={styles.card}>
            {dua.title ? (
              <Text style={styles.duaTitle}>{dua.title}</Text>
            ) : null}
            <Text
              style={[
                styles.arabic,
                {
                  fontFamily: fonts.arabic,
                  fontSize: arabicSize(arabicScale),
                  lineHeight: arabicLineHeight(arabicScale),
                },
              ]}
            >
              {dua.arabic}
            </Text>
            {showLatin && <Text style={styles.latin}>{dua.latin}</Text>}
            {showTranslation && (
              <Text style={styles.translation}>{dua.translation}</Text>
            )}
          </View>
        ))}
        {filtered.length === 0 && (
          <Text style={styles.empty}>Tidak ada doa yang cocok.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: "700", color: colors.foreground },
  search: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.foreground,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 8,
  },
  duaTitle: { fontWeight: "600", color: colors.foreground },
  arabic: {
    textAlign: "right",
    color: colors.foreground,
    writingDirection: "rtl",
  },
  latin: { color: colors.muted, fontStyle: "italic", fontSize: 13 },
  translation: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  empty: { textAlign: "center", color: colors.muted, marginTop: 40 },
});
