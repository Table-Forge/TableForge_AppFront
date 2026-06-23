# Auth & session

This document details how we handle authentication, session persistence, and routing guards.

---

## Reference implementations
- [context/auth.tsx](../../src/context/auth.tsx) — The AuthContext provider.
- [features/auth-token-store.ts](../../src/features/auth-token-store.ts) — SecureStore caching layer.

---

## Token Storage

We use `expo-secure-store` to safely encrypt and store the user's session data and JWT token on the device.
To avoid asynchronous reads blocking the UI on every render, the `authTokenStore` acts as a singleton that holds the data in memory (`cachedToken`) while syncing to SecureStore in the background.

## The Flow

1. **Login**: User logs in -> `AuthService.login()` -> `signIn()` context method is called.
2. **Persistence**: `signIn()` saves the full user object and JWT to `authTokenStore`.
3. **Hydration**: On app boot, `AuthContext` checks if a token exists in `authTokenStore`.
4. **Validation**: We verify if the token is expired. If expired, we trigger an auto-logout and notify the user via Toast.
5. **Injection**: The `api.ts` Axios interceptor grabs the token from the memory cache and injects the `Bearer` header.

## Route Guards

The `AuthContext` employs an effect that listens to `useSegments()` from Expo Router to protect routes.
- If the user is unauthenticated, they are redirected to `/(auth)/login`.
- If the user is authenticated, they are automatically redirected away from auth screens to `/(tabs)/campaigns`.

## Rules

1. **Secure Storage**: Never use `AsyncStorage` for tokens. Always use `expo-secure-store`.
2. **Memory cache**: Always rely on the in-memory cache provided by `authTokenStore` for synchronous token retrieval in interceptors.

## What NOT to do
- **Don't build separate auth states**: The `AuthContext` is the single source of truth for the user's session.
