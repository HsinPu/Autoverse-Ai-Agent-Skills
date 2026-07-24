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
- asset and glTF delivery;
- clip, mixer, skeletal, morph, and root-motion animation;
- vectors, matrices, quaternions, coordinate spaces, and transform diagnostics;
- general geometry, material, lighting, and shader work;
- pointer, touch, keyboard, gamepad, physics, and spatial audio integration;
- WebGL and WebGPU renderer selection;
- WebGPU, TSL node materials, compute, storage, readback, and WGSL interop;
- general post-processing;
- React Three Fiber;
- HUDs, labels, text, overlays, and accessible UI;
- gameplay, entities, levels, game feel, replay, and bot playtests;
- data and scientific visualization;
- large-world and geospatial coordinate, tiling, and precision systems;
- WebXR and accessibility;
- performance, memory, testing, and debugging;
- untrusted-content security, production deployment, and networked experiences.

## Gap Comparison Sources

The coverage audit also reviewed the public capability inventories of:

- `linegel/threejs-complete-set-of-skill`
- `dgreenheck/webgpu-claude-skill`
- `emalorenzo/three-agent-skills`
- `majidmanzarpour/threejs-game-skills`

These repositories were used only to identify missing catalog boundaries such as general animation, WebGPU and TSL, game UI, gameplay, and explicit fallback behavior. No text, scripts, examples, scaffolds, images, scorecards, provider integrations, or assets from those repositories are included. The resulting CraftRoster Skills are first-party workflows grounded in official Three.js and browser-platform documentation.

## Official Technical Authority

Version-sensitive implementation claims should be checked against:

- Three.js manual and API documentation: https://threejs.org/docs/
- Three.js examples and repository for the installed revision: https://github.com/mrdoob/three.js
- React Three Fiber documentation: https://r3f.docs.pmnd.rs/
- Web platform standards and browser compatibility data for WebGL, WebGPU, WebXR, workers, audio, and input APIs

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

- Three.js, WebGPU, TSL, WebXR, and React Three Fiber APIs evolve quickly;
- visual techniques can exceed mobile GPU budgets without project-specific measurement;
- upstream licensing or provenance can change after the pinned revision.

Re-audit when the reference revision changes, upstream licensing changes, external code or assets are proposed for import, or renderer and ecosystem compatibility materially changes.
