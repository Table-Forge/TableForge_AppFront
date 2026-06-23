# Components

This document defines how we build, structure, and consume UI components in the AppFront project.

---

## Reference implementations
- [button/button.tsx](../../src/components/button/button.tsx) — Example of a variant-based component.
- [screen/screen.tsx](../../src/components/screen/screen.tsx) — Example of a compound component.

---

## Where things live

- **Shared components**: Live in `src/components/`. These are highly reusable (e.g., buttons, inputs, tags).
- **Screen-specific components**: Live in `src/pages-components/`. These are tightly coupled to a specific feature (e.g., `campaign/`).

## Component Patterns

### 1. Compound Components
We heavily use the Compound Component pattern for complex UIs, notably the `<Screen>` component.
```tsx
<Screen>
  <Screen.Header title="Title" />
  <Screen.Body>...</Screen.Body>
</Screen>
```

### 2. Variant-based Props
Components like Buttons should use specific string literal props for variants and sizes rather than scattered boolean flags.
```tsx
<Button variant="primary" size="md" />
```

## Rules

1. **One component per directory**: Each component lives in its own directory (e.g., `components/button/button.tsx`).
2. **Haptics**: Interactive elements (like primary buttons) should trigger haptic feedback using `expo-haptics`.
3. **Controlled inputs**: Form-bound inputs should use `forwardRef` and wrap standard React Native `TextInput` components to integrate easily with `react-hook-form`'s `<Controller>`.
4. **StyleSheet**: All styling must be done using `StyleSheet.create()`. Do not use inline style objects unless absolutely necessary for dynamic values.

## What NOT to do
- **Don't use CSS-in-JS libraries**: We use pure React Native `StyleSheet` combined with our central `src/theme/` tokens. No Tailwind or Styled-Components.
