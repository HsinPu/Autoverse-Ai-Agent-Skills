---
name: skill-explorer
description: Navigate the local Skill catalog and turn a request into the smallest useful execution route, including what to use now, what artifact enables the next Skill, and where to stop. Use when mapping a task to existing Skills, comparing nearby triggers, discovering a multi-Skill flow, or deciding that no specialized Skill is needed.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
reference-source: mattpocock/skills
reference-revision: e9fcdf95b402d360f90f1db8d776d5dd450f9234
reference-license: MIT
---

# Skill Explorer

Route through the local catalog without turning a simple task into an unnecessary workflow.

## Workflow

1. Identify the requested outcome, current artifact or state, constraints, and nearest decision point.
2. Search descriptions and inspect the bodies of the strongest nearby candidates.
3. Compare ownership, required inputs, produced outputs, stop conditions, and trigger exclusions.
4. Select the narrowest Skill that can act now, or conclude that ordinary agent behavior is sufficient.
5. If another Skill follows, name the exact artifact or state that unlocks it.
6. Stop the route at the user's requested outcome; do not append optional lifecycle stages by default.

## Routing Rules

- Prefer one Skill when it owns the full requested outcome.
- Use a sequence only when each step produces a required input for the next.
- Use alternatives when the request is missing a decision that materially changes the route.
- Use a router or orchestrator Skill when it owns approvals, phase boundaries, or shared state.
- Do not select a Skill merely because its name shares a keyword with the request.
- Do not invent a new Skill during local navigation; use `skill-gap-analyzer` for that decision.

## Output

Return a compact route:

```text
Use now: <skill or no specialized skill>
Why: <ownership and trigger evidence>
Input: <what is already available>
Produces: <artifact or state>
Then: <next skill only if required>
Stop when: <requested outcome and evidence>
Alternative: <only when a real unresolved branch exists>
```

If no specialized Skill is needed, say so directly and identify the ordinary action that should proceed.

## Boundaries

- Keep this Skill local to the current catalog.
- Do not run install or update commands while only exploring.
- Do not substitute catalog popularity or category labels for inspecting the actual workflow.
- Do not create long chains whose later steps are merely optional improvements.

## Handoff

- Use `skill-gap-analyzer` for GitHub or marketplace comparison and add-versus-upgrade decisions.
- Use `skillctl` for direct search, install, list, or update commands.
- Use `skill-lint` for deterministic validation of a selected Skill.
- Use `skill-audit` for semantic quality, provenance, and safety review.
