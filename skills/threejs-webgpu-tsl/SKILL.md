---
name: threejs-webgpu-tsl
description: "Three.js WebGPU and TSL implementation, review, and migration. Use for WebGPURenderer, node materials, Three.js Shading Language, storage buffers or textures, compute nodes, indirect workloads, renderer-native post-processing, WGSL interop, async readback, bind-group limits, and WebGL fallback."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js WebGPU and TSL

Adopt WebGPU and TSL from verified workload needs, installed-version APIs, and explicit fallback guarantees.

## Workflow

1. Confirm Three.js revision, browser and device matrix, initialized backend, required limits and features, ecosystem compatibility, and fallback contract.
2. Prototype the riskiest node material, compute workload, storage layout, readback, post effect, transparency, shadow, and XR requirement before broad migration.
3. Define buffer and texture formats, strides, alignment, update cadence, ownership, synchronization, and lifetime.
4. Build TSL graphs from named signals and reusable functions; isolate custom WGSL behind typed input and output contracts.
5. Add backend, node, buffer, compute, and output diagnostics plus deterministic CPU or reduced-quality references where practical.
6. Test native WebGPU, forced WebGL fallback, device loss, resize, quality tiers, readback alignment, shader rebuilds, and production tree shaking.

## Rules

- Verify every version-sensitive import and API against the installed Three.js source or official documentation.
- Do not claim native WebGPU merely because `WebGPURenderer` was constructed; record the actual backend.
- Keep buffer strides and struct alignment machine-checkable.
- Bound compute dispatch, storage, readback, and history memory.
- State which guarantees are lost in WebGL or no-effect fallback.

## Evidence

Return the backend evidence, capability matrix, node and compute graph, resource layouts, parity gaps, GPU timings, memory, device-loss behavior, and fallback results.
