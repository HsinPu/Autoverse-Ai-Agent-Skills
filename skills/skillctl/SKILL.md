---
name: skillctl
description: Skill CLI routing workflow for searching, installing, listing, updating, and lightly validating local or open-ecosystem skills from the command line. Use when you need a direct command-line path for skill discovery or management, including autoverse-cli.js and the open Skills CLI, without deeper scanning or review.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Skillctl

Use this skill to route common skill CLI tasks.

## Workflow

1. Identify whether the task is search, install, list, update, or validation.
2. Choose the narrowest command path that answers the request.
3. Confirm the target skill name and source before changing anything.
4. Run the action and capture the result.
5. Escalate to `skill-scan` or `skill-lint` if the package needs inspection.

## Local Catalog Commands

Use the repository CLI when working with this catalog:

- `node autoverse-cli.js list`
- `node autoverse-cli.js search <keyword>`
- `node autoverse-cli.js info <skill-name>`
- `node autoverse-cli.js install <skill-name> --agent <agent>`
- `node autoverse-cli.js update <skill-name> --agent <agent>`

Avoid install/update/uninstall as validation unless the user specifically asks for installation or update behavior.

## Open Skills CLI Commands

Use the open Skills CLI when the user is looking for a capability that may exist outside the local catalog:

- `npx skills find <query>` to search for skills by keyword.
- `npx skills add <owner/repo@skill>` to install a selected skill.
- `npx skills check` to check installed skills for updates.
- `npx skills update` to update installed skills.

Browse or verify candidates at `https://skills.sh/` when current marketplace metadata matters.

## Discovery Flow

1. Translate the user's need into 2 to 4 concise search terms.
2. Search the local catalog first when the user is working inside this repo.
3. Search the open ecosystem with `npx skills find <query>` when local skills do not cover the need.
4. Do not recommend a skill from search snippets alone; inspect enough metadata to confirm fit.
5. Present the skill name, source, purpose, install command, and any confidence caveats.
6. Install only after the user agrees or when the user explicitly asked you to install it.

## Candidate Quality Checks

Before recommending an external skill, check:

- Source reputation, such as official or well-known maintainers.
- Install count when available; prefer broadly used packages and be cautious with very low install counts.
- Repository health, including stars, recency, license, and obvious maintenance signals.
- Scope fit against the user's actual task.
- Whether the local catalog already has a narrower or safer equivalent.

If a package includes scripts, templates, broad permissions, or unclear provenance, hand off to `skill-security-review` before installing.

## Rules

- Keep command choices explicit and minimal.
- Prefer existing catalog entries over new ones.
- Do not expand into security review unless needed.
- Do not run global installs silently.
- Do not present marketplace popularity as proof of correctness.

## Handoff

- For catalog exploration, use `skill-explorer`.
- For package scanning, use `skill-scan`.
- For structure validation, use `skill-lint`.
- For marketplace gap decisions, use `skill-gap-analyzer`.
- For third-party risk checks, use `skill-security-review`.
