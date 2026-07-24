---
name: threejs-animation-system
description: "Three.js keyframe and character animation systems. Use for AnimationClip, AnimationMixer, AnimationAction, tracks, blending, crossfades, additive layers, skeletal animation, morph targets, root motion, retargeting, synchronization, animation events, clip optimization, and mixer lifecycle."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Animation System

Own clip identity, mixer time, blending, root motion, events, and disposal separately from procedural motion.

## Workflow

1. Inspect asset skeletons, morph targets, clip names, tracks, units, loop intent, root transform, mixer ownership, and target frame rate.
2. Normalize and validate clips after loading; remove invalid or redundant tracks only with behavior evidence.
3. Model animation states, transitions, crossfades, additive layers, masks, speed, synchronization, interruption, and fallback poses explicitly.
4. Decide whether root motion drives authoritative simulation or is removed and reapplied from gameplay state.
5. Update each mixer from the correct clock and clean up actions, roots, bindings, and cached clips with the owning character or scene.
6. Test abrupt transitions, repeated fades, reverse or seek, pause and resume, low FPS, cloned characters, retargeting, morph and skeletal combinations, and teardown.

## Rules

- Do not drive the same transform from clips, procedural animation, physics, and networking without a declared arbitration order.
- Avoid assuming clip frame rate controls runtime sampling.
- Keep animation events deterministic and idempotent across replay or reconciliation.
- Verify cloned skinned meshes preserve independent skeleton state where required.
- Uncache actions, clips, and roots only after all users release them.

## Evidence

Return the animation state graph, clip and track inventory, transition table, root-motion policy, synchronization tests, mixer cost, and lifecycle proof.
