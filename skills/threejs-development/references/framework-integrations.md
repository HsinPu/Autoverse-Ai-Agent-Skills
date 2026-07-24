# Three.js Framework Integration Matrix

Use the repository's installed versions and official ecosystem documentation. Do not transfer lifecycle assumptions between React Three Fiber, TresJS, Threlte, or another wrapper.

## Ownership Questions

Before implementation, answer:

1. Who creates the renderer, scene, camera, and canvas?
2. Who schedules frames and invalidates on-demand rendering?
3. Which state is declarative, reactive, mutable per frame, or external simulation state?
4. Who loads, caches, clones, shares, and disposes assets?
5. How do route transitions, hot reload, errors, and remounts terminate work?
6. Which code may run during SSR, and which requires browser or GPU capabilities?

## Ecosystem Routes

| Context | Primary route |
|---|---|
| React owns the scene | `threejs-react-three-fiber` |
| Vue with TresJS | `threejs-framework-integrations` with installed TresJS docs |
| Svelte with Threlte | `threejs-framework-integrations` with installed Threlte docs |
| Framework hosts an imperative Three.js island | `threejs-framework-integrations` plus `threejs-scene-lifecycle` |
| Framework-independent architecture | `threejs-project-architecture` |

## Reactive Boundary

- Use component or store state for durable structure, product state, and infrequent configuration.
- Keep transforms, particles, physics snapshots, buffers, and other high-frequency values in scoped mutable owners.
- Avoid deep reactive proxies around Three.js instances unless the integration explicitly supports them.
- Batch external state crossings and make update direction one-way.
- Adapt imperative addons through create, update, resize, suspend, resume, and dispose hooks.

## SSR and Hydration

- Guard WebGL, WebGPU, media, window, document, and device access.
- Decide whether the scene is client-only, progressively enhanced, or represented by a static fallback.
- Keep initial semantic content usable before the renderer starts.
- Verify production hydration, code splitting, asset URLs, worker URLs, and CSP behavior.

## Compatibility Evidence

Record exact versions of Three.js, the framework, the integration library, renderer-specific addons, loaders, controls, post-processing, and test utilities. Verify production build, remounts, idle behavior, cleanup, and the project's supported browsers.
