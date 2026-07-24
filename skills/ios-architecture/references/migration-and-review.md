# iOS Architecture Migration and Review

Use this reference for an existing app, mixed architecture, or architecture-focused PR review.

## Current-State Map

Record:

- app and scene entry points;
- targets, Swift packages, modules, and feature folders;
- state owners and event flow;
- navigation and presentation owners;
- network, persistence, cache, keychain, notification, analytics, and SDK boundaries;
- actor isolation, tasks, subscriptions, and cancellation paths;
- unit, integration, UI, snapshot, and architecture tests;
- generated files and boundaries that cannot be changed in the current release.

Identify concrete pain before selecting a target: change amplification, circular dependencies, giant ViewModels, implicit state, duplicated routing, untestable singletons, framework leakage, or incompatible patterns inside one feature.

## Incremental Migration

1. Choose one feature with representative pain and a manageable blast radius.
2. Add characterization tests around current user-visible behavior.
3. Define the new boundary and keep the old public entry point stable.
4. Introduce capability protocols around time, identity, I/O, and external services only where the slice needs them.
5. Move state transitions or use-case orchestration before moving folders.
6. Adapt the existing UI and data implementations to the new boundary.
7. Keep a temporary adapter between old and new code; name its removal condition.
8. Verify behavior, cancellation, deep links, persistence, and tests.
9. Remove the old path only after callers have migrated and repository search proves it is unused.
10. Repeat by vertical slice. Stop when the remaining architecture is proportionate to its change pressure.

Avoid a folder-only migration that leaves dependencies and ownership unchanged.

## Architecture Review Checks

### Ownership

- Does every mutable state value have one clear owner?
- Can views, routers, and services mutate the same state through hidden paths?
- Does navigation belong to a route or flow owner rather than arbitrary views?

### Dependency Direction

- Does business policy import SwiftUI, UIKit, persistence, transport, analytics, or vendor SDK types?
- Are global singletons or service locators hiding dependencies?
- Does the composition root choose concrete implementations?

### Effects and Concurrency

- Does each task or subscription have an owner, cancellation point, and error path?
- Are UI mutations isolated to the main actor?
- Can stale work overwrite newer user intent?
- Are retries bounded and idempotency assumptions explicit?

### Data

- Are transport and storage models translated at boundaries?
- Is offline, cache freshness, migration, and conflict behavior owned by a specific layer?
- Can tests replace time, identifiers, storage, network, and external services?

### Proportion

- Does the pattern solve an observed problem?
- Is a new framework or module justified by adoption cost?
- Does a small feature carry more architectural roles than behavior?
- Does the proposal preserve compatible local conventions where they remain sound?

## Review Output

Return findings with file or symbol evidence, severity, violated boundary, smallest correction, and required test. Conclude with a migration sequence only when the current design needs structural change; do not turn every review into a rewrite proposal.
