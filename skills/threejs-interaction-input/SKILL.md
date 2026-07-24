---
name: threejs-interaction-input
description: "Three.js interaction and input implementation. Use for raycasting, GPU picking, pointer, touch, pen, keyboard, gamepad, gestures, drag and transform tools, camera controls, selection, hover, focus, occlusion, event routing, or synchronization between DOM UI and a 3D scene."
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
3. Choose CPU raycasting, layers, simplified colliders, spatial indexing, or GPU picking from object count and precision needs.
4. Model hover, press, capture, drag, cancel, release, focus, selection, and multi-touch transitions explicitly.
5. Test overlapping objects, transparent surfaces, instancing, skinned meshes, canvas resize, scroll, high DPR, pointer capture, lost focus, and mobile gestures.

## Rules

- Keep input sampling separate from simulation and visual feedback.
- Do not let camera controls and object manipulation consume the same gesture without arbitration.
- Bound per-frame raycast work and reuse query objects where practical.
- Preserve keyboard and non-pointer alternatives for essential actions.
- Treat untrusted object metadata as data, not executable commands.

## Evidence

Return the interaction state machine, picking strategy, event ownership, focus behavior, accessibility path, edge-case tests, and measured query cost.
