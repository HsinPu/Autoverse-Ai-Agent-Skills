---
name: threejs-scene-lifecycle
description: "Three.js scene, renderer, and resource lifecycle implementation. Use for bootstrap, animation-loop ownership, resize and DPR handling, page visibility, pause and resume, route or level transitions, WebGL context loss, hot reload, teardown, and leak-free disposal."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Scene Lifecycle

Make every allocated browser, CPU, and GPU resource have a visible owner and terminal state.

## Workflow

1. Trace creation and destruction for canvas, renderer, scene, cameras, controls, observers, loaders, workers, mixers, audio, render targets, geometries, materials, textures, and skeletons.
2. Choose one animation-loop owner and define fixed simulation, variable updates, render, and post-render phases.
3. Resize from the canvas display size, clamp DPR by policy, and update camera projections and render targets together.
4. Define behavior for hidden tabs, reduced motion, route changes, level reloads, context loss and restoration, and development hot reload.
5. Dispose only after shared-resource ownership is known; verify repeated mount and unmount cycles with `renderer.info` and browser memory evidence.

## Rules

- Removing an object from a scene does not dispose its GPU resources.
- Cancel animation frames, timers, observers, workers, and event listeners during teardown.
- Do not dispose shared geometry, material, texture, skeleton, or cache entries while another owner still uses them.
- Avoid large delta-time jumps after pause; reset or clamp clock state on resume.
- Keep resize work idempotent and avoid reallocating render targets every frame.

## Required Evidence

Show the lifecycle state machine, ownership inventory, repeated transition test, context-loss behavior, and stable resource counts after cleanup.
