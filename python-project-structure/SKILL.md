---
name: python-project-structure
description: Organizes Python project layout, module architecture, and public API design. Use when setting up new projects, organizing directories and modules, defining public interfaces with __all__, planning app/controller/services/models layout, deciding test placement, or creating reusable library packages.
license: Apache-2.0
---

# Python 專案結構與模組架構（Python Project Structure & Module Architecture）

設計結構清楚、模組邊界明確、公開介面明訂的 Python 專案。良好組織讓程式易於發現、變更可預期。

---

## 觸發時機（When to Use）

- 從零開始建立新 Python 專案
- 重組既有程式庫的目錄與模組
- 用 `__all__` 定義模組公開 API
- 決定扁平或巢狀目錄、測試檔放置策略
- 建立可重用的 library 套件
- 規劃 logs／resources／config／app 目錄、API 放 controller 等架構時

---

## 核心概念（Core Concepts）

| 概念 | 說明 |
|------|------|
| **模組內聚** | 會一起變更的程式放在同一模組，單一、清楚的目的。 |
| **明確介面** | 用 `__all__` 定義對外公開內容，其餘為內部實作。 |
| **扁平層級** | 偏好淺層目錄，僅在真有子領域時才加深。 |
| **一致慣例** | 命名與組織方式在專案內統一套用。 |

---

## 結構範例（Layout Examples）

### 簡易專案（Quick Start）

與完整架構同一套目錄骨架，差別在資源與子目錄多寡。適合小型或初期專案。將 `{{PROJECT_NAME}}` 替換為實際專案名稱。

```
{{PROJECT_NAME}}/
├── main.py
├── requirements.txt
├── .env
├── .gitignore
├── logs/
├── resources/
│   ├── downloads/
│   ├── fonts/
│   ├── audio/
│   ├── images/
│   └── data/
├── docs/
├── config/
├── i18n/
├── cache/
└── app/
    ├── models/
    ├── services/
    ├── controller/
    ├── utils/
    ├── static/
    └── templates/
```

### 完整應用專案（Full Application Layout）

含資源、日誌、多語系、設定的應用程式範本。將 `{{PROJECT_NAME}}` 替換為實際專案名稱。

```
{{PROJECT_NAME}}/
├── main.py                 # 主程式入口
├── requirements.txt        # 專案依賴套件清單
├── setup.py                # 安裝腳本
├── .env                    # 環境變數設定檔
├── .gitignore              # Git 忽略檔案清單
│
├── logs/                   # 日誌目錄
│   ├── app.log
│   └── error.log
│
├── resources/              # 資源檔案
│   ├── downloads/          # 下載資料
│   ├── fonts/
│   │   ├── zh/
│   │   └── en/
│   ├── audio/
│   │   ├── music/
│   │   └── effects/
│   ├── images/
│   │   ├── icons/
│   │   ├── backgrounds/
│   │   └── assets/
│   └── data/
│       ├── config/
│       ├── examples/
│       └── references/
│
├── docs/
│   ├── api/
│   ├── design/
│   └── guides/
│
├── config/
│   ├── dev.yaml
│   ├── prod.yaml
│   └── test.yaml
│
├── i18n/
│   ├── en/
│   └── zh/
│
├── cache/
│   ├── temp/
│   └── api/
│
└── app/                    # 應用程式主程式碼
    ├── models/
    │   ├── base.py
    │   └── user.py
    ├── services/
    │   ├── auth.py
    │   └── api.py
    ├── controller/         # API 路由／端點放此層（接收請求、呼叫 service、回傳回應）
    │   ├── base.py
    │   └── user.py
    ├── utils/
    │   ├── logger.py
    │   ├── validator.py
    │   └── helpers.py
    ├── static/
    │   ├── css/
    │   ├── js/
    │   └── img/
    └── templates/
        ├── base.html
        └── pages/
```

**目錄說明**

