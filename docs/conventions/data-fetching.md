# Data fetching

This document covers how we interact with the backend API and manage server state.

---

## Reference implementations
- [features/api.ts](../../src/features/api.ts) — Axios instance.
- [features/campaigns/services/campaign.service.ts](../../src/features/campaigns/services/campaign.service.ts) — Example service.
- [features/campaigns/hooks/use-campaign.ts](../../src/features/campaigns/hooks/use-campaign.ts) — Example query hook.

---

## The 3-Layer Architecture

All data fetching lives in `src/features/` and follows a strict 3-layer pattern:

1. **Schemas (`schemas/`)**: Zod schemas defining validation and inferred types.
2. **Services (`services/`)**: Static objects with methods that wrap Axios calls to `api.get/post/put`.
3. **Hooks (`hooks/`)**: TanStack React Query hooks.

## Query keys

Query keys are centralized as constants within the feature's hook directory.
```ts
export const CAMPAIGNS = "campaigns";
// Usage in hooks
queryKey: [CAMPAIGNS, "details", id]
```

## Hooks

### Query hooks
- Use `useQuery` for standard fetching and `useInfiniteQuery` for paginated lists.
- **Placeholder data**: Detail hooks should often use `placeholderData` to synchronously pre-populate the UI from an existing infinite query cache list.

### Mutation hooks
Mutations must handle success and error states predictably:
- **`onSuccess`**: Invalidate relevant query keys, show a Toast notification, and optionally navigate. We heavily use **optimistic cache updates** (manually patching the cache data) for a snappier mobile experience.
- **`onError`**: Delegate to the custom Toast logic with backend error extraction.

## Global Configuration

The `QueryClient` is configured in `app/_layout.tsx`:
- `staleTime: 5 min`
- `gcTime: 10 min`
- `retry: 2`

## Rules

1. **No direct Axios usage in screens**: Screens must exclusively consume data via React Query hooks.
2. **Reactotron Logging**: The Axios instance integrates with Reactotron to log all API requests and responses during development.

## What NOT to do
- **Don't swallow errors**: Do not use `try/catch` blocks inside screens to handle API errors.
- **Don't bypass Zod**: Always validate complex payloads using Zod schemas before sending them via services.
