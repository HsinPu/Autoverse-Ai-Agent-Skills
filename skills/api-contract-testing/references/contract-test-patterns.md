# Contract Test Patterns

Choose patterns from the failure boundary that must remain compatible. Combine patterns only when each adds independent evidence.

## Pattern Selection

| Risk | Primary pattern | Evidence |
|---|---|---|
| Provider drifts from a published schema | Provider conformance | Runtime responses validated against the released contract |
| A known consumer depends on a narrow behavior | Consumer-driven contract | Provider verification of the consumer-owned expectation |
| A candidate revision may break released clients | Compatibility diff | Classified changes with affected consumers |
| Examples are normative or used for onboarding | Executable examples | Request and response fixtures that run against the provider |
| A webhook or event evolves independently | Message contract | Envelope, payload, delivery, and retry expectations |
| Generated clients may stop compiling or serializing | SDK compatibility smoke | Generated client build and representative call shapes |

## Provider Conformance

1. Start from the released or candidate contract rather than implementation types.
2. Exercise successful and documented failure responses for each protected operation.
3. Validate status, required headers, content type, body shape, constraints, and error envelope.
4. Include boundary values, absent optional fields, rejected unknown fields when specified, and authorization failures.
5. Report undocumented behavior separately; do not silently broaden the contract from observed output.

Use provider conformance to detect drift. Add consumer evidence when schema-valid behavior can still break client assumptions.

## Consumer-Driven Contracts

1. Let each consumer state only the fields and interactions it truly requires.
2. Keep expectations at the network boundary and avoid assertions about provider storage or internal calls.
3. Publish expectations with the consumer revision and verify them against the candidate provider.
4. Remove or version stale expectations when the owning consumer no longer supports them.
5. Require an owner and migration path when the provider cannot satisfy an active expectation.

Avoid copying the full provider schema into every consumer. That creates synchronized snapshots rather than independent compatibility evidence.

## Compatibility Diff

Treat these as breaking unless policy and consumer evidence prove otherwise:

- remove or rename an operation, field, status, header, event, or enum value;
- make an optional input required or narrow an accepted type, format, range, or pattern;
- change authentication, pagination, idempotency, ordering, retry, or error semantics;
- move a field or change null, default, precision, serialization, or discriminator behavior;
- add a response field when supported consumers reject unknown properties;
- add an enum value when generated clients use closed enums or exhaustive switches.

Classify a change as conditional when compatibility depends on consumer version, feature negotiation, rollout order, or a stated tolerance rule. Record that condition in the gate artifact.

## Webhook And Event Contracts

Protect the event name, version, identifier, timestamp, source, payload, and correlation fields. Verify signature or authentication inputs without embedding secrets in fixtures. Define duplicate delivery, ordering, retry, dead-letter, and forward-compatibility behavior. Test old consumers against new payloads and new consumers against retained old payloads when both coexist.

## Generated SDK Smoke

Generate a client from the candidate contract in a clean environment. Compile representative consumer code, serialize boundary inputs, deserialize success and error responses, and verify authentication configuration. Treat successful generation without compilation or runtime shape checks as incomplete evidence.

## Contract Test Report

Include the baseline and candidate revisions, tested provider and consumers, selected patterns, covered operations, failures, compatibility classification, exceptions, and reproduction commands. Keep policy exceptions time-bounded and assign a migration owner.
