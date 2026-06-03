---
name: jquery-4-migration
description: jQuery 4 migration guide for upgrading jQuery 3.x legacy frontends, WordPress themes/plugins, and hybrid web apps. Use when upgrading to jQuery 4, fixing removed API errors such as $.isArray, $.trim, $.parseJSON, $.type, $.now, handling focus/blur event-order changes, choosing slim versus full builds, replacing Deferred/AJAX patterns, or testing with jQuery Migrate.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# jQuery 4 Migration

Use this skill for jQuery 3.x to 4.x upgrades. If the project is still on jQuery 1.x or 2.x, use `jquery-version-migration` first to plan staged upgrades. Pair with `jquery-development` for day-to-day maintenance and `legacy-frontend-modernization` when the goal is reducing jQuery dependency rather than only upgrading it.

## Upgrade Workflow

1. Inventory jQuery version, plugins, WordPress/theme dependencies, slim/full build usage, and browser support.
2. Add jQuery Migrate in development or staging and collect console warnings before production rollout.
3. Replace removed APIs with native equivalents and run focused UI regression tests.
4. Test forms, focus/blur handlers, AJAX script loading, animations, and third-party plugins.
5. Roll out behind a safe release path and remove Migrate after warnings are fixed.

## Removed API Replacements

- `$.isArray(value)` -> `Array.isArray(value)`.
- `$.parseJSON(text)` -> `JSON.parse(text)`.
- `$.trim(value)` -> `String(value).trim()` with null handling when needed.
- `$.now()` -> `Date.now()`.
- `$.isFunction(value)` -> `typeof value === "function"`.
- `$.type(value)` -> explicit checks with `typeof`, `Array.isArray`, `value === null`, and `instanceof` where appropriate.
- `$.isNumeric(value)` -> project-specific numeric validation; do not blindly preserve loose legacy behavior.

## Behavior Changes To Test

- Focus and blur event order now follows browser standards more closely; test validation, autocomplete, and dropdown closing logic.
- `toggleClass(boolean)` style calls should become explicit `addClass`, `removeClass`, or `toggleClass(className, state)` calls.
- Scripts loaded with AJAX should explicitly use `dataType: "script"` or `$.getScript` when execution is intended.
- Slim builds do not include AJAX, effects, Deferreds, or Callbacks; use the full build if old code depends on them.

## Migration Tactics

- Prefer direct code changes over long-lived compatibility polyfills.
- Use temporary shims only to reduce rollout risk, and add a removal task with owner and deadline.
- Convert new async work to native `Promise`, `async`/`await`, `fetch`, and `AbortController` when browser support allows it.
- Keep jQuery Migrate out of the final production bundle unless there is a deliberate compatibility policy.

## WordPress Notes

- Do not replace WordPress admin jQuery unless explicitly required and tested.
- Test themes and plugins separately; plugin code often uses removed utilities.
- Respect WordPress enqueue order and dependency handles instead of adding duplicate global jQuery scripts.
- Keep `noConflict` behavior intact when existing plugins depend on it.

## Verification Checklist

- Removed API search completed.
- Migrate warnings triaged or fixed.
- Focus/blur dependent components tested.
- AJAX script loading tested.
- Slim/full build decision verified.
- WordPress or third-party plugin compatibility checked when applicable.
- Rollback path documented.
