---
name: python-design-patterns
description: Python design principles including KISS, Single Responsibility, Separation of Concerns, composition over inheritance, and dependency injection. Use when making architecture decisions, refactoring code structure, splitting controller/services/models responsibilities, evaluating when to abstract, or choosing between inheritance and composition.
license: Apache-2.0
---

# Python 設計模式（Python Design Patterns）

以基本設計原則撰寫可維護（maintainable）的 Python 程式碼。以下原則與範例對應**專案結構**中的 `app/` 分層：`controller/`、`services/`、`models/`、`utils/`。

---

## 觸發時機（When to Use）

- 設計新元件或服務（designing new components or services）
- 重構複雜或糾結的程式碼（refactoring complex or tangled code）
- 決定是否要抽抽象（deciding whether to abstract）
- 在繼承（inheritance）與組合（composition）之間做選擇
- 評估程式複雜度與耦合（evaluating complexity and coupling）
- 規劃模組化架構（planning modular architecture）
- 拆分 controller／services／models 職責、規劃分層時

---

## 核心概念（Core Concepts）

| 概念 | 說明 |
|------|------|
| **KISS** | 選擇最簡單且可行的解法（keep it simple）；複雜度須有具體需求才合理。 |
| **單一職責（SRP）** | 每個單元只有一個變更理由；關注點拆成獨立 component。 |
| **組合優於繼承** | 用組合物件建構行為，而非繼承擴充類別（composition over inheritance）。 |
| **Rule of Three** | 出現第三個實例再考慮抽象；適度重複優於過早抽象。 |

---

## 與專案結構對應（Mapping to Project Structure）

設計原則對應到 `app/` 目錄分層：

