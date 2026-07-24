---
name: threejs-point-clouds-splats
description: "Three.js point-cloud and 3D Gaussian-splat delivery. Use for PLY, LAS or LAZ conversion, dense scans, photogrammetry, point attributes, splat data, progressive streaming, LOD, frustum or hierarchy traversal, depth sorting, picking, classification, annotations, or large spatial datasets."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Point Clouds and Splats

Preserve spatial meaning and visible quality while bounding transfer, decode, sorting, GPU memory, and query cost.

## Workflow

1. Define format, coordinate reference, units, attributes, point or splat count, privacy, source rights, camera envelope, interactions, and device budgets.
2. Read [specialized-data-formats.md](../threejs-development/references/specialized-data-formats.md) and choose conversion, chunking, hierarchy, compression, and runtime representation.
3. Preserve stable identifiers or source indices when selection, classification, annotation, or auditability matters.
4. Design progressive loading, visibility traversal, LOD, point or splat budget, eviction, cancellation, and origin rebasing from measured camera paths.
5. Implement picking, filtering, clipping, coloring, measurement, and accessible summaries against the same transformed data model.
6. Validate known coordinates, classifications, density transitions, sorting artifacts, missing chunks, cold loads, memory pressure, and representative mobile or integrated GPUs.

## Rules

- Do not load the full dataset merely because it fits on a developer workstation.
- Distinguish point-cloud rendering from Gaussian-splat blending and sorting requirements.
- Never discard coordinate-reference or scale metadata silently.
- Treat uploaded scans, metadata, and decoder paths as untrusted.
- Record lossy conversion, culling, and LOD effects on analytical accuracy.

## Evidence

Return the format and coordinate contract, conversion record, streaming hierarchy, memory budget, query behavior, visual and analytical error checks, and fallback limits.
