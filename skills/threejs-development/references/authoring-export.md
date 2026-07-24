# Three.js Authoring and Export Boundary

Use this reference when a Three.js application edits, serializes, exports, or publishes scene content.

## Separate Three State Layers

| Layer | Owns | Must not own |
|---|---|---|
| Document | Stable entities, properties, hierarchy, asset references, schema version | GPU handles, event listeners, transient helpers |
| Editor session | Selection, gizmos, viewport, panels, local history, unsaved state | Published runtime truth |
| Runtime preview | Derived Object3D graph, materials, animation, simulation adapters | Canonical authoring document |

Use stable application IDs. Three.js UUIDs may support runtime identity but should not silently become the only durable business identifier.

## Commands and History

- Validate commands before mutation.
- Store the smallest reversible semantic patch, not a full scene snapshot for every drag tick.
- Coalesce continuous transforms into one history transaction.
- Define how asset deletion, hierarchy moves, batch operations, and external updates invalidate history.
- Bound retained history by count or bytes and provide an explicit saved checkpoint.

## Serialization and Migration

- Version the document schema independently from the installed Three.js revision.
- Persist asset references, not decoded GPU resources.
- Migrate old documents through ordered, testable transformations.
- Reject executable values, prototype-bearing input, and unknown privileged plugin data.
- Recover autosaves into a new candidate document before replacing the last known-good version.

## Import and Export

Treat GLTFExporter and other exporters as capability-specific adapters. Before promising a round trip:

1. inventory geometry, morph, skin, animation, camera, light, material, extension, metadata, and texture needs;
2. test the exact installed exporter and target consumer;
3. record unsupported or lossy properties;
4. validate the exported artifact independently;
5. preserve provenance, license, units, axes, and transformation history.

Publishing should emit a validated runtime package and manifest, not the entire editor session.
