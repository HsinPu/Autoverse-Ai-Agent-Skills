---
name: threejs-project-architecture
description: "Architecture design and review for maintainable Three.js applications. Use when defining feature modules, scene ownership, dependency direction, simulation boundaries, update phases, state flow, editor/runtime separation, or an incremental migration from a monolithic scene script."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Project Architecture

Build boundaries that let rendering code evolve without turning the scene graph into the application model.

## Workflow

1. Map entry points, renderer and loop ownership, scene factories, loaders, state stores, UI integration, worker boundaries, and disposal paths.
2. Separate domain or simulation state from Three.js objects and transient GPU resources.
3. Define feature modules with explicit create, update, render contribution, resize, suspend, resume, and dispose contracts.
4. Establish dependency direction for platform services such as time, input, assets, audio, physics, networking, and telemetry.
5. Migrate one feature or lifecycle boundary at a time while preserving observable behavior.

## Architecture Rules

- Do not use `Object3D.userData` as an untyped global state store.
- Give one owner responsibility for each renderer, scene, camera rig, resource cache, animation mixer, worker, and event subscription.
- Keep fixed-step simulation separate from render interpolation.
- Pass clocks, randomness, asset resolvers, and platform adapters through explicit dependencies.
- Prefer data-oriented or ECS organization only when entity count and update patterns justify its operational cost.
- Keep editor-only helpers and debug controls out of production bundles when possible.

## Evidence

Provide a module map, update sequence, ownership table, dependency rules, migration slices, cleanup responsibilities, and tests proving behavior across the changed boundaries.

## Handoff

- Use `threejs-scene-lifecycle` for loop, resize, visibility, context-loss, and cleanup details.
- Use `threejs-networked-experiences` when state authority crosses clients or servers.
- Use `threejs-react-three-fiber` when React owns creation and disposal.
