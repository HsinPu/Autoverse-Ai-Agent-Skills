---
name: threejs-image-pipeline
description: "Integrated final-image pipeline for advanced Three.js scenes. Use when coordinating depth, normals, albedo, motion, history, ambient occlusion, shadows, atmosphere, bloom, exposure, tone mapping, grading, antialiasing, transparency, diagnostics, and effect-local render targets."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Image Pipeline

Integrate advanced effects through an explicit frame graph with declared signal meaning and single ownership.

## Workflow

1. Inventory every required scene signal, pass, format, resolution, history buffer, transparent path, backend dependency, and output target.
2. Draw the frame graph from scene-referred rendering through screen-space effects, atmosphere, bloom, exposure, tone mapping, grading, antialiasing, and final encoding.
3. Assign one owner to depth, normals, motion, exposure, tone mapping, output conversion, resize, history reset, and disposal.
4. Add bypass and diagnostic outputs for every pass and retain a direct no-post scene baseline.
5. Test resize, DPR change, camera cut, backend fallback, transparent objects, XR if supported, screenshots, and production build.

## Rules

- Keep signal spaces, ranges, alpha meaning, and depth conventions documented.
- Avoid redundant full-scene passes when one validated signal can be shared.
- Reset only the histories made invalid by a discontinuity.
- Do not mix incompatible post-processing frameworks without a proven ownership boundary.
- Track render-target memory and GPU time per stage.

## Evidence

Return the frame graph, ownership table, formats, diagnostics, bypass comparisons, per-pass timing, memory budget, and compatibility limits.

## Handoff

- Use `threejs-path-tracing` for progressive radiance accumulation, BVH-backed light transport, convergence, and path-traced feature support.
- Use `threejs-capture-recording` when screenshots, frame sequences, codecs, timestamps, audio, or exported media artifacts own the acceptance contract.
