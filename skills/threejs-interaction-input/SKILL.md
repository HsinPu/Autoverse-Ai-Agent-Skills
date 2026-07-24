---
name: threejs-interaction-input
description: "Three.js interaction and input implementation. Use for raycasting, GPU picking, BVH or Octree acceleration, spatial indexes, pointer, touch, pen, keyboard, gamepad, gestures, drag and transform tools, camera controls, selection, hover, focus, occlusion, event routing, or DOM-to-scene synchronization."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Interaction and Input

Turn raw platform input into deterministic scene intents with visible focus and ownership.

## Workflow

1. Define input devices, target objects, interaction states, camera-control arbitration, UI overlays, accessibility alternatives, and latency requirements.
2. Normalize pointer coordinates from the actual canvas rectangle and drawing layout.
3. Choose CPU raycasting, layers, simplified colliders, BVH, Octree, another spatial index, or GPU picking from object count, update frequency, precision, and build or refit cost.
4. Model hover, press, capture, drag, cancel, release, focus, selection, and multi-touch transitions explicitly.
5. Test overlapping objects, transparent surfaces, instancing, skinned meshes, canvas resize, scroll, high DPR, pointer capture, lost focus, and mobile gestures.

## Rules

- Keep input sampling separate from simulation and visual feedback.
- Do not let camera controls and object manipulation consume the same gesture without arbitration.
- Bound per-frame raycast work and reuse query objects where practical.
- Define how spatial indexes are built, refit, invalidated, and replaced when geometry or transforms change.
- Preserve keyboard and non-pointer alternatives for essential actions.
- Treat untrusted object metadata as data, not executable commands.

## Evidence

Return the interaction state machine, picking and acceleration strategy, index invalidation policy, event ownership, focus behavior, accessibility path, edge-case tests, and measured build and query cost.
