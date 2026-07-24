---
name: threejs-screen-space-ambient-occlusion
description: "Screen-space ambient occlusion for Three.js. Use for SSAO or GTAO, half-resolution horizon sampling, depth and normal reconstruction, reversed depth, bent normals, temporal filtering, bilateral upsampling, contact grounding, halo diagnosis, and environment-light occlusion."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Screen-Space Ambient Occlusion

Treat ambient occlusion as depth-scale-aware visibility data, not a generic darkening filter.

## Workflow

1. Confirm depth convention, projection reconstruction, normal source, world scale, resolution, environment-light owner, and renderer backend.
2. Validate view-position and normal reconstruction before sampling occlusion.
3. Add bounded horizon or hemisphere sampling with radius and thickness expressed in scene units.
4. Denoise and upsample with depth and normal awareness; add temporal history only after spatial correctness.
5. Apply occlusion to the intended ambient or indirect term and preserve direct illumination and emissive signals.

## Rules

- Do not multiply the final image indiscriminately.
- Reset history after camera cuts, resize, or depth-convention changes.
- Prevent background and foreground depth discontinuities from bleeding.
- Keep sample count, radius, and resolution quality-tiered.
- Provide raw AO, reconstructed normals, depth, and composite diagnostics.

## Evidence

Return reconstruction tests, raw and filtered AO views, halo checks, no-AO comparison, GPU timing, and quality tiers.
