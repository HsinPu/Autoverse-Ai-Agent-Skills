---
name: threejs-procedural-characters
description: "Procedural character and creature generation for Three.js. Use for seeded body plans, configurable anatomy, modular characters, runtime rigs, skinning, morphologies, procedural locomotion, inverse kinematics, facial variation, equipment attachment, character LOD, or reproducible crowds."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Procedural Characters

Generate reproducible characters from constrained morphology, rig, material, and motion contracts rather than unrelated random parameters.

## Workflow

1. Define body plan, proportions, joints, deformation limits, locomotion modes, attachment points, style, variation axes, identity requirements, and target budgets.
2. Read [character-spatial-systems.md](../threejs-development/references/character-spatial-systems.md) and separate morphology parameters, generated mesh, skeleton, skin weights, animation state, and gameplay authority.
3. Use seeded, correlated parameter distributions with semantic bounds and validation for intersections, reach, balance, silhouette, and attachment compatibility.
4. Build or select a stable rig, bind pose, bone map, retarget profile, IK constraints, morph targets, and material variants.
5. Design mesh, skeleton, material, animation, shadow, and simulation LOD together; preserve identity across levels.
6. Test seed sweeps, extreme parameter combinations, pose ranges, locomotion transitions, retargeting, equipment, cloning, disposal, and frame or memory budgets.

## Rules

- Do not randomize anatomy, rig, and animation independently when they must remain compatible.
- Keep generation deterministic from an explicit recipe and version.
- Validate skin weights, bind matrices, joint limits, normals, tangents, bounds, and attachment transforms.
- Avoid cultural or demographic labels inferred from arbitrary visual parameters.
- Preserve source and license records for any base mesh, rig, motion, texture, or training-derived asset.

## Evidence

Return the recipe schema, seed and version policy, morphology constraints, rig and retarget map, LOD contract, seed-sweep failures, provenance, and performance measurements.
