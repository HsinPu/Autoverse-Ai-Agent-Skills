---
name: threejs-procedural-geometry
description: "Production procedural mesh generation in Three.js. Use for lofts, shells, profiles, branches, rails, frames, fins, caps, apertures, semantic mesh writers, material slots, custom normals, deterministic variants, and generated objects that must survive close inspection."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Procedural Geometry

Generate topology from semantic parts with deterministic dimensions, surfaces, seams, and material ownership.

## Workflow

1. Define shape grammar, units, coordinate frames, profiles, topology rules, UV ownership, material slots, deformation, and LOD needs.
2. Generate semantic parts and explicit joins rather than one opaque vertex loop.
3. Build indices, normals, tangents, UVs, groups, bounds, caps, and seam policy together.
4. Add deterministic variation only after the base topology passes validation.
5. Test degenerate dimensions, intersections, winding, watertightness where needed, close views, shadow silhouettes, and lower LODs.

## Rules

- Reject or repair zero-area and non-finite triangles before upload.
- Keep topology stable across parameter changes when morphing or caching depends on identity.
- Do not hide missing caps or inverted faces with double-sided materials.
- Separate repeated modules for instancing when it reduces cost without breaking variation.
- Keep collision and picking representations proportional to their needs.

## Evidence

Return the grammar, parameter bounds, topology statistics, wireframe and normal views, UV checks, LOD strategy, and generation timing.
