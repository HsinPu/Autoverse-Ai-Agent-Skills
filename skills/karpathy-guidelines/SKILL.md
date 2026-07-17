---
name: karpathy-guidelines
description: Behavioral coding guidelines for reducing common LLM implementation mistakes. Use when writing, reviewing, or refactoring code to surface assumptions, avoid overengineering, keep changes surgical, and define verifiable success criteria before execution.
license: MIT
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "multica-ai/andrej-karpathy-skills"
  reference-license: "MIT"
  reference-revision: "2c606141936f1eeef17fa3043a72095b4765b9c2"
---

# Karpathy Guidelines

Use this skill when a coding task is non-trivial enough that assumptions, scope creep, or verification gaps could create avoidable mistakes.

These guidelines are adapted for this skill catalog from the public `multica-ai/andrej-karpathy-skills` project. They are meant to shape implementation behavior, not replace project-specific rules.

## Core Scope

- Coding, refactoring, debugging, and review tasks
- Requirements that may have more than one reasonable interpretation
- Existing codebases where unrelated edits would create risk
- Multi-step work that needs explicit verification
- Tasks where a simpler implementation may be better than a clever one

## Operating Principles

### Think Before Coding

Make uncertainty visible before making changes.

- State important assumptions before acting on them.
- Ask for clarification when missing information changes the correct solution.
- Present meaningful tradeoffs when there are multiple valid paths.
- Push back when the requested path appears risky, wasteful, or more complex than needed.
- Stop and name confusion instead of silently choosing an interpretation.

### Simplicity First

Prefer the smallest implementation that fully satisfies the request.

- Do not add features that were not requested.
- Do not create abstractions for one-off code.
- Do not add configurability without a real current need.
- Do not build defensive handling for impossible or irrelevant cases.
- If the solution becomes much larger than the problem, simplify before handing it off.

### Surgical Changes

Every changed line should trace back to the user's request.

- Match the existing code style and local patterns.
- Avoid drive-by formatting, comment rewrites, and unrelated cleanup.
- Do not refactor adjacent code unless it is required for the task.
- If unrelated dead code or problems are found, mention them separately.
- Remove only the unused imports, variables, files, or paths created by the current change.

### Goal-Driven Execution

Turn the task into a verifiable outcome.

- Define success criteria before implementation when the task has meaningful risk.
- Prefer tests or focused checks that prove the requested behavior.
- For bugs, reproduce the failure before fixing when feasible.
- For refactors, verify behavior before and after the change when feasible.
- Keep looping until the success criteria are met or a blocker is clearly explained.

## Workflow

1. Read the relevant code, docs, and local instructions before deciding.
2. Restate the goal in terms of observable behavior or review outcome.
3. Identify assumptions, ambiguity, and scope boundaries.
4. Choose the simplest implementation that fits existing patterns.
5. Make the smallest coherent change set.
6. Run the most relevant verification available.
7. Report what changed, what was verified, and any remaining risks.

## Checkpoints

- Is the request clear enough to implement without guessing?
- Is there a simpler solution that still solves the real problem?
- Did any file change for a reason unrelated to the request?
- Did the implementation add speculative flexibility?
- Are success criteria concrete enough to verify?
- Were tests, smoke checks, or manual checks run at the right level?
- Are unresolved assumptions or skipped checks stated plainly?

## When To Ask First

Ask before coding when:

- The user request has multiple incompatible interpretations.
- The change may alter public API behavior, data shape, persistence, security, or billing.
- Verification requires destructive commands, production access, or external side effects.
- The obvious implementation conflicts with project rules or existing architecture.

Do not ask merely to avoid ordinary implementation judgment. If the ambiguity is low-risk, state the assumption and proceed.

## Handoff

- Use `code-review` when the user asks for a review or PR findings.
- Use `code-change-workflow` before editing existing code when the current entry point, call chain, or verification path is not yet clear.
- Use `code-refactoring` when the main goal is behavior-preserving cleanup.
- Use `testing-strategy` when verification scope is the main question.
- Use language-specific skills such as `typescript-development`, `javascript-development`, `python-development`, or `java-development` for implementation details.
- Use `ask-questions-if-underspecified` when the user explicitly wants a question-first requirements pass.
