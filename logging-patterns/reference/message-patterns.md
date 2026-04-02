# Log Message Patterns

## Preferred Shape

- Message: short and static.
- Context: IDs, status, counts, durations, and other triage-friendly facts.
- Error: pass the error object separately when possible.

## Canonical Examples

### Lifecycle

- Good: `checkout started`
- Good: `checkout completed`
- Good: `checkout failed`
- Bad: `Starting checkout flow now!!!`
- Bad: `checkout success done`

### Entity Changes

- Good: `user profile updated`
- Good: `invoice created`
- Good: `session deleted`
- Bad: `updated the user profile data successfully`

### Validation And Skips

- Good: `invalid input field=email reason=missing-at-sign`
- Good: `skip sync reason=cache-hit`
- Good: `skip retry reason=max-attempts-reached`
- Bad: `email is wrong`
- Bad: `sync skipped because there was nothing to do at this moment`

### External Calls

- Good: `payment-api request started`
- Good: `payment-api request completed`
- Good: `payment-api request failed`
- Bad: `calling payment api now`

## Structured Context

- Prefer: `logger.info("checkout started", { orderId, requestId })`
- Fallback: `logger.info("checkout started orderId=%s requestId=%s", orderId, requestId)`
- Avoid: `logger.info("checkout started for order " + orderId + " request=" + requestId)`

## Error Logging

- Prefer: `logger.error("checkout failed", { orderId, requestId, err })`
- Prefer: keep the message stable and let the logger render the exception.
- Avoid: `logger.error("checkout failed: " + err.message)` when that drops the stack or duplicates the same message everywhere.

## Before And After

### Before

```text
[CheckoutService] Begin to process order 123
Successfully finished processing order 123!!!
Order processing got exception orderId=123 timeout while calling payment api
```

### After

```text
checkout started orderId=123
checkout completed orderId=123
checkout failed orderId=123 dependency=payment-api
```

## Anti-Patterns

- Do not log `here`, `enter`, `123123`, or other placeholder text.
- Do not mix human commentary with machine-searchable details in the same sentence.
- Do not repeat the same context in both the message and structured fields.
- Do not emit multiple near-identical logs for the same event unless each one adds a new fact.
- Do not log secrets, tokens, passwords, full request bodies, or large serialized objects by default.
