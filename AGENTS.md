# AGENTS.md

## Repo Shape

- This repo is a catalog of agent skills plus lightweight installer/query tooling, not an app workspace or package monorepo.
- Each skill lives under `skills/<skill-name>/SKILL.md`; root-level skill folders are not allowed.
- `skills.json` is the CLI catalog. Update it whenever a skill is added, renamed, removed, or its trigger metadata changes.
- `autoverse-cli.js` is a local catalog query helper. The no-Node installers in `scripts/install.ps1` and `scripts/install.sh` are the install path.

## Commands

- There are no runtime dependencies, test runner, linter, or formatter configured.
- Use `npm run validate` to check `skills.json`, `skills/` folders, frontmatter consistency, and README skill count.
- Use `node autoverse-cli.js --help` to smoke-test CLI parsing.
- Use `node autoverse-cli.js list`, `node autoverse-cli.js search <keyword>`, and `node autoverse-cli.js info <skill-name>` for focused catalog checks.
- Avoid running real installer commands against user or project agent directories as validation; use `-DryRun` / `--dry-run` or temp `-InstallDir` / `--dir` smoke checks.

## CLI Gotchas

- Installer `Agent` is required; commands without `-Agent` / `--agent` should fail.
- `opencode` installs to `~/.config/opencode/skills`; `opencode-project` installs to `.opencode/skills`.
- `project`, `cursor`, `vscode`, `copilot`, and `opencode-project` are relative to the current working directory.

## Skill Authoring

- `SKILL.md` frontmatter uses English `name`, `description`, `source`, and `license`; `description` is the trigger surface agents rely on.
- Folder name under `skills/` and frontmatter `name` should match exactly.
- Existing first-party skills use `source: HsinPu/Autoverse-Ai-Agent-Skills` and `license: Apache-2.0`; preserve original source and license for adapted third-party skills.
- Keep `SKILL.md` lean; put optional detailed material inside the skill folder as bundled references/assets/scripts only when needed.

## Packaging

- `package.json` publishes `skills/`, installer scripts, `autoverse-cli.js`, `skills.json`, `README.md`, and `LICENSE`.

## Current Catalog Snapshot

- Last reviewed: 2026-05-29.
- `skills.json` currently lists 173 skills.
- Skill directories under `skills/` with `SKILL.md`: 173.
- Catalog-to-folder check: no missing catalog entries and no missing skill directories were found.
- Category counts: `development` 139, `productivity` 19, `browser-automation` 7, `cli-utilities` 3, `coding-agents-ides` 3, `communication` 1, `search-research` 1.
- Catalog validation passed with `npm run validate`.
- CLI smoke checks passed with `node autoverse-cli.js --help`, `node autoverse-cli.js list`, `node autoverse-cli.js search video`, and `node autoverse-cli.js info python-development`.

## Known Issues

- `skills/repo-ready/SKILL.md` currently has `license: MIT`; verify whether it is intended as a third-party/adapted exception or should be normalized to `Apache-2.0`.
- README and CLI Chinese text should be read as UTF-8; PowerShell's default output encoding may display mojibake if `-Encoding UTF8` is omitted.
