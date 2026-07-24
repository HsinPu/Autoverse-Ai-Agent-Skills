# Three.js Specialized Data and Format Boundary

Use this reference for technical models, point clouds, splats, scientific volumes, or other data that exceeds a conventional glTF asset boundary.

## Preserve Meaning Before Rendering

Record:

- source format and version;
- coordinate reference, axis convention, origin, and units;
- stable record or element identifiers;
- hierarchy, classification, and metadata schemas;
- source precision and allowed runtime error;
- rights, privacy, retention, and transformation provenance.

Do not discard this information during conversion merely because Three.js only needs positions and colors to draw a frame.

## Choose the Runtime Boundary

| Need | Candidate boundary |
|---|---|
| General real-time mesh asset | Validated glTF or GLB pipeline |
| BIM or CAD semantics | Conversion plus sidecar metadata, or a verified format adapter |
| Massive point cloud | Tiled hierarchy with progressive point budgets |
| Gaussian splats | Splat-aware representation, visibility, blending, and sorting |
| Scientific volume | Bricked or tiled scalar fields with explicit transfer functions |
| Offline authoring | Versioned editor document plus validated export |

The choice must account for browser support, decoder provenance, worker behavior, memory, cancellation, and deployment.

## Streaming Contract

- Partition data by a stable hierarchy or spatial index.
- Separate network, decode, CPU staging, GPU upload, visibility, and eviction budgets.
- Prioritize chunks from camera and query intent.
- Cancel obsolete requests and ignore stale generations.
- Keep a bounded cache with ownership and pressure behavior.
- Make partial, corrupt, missing, and unsupported chunks observable.

## Analytical Integrity

If users measure, classify, compare, or make decisions from the visualization:

1. validate known coordinates and dimensions;
2. quantify conversion, quantization, LOD, and culling error;
3. distinguish display approximations from source values;
4. test selection and filtering across chunk boundaries;
5. provide structured, accessible output for important results.
