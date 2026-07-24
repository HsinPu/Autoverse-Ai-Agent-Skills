---
name: threejs-bloom
description: "Production HDR bloom in Three.js. Use for emissive hierarchy, threshold and knee tuning, multi-scale blur, renderer-native or composer bloom, selective bloom, material restoration, effect isolation, exposure coupling, resolution scaling, and diagnosing washed-out or missing glow."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Bloom

Generate bloom from intentional scene-referred HDR emission and keep selection, exposure, and restoration deterministic.

## Workflow

1. Confirm HDR render-target range, exposure, tone-mapping order, output transform, emitter hierarchy, backend, and target devices.
2. Establish emissive values that remain meaningful without bloom.
3. Configure threshold, soft knee, radius, mip levels, intensity, and resolution from the scene's luminance range.
4. For selective bloom, use explicit layers, masks, or guaranteed save-and-restore logic for every modified material.
5. Test dark and bright scenes, exposure changes, transparent objects, UI, selection toggles, resize, and disabled bloom.

## Rules

- Bloom must occur before tone mapping and output encoding.
- Do not use bloom to compensate for incorrect color management.
- Never leave scene materials mutated after a selective pass.
- Bound blur targets and mip memory by quality tier.
- Preserve a readable no-bloom baseline.

## Evidence

Return HDR and threshold diagnostics, bloom-only and composite views, exposure sweep, restoration test, GPU timing, and fallback.
