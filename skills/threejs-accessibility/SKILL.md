---
name: threejs-accessibility
description: "Accessible non-XR Three.js experience design and verification. Use for keyboard and switch access, focus, screen-reader semantics, reduced motion, captions, high contrast, color-independent cues, canvas alternatives, accessible 3D controls, or equivalent text and data views."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Accessibility

Keep essential information and actions available through semantic, testable paths that do not depend on seeing, hearing, or precisely manipulating the canvas.

## Workflow

1. Inventory essential content, state, controls, transactions, time limits, motion, sound, and spatial relationships.
2. Read [accessibility-contract.md](../threejs-development/references/accessibility-contract.md) and define the semantic DOM or structured-data counterpart to the scene.
3. Map keyboard, switch, touch, pointer, and assistive-technology input to the same application intents with visible focus and predictable order.
4. Provide text, table, list, caption, transcript, contrast, reduced-motion, and non-spatial alternatives where each carries meaning.
5. Announce important changes without flooding live regions and preserve state when users switch input modes.
6. Test zoom, reflow, high contrast, reduced motion, keyboard-only operation, screen readers, coarse pointers, and representative failure states.

## Rules

- Do not place essential controls exclusively inside an inaccessible canvas.
- Treat DOM semantics as an application view backed by shared state, not a duplicate source of truth.
- Never rely on color, depth, motion, hover, or spatial audio alone to convey meaning.
- Keep camera motion optional when it is not essential and provide a stable alternative when it is.
- Measure target size, focus visibility, contrast, timing, and alternative-path completeness.

## Handoff

- Use `threejs-webxr-accessibility` for immersive-session lifecycle, reference spaces, controllers, hands, and XR comfort.
- Use `threejs-ui-overlays` for projected labels, HUD layout, text rendering, occlusion, and DOM-to-scene alignment.

## Evidence

Return the essential-action inventory, semantic model, input equivalence map, alternative content, tested assistive-technology matrix, known limits, and remediation evidence.
