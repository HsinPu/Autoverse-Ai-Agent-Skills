# Three.js CSG Modeling Contract

Use this reference when Boolean operations produce solid geometry for runtime display, procedural generation, an editor, collision, manufacturing-style inspection, or export.

## Operand Preflight

Before evaluation, record:

- units, coordinate range, transforms, determinant sign, and expected tolerance;
- indexed or non-indexed layout and triangle winding;
- watertightness, boundary and non-manifold edges, duplicate or degenerate triangles, and self-intersections;
- open-surface intent, coplanar faces, touching-only contacts, nested shells, and disconnected components;
- required attributes, material groups, stable IDs, hierarchy, and source provenance.

A visible mesh is not automatically a valid solid. Reject, repair, voxelize, or explicitly downgrade invalid operands.

## Representation Choice

| Representation | Prefer when | Main risk |
|---|---|---|
| BSP | Small, bounded, authoring-oriented solids | Split growth and numeric sensitivity |
| BVH triangle CSG | Larger triangle meshes and repeated evaluation | Input validity and attribute remapping |
| Exact or robust offline kernel | Engineering correctness dominates latency | Integration and conversion cost |
| Voxel or signed field | Noisy input or organic operations tolerate approximation | Resolution error and lost attributes |
| Precomputed result | Runtime interaction is unnecessary | Variant and download growth |

Keep original operands and an ordered operation graph. Cache only results whose operands, transforms, tolerances, and algorithm revision match.

## Topology and Attribute Result

- Use a scale-derived tolerance and test near-coplanar cases above and below it.
- Decide how new cut faces obtain normals, UVs, tangents, material IDs, metadata, and semantic ownership.
- Recompute bounds after topology changes and inspect normal and tangent seams.
- Preserve or explicitly discard vertex colors, secondary UVs, morphs, skinning, custom attributes, and groups.
- Separate render mesh, collision representation, selection identity, and export mesh when their constraints differ.

For interactive authoring, coalesce parameter drags, cancel stale worker jobs, bound undo history, and dispose superseded geometries without destroying shared operands.

## Verification Set

Include:

- disjoint, contained, identical, touching, intersecting, transformed, mirrored, and near-coplanar operands;
- thin walls, small holes, acute angles, large coordinate offsets, repeated operations, and inverted winding;
- topology statistics, boundary and non-manifold edge counts, component count, bounds, normals, groups, and attribute counts;
- export and reimport in the target consumer;
- latency, allocation, cancellation, cache invalidation, and repeated-edit memory plateau.

## Technical Authority

- Three.js CSG example: https://threejs.org/examples/webgl_geometry_csg.html
- Three.js BufferGeometry: https://threejs.org/docs/pages/BufferGeometry.html
- Example dependency reference: https://github.com/gkjohnson/three-bvh-csg

Verify third-party behavior, license, and Three.js compatibility at the pinned dependency revision.
