---
name: threejs-procedural-architecture
description: "Procedural architecture and city generation in Three.js. Use for massing grammars, façade bays, exposed-edge analysis, profiles, arches, cornices, roofs, ornaments, modular kits, deterministic building variants, material-slot compilation, interiors, and scalable urban scenes."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Procedural Architecture

Build architecture from massing, structural rhythm, façade grammar, and exposure rules rather than randomized decoration.

## Workflow

1. Define plot, massing, floors, bays, style vocabulary, structural constraints, openings, roofs, materials, interiors, seed, and LOD envelope.
2. Resolve shared and exposed edges before generating façades and trim.
3. Compile repeated semantic modules into instanced or merged render units while preserving material and selection identity.
4. Add deterministic variation within bounded style rules.
5. Validate corners, openings, roof joins, ground contact, interior visibility, navigation, shadows, and city-scale culling.

## Rules

- Keep dimensions and floor logic consistent across all generated parts.
- Do not place ornaments before the base silhouette and façade rhythm read correctly.
- Avoid z-fighting from coplanar façade layers.
- Preserve stable identifiers for editing, selection, networking, and regeneration.
- Separate render, collision, navigation, and occlusion geometry.

## Evidence

Return the grammar, seed policy, module inventory, exposed-edge diagnostics, topology and draw counts, LOD behavior, and representative variant captures.