| 區塊 | 說明 |
|------|------|
| 根目錄 | `main.py` 入口；`requirements.txt` 依賴；`setup.py` 安裝／打包；`.env` 環境變數；`.gitignore` 忽略清單。 |
| **logs/** | 應用與錯誤日誌；建議實作 log rotation。 |
| **resources/** | 下載檔、字形（zh/en）、音訊、圖片、預設資料（config/examples/references）。 |
| **docs/** | **API 文件**放 `docs/api/`；設計、使用指南在 design/、guides/。 |
| **config/** | 依環境（dev/prod/test）集中管理設定。 |
| **i18n/** | 多語系翻譯。 |
| **cache/** | 快取與臨時檔。 |
| **app/** | **API 端點**在 `controller/`；業務邏輯在 `services/`；資料在 `models/`；其餘為 utils、static、templates。 |

**使用建議**

- **環境** — `.env` 管環境變數；設定檔統一放 `config/`。
- **資源** — 大型檔可考慮 Git LFS；定期清 cache；參考檔放 `resources/data/references/`。
- **程式碼** — 模組化、一檔一概念；目錄層級清晰。
- **安全** — 敏感資訊放 `.env`；`.gitignore` 涵蓋 logs、cache、.env；定期更新依賴。
- **維護** — 文件與結構同步；適當日誌；遵循程式碼規範。

---

## 模組與目錄模式（Patterns）

### 1. 一檔一概念（One Concept Per File）

每檔專注單一概念或一組緊密相關函式。考慮拆檔時機：多種不相關職責、超過約 300–500 行、內含因不同理由變更的 class。

```python
# 好：user_service.py / user_repository.py / user_models.py
# 避免：user.py 塞滿 service、repository、models、utils
```

### 2. 用 `__all__` 明訂公開 API

未列在 `__all__` 的成員視為內部實作。

```python
# mypackage/services/__init__.py
from .user_service import UserService
from .order_service import OrderService
from .exceptions import ServiceError, ValidationError

__all__ = ["UserService", "OrderService", "ServiceError", "ValidationError"]
```

### 3. 扁平目錄結構

偏好少層級；過深會讓 import 冗長、導覽困難。僅在真有子領域需要隔離時才在 `app/` 下再加領域子目錄。結構與前文「完整應用專案」一致：

```
# 建議：根目錄一層、app 內一層（models/services/controller/utils/static/templates）
{{PROJECT_NAME}}/
├── main.py
├── config/
├── logs/
├── resources/
├── docs/
├── i18n/
├── cache/
└── app/
    ├── models/
    ├── services/
    ├── controller/
    ├── utils/
    ├── static/
    └── templates/

# 避免：過深巢狀
project/core/internal/services/impl/user/
```

### 4. 測試檔組織

擇一並全專案一致。

- **Colocated**：`src/user_service.py` + `src/test_user_service.py`，測試緊鄰程式。
- **Parallel**：`tests/services/test_user_service.py` 對應 `src/services/user_service.py`，正式碼與測試分離，較大專案常用。

### 5. 套件初始化（`__init__.py`）

提供乾淨公開介面給套件使用者。

```python
# mypackage/__init__.py
from .core import MainClass, HelperClass
from .exceptions import PackageError, ConfigError
from .config import Settings

__all__ = ["MainClass", "HelperClass", "PackageError", "ConfigError", "Settings"]
__version__ = "1.0.0"
```

使用者：`from mypackage import MainClass, Settings`

### 6. 分層架構（Layered Architecture）

依架構層組織，每層只依賴下層。與前文「完整應用專案」的 `app/` 結構一致：

```
app/
├── controller/     # API 放此層：路由／端點、請求解析、呼叫 service、組回應
├── services/       # 服務層：業務邏輯（含呼叫外部 API 的邏輯）
├── models/         # 資料模型／領域實體
├── utils/          # 工具函式（logger、validator、helpers）
├── static/         # 靜態資源（css、js、img）
└── templates/      # 模板檔案
```

- **API 路由／端點**：放在 `app/controller/`（例如 `user_controller.py` 定義 `/users` 等端點）。
- **API 文件**：放在 `docs/api/`。
- 依賴方向：controller → services → models；utils 可被各層使用。設定與環境由專案根目錄的 `config/`、`.env` 管理。

### 7. 依領域劃分（Domain-Driven）

複雜應用可依業務領域組織，各領域內仍沿用完整架構的層級（models、services、controller、utils）；共用部分放 `shared/` 或專案根目錄的 `config/`、`utils/`。

```
{{PROJECT_NAME}}/
├── main.py
├── config/
├── logs/
├── resources/
├── i18n/
├── cache/
│
└── app/
    ├── users/              # 使用者領域
    │   ├── models/
    │   ├── services/
    │   ├── controller/
    │   └── utils/
    ├── orders/             # 訂單領域
    │   ├── models/
    │   ├── services/
    │   ├── controller/
    │   └── utils/
    └── shared/             # 跨領域共用
        ├── models/
        ├── utils/
        └── exceptions.py
```

依賴方向：各領域的 controller → services → models；`shared/` 可被各領域引用。

---

## 命名與匯入（Naming & Imports）

**慣例**

- 檔名與模組名 **snake_case**：`user_repository.py`、資料夾如 `user_controller/` 或檔名 `user_controller.py`
- 避免費解縮寫；檔名與主要 class 對應：`UserService` → `user_service.py`

**匯入**

偏好絕對匯入，較清晰且重構時較穩。

```python
# 建議
from myproject.services import UserService
from myproject.models import User

# 避免（模組搬動時易壞）
from ..services import UserService
from . import models
```

---

## 最佳實踐摘要（Best Practices Summary）

1. **一檔一概念** — 約 300–500 行可考慮拆檔（依複雜度）
2. **明訂 `__all__`** — 公開介面清楚
3. **扁平結構** — 僅在真有子領域時加深
4. **絕對匯入** — 較可靠、好讀
5. **全專案一致** — 同一套組織與命名
6. **檔名即用途** — 檔名能描述內容
7. **層級分離** — 各層職責清楚、依賴單向
8. **說明結構** — README 或文件簡述專案組織
