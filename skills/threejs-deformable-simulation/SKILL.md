---
name: threejs-deformable-simulation
description: "Three.js deformable-body and fluid-simulation integration. Use for cloth, ropes, cables, soft bodies, jelly, hair strands, particle fluids, SPH, PBD or XPBD constraints, grid or volume fluids, GPU compute solvers, deformable collisions, tearing, or mapping simulated particles and fields back to render geometry."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Deformable Simulation

Keep solver state authoritative and expose stability, collision, coupling, and rendering error as measured contracts.

## Workflow

1. Define material behavior, world units, topology or field resolution, anchors, collisions, external forces, tearing or plasticity, interaction, determinism, target devices, and acceptable visual error.
2. Read [deformable-simulation.md](../threejs-development/references/deformable-simulation.md) and select mass-spring, PBD or XPBD, FEM, SPH, particle-grid, stable-fluid, height-field, or baked motion from the required behavior.
3. Establish fixed-step, substep, iteration, damping, compliance, CFL or velocity limits, boundary conditions, and reset behavior; separate solver state from render interpolation.
4. Assign one-way or two-way coupling with rigid bodies, characters, wind, water, and gameplay; define collision proxies, contact thickness, authority, event semantics, and energy transfer.
5. Map particles, constraints, surfaces, or volumes to render geometry with explicit normals, tangents, bounds, buffer ownership, worker or GPU synchronization, readback limits, and quality tiers.
6. Test stretching, volume loss, penetration, tunneling, explosions, rest drift, frame stalls, topology changes, varying frame rates, density and resolution tiers, solver failure, and stable cleanup.

## Rules

- Do not run stability-sensitive solvers from variable render delta.
- Do not claim conservation, determinism, or two-way coupling without measurements for the exact solver and platform.
- Keep steady-frame GPU readback out of frame-critical paths unless its cost passes the target budget.
- Bound substeps and iterations and define visible degradation when the solver falls behind.
- Preserve one authority order across deformable, rigid-body, animation, navigation, and rendering systems.

## Evidence

Return the solver decision, units and stability contract, topology or field layout, collision and coupling matrix, synchronization path, quality tiers, error and performance sweeps, failure behavior, and lifecycle counts.
