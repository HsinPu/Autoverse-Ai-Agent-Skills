---
name: skill-security-review
description: Security vetting workflow for evaluating third-party skills before install or use. Use when checking provenance, file contents, permissions, or suspicious patterns in a marketplace package or repo.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Skill Security Review

Use this skill to decide whether to trust an external skill package.

## When To Use

- A skill comes from a marketplace, GitHub repo, or pasted ZIP contents
- The package may run commands, download files, or read secrets
- You need a quick, defensible install decision

## Review Flow

1. Check provenance: author, stars, update recency, repo link, package size, and license.
2. Inspect the manifest and any bundled scripts, references, or templates.
3. Look for red flags: network exfiltration, credential access, hidden downloads, `eval`/`exec`, obfuscation, or privilege escalation.
4. Map permissions: files read, files written, commands run, and external hosts contacted.
5. Classify risk as low, medium, high, or extreme.

## Decision Rules

- Low: documentation-only or narrow read-only helpers.
- Medium: limited local writes or well-scoped scripts.
- High: broad file access, network access, or secret handling.
- Extreme: credential harvesting, opaque code, or hidden execution.

## Output

- State the risk level first.
- Call out the specific files or lines that drove the decision.
- Recommend install, install with caution, or do not install.

## Handoff

- For code-level review of ordinary repos, use `code-review`.
- For GitHub-hosted source inspection or metadata, use `github-operations`.
