---
name: threejs-temporal-surfaces
description: "History-driven surface effects in Three.js. Use for touch frost and thaw, wet glass, rain droplets, accumulation masks, ping-pong simulation, reduced-resolution blur, crystalline growth, two-scale refraction, history reprojection, and interactive screen- or surface-space state."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Temporal Surfaces

Own history buffers, interaction stamps, simulation cadence, reset rules, and surface composition explicitly.

## Workflow

1. Define the surface domain, history channels, interaction inputs, accumulation and decay, resolution, blur or diffusion, refraction, and camera relationship.
2. Build ping-pong history with deterministic initialization, bounded values, and clear read/write ownership.
3. Rasterize or project interaction into the same coordinate contract as the surface state.
4. Derive masks, normals, refraction, blur, roughness, and opacity from the history in separate diagnostic stages.
5. Test resize, camera cuts, surface motion, UV seams, rapid input, pause, long runtimes, and history reset.

## Rules

- Never sample and write the same texture without a supported feedback mechanism.
- Reset or reproject history when its coordinate mapping becomes invalid.
- Keep simulation resolution independent from display resolution where possible.
- Bound accumulation, decay, and blur energy.
- Provide a static or non-temporal fallback.

## Evidence

Return the history schema, pass sequence, reset policy, diagnostic textures, interaction tests, memory and GPU cost, and fallback.
