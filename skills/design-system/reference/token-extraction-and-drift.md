# Token Extraction and Drift Reference

Use this reference when converting source files, Figma variables, or an authorized running interface into a maintained token system.

## Authority Ledger

Record each source before normalizing values:

| Source | What it proves | What it does not prove |
| --- | --- | --- |
| canonical token files | maintained names, types, aliases, and intended values | that every runtime path consumes them correctly |
| generated platform files | build output for a specific revision | independent design authority |
| component source styles | declared implementation behavior | final computed value in every state |
| runtime DOM and computed styles | observed rendered values for sampled cells | intended semantics or unobserved states |
| approved design artifact | approved visual and component intent | current production behavior |
| product or brand contract | business and brand requirements | implementation details |

Resolve conflicts by scope and owner. Do not silently prefer newest, most convenient, or most visually attractive evidence.

## DTCG Token Contract

Prefer the stable DTCG 2025.10 shape:

```json
{
  "color": {
    "blue": {
      "600": {
        "$type": "color",
        "$value": {
          "colorSpace": "srgb",
          "components": [0.05, 0.32, 0.78],
          "alpha": 1
        },
        "$description": "Primitive blue used by approved semantic aliases"
      }
    }
  },
  "action": {
    "primary": {
      "$type": "color",
      "$value": "{color.blue.600}",
      "$description": "Primary interactive emphasis"
    }
  }
}
```

Use `$type`, `$value`, and aliases exactly as the chosen specification version defines them. Use optional `$description` for intent. Keep provenance, source selectors, owners, or tool hints in a documented `$extensions` namespace; never make those fields look portable when they are not.

Layer tokens as:

1. primitives for raw scales;
2. semantic tokens for product meaning;
3. component tokens only where a component contract cannot be expressed through semantics.

Validate missing aliases, alias cycles, incompatible types, duplicate semantics, and unsupported platform transforms before generation.

## Live Sampling Contract

Before browsing or rendering, define:

- authorized origins and routes;
- login and test-data policy;
- desktop, tablet, mobile, theme, locale, and state matrix;
- representative components and pseudo-states;
- dynamic regions to stabilize or exclude;
- privacy, cache, screenshot, and network-egress requirements.

Collect source custom properties and stylesheets when accessible, then sample computed styles and geometry for representative elements. Record selectors, route, state, viewport, timestamp, and confidence. A computed RGB value may be the resolved result of an alias, opacity, cascade, or overlay; do not promote it to a primitive automatically.

Do not evade authentication, access restrictions, robots or site policies, or anti-automation controls. Extract another organization's visual language only with authorization and without copying protected branding, trade dress, content, or assets.

## Normalization

1. Inventory declared and observed values without renaming.
2. Group exact duplicates and near-duplicates, but preserve semantic distinctions until an owner decides.
3. Map values to existing primitives and semantics where valid.
4. Propose new primitives only when repeated evidence cannot use the current scale.
5. Propose aliases before duplicating resolved values.
6. Label each proposal as add, change, rename, alias, deprecate, or delete.
7. Produce a dry-run and affected-consumer list before mutation.

Do not infer token names solely from CSS selectors or Figma layer names. Names should express durable product meaning.

## Drift Report

```text
source_revision: <commit, design revision, or capture>
canonical_revision: <token version>
matrix_coverage: <routes, states, themes, viewports>
changes:
  - kind: add | change | rename | alias | deprecate | delete
    token: <path>
    observed: <value and source>
    canonical: <value or missing>
    consumers: <files, components, or platforms>
    confidence: high | medium | low
    approval: proposed | accepted | rejected
unverified: <cells or sources>
```

Deletion and rename are destructive until consumer searches, generated outputs, migration aliases, rollback, and owner approval are complete.

## Cross-Platform Generation

Use one canonical token graph and deterministic transforms for CSS, JavaScript, iOS, Android, Flutter, or documentation. Tools such as Style Dictionary can implement transforms, but the repository must pin versions, validate outputs, and keep generated paths explicit.

Never edit generated platform artifacts as the only fix. Change the canonical source or the transform, regenerate, and verify representative consumers.

## Completion Gate

## Completion by Execution Posture

<!-- CRAFTROSTER_CONTRACT
{
  "id": "design-system.execution",
  "part": "completion",
  "version": 1,
  "type": "write-posture-completion",
  "section": "Completion by Execution Posture",
  "textParts": {
    "completion": {
      "section": "Completion by Execution Posture",
      "sha256": "8ed099c174631075fb799b14a36630cd81f347c6c49969d9a676f9e58f85049c"
    }
  },
  "completion": {
    "audit-dry-run": {
      "requiresDestructiveApproval": false,
      "requiresGeneratedOutputs": false,
      "requiresConsumerVerification": false
    },
    "apply-generate": {
      "requiresDestructiveApproval": true,
      "requiresGeneratedOutputs": true,
      "requiresConsumerVerification": true
    }
  }
}
-->

<!-- CRAFTROSTER_CONTRACT_TEXT_START design-system.execution#completion -->
An audit/dry-run receipt is complete when provenance is recorded, the sample matrix is explicit, observed and approved values remain distinguishable, the in-memory DTCG-compatible candidate graph validates, proposed add/change/rename/alias/deprecate/delete operations and destructive warnings are reported, unverified cells and remaining drift have owners, and the receipt revision and return owner are recorded. This posture does not require approval of destructive changes, generated files, or consumer migration.

Apply/generate work is complete only when the dry-run receipt is satisfied, destructive changes are explicitly approved, the canonical source or transform is updated, generated outputs are reproducible, representative consumers are verified, and remaining drift is assigned to an owner.
<!-- CRAFTROSTER_CONTRACT_TEXT_END design-system.execution#completion -->
