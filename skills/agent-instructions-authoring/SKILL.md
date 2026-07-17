---
name: agent-instructions-authoring
description: Repo-level coding-agent instruction authoring workflow for creating, updating, or consolidating AGENTS.md, AGENTS.override.md, CLAUDE.md, GEMINI.md, Cursor rules, Copilot instructions, .agents/skills, and similar AI coding tool guidance. Use when turning real project commands, architecture rules, validation steps, tool conventions, or repeatable procedures into maintainable agent instructions or skills.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Agent Instructions Authoring

Use this skill to create or maintain instruction files and repo-scoped skills that AI coding tools read before working in a repository.

## Workflow

1. Inspect existing guidance first: `AGENTS.md`, `AGENTS.override.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/`, `.cursorrules`, `.github/copilot-instructions.md`, `.github/instructions/`, `.agents/skills/`, `.claude/skills/`, README, package scripts, build files, test config, install scripts, and CI.
2. Identify the target tool and scope. Prefer the project's existing convention; add a new instruction file only when the target tool needs it or the user asks for it.
3. Extract only durable, verifiable guidance: commands that actually exist, test entry points, code ownership boundaries, architecture rules, generated-file rules, formatting/lint expectations, security constraints, and tool-specific workflows.
4. Write instructions as operational rules, not essays. Use concise sections such as project overview, commands, verification, architecture, editing rules, generated files, and tool notes.
5. Separate facts, procedures, and preferences. Keep project facts and commands in repo instructions; move repeatable multi-step procedures into skills; keep personal preferences in user/global guidance.
6. Preserve existing user/team instructions unless they are clearly obsolete or contradicted by current repo evidence. When merging overlapping files, keep the stricter safe rule and remove duplicated wording.
7. Verify the result by checking links, paths, command names, and any repo validation script that should cover documentation or catalog metadata.

## Tool Routing

| Target | Prefer | Use When |
|---|---|---|
| Cross-tool repo guidance | `AGENTS.md` | The same setup, testing, architecture, and safety rules should apply to multiple coding agents. |
| Codex-specific override | `AGENTS.override.md` | A temporary or narrower Codex override is needed. Remember closer/nested instructions override earlier guidance and size limits may apply. |
| Claude Code project memory | `CLAUDE.md` or `.claude/CLAUDE.md` | The repo already standardizes on Claude Code memory, or Claude-specific behavior is required. |
| Gemini CLI context | `GEMINI.md` | The repo primarily supports Gemini CLI, or Gemini-specific hierarchy/config is already present. |
| Cursor project rules | `.cursor/rules/*.mdc` | Cursor-specific scoped rules are needed. Treat `.cursorrules` as legacy and avoid creating it for new work unless the repo requires backward compatibility. |
| GitHub Copilot | `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md` | Copilot-only or path-specific behavior is required. Keep `AGENTS.md` as the shared source when multiple agents are in use. |
| Portable repo skills | `.agents/skills/<name>/SKILL.md` | A repeatable procedure should load on demand instead of always occupying instruction context. |
| Claude/OpenCode skill compatibility | `.claude/skills/<name>/SKILL.md` or `.opencode/skills/<name>/SKILL.md` | The target tool requires its own discovery path or the repo already uses it. |

## File Selection

- Use `AGENTS.md` as the default portable repo-level instruction file when no narrower tool-specific file is required.
- Use tool-specific files only when the target tool is explicitly in scope or already present in the repo.
- Use nested or directory-scoped rules only when different parts of the repo genuinely need different behavior.
- Prefer one canonical source of truth. If the repo needs compatibility files, make them short pointers or narrowly scoped additions rather than divergent copies.
- Do not copy a full system prompt into a repo instruction file. Keep role/personality guidance out unless the repository itself requires a working convention.

## Content Rules

- Anchor every command to a real script, config file, Make target, package script, or documented manual step.
- Include verification commands with the narrowest useful check first, then broader checks when relevant.
- State destructive-operation boundaries explicitly when the repo has migrations, generated assets, deployment scripts, sync folders, credentials, or large artifacts.
- Mention generated files, build outputs, lockfiles, fixtures, and snapshots only when the repo has a concrete rule for them.
- Keep tool notes short. For example, say when to use CodeGraph, Browser, Docker, GitHub CLI, or project-specific CLIs, but do not restate generic tool manuals.
- Avoid stale claims such as "always run X" unless X exists and is still the expected path.
- Do not treat instruction files as enforcement. They are context for agents; permissions, hooks, CI, branch protection, and review still enforce policy.

## Skill Split Rules

- Keep repo facts in `AGENTS.md`: commands, layout, architecture boundaries, generated files, and validation expectations.
- Create or update a skill when the guidance is a reusable procedure, checklist, workflow, or task-specific playbook.
- Front-load skill descriptions with trigger words because agents may truncate long skill lists before choosing a skill.
- Keep `SKILL.md` concise and move detailed references, examples, or scripts into supporting files when they are needed only for specific cases.
- Review third-party skills like executable supply-chain content, especially when they include scripts, tool permissions, dynamic shell injection, MCP config, or broad file access.

## Handoff

- Use `agent-creator-design` for full system prompts or reusable agent role design.
- Use `repo-ready` when the repo needs broader hygiene, CI, templates, badges, or release setup.
- Use `git-readme-writer` for README structure and public-facing project documentation.
- Use `context-governance` when the work is about memory, context budget, or durable lessons rather than repo instruction files.
- Use `skill-creator-design` when the guidance should become a reusable skill instead of staying in an instruction file.
