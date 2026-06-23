# Routing

This document explains the routing configuration using Expo Router.

---

## Reference implementations
- [app/_layout.tsx](../../src/app/_layout.tsx) — Root layout.
- [app/(tabs)/_layout.tsx](../../src/app/(tabs)/_layout.tsx) — Main authenticated tabs.

---

## File-based Routing

We use **Expo Router**, which relies on the filesystem structure inside the `src/app/` directory to define routes.

## Route Groups

Directories enclosed in parentheses like `(auth)/` and `(tabs)/` are **Route Groups**. They do not affect the URL structure but allow grouping related screens to share a `_layout.tsx`.

- `(auth)`: Unauthenticated routes (login, register).
- `(tabs)`: Main authenticated routes that render inside the bottom navigation.

## Layouts and Navigation

- **Stacks**: The root layout (`app/_layout.tsx`) and auth layout (`app/(auth)/_layout.tsx`) use Stack navigators to provide standard screen transitions.
- **Tabs**: The `app/(tabs)/_layout.tsx` layout uses `@react-navigation/material-top-tabs` configured to render at the bottom of the screen.

### Programmatic Navigation
Always use the `useRouter` hook from `expo-router` for navigation:
- `router.push("/campaign/123")`: Navigate to a new screen.
- `router.replace("/(tabs)/campaigns")`: Replace the current stack (useful after login).
- `router.back()`: Go back.

## Rules

1. **Path-based arguments**: Pass IDs through the route path (e.g., `app/campaign/[id].tsx`). Retrieve them using `useLocalSearchParams()`.
2. **Deep links**: Expo Router automatically configures deep linking. Ensure parameters and paths are logical.

## What NOT to do
- **Don't use standard React Navigation primitives explicitly**: Unless wrapping a custom navigator, stick to Expo Router's components (`<Stack>`, `<Tabs>`, `Link`).
