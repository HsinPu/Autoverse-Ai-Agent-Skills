---
name: threejs-spatial-audio
description: "Three.js and Web Audio spatial-sound integration. Use for AudioListener, PositionalAudio, HRTF panning, attenuation, cones, ambient zones, occlusion, reverberation, collision or gameplay cues, autoplay restrictions, captions, audio-context lifecycle, mixing, or synchronized audiovisual playback."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Spatial Audio

Make sound activation, listener ownership, spatial scale, mixing, accessibility, and cleanup explicit.

## Workflow

1. Define essential and decorative sounds, world units, listener camera, source motion, distance model, activation policy, latency, captions, and device targets.
2. Build one owned audio graph for buses, gain, compression, spatial sources, ambient beds, zones, effects, and mute or preference state.
3. Unlock or resume audio only after eligible user intent and expose blocked, suspended, interrupted, and denied states.
4. Update listener and source transforms from authoritative render or simulation state at a bounded cadence.
5. Map gameplay and collision events to deduplicated cues with concurrency, priority, pooling, cooldown, and late-event rules.
6. Test headphones and speakers, backgrounding, route changes, camera swaps, teleportation, rapid event bursts, missing assets, interruption, mute, captions, and teardown.

## Rules

- Do not create one listener or audio context per object or scene mount.
- Never start audible playback before browser policy and user preference allow it.
- Use spatialization only when location carries useful meaning; keep critical UI audio intelligible.
- Provide captions, transcripts, or equivalent cues for essential information.
- Disconnect nodes, stop sources, release buffers, and remove subscriptions with their owner.

## Evidence

Return the audio graph, activation state machine, listener and distance contract, event policy, accessibility alternatives, latency and voice budgets, device checks, and cleanup proof.
