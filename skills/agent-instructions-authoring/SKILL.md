---
name: agent-instructions-authoring
description: Repo-level coding-agent instruction authoring workflow for creating, updating, or consolidating AGENTS.md, CLAUDE.md, .cursorrules, Cursor rules, Copilot instructions, and similar files. Use when turning real project commands, architecture rules, validation steps, tool conventions, or agent-specific guidance into maintainable instruction files for AI coding tools.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Agent Instructions Authoring

Use this skill to create or maintain instruction files that AI coding tools read before working in a repository.

## Workflow

1. Inspect existing guidance first: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.cursor/rules/`, `.github/copilot-instructions.md`, README, package scripts, build files, test config, install scripts, and CI.
2. Identify the target tool and scope. Prefer the project's existing convention; add a new instruction file only when the target tool needs it or the user asks for it.
3. Extract only durable, verifiable guidance: commands that actually exist, test entry points, code ownership boundaries, architecture rules, generated-file rules, formatting/lint expectations, security constraints, and tool-specific workflows.
4. Write instructions as operational rules, not essays. Use concise sections such as project overview, commands, verification, architecture, editing rules, generated files, and tool notes.
5. Separate facts from preferences. Keep project-specific commands in the repo file; keep reusable authoring workflow in this skill or another global skill.
6. Preserve existing user/team instructions unless they are clearly obsolete or contradicted by current repo evidence. When merging overlapping files, keep the stricter safe rule and remove duplicated wording.
7. Verify the result by checking links, paths, command names, and any repo validation script that should cover documentation or catalog metadata.

## File Selection

- Use `AGENTS.md` for portable repo-level coding-agent instructions when no narrower tool-specific file is required.
- Use tool-specific files only when the target tool is explicitly in scope or already present in the repo.
- Use nested or directory-scoped rules only when different parts of the repo genuinely need different behavior.
- Do not copy a full system prompt into a repo instruction file. Keep role/personality guidance out unless the repository itself requires a working convention.

## Content Rules

- Anchor every command to a real script, config file, Make target, package script, or documented manual step.
- Include verification commands with the narrowest useful check first, then broader checks when relevant.
- State destructive-operation boundaries explicitly when the repo has migrations, generated assets, deployment scripts, sync folders, credentials, or large artifacts.
- Mention generated files, build outputs, lockfiles, fixtures, and snapshots only when the repo has a concrete rule for them.
- Keep tool notes short. For example, say when to use CodeGraph, Browser, Docker, GitHub CLI, or project-specific CLIs, but do not restate generic tool manuals.
- Avoid stale claims such as "always run X" unless X exists and is still the expected path.

## Handoff

- Use `agent-creator-design` for full system prompts or reusable agent role design.
- Use `repo-ready` when the repo needs broader hygiene, CI, templates, badges, or release setup.
- Use `git-readme-writer` for README structure and public-facing project documentation.
- Use `context-governance` when the work is about memory, context budget, or durable lessons rather than repo instruction files.
- Use `skill-creator-design` when the guidance should become a reusable skill instead of staying in an instruction file.
