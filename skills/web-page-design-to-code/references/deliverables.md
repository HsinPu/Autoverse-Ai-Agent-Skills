# Web Page Design-to-Code Deliverables

Use only the sections that improve traceability for the current task. Keep small redesigns in task context; persist these artifacts when another implementer must continue the work or the repository treats design decisions as maintained documentation.

## Intake and Audit

```markdown
# Page redesign audit

- Target route:
- Page goal and audience:
- Current framework and route owner:
- Styling system and reusable primitives:
- Content and data sources:
- Required viewports:
- Reference images and their role:
- Must-preserve behavior:
- Required states:
- Accessibility, SEO, analytics, and performance constraints:
- Out of scope:
- Unknowns or blocked access:
```

## Direction Summary and Approval Record

```markdown
# Visual direction

- Direction name:
- Artifact version/identifier:
- Artifact type: image mockup | non-raster prototype
- Exact viewport and covered states for each artifact:
- Hierarchy and section order:
- Palette and typography:
- Grid, spacing, and surfaces:
- Imagery and iconography:
- Interaction and motion intent:
- Desktop-to-mobile reflow:
- Preserved behavior:

## Approval

- Status: proposed | approved | rejected | superseded
- Approved by:
- Approval evidence:
- Implementation explicitly authorized: yes | no
- Approved artifacts:
- Substitute explicitly authorized, if applicable:
- Approved deviations:
```

Do not infer approval from silence or from general encouragement.

## Implementation Contract

```markdown
# Page implementation contract

## Target
- Route:
- Content/data source:
- Existing contracts to preserve:

## Tokens
- Colors:
- Typography:
- Spacing/grid:
- Radius/shadow:

## Sections and components
| Section/component | Layout constraint | Content source | States | Interaction |
| --- | --- | --- | --- | --- |

## Responsive behavior
| Viewport | Reflow and priority rules | Navigation/control changes | Content limits |
| --- | --- | --- | --- |

## Assets
| Asset | Source/license | Treatment | Fallback |
| --- | --- | --- | --- |

## Acceptance criteria
- Functional:
- Visual:
- Responsive:
- Accessibility:
- Performance:
- Allowed tolerance or intentional deviation:
```

## Visual QA Report

```markdown
# Page visual QA

| Viewport/state | Approved reference | Rendered evidence | Severity | Finding/status |
| --- | --- | --- | --- | --- |

- Environment and commit:
- Fonts/data/theme stabilized:
- Validation mode: pixel comparison | constraint-based comparison
- Console/network result:
- Functional checks:
- Accessibility checks:
- Remaining deviations:
- Final decision: pass | pass with accepted deviations | blocked
```
