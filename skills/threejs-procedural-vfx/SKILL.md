---
name: threejs-procedural-vfx
description: "Production real-time VFX in Three.js. Use for particles, sparks, plasma, trails, wakes, debris, dissolves, impact bursts, effect pools, instanced quads or meshes, GPU simulation, HDR emission hierarchy, and lifecycle-safe timed effects."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Procedural VFX

Model each effect as a bounded lifecycle with deterministic spawn, simulation, rendering, and reclamation.

## Workflow

1. Define semantic event, emitter space, spawn envelope, lifetime, motion, color and emission curve, collision, sorting, pooling, and quality budget.
2. Choose CPU arrays, instancing, points, transform feedback, compute, or texture simulation from count and behavior.
3. Derive shape, motion, opacity, size, and light contribution from normalized lifetime and shared event state.
4. Add pooling, dense removal, maximum counts, offscreen policy, and deterministic seeds.
5. Test burst storms, long sessions, camera cuts, origin shifts, pause, low FPS, transparency, bloom, and teardown.

## Rules

- Do not allocate objects per particle in a hot loop.
- Keep spawn rate and active-count limits explicit.
- Avoid transparent overdraw consuming the full frame budget.
- Reset pooled state completely before reuse.
- Keep emissive intensity compatible with exposure and bloom.

## Evidence

Return the effect graph, lifecycle and pool contract, diagnostic counts, overdraw view, seed tests, CPU/GPU timings, and quality tiers.
