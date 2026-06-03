# Java 設計模式（Design Patterns）

以基本設計原則撰寫可維護（maintainable）的 Java 程式碼，讓系統易於理解、測試與修改。

## 目錄（Table of Contents）

- [觸發時機（When to Use）](#觸發時機when-to-use)
- [核心概念（Core Concepts）](#核心概念core-concepts)
- [快速入門（Quick Start）](#快速入門quick-start)
- [基礎模式（Fundamental Patterns）](#基礎模式fundamental-patterns)
- [進階模式（Advanced Patterns）](#進階模式advanced-patterns)
- [檢查清單（Best Practices Summary）](#檢查清單best-practices-summary)

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
| **SOLID** | 五大原則的統稱：SRP、OCP、LSP、ISP、DIP（見下方各 Pattern）。 |
| **KISS** | 選擇最簡單且可行的解法（Keep It Simple）；複雜度須有具體需求才合理。 |
| **偏好不可變（Prefer Immutability）** | 物件建立後不可改變，減少副作用與並行問題。 |
| **組合優於繼承（Composition Over Inheritance）** | 用組合物件建構行為，而非繼承擴充類別。 |
| **Rule of Three** | 出現第三個實例再考慮抽象；適度重複優於過早抽象。 |

---

## 快速入門（Quick Start）

需要依型別取得處理器時，用 `Map` 即可，不必上 Abstract Factory：

```java
private static final Map<String, Supplier<Formatter>> FORMATTERS = Map.of(
        "json", JsonFormatter::new,
        "csv", CsvFormatter::new
);

public static Formatter getFormatter(String type) {
    Supplier<Formatter> supplier = FORMATTERS.get(type);
    if (supplier == null) {
        throw new IllegalArgumentException("Unknown format: " + type);
    }
    return supplier.get();
}
```

---

## 基礎模式（Fundamental Patterns）

### Pattern 1：單一職責原則（SRP）— Controller 與 Service 分離

每個類別只應有**一個變更理由**（single reason to change）。HTTP 在 Controller、業務邏輯在 Service，職責分離。

```java
// 不好：Controller 包辦 HTTP、驗證、DB、回應格式（違反 SRP）
@RestController
public class UserController {
    @Autowired
    private JdbcTemplate jdbc;

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> body) {
        String email = (String) body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("email required");
        }
        jdbc.update("INSERT INTO users (email, name) VALUES (?, ?)",
                email, body.get("name"));
        return ResponseEntity.status(201).body(body);
    }
}

// 好：職責分離（separated concerns）
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(CreateUserRequest request) {
        var user = new User(request.getEmail(), request.getName());
        return userRepository.save(user);
    }
}

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserResponse.from(user));
    }
}
```

如此 HTTP 變更不影響業務邏輯（business logic），反之亦然。

### Pattern 2：開放封閉原則（OCP）— 對擴充開放、對修改封閉

新增行為時不修改既有程式碼，而是透過擴充（新增類別或實作）。

```java
// 不好：每新增一種通知就要改 if-else（違反 OCP）
public class NotificationService {
    public void send(String type, String message, String target) {
        if ("email".equals(type)) {
            sendEmail(target, message);
        } else if ("sms".equals(type)) {
            sendSms(target, message);
        } else if ("push".equals(type)) {
            sendPush(target, message);
        }
        // 每次新增通知管道都要改這裡
    }
}

// 好：用介面擴充（open for extension）
public interface NotificationSender {
    String getType();
    void send(String target, String message);
}

@Service
public class NotificationService {
    private final Map<String, NotificationSender> senders;

    public NotificationService(List<NotificationSender> senderList) {
        this.senders = senderList.stream()
                .collect(Collectors.toMap(
                        NotificationSender::getType,
                        Function.identity()));
    }

    public void send(String type, String target, String message) {
        NotificationSender sender = senders.get(type);
        if (sender == null) {
            throw new IllegalArgumentException("Unknown notification type: " + type);
        }
        sender.send(target, message);
    }
}
```

新增通知管道只需實作 `NotificationSender` 介面，無須修改 `NotificationService`。

### Pattern 3：介面隔離原則（ISP）— 小而專一的介面

客戶端不應被迫依賴不需要的方法。大介面拆成小介面。

```java
// 不好：一個大介面塞所有操作
public interface UserRepository {
    User findById(long id);
    List<User> findAll();
    User save(User user);
    void delete(long id);
    List<User> findByDepartment(String dept);
    Map<String, Long> countByDepartment();
    void exportToCsv(Path path);
}

// 好：依職責拆分
public interface ReadableUserRepository {
    Optional<User> findById(long id);
    List<User> findAll();
}

public interface WritableUserRepository {
    User save(User user);
    void delete(long id);
}

public interface UserQueryRepository {
    List<User> findByDepartment(String dept);
    Map<String, Long> countByDepartment();
}
```

如此只需讀取的服務只依賴 `ReadableUserRepository`，不必知道 `delete` 或 `exportToCsv` 的存在。

### Pattern 4：組合優於繼承（Composition Over Inheritance）

用組合物件建構行為（composition），較好測試、較彈性；深層繼承（inheritance）在複雜情境較僵固。

```java
// 繼承（inheritance）：僵固、難 mock
public class EmailNotificationService extends BaseNotificationService {
    @Override
    public void send(User user, String message) {
        // 被綁定在 BaseNotificationService 的實作細節
        SmtpClient smtp = getSmtpClient(); // 繼承來的，難以 mock
        smtp.send(user.getEmail(), message);
    }
}

// 組合（composition）：可注入、易測
public class NotificationService {
    private final EmailSender emailSender;
    private final SmsSender smsSender;

    public NotificationService(EmailSender emailSender, SmsSender smsSender) {
        this.emailSender = emailSender;
        this.smsSender = smsSender;
    }

    public void notify(User user, String message, Set<Channel> channels) {
        if (channels.contains(Channel.EMAIL)) {
            emailSender.send(user.getEmail(), message);
        }
        if (channels.contains(Channel.SMS) && user.getPhone() != null) {
            smsSender.send(user.getPhone(), message);
        }
    }
}

// 測試時注入 Fake
var service = new NotificationService(
        new FakeEmailSender(),
        new FakeSmsSender()
);
```

---

## 進階模式（Advanced Patterns）

### Pattern 5：依賴反轉原則（DIP）與依賴注入（DI）

高層模組不應依賴低層模組，兩者都應依賴抽象（interface）。在 Spring 中透過建構子注入（constructor injection）實現。

```java
// 定義抽象
public interface UserRepository {
    Optional<User> findById(long id);
    User save(User user);
}

public interface CacheService {
    Optional<String> get(String key);
    void set(String key, String value, Duration ttl);
}

// Service 只依賴抽象，不知道具體實作
@Service
public class UserService {
    private static final Duration CACHE_TTL = Duration.ofMinutes(5);

    private final UserRepository userRepository;
    private final CacheService cacheService;
    private final Logger log;

    public UserService(
            UserRepository userRepository,
            CacheService cacheService,
            Logger log) {
        this.userRepository = userRepository;
        this.cacheService = cacheService;
        this.log = log;
    }

    public Optional<User> getUser(long userId) {
        String cacheKey = "user:" + userId;
        Optional<String> cached = cacheService.get(cacheKey);
        if (cached.isPresent()) {
            log.info("Cache hit for user {}", userId);
            return Optional.of(User.fromJson(cached.get()));
        }

        Optional<User> user = userRepository.findById(userId);
        user.ifPresent(u ->
                cacheService.set(cacheKey, u.toJson(), CACHE_TTL));
        return user;
    }
}

// 正式環境：Spring 自動注入具體實作
@Repository
public class JpaUserRepository implements UserRepository { /* ... */ }

@Component
public class RedisCacheService implements CacheService { /* ... */ }

// 測試環境：注入 Fake
var service = new UserService(
        new InMemoryUserRepository(),
        new FakeCacheService(),
        new NullLogger()
);
```

### Pattern 6：不可變物件（Immutability）

物件建立後不可修改，消除副作用、簡化併發，是 Java 中最有效的防禦手段之一。

```java
// 不好：可變物件，任何持有引用的地方都可能改動狀態
public class User {
    private String name;
    private String email;
    private List<String> roles;

    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public List<String> getRoles() { return roles; } // 外部可修改內部 list
}

// 好：不可變物件
public final class User {
    private final String name;
    private final String email;
    private final List<String> roles;

    public User(String name, String email, List<String> roles) {
        this.name = Objects.requireNonNull(name);
        this.email = Objects.requireNonNull(email);
        this.roles = List.copyOf(roles); // 防禦性複製
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public List<String> getRoles() { return roles; } // 已是不可變 list

    public User withEmail(String newEmail) {
        return new User(this.name, newEmail, this.roles);
    }
}
```

Java 16+ 的 `record` 天生不可變，適合 DTO / Value Object：

```java
// Java 16+：record 自帶 final 欄位、equals、hashCode、toString
public record CreateUserRequest(
        @NotBlank String email,
        @NotBlank String name,
        List<String> roles) {

    public CreateUserRequest {
        roles = roles != null ? List.copyOf(roles) : List.of();
    }
}
```

### Pattern 7：關注點分離（Separation of Concerns）— 分層架構

程式碼分層、各層職責清楚；上層只依賴下層，依賴方向單向。

```
┌──────────────────────────────────────────────────────────┐
│  Controller Layer — 解析 request、呼叫 service、組 response  │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│  Service Layer — 業務邏輯、領域規則、交易管理；盡量無 I/O 副作用  │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│  Repository Layer — 資料存取、SQL、外部 API、cache          │
└──────────────────────────────────────────────────────────┘
```

```java
// Repository：資料存取
@Repository
public class JpaUserRepository implements UserRepository {
    private final JpaEntityManager em;

    public JpaUserRepository(JpaEntityManager em) {
        this.em = em;
    }

    @Override
    public Optional<User> findById(long userId) {
        return Optional.ofNullable(em.find(User.class, userId));
    }
}

// Service：業務邏輯
@Service
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }
}

// Controller：HTTP 層
@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable long id) {
        User user = userService.getUser(id);
        return UserResponse.from(user);
    }
}
```

### Pattern 8：避免常見反模式（Anti-Patterns）

**不要對外暴露內部型別**（例如 JPA Entity；應轉成 Response DTO）：

```java
// 不好：API 直接回傳 JPA Entity（洩漏內部結構、可能引起 lazy loading 問題）
@GetMapping("/{id}")
public User getUser(@PathVariable long id) {
    return userRepository.findById(id).orElseThrow();
}

// 好：用 Response DTO 轉換
@GetMapping("/{id}")
public UserResponse getUser(@PathVariable long id) {
    User user = userService.getUser(id);
    return UserResponse.from(user);
}
```

**不要在 Service 中操作 HttpServletRequest/Response**（keep service layer HTTP-agnostic）：

```java
// 不好：Service 耦合 HTTP
@Service
public class ReportService {
    public void generateReport(HttpServletResponse response) {
        response.setContentType("application/pdf");
        // 業務邏輯與 HTTP 混在一起
    }
}

// 好：Service 只回傳資料，Controller 處理 HTTP
@Service
public class ReportService {
    public byte[] generateReport(ReportRequest request) {
        // 純業務邏輯，回傳 byte[]
        return pdfGenerator.generate(request);
    }
}

@GetMapping("/report")
public ResponseEntity<byte[]> getReport(@Valid ReportRequest request) {
    byte[] pdf = reportService.generateReport(request);
    return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
}
```

**不要在迴圈中執行 DB 查詢（N+1 問題）**：

```java
// 不好：N+1 查詢
List<Order> orders = orderRepository.findAll();
for (Order order : orders) {
    User user = userRepository.findById(order.getUserId()); // N 次查詢
    order.setUserName(user.getName());
}

// 好：批次查詢
List<Order> orders = orderRepository.findAll();
Set<Long> userIds = orders.stream()
        .map(Order::getUserId)
        .collect(Collectors.toSet());
Map<Long, User> usersById = userRepository.findAllById(userIds).stream()
        .collect(Collectors.toMap(User::getId, Function.identity()));
orders.forEach(order ->
        order.setUserName(usersById.get(order.getUserId()).getName()));
```

---

## 檢查清單（Best Practices Summary）

- [ ] **SRP** — 每個類別只有一個變更理由（single reason to change）
- [ ] **OCP** — 新增行為時擴充而非修改（extend, don't modify）
- [ ] **ISP** — 介面小而專一，客戶端不依賴不需要的方法
- [ ] **DIP / DI** — 依賴抽象、建構子注入（constructor injection）
- [ ] **組合優於繼承** — 用組合換彈性與可測性（composition over inheritance）
- [ ] **不可變** — 欄位 `final`、防禦性複製、`List.of()` / `Map.of()`
- [ ] **分層架構** — Controller → Service → Repository，依賴方向單向
- [ ] **KISS** — 選最簡單可行的解法（simplest solution that works）
- [ ] **Rule of Three** — 出現第三例再考慮抽象（wait before abstracting）
- [ ] **不暴露內部型別** — Entity 轉 DTO 再回傳（no entity leaking）
- [ ] **避免 N+1** — 批次查詢取代迴圈查詢（batch query over loop query）
- [ ] **明確優於聰明** — 可讀性優先於炫技（explicit over clever）
