---
name: threejs-precipitation-surfaces
description: "Coupled weather precipitation and affected surfaces in Three.js. Use for rain, snow, sleet, streaks, flakes, splashes, puddles, ripples, wetness, snow accumulation, material transitions, model snow caps, shared storm envelopes, and weather-driven surface response."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Precipitation Surfaces

Drive falling particles, impacts, accumulation, wetness, and material response from one weather state.

## Workflow

1. Define precipitation type, intensity, wind, temperature, coverage, camera volume, collision or impact needs, accumulation, evaporation or melt, and device budget.
2. Generate precipitation in a camera-aware or world-partitioned volume without visible respawn patterns.
3. Convert impacts and exposure into bounded surface wetness, puddles, ripples, snow coverage, and material changes.
4. Couple roughness, normals, reflection, color, displacement, and VFX to shared coverage fields.
5. Test storm transitions, camera motion, sheltered areas, slopes, moving objects, ground intersections, long runtimes, and reduced tiers.

## Rules

- Keep visible particle motion and surface-state time scales distinct.
- Do not let every drop perform an expensive scene raycast.
- Avoid unbounded accumulation or feedback textures.
- Keep transparent particle overdraw within budget.
- Exclude third-party example assets or code without verified compatible licenses.

## Evidence

Return the weather state graph, particle and surface diagnostics, accumulation bounds, transition captures, overdraw and GPU measurements, and fallback behavior.
