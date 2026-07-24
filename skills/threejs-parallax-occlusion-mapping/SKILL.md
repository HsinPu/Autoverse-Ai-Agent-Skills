---
name: threejs-parallax-occlusion-mapping
description: "Parallax occlusion mapping for Three.js GLSL or TSL. Use for height-field ray marching, relief UVs, view-angle adaptive steps, self-shadowing, height-derived normals, curved shells, silhouette clipping, relief-aware depth or shadows, and quality scaling."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Parallax Occlusion Mapping

Treat relief as a bounded height-field intersection problem with matching shading, silhouettes, and shadow behavior.

## Workflow

1. Confirm tangent basis, height convention, physical relief scale, UV topology, backend, silhouette requirement, and viewing range.
2. March through the height field with bounded, angle-aware steps and refine the intersection.
3. Derive corrected UVs, normals, optional self-shadow, and depth or silhouette behavior from the same height definition.
4. Add grazing-angle limits, UV boundary handling, and lower-cost quality tiers.
5. Test flat and curved surfaces, mirrored UVs, seams, extreme angles, animated lights, shadows, and texture filtering.

## Rules

- Do not use POM where true geometry is required for collision or large silhouette change.
- Clamp tangent-space denominators and march distances.
- Keep color, normal, height, and shadow sampling aligned.
- Bound loops for every supported GPU backend.
- Provide a normal-map or flat-material fallback.

## Evidence

Return the height convention, step policy, diagnostic intersections, silhouette and shadow comparisons, GPU timing, and fallback thresholds.
