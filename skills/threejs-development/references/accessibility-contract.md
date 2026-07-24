# Three.js Accessibility Contract

Use this contract for non-XR canvas experiences. Immersive session behavior belongs to `threejs-webxr-accessibility`.

## Start with Essential Outcomes

Classify each visible or audible element as:

- essential information;
- essential action or transaction;
- navigation or orientation;
- feedback, warning, or status;
- decorative presentation.

Every essential outcome needs a semantic and operable path outside scene-only hit testing. The alternative may be a DOM control, structured list, table, synchronized details panel, transcript, or downloadable data view.

## Shared Application Semantics

- Keep stable IDs, labels, roles, state, availability, and relationships in application data.
- Project that model into both the Three.js view and semantic DOM.
- Route pointer, keyboard, switch, touch, voice, and assistive input into the same commands.
- Keep DOM focus independent from camera focus while exposing their relationship.
- Announce meaningful state changes selectively; do not mirror every frame or transform into a live region.

## Sensory Equivalence

| Scene signal | Required consideration |
|---|---|
| Color or material change | Text, icon, pattern, shape, or state label |
| Depth or position | Ordered text, coordinates, hierarchy, or relationship |
| Motion | Reduced-motion mode and stable end-state access |
| Spatial sound | Caption, transcript, visible direction, or equivalent alert |
| Hover or ray hit | Keyboard focus, touch, and programmatic control |
| Timed animation | Pause, extend, skip, or deterministic completion where needed |

## Verification

Test essential flows with:

1. keyboard only;
2. a representative screen reader;
3. 200% and 400% zoom or equivalent reflow;
4. high-contrast and forced-color settings;
5. reduced motion;
6. muted audio and captions;
7. coarse pointer or switch-like sequential input;
8. canvas or WebGL failure.

Record incomplete equivalence as a product defect, not a renderer limitation.
