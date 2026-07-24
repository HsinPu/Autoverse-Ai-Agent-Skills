---
name: threejs-volumetric-clouds
description: "Volumetric cloud systems in Three.js. Use for weather-driven density, layered cloud volumes, shape and detail erosion, vertical profiles, bounded raymarching, light cones, silver lining, temporal reconstruction, cloud shadows, local weather maps, and scalable quality modes."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Volumetric Clouds

Separate weather, density, lighting, shadow, temporal, and composition stages so each can be measured.

## Workflow

1. Define cloud layer bounds, coverage, type, weather map, wind, density profile, lighting, shadow receiver, camera envelope, and performance tier.
2. Build low-frequency shape and vertical profile before detail erosion and turbulence.
3. Raymarch only inside bounded volumes with adaptive or tiered step counts and early termination.
4. Add directional lighting, ambient contribution, multi-scatter approximation, temporal reconstruction, and cloud shadows in stages.
5. Test camera motion, sunrise and sunset, cloud entry, horizon, weather transitions, history rejection, resolution changes, and low-end fallbacks.

## Rules

- Do not spend detail samples in empty space.
- Keep cloud motion in world or weather coordinates, not camera UVs.
- Reset temporal history after cuts, teleports, and incompatible parameter changes.
- Bound 3D texture and render-target memory.
- Provide billboard, layered-noise, or disabled-cloud fallbacks.

## Evidence

Return density and lighting diagnostics, layer controls, history behavior, shadow comparisons, GPU timing by stage, memory cost, and fallback captures.
