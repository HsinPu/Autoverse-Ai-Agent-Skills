# Image Analysis Contract

Use this template before implementation when one or more visual references are the primary UI source.

## Reference Set

Give every screenshot, mockup, crop, or recording keyframe a stable identifier. Record authority by concern so later references do not silently override earlier approvals.

| ID | Source | Role | Viewport/state | Controls | Confidence | Conflict |
| --- | --- | --- | --- | --- | --- | --- |
| `desktop-default` | <path or artifact> | exact target | <viewport, theme, state> | structure, styling | high | none |
| `mobile-menu` | <path, timestamp, or frame> | state reference | <viewport, theme, state> | reflow, navigation state | medium | header spacing differs |

`Controls` may name structure, styling, content, assets, responsive behavior, or interaction state. Resolve conflicting high-authority sources before implementation. If resolution is deferred, name the affected component and acceptance risk.

## Source Record

```markdown
- Source: <path or artifact identifier>
- Role: <exact target | structural reference | style inspiration | detail reference>
- Dimensions: <pixels>
- Intended viewport: <CSS viewport if known>
- Device/theme/state: <desktop|tablet|mobile; light|dark; represented state>
- Authority: <what the image may and may not decide>
```

Pixel dimensions and CSS viewport dimensions are not always the same. Record device scale or browser zoom when known; otherwise mark it unknown.

## Recording and Multi-State Evidence

Extract only the smallest keyframe set that proves meaningful state changes. Do not treat every frame as a separate design target.

| From state | Trigger observed | To state | Keyframe or time range | What is proven | What remains unknown |
| --- | --- | --- | --- | --- | --- |
| <state> | <click, scroll, input, timeout> | <state> | <time/frame> | <layout, feedback, duration family> | <data rule, hidden branch, error path> |

Convert the table into a state-transition contract. Preserve repository behavior for branches the evidence does not show, and request clarification when an unknown changes permissions, data, navigation, or destructive behavior.

## Observation Map

### Macro

- global shell, navigation, and page boundaries;
- section sequence and dominant focal point;
- grid columns, content width, gutters, and major alignment lines;
- approximate section heights and whitespace distribution;
- foreground/background layering and visual depth.

### Meso

- reusable components and repeated layout families;
- text-to-media relationships and content grouping;
- control types, affordances, and visible state cues;
- spacing rhythm and alignment between neighboring elements;
- likely breakpoint changes and content-priority order.

### Micro

- font categories, roles, weight, size, line height, tracking, and line length;
- base, surface, text, muted, accent, border, and status colors;
- radius, border, shadow, texture, gradient, and opacity treatment;
- icon family, stroke/fill behavior, imagery crop, and aspect ratio;
- animation clues such as staged elements, carousels, or state transitions.

## Measurement Table

Use measurements as constraints, not isolated magic numbers.

| Element | Observed bounds | Relationship | Confidence |
| --- | --- | --- | --- |
| Page content | <x, y, width, height> | centered or edge-aligned | high/medium/low |
| Hero copy | <bounds> | aligns to grid line | high/medium/low |
| Primary action | <bounds> | follows copy by approximate spacing | high/medium/low |
| Major media | <bounds/aspect> | overlaps or aligns with section | high/medium/low |

## Ambiguity Ledger

| Unknown | Why it matters | Evidence available | Decision or next action |
| --- | --- | --- | --- |
| Font family | Changes wrapping and vertical rhythm | Visual category only | Use project brand font; compare line breaks |
| Mobile navigation | Not shown | Existing app behavior | Preserve current menu pattern |

Escalate or generate a focused detail only when an unknown changes structure, behavior, accessibility, or a high-impact visual decision. Low-impact uncertainty can be resolved conservatively and documented.

## Contract Summary

End with:

- structural rules;
- reference precedence and resolved conflicts;
- token candidates;
- component and state inventory;
- observed transitions and unproven behavior;
- responsive inferences;
- asset and content sources;
- preserved product behavior;
- fidelity priorities and accepted deviations.