| 專案目錄 | 職責 | 設計原則 |
|----------|------|----------|
| **app/controller/** | API 路由／端點；解析 request、呼叫 service、組 response | 單一職責、關注點分離；不寫業務邏輯與資料存取 |
| **app/services/** | 業務邏輯（business logic）、領域規則、協調操作 | 單一職責、依賴注入（DI）；純邏輯盡量不混 I/O |
| **app/models/** | 資料模型／領域實體（domain entities） | 與 controller 回傳的 schema 分離，不對外暴露 ORM |
| **app/utils/** | 工具函式（logger、validator、helpers） | 可被各層使用，保持無狀態／純函式（pure function）為佳 |

依賴方向：**controller → services → models**；utils 可被各層使用。設定由專案根目錄 `config/`、`.env` 管理。

---

## 快速入門（Quick Start）

```python
# 簡單勝過聰明：用 dict 即可，不必上 Factory/registry pattern
FORMATTERS = {"json": JsonFormatter, "csv": CsvFormatter}

def get_formatter(name: str) -> Formatter:
    return FORMATTERS[name]()
```

---

## 基礎模式（Fundamental Patterns）

### Pattern 1：KISS — 保持簡單

在加入複雜度前先問：**有沒有更簡單的解法？**

```python
# 過度設計：Factory + 註冊機制
class OutputFormatterFactory:
    _formatters: dict[str, type[Formatter]] = {}
    @classmethod
    def register(cls, name: str): ...
    @classmethod
    def create(cls, name: str) -> Formatter: ...

# 簡單做法：用 dict，放在 app/utils/ 或對應 module 即可
FORMATTERS = {"json": JsonFormatter, "csv": CsvFormatter, "xml": XmlFormatter}

def get_formatter(name: str) -> Formatter:
    if name not in FORMATTERS:
        raise ValueError(f"Unknown format: {name}")
    return FORMATTERS[name]()
```

在此情境下，Factory pattern 只增加程式碼而沒有增加價值。把 pattern 留給真正能解決問題的場合。

### Pattern 2：單一職責（SRP）— controller 與 services 分離

每個 class 或 function 只應有**一個變更理由**（single reason to change）。對應專案結構：**API 在 controller/**，**業務邏輯在 services/**。

```python
# 不好：controller 包辦 HTTP、驗證、DB、回應格式（違反 SRP）
# app/controller/user_controller.py 不應長這樣
class UserController:
    async def create_user(self, request: Request) -> Response:
        data = await request.json()
        if not data.get("email"):
            return Response({"error": "email required"}, status=400)
        user = await db.execute("INSERT INTO users ...", ...)
        return Response({"id": user.id, ...}, status=201)

# 好：controller 只做請求／回應，業務邏輯在 services
# app/services/user_service.py
class UserService:
    """僅負責業務邏輯，放 app/services/。"""

    def __init__(self, repo: UserRepository) -> None:
        self._repo = repo

    async def create_user(self, data: CreateUserInput) -> User:
        user = User(email=data.email, name=data.name)
        return await self._repo.save(user)

# app/controller/user_controller.py
class UserController:
    """僅負責 API 層：解析請求、呼叫 service、回傳回應。"""

    def __init__(self, service: UserService) -> None:
        self._service = service

    async def create_user(self, request: Request) -> Response:
        data = CreateUserInput(**(await request.json()))
        user = await self._service.create_user(data)
        return Response(user.to_dict(), status=201)
```

如此一來，HTTP 的變更不會影響業務邏輯，反之亦然。

### Pattern 3：關注點分離（Separation of Concerns）— 對應 app/ 分層

將程式組織成職責清楚的層級，與專案結構一致：

```
app/
├── controller/     # API 層：解析 request、呼叫 service、組 response
├── services/       # 業務邏輯、領域規則、協調操作
├── models/        # 資料模型／領域實體
└── utils/         # 工具（logger、validator、helpers）
```

上層只依賴下層；資料存取可由 services 內封裝或透過 repository 抽象（abstraction）。

```python
# app/models/user.py — 領域實體
# app/services/user_service.py — 業務邏輯，可依賴 repository／資料存取
class UserService:
    def __init__(self, repo: UserRepository) -> None:
        self._repo = repo

    async def get_user(self, user_id: str) -> User:
        user = await self._repo.get_by_id(user_id)
        if user is None:
            raise UserNotFoundError(user_id)
        return user

# app/controller/user_controller.py — API 端點
@app.get("/users/{user_id}")
async def get_user(user_id: str) -> UserResponse:
    user = await user_service.get_user(user_id)
    return UserResponse.from_user(user)
```

### Pattern 4：組合優於繼承（Composition Over Inheritance）

用**組合物件**建構行為，而不是繼承。適合放在 **app/services/** 的協調邏輯（orchestration）。

```python
# 繼承：僵化、難測試（SmtpClient 難以 mock）
class EmailNotificationService(NotificationService):
    def __init__(self):
        self._smtp = SmtpClient()

# 組合：彈性、易測試（可注入 fake），放 app/services/
class NotificationService:
    def __init__(
        self,
        email_sender: EmailSender,
        sms_sender: SmsSender | None = None,
        push_sender: PushSender | None = None,
    ) -> None:
        self._email = email_sender
        self._sms = sms_sender
        self._push = push_sender

    async def notify(self, user: User, message: str, channels: set[str] | None = None) -> None:
        channels = channels or {"email"}
        if "email" in channels:
            await self._email.send(user.email, message)
        if "sms" in channels and self._sms and user.phone:
            await self._sms.send(user.phone, message)
        # ...

# 測試時可注入 fake（或 mock）
service = NotificationService(email_sender=FakeEmailSender(), sms_sender=FakeSmsSender())
```

---

## 進階模式（Advanced Patterns）

### Pattern 5：Rule of Three

有**第三個類似案例**再考慮抽象，不要看到兩個相似就急著抽（avoid premature abstraction）。

```python
# 兩個長得很像的 function？先不要抽象
def process_orders(orders: list[Order]) -> list[Result]: ...
def process_returns(returns: list[Return]) -> list[Result]: ...

# 驗證/處理/錯誤都不同時，重複往往比錯誤的抽象好
# 第三個案例出現後，再判斷是否真有共通 pattern
```

### Pattern 6：函式長度與職責（Function Size Guidelines）

函式保持**單一焦點**（single focus）。考慮拆出時機：超過約 20–50 行、同時做多件事、巢狀過深（3+ 層）。**services/** 內流程建議由多個小函式組合。

```python
# 不好：一支函式包辦驗證、庫存、付款、通知
def process_order(order: Order) -> Result:
    # 幾十行混在一起...
    pass

# 好：由多個小函式組合，適合放在 app/services/order_service.py
def process_order(order: Order) -> Result:
    """跑完一筆訂單的完整流程。"""
    validate_order(order)
    reserve_inventory(order)
    payment_result = charge_payment(order)
    send_confirmation(order, payment_result)
    return Result(success=True, order_id=order.id)
```

### Pattern 7：依賴注入（Dependency Injection）

透過**建構子**（constructor）傳入依賴，方便測試與替換實作。**app/services/** 的 class 建議採此方式。

```python
# app/services/user_service.py — 依賴由建構子注入
class UserService:
    def __init__(
        self,
        repository: UserRepository,
        cache: Cache,
        logger: Logger,
    ) -> None:
        self._repo = repository
        self._cache = cache
        self._logger = logger

    async def get_user(self, user_id: str) -> User:
        cached = await self._cache.get(f"user:{user_id}")
        if cached:
            return User.from_json(cached)
        user = await self._repo.get_by_id(user_id)
        if user:
            await self._cache.set(f"user:{user_id}", user.to_json(), ttl=300)
        return user

# 正式環境（production）：注入真實實作
service = UserService(repository=PostgresUserRepository(db), cache=RedisCache(redis), logger=...)
# 測試（testing）：注入 fake／mock
service = UserService(repository=InMemoryUserRepository(), cache=FakeCache(), logger=NullLogger())
```

### Pattern 8：避免常見反模式（Avoiding Anti-Patterns）

**不要對外暴露內部型別（如 ORM model）** — controller 應回傳 schema／DTO（Data Transfer Object），不要直接回傳 model：

```python
# 不好：API（controller）直接回傳 ORM model
@app.get("/users/{id}")
def get_user(id: str) -> UserModel:
    return db.query(UserModel).get(id)

# 好：controller 用 response schema 轉一層
@app.get("/users/{id}")
def get_user(id: str) -> UserResponse:
    user = db.query(UserModel).get(id)
    return UserResponse.from_orm(user)
```

**不要把 I/O 和業務邏輯混在一起** — 資料存取與純邏輯分離；業務邏輯放在 **services/**，且盡量只吃 domain 物件（pure logic，易於單測）：

```python
# 不好：SQL 寫在業務邏輯裡
def calculate_discount(user_id: str) -> float:
    user = db.query("SELECT * FROM users WHERE id = ?", user_id)
    orders = db.query("SELECT * FROM orders WHERE user_id = ?", user_id)
    # 混在一起

# 好：由 repository/service 取資料，業務邏輯只吃 User、list[Order]
def calculate_discount(user: User, order_history: list[Order]) -> float:
    """純業務邏輯，易於單測，放 app/services/。"""
    if len(order_history) > 10:
        return 0.15
    return 0.0
```

---

## 最佳實踐摘要（Best Practices Summary）

1. **KISS** — 選最簡單且可行的解法（simplest solution that works）
2. **單一職責（SRP）** — controller 只管 API，services 只管業務邏輯，models 只管資料結構
3. **關注點分離** — 對應 app/controller、services、models、utils 分層
4. **組合優於繼承** — 用組合換彈性，依賴注入在 services（composition over inheritance）
5. **Rule of Three** — 出現第三例再抽象（wait for three instances before abstracting）
6. **函式保持精簡** — 約 20–50 行、單一目的；services 內由小函式組合
7. **依賴注入（DI）** — 建構子注入（constructor injection），利於測試
8. **先刪再抽象** — 先清死碼（dead code），再考慮 pattern
9. **分層測試** — controller、services、models 各層可獨立測（isolated tests）
10. **明確勝過巧妙** — 可讀性優先於炫技（explicit over clever）
