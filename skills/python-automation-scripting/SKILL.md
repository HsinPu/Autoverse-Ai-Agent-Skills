---
name: python-automation-scripting
description: Python automation and scripting guide covering command-line tools, filesystem automation, subprocess orchestration, scheduling, and utility scripts. Use when building or refactoring scripts that automate local files, shell commands, batch jobs, or small operational workflows rather than data analysis or web scraping.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Python Automation and Scripting

Use this skill when the task is a practical script or CLI that automates repetitive work.

## When To Use

- Build local automation scripts and operational utilities
- Wrap shell commands or external tools from Python
- Traverse, rename, copy, move, or clean up files and directories
- Create CLI tools with `argparse`, `click`, or `typer`
- Schedule or batch recurring jobs

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
