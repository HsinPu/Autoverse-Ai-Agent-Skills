---
name: threejs-rendering-platforms
description: "Three.js renderer and graphics-platform selection. Use when choosing or migrating between WebGLRenderer and WebGPURenderer, defining WebGPU and WebGL fallbacks, configuring canvas and context options, render targets, antialiasing, depth precision, HDR output buffers, backend capability checks, or context recovery."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Rendering Platforms

Choose the renderer from verified feature, device, fallback, and delivery requirements.

## Workflow

1. Record Three.js revision, browser matrix, GPU baseline, XR needs, shader model, post-processing path, antialiasing, output precision, and required extensions.
2. Build a feature matrix for WebGL and WebGPU rather than assuming API parity.
3. Prototype the highest-risk material, render target, readback, post effect, and XR path on each supported backend.
4. Centralize capability detection and renderer creation; expose a stable application-facing rendering contract.
5. Verify resize, DPR, color output, context or device loss, fallback selection, warm-up, and production bundle behavior.

## Rules

- Pin and verify version-sensitive APIs against the installed Three.js release.
- Do not advertise WebGPU support without a tested WebGL or product-level fallback where required.
- Keep renderer-specific materials and passes behind explicit adapters.
- Measure output-buffer precision and memory instead of defaulting every target to the highest format.
- Record context attributes that affect transparency, performance, readback, and compositing.

## Evidence

Return the backend matrix, selected renderer, fallback policy, capability probes, render-target formats, known parity gaps, and device results.
