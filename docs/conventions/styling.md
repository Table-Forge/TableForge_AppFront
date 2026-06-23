# Styling

This document explains our styling approach using React Native's `StyleSheet`.

---

## Reference implementations
- [theme/colors.tsx](../../src/theme/colors.tsx) — Centralized color palette.
- [theme/tokens.ts](../../src/theme/tokens.ts) — Centralized design tokens.

---

## Design System

We use a completely custom, pure React Native styling approach, heavily relying on centralized tokens located in `src/theme/`.

The app forces a **Dark Theme** globally.

- `DEFAULT_COLORS`: The core dark palette (e.g., `#1A1A2E`, `#2a2a45`, orange accents).
- `RADII`: Standard border radii values.
- `SHADOWS`: Standard shadow configurations (card, floating, glow).
- `SURFACES`: Standard background and card surfaces.
- `BORDERS`: Standard border colors and widths.
- `TEXT_TONES`: Standard text colors (primary, muted, accent).

## Rules

1. **StyleSheet.create**: All styling must use `StyleSheet.create()`.
2. **Use Tokens**: Never hardcode hex codes or pixel values for standard layout properties (radii, borders) in components. Import the tokens from `src/theme/`.
3. **Platform-specific fonts**: Use `Platform.select()` to load the correct font families across iOS, Android, and Web.

## What NOT to do
- **No Tailwind/NativeWind**: We do not use CSS-in-JS utility class libraries.
- **No inline objects**: Do not pass inline objects to the `style` prop (e.g., `style={{ marginTop: 10 }}`) as this causes unnecessary re-renders. Always reference a `StyleSheet` object.
