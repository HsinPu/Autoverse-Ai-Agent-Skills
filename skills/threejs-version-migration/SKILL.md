---
name: threejs-version-migration
description: "Three.js release-upgrade and compatibility migration workflow. Use when moving a project between Three.js revisions, resolving deprecations or breaking API changes, aligning addons and framework adapters, upgrading serialized scene or asset behavior, or proving that an old Three.js application still behaves correctly after dependency changes."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Version Migration

Upgrade the installed dependency graph through bounded, reversible slices with behavior evidence at every revision boundary.

## Workflow

1. Record the source and target Three.js revisions, package lock, addons, renderer, framework adapters, loaders, exporters, browser targets, and persisted scene or asset formats.
2. Read [version-migration.md](../threejs-development/references/version-migration.md), then inspect every official migration-guide interval between the source and target instead of comparing only the endpoints.
3. Freeze a source baseline covering build and type checks, deterministic captures, asset import and export, interaction, lifecycle, resource counts, and representative performance.
4. Build a release ledger that classifies each change as compile-time, runtime, visual, data, platform, or ecosystem work; group no more than ten Three.js releases into one migration slice.
5. Apply one slice at a time, update coupled addons or adapters deliberately, remove deprecated paths only after their replacements pass, and preserve a runnable rollback point.
6. Re-run the baseline matrix after every slice and retire the previous route only when required behavior, data compatibility, visual output, performance, and recovery gates pass.

## Rules

- Treat the installed package source and the official guide for the exact revision range as authority.
- Do not infer compatibility from a successful build; loaders, color, culling, controls, output, and disposal can change at runtime.
- Keep application-document migrations separate from incidental Three.js object serialization.
- Route WebGLRenderer-to-WebGPURenderer work through `threejs-rendering-platforms` and `threejs-webgpu-tsl`; a release upgrade does not require a backend migration.
- Pin dependency and lockfile state for each accepted checkpoint and keep the last known-good build recoverable.

## Evidence

Return the source and target matrix, release ledger, migration slices, dependency and data changes, before-and-after captures, test and performance results, rollback point, unsupported combinations, and remaining version-specific risks.
