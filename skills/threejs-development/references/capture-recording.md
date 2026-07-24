# Three.js Capture and Recording Contract

Use this reference to choose and verify an image, frame-sequence, recording, or stream path. Visual regression captures and user-facing media export can share setup, but they have different artifact and timing guarantees.

## Choose the Output Path

| Requirement | Candidate path |
|---|---|
| Current canvas still | `canvas.toBlob()` after a confirmed render |
| Render-target pixels | Renderer readback with explicit format and row handling |
| High-resolution still | Temporary target, camera view offset, or tiled render |
| Real-time canvas recording | `canvas.captureStream()` plus `MediaRecorder` |
| Frame-level encode control | WebCodecs where supported, with explicit timestamps and backpressure |
| Deterministic sequence | Fixed-step render and per-frame readback or blob |
| Audio-video recording | Canvas video track plus owned Web Audio media destination |
| DOM and canvas composition | Dedicated composition surface or external compositor |

Check browser support, codec and container combinations, alpha requirements, maximum dimensions, memory, and output consumer before implementation.

## Deterministic Frame Contract

Freeze:

- camera, resolution, DPR, view offset, clear state, and alpha;
- asset revision and readiness, shader compilation state, seed, and environment;
- simulation step, animation time, particle state, temporal history, exposure, and quality tier;
- scene-linear format, tone mapping, output color conversion, and encoder color metadata.

Advance by `frameIndex / frameRate`, complete required simulation and rendering work, capture exactly one frame, wait for readback or encoder admission, then advance. Do not rely on `requestAnimationFrame` cadence for offline determinism.

## Composition, Security, and Audio

- Canvas streams include canvas pixels, not arbitrary DOM overlays.
- Render overlays into the canvas, mirror them into a composition canvas, or encode them later.
- Cross-origin images, video, fonts, or textures must keep the canvas origin-clean through approved CORS headers and loading modes.
- Route required audio through an explicit `MediaStreamAudioDestinationNode`; define listener, mixing, mute, autoplay, and sample-rate behavior.
- Use runtime capability probes such as codec support checks and retain a tested fallback.
- Bound pending frames and chunks; pause, drop, lower quality, or fail explicitly under backpressure.

## Validation

Inspect:

- decoded dimensions, frame rate, frame count, duration, timestamps, keyframes, and dropped frames;
- color, exposure, alpha, orientation, crop, and tiled seams;
- first and last frames, cuts, temporal effects, camera changes, audio drift, and silence;
- corrupt or unsupported inputs, encoder failure, cancellation, repeated recordings, route changes, and page visibility;
- stopped tracks, closed encoders, revoked object URLs, detached audio nodes, and stable GPU and heap counts.

## Technical Authority

- Canvas `captureStream()`: https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/captureStream
- MediaRecorder: https://developer.mozilla.org/docs/Web/API/MediaRecorder
- WebCodecs: https://developer.mozilla.org/docs/Web/API/WebCodecs_API
- Canvas `toBlob()`: https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toBlob
- MediaStream Audio Destination: https://developer.mozilla.org/docs/Web/API/MediaStreamAudioDestinationNode

Browser support and codec behavior must be verified on the declared target matrix.
