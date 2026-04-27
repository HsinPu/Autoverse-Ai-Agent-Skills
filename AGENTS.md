# AGENTS.md

## Repo Shape

- This repo is a flat catalog of agent skills plus one Node CLI, not an app workspace or package monorepo.
- Each skill lives at the repo root as `<skill-name>/SKILL.md`; there is no central `skills/` directory in this repo.
- `skills.json` is the CLI catalog. Update it whenever a skill is added, renamed, removed, or its trigger metadata changes.
- `autoverse-cli.js` is the executable source of truth for supported commands and install paths.

## Commands

- There are no `package.json` scripts, dependencies, test runner, linter, formatter, or CI workflow configured.
- Use `node autoverse-cli.js --help` to smoke-test CLI parsing.
- Use `node autoverse-cli.js list`, `node autoverse-cli.js search <keyword>`, and `node autoverse-cli.js info <skill-name>` for focused catalog checks.
- Avoid running `install`, `update`, or `uninstall` as validation unless the task is specifically about installation; those commands clone GitHub repos and write into user or project agent directories.

## CLI Gotchas

- Default agent is `claude`, so commands without `--agent` target `~/.claude/skills`.
- `--agent opencode` installs to `~/.config/opencode/skills`.
- `--agent project` installs to `.skills` under the current working directory.
- The README mentions OpenCode project placement under `.opencode/skills`, but the current CLI does not implement that path; trust `autoverse-cli.js` for behavior.

## Skill Authoring

- `SKILL.md` frontmatter uses English `name`, `description`, `source`, and `license`; `description` is the trigger surface agents rely on.
- Folder name and frontmatter `name` should match exactly.
- Existing skills use `source: HsinPu/Autoverse-Ai-Agent-Skills` and `license: Apache-2.0`.
- Keep `SKILL.md` lean; put optional detailed material inside the skill folder as bundled references/assets/scripts only when needed.

## Packaging

- `package.json` publishes only `autoverse-cli.js`, `skills.json`, `README.md`, and `LICENSE`; the CLI installs skills by cloning the GitHub repo named in `skills.json`, not from bundled npm skill directories.
