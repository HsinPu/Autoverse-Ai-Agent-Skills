# Three.js Skill Suite Sources and Adaptation Boundary

## Decision

Decision: **adapt**.

CraftRoster provides a first-party, Apache-2.0 Three.js capability suite. It does not redistribute the upstream package, installer, example implementations, copied vendor code, binary lookup tables, textures, models, or other assets.

## Referenced Graphics Pack

- Repository: `scottstts/Threejs-Awesome-Graphics-Agent-Skills`
- Pinned revision: `e43dcb03020cae5b08983a828bc1817dd6c0c40a`
- Git tree: `d0036d0ac9d07e3a7bc7b28fd6096b84d4c1b503`
- Package version at that revision: `0.4.4`
- Root original-code license: MIT
- Published package license: `MIT AND GPL-3.0-only`
- Reference scope: the 24 upstream `skills/*/SKILL.md` files only

The upstream taxonomy and visual-system coverage informed CraftRoster's advanced graphics routing. CraftRoster rewrites the workflows, triggers, boundaries, evidence requirements, handoffs, and product-engineering coverage. Canonical authorship and source remain `HsinPu/CraftRoster`.

## Excluded Upstream Material

The following upstream paths are intentionally not imported or used as canonical Skill content:

- `bin/`
- `scripts/`
- `assets/`
- `examples/`
- `dev/`
- `source_materials/`
- `agents/`
- upstream reference implementations and copied vendor source

This exclusion is required because the package contains GPL-3.0 material, third-party assets, and sources whose upstream repositories did not expose a license at the audited revision. In particular, the upstream notices describe GPL rain and puddle material plus multiple sources treated as MIT only by an upstream project rule. CraftRoster does not rely on that unilateral relicensing.

## Upstream-to-CraftRoster Mapping

| Upstream Skill | CraftRoster Skill |
|---|---|
| `threejs-skill-router` | `threejs-development` |
| `threejs-camera-direction` | `threejs-camera-direction` |
| `threejs-procedural-animation` | `threejs-procedural-animation` |
| `threejs-procedural-fields` | `threejs-procedural-fields` |
| `threejs-procedural-materials` | `threejs-procedural-materials` |
| `threejs-parallax-occlusion-mapping` | `threejs-parallax-occlusion-mapping` |
| `threejs-procedural-geometry` | `threejs-procedural-geometry` |
| `threejs-procedural-vegetation` | `threejs-procedural-vegetation` |
| `threejs-procedural-architecture` | `threejs-procedural-architecture` |
| `threejs-procedural-planets` | `threejs-procedural-planets` |
| `threejs-spectral-ocean` | `threejs-spectral-ocean` |
| `threejs-water-optics` | `threejs-water-optics` |
| `threejs-precipitation-surfaces` | `threejs-precipitation-surfaces` |
| `threejs-atmosphere-aerial-perspective` | `threejs-atmosphere-aerial-perspective` |
| `threejs-volumetric-clouds` | `threejs-volumetric-clouds` |
| `threejs-raymarched-space-effects` | `threejs-raymarched-space-effects` |
| `threejs-procedural-vfx` | `threejs-procedural-vfx` |
| `threejs-temporal-surfaces` | `threejs-temporal-surfaces` |
| `threejs-shadow-systems` | `threejs-shadow-systems` |
| `threejs-screen-space-ambient-occlusion` | `threejs-screen-space-ambient-occlusion` |
| `threejs-bloom` | `threejs-bloom` |
| `threejs-exposure-color-grading` | `threejs-exposure-color-grading` |
| `threejs-image-pipeline` | `threejs-image-pipeline` |
| `threejs-visual-validation` | `threejs-visual-validation` |

## First-Party Coverage Added by CraftRoster

The referenced pack focuses on advanced visual systems. CraftRoster adds the product-development areas needed to design, build, operate, and ship a complete Three.js application:

