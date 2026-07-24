---
name: threejs-path-tracing
description: "Three.js progressive path-tracing integration and validation. Use for photorealistic product rendering, accumulated ray tracing, BVH-backed light transport, material and environment compatibility, convergence, denoising, tiled or offline output, or an interactive raster-to-path-traced quality mode."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Path Tracing

Build an accumulation pipeline whose supported light transport, reset behavior, convergence, and fallback are explicit.

## Workflow

1. Define interactive, still-image, tiled, or offline intent; resolution, sample and time budgets; bounce limits; lighting; material support; motion; and target devices.
2. Read [path-tracing.md](../threejs-development/references/path-tracing.md) and classify every scene feature as native, approximated, baked, raster-composited, or unsupported.
3. Choose the integrator and acceleration boundary, partition static and dynamic geometry, and budget BVH build, update, memory, instancing, skinning, and texture residency.
4. Freeze camera, scene, material, light, environment, seed, and output state for each accumulation epoch; reset only from declared invalidation events.
5. Keep scene-linear accumulation separate from display tone mapping, add a responsive raster or low-sample preview where needed, and place denoising after a documented signal contract.
6. Validate convergence, bias, fireflies, ghosting, material parity, environment importance sampling, resize and context recovery, memory plateau, and named-device performance.

## Rules

- Do not describe the result as physically correct when required BSDFs, lights, volumes, motion, or spectral behavior are unsupported.
- Never average tone-mapped or output-encoded frames as radiance samples.
- Reset accumulation when any sampled scene input changes; do not hide stale history behind a higher sample count.
- Keep deterministic sample and seed control for regression evidence.
- Provide an honest raster, lower-resolution, lower-bounce, or unsupported-feature fallback.

## Evidence

Return the support matrix, integrator and BVH design, accumulation and reset contract, sample or time budget, convergence captures, unsupported features, fallback behavior, GPU and memory measurements, and lifecycle results.
