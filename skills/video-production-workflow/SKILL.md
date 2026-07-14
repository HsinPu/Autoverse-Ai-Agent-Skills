---
name: video-production-workflow
description: Approval-gated, tool-neutral workflow for taking a video from brief or source material through treatment, script, storyboard, continuity, production planning, asset creation, edit, review, and delivery. Use when coordinating a complete video project across Agents and media Skills, or when one agent must execute the same stages sequentially with restartable artifacts.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
reference-source: calesthio/OpenMontage
reference-license: AGPL-3.0
---

# Video Production Workflow

Use this skill to coordinate a complete video production without assuming a specific model, provider, editor, or agent runtime.

## Start Here

1. Identify the entry mode: idea, approved script, source footage, adaptation material, or revision of an existing project.
2. Confirm purpose, audience, platform, duration, aspect ratio, language, accessibility needs, deadline, budget authority, rights, and approval owner.
3. Create or resume `video-projects/<project-id>/`; for a new project, copy [assets/project-template](assets/project-template) into that directory, then load `project-state.md` before performing stage work.
4. Discover available Agents, Skills, tools, and providers. Never claim a capability from a name alone.
5. Choose the smallest execution mode that satisfies the brief.

## Execution Modes

### Director-led multi-agent

- Keep `video-director` accountable for creative direction, gates, revision arbitration, and final review.
- Use `video-producer` for schedule, budget, assets, rights, provider planning, and checkpoint state.
- Delegate script, storyboard, and continuity artifacts only to suitable discovered Agents.
- Give one owner exclusive write authority for each canonical artifact at a time.
- Validate every handoff before starting dependent work.

### Sequential fallback

- When custom Agents or subagents are unavailable, keep one agent in control and execute the same stages in order.
- Load the relevant Skill for each stage instead of imitating an unavailable specialist.
- Write the same canonical artifacts, approvals, decisions, and checkpoints used by the multi-agent mode.
- Stop at every required gate; fallback mode does not reduce approval requirements.

## Production Stages

1. **Intake and research**: verify inputs, rights, audience, constraints, references, success criteria, and unknowns; produce `brief.md`.
2. **Creative treatment**: define story approach, visual language, pacing, sound direction, reference principles, exclusions, and feasibility; produce `creative-treatment.md`.
3. **Script**: create or adapt the approved narrative, scenes, action, dialogue, voiceover, and timing; produce `script.md`.
4. **Storyboard and shot plan**: translate the script into scenes, shots, framing, camera, motion, audio, duration, assets, and transitions; produce `storyboard.md` and `shot-list.md`.
5. **Continuity and production plan**: lock character, wardrobe, prop, location, screen-state, style, and temporal continuity while planning schedule, budget, rights, providers, and assets; produce `continuity-bible.md`, `production-plan.md`, and `assets/manifest.md`.
6. **Asset production**: generate, source, record, or prepare approved visual, video, voice, music, sound, caption, and graphic assets; update the manifest after every accepted version.
7. **Edit and compose**: assemble picture, motion, audio, captions, graphics, transitions, and timing through the available edit or code-generated workflow; produce `edit-plan.md` and versioned renders.
8. **Review and delivery**: inspect narrative clarity, continuity, rights, accessibility, technical conformance, audio balance, artifacts, and platform requirements; produce `review-report.md` and the approved deliverables.

## Checkpoints

Use these stage states in `project-state.md`:

- `queued`: prerequisites are not yet verified.
- `active`: one owner is performing the stage.
- `awaiting-approval`: the artifact is reviewable and no dependent work may start.
- `blocked`: a named prerequisite, capability, right, or decision is missing.
- `verified`: the artifact and acceptance evidence passed the stage gate.

On every transition, record the owner, artifact version, evidence, decisions, cost to date when relevant, next eligible stage, and safe restart instruction.

## Approval Gates

Require explicit approval for:

- the creative treatment before detailed production planning;
- the script before shot-level planning;
- the storyboard, continuity baseline, and production plan before batch asset work;
- paid generation, licensed assets, identifiable likeness or voice use, and consequential external calls;
- provider or model substitutions that change cost, rights, privacy, quality, or timing;
- final render selection and any publication or distribution action.

An earlier approval does not silently authorize later gates. Record any explicit full-run authorization with its scope and exclusions.

## Tool and Provider Decisions

- Announce the capability, provider, model or variant, expected cost, input data, rights implications, and whether the call is a sample or batch before consequential execution.
- Prefer a small representative test before expensive or large batch generation.
- Preserve prompts, seeds, settings, source assets, versions, and failure notes needed for reproducibility.
- When an approved path fails, explain the failure and alternatives, recommend one, and wait for approval before substituting a materially different path.

## Artifact Contracts

Read [references/artifact-contracts.md](references/artifact-contracts.md) before creating or accepting project artifacts, and use [assets/project-template](assets/project-template) as the reusable starting set. Read [references/routing-and-approvals.md](references/routing-and-approvals.md) before delegating or deciding which gates apply. Source adaptation notes are recorded in [references/source-notes.md](references/source-notes.md).

## Handoffs

- Use `gallery-researcher` and `web-research-ops` for attributable visual and factual research.
- Use `short-video-script` for short social scripts and a discovered `screenwriter` for broader narrative screenplay ownership.
- Use `storyboard-creation` and a discovered `storyboard-artist` for shot-level planning.
- Use `ai-video-prompting` and `ai-video-generation` for generative clips.
- Use `image-generator`, `ai-image-prompt-design`, and `image-utils` for still assets.
- Use `audio-generation`, `text-to-speech`, and `subtitle-captions` for sound and accessibility assets.
- Use `remotion-video-toolkit` for deterministic programmatic composition and `video-edit` for existing-footage edits and delivery transforms.

## Rules

- Do not skip stages merely because a tool can produce a video from one prompt.
- Do not create assets before their purpose, shot, continuity requirements, rights, and acceptance criteria are recorded.
- Do not allow generated output to silently redefine the approved script, treatment, product appearance, brand, or continuity baseline.
- Preserve source media and accepted artifacts; write revisions and renders as new versions.
- Keep the workflow useful for short, long-form, live-action, animated, AI-generated, and hybrid productions by varying team size rather than changing the contracts.
