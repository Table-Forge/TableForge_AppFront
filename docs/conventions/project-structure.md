# Project structure

This document outlines the high-level architecture and folder structure of the TableForge AppFront (Mobile) project.

---

## Reference implementations
- [app/_layout.tsx](../../src/app/_layout.tsx) — Root layout and providers.
- [package.json](../../package.json) — Dependencies and scripts.

---

## Where things live

The `src/` directory is organized by technical concern and feature domains.

- `app/` — Expo Router file-based routing. This acts as the entry point for all screens.
- `assets/` — Images, fonts, and local media.
- `components/` — Reusable UI components. Each component gets its own directory.
- `config/` — Configuration for third-party libraries (e.g., Toast).
- `constants/` — Application-wide constants.
- `context/` — React Context providers (e.g., AuthContext).
- `data/` — Mock data and static content.
- `features/` — Domain feature modules (API, schemas, services, and hooks).
- `hooks/` — Shared, cross-cutting hooks.
- `interfaces/` — Shared TS interfaces (pagination, common types).
- `pages-components/` — Components strictly coupled to a specific screen/feature, not globally shared.
- `theme/` — Design tokens, colors, fonts, and React Navigation theme configuration.
- `utils/` — Helper functions, formatters, and custom Zod schemas.

## Naming

- **Files and directories**: Always use `kebab-case` (e.g., `use-campaign.ts`, `auth-token-store.ts`).
- **Components/Screens**: Default exports for screens in `app/`, PascalCase for component functions.
- **Interfaces/Types**: `I` prefix for interfaces (`ICampaign`), `T` prefix for type aliases (`TOptions`).

## Rules

1. **Path aliases**: Use the `@/*` alias for absolute imports, which maps to the project root (`@/src/...`).
2. **Domain types**: Types must be inferred from Zod schemas (`z.infer`). Do not manually declare duplicate interfaces.
3. **Data fetching**: All API interaction MUST live inside `src/features/`. Never fetch directly from a screen.
4. **Platform specific code**: Use `Platform.select()` or `.ios.tsx`/`.android.tsx` extensions when platform-specific logic is needed.

## What NOT to do
- **Don't scatter API calls**: Keep all API definitions inside `src/features/`.
- **Don't use relative paths for deep imports**: Use the `@/` alias to avoid `../../../` hell.
