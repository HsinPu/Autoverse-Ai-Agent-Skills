---
name: skill-executor
description: Sandboxed execution workflow for running agent skills, checking outputs, and validating tool behavior. Use when a skill needs controlled execution, local verification, or a reproducible run before adoption.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Skill Executor

Use this skill when you need to prove a skill works.

## Workflow

1. Identify the exact skill or script to run.
2. Keep execution scope narrow and explicit.
3. Capture inputs, outputs, and failure signals.
4. Re-run the same proof after any change.
5. Summarize what was verified and what remains uncertain.

## Rules

- Prefer sandboxed or isolated execution paths.
- Do not rely on unverified behavior.
- Keep runs small enough to explain.

## Handoff

- For repo shell commands and git state checks, use `terminal-ops`.
- For automation-heavy browser work, use `webapp-testing`.
