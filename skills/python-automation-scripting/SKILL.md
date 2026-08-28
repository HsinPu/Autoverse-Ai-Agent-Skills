---
name: python-automation-scripting
description: Mandatory Python specialist for scripts and CLI automation involving files, subprocesses, batch or scheduled work, argparse, Click, or Typer. Read it with python-development whenever planning, building, modifying, or reviewing that work, including one-file utilities; exclude dataframe pipelines and scraping.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Python Automation and Scripting

Use this skill whenever the requested deliverable is a Python script or CLI that automates repetitive or operational work. A planning-only request and a small one-file utility still count; do not wait for an existing repository or supplied files.

## Python Baseline Gate

Before planning or editing a Python script or CLI, read the sibling [`../python-development/SKILL.md`](../python-development/SKILL.md), even when the runtime omitted it from the initial Skill list. Keep this skill responsible for CLI inputs, filesystem and subprocess side effects, dry-run behavior, and operational safety; keep `python-development` responsible for Python language, module, typing, error, and general implementation decisions.

## When To Use

- Build local automation scripts and operational utilities
- Wrap shell commands or external tools from Python
- Traverse, rename, copy, move, or clean up files and directories
- Create CLI tools with `argparse`, `click`, or `typer`
- Schedule or batch recurring jobs
- Plan or review any of the above before implementation exists

## Boundaries

- Use `python-development` for general architecture, packaging, typing, and style.
- Use `python-data-engineering` for dataframe or ETL-heavy workflows.
- Use `python-web-scraping` for HTML extraction and crawling.

## Workflow

1. Define the exact input, output, and side effects.
2. Prefer idempotent operations when possible.
3. Use `pathlib` for paths and `subprocess` for shell commands.
4. Fail fast with clear error messages.
5. Make dry-run and logging available for risky actions.
6. Keep the script small unless repeated behavior justifies a module.

## Command Rules

- Prefer explicit arguments over implicit globals.
- Capture stdout, stderr, and exit codes when calling external commands.
- Use timeouts for commands that can hang.
- Quote paths carefully and avoid shell injection risks.
- Treat destructive operations as opt-in.

## CLI Design

- Make help text concise and action oriented.
- Group commands by user task, not by implementation detail.
- Support `--dry-run` for file-changing commands.
- Return non-zero exit codes on failure.

## Handoff

- For general Python code structure or packaging, hand off to `python-development`.
- For tabular transforms or file-based datasets, hand off to `python-data-engineering`.
- For web extraction, hand off to `python-web-scraping`.

- See [reference/automation-workflows.md](reference/automation-workflows.md) for deeper guidance.
