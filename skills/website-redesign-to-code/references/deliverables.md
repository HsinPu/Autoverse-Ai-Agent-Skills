# Website Redesign-to-Code Deliverables

Use these templates when a full-site redesign needs a durable handoff, multiple implementation slices, or auditable approval. Adapt them to repository conventions rather than creating duplicate documentation systems.

## Redesign Program Ledger

```markdown
# Redesign program ledger

- Scope version:
- Active design version:
- Current gate:
- Gate authority/evidence:
- Canonical route denominator:
- Source-authority manifest version:
- Design-intelligence receipt revision:
- Token/DTCG and drift receipt revision:
- Machine-gate matrix status:
- Completed and approved page families:
- Current bounded slice:
- Last verified evidence:
- Rollback point/status:
- Next eligible slice:
- Open decisions and blockers:
- Last updated/owner:
```

Update this ledger only after verified evidence or an explicit decision. It records status but never promotes a design, pilot, or rollout gate by itself.

## Site Audit and Page-Family Matrix

```markdown
# Site redesign audit

- Redesign mode: visual | product
- Framework/build/styling:
- Routing and layouts:
- CMS/data/API:
- Auth/roles/permissions:
- Analytics/consent/third parties:
- Supported viewports/browsers/locales/themes:
- Current design-system owner:
- Runtime crawl coverage:
- Canonical route/URL count:
- Reconciliation sources and result:
- Known access gaps:

| Concrete URL or route pattern | Page family | Source authority/artifact revision | Layout | Data source | Auth/role | Critical states | SEO contract | Risk | Representative route |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

- Manifest completeness: complete | blocked | accepted exclusions
- Original denominator:
- Accounted-for entries:
```

## Preservation and Migration Contract

```markdown
# Preservation contract

## Invariants
- URLs, slugs, query parameters, and deep links:
- Navigation hierarchy, labels, ordering, taxonomy, breadcrumbs, and footer links:
- Metadata, canonicals, robots, structured data, and sitemap:
- Content identity and headings:
- API, form, auth, role, and permission behavior:
- Analytics events and payloads:
- Consent, cookies, local storage, and third parties:
- Critical journeys and failure behavior:
- Commerce and external side-effect controls:

## Approved migrations
| Current contract | New contract | Redirect/event/data mapping | Validation | Rollback |
| --- | --- | --- | --- | --- |

## Scope approval
- Status:
- Approval evidence:
- Representative routes/states:
- Out of scope:
- Blocking gaps or accepted exclusions:
```

## Design-System and Page-Family Contract

```markdown
# Approved site design contract

## Foundations
- Canonical token source/revision:
- DTCG compatibility/version:
- Extraction sources and representative route/state/viewport matrix:
- Observed versus approved values:
- Dry-run drift: add | change | rename | alias | deprecate | delete
- Destructive migration approval and rollback:
- Base and semantic colors:
- Typography:
- Spacing/grid:
- Radius/shadow:
- Breakpoints:
- Motion/reduced motion:

## Components
| Component | Owner | Variants | Required states | Migration source |
| --- | --- | --- | --- | --- |

## Component reuse map
| Responsibility | Existing owner | Decision: reuse/extend/compose/replace/new | Migration boundary | Confidence/evidence |
| --- | --- | --- | --- | --- |

## Data-binding map
| Surface | Source and contract | Read/write behavior | Loading/empty/error | Auth/permission | Mock/fallback and removal condition |
| --- | --- | --- | --- | --- | --- |

## Page families
| Family | Authority type and artifact revision | Figma/image evidence receipt | Shared shell | Unique components | Responsive rules | Critical states |
| --- | --- | --- | --- | --- | --- | --- |

## Design-intelligence receipt, when used
- Query and filters:
- Dataset revision and dataset/script SHA-256 values:
- Selected record IDs, evidence levels, and reasons:
- Rejected records and counter-signals:
- Product evidence that overrode a candidate:

## Approval
- Selected direction:
- Approved artifacts:
- Intentional deviations:
- Implementation slice order:
- Pass/fail thresholds:
- Machine-gate contract: mode, source/baseline IDs, matrix cells, environment, channels, thresholds
- Machine-gate policy: warn/error handling, baseline approver, retention, cache, and network egress
- Readiness decision:
```

## Rollout and Validation Matrix

```markdown
# Redesign rollout

| Slice | File/component owner | Page families | Preconditions | Exit criteria/checks | Rollback point | Status |
| --- | --- | --- | --- | --- | --- | --- |

# Cross-site validation

| Route/family | Viewport | State/journey | Functional | Visual verdict | Machine contract/result ID | Next action | Baseline action | Accessibility | SEO | Runtime/performance | Evidence/unverified |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

- Canonical normalized results: result ID/path -> mode, matrixCell, referenceId, baselineId, issues, artifacts, unverified
- Machine-gate provider/version/command:
- Required channels, thresholds, and warning policy:
- Baseline owner and candidate approvals:
- Artifact retention, redaction, cache, and network-egress result:
- Unverified routes/integrations:
- Accepted deviations:
- Legacy paths safe to remove:
- Canonical route/URL manifest result:
- Pilot acceptance evidence:
- Release decision: pass | pass with accepted deviations | blocked
```
