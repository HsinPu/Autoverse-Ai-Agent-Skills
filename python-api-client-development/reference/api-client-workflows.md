# Python API Client 與 SDK — 參考資料

Use this reference when building or maintaining a Python SDK or HTTP API client.

## 目錄（Table of Contents）

- [觸發時機](#觸發時機)
- [邊界與分工](#邊界與分工)
- [Client Shape](#client-shape)
- [Transport](#transport)
- [Auth](#auth)
- [Models](#models)
- [Pagination](#pagination)
- [Retries and Timeouts](#retries-and-timeouts)
- [Error Mapping](#error-mapping)
- [Generated Code](#generated-code)
- [Verification](#verification)
- [Checklist](#checklist)

---

## 觸發時機

- Build a Python SDK or API client
- Wrap a third-party HTTP API in a typed interface
- Add auth, pagination, retries, or error mapping
- Maintain generated OpenAPI client code
- Integrate a service like LobeHub OpenAPI from Python

---

## 邊界與分工

- 用 `python-backend-development` 處理 server-side app structure.
- 用 `python-packaging-release` 處理 distribution and release mechanics.
- 用 `python-security-hardening` 處理 secrets and trust boundaries.
- 用 `python-testing-engineering` 處理 test implementation details.
- 這份參考專注在 client surface 與 remote API integration.

---

## Client Shape

- Keep the client narrow and task-oriented.
- Prefer a small number of explicit entry methods.
- Separate transport concerns from domain convenience methods.
- Support sync or async deliberately, not accidentally.

---

## Transport

- Keep base URL, headers, timeouts, and session lifecycle explicit.
- Allow transport injection for tests.
- Keep serialization and deserialization centralized.

```python
import httpx


class ApiClient:
    def __init__(self, base_url: str, token: str) -> None:
        self._client = httpx.Client(
            base_url=base_url,
            headers={"Authorization": f"Bearer {token}"},
            timeout=30.0,
        )
```

---

## Auth

- Make auth mode explicit: API key, bearer token, OAuth, or session.
- Keep secret loading outside the client when possible.
- Avoid logging auth headers or credentials.
- Refresh tokens or rotate credentials through a clear boundary.

---

## Models

- Define request and response models explicitly.
- Validate remote payloads before exposing them to callers.
- Keep model names aligned with the remote resource shape.
- Distinguish transport errors from schema errors.

---

## Pagination

- Wrap pagination into reusable iterators or list helpers.
- Keep page size, cursor, and next-link handling explicit.
- Let callers choose eager or streaming consumption when useful.
- Handle empty pages and end-of-list consistently.

---

## Retries and Timeouts

- Retry only transient failures.
- Keep retry policy visible and bounded.
- Use timeouts on every request path.
- Preserve idempotency assumptions where retries are used.

---

## Error Mapping

- Map remote errors into a stable client exception hierarchy.
- Preserve status code and response context when useful.
- Do not leak sensitive payloads into exception text.
- Distinguish auth failures, validation failures, rate limits, and transport failures.

---

## Generated Code

- Keep generated code isolated from custom wrappers when possible.
- Put hand-written convenience methods in a separate layer.
- Regenerate intentionally and review the diff.
- Do not modify generated output unless the workflow explicitly supports it.

---

## Verification

- Test against representative success and failure payloads.
- Verify pagination, retries, and auth boundaries.
- Check that exceptions are stable and actionable.
- Confirm the client behaves the same from a clean install.

---

## Checklist

- [ ] Client surface is narrow and explicit
- [ ] Transport and auth are configurable
- [ ] Pagination and retries are reusable helpers
- [ ] Remote errors map to stable local exceptions
- [ ] Generated code is isolated when present
- [ ] Representative responses are tested
