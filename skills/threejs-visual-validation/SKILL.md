---
name: threejs-visual-validation
description: "Reproducible validation for advanced Three.js graphics. Use for fixed-view visual contracts, deterministic seed sweeps, no-post baselines, geometry and field diagnostics, pass isolation, distance and scale envelopes, temporal stability, GPU budgets, browser or device matrices, and visual regression evidence."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Visual Validation

Validate the authored system, not one favorable screenshot.

## Workflow

1. Fix Three.js and dependency versions, renderer, browser and GPU, viewport, DPR, camera, seed, time, quality tier, assets, exposure, and scene state.
2. Capture a direct or no-post baseline before validating effects.
3. Record beauty views plus relevant geometry, wireframe, normals, UV, depth, mask, field, pass-only, overdraw, and timing diagnostics.
4. Sweep representative seeds, camera distances, view angles, time points, resize states, quality tiers, and target devices.
5. Compare against approved baselines with stated tolerances and investigate every difference before accepting an update.

## Required Evidence

- fixed configuration and asset revision;
- reference, baseline, and current capture identifiers;
- diagnostic and no-post images;
- seed, distance, temporal, browser, and device matrix;
- CPU, GPU, draw, memory, and loading measurements;
- verdict, baseline action, and remaining risk.

## Rules

- Never approve a baseline update solely because the new output is different.
- Separate expected stochastic variation from nondeterministic instability.
- Reset temporal history before fixed-time captures.
- Keep secret, personal, and licensed source assets out of unrestricted artifacts.
- Preserve machine-readable capture metadata with each result.

## Handoff

- Use `threejs-capture-recording` when the output is a user-facing still, frame sequence, video, audio-video file, or live stream rather than validation evidence alone.
- Keep baseline authority and approval in visual validation even when capture tooling produces the pixels.
