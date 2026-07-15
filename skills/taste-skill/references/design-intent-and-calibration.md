# Design Intent and Calibration

Use this reference when the brief is vague, stakeholders use subjective adjectives, or several visual directions seem plausible.

## Evidence Before Aesthetics

Capture the evidence that should shape the direction:

| Evidence | Questions | Design consequence |
| --- | --- | --- |
| User task | What must be understood or completed quickly? | Hierarchy, density, control prominence |
| Audience | What conventions, literacy, and trust signals do users expect? | Familiarity, tone, explanation depth |
| Content | Is it narrative, transactional, analytical, or mixed? | Layout rhythm, component families, line length |
| Brand | Which assets and traits are authoritative? | Palette, typography, imagery, voice |
| Platform | Which existing components and interaction norms apply? | Buildability, consistency, accessibility |
| Risk | What happens when a user misunderstands the interface? | Restraint, confirmation, error handling |
| Environment | Which devices, themes, locales, and performance limits matter? | Reflow, contrast, asset weight, fallbacks |

Separate facts from assumptions. If a missing answer would materially change the direction, surface it as an open decision instead of inventing it.

## Visual Intent Template

```text
For [specific audience] completing [primary task], the interface should feel
[two or three observable qualities], remain [important constraints], and be
recognizable through [one signature idea]. It must not become [specific failure mode].
```

Good qualities imply visible behavior:

- “calm under pressure” can mean stable geometry, limited simultaneous motion, and clear status hierarchy;
- “editorial and authoritative” can mean expressive type scale, controlled line length, and evidence-led imagery;
- “fast and technical” can mean dense scanning patterns, strong alignment, keyboard efficiency, and concise feedback.

## Calibration Dials

### Composition Freedom

| Level | Use when | Typical expression |
| --- | --- | --- |
| Low | Repetition, speed, or compliance matters most | Regular grids, stable alignment, familiar templates |
| Medium | The product needs character without slowing comprehension | Selective asymmetry, varied section rhythm, one signature composition |
| High | Narrative, campaign, or cultural expression is central | Editorial pacing, overlap, dramatic scale shifts, custom art direction |

### Interaction Energy

| Level | Use when | Typical expression |
| --- | --- | --- |
| Low | Tasks are frequent, sensitive, or time-critical | Immediate feedback, minimal transitions, stable controls |
| Medium | Motion can clarify state and hierarchy | Coordinated transitions, purposeful reveals, restrained micro-interactions |
| High | The experience itself is part of the value | Choreographed sequences and spatial transitions with clear escape and reduced-motion paths |

### Information Density

| Level | Use when | Typical expression |
| --- | --- | --- |
| Low | One decision or narrative beat dominates | Generous spacing, limited simultaneous choices, strong focal point |
| Medium | Users need overview plus detail | Layered hierarchy, summaries, progressive disclosure |
| High | Expert users compare or monitor many signals | Compact rhythm, alignment, filters, legible tables, customizable views |

## Selection Rule

Choose the lowest intensity that fully supports the product goal. Raise a dial only when evidence justifies the added complexity. If two directions remain viable, compare them against user task, brand fit, accessibility, performance, and implementation cost rather than personal preference alone.
