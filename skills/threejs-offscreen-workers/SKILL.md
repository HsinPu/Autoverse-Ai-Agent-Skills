---
name: threejs-offscreen-workers
description: "Three.js rendering and heavy-work offloading with OffscreenCanvas and Web Workers. Use for worker-owned renderers, transferable canvases, message protocols, input and resize forwarding, background asset processing, shared buffers, worker lifecycle, main-thread responsiveness, or fallback rendering."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Offscreen Rendering and Workers

Move work only after defining ownership, transfer boundaries, latency, and a supported main-thread fallback.

## Workflow

1. Reproduce and measure the main-thread bottleneck, long tasks, input delay, serialization cost, GPU time, and browser targets.
2. Read [worker-rendering.md](../threejs-development/references/worker-rendering.md) and decide whether the worker owns rendering, decoding, simulation, spatial queries, or another bounded task.
3. Define a versioned message protocol for initialization, input snapshots, resize and DPR, assets, commands, state deltas, errors, diagnostics, and shutdown.
4. Transfer the canvas and transferable data once, or use bounded copy or shared-memory strategies with explicit synchronization and isolation requirements.
5. Keep DOM, accessibility, permissions, and unsupported APIs on the main thread while forwarding semantic intents rather than raw event objects.
6. Test unsupported capability, startup failure, resize bursts, route changes, stale messages, worker crashes, context or device loss, backgrounding, and clean termination.

## Rules

- Do not adopt OffscreenCanvas without before-and-after responsiveness evidence.
- Never access DOM APIs from a worker or assume all render backends work there.
- Include sequence, generation, or frame identifiers wherever late messages can corrupt state.
- Bound queues and snapshots so a slow worker cannot create unbounded latency or memory.
- Provide a tested fallback or declare the unsupported browser boundary.

## Evidence

Return the bottleneck trace, ownership diagram, protocol schema, transfer strategy, capability matrix, fallback behavior, latency measurements, and teardown proof.
