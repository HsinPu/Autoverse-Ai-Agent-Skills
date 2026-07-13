# Screen Readers And WCAG Testing

## Contents

- Test matrix
- Keyboard journey
- Screen-reader essentials
- Dynamic components
- Severity

## Test Matrix

Prioritize combinations the product officially supports:

- macOS and iOS: Safari with VoiceOver
- Windows: Chrome or Edge with NVDA; JAWS where enterprise support requires it
- Android: Chrome with TalkBack
- Native mobile: platform screen reader and accessibility inspector

Record versions. Do not generalize one combination to every browser and assistive technology.

## Keyboard Journey

Test skip links, landmarks, menus, dialogs, forms, validation, tables, tabs, disclosure, search, destructive actions, and recovery. Confirm logical order, visible focus, no traps, expected shortcuts, focus restoration, and no pointer-only action.

## Screen-Reader Essentials

- Navigate by landmarks and headings to verify page organization.
- Navigate by links, buttons, form controls, tables, and regions.
- Confirm accessible name, role, value, state, description, and grouping.
- Switch between browse and focus modes where applicable.
- Verify live announcements are timely, concise, and not repeated.
- Confirm disabled, expanded, selected, required, invalid, and busy states.

## Dynamic Components

- Dialog: announce title and role, move focus inside, contain it, close predictably, restore focus.
- Tabs: expose tab, tablist, tabpanel, selection, arrow-key behavior, and associated panel.
- Combobox: announce label, expanded state, options, active option, selection, and no-results state.
- Validation: associate errors with controls, announce summary and inline details, retain entered data.
- SPA navigation: update title or main heading and move focus intentionally.

## Severity

- Critical: blocks a critical journey for an affected user group with no workaround.
- High: major operation is unavailable or unsafe through required assistive technology.
- Medium: meaningful friction, ambiguity, or repeated navigation burden.
- Low: limited inconsistency that does not block understanding or operation.

Tie severity to user impact, frequency, affected journey, and available workaround rather than WCAG criterion alone.
