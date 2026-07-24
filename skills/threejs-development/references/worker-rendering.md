# Three.js Worker Rendering Contract

Use workers when measurement shows main-thread work is a user-facing constraint. OffscreenCanvas is one possible boundary, not the default architecture.

## Capability Decision

Record support for:

- transferable OffscreenCanvas;
- the selected WebGL or WebGPU renderer in a worker;
- required loaders, decoders, image paths, fonts, media, and addons;
- module workers and production asset URLs;
- SharedArrayBuffer only when cross-origin isolation is configured;
- context or device-loss recovery;
- main-thread fallback.

Prototype the riskiest capability on every supported browser before moving the application.

## Ownership Models

| Model | Worker owns | Main thread owns |
|---|---|---|
| Worker renderer | Renderer, scene view, camera state, GPU resources, frame loop | DOM, semantics, input intents, layout, permissions |
| Simulation worker | Fixed-step world, navigation, or data processing | Renderer and interpolated view |
| Decode or query workers | Bounded jobs and transferable results | Scheduling, caches, renderer |

Do not split ownership of the same renderer, scene object, or mutable buffer without a synchronization protocol.

## Message Protocol

Define typed messages for:

1. capability and version handshake;
2. initialization and transferred resources;
3. semantic input snapshots or commands;
4. CSS size, drawing size, DPR, visibility, and quality;
5. assets and transferable buffers;
6. state deltas, acknowledgements, metrics, and errors;
7. suspend, resume, context recovery, and shutdown.

Include protocol version plus request, sequence, and generation identifiers where messages may arrive late. Bound queues and choose whether to drop, merge, or backpressure high-frequency updates.

## Lifecycle Verification

Test fallback, initialization timeout, corrupt messages, resize storms, asset failure, worker exceptions, route remounts, background throttling, context loss, and termination. Prove listeners, object URLs, buffers, workers, render targets, and renderer resources return to a stable baseline.
