# Frontend Implementation Architecture

Use these tables before creating new components, stores, or data adapters for a design-heavy change.

## Component Reuse Map

| UI responsibility | Existing owner | Decision | Required change | States/variants | Evidence |
| --- | --- | --- | --- | --- | --- |
| <responsibility> | <component or none> | reuse / extend / compose / new | <bounded change> | <states> | <design and code source> |

- Reuse when the existing semantics and states fit.
- Extend when the responsibility is shared and the new variant belongs in the component contract.
- Compose when page-specific layout can combine stable primitives without expanding their APIs.
- Create new only when ownership, semantics, and reuse are real; do not abstract merely to shorten a page file.

## Data-Binding Map

| Surface | Source | Read/write contract | Loading/empty/error | Auth/permission | Mock or fallback |
| --- | --- | --- | --- | --- | --- |
| <component/section> | server / CMS / route / static / user input | <contract> | <behavior> | <rule> | <explicit temporary source> |

Use authoritative content and existing data contracts. Mark mock data visibly and keep it outside production paths. Preserve validation, retry, cancellation, analytics, and error semantics unless the task explicitly changes them.

## State Ownership

| State | Best owner | Use when | Avoid |
| --- | --- | --- | --- |
| Server/cache state | existing query or data layer | remote truth, caching, revalidation | copying responses into component state without a reason |
| URL state | router/search parameters | shareable or navigable filters, tabs, pagination | hiding deep-linkable state in a local hook |
| Application state | existing global owner | several distant surfaces need one durable value | using a global store for convenience |
| Form state | form owner and validation contract | draft input, validation, submission | mixing server truth and unsaved edits |
| Local interaction | nearest component | disclosure, hover intent, transient focus or animation | lifting state before a real shared owner exists |
| Derived state | compute from sources | value can be recomputed reliably | synchronizing duplicate copies with effects |

## Mutations and Optimistic UI

For each mutation, define the pending state, double-submit prevention, optimistic assumption, rollback or reconciliation behavior, error message, retry path, and accessibility announcement. Use optimistic updates only when success is likely and reversal is safe.

## Red Flags

- one component owns rendering, remote fetching, global state, analytics, and unrelated business rules;
- boolean props encode several hidden modes instead of a clear variant or composition boundary;
- a page duplicates a design-system component to change only styling;
- URL, server, and local state can disagree without one reconciliation rule;
- mock content, generated labels, or placeholder assets can leak into production;
- a new architecture pattern appears in one page without repository-level justification.
