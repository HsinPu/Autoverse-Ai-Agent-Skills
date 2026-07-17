# Matt Pocock Skill Adaptation Ledger

This ledger records how selected concepts from `mattpocock/skills` were studied and independently redesigned for CraftRoster.

## Pinned Source

- Repository: [mattpocock/skills](https://github.com/mattpocock/skills)
- Revision: [`e9fcdf95b402d360f90f1db8d776d5dd450f9234`](https://github.com/mattpocock/skills/commit/e9fcdf95b402d360f90f1db8d776d5dd450f9234)
- Manifest: [plugin.json at the pinned revision](https://github.com/mattpocock/skills/blob/e9fcdf95b402d360f90f1db8d776d5dd450f9234/.claude-plugin/plugin.json)
- Reference license: [MIT](https://github.com/mattpocock/skills/blob/e9fcdf95b402d360f90f1db8d776d5dd450f9234/LICENSE)
- Reviewed on: 2026-07-15

The canonical CraftRoster packages keep `source: HsinPu/CraftRoster`, `author: HsinPu` in the catalog, and `license: Apache-2.0`. The upstream repository is recorded separately as a pinned reference and does not replace canonical authorship.

## Adaptation Map

| Upstream concept | CraftRoster result | Decision |
|---|---|---|
| `writing-great-skills` | `skill-creator-design`, `skill-audit` | Strengthened invocation, completion, no-op, residue, overlap, and context checks instead of adding a duplicate authoring Skill |
| `ask-matt` | `skill-explorer` | Converted local discovery into a bounded `use now → then → stop` route with an explicit no-Skill result |
| `domain-modeling` | `domain-modeling` | Added a language- and tool-neutral model that follows existing repository documentation conventions |
| `grilling`, `grill-with-docs` | `requirements-deep-dive` | Combined conversation and repository-grounded modes into one decision interview to avoid duplicate triggers |
| `handoff` | `session-handoff` | Added create and resume paths, repository freshness checks, secret removal, and convention-aware storage |
| `wayfinder` | `multi-session-planning` | Reframed long-horizon planning around decision and work nodes, executable sets, ownership, checkpoints, and honest unknowns |
| `to-tickets` | `spec-flow` | Upgraded the existing flow with stable IDs, real prerequisites, vertical slices, evidence, and expand-migrate-contract guidance |
| `prototype` | `throwaway-prototyping` | Added a disposable, question-shaped experiment with isolation, side-effect controls, production boundaries, and disposition |
| `diagnosing-bugs` | No new Skill | Existing `systematic-debugging` already covers reproduction, competing hypotheses, discriminating experiments, causal proof, regression tests, and remediation handoff |

## Independent Redesign Boundaries

The adaptation intentionally does not copy upstream prose, templates, bespoke heading sequences, slash-command names, fixed filenames, tracker labels, OS-specific handoff paths, or Claude-only invocation metadata. The generic capability name and heading `domain-modeling`／`Domain Modeling` are retained because they describe an established software-design practice rather than upstream branding.

CraftRoster changes include:

- self-describing names such as `requirements-deep-dive` and `multi-session-planning`;
- cross-tool behavior for Codex, Claude, Cursor, Copilot, OpenCode, and project-local installs;
- explicit capability, invocation, completion, no-op, evidence, cleanup, and residue contracts;
- repository-aware modes that follow local instructions and documentation layout;
- conservative authorization boundaries for external actions, cleanup, issue creation, and production effects;
- catalog-level pinned revision checks so `SKILL.md` and `skills.json` cannot silently disagree.

## Upstream Pages Reviewed

- [writing-great-skills](https://github.com/mattpocock/skills/blob/e9fcdf95b402d360f90f1db8d776d5dd450f9234/skills/productivity/writing-great-skills/SKILL.md)
- [ask-matt](https://github.com/mattpocock/skills/blob/e9fcdf95b402d360f90f1db8d776d5dd450f9234/skills/engineering/ask-matt/SKILL.md)
- [domain-modeling](https://github.com/mattpocock/skills/blob/e9fcdf95b402d360f90f1db8d776d5dd450f9234/skills/engineering/domain-modeling/SKILL.md)
- [grilling](https://github.com/mattpocock/skills/blob/e9fcdf95b402d360f90f1db8d776d5dd450f9234/skills/productivity/grilling/SKILL.md)
- [grill-with-docs](https://github.com/mattpocock/skills/blob/e9fcdf95b402d360f90f1db8d776d5dd450f9234/skills/engineering/grill-with-docs/SKILL.md)
- [handoff](https://github.com/mattpocock/skills/blob/e9fcdf95b402d360f90f1db8d776d5dd450f9234/skills/productivity/handoff/SKILL.md)
- [wayfinder](https://github.com/mattpocock/skills/blob/e9fcdf95b402d360f90f1db8d776d5dd450f9234/skills/engineering/wayfinder/SKILL.md)
- [to-tickets](https://github.com/mattpocock/skills/blob/e9fcdf95b402d360f90f1db8d776d5dd450f9234/skills/engineering/to-tickets/SKILL.md)
- [diagnosing-bugs](https://github.com/mattpocock/skills/blob/e9fcdf95b402d360f90f1db8d776d5dd450f9234/skills/engineering/diagnosing-bugs/SKILL.md)
- [prototype](https://github.com/mattpocock/skills/blob/e9fcdf95b402d360f90f1db8d776d5dd450f9234/skills/engineering/prototype/SKILL.md)
