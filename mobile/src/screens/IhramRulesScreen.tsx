import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DalilList } from "../components/dalil";
import { ArrowLeftIcon, CheckIcon } from "../components/icons";
import {
  allowed,
  allowedDalil,
  fidyah,
  forgetting,
  prohibitions,
} from "../content/larangan";
import type { Audience } from "../content/types";
import { useSettings } from "../lib/settings-store";
import { contentMaxWidth, type ThemeColors } from "../theme/colors";
import { fonts } from "../theme/fonts";
import { useThemeColors } from "../theme/ThemeContext";

const groups: { title: string; audience?: Audience }[] = [
  { title: "Pria & wanita" },
  { title: "Khusus pria", audience: "pria" },
  { title: "Khusus wanita", audience: "wanita" },
];

export const IhramRulesScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const c = useThemeColors();
  const styles = useMemo(() => createStyles(c), [c]);
  const gender = useSettings((s) => s.gender);
  const showDalil = useSettings((s) => s.showDalil);

  const visibleGroups = groups.filter(
    (g) => !g.audience || gender === "all" || g.audience === gender,
  );

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Kembali"
        >
          <ArrowLeftIcon size={22} color={c.foreground} />
        </Pressable>
        <Text style={styles.title}>Larangan ihram</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 32,
          gap: 28,
          maxWidth: contentMaxWidth,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Berlaku sejak{" "}
            <Text style={styles.bannerStrong}>niat ihram di miqat</Text> sampai{" "}
            <Text style={styles.bannerStrong}>tahallul</Text> (mencukur/memotong
            rambut setelah sa'i).
          </Text>
        </View>

        {visibleGroups.map((group) => (
          <View key={group.title} style={{ gap: 12 }}>
            <Text style={styles.section}>{group.title}</Text>
            {prohibitions
              .filter((rule) => rule.audience === group.audience)
              .map((rule) => (
                <View key={rule.title} style={styles.card}>
                  <Text style={styles.ruleTitle}>{rule.title}</Text>
                  {rule.detail ? (
                    <Text style={styles.ruleDetail}>{rule.detail}</Text>
                  ) : null}
                  {showDalil && (
                    <View style={styles.dalilBlock}>
                      <DalilList items={rule.dalil} />
                    </View>
                  )}
                </View>
              ))}
          </View>
        ))}

        <View style={{ gap: 12 }}>
          <Text style={styles.section}>Yang boleh dilakukan</Text>
          <View style={styles.card}>
            {allowed.map((item) => (
              <View key={item} style={styles.allowedRow}>
                <CheckIcon size={16} color={c.gold} />
                <Text style={styles.ruleDetail}>{item}</Text>
              </View>
            ))}
            {showDalil && (
              <View style={styles.dalilBlock}>
                <DalilList items={allowedDalil} />
              </View>
            )}
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Text style={styles.section}>Kalau terlanjur melanggar</Text>
          {[forgetting, fidyah].map((item) => (
            <View key={item.text} style={styles.card}>
              <Text style={styles.ruleDetail}>{item.text}</Text>
              {showDalil && (
                <View style={styles.dalilBlock}>
                  <DalilList items={item.dalil} />
                </View>
              )}
            </View>
          ))}
          <Text style={styles.footnote}>
            Untuk kasus yang meragukan, tanyakan langsung kepada
            pembimbing/ustadz rombongan.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      paddingBottom: 12,
    },
    backBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontFamily: fonts.sansBold,
      fontSize: 20,
      color: c.foreground,
    },
    banner: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(156,126,44,0.35)",
      backgroundColor: c.goldSoft,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    bannerText: { fontSize: 15, lineHeight: 24, color: c.foreground },
    bannerStrong: { fontFamily: fonts.sansSemi },
    section: {
      fontFamily: fonts.sansSemi,
      fontSize: 13,
      color: c.muted,
      paddingHorizontal: 4,
    },
    card: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      padding: 16,
      gap: 8,
      shadowColor: "#141412",
      shadowOpacity: 0.03,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
    ruleTitle: {
      fontFamily: fonts.sansSemi,
      fontSize: 16,
      color: c.foreground,
    },
    ruleDetail: {
      flex: 1,
      fontSize: 15,
      lineHeight: 24,
      color: c.muted,
    },
    allowedRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
    dalilBlock: {
      marginTop: 4,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
    },
    footnote: {
      fontSize: 13,
      color: c.muted,
      paddingHorizontal: 4,
      lineHeight: 20,
    },
  });
