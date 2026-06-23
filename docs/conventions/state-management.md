# State management

This document clarifies how we manage client and global state.

---

## Reference implementations
- [context/auth.tsx](../../src/context/auth.tsx) — React Context for Auth state.
- [features/campaigns/hooks/use-campaigns.ts](../../src/features/campaigns/hooks/use-campaigns.ts) — Server state via React Query.

---

## Minimal Global State

We intentionally avoid heavyweight state management libraries like Redux or Zustand in this project.

1. **Server State**: Handled entirely by **TanStack Query**. Almost all application data (campaigns, characters) lives in the query cache.
2. **Session State**: Handled by a single **React Context** (`AuthContext`).
3. **Local State**: Managed via standard `useState` and `useReducer` hooks.

## Rules

1. **Leverage the Query Cache**: Instead of lifting state to a global store, rely on React Query's cache. If multiple components need the same data, call the `useQuery` hook in both places.
2. **Context sparingly**: Only use React Context for truly global, rarely changing state (like the current user session).

## What NOT to do
- **Don't install Redux/Zustand**: If you feel the need for a global store, reconsider if the data could live in React Query or be passed via props/context.
