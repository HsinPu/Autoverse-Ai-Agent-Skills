---
name: threejs-data-visualization
description: "Three.js data and scientific visualization. Use for 3D charts, point clouds, networks, volumes, trajectories, digital twins, temporal or spatial datasets, encodings, axes, legends, labels, filtering, picking, uncertainty, large datasets, accessible summaries, and reproducible visual analysis."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Data Visualization

Preserve data semantics, uncertainty, scale, and queryability while using 3D only where it improves understanding.

## Workflow

1. Define the analytical question, data schema, units, time, coordinate reference, uncertainty, audience, interactions, and required non-visual output.
2. Decide whether 3D adds meaningful spatial or structural information compared with a 2D chart.
3. Map fields to position, size, color, opacity, shape, motion, and grouping with documented scales and perceptual limits.
4. Build axes, legends, labels, filters, selection, details, camera constraints, and accessible table or textual summaries.
5. Choose instancing, points, level-of-detail, aggregation, tiling, workers, or GPU computation from dataset size and interaction latency.
6. Validate known records, extrema, missing values, unit conversions, filters, occlusion, color perception, uncertainty, and reproducible screenshots.

## Rules

- Never use perspective, area, volume, or animation in ways that misrepresent magnitude.
- Keep data transforms inspectable and independently testable.
- Show uncertainty and missingness instead of silently replacing them.
- Avoid color-only encoding and provide accessible summaries for important findings.
- Bound visible marks and picking work through aggregation or spatial indexing.

## Evidence

Return the question and schema, encoding table, transform tests, accessibility path, interaction behavior, performance measurements, and validated reference cases.
