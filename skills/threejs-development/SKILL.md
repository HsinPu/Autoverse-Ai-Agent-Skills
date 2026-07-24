---
name: threejs-development
description: "End-to-end Three.js development routing and delivery workflow. Use when building, restructuring, reviewing, or debugging a complete Three.js experience that spans architecture, scene lifecycle, assets, rendering, interaction, performance, advanced graphics, testing, accessibility, or deployment."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Development

Route a Three.js task to the smallest specialist set while preserving one coherent scene, renderer, resource, and verification contract.

## Workflow

1. Inspect the installed Three.js version, package manager, bundler, renderer, framework integration, browser targets, asset pipeline, and existing test commands.
2. Define the experience contract: camera and input, scene scale, visual target, supported devices, accessibility fallback, loading behavior, frame-time and memory budgets, and deployment constraints.
3. Read [capability-map.md](references/capability-map.md) and select only the Skills that own the affected systems.
4. Establish architecture, lifecycle, renderer, color, asset, and resource ownership before adding advanced effects.
5. Implement in vertical slices that retain a working no-effect baseline and expose diagnostics for each new render or simulation stage.
6. Verify deterministic behavior, resize and lifecycle transitions, representative devices, visual evidence, performance budgets, cleanup, and production build behavior.

## System Order

1. Project and scene ownership
2. Renderer, camera, color, and asset contracts
3. Geometry, materials, lighting, animation, and input
4. Simulation, environment, and advanced visual systems
5. Post-processing and final-image treatment
6. Accessibility, testing, performance, security, and deployment

## Core Rules

- Preserve the repository's current framework and render-loop ownership unless a measured limitation requires migration.
- Keep simulation state, render state, and user-interface state explicit.
- Use one declared world scale and coordinate convention.
- Keep time, randomness, input, and external data injectable when deterministic testing matters.
- Add quality tiers and fallbacks before expensive effects become release dependencies.
- Treat screenshots as evidence only when the camera, seed, viewport, renderer, color pipeline, and scene state are fixed.
- Verify APIs against the installed Three.js version and [official-resources.md](references/official-resources.md); do not rely on examples from a different release without checking compatibility.

## Required Deliverable

Return the selected specialist route, confirmed versions and targets, ownership boundaries, scene and render flow, quality budgets, implementation slices, diagnostics, validation evidence, compatibility limits, and remaining risks.
