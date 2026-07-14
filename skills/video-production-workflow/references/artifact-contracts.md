# Video Production Artifact Contracts

## Contents

- Workspace layout
- Shared artifact header
- Artifact ownership
- Acceptance checks
- Restart rules

## Workspace Layout

```text
video-projects/<project-id>/
├─ project-state.md
├─ brief.md
├─ creative-treatment.md
├─ script.md
├─ storyboard.md
├─ shot-list.md
├─ production-design-bible.md
├─ camera-lighting-plan.md
├─ continuity-bible.md
├─ production-plan.md
├─ assets/
│  └─ manifest.md
├─ sound-plan.md
├─ edit-plan.md
├─ review-report.md
└─ renders/
```

Use lowercase kebab-case for `<project-id>`. Treat these files as canonical handoff artifacts, not casual notes.

## Shared Artifact Header

Start each Markdown artifact with:

```text
Project:
Artifact:
Version:
Status: draft | awaiting-approval | approved | superseded
Owner:
Inputs:
Decisions applied:
Assumptions:
Approval owner:
Last updated:
Supersedes:
```

An artifact is not approved merely because its content exists. Record the approval decision and approved version explicitly.

## Artifact Ownership

| Artifact | Default owner | Required content |
|---|---|---|
| `project-state.md` | Video producer or sequential runner | Stage states, owners, versions, approvals, blockers, next stage, restart instruction |
| `brief.md` | Video director | Purpose, audience, platform, scope, inputs, rights, constraints, success criteria, unknowns |
| `creative-treatment.md` | Creative or video director | Narrative approach, visual language, pacing, sound direction, references, exclusions, feasibility |
| `script.md` | Screenwriter or sequential runner | Scenes, visible action, dialogue or narration, timing intent, source and adaptation notes |
| `storyboard.md` | Storyboard artist or sequential runner | Ordered visual beats, composition, screen direction, transitions, audio intent, continuity flags |
| `shot-list.md` | Storyboard artist | Shot ID, scene, duration, framing, angle, lens feel, movement, start state, visible action, end state, audio, assets, dependencies, feasibility, owner, acceptance criteria |
| `production-design-bible.md` | Production designer or sequential runner | Visual-world principles, environments, sets, props, wardrobe, materials, signage, asset specifications, references, rights, allowed variation |
| `camera-lighting-plan.md` | Cinematographer or sequential runner | Shot-level camera, lens, movement, focus, lighting, exposure, color intent, capture or render route, dependencies, feasibility, acceptance criteria |
| `continuity-bible.md` | Continuity supervisor | Character, wardrobe, prop, location, product, interface, style, geography, time, state changes |
| `production-plan.md` | Video producer | Schedule, dependencies, budget, providers, tools, owners, gates, fallback options, delivery specs |
| `assets/manifest.md` | Video producer | Asset ID, shot use, source, owner, rights, consent, version, format, generation metadata, status |
| `sound-plan.md` | Sound designer or sequential runner | Sonic principles, cue IDs, timecodes, dialogue and picture dependencies, source or generation route, rights, stems, mix strategy, loudness and QC targets |
| `edit-plan.md` | Video editor or sequential runner | Cut structure, source ranges, edit decisions, timing, tracks, audio, captions, graphics, transitions, versions, review evidence |
| `review-report.md` | Video director with specialist evidence | Findings, severity, affected artifact or timecode, required fix, owner, gate result |

Use `blocker`, `high`, `medium`, and `low` for review severity. Unresolved `blocker` or `high` findings prevent gate approval; every `medium` or `low` finding needs a recorded fix, rejection rationale, or accepted exception.

## Acceptance Checks

Every handoff must answer:

1. Does the artifact identify its approved inputs and version?
2. Does it satisfy the stage's required fields and acceptance criteria?
3. Are assumptions, unresolved decisions, rights, cost, and capability limits visible?
4. Does it preserve continuity with upstream accepted artifacts?
5. Can the next owner begin without guessing or silently changing scope?
6. Is the artifact approved when the next stage requires approval?

Reject a handoff that lacks required evidence, writes outside the canonical project workspace, or changes another owner's accepted decision without a revision record.

## Restart Rules

- Resume from the first non-verified stage, not from the beginning by default.
- Load the approved version of every upstream dependency before resuming.
- Mark an affected downstream artifact `superseded` when an upstream approved artifact changes.
- Preserve failed and rejected versions when they explain cost, continuity, or decision history.
- Never infer approval from elapsed time, partial execution, or an earlier unrelated approval.
