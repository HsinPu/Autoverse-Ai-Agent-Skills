# Python 設計模式（Design Patterns）

以基本設計原則撰寫可維護（maintainable）的 Python 程式碼，讓系統易於理解、測試與修改。

---

## 觸發時機（When to Use）

- 設計新元件或服務（designing new components or services）
- 重構複雜或糾結的程式碼（refactoring complex or tangled code）
- 決定是否要抽抽象（deciding whether to abstract）
- 在繼承（inheritance）與組合（composition）之間做選擇
- 評估程式複雜度與耦合（evaluating complexity and coupling）
- 規劃模組化架構（planning modular architecture）

---

## 核心概念（Core Concepts）

| 概念 | 說明 |
|------|------|
| **KISS** | 選擇最簡單且可行的解法（Keep It Simple）；複雜度須有具體需求才合理。 |
| **單一職責（SRP）** | 每個單元只有一個變更理由；關注點拆成獨立 component。 |
| **組合優於繼承** | 用組合物件建構行為，而非繼承擴充類別（composition over inheritance）。 |
| **Rule of Three** | 出現第三個實例再考慮抽象；適度重複優於過早抽象。 |

---

## 快速入門（Quick Start）

需要依名稱取得 formatter 時，用 dict 即可，不必上 Factory / registry pattern：

```python
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
    def register(cls, name: str):
        def decorator(formatter_cls):
            cls._formatters[name] = formatter_cls
            return formatter_cls
        return decorator

    @classmethod
    def create(cls, name: str) -> Formatter:
        return cls._formatters[name]()

@OutputFormatterFactory.register("json")
class JsonFormatter(Formatter):
    ...

# 簡單做法：用 dict 即可
FORMATTERS = {
    "json": JsonFormatter,
    "csv": CsvFormatter,
    "xml": XmlFormatter,
}

def get_formatter(name: str) -> Formatter:
    if name not in FORMATTERS:
        raise ValueError(f"Unknown format: {name}")
    return FORMATTERS[name]()
```

在此情境下 Factory pattern 只增加程式碼而沒有增加價值；把 pattern 留給真正能解決問題的場合。

### Pattern 2：單一職責（SRP）— Handler 與 Service 分離

每個 class 或 function 只應有**一個變更理由**（single reason to change）。API 在 handler、業務邏輯在 service，職責分離。

```python
# 不好：Handler 包辦 HTTP、驗證、DB、回應格式（違反 SRP）
class UserHandler:
    async def create_user(self, request: Request) -> Response:
        data = await request.json()
        if not data.get("email"):
            return Response({"error": "email required"}, status=400)
        user = await db.execute(
            "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *",
            data["email"], data["name"]
        )
        return Response({"id": user.id, "email": user.email}, status=201)

# 好：職責分離（separated concerns）
class UserService:
    """僅負責業務邏輯（business logic only）。"""

    def __init__(self, repo: UserRepository) -> None:
        self._repo = repo

    async def create_user(self, data: CreateUserInput) -> User:
        user = User(email=data.email, name=data.name)
        return await self._repo.save(user)

class UserHandler:
    """僅負責 HTTP 層（HTTP concerns only）。"""

    def __init__(self, service: UserService) -> None:
        self._service = service

    async def create_user(self, request: Request) -> Response:
        data = CreateUserInput(**(await request.json()))
        user = await self._service.create_user(data)
        return Response(user.to_dict(), status=201)
```

如此 HTTP 變更不影響業務邏輯（business logic），反之亦然。

### Pattern 3：關注點分離（Separation of Concerns）

程式碼分層（layered）、各層職責清楚；上層只依賴下層，依賴方向單向。

```
┌─────────────────────────────────────────────────────┐
│  API Layer (handlers) — 解析 request、呼叫 service、組 response │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  Service Layer — 業務邏輯、領域規則、協調操作；盡量純函式        │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  Repository Layer — 資料存取、SQL、外部 API、cache   │
└─────────────────────────────────────────────────────┘
```

```python
# Repository：資料存取
class UserRepository:
    async def get_by_id(self, user_id: str) -> User | None:
        row = await self._db.fetchrow(
            "SELECT * FROM users WHERE id = $1", user_id
        )
        return User(**row) if row else None

# Service：業務邏輯
class UserService:
    def __init__(self, repo: UserRepository) -> None:
        self._repo = repo

    async def get_user(self, user_id: str) -> User:
        user = await self._repo.get_by_id(user_id)
        if user is None:
            raise UserNotFoundError(user_id)
        return user

# Handler：HTTP 層
@app.get("/users/{user_id}")
async def get_user(user_id: str) -> UserResponse:
    user = await user_service.get_user(user_id)
    return UserResponse.from_user(user)
```

### Pattern 4：組合優於繼承（Composition Over Inheritance）

用組合物件建構行為（composition），較好測試、較彈性；繼承（inheritance）在此情境較僵固。

