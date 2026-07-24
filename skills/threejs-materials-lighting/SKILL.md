---
name: threejs-materials-lighting
description: "Three.js material, texture, environment, and lighting workflow. Use for PBR material selection, texture channels, color management, tone and exposure interactions, environment maps, light rigs, baked lighting, transparency, transmission, material variants, and lighting or shading defects."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Materials and Lighting

Keep material identity, color spaces, illumination, and final-image treatment consistent.

## Workflow

1. Confirm renderer, working and output color spaces, tone-mapping owner, environment pipeline, scene units, and target look.
2. Choose the simplest physically appropriate built-in material before custom shader work.
3. Classify every texture as color, non-color data, normal, depth, HDR, or lookup data and configure sampling, wrapping, mipmaps, anisotropy, and color space accordingly.
4. Build a light hierarchy from key illumination, environment contribution, local accents, baked data, and shadows.
5. Test opaque, alpha-tested, blended, transmissive, double-sided, skinned, instanced, and reflected cases that the product actually uses.

## Rules

- Avoid compensating for incorrect color management by tuning arbitrary light intensity or texture values.
- Keep physical scale and light units consistent when physically based lighting matters.
- Minimize unique material programs and feature permutations.
- Treat transparency sorting and transmission as pipeline decisions, not cosmetic flags.
- Verify texture rights, channel packing, bit depth, and compression artifacts.

## Evidence

Return the material and texture contract, light rig, environment and exposure ownership, shader-program impact, comparison views, and performance cost.
