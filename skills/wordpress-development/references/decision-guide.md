# WordPress Change Decision Guide

Use this reference after read-only discovery. Prefer the narrowest supported surface that owns the behavior and can be upgraded or rolled back independently.

## Change Surface

| Need | Preferred surface | Verify before choosing | Avoid |
| --- | --- | --- | --- |
| Layout, templates, styling, or site-wide design tokens | Existing theme, child theme, or block theme with `theme.json` | Active theme type, parent update path, saved templates, editor customizations | Editing WordPress core or a vendor theme directly |
| Reusable business behavior, content types, integrations, or scheduled work | Plugin | Ownership, activation lifecycle, uninstall behavior, compatibility, data retention | Putting portable behavior in a theme |
| Host-enforced policy or bootstrap behavior | Must-use plugin | Hosting ownership, load order, recovery access, multisite scope | Assuming normal activation or deactivation hooks run |
| Editor block | `block.json`-registered block in a plugin or owned theme | Existing serialized markup, attributes, dynamic versus saved rendering, deprecations | Breaking stored block markup without a migration |
| Extend core or another extension | Documented action or filter | Hook timing, callback contract, priority, third-party support policy | Patching upstream files or depending on undocumented internals |
| External application or headless consumer | REST route or existing REST resource | Schema, authentication, capability checks, visibility, pagination, errors, versioning | Treating a nonce or hidden route as authorization |
| Repeatable maintenance or migration | WP-CLI command or repository-owned script | Environment target, multisite scope, dry-run support, logs, idempotency | One-off production console edits with no evidence |
| Data query or mutation | WordPress APIs first; direct database access only with justification | Table ownership, prefixes, multisite, serialization, transactions, cache invalidation | Raw interpolation, blind global replacement, undocumented tables |

Official foundations: [Theme Handbook](https://developer.wordpress.org/themes/), [Block Editor Handbook](https://developer.wordpress.org/block-editor/), [Plugin Hooks](https://developer.wordpress.org/plugins/hooks/), [REST API Handbook](https://developer.wordpress.org/rest-api/), and [WP-CLI command reference](https://developer.wordpress.org/cli/commands/).

## Read-Only Inventory

Capture only what the access level and hosting policy permit:

- Environment identity, URL, WordPress and PHP versions, multisite state, database engine, web server, cache layers, and deployment owner.
- Active and inactive themes, plugins, must-use plugins, drop-ins, update state, custom code, repository revision, and build pipeline.
- Content types, statuses, taxonomies, authors, roles, capabilities, revisions, media, menus, widgets, templates, patterns, shortcodes, and localization.
- REST routes, webhooks, scheduled events, mail, search, forms, commerce, authentication, analytics, SEO, redirects, CDN, object cache, and external services.
- Representative URLs and editor journeys for anonymous visitors, authenticated readers, authors, editors, and administrators.

Useful queries may include `wp core version`, `wp theme list`, `wp plugin list`, `wp post-type list`, `wp taxonomy list`, `wp cron event list`, and `wp db check`. Confirm the target first and review command help for the installed WP-CLI version. Do not emit configuration values that can contain credentials or salts.

## Preservation Ledger

Record the invariant, baseline evidence, allowed change, validation method, and recovery action for each affected surface:

| Surface | Preserve by default |
| --- | --- |
| Identity | Home and site URLs, canonical host, permalink form, slugs, IDs, redirects |
| Content | Body, excerpts, status, publication date, author, revisions, taxonomy, comments |
| Media | Attachment IDs and URLs, files, sizes, alt text, captions, parent relationships |
| Discovery | Titles, descriptions, canonicals, robots directives, sitemaps, structured data, feeds |
| Editing | Roles, capabilities, block markup, templates, custom fields, preview, autosave |
| Behavior | Forms, accounts, checkout, search, email, webhooks, scheduled tasks, integrations |
| Measurement | Analytics identifiers, consent state, campaign parameters, monitoring |

When the task intentionally changes an invariant, document the exact mapping and obtain approval before applying it.

## Migration and Update Gate

Before a consequential update or migration, require:

1. A named source and destination environment with current revision and version inventories.
2. A matched backup set containing the database and required WordPress files, plus retained access to the previous release artifact.
3. Restore instructions and evidence from an isolated restore or an equivalent recovery rehearsal.
4. A dry run, preview, or production-like rehearsal with representative content volume and edge cases.
5. Idempotent steps, checkpoints, expected counts or hashes, and explicit handling for partial failure.
6. A URL and serialized-data strategy. For URL changes, prefer WordPress-aware tooling such as the documented [`wp search-replace`](https://developer.wordpress.org/cli/commands/search-replace/) workflow, inspect its installed-version options, and run a scoped dry run before an approved mutation.
7. Cache, scheduled-task, maintenance-mode, DNS or CDN, and integration sequencing when applicable.
8. Abort thresholds, rollback versus forward-repair criteria, responsible owner, and observation window.

WordPress documents backing up both database and files as parts of the site, and recommends backing up before a server move. Use the official [backup guidance](https://developer.wordpress.org/advanced-administration/security/backup/) and [migration guidance](https://developer.wordpress.org/advanced-administration/upgrade/migrating/) as the baseline, then add hosting-specific requirements.

## Security Review

- Authorize privileged actions with capability checks; a nonce helps protect request intent but does not replace authorization.
- Validate or reject input against its contract, sanitize where appropriate, use prepared database operations, and escape at the final output context.
- Keep secrets outside source, output, logs, fixtures, database exports, and migration artifacts. Redact evidence before sharing it.
- Use least privilege for users, automation, file access, database credentials, REST consumers, and deployment credentials.
- Keep core and maintained extensions current through an approved update path. Review compatibility and recovery before production updates.
- Protect administrative traffic with HTTPS and preserve host-level controls, logging, and monitoring.

Use the official [Common APIs security guidance](https://developer.wordpress.org/apis/security/) for code-level validation and escaping, and [Hardening WordPress](https://developer.wordpress.org/advanced-administration/security/hardening/) for operational controls. Confirm host-specific security changes with the hosting owner because server topology and managed controls differ.

## Performance Review

Measure before changing. Separate anonymous from authenticated traffic and cold from warm cache behavior. Compare response time, database queries, external calls, PHP errors, scheduled work, cache hit behavior, and resource use on representative routes. Treat caches as regenerable acceleration, not as authoritative storage, and verify invalidation after content or code changes. See WordPress's official [caching overview](https://developer.wordpress.org/advanced-administration/performance/cache/).

## Production Decision Record

Provide one compact release artifact containing:

- Outcome, environment, revision, owner, and approval scope.
- Preservation ledger and before/after evidence.
- Exact deployment or WP-CLI steps with secrets removed.
- Backup set, restore proof, rollback or repair decision, and abort thresholds.
- Test, accessibility, security, performance, and compatibility results.
- Maintenance, cache, scheduler, integration, monitoring, and observation plan.
- Remaining unknowns and actions that are explicitly not authorized.

If any target, backup, authorization, or recovery fact is missing, stop at the plan.
