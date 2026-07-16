---
name: throwaway-prototyping
description: Build a deliberately disposable experiment that answers one product, interaction, visual, logic, architecture, or integration question with the minimum necessary fidelity. Use during solution discovery when evidence requires executable behavior or a tangible comparison, but production quality, persistence, migration, security hardening, and long-term maintainability would obscure the learning goal.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
  reference-source: "mattpocock/skills"
  reference-license: "MIT"
  reference-revision: "e9fcdf95b402d360f90f1db8d776d5dd450f9234"
---

# Throwaway Prototyping

Create the smallest reversible experiment that can change a decision. Treat the result as evidence, not production code.

## Experiment Contract

Define before building:

- one learning question;
- the observation that would answer it;
- the minimum fidelity and representative data required;
- a time or effort limit;
- an isolated location and execution command;
- prohibited production dependencies and side effects;
- the disposition decision after review.

If the question cannot change a decision, do not build the prototype.

## Choose The Shape From The Question

| Question type | Useful prototype |
|---|---|
| Business logic or state | Interactive state model with visible transitions and edge cases |
| Workflow or usability | Clickable path with realistic content and critical states |
| Visual behavior that needs rendered comparison | Two or more materially different concepts at the target viewport |
| Architecture or integration | Narrow spike proving one boundary, latency, compatibility, or API assumption |
| Operational behavior | Safe local or sandbox simulation with observable failure and recovery |

Do not choose a framework merely because it resembles the eventual production stack.

## Workflow

1. Record the learning question, competing expectations, and decision owner.
2. Inspect existing assets or repository constraints only far enough to avoid a misleading experiment.
3. Create an isolated prototype that runs with one documented command when practical.
4. Use fake, local, or sandbox data. Disable real email, payment, inventory, analytics, account, and production mutations.
5. Expose the state, assumptions, shortcuts, and failure behavior needed to interpret the result.
6. Run the planned scenarios and capture observations, screenshots, timings, traces, or user feedback.
7. Decide whether the evidence supports, rejects, or leaves the hypothesis unresolved.
8. Record the production consequences without promoting prototype code by default.
9. Keep, archive, or remove the prototype according to user authority and repository policy.

## Fidelity Rules

- Include only fidelity that affects the learning question.
- Preserve real content extremes or state complexity when placeholders would bias the result.
- Make intentional omissions visible.
- Avoid persistence unless persistence is the question being tested.
- Avoid production credentials and real user data.
- Avoid polishing error handling, abstractions, tests, or deployment beyond what is needed to trust the observation.

## Production Boundary

- Label the prototype as disposable and isolated.
- Do not copy it into production unchanged.
- Re-derive production requirements, contracts, security, accessibility, observability, migration, tests, and maintainability from the accepted decision.
- Reuse an artifact only after explicit review establishes that it meets normal production standards.
- Do not delete existing user files or branches during cleanup without authorization.

## Output

When an experiment is justified, return the learning question, prototype location and run command, intentional shortcuts, scenarios, observations, decision, confidence, unresolved risks, production implications, and disposition.

When inspection proves a prototype would not change a decision, return a no-prototype result with the existing evidence, recommended decision path, and reason no artifact was created.

## Handoff

- Use `solution-discovery` to compare the evidence with other solution directions.
- Use `design-consultation` when the unresolved question is art direction alone; use this Skill when rendered, interactive, or comparative evidence is required to decide.
- Use `autoresearch` when repeated experiments optimize a stable scalar metric.
- Use `spec-flow` after the prototype informs an approved production direction.
- Use `code-change-workflow` before implementing the production version in an existing repository.
