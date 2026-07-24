---
name: threejs-water-optics
description: "Analytic and bounded water optics in Three.js. Use for Gerstner or multi-wave surfaces, heightfield pools, ripples, refraction, Fresnel reflection, Beer-Lambert absorption, caustics, underwater volumes, crest foam, derivative-filtered normals, and interactive object-driven disturbances."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Water Optics

Choose a water model from domain size, interaction, viewing side, optical target, and performance budget.

## Workflow

1. Define bounded or infinite domain, depth, scale, wave source, interaction, surface crossing, environment, target devices, and renderer.
2. Use analytic waves for broad deterministic motion or a bounded heightfield for local disturbances; keep displacement and normals coupled.
3. Add reflection, refraction, Fresnel, absorption, scatter, depth color, caustics, and foam from physically meaningful inputs.
4. Resolve above-water, below-water, edge, intersection, and container-wall behavior explicitly.
5. Test wave extremes, shallow and deep water, moving objects, camera crossing, grazing angles, resize, and low-quality tiers.

## Rules

- Do not reuse one surface normal frequency for both large shape and microscopic sparkle.
- Keep simulation boundaries and damping visible in diagnostics.
- Prevent feedback when rendering reflection or refraction targets.
- Clamp optical path calculations near zero depth and grazing angles.
- Match collision or buoyancy to the authoritative wave model when gameplay depends on it.

## Evidence

Return the water model, simulation and optical graphs, diagnostic textures, camera-side behavior, interaction tests, GPU cost, and fallback.
