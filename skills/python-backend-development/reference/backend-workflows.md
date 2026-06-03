# Python 後端開發 — 參考資料

Use this reference when building or refactoring Python web backends, services, or server-side applications.

## 目錄（Table of Contents）

- [觸發時機](#觸發時機)
- [邊界與分工](#邊界與分工)
- [框架選擇](#框架選擇)
- [應用結構](#應用結構)
- [設定與環境](#設定與環境)
- [HTTP 與路由](#http-與路由)
- [ORM 與資料存取](#orm-與資料存取)
- [Middleware 與依賴注入](#middleware-與依賴注入)
- [背景工作](#背景工作)
- [測試](#測試)
- [部署與運維](#部署與運維)
- [檢查清單](#檢查清單)

---

## 觸發時機

- 建立或重構 Python web backend
- 決定 Django、Flask、ASGI/WSGI、ORM 或 migrations
- 規劃 settings、middleware、startup hooks、background workers
- 拆分 app / service / repository 層

---

## 邊界與分工

- 用 `api-contract-design` 處理 request/response schema、errors、versioning。
- 用 `python-development` 處理通用 Python 架構、包裝、型別與風格。
- 用 `deployment-operations` 處理 rollout、smoke test、rollback。
- 這份參考專注在後端框架與 server-side application flow。

---

## 框架選擇

| Stack | Typical use | Notes |
|---|---|---|
| Django | Full-stack web app | ORM + settings + admin + migrations |
| Flask | Small service or custom wiring | Prefer app factory and blueprints |
| ASGI / FastAPI | Async service or typed API | Keep route handlers thin, move logic to services |

---

## 應用結構

- Keep entry points explicit: `manage.py`, `app.py`, `main.py`, or factory functions.
- Separate routes / views from services and repositories.
- Keep framework glue thin; keep business rules in framework-agnostic modules.
- Avoid placing data access directly inside handlers unless the app is intentionally tiny.

```text
app/
├── routes/
├── services/
├── repositories/
├── models/
├── settings/
└── tests/
```

---

## 設定與環境

- Load environment variables explicitly.
- Split settings by environment when needed.
- Keep secrets out of source control.
- Make runtime config visible in code or documented settings modules.

---

## HTTP 與路由

- Keep route handlers focused on parsing, orchestration, and response shaping.
- Use framework routing primitives consistently: Django `urls.py`, Flask blueprints, ASGI routers.
- Normalize request validation at the edge.
- Return framework-native responses only at the boundary.

---

## ORM 與資料存取

- Keep ORM models separate from API DTOs when the backend exposes an external surface.
- Use migrations as part of the application lifecycle.
- Prefer repository or service boundaries for data access when the app has non-trivial rules.
- Keep transaction boundaries explicit.

---

## Middleware 與依賴注入

- Use middleware for cross-cutting concerns such as auth, logging, or request normalization.
- Keep middleware small and ordered deliberately.
- Inject shared dependencies instead of creating them inside handlers.

---

## 背景工作

- Use Celery, RQ, Huey, Dramatiq, or similar workers for async side effects.
- Keep worker tasks idempotent where possible.
- Make retry policy and failure handling explicit.
- Separate user-visible request flow from background processing.

```python
def enqueue_email(user_id: str) -> None:
    email_task.delay(user_id)
```

---

## 測試

- Test route handlers with focused integration tests.
- Test services and repositories separately.
- Use fixtures for settings, DB state, and auth context.
- Verify migrations and startup hooks in the relevant test layer.

---

## 部署與運維

- Keep startup commands and worker commands documented.
- Treat migrations as part of release coordination.
- Verify health endpoints and critical flows after deploy.
- Hand off to `deployment-operations` for rollout verification.

---

## 檢查清單

- [ ] Framework and entry points are explicit
- [ ] Routes are thin and service logic is separated
- [ ] Settings and env loading are visible
- [ ] ORM models are not leaked as public DTOs
- [ ] Background jobs are idempotent where possible
- [ ] Integration tests cover the request path
- [ ] Migration and deployment implications are clear