- project architecture and scene lifecycle;
- bounded Three.js release migration with intermediate-version and rollback evidence;
- asset and glTF delivery;
- clip, mixer, skeletal, morph, and root-motion animation;
- vectors, matrices, quaternions, coordinate spaces, and transform diagnostics;
- general geometry, material, lighting, and shader work;
- robust CSG and Boolean solid modeling with topology, tolerance, attribute, and export validation;
- pointer, touch, keyboard, gamepad, spatial indexing, and input integration;
- independent physics-simulation and spatial-audio ownership with a compatibility route for the former combined Skill;
- deformable cloth, rope, soft-body, strand, particle-fluid, and grid-fluid simulation;
- navmeshes, pathfinding, agents, local avoidance, and crowds;
- OffscreenCanvas, worker-owned rendering, transfer boundaries, and versioned worker protocols;
- runtime editors, commands, undo and redo, serialization, import, export, and publishing;
- WebGL and WebGPU renderer selection;
- WebGPU, TSL node materials, compute, storage, readback, and WGSL interop;
- general post-processing;
- progressive path tracing with feature-support, accumulation, convergence, and raster-fallback contracts;
- deterministic still, frame-sequence, video, codec, and audio-video capture;
- React Three Fiber;
- Vue/TresJS, Svelte/Threlte, and other framework integration;
- HUDs, labels, text, overlays, and accessible UI;
- non-XR semantic accessibility plus focused WebXR accessibility and comfort;
- gameplay, entities, levels, game feel, replay, and bot playtests;
- data and scientific visualization;
- point-cloud and Gaussian-splat streaming;
- CAD/BIM conversion, hierarchy, metadata, measurement, and revision behavior;
- procedural characters, morphology, rigs, retargeting, inverse kinematics, and character LOD;
- large-world and geospatial coordinate, tiling, and precision systems;
- media textures, spatial acceleration, performance, memory, testing, and debugging;
- untrusted-content security, production deployment, and networked experiences.

## Gap Comparison Sources

The coverage audit reviewed these public inventories at fixed revisions on 2026-07-24:

| Repository | Audited revision | Use |
|---|---|---|
| `linegel/threejs-complete-set-of-skill` | `62a9bc59330c44827824665323823883e88f100c` | Capability names plus procedural-character, object-authoring, compatibility, and renderer-migration boundaries |
| `dgreenheck/webgpu-claude-skill` | `af2319bd01bb7cc881267a9ef42cafdaf5e9029d` | WebGPU depth, progressive disclosure, and reusable reference structure |
| `emalorenzo/three-agent-skills` | `f950f95ae3b13581546e6d6d8b2f88a08eb3e577` | General Three.js and framework rule coverage |
| `majidmanzarpour/threejs-game-skills` | `7221c1f4a6d2ae189a4d85d058d24f3228499d46` | Game-production, QA, navigation, and content-pipeline coverage |

These repositories were used only to identify catalog gaps and acceptance boundaries. No text, scripts, examples, scaffolds, images, scorecards, provider integrations, templates, or assets from them are included. New and expanded Skills remain first-party, do not declare those repositories as `reference-source`, and are grounded in official Three.js, framework, and browser-platform documentation.

## Official Technical Authority

Version-sensitive implementation claims should be checked against:

- Three.js manual and API documentation: https://threejs.org/docs/
- Three.js examples and repository for the installed revision: https://github.com/mrdoob/three.js
- React Three Fiber documentation: https://r3f.docs.pmnd.rs/
- TresJS documentation: https://docs.tresjs.org/
- Threlte documentation: https://threlte.xyz/
- Web platform standards and browser compatibility data for WebGL, WebGPU, WebXR, workers, audio, capture, media encoding, and input APIs

An upstream example is not authority for compatibility with the project's installed Three.js revision.

## Audit Record

Decision: adapt

Blocking findings: none for the restricted MIT `SKILL.md` reference scope

Required controls:

- keep the reference revision and tree pinned;
- verify only declared `SKILL.md` blobs;
- exclude examples, assets, copied vendor code, and installer behavior;
- keep canonical wording and implementation guidance first-party;
- verify version-sensitive APIs against official documentation and the installed dependency graph.

Executable and external-action surface: none added by this suite

Residual risk:

- Three.js, WebGPU, TSL, WebXR, React Three Fiber, TresJS, and Threlte APIs evolve quickly;
- third-party physics, navigation, CAD/BIM, point-cloud, and splat adapters have independent compatibility and provenance;
- visual techniques can exceed mobile GPU budgets without project-specific measurement;
- upstream licensing or provenance can change after the pinned revision.

Re-audit when the reference revision changes, upstream licensing changes, external code or assets are proposed for import, or renderer and ecosystem compatibility materially changes.
