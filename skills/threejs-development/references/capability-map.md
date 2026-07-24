# Three.js Capability Map

## Contents

- Route first
- Core engineering
- Advanced visual systems
- Cross-cutting acceptance

## Route First

Use `threejs-development` when a request spans several systems or starts from an incomplete product brief. Use one specialist directly when the affected boundary is already known.

## Core Engineering

| Concern | Skill |
|---|---|
| Modules, ownership, update phases, migration | `threejs-project-architecture` |
| Loop, resize, visibility, teardown, context recovery | `threejs-scene-lifecycle` |
| glTF, textures, compression, loading, asset rights | `threejs-assets-gltf` |
| Keyframes, mixers, clips, blending, skeletal and morph animation | `threejs-animation-system` |
| Vectors, matrices, quaternions, transforms, projections | `threejs-math-transforms` |
| BufferGeometry, attributes, topology, instancing | `threejs-geometry` |
| PBR materials, textures, environments, lights | `threejs-materials-lighting` |
| GLSL, ShaderMaterial, uniforms, GPU computation | `threejs-shaders` |
| Picking, pointer, touch, keyboard, controls | `threejs-interaction-input` |
| Fixed-step physics and positional audio | `threejs-physics-audio` |
| WebGLRenderer, WebGPURenderer, capability fallback | `threejs-rendering-platforms` |
| WebGPU, TSL node materials, compute, storage, WGSL | `threejs-webgpu-tsl` |
| Pass graphs and screen-space effects | `threejs-postprocessing` |
| React Three Fiber and Drei integration | `threejs-react-three-fiber` |
| HUDs, labels, text, DOM and world-space UI | `threejs-ui-overlays` |
| Core loops, entities, levels, game feel, replay | `threejs-gameplay-systems` |
| 3D charts, point clouds, networks, scientific data | `threejs-data-visualization` |
| Geographic coordinates, floating origins, tiled worlds | `threejs-large-worlds-geospatial` |
| WebXR, comfort, and inclusive fallback | `threejs-webxr-accessibility` |
| Profiling, optimization, adaptive quality, cleanup | `threejs-performance-memory` |
| Reproduction, diagnostics, automated and visual tests | `threejs-testing-debugging` |
| Untrusted assets, policies, production delivery | `threejs-security-deployment` |
| Replication, interpolation, prediction, authority | `threejs-networked-experiences` |

## Advanced Visual Systems

| Concern | Skill |
|---|---|
| Camera rigs, cinematic composition, floating origins | `threejs-camera-direction` |
| Analytic timelines, springs, quaternions, staging | `threejs-procedural-animation` |
| Shared scalar and vector fields | `threejs-procedural-fields` |
| Procedural PBR surfaces and masks | `threejs-procedural-materials` |
| Height-field relief and silhouette POM | `threejs-parallax-occlusion-mapping` |
| Generated production meshes | `threejs-procedural-geometry` |
| Trees, grass, ivy, wind, growth | `threejs-procedural-vegetation` |
| Building grammars, façades, roofs, cities | `threejs-procedural-architecture` |
| Spherical terrain, biomes, craters, orbital LOD | `threejs-procedural-planets` |
| Directional wave-spectrum oceans | `threejs-spectral-ocean` |
| Bounded and analytic water optics | `threejs-water-optics` |
| Rain, snow, wetness, accumulation, splashes | `threejs-precipitation-surfaces` |
| Planetary sky and aerial perspective | `threejs-atmosphere-aerial-perspective` |
| Raymarched clouds and cloud shadows | `threejs-volumetric-clouds` |
| Black holes, wormholes, bounded space raymarching | `threejs-raymarched-space-effects` |
| Particles, debris, wakes, dissolves, effect pools | `threejs-procedural-vfx` |
| History-driven frost, droplets, wet glass | `threejs-temporal-surfaces` |
| Cascades, clipmaps, stable large-world shadows | `threejs-shadow-systems` |
| GTAO and screen-space ambient occlusion | `threejs-screen-space-ambient-occlusion` |
| HDR bloom and selective emission | `threejs-bloom` |
| Exposure adaptation, tone mapping, LUT grading | `threejs-exposure-color-grading` |
| Integrated depth, normals, history, and final image | `threejs-image-pipeline` |
| Fixed-view, seed, temporal, and GPU acceptance | `threejs-visual-validation` |

## Cross-Cutting Acceptance

Every route should state:

1. Three.js and integration versions;
2. renderer and browser or device targets;
3. coordinate, scale, time, color, and resource ownership;
4. quality tiers and fallbacks;
5. fixed diagnostics and reproducible validation;
6. CPU, GPU, memory, loading, and network budgets as applicable;
7. lifecycle, accessibility, security, and deployment behavior.
