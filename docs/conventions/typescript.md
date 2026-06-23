# TypeScript

This document outlines our TypeScript configuration and naming conventions.

---

## Reference implementations
- [interfaces/campaign.interfaces.ts](../../src/interfaces/campaign.interfaces.ts) — Shared types.
- [tsconfig.json](../../tsconfig.json) — Compiler options.

---

## Where things live

- **Domain types**: Live in `src/features/<domain>/schemas/` and are inferred from Zod.
- **Shared interfaces**: Live in `src/interfaces/` (e.g., paginated API responses).

## Naming conventions

- **Interfaces**: Prefix with `I` (e.g., `ICampaign`, `IUser`).
- **Type aliases**: Prefix with `T` (e.g., `TOptions`).
- **Enums**: Avoid TypeScript `enum`. Use string literal unions or static constant objects.

## Rules

1. **Strict mode**: TypeScript strict mode is enabled.
2. **Infer from schemas**: Never write a domain interface by hand if a Zod schema exists. Always use `z.infer<typeof Schema>`.
3. **Path aliases**: Use `@/*` for all absolute imports, mapping to `src/`.

## What NOT to do
- **No `any`**: The `any` type is strictly forbidden. Use `unknown` and narrow the type.
- **No unused imports**: The ESLint configuration will throw errors for unused imports.
