---
name: threejs-testing-debugging
description: "Three.js testing, diagnostics, and root-cause workflow. Use for scene regressions, rendering defects, nondeterministic animation, loader failures, browser or GPU differences, shader errors, interaction bugs, visual baselines, context loss, performance regressions, or building automated confidence around 3D behavior."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Testing and Debugging

Separate math, state, scene integration, renderer output, and platform behavior so failures become reproducible.

## Workflow

1. Capture Three.js and dependency versions, renderer and GPU info, browser, viewport, DPR, camera, seed, asset revision, scene state, and exact reproduction.
2. Reduce the failure to the smallest layer: pure math, state transition, scene graph, asset, shader, pass, input, lifecycle, browser, or GPU.
3. Add diagnostic views for bounds, normals, UVs, depth, overdraw, lights, shadows, passes, resource counts, and timings as relevant.
4. Test pure logic without a GPU; use browser integration for canvas, loader, input, and renderer behavior; use fixed captures for visual checks.
5. Verify the fix on neighboring scenes, alternate quality tiers, resize, pause and resume, repeated mount, and production build.

## Rules

- Fix seeds, clocks, cameras, assets, and viewport before comparing pixels.
- Do not update a visual baseline until the change is reviewed and explained.
- Treat GPU and browser differences as a matrix, not random noise.
- Capture shader source and compiler output without exposing secrets or user data.
- Keep performance acceptance tied to a declared device and scene workload.

## Evidence

Return the reproduction contract, isolated cause, diagnostic artifacts, test layer, browser or device matrix, fresh results, and remaining uncertainty.
