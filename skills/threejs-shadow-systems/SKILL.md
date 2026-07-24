---
name: threejs-shadow-systems
description: "Stable and scalable Three.js shadow systems. Use for directional cascades, clipmaps, large worlds, terrain, cities, moving cameras, texel stabilization, cached shadows, custom depth materials, alpha-tested casters, WebGPU or TSL shadow paths, update budgets, and targeted invalidation."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Shadow Systems

Allocate shadow precision and update work from visible scale, motion, and lighting requirements.

## Workflow

1. Define lights, receiver range, caster classes, camera envelope, softness target, alpha and displacement needs, backend, and GPU budget.
2. Establish a correct single-map baseline before cascades, clipmaps, caching, filtering, or contact enhancements.
3. Fit and stabilize projections, assign resolution by coverage, and define update or invalidation triggers.
4. Keep custom vertex displacement, alpha testing, skinning, instancing, and morphing consistent in shadow depth paths.
5. Test static and moving lights, fast cameras, origin shifts, thin geometry, vegetation, distant terrain, Peter Panning, acne, and quality tiers.

## Rules

- Do not increase shadow-map size before fixing projection coverage and bias.
- Express bias and normal bias relative to scene scale and filtering.
- Avoid updating every cascade or clipmap every frame without evidence.
- Keep shadow disposal and render-target ownership explicit.
- Preserve a blob, baked, contact, or disabled fallback for constrained devices.

## Evidence

Return projection diagnostics, cascade or clipmap coverage, bias tests, update rates, GPU timings, memory cost, and fallback captures.
