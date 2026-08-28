---
name: python-packaging-release
description: Package, install, version, build, and release Python projects using pyproject.toml, build backends, wheels, sdists, console scripts, PyPI, or internal artifact targets. Use when Python distribution metadata, installability, artifacts, publishing, or release verification is the primary concern; pair with python-development.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Python Packaging and Release

Use this skill when a Python project needs to be packaged, versioned, or released.

## Python Baseline Gate

Before changing Python packaging or release configuration, read the sibling [`../python-development/SKILL.md`](../python-development/SKILL.md), even when the runtime omitted it from the initial Skill list. Keep this skill responsible for build metadata, distribution artifacts, entry points, versioning, publishing, and installed-artifact proof; keep `python-development` responsible for package and import structure, supported runtimes, and implementation compatibility.

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
