import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { DefaultTheme } from "../theme/theme";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/auth";
import { toastConfig } from "@/src/config/toast-config";
import Toast from "react-native-toast-message";

if (__DEV__) {
  import("./../../ReactotronConfig");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              gestureDirection: "horizontal",
              animation: "slide_from_right",
              fullScreenGestureEnabled: true,
            }}
          >
            <Stack.Screen name="(tabs)" />

            <Stack.Screen
              name="campaign/[id]"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="campaign/[id]/blocked-options"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="campaign/[id]/join-request"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="campaign-chat/[campaignId]"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="join-request/[id]"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="user/[id]"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="campaign-announcement/create"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="campaign-session/create"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="character/create"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="character/[id]"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="settings"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="notifications-settings"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="password-security"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="my-account"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen
              name="my-plan"
              options={{
                presentation: "card",
              }}
            />

            <Stack.Screen name="(auth)" />
          </Stack>

          <Toast config={toastConfig} />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
