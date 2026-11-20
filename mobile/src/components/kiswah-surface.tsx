import { useId, useState, type ReactNode } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import Svg, {
  Defs,
  Path,
  Pattern,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { colors } from "../theme/colors";

/**
 * Web `.nusuk-kiswah`: obsidian + Noor glow + geometric lattice.
 * Measures layout (SVG % size breaks after navigation) and unique gradient ids
 * (duplicate `url(#id)` across screens breaks texture).
 */
export const KiswahSurface = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}) => {
  const uid = useId().replace(/:/g, "");
  const glowId = `noor-${uid}`;
  const latticeId = `lattice-${uid}`;
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) {
      setSize({ w: width, h: height });
    }
  };

  return (
    <View style={[styles.root, style]} onLayout={onLayout}>
      {size.w > 0 && size.h > 0 && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Svg width={size.w} height={size.h}>
            <Defs>
              <RadialGradient id={glowId} cx="90%" cy="8%" r="56%">
                <Stop offset="0%" stopColor="#d4b55f" stopOpacity="0.22" />
                <Stop offset="100%" stopColor="#d4b55f" stopOpacity="0" />
              </RadialGradient>
              <Pattern
                id={latticeId}
                patternUnits="userSpaceOnUse"
                width={64}
                height={64}
              >
                <Path
                  d="M32 6L39.5 24.5L58 32L39.5 39.5L32 58L24.5 39.5L6 32L24.5 24.5L32 6Z"
                  stroke="#d4b55f"
                  strokeOpacity={0.08}
                  strokeWidth={1}
                  fill="none"
                />
                <Path
                  d="M32 22 L42 32 L32 42 L22 32 Z"
                  stroke="#d4b55f"
                  strokeOpacity={0.06}
                  strokeWidth={1}
                  fill="none"
                />
              </Pattern>
            </Defs>
            <Rect width={size.w} height={size.h} fill={colors.kiswah} />
            <Rect width={size.w} height={size.h} fill={`url(#${glowId})`} />
            <Rect width={size.w} height={size.h} fill={`url(#${latticeId})`} />
          </Svg>
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(212,181,95,0.24)",
    backgroundColor: colors.kiswah,
  },
  content: { position: "relative", zIndex: 1, flexGrow: 1 },
});
