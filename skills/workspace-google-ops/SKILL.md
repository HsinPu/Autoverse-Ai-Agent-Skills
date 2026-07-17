---
name: workspace-google-ops
description: Google Workspace workflow for Gmail, Calendar, Drive, Contacts, Sheets, and Docs via CLI. Use when an email, calendar, drive, contact, sheet, or document task needs command-line automation.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Workspace Google Ops

Use this skill when the task needs Google Workspace automation from the terminal.

## When To Use

- Search, send, draft, or reply to Gmail messages
- Create or update Calendar events
- Read, search, or move Drive files
- List contacts
- Read or update Sheets and Docs via CLI

## Workflow

1. Confirm authentication and account scope.
2. Identify the Workspace app involved.
3. Use the simplest command that performs the action.
4. Prefer non-interactive input for repeatable automation.
5. If the task is just document formatting, hand off to `word-document-ops` or `spreadsheet-ops`; if the target is Markdown, hand off to `document-to-markdown`.

## Rules

- Keep mail and calendar actions explicit.
- Treat Drive content and contacts as sensitive data.
- Use JSON payloads or stdin when the CLI supports them.

## Quality Gate

- The right Workspace app was used.
- Auth and scope are clear.
- The result is actionable and auditable.

## Handoff

- For document formatting, use `word-document-ops`.
- For Google Docs export or content conversion to Markdown, use `document-to-markdown`.
- For spreadsheet editing, use `spreadsheet-ops`.
