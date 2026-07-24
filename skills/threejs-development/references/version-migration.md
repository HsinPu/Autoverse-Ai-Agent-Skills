# Three.js Version Migration Contract

Use this reference when a project moves between Three.js releases. The migration unit is the complete installed dependency graph and observable application behavior, not the `three` version string alone.

## Baseline Inventory

Record:

- exact source and target revisions, package manager, lockfile, bundler, TypeScript, and module format;
- imports from core, addons, `three/webgpu`, `three/tsl`, examples, and third-party integrations;
- renderer and backend, context options, color pipeline, post-processing, shadows, XR, controls, and media;
- loaders, exporters, compression decoders, asset extensions, persisted scene documents, caches, and service workers;
- framework adapters, physics, navigation, UI, testing, deployment, and supported browsers or devices.

Freeze deterministic cameras, seeds, times, viewport, DPR, assets, and representative interactions before changing dependencies.

## Release Ledger

For every intermediate release, capture:

| Field | Required decision |
|---|---|
| Changed symbol or behavior | Exact API, default, format, visual output, lifecycle, or platform change |
| Current owner | Application module, addon, framework adapter, asset pipeline, or persisted data |
| Impact type | Compile, runtime, visual, performance, data, security, or deployment |
| Migration action | Replace, configure, gate, transform, defer, or remove |
| Proof | Test, diagnostic, fixed capture, asset round trip, trace, or device result |
| Rollback | Lockfile, branch, artifact, data backup, or compatibility route |

Read every official guide interval between endpoints. Follow the guide's current step-size recommendation; do not jump over deprecation windows. Keep one slice small enough to identify which release changed behavior.

## Migration Order

1. Reproduce and record the source baseline.
2. Update the core package and directly coupled addons for one bounded interval.
3. Resolve imports, types, removed APIs, and initialization changes.
4. Verify runtime behavior before changing visual intent or tuning.
5. Migrate loaders, exporters, persisted documents, and caches with explicit compatibility tests.
6. Recheck renderer output, color, shadows, culling, post-processing, controls, animation, and disposal.
7. Measure named-device performance and memory after correctness passes.
8. Save an accepted checkpoint before beginning the next interval.

Do not combine an unrelated renderer-backend rewrite with a release slice unless the target version makes separation impossible.

## Acceptance and Rollback

A migration is complete only when:

- build, type, unit, browser, asset, and production checks pass;
- fixed captures explain every intentional visual delta;
- persisted data either remains readable or has a tested, recoverable transformation;
- resize, visibility, context or device loss, route remount, and disposal remain stable;
- performance stays within the declared device and workload budget;
- unsupported combinations and the rollback point are documented.

## Technical Authority

- Migration guide: https://github.com/mrdoob/three.js/wiki/Migration-Guide
- Three.js releases: https://github.com/mrdoob/three.js/releases
- Three.js documentation: https://threejs.org/docs/
- Three.js manual: https://threejs.org/manual/

Verify all version-sensitive claims against the installed source and matching revision.
