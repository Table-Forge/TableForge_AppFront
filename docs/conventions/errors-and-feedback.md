# Errors and feedback

This document explains how we display feedback to the user and handle API errors.

---

## Reference implementations
- [config/toast-config.tsx](../../src/config/toast-config.tsx) — Custom Toast styling.
- [features/api.ts](../../src/features/api.ts) — Axios configuration.

---

## The Toast System

We use `react-native-toast-message` for global, non-blocking feedback.
- The `<Toast />` component is rendered at the root of the app in `app/_layout.tsx`.
- It is configured with custom, dark-themed styling in `src/config/toast-config.tsx`.

Trigger a toast via:
```ts
Toast.show({
  type: "success", // or "error", "info"
  text1: "Sucesso!",
  text2: "Ação realizada.",
});
```

## Handling API Errors

All API mutations should handle errors gracefully and provide pt-BR feedback to the user.
We use a standard helper function (e.g., `getErrorMessage`) to extract the backend's provided error message from the Axios response body.

```ts
useMutation({
  mutationFn: ...,
  onError: (error) => {
    Toast.show({
      type: "error",
      text1: "Erro",
      text2: getErrorMessage(error),
    });
  }
})
```

## Rules

1. **Language**: All user-facing error and success messages must be in **pt-BR**.
2. **Haptics on Error**: Consider triggering a brief haptic vibration when displaying a critical error toast to grab the user's attention.

## What NOT to do
- **Don't use `Alert.alert` for standard feedback**: Native alerts are blocking and disrupt the user experience. Use Toasts for standard success/error feedback. Save `Alert.alert` for critical confirmations (like deleting an account).
