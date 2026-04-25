---
name: python-development
description: Python development guide covering project architecture, package layout, PEP 8, typing, docstrings, design patterns, and modern Python tooling such as uv, ruff, pytest, pydantic, async I/O, and FastAPI. Use when designing, writing, reviewing, or refactoring Python code, choosing package boundaries, or setting up packaging, testing, and toolchain conventions.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Python 開發（Python Development）

**設計、撰寫或重構 Python 程式時請先讀取本 skill。**

設計 Python 專案架構、設定工具鏈、撰寫或重構 Python 程式碼時，依需要查閱下方參考資料，以符合架構、程式碼風格、設計原則與常見現代工作流。

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
- **設計模式**：需查閱 KISS、SRP、關注點分離、組合優於繼承、依賴注入時，見 [reference/design-patterns.md](reference/design-patterns.md)。
