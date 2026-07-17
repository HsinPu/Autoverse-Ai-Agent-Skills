---
name: flutter-development
description: Flutter development workflow covering Dart, widgets, layout, state management, navigation, forms, networking, platform integration, testing, performance, accessibility, build, and release. Use when building, reviewing, or debugging Flutter apps for iOS, Android, web, or desktop.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Flutter Development

Use this skill when building, reviewing, or debugging Flutter applications across mobile, web, or desktop targets.

## Core Scope

- Dart language patterns, widgets, layout, theming, and forms
- State management, app architecture, navigation, and dependency injection
- Networking, local storage, permissions, platform channels, and native integrations
- Unit, widget, golden, and integration testing
- Build, signing, release, performance, accessibility, and store readiness

## Workflow

1. Identify target platforms and Flutter/Dart SDK versions.
2. Inspect architecture, routing, state management, and package choices before changing code.
3. Keep UI widgets declarative and split app state from ephemeral widget state.
4. Validate platform-specific behavior on real devices or platform simulators.
5. Add tests at the narrowest level that proves the behavior.
6. Run format, analyze, tests, and platform builds before release-sensitive changes.

## Architecture Rules

- Keep widgets focused; move business logic into services, controllers, blocs, notifiers, or repositories.
- Keep platform-specific code isolated behind clear interfaces.
- Use keys and stable widget structure when tests or state preservation depend on identity.
- Model loading, error, empty, offline, and retry states explicitly.
- Treat navigation and deep links as part of the app contract.

## Testing Checks

- Use unit tests for pure Dart logic.
- Use widget tests for UI state, forms, validation, and interactions.
- Use integration tests for navigation, permissions, platform flows, and storage.
- Add golden tests only when visual regression matters and the project can maintain baselines.
- Test slow network, offline behavior, app lifecycle, and text scaling where relevant.

## Release Checks

- Confirm bundle ID/application ID, version, build number, signing, icons, splash, and permissions.
- Validate Android App Bundle and iOS archive behavior before store submission.
- Check crash reporting, analytics consent, privacy policy, and store metadata.
- Run performance checks for jank, memory, startup time, and large lists.

## Handoff

- Use `mobile-app-testing` for device test plans and automation.
- Use `app-store-release` for store submission and review readiness.
- Use `auth-integration` for login, OAuth redirects, and secure session handling.
- Use `database-design` or `supabase-development` for backend data modeling.

## References

- Flutter Docs: `https://docs.flutter.dev/`
- Flutter Architecture: `https://docs.flutter.dev/app-architecture/guide`
- Flutter Testing: `https://docs.flutter.dev/testing`
- Flutter Deployment: `https://docs.flutter.dev/deployment`
