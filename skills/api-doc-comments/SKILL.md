---
name: api-doc-comments
description: Documentation-comment workflow for writing concise docstrings, Javadoc, TSDoc, and similar API comments for exported functions, classes, modules, and methods. Use when documenting public code contracts, parameters, return values, exceptions, side effects, invariants, or examples; do not use for README docs or language syntax rules.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# API Doc Comments

Use this skill when the task is to write or revise documentation comments for public or exported code.

## Workflow

1. Identify the public surface that callers depend on.
2. Capture the contract: purpose, parameters, return values, exceptions, side effects, and invariants.
3. Add examples only when they prevent misuse or ambiguity.
4. Remove comments that merely restate obvious code.
5. Update comments whenever behavior changes.

## Rules

- Document what callers need, not what the code literally does.
- Prefer comments only on public, exported, or non-obvious code.
- Keep one stable comment block per symbol.
- Keep wording synchronized with the implementation.
- Use language-specific skills for syntax and formatting details.
- Do not use this for README files, ADRs, or user-facing docs.

## Handoff

- For Python docstring syntax, use `python-development`.
- For Java Javadoc syntax, use `java-development`.
- For general code standards, use `coding-standards`.
- For API contract shape, use `api-contract-design`.
