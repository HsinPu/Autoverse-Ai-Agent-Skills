---
name: aws-operations
description: AWS operations workflow covering IAM, accounts, regions, Lambda, API Gateway, S3, CloudFront, ECS, RDS, VPC, CloudWatch, CDK, deployment safety, cost controls, security review, and incident response. Use when building, deploying, debugging, or reviewing AWS-backed systems.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# AWS Operations

Use this skill when operating, deploying, reviewing, or debugging systems on AWS.

## Core Scope

- IAM, accounts, organizations, roles, policies, secrets, and least privilege
- Lambda, API Gateway, S3, CloudFront, ECS/Fargate, RDS, DynamoDB, SQS/SNS, EventBridge, and VPC basics
- CDK, CloudFormation, Terraform/OpenTofu, infrastructure review, and deployment safety
- CloudWatch logs, metrics, alarms, tracing, cost controls, and incident triage
- Security posture, public exposure, encryption, backups, and disaster recovery

## Workflow

1. Identify account, region, environment, and blast radius before changing anything.
2. Inspect infrastructure-as-code first; avoid console-only drift.
3. Map services, IAM roles, network boundaries, secrets, and data stores.
4. Plan deployment and rollback before applying changes.
5. Validate least privilege, encryption, public access, logging, backups, and alarms.
6. Run smoke checks and inspect CloudWatch after deployment.
7. Record operational decisions and known limits.

## IAM And Security

- Prefer roles and short-lived credentials over long-lived access keys.
- Keep IAM policies narrow and resource-scoped.
- Block public S3 access unless public hosting is intentional.
- Store secrets in Secrets Manager, SSM Parameter Store, or the existing platform secret store.
- Review security groups, public subnets, load balancers, and API Gateway authorizers.

## Deployment Checks

- Use CDK/Terraform/CloudFormation plans or diffs before applying.
- Confirm Lambda runtime, memory, timeout, concurrency, and environment variables.
- Check migrations and data changes separately from infrastructure changes.
- Use blue/green, canary, or staged rollout when the blast radius is high.
- Confirm rollback is possible before modifying stateful resources.

## Observability And Cost

- Add CloudWatch alarms for errors, latency, throttles, saturation, and dead-letter queues.
- Track request volume, storage growth, NAT/data transfer, provisioned capacity, and idle resources.
- Set budgets or alerts for non-trivial environments.
- Keep runbooks for common failures such as throttling, expired certificates, DNS, and permissions.

## Handoff

- Use `terraform-infrastructure` for Terraform/OpenTofu implementation details.
- Use `deployment-operations` for release verification and rollout strategy.
- Use `security-scanning` for IaC, dependency, and container scanning.
- Use `incident-response-postmortems` for live incidents and postmortems.

## References

- AWS CDK Best Practices: `https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html`
- AWS Lambda with CDK: `https://docs.aws.amazon.com/lambda/latest/dg/lambda-cdk-tutorial.html`
- AWS Well-Architected: `https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html`