```python
# 繼承（inheritance）：僵固、難 mock
class EmailNotificationService(NotificationService):
    def __init__(self):
        super().__init__()
        self._smtp = SmtpClient()  # 難以 mock（hard to mock）

    def notify(self, user: User, message: str) -> None:
        self._smtp.send(user.email, message)

# 組合（composition）：可注入、易測
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

    async def notify(
        self,
        user: User,
        message: str,
        channels: set[str] | None = None,
    ) -> None:
        channels = channels or {"email"}
        if "email" in channels:
            await self._email.send(user.email, message)
        if "sms" in channels and self._sms and user.phone:
            await self._sms.send(user.phone, message)
        if "push" in channels and self._push and user.device_token:
            await self._push.send(user.device_token, message)

# 測試時注入 Fake
service = NotificationService(
    email_sender=FakeEmailSender(),
    sms_sender=FakeSmsSender(),
)
```

---

## 進階模式（Advanced Patterns）

### Pattern 5：Rule of Three

兩個相似函式先不要抽象（don’t abstract yet）；等第三個案例出現再考慮是否真有共通 pattern。錯誤的抽象比適度重複（duplication）更難維護。

```python
# 兩段很像？先別抽象
def process_orders(orders: list[Order]) -> list[Result]:
    ...

def process_returns(returns: list[Return]) -> list[Result]:
    ...

# 驗證、處理、錯誤都不同時，重複往往比硬抽更好
# 第三個案例出現後，再評估是否要抽象
```

### Pattern 6：函式長度與職責

函式保持單一目的（single purpose）；過長（約 20–50 行依複雜度）、多用途或巢狀過深（3 層以上）時拆成小函式。

```python
# 不好：一函式包辦驗證、庫存、付款、通知
def process_order(order: Order) -> Result:
    # 幾十行混在一起...
    pass

# 好：由多個聚焦函式組成（focused functions）
def process_order(order: Order) -> Result:
    """處理訂單完整流程（process order workflow）。"""
    validate_order(order)
    reserve_inventory(order)
    payment_result = charge_payment(order)
    send_confirmation(order, payment_result)
    return Result(success=True, order_id=order.id)
```

### Pattern 7：依賴注入（Dependency Injection）

依賴透過建構子注入（constructor injection），方便替換成 Fake / Mock，利於測試（testability）。

```python
from typing import Protocol

class Logger(Protocol):
    def info(self, msg: str, **kwargs) -> None: ...
    def error(self, msg: str, **kwargs) -> None: ...

class Cache(Protocol):
    async def get(self, key: str) -> str | None: ...
    async def set(self, key: str, value: str, ttl: int) -> None: ...

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
            self._logger.info("Cache hit", user_id=user_id)
            return User.from_json(cached)
        user = await self._repo.get_by_id(user_id)
        if user:
            await self._cache.set(f"user:{user_id}", user.to_json(), ttl=300)
        return user

# 正式環境
service = UserService(
    repository=PostgresUserRepository(db),
    cache=RedisCache(redis),
    logger=StructlogLogger(),
)

# 測試環境
service = UserService(
    repository=InMemoryUserRepository(),
    cache=FakeCache(),
    logger=NullLogger(),
)
```

### Pattern 8：避免常見反模式（Anti-Patterns）

**不要對外暴露內部型別**（例如 ORM model；應轉成 response schema）：

```python
# 不好：API 直接回傳 ORM model
@app.get("/users/{id}")
def get_user(id: str) -> UserModel:
    return db.query(UserModel).get(id)

# 好：用 response schema 轉換
@app.get("/users/{id}")
def get_user(id: str) -> UserResponse:
    user = db.query(UserModel).get(id)
    return UserResponse.from_orm(user)
```

**不要把 I/O 與業務邏輯混在一起**（keep business logic pure / testable）：

```python
# 不好：SQL 寫在業務邏輯裡
def calculate_discount(user_id: str) -> float:
    user = db.query("SELECT * FROM users WHERE id = ?", user_id)
    orders = db.query("SELECT * FROM orders WHERE user_id = ?", user_id)
    # 業務邏輯與資料存取混在一起

# 好：用 Repository 取資料，業務邏輯保持純函式
def calculate_discount(user: User, order_history: list[Order]) -> float:
    if len(order_history) > 10:
        return 0.15
    return 0.0
```

---

## 檢查清單（Best Practices Summary）

- [ ] **KISS** — 選最簡單可行的解法（simplest solution that works）
- [ ] **單一職責（SRP）** — 每個單元只有一個變更理由
- [ ] **關注點分離** — 分層清楚、各層職責明確（separation of concerns）
- [ ] **組合優於繼承** — 用組合換彈性與可測性（composition over inheritance）
- [ ] **Rule of three** — 出現第三例再考慮抽象（wait before abstracting）
- [ ] **函式短而專一** — 約 20–50 行、單一目的（single purpose）
- [ ] **依賴注入（DI）** — 建構子注入，利於測試（constructor injection）
- [ ] **先刪再抽象** — 移除 dead code 再考慮 pattern
- [ ] **分層測試** — 各層可獨立測（test each layer in isolation）
- [ ] **明確優於聰明** — 可讀性優先於炫技（explicit over clever）
