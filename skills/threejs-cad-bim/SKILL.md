---
name: threejs-cad-bim
description: "Three.js CAD, BIM, and technical-model viewing workflows. Use for IFC or CAD conversion, assemblies, parts, model hierarchy, engineering metadata, units, measurement, clipping planes, exploded views, selection, large technical models, digital construction, or revision comparison."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js CAD and BIM

Preserve engineering meaning, units, hierarchy, and revision identity while making large technical models inspectable in the browser.

## Workflow

1. Define source formats, schema versions, units, axes, tolerances, identifiers, metadata, intellectual-property constraints, and expected queries.
2. Read [specialized-data-formats.md](../threejs-development/references/specialized-data-formats.md) and choose a conversion, streaming, or verified adapter boundary.
3. Normalize geometry and metadata without losing stable element IDs, assembly hierarchy, material intent, or source-to-runtime traceability.
4. Design sectioning, isolation, measurement, snapping, selection, annotation, exploded views, search, and revision comparison from explicit precision requirements.
5. Partition, instance, simplify, stream, and index the model according to visible working sets and interaction latency.
6. Validate known dimensions, coordinates, element counts, metadata queries, section caps, revisions, cold loads, and representative low-memory devices.

## Rules

- Do not imply engineering-grade precision without declaring conversion error and measurement tolerance.
- Never treat display meshes as the sole authority for business or construction metadata.
- Preserve source identifiers through conversion and selection.
- Verify loader, decoder, and exporter support against the exact format and version.
- Treat customer models and embedded metadata as untrusted, sensitive inputs.

## Evidence

Return the format and conversion matrix, unit and tolerance contract, hierarchy and metadata mapping, streaming plan, tool behavior, security controls, and reference-dimension tests.
