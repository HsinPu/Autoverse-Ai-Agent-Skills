---
name: jquery-version-migration
description: jQuery version migration guide for auditing and upgrading projects across jQuery 1.x, 2.x, 3.x, and 4.x. Use when a legacy frontend may contain mixed jQuery versions, old plugins, deprecated APIs, IE-era compatibility, jQuery Migrate warnings, or when planning staged upgrades from 1 to 2, 2 to 3, 3 to 4, or directly toward a supported target version.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# jQuery Version Migration

Use this skill when the current jQuery version is unknown, very old, or mixed across pages/plugins. Use `jquery-4-migration` for the final 3.x -> 4.x jump and `legacy-frontend-modernization` when replacing jQuery with modern architecture is the real goal.

## Version Strategy

- Do not jump blindly from jQuery 1.x to 4.x in production.
- Prefer staged upgrades with jQuery Migrate and focused UI regression testing.
- Choose the target version based on browser support, plugin compatibility, and modernization timeline.
- Treat plugins as part of the migration surface; many failures come from old plugins, not app code.

## Version Bands

- **jQuery 1.x**: IE-era compatibility, old event APIs, old Deferred behavior, common `.live()` / `.bind()` / shorthand event usage.
- **jQuery 2.x**: drops older IE support but still carries many legacy patterns from 1.x.
- **jQuery 3.x**: safer default target for many legacy apps; removes several deprecated jqXHR callbacks and changes Deferred/ready/security behavior.
- **jQuery 4.x**: modern target; removes more utility APIs and requires stronger cleanup of legacy patterns.

## Upgrade Path

1. Detect active versions per page, bundle, and plugin.
2. Add the matching jQuery Migrate version in development/staging.
3. Fix warnings before moving to the next major version.
4. Upgrade plugins before or alongside core jQuery.
5. Test critical flows after each major jump.
6. Remove Migrate only after warnings are gone and smoke tests pass.

## 1.x / 2.x Cleanup Before 3.x

- Replace `.live()` and `.die()` with delegated `.on()` / `.off()`.
- Replace `.bind()`, `.unbind()`, `.delegate()`, and `.undelegate()` with `.on()` / `.off()`.
- Replace event shorthands like `.click(fn)`, `.submit(fn)`, `.change(fn)` with `.on("click", fn)` style handlers.
- Replace removed jqXHR callbacks: `.success()`, `.error()`, `.complete()` with `.done()`, `.fail()`, `.always()`.
- Audit `$(document).ready()` assumptions and plugin initialization order.
- Fix selectors or HTML parsing that depend on old browser quirks.

## 3.x Cleanup Before 4.x

- Replace `$.isArray`, `$.parseJSON`, `$.trim`, `$.now`, `$.type`, `$.isFunction`, and `$.isNumeric` with native or project-specific checks.
- Replace `toggleClass(boolean)` calls with explicit class names and state.
- Test focus, blur, focusin, and focusout ordering.
- If using slim build, verify no code depends on AJAX, effects, Deferreds, or Callbacks.
- Make AJAX script execution explicit with `dataType: "script"` or `$.getScript()`.

## Plugin Compatibility

- Inventory `$.fn.*` plugin usage and map each plugin to version, source, and owner.
- Check whether plugins pin old jQuery or use removed APIs.
- Replace abandoned plugins before upgrading core if they block the path.
- Avoid loading multiple jQuery versions unless there is a short-lived, documented bridge plan.
- If multiple versions are unavoidable, isolate with `jQuery.noConflict(true)` and clear DOM ownership boundaries.

## Browser Support Decisions

- If IE 8/9 support remains, jQuery 1.x may be pinned by policy; document that explicitly.
- If old IE support is gone, move away from 1.x and 2.x first, even before broader modernization.
- If modern evergreen browsers are the target, plan for jQuery 4 or progressive removal.

## Verification Checklist

- Active jQuery versions identified.
- Migrate warnings captured and triaged.
- Deprecated event APIs removed.
- jqXHR callback usage updated.
- Plugins inventoried and compatibility checked.
- Critical forms, modals, AJAX flows, validation, dropdowns, and third-party widgets tested.
- Target version and browser support documented.

## Handoff

- Use `jquery-development` for ongoing jQuery maintenance.
- Use `jquery-4-migration` for detailed jQuery 4 removed API and behavior checks.
- Use `frontend-stack-inference` when the frontend stack or script ownership is unclear.
