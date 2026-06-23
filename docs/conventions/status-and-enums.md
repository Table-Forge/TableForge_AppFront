# Status & enums

This document defines how we handle backend enums and render status tags in the mobile app.

---

## Reference implementations
- [features/races/hooks/use-races.ts](../../src/features/races/hooks/use-races.ts) — Example of fetching reference data.
- [components/tag/tag.tsx](../../src/components/tag/tag.tsx) — A status/category tag component.

---

## Backend Enums & Reference Data

Whenever possible, lists of options (like game systems, races, classes) should be fetched from the backend rather than hardcoded in the frontend.

1. **Enum Hooks**: Create a query hook that fetches the reference data.
2. **Stale Time**: Reference data hooks should often have a very high `staleTime` (e.g., `Infinity` or 24 hours) since this data rarely changes.

## Status Tags

When rendering a status pill or category badge:
- Use the shared `<Tag>` component.
- The **label** should ideally come from the backend.
- Pass specific `variant` props to the tag to control its color based on the status, rather than hardcoding colors directly in the screen.

## Rules

1. **Type safety**: Use string literal unions (`"active" | "inactive"`) in TS interfaces rather than arbitrary strings for statuses.
2. **Fallback labels**: If you must map a backend value to a localized label on the frontend, use a strict TypeScript object map so missing keys trigger a type error.

## What NOT to do
- **Don't hardcode large lists**: Avoid hardcoding long lists of options (like all possible RPG races) in the frontend. Always try to pull this from a backend endpoint.
