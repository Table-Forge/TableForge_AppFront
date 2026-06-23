# Screens

This document describes the structure and anatomy of Screen components.

---

## Reference implementations
- [app/(tabs)/campaigns.tsx](../../src/app/(tabs)/campaigns.tsx) — A main tab screen.
- [app/campaign/[id].tsx](../../src/app/campaign/[id].tsx) — A detail screen.

---

## Anatomy of a screen

A standard screen in the AppFront project is built using the Compound `<Screen>` component.

```tsx
export default function MyScreen() {
  const { data } = useMyData();

  return (
    <Screen>
      <Screen.Header title="Título da Tela" showBackButton />
      
      <Screen.Body scrollable>
        {/* Screen content here */}
      </Screen.Body>
      
      <Screen.Footer>
        <Button title="Ação Principal" />
      </Screen.Footer>
    </Screen>
  );
}
```

## Screen Types

1. **Tab Screens**: Rendered inside `(tabs)/`. These screens don't have a back button and often use `Screen.HeaderBanner` instead of a standard header.
2. **Detail Screens**: Rendered in the root stack (e.g., `campaign/[id].tsx`). They are pushed onto the stack and should always show a back button.
3. **Modal/Flow Screens**: Screens like `create-account` or `create-campaign`.

## Colocation

If a screen requires complex sub-components that are NOT reusable elsewhere in the app, place them in `src/pages-components/<screen-name>/`.
Do NOT pollute `src/components/` with one-off screen elements.

## Rules

1. **Default Exports**: Files inside `src/app/` must use `export default function` so Expo Router can properly register the route.
2. **SafeArea**: The `<Screen>` component automatically handles Safe Area boundaries (notches, home indicators). You generally don't need to manually use `SafeAreaView`.

## What NOT to do
- **Don't inline massive components**: If a screen file is getting too long, break it down into smaller components and place them in `pages-components/`.
