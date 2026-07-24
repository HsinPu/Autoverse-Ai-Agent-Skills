---
name: threejs-procedural-vegetation
description: "Procedural vegetation systems for Three.js. Use for grass, trees, branches, roots, ivy, vines, canopies, leaf cards, flowers, species presets, surface growth, deterministic scattering, rooted wind, LOD, instancing, and large vegetation fields."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Procedural Vegetation

Generate readable species structure and rooted motion before increasing instance density.

## Workflow

1. Define biome, species silhouettes, density fields, growth surfaces, seed, scale distribution, wind, interaction, camera range, and device budget.
2. Build trunks, branches, blades, stems, or vines from explicit growth rules and attachment frames.
3. Place foliage and ground cover with deterministic exclusion, clustering, slope, height, and visibility constraints.
4. Apply rooted deformation so bases remain attached while tips and leaves respond at different frequencies.
5. Add impostors, LOD, culling, chunking, and adaptive density from measured scene behavior.

## Rules

- Do not use uniform random scattering for authored ecological structure.
- Preserve surface attachment after terrain or host transforms change.
- Avoid alpha overdraw becoming the hidden vegetation bottleneck.
- Keep wind phase stable per instance and independent from traversal order.
- Test shadows, depth, picking, and motion vectors at every LOD transition.

## Evidence

Return species parameters, density diagnostics, seed sweeps, wind views, LOD transitions, draw and overdraw cost, and memory use.
