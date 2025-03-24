import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { DefaultTheme } from "../theme/theme";

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="campaign/[id]" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
