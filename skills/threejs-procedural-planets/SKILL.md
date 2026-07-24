---
name: threejs-procedural-planets
description: "Procedural planetary bodies in Three.js. Use for spherical terrain, continents, oceans, ridges, craters, biome masks, coastlines, analytic normals, atmosphere coupling, orbital-to-surface LOD, floating origins, and deterministic worlds that must hold up across large scale changes."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Procedural Planets

Keep planetary fields, scale, coordinates, LOD, materials, atmosphere, and lighting within one deterministic contract.

## Workflow

1. Define radius, elevation range, coordinate system, seed, terrain fields, ocean level, biome causes, camera envelope, and precision strategy.
2. Generate low-frequency continents and basins before ridges, craters, erosion cues, and surface detail.
3. Derive geometry, normals, coastlines, materials, vegetation, clouds, and effects from shared world-space fields.
4. Choose cube-sphere, icosphere, clipmap, quadtree, or patch LOD from traversal and continuity needs.
5. Test orbit, approach, horizon, surface proximity, patch seams, origin shifts, day and night lighting, and seed extremes.

## Rules

- Do not use latitude-longitude UVs blindly where polar distortion affects detail.
- Keep elevation units meaningful relative to radius.
- Preserve field continuity and normals across LOD boundaries.
- Coordinate atmosphere and shadow scales with the same planetary radius.
- Bound generated patch, texture, and cache counts.

## Evidence

Return the planet contract, field diagnostics, LOD and precision design, seam tests, orbital-to-ground captures, performance measurements, and cleanup behavior.
