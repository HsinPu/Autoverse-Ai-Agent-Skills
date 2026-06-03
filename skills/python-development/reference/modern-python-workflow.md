# 現代 Python 工作流（Modern Python Workflow）

Python 專案開始需要工具鏈、測試、async I/O、Pydantic 邊界或 FastAPI API 時，先讀這份參考。

## 目錄（Table of Contents）

- [觸發時機](#觸發時機)
- [預設選擇](#預設選擇)
- [專案起手式](#專案起手式)
- [依賴與環境](#依賴與環境)
- [格式化與靜態檢查](#格式化與靜態檢查)
- [型別與驗證](#型別與驗證)
- [Async 與 I/O](#async-與-io)
- [測試](#測試)
- [Web/API 邊界](#webapi-邊界)
- [封裝與發佈](#封裝與發佈)
- [效能](#效能)
- [檢查清單](#檢查清單)

---

## 觸發時機

- 建立新的 Python 套件、CLI、服務或 API
- 決定 `uv`、`ruff`、`pytest`、`mypy` / `pyright` 的配置
- 設計 async I/O、HTTP client、background work
- 規劃 `pydantic` 驗證、FastAPI 端點、依賴注入
- 整理 packaging、entry points、release 流程

---

## 預設選擇

- 新專案預設用 `pyproject.toml` 當單一來源。
- 綠地專案預設用 `uv` 管理 environment、dependency、lockfile 與執行入口。
- 預設用 `ruff` 做 lint 與 format，除非既有專案已明確選用其他工具。
- 預設用 `pytest` 做測試，並把測試放在專案外層 `tests/`。
- 預設讓資料驗證發生在邊界，內部邏輯保持純淨、可測。

---

## 專案起手式

- 優先採用 `src` layout，搭配外置 `tests/`。
- 把 CLI 入口放在 `__main__.py` 或 console script entry point。
- 把應用程式碼、設定、測試與腳本分開。
- 如果專案已經使用 Poetry、Hatch、pip-tools 或傳統 `requirements.txt`，先沿用既有慣例。

```text
project/
├── pyproject.toml
├── src/myapp/
├── tests/
└── scripts/
```

---

## 依賴與環境

- 用 `pyproject.toml` 集中宣告依賴、工具設定與測試設定。
- 把 runtime 依賴與 dev 依賴分開管理。
- 需要固定版本時，加上 lockfile 並提交到版本控制。
- 需要可重現執行時，偏好 `uv run ...` 之類的明確入口。

---

## 格式化與靜態檢查

- 用 `ruff format` 統一格式。
- 用 `ruff check` 抓 import、未使用變數、簡單壞味道與可自動修正問題。
- 把 lint / format / test 的設定集中在 `pyproject.toml`。
- 需要額外規則時，補在專案設定，不要散落到多個工具檔。

---

## 型別與驗證

- 在公開介面與跨層邊界保留完整型別。
- 用 `Protocol` 表達抽象，用 `TypedDict` 表達字典型資料，用 `dataclass` 表達簡單資料物件。
- 用 `pydantic` 驗證外部輸入、API payload、設定檔與邊界資料。
- 用 `mypy` 或 `pyright` 做型別檢查，依專案既有選擇一致即可。

```python
from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    email: str
    name: str
```

---

## Async 與 I/O

- I/O bound 工作用 async；CPU bound 工作不要假裝成 async。
- 在 async 路徑中避免阻塞式 `requests`、檔案掃描或長時間 CPU 計算。
- HTTP client 優先用 `httpx.AsyncClient`。
- 多個獨立 I/O 任務可用 `asyncio.gather` 或 `TaskGroup` 並行。
- 測試 async code 時，使用 `pytest-asyncio`、`anyio` 或框架既有支援。

```python
import httpx


async def fetch_user(user_id: str) -> dict:
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"https://api.example.com/users/{user_id}")
        response.raise_for_status()
        return response.json()
```

---

## 測試

- 把單元測試、整合測試、e2e 測試分清楚。
- 用 fixtures、`parametrize`、`tmp_path`、`monkeypatch`、`caplog` 降低重複。
- 避免依賴真實網路、真實時間與共享全域狀態。
- 讓測試可重跑、可預期、可讀。

```python
import pytest


@pytest.mark.parametrize("value,expected", [(1, 2), (2, 3)])
def test_increment(value: int, expected: int) -> None:
    assert value + 1 == expected
```

---

## Web/API 邊界

- FastAPI 路由只做輸入解析、依賴注入與回傳轉換。
- 把業務邏輯放在 service 層，把驗證放在 `pydantic` model。
- 回傳 response model，不要直接暴露內部 ORM model。
- 需要背景工作時，先確認是否真的需要非同步背景執行，而不是把邏輯藏進 handler。

---

## 封裝與發佈

- 讓 package 入口清楚，CLI 使用者知道怎麼執行。
- 需要可安裝時，保留 `pyproject.toml` 與必要的 build metadata。
- 發佈前檢查版本號、依賴範圍與公開 API。
- 需要內部工具時，保持可從 source tree 直接執行。

---

## 效能

- 先 profile，再優化。
- 先修正演算法、I/O 次數與資料量，再做微優化。
- 避免過早 cache；只在熱路徑與重複計算中使用。
- 大資料用 streaming、分頁、批次處理或分塊讀取。

---

## 檢查清單

- [ ] 用 `pyproject.toml` 集中管理設定
- [ ] 保持 `src` layout 與 `tests/` 分離
- [ ] 用 `ruff`、`pytest` 與型別檢查工具
- [ ] 把驗證放在邊界，把核心邏輯保持純淨
- [ ] async 路徑沒有阻塞呼叫
- [ ] API 與 service 職責分離
- [ ] 有 profile 依據才做效能優化
