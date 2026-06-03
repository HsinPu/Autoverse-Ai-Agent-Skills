# Python 專案架構 — 參考資料

Python 沒有唯一官方標準架構；對新專案，預設以 **`src` layout + 外置 `tests/` + 明確分層** 作為起點。若只是單一腳本或一次性工具，flat layout 仍可接受，但只要開始需要安裝、測試或擴充，就建議切回 `src` layout。

## 觸發時機

- 新建 Python 專案
- 重新整理 package / module 邊界
- 決定 CLI、API、service、repository 的分層
- 比較 `src` layout 與 flat layout
- 規劃 pytest 測試目錄與入口點

## 預設目錄

```text
project/
├── pyproject.toml
├── README.md
├── src/
│   └── myapp/
│       ├── __init__.py
│       ├── __main__.py
│       ├── api/
│       ├── service/
│       ├── domain/
│       └── infrastructure/
├── tests/
│   ├── test_service.py
│   └── test_api.py
├── scripts/
└── docs/
```

## 推薦分層

| 層級 | 職責 | 重點 |
|---|---|---|
| `api/` 或 `cli/` | 入口層 | 解析輸入、呼叫 service、回傳結果 |
| `service/` | 應用層 | 組合 use case、協調流程 |
| `domain/` | 領域層 | 核心規則、實體、值物件、純邏輯 |
| `infrastructure/` | 基礎設施層 | 資料庫、HTTP、檔案系統、第三方服務 |

## 規劃原則

- 依賴方向往內：`api` / `service` 可以依賴 `domain`，但不要讓 `domain` 依賴框架或資料庫實作。
- `__init__.py` 用來界定 package；需要成為 import package 的目錄就放入它。
- CLI 入口可放在 `__main__.py`，或由 packaging 入口點啟動。
- 測試優先放在 `tests/`，並用 `pip install -e .` 或等價的開發安裝方式執行。
- 小型腳本可先用 flat layout；一旦出現多個模組、測試或可重用套件，就建議改成 `src` layout。

## 何時不用過度設計

- 單一腳本、原型、短期自動化工具，不必硬拆成多層資料夾。
- 先有清楚責任邊界，再拆資料夾；不要為了「看起來標準」先建太多空資料夾。

## 參考依據

- PyPA：`src` layout 與 flat layout 的取捨
- Python Tutorial：modules、packages、`__main__`、`sys.path`
- pytest：建議將測試放在應用程式碼外，並使用開發安裝與標準測試收集
