---
name: threejs-framework-integrations
description: "Three.js integration with non-React UI frameworks and custom component layers. Use for Vue and TresJS, Svelte and Threlte, Angular, Solid, web components, reactive scene graphs, SSR, hydration, framework lifecycle, ecosystem packages, or migration between imperative and declarative ownership."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Framework Integrations

Make one layer authoritative for object creation, updates, render scheduling, and disposal while keeping high-frequency scene state out of general UI reactivity.

## Workflow

1. Inspect framework, integration library, Three.js, renderer, bundler, SSR, routing, and ecosystem package versions.
2. Read [framework-integrations.md](../threejs-development/references/framework-integrations.md) and map component, store, scene, render-loop, asset-cache, event, and teardown ownership.
3. Keep declarative props for structural state and use scoped mutable state for per-frame transforms, simulation, and GPU data.
4. Design loading, suspense-like boundaries, errors, route transitions, hydration guards, on-demand rendering, and shared resources using the selected ecosystem's supported primitives.
5. Isolate imperative third-party controls or effects behind lifecycle-aware adapters.
6. Verify remounts, hot reload, SSR or client-only boundaries, reactive bursts, lost contexts, disposal, idle rendering, and production builds.

## Rules

- Use `threejs-react-three-fiber` when React Three Fiber owns the scene.
- Do not mix direct scene mutation and declarative ownership for the same object without an explicit adapter.
- Avoid putting per-frame values into application-wide reactive stores.
- Verify APIs against the installed TresJS, Threlte, or other integration version.
- Do not assume framework cleanup disposes externally shared GPU resources.

## Evidence

Return the ownership map, reactivity boundary, render-loop policy, resource strategy, SSR behavior, ecosystem compatibility matrix, and remount or cleanup proof.
