---
name: threejs-gameplay-systems
description: "Gameplay architecture for Three.js browser games. Use for core loops, entities, abilities, combat, vehicles, character controllers, AI, levels, spawning, cameras, game feel, pause and restart, save state, deterministic replay, progression, bot playtests, and coordination with physics, audio, UI, networking, and rendering."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Gameplay Systems

Make gameplay state authoritative and let the Three.js scene present it through a bounded update and feedback loop.

## Workflow

1. Define the player fantasy, core loop, fail and success states, session length, controls, camera, entities, rules, level structure, and measurable playability target.
2. Separate deterministic or authoritative gameplay state from render objects, UI, particles, and audio.
3. Define fixed-step systems and ordering for input, AI, abilities, physics, damage, spawning, objectives, networking, events, and presentation.
4. Build one playable vertical slice with complete restart and failure behavior before adding content breadth.
5. Add game feel through bounded camera impulse, hit stop, timing, anticipation, effects, sound, and input response without corrupting simulation.
6. Test idle, active play, pause, restart, win, loss, low FPS, focus loss, alternate controls, save and load, bot paths, and long sessions.

## Rules

- Do not store authoritative gameplay rules only in scene hierarchy or animation callbacks.
- Keep random outcomes seeded when replay, networking, or tests depend on them.
- Make entity creation and removal idempotent.
- Bound spawn, particle, audio, and effect counts.
- Preserve an accessible and mobile-usable control path when those targets are supported.

## Evidence

Return the gameplay contract, system order, entity and event model, playable-slice evidence, bot or scripted test metrics, performance snapshot, and remaining design risks.
