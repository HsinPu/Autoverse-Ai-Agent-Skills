---
name: threejs-capture-recording
description: "Three.js image, frame-sequence, and video capture workflow. Use for screenshots, deterministic offline frames, canvas captureStream, MediaRecorder, WebCodecs, audio-video recording, transparent or high-resolution export, tiled capture, codec fallback, or diagnosing missing overlays, color shifts, dropped frames, CORS, and recording lifecycle defects."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Capture and Recording

Choose a capture path from the required artifact, then make time, color, composition, encoding, and cleanup reproducible.

## Workflow

1. Define still, frame sequence, real-time recording, deterministic offline render, or live stream; dimensions, frame rate, duration, alpha, color, audio, overlays, codec, container, and browser targets.
2. Read [capture-recording.md](../threejs-development/references/capture-recording.md) and choose renderer readback, canvas blob, `captureStream()`, `MediaRecorder`, WebCodecs, tiled rendering, or an external encoder from the output contract.
3. Freeze camera, viewport, DPR, seed, assets, animation time, simulation step, exposure, tone mapping, and output conversion; decide whether DOM UI and captions are excluded, separately composited, or rendered into the capture surface.
4. Prove origin-clean assets and codec support before recording, connect audio through an owned media destination when required, and define timestamp, backpressure, keyframe, dropped-frame, and failure behavior.
5. For offline output, advance simulation and animation by an exact frame step and wait for required asset, shader, render, readback, and encode completion before advancing.
6. Validate dimensions, frame count, duration, timestamps, color and alpha, audio sync, overlay policy, file readability, cancellation, repeated recording, URL revocation, track shutdown, and resource plateau.

## Rules

- Do not use display-frame cadence as proof of deterministic output.
- Do not promise DOM overlays in a canvas stream unless they are explicitly composited.
- Keep scene-linear rendering, display conversion, capture format, and encoder color metadata aligned.
- Treat CORS-tainted or non-origin-clean inputs as a blocking capture condition, not an encoder bug.
- Check codec and container support at runtime and provide a tested fallback or an explicit unsupported boundary.

## Evidence

Return the artifact contract, selected capture path, deterministic-time policy, composition and audio graph, browser and codec matrix, frame and sync measurements, color and alpha checks, failure behavior, and teardown results.
