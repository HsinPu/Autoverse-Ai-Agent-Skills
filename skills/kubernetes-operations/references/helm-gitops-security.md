# Helm, GitOps, And Kubernetes Security

## Contents

- Helm chart contract
- GitOps promotion
- Workload security
- Policy validation

## Helm Chart Contract

- Keep `Chart.yaml`, default `values.yaml`, templates, schema, and tests versioned together.
- Make values describe product choices, not raw fragments copied into arbitrary YAML.
- Provide safe defaults for replicas, resources, probes, security context, and disruption.
- Require `values.schema.json` for public or reused charts.
- Use named templates for stable labels and names; avoid logic-heavy templates.
- Render and inspect every supported values profile with `helm template` and `helm lint`.
- Test upgrades as well as fresh installs.

## GitOps Promotion

1. Separate application source, built artifact, and environment declaration.
2. Promote immutable artifact identity through reviewed environment changes.
3. Use reconciliation health, sync waves, hooks, or dependency ordering deliberately.
4. Detect and investigate drift instead of silently overwriting emergency changes.
5. Define rollback as a Git and artifact action, not manual reconstruction.
6. Protect production paths with review, policy, and bounded credentials.

Avoid configuring both Helm and Kustomize as competing owners for the same field.

## Workload Security

- Run as non-root with an explicit UID where images support it.
- Disable privilege escalation and drop capabilities by default.
- Prefer read-only root filesystems and writable dedicated volumes.
- Set seccomp to `RuntimeDefault` unless a justified profile is required.
- Restrict service-account token mounting.
- Scope RBAC to resource, verb, namespace, and workload identity.
- Use default-deny ingress and egress NetworkPolicies, then permit required flows.
- Store secret material outside chart values and rendered manifests.

## Policy Validation

Run the repository's chosen equivalents for:

- Kubernetes schema and server-side dry-run
- Helm lint and rendering
- policy-as-code such as Kyverno, Gatekeeper, or Conftest
- image and manifest scanning
- API deprecation detection
- diff against the live or GitOps-managed state

Reject changes that introduce privileged pods, wildcard RBAC, unbounded resources, missing probes, mutable production images, or plaintext secrets without explicit approved exceptions.
