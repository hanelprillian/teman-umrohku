import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Dalil, DalilStatus } from "../content/types";
import type { ThemeColors } from "../theme/colors";
import { fonts } from "../theme/fonts";
import { useThemeColors } from "../theme/ThemeContext";

const statusMeta = (c: ThemeColors): Record<
  DalilStatus,
  { label: string; bg: string; fg: string; border: string }
> => ({
  quran: {
    label: "Al-Qur'an",
    bg: c.kiswah,
    fg: c.goldBright,
    border: "rgba(156,126,44,0.3)",
  },
  shahih: {
    label: "Shahih",
    bg: c.goldSoft,
    fg: c.gold,
    border: "rgba(156,126,44,0.3)",
  },
  hasan: {
    label: "Hasan",
    bg: c.surfaceMuted,
    fg: c.foreground,
    border: c.border,
  },
  atsar: {
    label: "Atsar Sahabat",
    bg: c.goldSoft,
    fg: c.gold,
    border: "transparent",
  },
  ijma: {
    label: "Ijma' Ulama",
    bg: c.goldSoft,
    fg: c.gold,
    border: "transparent",
  },
  diperselisihkan: {
    label: "Diperselisihkan",
    bg: "#fde8e8",
    fg: "#b42318",
    border: "transparent",
  },
});

export const StatusBadge = ({ status }: { status: DalilStatus }) => {
  const c = useThemeColors();
  const meta = statusMeta(c)[status];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: meta.bg, borderColor: meta.border },
      ]}
    >
      <Text style={[styles.badgeText, { color: meta.fg }]}>{meta.label}</Text>
    </View>
  );
};

const DalilItem = ({ dalil }: { dalil: Dalil }) => {
  const c = useThemeColors();
  const stylesT = useMemo(() => itemStyles(c), [c]);
  const [open, setOpen] = useState(false);
  const hasDetail = Boolean(dalil.quote || dalil.note);

  return (
    <View style={{ gap: 4 }}>
      <Pressable
        onPress={hasDetail ? () => setOpen((v) => !v) : undefined}
        style={stylesT.itemHead}
      >
        <Text style={stylesT.source} numberOfLines={2}>
          {dalil.source}
        </Text>
        <StatusBadge status={dalil.status} />
      </Pressable>
      {hasDetail && !open && (
        <Pressable onPress={() => setOpen(true)}>
          <Text style={stylesT.seeMore}>Lihat keterangan</Text>
        </Pressable>
      )}
      {hasDetail && open && (
        <View style={stylesT.detail}>
          {dalil.quote ? (
            <Text style={stylesT.quote}>“{dalil.quote}”</Text>
          ) : null}
          {dalil.note ? <Text style={stylesT.note}>{dalil.note}</Text> : null}
        </View>
      )}
    </View>
  );
};

export const DalilList = ({ items }: { items: Dalil[] }) => (
  <View style={{ gap: 12 }}>
    {items.map((dalil, index) => (
      <DalilItem key={`${dalil.source}-${index}`} dalil={dalil} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 12, fontFamily: fonts.sansMedium },
});

const itemStyles = (c: ThemeColors) =>
  StyleSheet.create({
    itemHead: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
    },
    source: {
      flex: 1,
      fontSize: 13,
      fontFamily: fonts.sansMedium,
      color: c.muted,
    },
    seeMore: {
      fontSize: 12,
      fontFamily: fonts.sansMedium,
      color: c.gold,
      marginTop: 4,
    },
    detail: {
      marginTop: 8,
      borderLeftWidth: 2,
      borderLeftColor: "rgba(156,126,44,0.45)",
      paddingLeft: 12,
      gap: 8,
    },
    quote: {
      fontSize: 13,
      fontStyle: "italic",
      color: c.foreground,
      lineHeight: 20,
    },
    note: { fontSize: 13, color: c.muted, lineHeight: 20 },
  });
