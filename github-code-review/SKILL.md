---
name: github-code-review
description: GitHub pull request review workflow for analyzing diffs, comments, checks, and review context through gh. Use when reviewing a PR or GitHub change and the goal is to produce concrete findings, risks, and review guidance.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# GitHub Code Review

Use this skill to review a GitHub change with PR context.

## Workflow

1. Open the PR or change context and collect the diff, comments, and check status.
2. Review the change for correctness, security, performance, maintainability, and tests.
3. Focus on concrete issues, not general impressions.
4. Classify each finding by severity and explain the impact.
5. End with a clear review decision and the next action.

## Rules

- Use PR context, not only the raw diff, when it improves the review.
- Call out missing tests when new behavior or risk is introduced.
- Prefer file-and-line citations for every finding.
- Separate blocking issues from suggestions.

## Output

- Start with the review conclusion.
- List critical findings first.
- Include a short positive summary only after the findings.

## Handoff

- For deeper code-quality review outside GitHub context, use `code-review`.
- For PR creation or other GitHub operations, use `github-operations`.
