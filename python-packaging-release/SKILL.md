---
name: python-packaging-release
description: Python packaging and release engineering guide covering build backends, wheels, sdists, versioning, console scripts, publishing, and release workflows. Use when packaging a Python project for installation or distribution, choosing build metadata, or preparing a release to PyPI or another artifact target.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Python Packaging and Release

Use this skill when a Python project needs to be packaged, versioned, or released.

## When To Use

- Set up or revise `pyproject.toml` build and project metadata
- Build wheels, sdists, or installable artifacts
- Define console scripts and entry points
- Plan versioning, changelog, and release steps
- Prepare a package for PyPI or an internal artifact store

## Boundaries

- Use `python-development` for general architecture, typing, and style.
- Use `python-automation-scripting` for local CLI utilities or file automation.
- Use `repo-ready` for broad repository setup and release automation hygiene.

## Workflow

1. Identify the build backend and current packaging state.
2. Decide the distribution shape: library, CLI, or service package.
3. Make entry points and metadata explicit.
4. Build artifacts locally and inspect what ships.
5. Validate install, import, and console entry behavior.
6. Release with the smallest viable change and confirm the published artifact.

## Packaging Rules

- Keep `pyproject.toml` authoritative.
- Separate runtime and optional/dev dependencies.
- Make package name, import name, and distribution name easy to distinguish.
- Include only files that should ship.
- Avoid relying on implicit path tricks or editable-only behavior.

## Release Rules

- Bump versions deliberately and consistently.
- Treat versioning and release notes as part of the change, not an afterthought.
- Verify that the installed package exposes the expected entry points.
- Do not publish artifacts without inspecting the built outputs first.

## Handoff

- For general Python structure or style, hand off to `python-development`.
- For repo hygiene and release automation setup, hand off to `repo-ready`.
- For operational rollout checks, hand off to `deployment-operations`.

- See [reference/packaging-workflows.md](reference/packaging-workflows.md) for deeper guidance.
