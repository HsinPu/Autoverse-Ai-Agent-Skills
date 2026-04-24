---
name: react-ui-patterns
description: React UI state patterns for loading, error, empty, optimistic update, Suspense, and transition flows. Use when building or reviewing React components that fetch data, submit mutations, or need predictable async UX and state handling.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# React UI Patterns

Use this skill when the work is about React UI state behavior, not visual styling.

## When To Use

- Build or review components that fetch data, submit mutations, or refresh in the background
- Design loading, error, empty, and retry states for lists, detail views, and forms
- Add optimistic updates, skeletons, or subtle refresh indicators
- Use `Suspense`, `useTransition`, or `useDeferredValue` to keep UI responsive

## Core Principles

- Never replace visible data with a spinner unless there is no data to show.
- Surface every error to the user with a clear recovery path.
- Keep content visible during background refetches; show a subtle refreshing state instead.
- Use optimistic updates only when rollback is straightforward.
- Prefer progressive disclosure over blocking the whole screen.

## Loading States

- Use skeletons when the final layout is known.
- Use spinners for short, isolated actions like button submissions.
- For lists and detail pages, show loading only on the initial empty state.
- If cached or stale data exists, render it and annotate refresh status.
- If using React Query or SWR, prefer cached data plus `isFetching` or `isValidating` over a full-screen fallback.

```tsx
const { data, isLoading, isFetching, error, refetch } = useQuery(...);

if (error) return <ErrorState error={error} onRetry={refetch} />;
if (isLoading && !data) return <ListSkeleton />;
if (!data?.items.length) return <EmptyState />;

return (
  <>
    {isFetching ? <InlineRefreshIndicator /> : null}
    <ItemList items={data.items} />
  </>
);
```

## Error Handling

- Show inline field errors for forms.
- Use banners or page-level error states when partial data is still usable.
- Use full-screen error states only when the page cannot function.
- Never swallow errors in `catch`; surface them with a retry or recovery action.
- Pair `Suspense` boundaries with an error boundary and a retry affordance.

## Empty States

- Provide an explicit empty state for every collection.
- Keep empty states contextual: no results, no items yet, permission denied, or filtered away.
- Include the next action when the user can recover.

## Mutations

- Disable the triggering control during async work.
- Show loading on the control that initiated the action.
- Use optimistic updates when the user benefit outweighs rollback complexity.
- Always handle mutation failures and revert or explain the mismatch.

```tsx
<Button
  onClick={handleSave}
  disabled={isSaving}
  isLoading={isSaving}
>
  Save
</Button>
```

## Concurrency

- Use `useTransition` for non-urgent updates such as filters, tab changes, or route-adjacent UI.
- Use `useDeferredValue` for expensive derived views that should lag behind typing.
- Cancel stale requests when a later interaction makes them irrelevant.
- Keep local input state responsive even when the data view is expensive.

## Quality Gate

- Every async flow has success, loading, empty, and error states.
- Background refresh does not erase visible content.
- Buttons and submits are disabled while in flight.
- The user can recover from failures without reloading the page.

## Handoff

- For general code style and async primitives, use `javascript-development` or `typescript-development`.
- For visual treatment, spacing, motion, and polish, use `frontend-design`.
- For team-wide conventions, use `coding-standards`.
