---
name: threejs-ui-overlays
description: "User interfaces and text for Three.js experiences. Use for HUDs, menus, labels, annotations, tooltips, CSS2D or CSS3D overlays, HTML portals, sprites, SDF or MSDF text, TextGeometry, world-to-screen projection, occlusion, responsive safe areas, touch targets, focus, localization, and accessible DOM equivalents."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js UI and Overlays

Choose DOM, canvas, texture, or world-space UI from interaction, accessibility, depth, performance, and visual requirements.

## Workflow

1. Inventory HUD, menu, label, tooltip, editor, dialogue, caption, and world-space text states plus input devices and localization needs.
2. Select DOM overlays for semantic and accessible controls, texture or SDF text for scene-integrated scale, and geometry only when physical form is required.
3. Define world-to-screen projection, anchor, occlusion, collision, clamping, safe area, z-order, focus, and pointer-event ownership.
4. Model loading, empty, disabled, hover, focus, active, error, pause, and responsive states.
5. Test text expansion, RTL, font loading, zoom, high DPR, mobile rotation, notches, touch targets, overlap, offscreen anchors, occlusion, and keyboard navigation.

## Rules

- Keep essential controls and information in semantic DOM or provide an equivalent accessible path.
- Do not render large volumes of DOM labels without culling or clustering.
- Avoid recreating canvas textures or text geometry every frame.
- Coordinate overlay pointer events with scene controls.
- Sanitize all user- or asset-derived label content.

## Evidence

Return the UI layer map, rendering choice per component, projection and occlusion rules, responsive captures, accessibility checks, text-fit results, and performance measurements.
