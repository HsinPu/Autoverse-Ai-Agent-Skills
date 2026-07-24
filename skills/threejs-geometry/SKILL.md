---
name: threejs-geometry
description: "Three.js BufferGeometry construction, review, and optimization. Use for custom attributes and indices, topology, normals, tangents, UVs, groups, morph targets, skinning data, bounds, instancing, merging, line or point geometry, picking geometry, and geometry-related rendering defects."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Geometry

Build geometry with explicit topology, attribute semantics, bounds, and update frequency.

## Workflow

1. Define coordinate space, winding, index strategy, primitive type, vertex layout, material groups, deformation needs, and precision range.
2. Construct or load attributes with compatible counts and normalized types.
3. Generate or preserve normals, tangents, UV sets, skin weights, morph targets, and bounds according to the material and animation contract.
4. Select individual meshes, merged geometry, instancing, batching, or level-of-detail from measured update and culling behavior.
5. Validate front and back faces, seams, non-uniform scale, negative determinant transforms, picking, frustum culling, and disposal.

## Rules

- Do not compute normals as a substitute for fixing invalid topology.
- Keep dynamic attributes narrow and mark their update ranges deliberately.
- Recompute bounding volumes when vertex positions change in ways that affect culling or picking.
- Preserve material groups and indices when optimizing imported geometry.
- Use instancing only when shared geometry and material identity match the draw strategy.

## Evidence

Report vertex and triangle counts, attribute layout, draw-call strategy, bounds, deformation behavior, memory estimate, and visual checks for normals, UVs, seams, and culling.
