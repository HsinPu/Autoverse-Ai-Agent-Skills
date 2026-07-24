---
name: threejs-procedural-materials
description: "Production procedural materials in Three.js. Use for terrain, soil, moss, rock, lava, planets, wetness, wear, dissolve, per-instance variation, texture-procedural hybrids, derivative normals, PBR channel generation, relief, and custom lighting or shadow modulation."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Procedural Materials

Generate correlated PBR channels from material causes and preserve the renderer's color and lighting contract.

## Workflow

1. Define surface identity, physical scale, coordinate space, texture inputs, procedural fields, lighting model, distance envelope, and backend.
2. Build masks from meaningful causes such as height, slope, moisture, curvature, exposure, age, or instance state.
3. Derive base color, roughness, metalness, normal, displacement, opacity, and emission without duplicating unrelated noise.
4. Integrate filtering, antialiasing, shadow depth, instancing, and environment response.
5. Validate under neutral and production lighting, near and far cameras, moving light, texture extremes, and quality tiers.

## Rules

- Keep data textures out of sRGB conversion.
- Avoid displacement that no longer matches normals, shadows, bounds, or collision.
- Limit material variants and shader recompilation.
- Clamp or regularize derivative and normalization operations to avoid NaNs.
- Keep emissive hierarchy compatible with exposure and bloom.

## Evidence

Return the material graph, channel diagnostics, scale controls, lighting comparisons, shader-program impact, GPU timing, and fallback.
