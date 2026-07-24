---
name: threejs-math-transforms
description: "Three.js math, transforms, and coordinate-space problem solving. Use for vectors, matrices, quaternions, Euler angles, local and world transforms, basis construction, projections, rays, planes, bounds, interpolation, numerical precision, handedness, axes, and conversion between object, camera, clip, NDC, screen, and geographic spaces."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Math and Transforms

Name every space, unit, basis, and ownership boundary before manipulating coordinates.

## Workflow

1. Record source and destination spaces, axes, handedness, units, transform hierarchy, scale, precision range, and mutation ownership.
2. Reduce the problem to vectors, points, directions, normals, rotations, rays, planes, bounds, or projections with the correct transformation semantics.
3. Use matrices and quaternions for composition; use Euler angles only as a human-facing representation where suitable.
4. Normalize only values whose meaning requires unit length and guard zero or near-zero cases.
5. Test identity, translation, rotation, non-uniform and negative scale, parent transforms, inverse transforms, extreme coordinates, collinearity, and degenerate bounds.

## Rules

- Transform points with translation and directions without it.
- Transform normals with the inverse-transpose rule when scale is non-uniform.
- Do not interpolate arbitrary orientations through Euler components.
- Reuse temporary math objects in hot paths without leaking shared mutable state.
- Keep tolerances relative to the scale and operation being tested.

## Evidence

Return a space diagram, equations or operation sequence, degenerate-case handling, numeric tolerances, representative tests, and before-and-after coordinate examples.
