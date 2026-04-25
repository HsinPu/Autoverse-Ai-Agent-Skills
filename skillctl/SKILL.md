---
name: skillctl
description: Skill CLI routing workflow for searching, installing, listing, and lightly validating skills from the command line. Use when you need a direct command-line path for skill discovery or management without deeper scanning or review.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Skillctl

Use this skill to route common skill CLI tasks.

## Workflow

1. Identify whether the task is search, install, list, or validation.
2. Choose the narrowest command path that answers the request.
3. Confirm the target skill name and source before changing anything.
4. Run the action and capture the result.
5. Escalate to `skill-scan` or `skill-lint` if the package needs inspection.

## Rules

- Keep command choices explicit and minimal.
- Prefer existing catalog entries over new ones.
- Do not expand into security review unless needed.

## Handoff

- For catalog exploration, use `skill-explorer`.
- For package scanning, use `skill-scan`.
- For structure validation, use `skill-lint`.
