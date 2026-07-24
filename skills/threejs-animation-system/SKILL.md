---
name: threejs-animation-system
description: "Three.js keyframe and character animation systems. Use for AnimationClip, AnimationMixer, AnimationAction, tracks, blending, crossfades, additive layers, skeletal or facial animation, morph targets, root motion, locomotion, inverse kinematics, CCDIKSolver, ragdoll handoff, retargeting, events, and mixer lifecycle."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Animation System

Own clip identity, mixer time, blending, root motion, events, and disposal separately from procedural motion.

## Workflow

1. Inspect asset skeletons, rest poses, bind matrices, bone maps, morph targets, clip names, tracks, units, loop intent, root transform, mixer ownership, and target frame rate.
2. Read [character-spatial-systems.md](../threejs-development/references/character-spatial-systems.md) when IK, locomotion, procedural characters, navigation, or physics share pose or transform authority.
3. Normalize and validate clips after loading; remove invalid or redundant tracks only with behavior evidence.
4. Model locomotion, facial and body layers, transitions, crossfades, masks, speed, synchronization, interruption, and fallback poses explicitly.
5. Decide whether root motion drives authoritative simulation or is removed and reapplied from gameplay state; declare clip, procedural, IK, network, and ragdoll arbitration.
6. Update each mixer and solver from the correct clock and clean up actions, roots, bindings, cached clips, targets, and constraints with the owning character or scene.
7. Test abrupt transitions, repeated fades, reverse or seek, pause and resume, low FPS, foot contacts, cloned characters, retargeting, ragdoll recovery, morph and skeletal combinations, and teardown.

## Rules

- Do not drive the same transform from clips, procedural animation, physics, and networking without a declared arbitration order.
- Avoid assuming clip frame rate controls runtime sampling.
- Keep animation events deterministic and idempotent across replay or reconciliation.
- Verify cloned skinned meshes preserve independent skeleton state where required.
- Validate retargeted hips, feet, shoulders, twist bones, scale, and contact behavior rather than accepting exception-free playback.
- Reset IK and pose-history state after teleports, origin shifts, rig swaps, and other discontinuities.
- Uncache actions, clips, and roots only after all users release them.

## Evidence

Return the animation state graph, clip and track inventory, transition table, root-motion policy, synchronization tests, mixer cost, and lifecycle proof.
