---
name: threejs-csg-modeling
description: "Three.js constructive-solid-geometry and Boolean modeling workflow. Use for union, subtraction, intersection, cutaways, holes, procedural solid editing, authoring-time Boolean stacks, manifold repair, material-group or attribute preservation, CSG performance, or robust export of Boolean results."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js CSG Modeling

Treat Boolean operations as topology transformations with explicit validity, tolerance, attribute, and authoring contracts.

## Workflow

1. Define operand units, transforms, expected solid semantics, open or closed surfaces, material ownership, edit frequency, output format, and acceptable geometric error.
2. Read [csg-modeling.md](../threejs-development/references/csg-modeling.md), preflight manifoldness, winding, degeneracy, coplanarity, self-intersection, bounds, and transform parity, and reject invalid solid claims.
3. Select a BSP, BVH, exact, voxel, or offline representation from robustness, latency, mesh size, update cadence, and attribute requirements.
4. Execute operations in a stable coordinate range, retain canonical operands and operation order, and remap positions, normals, tangents, UVs, colors, skin or morph data, and material groups deliberately.
5. Repair or disclose slivers, duplicate vertices, seams, caps, normals, bounds, and disconnected components; integrate workers, undo and redo, picking, caching, and disposal where authoring is interactive.
6. Verify known Boolean cases, transformed and near-coplanar operands, repeated edits, export and reimport, memory plateau, and visual correctness under neutral and grazing light.

## Rules

- Do not use normal recomputation to disguise non-manifold or self-intersecting output.
- Derive tolerances from declared world scale and numeric precision, not one global magic epsilon.
- Preserve source operands and parameters so destructive output can be regenerated and audited.
- Do not promise preservation of animation, morph, skin, UV, or material data without an explicit remapping path.
- Keep expensive Boolean evaluation outside pointer-rate interaction unless measured budgets pass.

## Evidence

Return operand validity, algorithm choice, tolerance policy, operation graph, attribute and material result, topology diagnostics, latency and memory measurements, export round trip, failure cases, and remaining geometric limitations.
