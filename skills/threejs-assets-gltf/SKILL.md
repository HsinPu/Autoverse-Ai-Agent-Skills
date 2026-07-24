---
name: threejs-assets-gltf
description: "Three.js asset and glTF pipeline design, implementation, and debugging. Use for GLB or glTF loading, Blender export contracts, runtime asset imports, textures and HDR environments, Draco, Meshopt, KTX2, caching, progress, cancellation, validation, LOD delivery, asset licensing, and production CDN behavior."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Assets and glTF

Treat assets as versioned runtime inputs with measurable size, decode cost, GPU cost, and ownership.

## Workflow

1. Inspect source DCC files, export settings, units, axes, naming, material conventions, animation clips, extensions, compression, and target-device budgets.
2. Prefer glTF or GLB for runtime delivery unless a verified requirement needs another format.
3. Configure only the decoders and loaders required by the asset set; pin compatible versions and worker paths.
4. Model loading, decoding, upload, progress, timeout, cancellation, retry, fallback, and partial-failure states.
5. Validate assets before integration, then inspect hierarchy, bounds, transforms, materials, color-space annotations, animations, and extension support in the real renderer.
6. Record origin, license, attribution, transformation history, cache policy, and deployment path.

## Rules

- Do not use downloaded 3D assets or textures without verified redistribution rights.
- Keep color textures, data textures, normal maps, and HDR inputs correctly annotated.
- Avoid cloning loaded scenes blindly when resources should be shared or skinned meshes need specialized cloning.
- Bound cache growth and define who may evict and dispose shared assets.
- Test cold cache, slow network, corrupt input, decoder failure, and unsupported compression.

## Handoff

- Use `threejs-editor-authoring` plus [authoring-export.md](../threejs-development/references/authoring-export.md) for runtime editing, serialization, GLTFExporter, round trips, and publishing.
- Use `threejs-cad-bim` or `threejs-point-clouds-splats` plus [specialized-data-formats.md](../threejs-development/references/specialized-data-formats.md) when engineering metadata, dense spatial data, or streaming needs exceed a conventional glTF asset boundary.

## Evidence

Return asset budgets, loader graph, failure-state behavior, validation results, attribution requirements, and measured load/decode/upload timing.
