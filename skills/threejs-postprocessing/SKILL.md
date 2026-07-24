---
name: threejs-postprocessing
description: "Three.js post-processing pipeline design and implementation. Use for EffectComposer or renderer-native effects, render passes, multisampling, depth and normal ownership, outline, depth of field, motion blur, anti-aliasing, custom full-screen passes, effect ordering, resolution scaling, and no-post fallbacks."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Post-Processing

Build effects as an ordered signal graph with declared resolution, color, depth, and history ownership.

## Workflow

1. Confirm renderer backend, color pipeline, tone-mapping owner, HDR range, depth convention, transparency needs, and target devices.
2. Draw the pass graph, including every input, output, format, scale, and history buffer.
3. Establish an unprocessed reference render before adding effects.
4. Add one pass at a time with an enable flag, debug output, and independent quality control.
5. Test resize, DPR, camera cuts, temporal resets, transparent objects, UI composition, screenshot capture, and disposal.

## Rules

- Tone-map and encode output exactly once.
- Do not apply screen-space effects without valid depth, normal, velocity, or history inputs.
- Prefer reduced-resolution expensive passes with edge-aware reconstruction when evidence supports it.
- Reset temporal history after camera cuts, teleports, resize, or incompatible quality changes.
- Keep essential scene readability when post-processing is disabled.

## Evidence

Return the pass graph, formats and resolutions, ordering rationale, diagnostic views, no-post comparison, GPU timings, resize and history tests, and fallback tier.
