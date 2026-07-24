---
name: threejs-materials-lighting
description: "Three.js material, texture, media, environment, and lighting workflow. Use for PBR materials, texture channels, VideoTexture, CanvasTexture, webcam or media streams, 360 video, color management, environment maps, light rigs, baked lighting, transparency, transmission, variants, and shading defects."
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
3. Classify every texture as color, non-color data, normal, depth, HDR, lookup, canvas, or time-varying media and configure sampling, wrapping, mipmaps, anisotropy, color space, update cadence, and lifetime accordingly.
4. For video, webcam, or 360 media, define permissions, autoplay and user activation, frame readiness, aspect and projection, pause or background behavior, error fallback, and element or stream ownership.
5. Build a light hierarchy from key illumination, environment contribution, local accents, baked data, and shadows.
6. Test opaque, alpha-tested, blended, transmissive, double-sided, skinned, instanced, reflected, dynamic-canvas, and media-texture cases that the product actually uses.

## Rules

- Avoid compensating for incorrect color management by tuning arbitrary light intensity or texture values.
- Keep physical scale and light units consistent when physically based lighting matters.
- Minimize unique material programs and feature permutations.
- Treat transparency sorting and transmission as pipeline decisions, not cosmetic flags.
- Stop media tracks, release elements, and dispose dynamic textures with their owner; do not assume texture disposal ends the underlying stream.
- Verify texture rights, channel packing, bit depth, and compression artifacts.

## Evidence

Return the material and texture contract, light rig, environment and exposure ownership, shader-program impact, comparison views, and performance cost.
