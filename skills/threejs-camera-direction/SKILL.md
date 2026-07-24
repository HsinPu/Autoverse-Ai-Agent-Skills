---
name: threejs-camera-direction
description: "Advanced Three.js camera direction and rigging. Use for chase, orbit, side, cockpit, cinematic, or scale-aware cameras; damping and look-ahead; quaternion handoffs; floating origins; collision; pointer look; projection ownership; and stable framing across large or fast-moving scenes."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "scottstts/Threejs-Awesome-Graphics-Agent-Skills"
  reference-license: "MIT"
  reference-revision: "e43dcb03020cae5b08983a828bc1817dd6c0c40a"
---

# Three.js Camera Direction

Design the camera as a stateful visual system with explicit target, up, projection, collision, and transition rules.

## Workflow

1. Define subject scale, coordinate frame, camera modes, composition targets, movement envelope, obstacles, input ownership, and comfort limits.
2. Compute desired position, aim, up, FOV, and clipping from stable subject or world frames.
3. Apply frame-rate-independent damping and quaternion transitions; reset state after teleports, origin shifts, and hard cuts.
4. Add collision or visibility constraints without allowing correction to fight the authored composition.
5. Test slow and fast motion, zero velocity, vertical travel, roll, close obstacles, mode changes, resize, and extreme world coordinates.

## Rules

- Keep camera intent separate from the final smoothed transform.
- Avoid Euler interpolation for arbitrary orientation changes.
- Choose near and far planes from required precision, not world-size habit.
- Make camera cuts explicit so temporal passes and motion history can reset.
- Restore controls, pointer lock, listeners, and projection state on teardown.

## Evidence

Return rig states, transition rules, damping units, collision policy, fixed camera-path captures, clipping precision, and lifecycle tests.
