---
name: threejs-procedural-animation
description: "Advanced procedural animation for Three.js. Use for analytic transform timelines, launch or flight motion, gravity turns, staging, docking, spring-follow systems, rotating frames, debris motion, quaternion control, deterministic time, and frame-rate-independent secondary response."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Procedural Animation

Express motion from authored phases and invariants rather than accumulating frame-dependent transform edits.

## Workflow

1. Define timeline phases, reference frames, continuity requirements, control parameters, events, and reset or replay behavior.
2. Compute position, velocity, orientation, scale, and effect envelopes from time or fixed simulation state.
3. Use quaternions and explicit local or world frames for rotations, alignment, docking, and handoffs.
4. Apply analytic easing or damped response with units independent of frame rate.
5. Validate phase boundaries, large time steps, pause and resume, reverse or seek if supported, deterministic replay, and camera coupling.

## Rules

- Do not mutate the same transform from multiple hidden animation owners.
- Keep simulation time separate from wall-clock and render delta.
- Preserve continuity of value and, where required, velocity across phase changes.
- Derive secondary effects from the same authoritative motion state.
- Reset cached velocity and temporal history after discontinuities.

## Evidence

Provide the phase table, equations or state transitions, coordinate frames, deterministic controls, boundary tests, and fixed-time captures.
