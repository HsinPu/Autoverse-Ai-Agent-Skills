# Service Mesh Traffic, Security, And Operations

## Contents

- Data-plane choice
- Identity and policy
- Traffic management
- Observability
- Rollout and failure drills

## Data-Plane Choice

- Sidecar: mature per-pod isolation and policy, with resource and injection overhead.
- Ambient or node-level: lower per-pod overhead, with different feature and failure boundaries.
- Proxyless: application or SDK integration, tighter language coupling.
- Gateway-only: appropriate when east-west policy does not justify a full mesh.

Validate protocol support, server-first traffic, stateful services, jobs, host networking, and platform constraints.

## Identity And Policy

- Define trust domains and workload identity issuance.
- Rotate certificates before expiry and test control-plane loss.
- Move from permissive to strict mTLS through measured stages.
- Authorize by stable workload identity and operation, not IP address alone.
- Keep policy deny-by-default and test rejected paths.
- Preserve end-user identity separately from workload identity.

## Traffic Management

Align application, client, gateway, proxy, and load-balancer timeouts. Allow retries only for safe operations and budget total attempts. Test circuit breaking, outlier detection, connection pools, canary weights, mirroring privacy, and rollback.

## Observability

Monitor request rate, error, latency, connection, retry, reset, certificate, policy-denial, control-plane, and proxy-resource signals. Preserve trace headers safely and bound label cardinality. Build a path to distinguish application, proxy, policy, DNS, and network failures.

## Rollout And Failure Drills

1. Establish baseline latency, resources, errors, and debugging time.
2. Enroll a low-risk service pair.
3. Enable telemetry before strict policy.
4. Test dependency timeout, proxy crash, certificate rotation, control-plane outage, policy denial, and rollback.
5. Expand by bounded cohorts with explicit exit criteria.
6. Keep version-skew and upgrade rollback procedures tested.
