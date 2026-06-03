---
name: app-store-release
description: Mobile app store release workflow covering App Store Connect, TestFlight, Google Play Console, signing, metadata, privacy labels, data safety, review guidelines, rollout, rejection handling, and rollback planning. Use when preparing, reviewing, or troubleshooting App Store, TestFlight, Google Play, internal testing, closed testing, or staged mobile releases.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# App Store Release

Use this skill when preparing, reviewing, or troubleshooting mobile app releases for Apple's App Store, TestFlight, Google Play, internal testing, closed testing, or staged production rollout.

## Core Scope

- App Store Connect, TestFlight, Google Play Console, internal/closed/open testing tracks
- Bundle IDs, package names, versioning, build numbers, app signing, certificates, and provisioning
- Store metadata, screenshots, descriptions, categories, age rating, support URLs, and privacy policy
- Apple privacy labels, Google Play Data Safety, permissions declarations, and review guidelines
- Phased release, staged rollout, hotfixes, rejection handling, and rollback planning

## Workflow

1. Confirm release target: internal test, beta, phased rollout, production, or hotfix.
2. Verify app identifier, signing, version, build number, release notes, and target backend.
3. Complete store metadata, screenshots, privacy policy, data disclosures, and permission declarations.
4. Test the exact build from TestFlight or Google Play testing track.
5. Review platform policies and high-risk features before submission.
6. Submit, monitor review status, and keep a rejection response plan ready.
7. Roll out gradually when risk is meaningful and monitor crashes, reviews, analytics, and backend errors.

## Apple Checklist

- Confirm App Store Review Guidelines fit the app behavior.
- Use TestFlight for internal and external beta testing.
- Keep privacy labels aligned with actual SDKs, analytics, tracking, and data collection.
- Verify sign-in requirements, account deletion, subscriptions, in-app purchases, and permission prompts.
- Ensure screenshots and metadata reflect the shipped build.

## Google Play Checklist

- Use internal testing for fast smoke checks and closed/open testing when broader validation is needed.
- Complete Data Safety, privacy policy, content rating, target audience, ads, and permissions forms.
- Use app bundles, Play App Signing, and staged rollout when appropriate.
- Treat policy violations in test tracks seriously; they can block later releases.
- Verify track promotion uses the intended artifact and release notes.

## Release Risk Checks

- Confirm production API endpoints, feature flags, payment modes, push certificates, OAuth redirects, and deep links.
- Check crash reporting and source maps/symbol files before rollout.
- Prepare support response for known issues and store review questions.
- Know whether rollback requires disabling a feature flag, shipping a new build, or stopping rollout.

## Handoff

- Use `mobile-app-testing` for release candidate test planning.
- Use `react-native-expo` for EAS Build, EAS Submit, and EAS Update details.
- Use `flutter-development` for Flutter build and release checks.
- Use `deployment-operations` for staged rollout and rollback strategy.

## References

- Apple App Review Guidelines: `https://developer.apple.com/app-store/review/guidelines/`
- TestFlight: `https://developer.apple.com/testflight/`
- Google Play Internal Testing: `https://support.google.com/googleplay/android-developer/answer/9845334`
- Google Play Console Help: `https://support.google.com/googleplay/android-developer/`
