---
name: threejs-physics-audio
description: "Physics and spatial-audio integration for Three.js. Use for rigid bodies, colliders, triggers, character movement, fixed timesteps, interpolation, physics workers, collision-driven effects, positional audio, listener ownership, autoplay restrictions, and synchronized audiovisual simulation."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Physics and Audio

Integrate simulation and sound without making render transforms the authoritative state.

## Workflow

1. Define world units, axes, gravity, collision layers, authority, timestep, determinism needs, and audio activation policy.
2. Select a physics engine and integration boundary from required shapes, joints, character behavior, worker support, bundle cost, and platform compatibility.
3. Keep fixed-step physics state authoritative and interpolate visual transforms for rendering.
4. Map collision and gameplay events to bounded visual and audio cues with deduplication and lifecycle cleanup.
5. Configure the audio listener from camera ownership, unlock audio through user intent, and spatialize only sources that benefit from it.

## Rules

- Do not derive physics from frame-rate-dependent visual deltas.
- Keep collider complexity independent from display-mesh complexity.
- Bound catch-up steps after stalls.
- Never start audible playback before required browser consent or user interaction.
- Dispose audio nodes, buffers, workers, bodies, shapes, and subscriptions with their owning feature.

## Evidence

Report engine and audio choices, fixed-step policy, transform synchronization, collision matrix, worker boundary, activation behavior, performance budget, and teardown tests.
