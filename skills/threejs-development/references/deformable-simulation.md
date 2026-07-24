# Three.js Deformable Simulation Contract

Use this reference for cloth, ropes, soft bodies, strands, particle fluids, and grid or volume fluids. Rigid-body physics remains a separate authority.

## Model Selection

| Model | Typical use | Required disclosure |
|---|---|---|
| Mass-spring | Simple cloth, ropes, educational systems | Stiffness and timestep dependence |
| PBD or XPBD | Interactive cloth, ropes, volume and shape constraints | Compliance, iterations, artificial damping |
| FEM | Material-aware elastic solids | Element quality, constitutive model, compute cost |
| SPH or particle fluid | Free-surface particles | Kernel radius, density error, neighbor cost |
| Particle-grid or stable fluid | Smoke, fire, liquid or velocity fields | Grid resolution, dissipation, boundaries |
| Height field | Bounded surface waves | No overturning or full volume |
| Baked or authored motion | Fixed visual result | No physical interaction claim |

Choose from required behavior and evidence, not visual resemblance alone.

## Solver Contract

Record:

- units, mass or density, topology or field resolution, rest state, gravity, external forces, and material parameters;
- fixed timestep, substeps, solver iterations, compliance or stiffness, damping, velocity limits, and numerical precision;
- anchors, constraints, contact thickness, friction, restitution, tearing, plasticity, boundaries, and reset;
- deterministic seed and operation order where reproducibility matters;
- quality tiers and visible degradation when resolution, substeps, or iterations fall.

For fluids, define the stability or CFL policy and boundary treatment. For constraint systems, measure stretch, volume, bend, and rest drift rather than claiming stability from appearance.

## Authority and Coupling

- Declare whether rigid bodies affect deformables, deformables affect rigid bodies, or coupling is one-way.
- Define which subsystem owns contact generation, correction, event publication, and transform presentation.
- Keep animation targets, navigation intent, gameplay state, simulation state, and interpolated render state separate.
- Version worker messages, GPU buffers, particle layouts, constraint data, and topology-change events.
- Avoid synchronous steady-frame GPU readback; consume GPU results directly where possible or use bounded asynchronous snapshots.

## Rendering and Lifecycle

Map solver data to meshes, lines, points, or volumes with explicit interpolation, normals, tangents, bounds, and update ranges. Partition static and dynamic buffers, cancel stale worker work, handle context or device loss, and dispose solver worlds, buffers, textures, workers, and subscriptions.

## Verification

Sweep timestep, frame rate, substeps, iterations, resolution, density, collision speed, scale, target device, and duration. Inspect stretch, volume or density error, penetration, tunneling, jitter, energy growth, rest drift, explosions, tearing, topology changes, memory plateau, and recovery after stalls or reset.

## Technical Authority

- Three.js Ammo cloth example: https://threejs.org/examples/physics_ammo_cloth
- Three.js WebGPU volume fire example: https://threejs.org/examples/webgpu_volume_fire.html
- Three.js WebGPU compute water example: https://threejs.org/examples/webgpu_compute_water.html
- Three.js libraries and plugins: https://threejs.org/manual/en/libraries-and-plugins.html

Treat examples as integration evidence, not proof that one solver satisfies every deformable or fluid requirement.
