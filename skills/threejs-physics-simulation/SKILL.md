---
name: threejs-physics-simulation
description: "Three.js physics-simulation integration. Use for rigid bodies, colliders, triggers, joints, constraints, character controllers, vehicles, fixed timesteps, interpolation, collision layers, physics workers, determinism, contact events, or synchronization between simulation and render transforms."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Physics Simulation

Keep simulation state authoritative and make rendering a time-interpolated view of that state.

## Workflow

1. Define world units, axes, gravity, collision layers, body types, shapes, joints, character behavior, authority, determinism, and platform budgets.
2. Choose an engine and integration boundary from required features, maintenance, bundle and initialization cost, worker support, serialization, and target compatibility.
3. Use a bounded fixed-step accumulator and interpolate render transforms without feeding interpolation back into simulation.
4. Build colliders independently from display meshes and define trigger, contact, sleep, teleport, origin-shift, and destruction behavior.
5. Map collision events into idempotent gameplay intents; hand audiovisual cues to their owning systems.
6. Test low and high frame rates, stalls, tunneling, stacking, constraints, slopes, moving platforms, scene reloads, worker failure, and cleanup.

## Rules

- Do not derive physics from frame-rate-dependent visual deltas.
- Never let animation, navigation, networking, and physics write the same transform without an authority order.
- Bound catch-up steps after stalls and define the resulting time policy.
- Treat cross-engine determinism claims as unproven until measured for the exact build and inputs.
- Dispose bodies, shapes, joints, workers, subscriptions, and cached worlds with their owner.

## Evidence

Return the engine decision, simulation contract, fixed-step policy, collider and layer matrix, authority order, performance trace, failure tests, and stable teardown counts.

## Handoff

- Use `threejs-deformable-simulation` for cloth, ropes, soft bodies, strands, particle fluids, or grid and volume fluids.
- Keep rigid and deformable ownership separate even when their collision coupling is two-way.
