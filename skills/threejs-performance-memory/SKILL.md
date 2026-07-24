---
name: threejs-performance-memory
description: "Three.js performance and memory diagnosis and optimization. Use for low FPS, frame spikes, draw calls, shader stalls, overdraw, fill rate, large textures, decode cost, garbage collection, GPU leaks, mobile thermal limits, LOD, instancing, batching, BVH, Octree, spatial acceleration, occlusion culling, workers, or adaptive quality."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Performance and Memory

Optimize the measured bottleneck while preserving a declared visual and behavioral floor.

## Workflow

1. Reproduce on a representative scene, viewport, device, browser, renderer, camera path, and cache state.
2. Measure CPU frame work, GPU frame time, draw calls, triangles, shader programs, textures, render targets, memory, loading, and long tasks.
3. Classify the constraint as simulation, JavaScript, garbage collection, submission, vertex, fragment, bandwidth, upload, compilation, decode, or memory lifetime.
4. Apply the narrowest change: frustum or occlusion culling, LOD, instancing, batching, shared resources, texture or target reduction, pass scaling, on-demand rendering, BVH or Octree acceleration, workers, or quality tiers.
5. Re-measure the same trace and run visual and behavior regressions.

## Rules

- Do not optimize triangle count while fill rate or shader cost is the bottleneck.
- Avoid per-frame allocation in hot paths.
- Warm or schedule shader compilation when first-use stalls are visible.
- Bound DPR and expensive pass resolution by device policy.
- Pair every cache with limits, ownership, invalidation, and disposal.
- Measure spatial-index build, update or refit, memory, and query cost; static-scene gains can reverse when dynamic invalidation dominates.

## Evidence

Return before-and-after traces, bottleneck classification, acceleration or culling costs where used, quality impact, device matrix, stable resource counts, and regression results.
