---
name: skillctl
description: Route direct Skill command-line operations across the CraftRoster catalog, its repository-native installers, the open Skills CLI, and supported platform installers. Use when searching, listing, installing, updating, using, initializing, or removing Skills and the exact source, target, scope, and ownership are known; use skill-gap-analyzer for capability comparisons and skill-security-review before adopting executable third-party packages.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Skillctl

Choose a command that actually exists for the selected catalog and preserve the installer that owns the package.

## Workflow

1. Identify the requested action, source, Skill name, target agent, project or global scope, and current owner.
2. Select CraftRoster query CLI, CraftRoster installer, open Skills CLI, or a platform installer; do not mix ownership models.
3. Run a read-only lookup or installer dry run before a mutation when the selected tool supports it.
4. Inspect provenance and executable content before installing an external package.
5. Execute only the requested scope, then verify the installed path, ownership metadata, command result, and loaded Skill.
6. Report whether the result was installed, updated, unchanged, blocked, or unsupported.

## CraftRoster Query CLI

`craftroster-cli.js` is a read/query CLI. It does not install, update, or remove files.

- `node craftroster-cli.js list`
- `node craftroster-cli.js search <keyword>`
- `node craftroster-cli.js info <skill-name>`
- `node craftroster-cli.js list --installed --target codex`

Do not invent `craftroster-cli.js install`, `update`, or `uninstall` commands.

## CraftRoster Install And Update

Use the repository-native installer from a reviewed checkout. The same command installs a missing Skill, updates an owned Skill, or reports it unchanged.

Windows dry run and execution:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install.ps1 -Target codex -Type skill -Name <skill-name> -SourceDir . -DryRun
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install.ps1 -Target codex -Type skill -Name <skill-name> -SourceDir .
```

macOS or Linux dry run and execution:

```bash
bash scripts/install.sh --target codex --type skill --name <skill-name> --source-dir "$PWD" --dry-run
bash scripts/install.sh --target codex --type skill --name <skill-name> --source-dir "$PWD"
```

- Replace `codex` only with a target supported by the installer.
- Treat ownership mismatch, local content drift, duplicate roots, and changed destinations as blockers. Do not add `-Force` or `--force` unless the user explicitly authorizes replacing the exact inspected target.
- CraftRoster has no repository-native remove command. For a removal request, resolve the exact installation path and `.skill-meta.json`, verify CraftRoster ownership, explain that removal is unsupported, and request explicit deletion authority rather than routing the package through another manager.
- Use the platform's official Skill installer when the requested package belongs to that platform's curated catalog and the installer is available.

## Open Skills CLI Commands

Use the open Skills CLI only for packages it discovers or owns:

- `npx skills find <query>`: search.
- `npx skills add <owner/repo> --skill <skill-name> --agent codex`: install to the current project.
- `npx skills add <owner/repo> --skill <skill-name> --agent codex --global`: install globally only when explicitly requested.
- `npx skills use <owner/repo>@<skill-name>`: generate a prompt or use a Skill without installing it.
- `npx skills list`: list installed Skills.
- `npx skills update [skill-name]`: update packages owned by this CLI.
- `npx skills remove [skill-name]`: remove packages owned by this CLI.
- `npx skills init [name]`: initialize a package template.

Run `npx skills <command> --help` when flags or installed CLI behavior may have changed. Browse `https://skills.sh/` only when current marketplace metadata materially affects the choice.

## Discovery Flow

1. Translate the user's need into 2 to 4 concise search terms.
2. Search the local catalog first when the user is working inside this repo.
3. Search the open ecosystem with `npx skills find <query>` when local skills do not cover the need.
4. Do not recommend a skill from search snippets alone; inspect enough metadata to confirm fit.
5. Present the skill name, source, purpose, install command, and any confidence caveats.
6. Install only when the user asked for installation, with project scope by default and global scope only when explicit.

## Candidate Quality Checks

Before recommending an external skill, check:

- Source reputation, such as official or well-known maintainers.
- Install count when available; prefer broadly used packages and be cautious with very low install counts.
- Repository health, including stars, recency, license, and obvious maintenance signals.
- Scope fit against the user's actual task.
- Whether the local catalog already has a narrower or safer equivalent.

If a package includes scripts, templates, broad permissions, mutable revisions, or unclear provenance, hand off to `skill-scan` and `skill-security-review` before installing.

## Completion Evidence

Record:

- exact command and exit status;
- source repository and pinned revision when external;
- target agent and project or global scope;
- installed path and owning metadata;
- installer action: install, update, unchanged, migrate-update, blocked, or unsupported;
- any verification gap, restart or reload requirement, and residual manual step.

## Rules

- Keep command choices explicit and minimal.
- Prefer existing catalog entries over new ones.
- Keep lookup actions read-only.
- Do not run global installs silently.
- Do not use one package manager to update or remove another manager's files.
- Do not pipe mutable remote content directly into a shell when a reviewed checkout or pinned artifact is available.
- Do not present marketplace popularity as proof of correctness.

## Handoff

- For catalog exploration, use `skill-explorer`.
- For package scanning, use `skill-scan`.
- For structure validation, use `skill-lint`.
- For marketplace gap decisions, use `skill-gap-analyzer`.
- For third-party risk checks, use `skill-security-review`.
- For package creation or redesign, use the platform Skill creator and `skill-creator-design`; do not use the management CLI as an authoring workflow.
