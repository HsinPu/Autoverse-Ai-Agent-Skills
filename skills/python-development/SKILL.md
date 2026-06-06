---
name: python-development
description: Python development guide covering project architecture, package layout, PEP 8, typing, docstrings, design patterns, and modern Python tooling such as uv, ruff, pytest, pydantic, async I/O, and FastAPI. Use when designing, writing, reviewing, or refactoring general Python code, choosing package boundaries, or setting up packaging, testing, and toolchain conventions. For dataframe, ETL, notebook, file-based analytics, web page extraction, local automation, backend framework, testing implementation, debugging workflows, package release workflows, concurrency coordination, security hardening, or API client development, use the more specialized Python skills.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Python 開發（Python Development）

**設計、撰寫或重構 Python 程式時請先讀取本 skill。**

設計 Python 專案架構、設定工具鏈、撰寫或重構 Python 程式碼時，依需要查閱下方參考資料，以符合架構、程式碼風格、設計原則與常見現代工作流。

若使用者是在問整個 repo 的架構是否合理、要比較目標架構，或需要跨語言/跨框架的遷移計畫，先使用 `project-architecture-review`；再回到本 skill 處理 Python package layout、typing、tooling 與實作細節。

## When To Use

Use this skill when the task is general Python code design, implementation, review, or refactoring.

- Choose Python package structure, `src` layout, module boundaries, CLI entry points, or test layout.
- Write or improve typed Python code, docstrings, imports, configuration, dependency injection, and design patterns.
- Set up or reason about modern Python tooling such as `pyproject.toml`, `uv`, `ruff`, pytest, mypy/pyright, Pydantic, or async I/O.

## Workflow

1. Identify whether the task is general Python or belongs to a more specific Python sub-skill.
2. Inspect project layout, `pyproject.toml`, entry points, tests, and local conventions before editing.
3. Keep code simple, typed where useful, and consistent with existing package boundaries.
4. Prefer focused tests and repo-local tools such as pytest, ruff, mypy, or pyright when available.
5. Use bundled references only for the relevant layer: architecture, style, tooling, or design patterns.

## Handoff

- Use the specialized Python skills below when the task is primarily data engineering, scraping, automation, backend frameworks, testing, debugging, packaging, concurrency, security, or API clients.
- Use `project-architecture-review` for repo-wide architecture diagnosis or cross-language migration plans.
- Use `code-refactoring` for behavior-preserving cleanup that is not Python-specific.
- Use `testing-strategy` when the main question is test level or coverage strategy.

## 進階與參考（Bundled resources）

- **專案架構**：新專案、整理資料夾、規劃 `src` layout、package/module 邊界、CLI 入口與測試結構時，見 [reference/architecture.md](reference/architecture.md)。
- **程式碼風格**：需查閱命名、格式、匯入、型別註解、Docstring、慣例或工具時，見 [reference/code-style.md](reference/code-style.md)。
- **現代 Python 工作流**：需要設定 `pyproject.toml`、`uv`、`ruff`、`pytest`、`mypy` / `pyright`、`pydantic`、async I/O，或 `FastAPI` 時，見 [reference/modern-python-workflow.md](reference/modern-python-workflow.md)。
- **資料工程 / 分析 / ETL**：以 dataframe、Jupyter、Parquet、批次管線或資料清理為主時，見 [python-data-engineering](../python-data-engineering/SKILL.md)。
- **網頁擷取 / Scraping**：以 HTML 擷取、解析、分頁、清理與輸出為主時，見 [python-web-scraping](../python-web-scraping/SKILL.md)。
- **自動化 / 腳本**：以檔案系統、自動化命令、批次作業或 CLI 腳本為主時，見 [python-automation-scripting](../python-automation-scripting/SKILL.md)。
- **後端服務 / Web App**：以 Django、Flask、ASGI/WSGI、ORM、settings、middleware、migrations 或 worker 為主時，見 [python-backend-development](../python-backend-development/SKILL.md)。
- **測試 / Testing**：以 pytest、fixtures、monkeypatch、mock、async tests、tmp_path、caplog 或 framework test adapters 為主時，見 [python-testing-engineering](../python-testing-engineering/SKILL.md)。
- **可觀測性 / Debugging**：以 traceback、profiling、memory / performance troubleshooting、runtime diagnostics 或 failure triage 為主時，見 [python-observability-debugging](../python-observability-debugging/SKILL.md)。
- **打包 / 發佈**：以 build backend、wheel / sdist、版本、console scripts、發佈與 release 流程為主時，見 [python-packaging-release](../python-packaging-release/SKILL.md)。
- **並行 / Concurrency**：以 asyncio coordination、TaskGroup、cancellation、backpressure 或 worker coordination 為主時，見 [python-concurrency-patterns](../python-concurrency-patterns/SKILL.md)。
- **安全硬化**：以 secrets、unsafe deserialization、subprocess/file/network boundaries 或 supply-chain hygiene 為主時，見 [python-security-hardening](../python-security-hardening/SKILL.md)。
- **API Client / SDK**：以 OpenAPI client、SDK、auth、pagination、retry、error mapping 或 generated client 維護為主時，見 [python-api-client-development](../python-api-client-development/SKILL.md)。
- **設計模式**：需查閱 KISS、SRP、關注點分離、組合優於繼承、依賴注入時，見 [reference/design-patterns.md](reference/design-patterns.md)。
