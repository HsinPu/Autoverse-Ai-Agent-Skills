---
name: stripe-payments
description: Stripe payments guide covering Checkout, PaymentIntents, subscriptions, webhooks, idempotency, customer records, Connect basics, testing, and secure server-side integration. Use when implementing, reviewing, or debugging payments, billing, or Stripe webhook flows.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Stripe Payments

Use this skill when implementing or reviewing Stripe payments, checkout, billing, subscriptions, refunds, customer portals, or webhooks.

## Core Scope

- Stripe Checkout and PaymentIntents
- Subscriptions, invoices, customer portal, and billing lifecycle
- Webhook verification, event handling, and idempotency
- Customer records, metadata, prices, products, and tax-sensitive flows
- Test mode, fixtures, local webhook forwarding, and production readiness

## Workflow

1. Choose the integration model: Checkout, Payment Element, PaymentIntents, subscriptions, or Connect.
2. Keep all secret-key Stripe calls on the server.
3. Create or reuse payment state from your own order/cart/subscription model.
4. Use idempotency keys for server-side create/update operations that may retry.
5. Treat webhooks as the source of truth for final payment or subscription state.
6. Test success, failure, cancellation, retry, duplicate webhook, and refund paths.

## Payment Design

- Use Checkout when hosted payment UI and fast integration are acceptable.
- Use PaymentIntents or Payment Element when the app needs custom payment UI.
- Store Stripe IDs alongside internal domain IDs; do not make Stripe the only system of record.
- Avoid trusting client-return URLs as proof of payment.
- Never log client secrets, secret keys, webhook secrets, or raw card data.

## Webhooks

- Verify webhook signatures before parsing trust-sensitive data.
- Make handlers idempotent; Stripe can deliver events more than once.
- Persist processed event IDs or domain-level state transitions.
- Handle out-of-order events by retrieving current Stripe objects when necessary.
- Keep webhook responses fast; move slow side effects to background work when possible.

## Testing And Release

- Use Stripe test mode and documented test cards.
- Test local webhooks with Stripe CLI or the project's existing tooling.
- Confirm live/test keys, webhook endpoints, success URLs, and cancellation URLs.
- Check currency, tax, receipts, invoices, and refund behavior before launch.
- Document operational flows for failed payments, disputes, refunds, and subscription changes.

## Handoff

- Use `api-contract-design` for backend endpoint shape and idempotency contracts.
- Use `nextjs-development` for Next.js route handlers and server actions.
- Use `security-code-review` for secret handling and webhook verification review.
- Use `testing-strategy` for payment test matrices.

## References

- Stripe PaymentIntents: `https://docs.stripe.com/payments/payment-intents`
- Stripe Checkout: `https://docs.stripe.com/payments/checkout`
- Stripe Webhooks: `https://docs.stripe.com/webhooks`
