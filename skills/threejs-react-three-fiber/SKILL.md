---
name: threejs-react-three-fiber
description: "React Three Fiber architecture, implementation, review, and debugging. Use for Canvas setup, declarative scene components, hooks, render-loop ownership, Suspense asset loading, Drei integrations, event handling, shared resources, disposal, state stores, adaptive quality, or migration between vanilla Three.js and React."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js React Three Fiber

Preserve React ownership and Three.js performance semantics without mixing incompatible lifecycles.

## Workflow

1. Confirm React, `@react-three/fiber`, Drei, Three.js, renderer, and reconciler compatibility.
2. Map which state belongs to React, an external store, mutable frame state, Three.js objects, or the server.
3. Keep declarative creation and disposal inside the Canvas tree; isolate imperative bridges behind focused hooks or components.
4. Select continuous, demand, or manual frame-loop behavior from actual scene motion.
5. Handle loading, errors, asset caching, route transitions, strict-mode behavior, and Canvas fallback UI.
6. Profile component rerenders, object creation, draw calls, shader compilation, and frame cost on representative devices.

## Rules

- Do not call React state setters every frame for transient animation state.
- Use `useFrame` and `useThree` only under Canvas ownership.
- Memoize or share expensive resources deliberately; understand loader cache and disposal implications.
- Never disable automatic disposal globally without assigning a replacement owner.
- Verify third-party Drei and ecosystem components against the installed versions.

## Evidence

Return the ownership map, frame-loop policy, component boundaries, loading and error states, cleanup behavior, version matrix, and performance profile.
