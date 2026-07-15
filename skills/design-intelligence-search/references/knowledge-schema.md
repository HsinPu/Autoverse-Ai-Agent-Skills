# Design Knowledge Schema

The bundled `design-knowledge.json` is an original, deliberately small, auditable seed dataset. Extend it through review instead of importing opaque recommendation corpora.

## Record Shape

| Field | Meaning |
| --- | --- |
| `id` | Stable lowercase kebab-case identifier |
| `domain` | Primary retrieval domain |
| `evidenceLevel` | `heuristic`, `standard-backed`, or `research-backed` |
| `title` | Concise candidate pattern or rule |
| `summary` | What the pattern is intended to accomplish |
| `signals` | Product evidence that supports considering the record |
| `avoidWhen` | Evidence that makes the record risky or irrelevant |
| `evidence` | Questions or checks required before adoption |
| `tags` | Searchable concepts and synonyms |
| `keywords` | Additional terminology, including multilingual aliases where useful |
| `stacks` | Optional implementation contexts; `agnostic` means no stack dependency |
| `sources` | Public standards or documentation that support factual claims |

## Domain Vocabulary

- `product-pattern`
- `style-direction`
- `color`
- `typography`
- `layout`
- `interaction`
- `accessibility`
- `data-visualization`
- `content`

Add a new domain only when multiple records need a distinct retrieval boundary.

## Authoring Rules

- Write one actionable idea per record.
- Describe observable signals and counter-signals; avoid universal aesthetic commands.
- Keep taste suggestions separate from normative accessibility requirements.
- Link factual claims to primary standards or official documentation.
- Mark an original pattern without external support as `heuristic`; never present its search score as research evidence.
- Add Chinese or other aliases only as retrieval terms, not as unreviewed translations of requirements.
- Increment the dataset revision for semantic changes.
- Keep stable IDs when wording changes; create a new ID when the decision boundary changes.

## Search Semantics

The script uses deterministic weighted lexical matching. Title, tags, and keywords carry more weight than broad summaries. CJK runs are expanded into bounded n-grams so natural Chinese sentences can match known phrases. `avoidWhen` matches subtract from the score and are emitted separately as counter-signals; an item cannot rank from a counter-signal alone. Domain and stack filters are hard filters. Scores rank candidates only inside this seed dataset; they are not quality or confidence scores.

Machine-readable output includes SHA-256 values for both the dataset and search script. Preserve those hashes with downstream decisions so a stale manual revision cannot masquerade as identical evidence.

An empty result is valid. It means the local dataset has no lexical match under the supplied filters, not that no suitable design pattern exists.
