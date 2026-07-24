# Three.js Path-Tracing Contract

Use this reference for progressive light transport. Raymarched signed-distance effects, screen-space reflections, shadow maps, and raster post-processing have different sampling and validity contracts.

## Rendering Intent

Choose one primary mode:

| Mode | Primary constraint |
|---|---|
| Interactive preview | Fast reset, responsive camera, early-sample stability |
| Progressive still | Convergence and final-image quality |
| Deterministic frame sequence | Repeatable sample schedule per frame |
| Tiled high resolution | Seam-free camera and sample coordinates |
| Offline export | Quality or throughput rather than interaction latency |

Declare resolution, samples per pixel or time limit, bounce depth, direct-light sampling, environment importance sampling, transparency, volumes, motion blur, depth of field, denoising, and target devices.

## Scene Support Matrix

Classify each scene feature:

- geometry: static, transformed, instanced, skinned, morphed, procedurally displaced, lines, points;
- material: diffuse, metal, dielectric, transmission, clearcoat, emissive, normal map, alpha test, alpha blend, custom shader;
- lighting: punctual, area, emissive geometry, environment, procedural sky;
- dynamics: camera, transforms, animation, simulation, texture or uniform updates;
- composition: raster overlays, helpers, outlines, UI, labels, post-processing.

For each row record `native`, `approximated`, `baked`, `raster-composited`, or `unsupported`. Do not silently drop features.

## Accumulation Epoch

An epoch has immutable:

- camera and lens;
- geometry, transforms, acceleration data, and visibility;
- materials, textures, lights, and environment;
- integrator settings, seed schedule, exposure input, and resolution.

Reset accumulation when any sampled input changes. Resize, DPR, camera cuts, material edits, environment rotation, asset completion, animation, origin shifts, or renderer recovery are reset events unless the implementation proves a correct partial update.

Accumulate scene-linear radiance. Tone mapping, grading, output conversion, UI, and lossy encoding happen after accumulation.

## Performance and Quality

- Partition static and dynamic acceleration structures.
- Measure BVH build and refit time, traversal time, texture and geometry memory, samples per second, and time to a declared quality threshold.
- Bound fireflies through valid sampling and transport controls before using destructive clamping.
- Validate convergence with sample-count sweeps and difference images, not one attractive frame.
- Keep a raster or reduced-quality path for interaction and unsupported devices.
- Treat denoising as a separate stage with declared albedo, normal, depth, motion, or temporal inputs.

## Technical Authority

- Three.js path-tracing example: https://threejs.org/examples/webgl_renderer_pathtracer.html
- Three.js libraries and plugins: https://threejs.org/manual/en/libraries-and-plugins.html
- Three.js BVH ecosystem reference: https://github.com/gkjohnson/three-mesh-bvh
- Three.js GPU path tracer reference: https://github.com/gkjohnson/three-gpu-pathtracer

Third-party package APIs and licenses must be verified at the exact installed revision.
