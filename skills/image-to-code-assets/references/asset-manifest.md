# Asset Manifest Contract

Use this reference only when the task requires machine-readable asset inventory, density-aware exports, or a later Figma-layer handoff.

## Top-Level Fields

| Field | Required | Meaning |
| --- | --- | --- |
| schemaVersion | yes | Integer manifest contract version, currently 1 |
| source | yes | Source identity, hash, dimensions, color mode, authority, and license status |
| outputRoot | yes | Authorized root containing all declared output paths |
| assets | yes | Ordered array of extracted or blocked asset records |
| generatedAt | yes | ISO 8601 generation time |
| verification | yes | Summary of completed and unavailable QA |

## Source Record

Record source path or artifact ID, SHA-256 when the file is local, pixel width and height, color mode, visual-authority role, ownership or license status, and any known compression or scaling.

## Asset Record

Every record contains:

- id and semantic role;
- source bounding box as x, y, width, and height in source pixels;
- intentional transparent padding in source pixels;
- output path and format;
- output pixel width and height;
- CSS display width and height;
- density factor;
- alpha policy and color mode;
- extraction method;
- content and license status;
- status: exported, approximate, blocked, reused, or no-extraction;
- verification results and known deviation.

Paths must stay below outputRoot. IDs and output paths must be unique. Density, output dimensions, and CSS display dimensions must agree within declared rounding.

## Figma Handoff

A later Figma handoff may use asset IDs, output paths, CSS display dimensions, source geometry, ordering, and semantic roles. It must not claim access to original vectors, constraints, components, or hidden layers that the raster source does not contain.

## Verification Receipt

Record file existence, decoded dimensions, format, alpha, dark and light background inspection, checkerboard inspection, crop leakage, edge clipping, compression, placement verification, and every unavailable check.
