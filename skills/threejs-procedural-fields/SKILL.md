---
name: threejs-procedural-fields
description: "Coherent procedural scalar and vector fields for Three.js. Use for terrain, biomes, clouds, water masks, wear, displacement, roughness, normals, flow, density, domain warping, and any system where geometry and material channels must share deterministic spatial causes."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Procedural Fields

Define one field contract that can drive related geometry, material, simulation, and diagnostic outputs.

## Workflow

1. Specify domain coordinates, units, seed, periodicity, frequency bands, output range, derivatives, and CPU/GPU consistency needs.
2. Build low-frequency structure before detail, warping, erosion, or masks.
3. Derive dependent channels such as displacement, normals, material regions, wetness, vegetation density, and VFX emission from shared causes.
4. Expose field, gradient, band, and threshold diagnostics.
5. Test seed variation, origin shifts, seams, scale changes, negative coordinates, precision limits, and temporal stability.

## Rules

- Keep randomness deterministic and independent from traversal order.
- Do not stack unrelated noise until the visual target appears.
- Preserve units and amplitude meaning across octaves and quality tiers.
- Use analytic or consistent finite-difference derivatives when normals or flow depend on them.
- Bound sample count and provide lower-cost frequency tiers.

## Evidence

Return the field contract, dependency graph, seed policy, diagnostic views, continuity tests, and CPU/GPU cost.
