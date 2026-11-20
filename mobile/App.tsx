import { useFonts } from "expo-font";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Platform, Text, TextInput, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavPendingToast } from "./src/components/nav-pending-toast";
import { Onboarding } from "./src/components/onboarding";
import { SplashScreen } from "./src/components/splash-screen";
import type { RootStackParamList } from "./src/navigation/types";
import { DoasScreen } from "./src/screens/DoasScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { IhramRulesScreen } from "./src/screens/IhramRulesScreen";
import { SessionScreen } from "./src/screens/SessionScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { colors } from "./src/theme/colors";
import { fontAssets, fonts } from "./src/theme/fonts";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

let defaultsApplied = false;

const AppShell = () => {
  const { colors: c, isDark } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: c.background,
      card: c.surface,
      text: c.foreground,
      border: c.border,
      primary: c.primary,
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <NavigationContainer theme={navTheme}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: c.background },
            // Native slide works on iOS/Android; Expo web often skips native-stack
            // transitions — fade is the most reliable cross-platform fallback.
            animation: Platform.OS === "web" ? "fade" : "slide_from_right",
            animationDuration: Platform.OS === "web" ? 220 : undefined,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Session" component={SessionScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Doas" component={DoasScreen} />
          <Stack.Screen name="IhramRules" component={IhramRulesScreen} />
        </Stack.Navigator>
        <Onboarding />
        <NavPendingToast />
      </NavigationContainer>
      <SplashScreen />
    </View>
  );
};

export default function App() {
  const [loaded] = useFonts(fontAssets);

  useEffect(() => {
    if (!loaded || defaultsApplied) return;
    defaultsApplied = true;
    const textDefaults = Text as unknown as {
      defaultProps?: { style?: object };
    };
    textDefaults.defaultProps = {
      ...textDefaults.defaultProps,
      style: [{ fontFamily: fonts.sans }, textDefaults.defaultProps?.style],
    };
    const inputDefaults = TextInput as unknown as {
      defaultProps?: { style?: object };
    };
    inputDefaults.defaultProps = {
      ...inputDefaults.defaultProps,
      style: [{ fontFamily: fonts.sans }, inputDefaults.defaultProps?.style],
    };
  }, [loaded]);

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
