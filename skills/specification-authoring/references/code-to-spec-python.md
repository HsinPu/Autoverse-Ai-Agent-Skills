# Code → Spec inventory (Python)

Table of contents: [Identify the stack](#identify-the-stack) · [Entry and runtime](#entry-and-runtime) · [HTTP surface](#http-surface) · [Data layer](#data-layer) · [Background work](#background-work) · [Integrations](#integrations) · [Configuration and ops](#configuration-and-ops) · [Tests](#tests) · [Map to Spec chapters](#map-to-spec-chapters)

Use this sheet when the repository is **primarily Python** (single package or monorepo with a clear service package). Combine with **code-to-spec-workflow** (scope → inventory → map → uncertainty). This is a **scan checklist**, not a language course.

## Identify the stack

- **Dependencies**: `pyproject.toml` (Poetry, hatch, Rye, uv), `requirements.txt`, `Pipfile`, or `setup.cfg` / `setup.py`. Note **Python version** constraint and frameworks: **FastAPI**, **Starlette**, **Django**, **Flask**, **Celery**, **SQLAlchemy**, etc.
- **Layout**: `src/` layout vs flat package; Django project `manage.py`, `settings.py`, `urls.py`.

## Entry and runtime

- **ASGI/WSGI**: search for `uvicorn`, `gunicorn`, `hypercorn`, `daphne` in docs/Docker/`__main__`.
- **FastAPI**: `FastAPI()` app object, `include_router`, lifespan events.
- **Django**: `ROOT_URLCONF`, `urlpatterns`, `ASGI`/`WSGI` entry.
- **Flask**: `Flask(__name__)`, `register_blueprint`, `app.run` or factory pattern `create_app`.

## HTTP surface

- **FastAPI / Starlette**: `@app.get`, `@router.post`, `APIRouter(prefix=...)`, dependencies (`Depends`), response models (`response_model`), status codes.
- **Django**: `path()`, `re_path()`, class-based `View`, DRF `ViewSet` + `router.register`—collect **URL prefix + route + HTTP method** (DRF: `get_serializer`, `action` decorators).
- **Flask**: `@app.route`, blueprints’ `url_prefix`.

Prefer extracting **OpenAPI**: FastAPI auto schema (`/openapi.json`), or `drf-spectacular` / `drf-yasg` if present—use for **4.x.3** when accurate.

## Data layer

- **SQLAlchemy**: `declarative_base` / 2.0 `Mapped`, `Session`, models under `models/` or `db/`.
- **Django ORM**: `models.Model`, `migrations/` folder.
- **Alembic**: `alembic/versions` for schema history (**4.x.1**).
- **Tortoise / Peewee / others**: locate model modules and connection setup.

Note **sync vs async** session/engine (affects **4.x.2** wording).

## Background work

- **Celery**: `celery_app`, `@shared_task`, queues and routing in config; beat schedules.
- **RQ / Huey / Dramatiq**: task definitions and enqueue sites.
- **FastAPI background**: `BackgroundTasks`, `asyncio.create_task`—capture when they change user-visible behavior.

## Integrations

- **HTTP**: `httpx`, `requests`, `aiohttp` client usage; **base URLs** from settings or env.
- **Cloud/SDK**: `boto3`, `google-cloud-*`, `azure-*`—list external systems touched.

## Configuration and ops

- **Pydantic Settings** / `BaseSettings`, `pydantic-settings`, Django `settings.py` (split settings pattern).
- **12-factor**: `os.environ`, `.env` loaded by `python-dotenv`—list **variable names** for **Ch.6** (no secret values).
- **Docker / Compose**: `Dockerfile`, `docker-compose.yml`—ports, command, env.
- **K8s**: Deployments, ConfigMaps, Secrets—map to env vars when possible.

## Tests

- **pytest**: `tests/`, `conftest.py`, markers (`@pytest.mark.integration`), **Playwright** / **Selenium** if e2e.
- **Django**: `TestCase`, `pytest-django`.
- Summarize **test layout** for **Ch.7**; optional coverage only if `coverage` / CI reports it.

## Map to Spec chapters

| Spec area | Python-oriented sources |
| :--- | :--- |
| Ch.2 技術堆疊 | `pyproject.toml` / lockfile pins, framework imports |
| Ch.3 功能 / 用法 | Routers, views, CLI entry (`typer`/`click`) as “entry points” |
| Ch.4 DB | Models + Alembic/Django migrations + repository/service layer |
| Ch.4 邏輯 | Services, domain modules, validators, exception handlers |
| Ch.4 API | Route decorators + Pydantic models / DRF serializers |
| Ch.6 | Settings modules, `.env` keys, Docker/K8s |

## Uncertainty

- **Dynamic routes** or `import string` plugins: document behavior as **observed** or mark **待確認**.
- **Monkeypatching** / runtime wiring: prefer describing **observable API** and config over hidden hooks.
