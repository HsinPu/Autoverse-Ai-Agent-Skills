---
name: threejs-webxr-accessibility
description: "WebXR and inclusive Three.js experience design. Use for immersive VR or AR sessions, reference spaces, controllers, hands, locomotion, hit testing, anchors, XR performance, motion comfort, session lifecycle, keyboard or screen alternatives, reduced motion, captions, focus, and non-visual access to essential 3D content."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js WebXR and Accessibility

Make immersive capability progressive and keep essential content and actions available outside a headset.

## Workflow

1. Define supported XR modes, devices, session features, physical space, input sources, comfort constraints, HTTPS deployment, and non-XR fallback.
2. Let the XR system own camera projection and pose while the application owns world origin and locomotion policy.
3. Map controller, hand, gaze, pointer, keyboard, and assistive alternatives to the same semantic actions.
4. Design seated and standing modes, reachable targets, scale cues, teleport or smooth locomotion options, and reduced-motion behavior.
5. Test session start, permission denial, interruption, device removal, recentering, controller changes, frame-budget pressure, and exit cleanup.

## Rules

- Do not require XR for information or transactions that need an accessible web path.
- Avoid forced camera motion, unexpected acceleration, and unreadable world-locked UI.
- Provide captions or text alternatives for essential spatial audio.
- Maintain visible focus and meaningful DOM semantics for surrounding controls.
- Verify feature support at runtime and degrade by capability.

## Evidence

Return the XR capability matrix, reference-space and input design, comfort options, accessible fallback, session lifecycle tests, and device performance results.
