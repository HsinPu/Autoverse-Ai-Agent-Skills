---
name: threejs-shaders
description: "Custom Three.js shader design, implementation, review, and debugging. Use for ShaderMaterial, RawShaderMaterial, material hooks, GLSL, uniforms, varyings, derivatives, texture sampling, GPU simulation, precision issues, shader compilation failures, or deciding between classic shaders and TSL node materials."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Shaders

Author shader behavior as a tested signal pipeline with explicit spaces, precision, and fallbacks.

## Workflow

1. Confirm renderer backend, Three.js revision, GLSL or TSL path, target browser and GPU tier, material integration, and required fallback.
2. Specify inputs, coordinate spaces, texture semantics, outputs, blending, depth behavior, and update frequency before writing code.
3. Implement the smallest shader stage or node graph that proves the effect.
4. Add bounded uniforms and debug modes for intermediate fields, normals, depth, UVs, masks, and lighting terms.
5. Test compilation, precision, derivatives, loops, branches, NaN or infinity propagation, edge UVs, resizing, and context restoration.

## Rules

- Keep model, view, world, tangent, clip, and screen spaces explicit.
- Do not inject version-fragile shader chunks without pinning and testing the supported Three.js range.
- Avoid unbounded raymarch or simulation loops.
- Keep uniforms stable; do not recreate uniform containers every frame without need.
- Define a WebGL, reduced-quality, or no-effect fallback for backend-specific features.

## Evidence

Provide the shader contract, backend and version assumptions, diagnostic views, compile results, GPU cost, numerical limits, and fallback behavior.
