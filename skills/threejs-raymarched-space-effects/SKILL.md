---
name: threejs-raymarched-space-effects
description: "Raymarched space phenomena in Three.js. Use for black holes, accretion disks, wormholes, curved-ray integration, procedural star fields, gravitational-looking lensing, bounded nebulae, signed-distance structures, and GPU effects requiring controlled numerical integration."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Raymarched Space Effects

Build visually motivated integration with explicit bounds, units, termination, and numerical diagnostics.

## Workflow

1. Define the phenomenon, coordinate space, camera relationship, physical versus artistic target, integration domain, step budget, emission, absorption, and background sampling.
2. Establish analytic bounds and ray entry or exit before integrating.
3. Implement the simplest stable field or distance formulation, then add curvature, disk, star, volume, and lensing terms incrementally.
4. Expose step count, path, density, field magnitude, hit reason, and non-finite diagnostics.
5. Test near singularities, missed rays, grazing views, camera motion, large coordinates, long runtimes, resize, and quality tiers.

## Rules

- Bound every loop and terminate on distance, opacity, escape, or error criteria.
- Clamp denominators and avoid hidden NaN propagation.
- Keep texture and environment sampling color-correct.
- Reduce work outside the effect's projected bounds.
- Provide a mesh, sprite, or lower-step fallback.

## Evidence

Return the mathematical contract, integration limits, diagnostics, camera-path captures, GPU timing, artifact analysis, and fallback.
