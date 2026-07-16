---
name: skill-creator-design
description: Design and refine reusable cross-tool Skills by defining invocation, scope, workflow branches, completion evidence, no-op behavior, context budget, and package resources. Use when creating or materially redesigning a SKILL.md package, deciding whether to split or route overlapping skills, or improving trigger precision and task completion across Codex, Claude, Cursor, Copilot, and OpenCode.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
  reference-source: "mattpocock/skills"
  reference-license: "MIT"
  reference-revision: "e9fcdf95b402d360f90f1db8d776d5dd450f9234"
---

# Skill Creator Design

Create Skills that change agent behavior at the right time, finish with evidence, and stay small enough to load safely across tools.

## Scope

- Use `agent-creator-design` for a role or system prompt.
- Use `subagent-architecture` for agent delegation and ownership.
- Use `skill-gap-analyzer` before adding a capability that may already exist.
- Use this Skill for the package contract: invocation, instructions, resources, outputs, and validation.

## Design Contract

Define these four contracts before writing files:

1. **Capability**: the reusable outcome this Skill owns and the work it explicitly does not own.
2. **Invocation**: the observable requests, inputs, or states that should and should not select it.
3. **Completion**: the artifacts, checks, or decisions that prove the workflow is finished.
4. **Residue**: which files, notes, processes, credentials, or temporary artifacts may remain afterward.

If any contract is vague, gather concrete examples before implementation.

## Invocation Modes

Choose the least surprising mode that the target tools can express:

| Mode | Use when | Design consequence |
|---|---|---|
| Automatic | A request has distinctive signals and low selection cost | Make the description precise enough to separate nearby Skills |
| Explicit | The workflow is costly, interactive, destructive, or changes how the task is approached | Require a clear user request or tool-supported manual invocation |
| Routed | A parent workflow chooses among several specialized Skills | Keep routing criteria in the parent and execution details in the child |
| Paired | Two capabilities are often sequential but remain independently useful | State the handoff artifact and stop condition for each Skill |

Do not depend on one vendor-specific metadata flag unless the Skill is deliberately limited to that tool. Describe the portable behavior first, then document target-specific wiring only where needed.

## Authoring Workflow

1. **Collect examples**
   - Write at least two positive requests, one near-miss, and one request that should not trigger the Skill.
   - Identify the repeated difficulty that generic agent behavior does not solve reliably.
2. **Audit overlap**
   - Compare nearby Skill descriptions and workflows, not only names.
   - Choose upgrade, add, merge, route, or no action.
3. **Define ownership**
   - State the input authority, owned decisions, external actions, output artifact, and handoff boundary.
4. **Choose the invocation mode**
   - Decide automatic, explicit, routed, or paired behavior.
   - Put selection signals in frontmatter because the body is unavailable before invocation.
5. **Design the workflow**
   - Use ordered steps for required sequence and branches for materially different cases.
   - Give every step a completion test; avoid instructions that cannot change an action or decision.
6. **Allocate resources**
   - Keep core procedure in `SKILL.md`.
   - Move detailed knowledge to `references/`, deterministic repeated work to `scripts/`, and output materials to `assets/`.
7. **Define failure and no-op behavior**
   - State what happens when inputs are missing, the capability is unavailable, no change is needed, or authority is insufficient.
8. **Test and reduce**
   - Run positive, negative, boundary, missing-tool, stale-context, and recovery cases.
   - Remove duplicated or inert guidance after behavior is proven.

## Trigger Design

Write frontmatter in English so heterogeneous tools can match it consistently.

For `description`:

- Start with the capability, then state when to use it.
- Include distinctive task nouns, verbs, inputs, outputs, or failure states.
- Name an important exclusion when a nearby Skill would otherwise collide.
- Avoid generic phrases such as "help with code" or long keyword inventories with no ownership boundary.
- Do not repeat trigger rules only in the body; the body loads too late to influence selection.

Use a small trigger table during design:

| Request | Expected selection | Reason |
|---|---|---|
| Clear positive example | This Skill | Distinct capability and owned output |
| Ambiguous near-match | Router, question, or narrower Skill | Selection evidence is incomplete |
| Negative example | Different Skill or no Skill | Outside the ownership boundary |

## Instruction Quality

- Prefer an instruction that changes a decision, tool call, artifact, or verification step.
- Replace unsupported prohibitions with the safe action to take and the reason for the boundary.
- Keep one source of truth for every rule; link instead of restating details.
- Separate required sequence from optional techniques.
- Make branches exhaustive when omitted cases could cause an unsafe or incomplete result.
- Do not encode facts that can be cheaply discovered from the current repository or environment.
- Avoid creating a new file merely to make the workflow appear productive.

Treat a valid no-op as a real result. If inspection proves the requested state already exists, record the evidence and stop without manufacturing changes.

## Completion Contract

For each workflow, define:

- required outputs and their owner;
- acceptance evidence and the command or observation that produces it;
- unresolved states that block completion;
- cleanup of temporary files, processes, branches, credentials, or generated examples;
- the exact handoff artifact when another Skill continues the work.

Do not use subjective completion phrases such as "looks good" when a concrete check exists. Do not claim completion from an artifact alone when the artifact must also be executable, validated, or approved.

## Progressive Disclosure

Keep `SKILL.md` as the routing and execution surface. Use one-level references and say when each reference should be opened.

| Resource | Include when | Avoid when |
|---|---|---|
| `references/` | The agent needs schemas, policies, variants, examples, or detailed decision rules | The same rule already lives in the main workflow |
| `scripts/` | Repeated work must be deterministic, testable, or token-expensive to recreate | A short command or context-dependent judgment is enough |
| `assets/` | The final output reuses a template, media file, boilerplate, or style resource | The file exists only to document how the Skill was created |

Link every bundled resource directly from `SKILL.md`. Give long references a contents section and searchable headings. Do not create package-level README, changelog, or installation documents unless they are execution inputs rather than project documentation.

## Validation Matrix

Before release, verify:

- **Selection**: clear positives trigger; negatives and near-misses do not collide.
- **Execution**: every required branch reaches a defined result.
- **Evidence**: completion claims point to current proof.
- **No-op**: an already-satisfied request exits cleanly.
- **Failure**: missing inputs, tools, permissions, and network access produce bounded next steps.
- **Residue**: temporary artifacts and external side effects match the declared contract.
- **Context**: removing a paragraph does not reduce required behavior; if it does not, remove it.
- **Portability**: tool-specific assumptions are explicit and do not masquerade as universal behavior.

## Output

When proposing or revising a Skill, return:

- decision: add, upgrade, merge, route, or no action;
- positive and negative trigger examples;
- capability, invocation, completion, and residue contracts;
- package files and why each is needed;
- validation cases and remaining risks.

## Handoff

- Use `skill-lint` for deterministic metadata, naming, structure, and link checks.
- Use `skill-executor` for controlled script execution and representative task proof.
- Use `skill-audit` for semantic quality, provenance, safety, and maintenance review.
- Use `skillforge` for versioned evaluation and release certification.
- Use `skillctl` only after the package is ready to install, update, or publish.
