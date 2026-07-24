---
name: threejs-large-worlds-geospatial
description: "Large-world and geospatial Three.js engineering. Use for geographic coordinates, ellipsoids, map projections, local tangent frames, floating origins, globe or terrain tiles, geospatial precision, quadtree or clipmap streaming, camera-relative rendering, level of detail, horizon culling, and GIS data integration."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Large Worlds and Geospatial

Keep authoritative geographic coordinates separate from precision-safe local render coordinates.

## Workflow

1. Define coordinate reference systems, ellipsoid or planar model, units, altitude convention, vertical datum, world extent, accuracy, camera range, and data sources.
2. Choose an authoritative double-precision geographic representation and derive local tangent or camera-relative Three.js coordinates.
3. Specify origin-shift thresholds and update ordering for scene objects, cameras, physics, particles, audio, networking, and temporal histories.
4. Partition terrain, imagery, buildings, vectors, and point clouds into versioned tiles with explicit LOD, cache, priority, cancellation, and eviction policies.
5. Add frustum, horizon, occlusion, and distance culling plus crack, seam, and parent-child transition handling.
6. Test poles, antimeridian, projection limits, extreme altitudes, origin shifts, tile churn, slow networks, offline states, and long camera paths.

## Rules

- Do not place raw Earth-scale coordinates directly into float-based render transforms.
- Record every CRS, axis order, unit, and datum conversion.
- Reset or rebase velocity and temporal histories after origin changes.
- Bound tile, texture, geometry, and request caches.
- Preserve source attribution and licensing for geospatial data.

## Evidence

Return the coordinate flow, precision budget, origin-shift sequence, tile and LOD policy, seam tests, network and cache measurements, and geographic reference checks.
