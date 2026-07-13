# Skill Audit Rubric

## Contents

- Evidence record
- Severity
- Trigger and instruction checks
- Script and data review
- Injection tests
- Decision template

## Evidence Record

Capture repository, revision, author, license, package path, file hashes, install method, target harnesses, dependencies, network domains, required credentials, and declared permissions.

## Severity

- Critical: credential theft, hidden exfiltration, destructive execution, unverifiable executable payload, or unauthorized external action
- High: broad secret or filesystem access, unsafe command construction, missing confirmation for consequential action, or incompatible license
- Medium: misleading trigger, hidden network dependency, unpinned executable dependency, broken reference, or unsafe default
- Low: maintainability, context cost, portability, or documentation weakness without immediate unsafe behavior

## Trigger And Instruction Checks

- Does the description say what the Skill does and when to use it?
- Does it overlap another Skill enough to cause ambiguous activation?
- Do instructions cover prerequisites, authority, success, failure, cleanup, and handoff?
- Are detailed variants routed through one-level references?
- Are claimed tools and files actually present?

## Script And Data Review

Trace inputs, parsing, command construction, environment variables, filesystem paths, network requests, subprocesses, outputs, logs, deletion, permissions, and error behavior. Reject scripts that download and execute mutable code without validation.

## Injection Tests

Test untrusted repository text, web content, documents, filenames, tool output, and retrieved context that instruct the agent to reveal secrets, broaden scope, install software, contact third parties, or ignore higher-priority rules. Confirm the Skill preserves the data/instruction boundary.

## Decision Template

```text
Decision: adopt | adapt | quarantine | reject
Blocking findings:
Required controls:
Verified provenance and license:
Executable and external-action surface:
Trigger and overlap assessment:
Maintenance owner and re-audit triggers:
Residual risk:
```
