# Environment & build

This document details how environment variables and build configurations are managed.

---

## Reference implementations
- [.env.development](../../.env.development) — The development variables.
- [app.json](../../app.json) — Expo configuration.

---

## Variables

In Expo, environment variables that need to be accessible in the client code must be prefixed with `EXPO_PUBLIC_`.

Key variables:
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_GEOAPIFY_API_KEY`

Access them directly via `process.env`:
```ts
const baseURL = process.env.EXPO_PUBLIC_API_URL;
```

## Expo Configuration

The `app.json` file controls the build configuration for Expo Application Services (EAS).
- We have the **New Architecture enabled** (`newArchEnabled: true`).
- The app scheme is configured as `table-forge` for deep linking.

## Rules

1. **Platform prefixes**: When writing platform-specific environment variables, be explicit.
2. **Commit the example**: Always ensure there is an `.env.example` or equivalent documentation for required variables.

## What NOT to do
- **Don't commit secrets**: `.env.development` and other active env files must remain in `.gitignore`.
