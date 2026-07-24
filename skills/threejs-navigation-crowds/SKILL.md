---
name: threejs-navigation-crowds
description: "Three.js navigation, pathfinding, and crowd-simulation integration. Use for navmeshes, A-star paths, waypoints, path smoothing, off-mesh links, character agents, local avoidance, crowds, dynamic obstacles, replanning, navigation workers, or synchronization with animation and physics."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Navigation and Crowds

Keep navigation data, locomotion intent, physical authority, and rendered character motion as explicit layers.

## Workflow

1. Define agent radii, heights, slopes, steps, speeds, turn limits, world units, traversal modes, dynamic obstacles, and path-quality requirements.
2. Read [character-spatial-systems.md](../threejs-development/references/character-spatial-systems.md) and choose the navmesh, graph, grid, or hybrid representation from environment and update needs.
3. Establish a reproducible bake or generation pipeline with area costs, islands, portals, off-mesh links, and versioned source geometry.
4. Separate global route planning, path following, local avoidance, character control, animation intent, and physics contacts.
5. Bound replanning and crowd work through spatial queries, schedules, workers, and quality tiers.
6. Test narrow passages, blocked goals, unreachable islands, moving obstacles, agent congestion, teleports, origin shifts, low frame rates, and deterministic replays where required.

## Rules

- Do not use the visible render mesh as an unvalidated navigation surface.
- Never let animation, navigation, and physics independently write the same authoritative transform.
- Keep crowd avoidance local; it does not replace global pathfinding.
- Version nav data with its source level geometry and agent profile.
- Treat worker results as stale-capable and validate generation or request IDs.

## Evidence

Return the navigation representation, agent profiles, bake or update process, authority order, performance budget, failure behavior, and path or crowd validation scenes.
