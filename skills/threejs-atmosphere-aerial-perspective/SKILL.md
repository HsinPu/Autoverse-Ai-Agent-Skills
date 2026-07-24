---
name: threejs-atmosphere-aerial-perspective
description: "Planetary atmosphere and aerial-perspective systems in Three.js. Use for Rayleigh and Mie scattering, sky domes, precomputed lookup textures, sun or moon discs, ground-to-space transitions, depth-based transmittance and inscattering, atmosphere-aware lighting, and large-scale distance cues."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Atmosphere and Aerial Perspective

Choose an atmospheric tier from scene scale, camera altitude, lighting needs, precision, and target GPU.

## Workflow

1. Define planet and atmosphere radii, camera range, sun direction, scattering coefficients, density profiles, exposure coupling, depth source, and quality tiers.
2. Start with analytic sky and distance haze, then adopt LUT or raymarched scattering only when the required altitude and lighting envelope justify it.
3. Apply transmittance and inscattering consistently to sky, terrain, objects, sun, clouds, and environment lighting.
4. Add diagnostics for optical depth, transmittance, scattering terms, depth reconstruction, and sun visibility.
5. Test ground, horizon, high altitude, orbit, sunrise, sunset, night, reversed depth, large coordinates, and camera cuts.

## Rules

- Keep physical units consistent across geometry and scattering.
- Do not apply arbitrary distance fog on top of a complete aerial-perspective solution without intent.
- Match depth reconstruction to the active renderer convention.
- Bound LUT formats, ray steps, and update frequency.
- Keep a no-atmosphere and low-cost haze baseline.

## Evidence

Return the implementation tier, parameter units, signal graph, diagnostic views, altitude and time-of-day captures, GPU timings, and fallback.
