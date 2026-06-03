---
name: github-inline-review
description: GitHub inline PR review workflow for submitting line-level comments and suggestion blocks through the gh CLI and GitHub API. Use when posting review findings to an existing GitHub pull request, batching inline comments, adding GitHub suggestion blocks, approving, commenting, or requesting changes from review output.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# GitHub Inline Review

Use this skill after review findings already exist and need to be posted to a GitHub PR. Use `github-code-review` to analyze a PR first and `github-operations` for broader issue/PR work.

## Preconditions

- Confirm `gh` is installed and authenticated.
- Confirm the repository, PR number, and target branch are correct.
- Confirm the PR is open and the line numbers refer to the current PR diff.
- Do not submit comments without user intent to post them publicly.

## Workflow

1. Collect findings with path, line number, severity, comment body, and optional suggested replacement.
2. Read current file content before creating any suggestion block.
3. Group related findings into one review instead of posting separate noisy comments.
4. Choose review event:
   - `COMMENT` for neutral feedback.
   - `REQUEST_CHANGES` for blocking issues.
   - `APPROVE` only when the user explicitly wants approval and there are no blocking findings.
5. Build a JSON review payload and submit through `gh api`.
6. Return the review URL, comment count, suggestion count, and event type.

## Review Payload Shape

Use a temp JSON file and submit it with `gh api`:

```json
{
  "body": "Overall review summary",
  "event": "COMMENT",
  "comments": [
    {
      "path": "src/example.ts",
      "line": 42,
      "body": "Review comment body"
    }
  ]
}
```

Command shape:

```powershell
gh api -X POST "repos/{owner}/{repo}/pulls/{pr_number}/reviews" --input "<payload-path>"
```

## Suggestion Blocks

- Use suggestions only for small, exact replacements the reviewer can safely apply.
- Match existing formatting and include only the replacement lines.
- Do not use suggestions for multi-file refactors, behavior decisions, migrations, or changes needing tests before acceptance.

````markdown
This branch misses the null case.

```suggestion
if (!value) return fallback
```
````

## Comment Quality

- Start with impact, then evidence, then fix.
- Keep inline comments focused on the selected line.
- Avoid repeating the same issue on many lines; comment once and summarize the pattern.
- Prefer actionable wording over broad criticism.

## Error Handling

- `401`: run or ask for `gh auth login`.
- `404`: verify repo, PR number, and access.
- `422`: validate JSON shape and whether line numbers are in the PR diff.
- Invalid suggestion: re-read current content and ensure the suggestion block matches exact replacement lines.
