---
name: mobile-app-testing
description: Mobile app testing workflow covering iOS and Android device matrices, simulators, permissions, offline behavior, deep links, push notifications, purchases, crash reporting, accessibility, performance, TestFlight, internal testing, and automation with Maestro, Appium, Detox, or native test tools.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Mobile App Testing

Use this skill when planning, writing, or reviewing tests for iOS, Android, React Native, Expo, Flutter, or native mobile apps.

## Core Scope

- Device matrix planning, simulator/emulator use, and real-device verification
- Permissions, push notifications, deep links, offline behavior, storage, and app lifecycle
- Crash reporting, analytics, performance, accessibility, and release candidate testing
- Manual QA, smoke tests, regression tests, and automated UI tests
- Maestro, Appium, Detox, XCTest, Espresso, Flutter integration tests, and platform stores

## Workflow

1. Identify platforms, supported OS versions, device classes, and release channel.
2. Define the smallest useful device matrix for the risk.
3. Separate unit, component/widget, integration, and end-to-end concerns.
4. Test real device behavior for permissions, push, camera, biometrics, payments, and backgrounding.
5. Include negative paths: denied permissions, expired sessions, offline mode, slow network, and app kill/restart.
6. Automate high-value smoke paths and keep fragile visual/device-specific checks manual or quarantined.
7. Record build number, app version, backend environment, and test data for every release test.

## Device Matrix

- Include at least one small phone and one large phone layout.
- Test iOS and Android when platform code, permissions, navigation, or layout changes.
- Include older supported OS versions when using native APIs or permissions.
- Use real devices for camera, biometrics, push notifications, Bluetooth, NFC, and store purchases.
- Use emulators/simulators for fast regression loops, not final release confidence.

## Automation Guidance

- Use Maestro for cross-platform black-box flows when accessibility labels are stable.
- Use Detox for React Native projects that already support it and need deep app synchronization.
- Use Appium when broad cross-platform/device-farm support matters.
- Use XCTest/Espresso/Flutter integration tests when native or framework-level control is needed.
- Keep selectors semantic and accessibility-friendly.

## Release Smoke Checklist

- Fresh install, upgrade install, login/logout, onboarding, core transaction, offline/online recovery.
- Push/deep link entry, permission prompts, background/foreground, app kill/reopen.
- Crash-free startup, error reporting, analytics consent, and remote config.
- Accessibility text scaling, screen reader labels, contrast, and tap target size.
- Store-track build matches the intended backend and feature flags.

## Handoff

- Use `react-native-expo` for Expo/EAS-specific build and update workflows.
- Use `flutter-development` for Flutter test structure.
- Use `app-store-release` for store-track and submission readiness.
- Use `testing-strategy` for broader test pyramid and release gates.

## References

- Maestro Docs: `https://docs.maestro.dev/`
- Appium Docs: `https://appium.io/docs/en/latest/`
- Detox Docs: `https://wix.github.io/Detox/`
- Flutter Testing: `https://docs.flutter.dev/testing`
