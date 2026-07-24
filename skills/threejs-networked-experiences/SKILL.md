---
name: threejs-networked-experiences
description: "Networked and multiplayer Three.js architecture. Use for authoritative simulation, entity replication, snapshots, interpolation, prediction, reconciliation, interest management, presence, shared world state, replay, anti-cheat boundaries, bandwidth budgets, disconnect recovery, and synchronized visual effects."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Networked Experiences

Keep network truth, simulation state, and interpolated render state distinct.

## Workflow

1. Define authority for identity, movement, physics, inventory, world changes, effects, time, and persistence.
2. Specify transport, tick and snapshot rates, ordering, reliability, serialization, clocks, entity lifecycle, and bandwidth budgets.
3. Maintain authoritative or predicted simulation separately from smoothed Three.js transforms.
4. Add interpolation buffers, prediction, reconciliation, interest management, late-join state, disconnect recovery, and replay where justified.
5. Validate latency, jitter, loss, duplication, reordering, clock skew, malicious input, reconnect, and version mismatch.

## Rules

- Never trust client-reported outcomes for authoritative game or economic state.
- Use stable entity and event identifiers and make creation and deletion idempotent.
- Do not synchronize every visual particle or bone when a compact semantic event can reproduce it locally.
- Reset interpolation and temporal rendering history on teleports and ownership changes.
- Bound inbound message size, frequency, and entity counts.

## Evidence

Return the authority matrix, protocol and state schemas, timeline, interpolation and prediction policy, bandwidth estimate, abuse controls, and network-condition test results.
