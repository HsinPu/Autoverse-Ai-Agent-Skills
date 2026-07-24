---
name: threejs-exposure-color-grading
description: "Exposure, tone mapping, and color grading for Three.js. Use for luminance metering, eye adaptation, manual or automatic exposure, tone-map ownership, output transforms, LUT generation or application, scene-referred versus display-referred ordering, and diagnosing crushed, clipped, dark, or double-encoded output."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Exposure and Color Grading

Assign one owner to metering, adaptation, exposure, tone mapping, grading, and output conversion.

## Workflow

1. Define working and output color spaces, HDR range, renderer path, tone mapper, grading target, display assumptions, and screenshot behavior.
2. If automatic exposure is required, meter a bounded luminance signal with explicit exclusions and percentile or log-average policy.
3. Adapt exposure with separate brighten and darken rates, clamps, camera-cut reset, and deterministic test controls.
4. Tone-map once, then apply display-referred grading or LUT operations in the declared order.
5. Test black, diffuse midtone, emissive highlight, sky, dark-to-bright cuts, resize, post-disabled output, and texture color annotations.

## Rules

- Never tone-map or encode output twice.
- Keep non-color textures and numeric data out of display transforms.
- Avoid synchronous GPU readback in the frame-critical path.
- Keep LUT domain, interpolation, size, and source provenance explicit.
- Provide manual exposure and neutral-grade baselines.

## Evidence

Return the color pipeline, luminance diagnostics, adaptation curves, neutral and graded captures, output checks, readback cost, and reset behavior.
