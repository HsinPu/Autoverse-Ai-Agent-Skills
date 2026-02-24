# Java 程式碼風格 — 參考資料

撰寫或審查 Java 程式碼時，依下列規範保持風格一致。以 **Google Java Style Guide** 為主、補充 **Oracle Code Conventions** 實用部分。基準版本為 **Java 11+**；專案若有自訂 Checkstyle / formatter 設定，以專案設定為準。

## 目錄（Table of Contents）

- [觸發時機](#觸發時機)
- [命名（Naming）](#命名naming)
- [格式（Formatting）](#格式formatting)
- [匯入（Imports）](#匯入imports)
- [Javadoc](#javadoc)
- [例外處理（Exceptions）](#例外處理exceptions)
- [程式結構與慣例](#程式結構與慣例)
- [Java 11+ 現代語法建議](#java-11-現代語法建議)
- [工具建議](#工具建議)
- [檢查清單（撰寫／審查時）](#檢查清單撰寫審查時)

---

## 觸發時機

- 使用者要求「統一風格」「整理格式」「符合 Google Style」
- 撰寫新 Java 程式碼或重構既有程式碼
- 進行 code review 時檢查風格與慣例

---

## 命名（Naming）

| 類型 | 風格 | 範例 |
|------|------|------|
| 套件（Package） | 全小寫、無底線 | `com.example.userservice` |
| 類別、介面 | `PascalCase` | `UserRepository`, `Serializable` |
| 方法 | `camelCase`、動詞開頭 | `getUserById`, `isValid` |
| 變數、參數 | `camelCase` | `maxRetries`, `userName` |
| 常數（`static final`） | `UPPER_SNAKE_CASE` | `MAX_SIZE`, `DEFAULT_TIMEOUT` |
| 型別參數（Generic） | 單一大寫字母 | `T`, `E`, `K`, `V` |
| Enum 值 | `UPPER_SNAKE_CASE` | `PENDING`, `IN_PROGRESS` |

- 名稱要有意義，避免單字元（迴圈用 `i`, `j`, `k` 可接受）。
- 布林方法建議用 `is`, `has`, `can`, `should` 前綴：`isEmpty()`, `hasPermission()`。
- 避免匈牙利命名法（Hungarian notation）與前綴如 `m_`, `f_`。
- 縮寫視為一般單字：`HttpUrl`（非 `HTTPUrl`）、`XmlParser`（非 `XMLParser`）。

---

## 格式（Formatting）

- **縮排**：4 個空格，不用 tab。
- **行寬**：建議每行 ≤ 100 字元（Google Style）；若專案未指定，可用 100 或 120。
- **大括號**：使用 K&R style（開括號同行、閉括號獨立行）。即使單行 `if` / `for` 也必須加大括號。
- **空行**：
  - 類別成員之間：邏輯分組間空一行。
  - 方法之間：空一行。
  - 方法內：依邏輯段落空行，避免超過一行空行。
- **空白**：
  - 關鍵字後一空格：`if (`, `for (`, `while (`。
  - 運算符兩側各一空格：`a + b`, `x == 1`。
  - 逗號後一空格：`method(a, b, c)`。
  - 大括號前一空格：`if (condition) {`。

```java
// 好的寫法
public Optional<User> findUserById(long userId) {
    if (userId <= 0) {
        throw new IllegalArgumentException("userId must be positive");
    }
    return userRepository.findById(userId);
}

// 避免：省略大括號、擠在一起
public Optional<User> findUserById(long userId) {
    if (userId <= 0)
        throw new IllegalArgumentException("userId must be positive");
    return userRepository.findById(userId);
}
```

### 長行斷行（Line Wrapping）

- 在運算符**之前**斷行。
- 方法鏈：每個 `.` 之前斷行並對齊。
- 參數列表過長時，每個參數一行並多縮排 8 格（或對齊括號）。

```java
// 方法鏈斷行
List<String> result = users.stream()
        .filter(u -> u.isActive())
        .map(User::getName)
        .sorted()
        .collect(Collectors.toList());

// 參數列表斷行
public ResponseEntity<UserResponse> createUser(
        @Valid @RequestBody CreateUserRequest request,
        @RequestHeader("Authorization") String token,
        HttpServletRequest httpRequest) {
    // ...
}
```

---

## 匯入（Imports）

- **禁止**萬用匯入（wildcard import）：不用 `import java.util.*`。
- 順序（各組之間空一行）：
  1. `java.*` / `javax.*`（標準庫）
  2. 第三方套件（`org.*`, `com.*` 等）
  3. 專案本地套件
- 每組內依字母排序。
- 禁止靜態萬用匯入（`import static ... .*`），但測試中的 assertion 與 mockito 可例外。
- 未使用的匯入應刪除。

```java
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.userservice.model.User;
import com.example.userservice.repository.UserRepository;
```

---

## Javadoc

- **所有公開 API**（`public` / `protected` 類別、方法、欄位）必須有 Javadoc。
- 第一句為摘要句（summary），以句號結尾。
- 依需要補充 `@param`、`@return`、`@throws`。
- `@param` 與 `@return` 不用完整句子，首字小寫。
- 私有方法視複雜度決定是否加 Javadoc；簡單者用行內註解即可。

```java
/**
 * Retrieves a user by their unique identifier.
 *
 * <p>Returns empty if no user matches the given ID.
 *
 * @param userId the unique identifier of the user
 * @return the matching user, or empty if not found
 * @throws IllegalArgumentException if userId is not positive
 */
public Optional<User> findUserById(long userId) {
    // ...
}
```

- **不要寫無意義的 Javadoc**（避免 `/** Gets the name. */` 這類重複方法名的註解）。
- 類別 Javadoc：說明職責、使用情境與執行緒安全性（若相關）。

---

## 例外處理（Exceptions）

- 捕捉**具體**例外，避免裸 `catch (Exception e)` 或 `catch (Throwable t)`。
- 不要吞掉例外（empty catch block）；至少記錄（log）。
- 使用標準例外：`IllegalArgumentException`（參數錯誤）、`IllegalStateException`（狀態錯誤）、`UnsupportedOperationException`（不支援）。
- 自訂例外繼承 `RuntimeException`（unchecked）除非呼叫者**必須**處理（checked）。
- 在 `finally` 或 try-with-resources 中釋放資源。

```java
// 好：try-with-resources 自動關閉
try (var reader = new BufferedReader(new FileReader(path))) {
    return reader.lines().collect(Collectors.joining("\n"));
} catch (FileNotFoundException e) {
    throw new ConfigNotFoundException("Config not found: " + path, e);
} catch (IOException e) {
    log.error("Failed to read config: {}", path, e);
    throw new ConfigReadException("Failed to read: " + path, e);
}

// 避免：吞掉例外
try {
    process(data);
} catch (Exception e) {
    // 不要這樣做
}
```

---

## 程式結構與慣例

### 類別結構順序

依以下順序排列類別成員（Google Style）：

1. 靜態常數（`static final`）
2. 靜態變數（`static`）
3. 實例欄位（instance fields）
4. 建構子（constructors）
5. 靜態方法（static methods）
6. 公開方法（public methods）
7. 受保護方法（protected methods）
8. 私有方法（private methods）
9. 內部類別（inner classes）

### 一般慣例

- **一個檔案一個頂層類別**。
- **偏好不可變**：欄位加 `final`；回傳 `Collections.unmodifiableList()` 或使用 `List.of()`、`Map.of()`。
- **使用 `Optional`**：方法可能回傳空值時用 `Optional<T>`，不要回傳 `null`。欄位與參數不用 `Optional`。
- **字串比較**：用 `"literal".equals(variable)` 避免 NPE；或先做 null 檢查。
- **相等性**：覆寫 `equals()` 時必須同時覆寫 `hashCode()`。
- **存取修飾詞**：盡量限縮可見度（最小權限原則）；優先 `private`，需要時才放寬。
- **避免魔術數字**：用有意義的常數取代。

```java
// 好：使用常數與 Optional
private static final int MAX_RETRY_COUNT = 3;
private static final Duration RETRY_DELAY = Duration.ofSeconds(2);

public Optional<User> findActiveUser(String email) {
    Objects.requireNonNull(email, "email must not be null");
    return userRepository.findByEmail(email)
            .filter(User::isActive);
}

// 避免：魔術數字、回傳 null
public User findActiveUser(String email) {
    User user = userRepository.findByEmail(email);
    if (user != null && user.getStatus() == 1) { // 1 是什麼？
        return user;
    }
    return null;
}
```

---

## Java 11+ 現代語法建議

以下為 Java 11+ 可用的現代語法，建議在新程式碼中使用：

### `var`（Java 10+）

右側型別明確時可用 `var` 減少冗餘；型別不明確時仍應顯式宣告。

```java
// 好：右側型別明確
var users = new ArrayList<User>();
var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

// 避免：右側型別不明確
var result = process(data); // result 是什麼型別？
```

### Text Blocks（Java 13+，正式 Java 15+）

多行字串用 text block 取代串接。

```java
// 好：text block
String query = """
        SELECT u.id, u.name, u.email
        FROM users u
        WHERE u.active = true
        ORDER BY u.name
        """;

// 避免：字串串接
String query = "SELECT u.id, u.name, u.email\n"
        + "FROM users u\n"
        + "WHERE u.active = true\n"
        + "ORDER BY u.name";
```

### `HttpClient`（Java 11+）

使用內建 `java.net.http.HttpClient` 取代第三方 HTTP 客戶端（簡單場景）。

```java
var client = HttpClient.newHttpClient();
var request = HttpRequest.newBuilder()
        .uri(URI.create("https://api.example.com/users"))
        .header("Accept", "application/json")
        .GET()
        .build();
var response = client.send(request, HttpResponse.BodyHandlers.ofString());
```

### Stream API 與 `Collectors`

善用 Stream API 處理集合，但避免過度巢狀或過長的鏈式呼叫。

```java
// 好：清楚的 stream pipeline
Map<String, List<User>> usersByDepartment = users.stream()
        .filter(User::isActive)
        .collect(Collectors.groupingBy(User::getDepartment));

// 避免：過於複雜的單一 stream
var result = data.stream()
        .flatMap(d -> d.getItems().stream())
        .filter(i -> i.getPrice() > 0)
        .map(i -> new AbstractMap.SimpleEntry<>(i.getCategory(), i.getPrice()))
        .collect(Collectors.groupingBy(
                Map.Entry::getKey,
                Collectors.averagingDouble(Map.Entry::getValue)))
        .entrySet().stream()
        .sorted(Map.Entry.comparingByValue())
        .collect(Collectors.toList());
// 拆成多步驟會更好讀
```

---

## 工具建議

- **格式化**：google-java-format、IntelliJ / Eclipse 內建 formatter（搭配 Google Style 設定檔）。
- **靜態分析**：Checkstyle（Google Checks）、SpotBugs、Error Prone。
- **建置工具**：Maven 或 Gradle；統一用 wrapper（`mvnw` / `gradlew`）。
- 專案內若有 `checkstyle.xml`、`.editorconfig` 或 formatter 設定，以專案設定為準。

---

## 檢查清單（撰寫／審查時）

- [ ] 命名符合上表慣例（PascalCase / camelCase / UPPER_SNAKE_CASE）
- [ ] 縮排 4 空格、行寬 ≤ 100（或專案設定）、大括號 K&R style
- [ ] 匯入無萬用匯入、分組排序、無未使用匯入
- [ ] 公開 API 有 Javadoc（含 `@param` / `@return` / `@throws`）
- [ ] 例外處理具體、不吞例外、資源用 try-with-resources
- [ ] 欄位盡量 `final`、回傳 `Optional` 取代 `null`
- [ ] 無魔術數字、存取修飾詞最小化
- [ ] 適當使用 `var`、text block、Stream API 等現代語法
- [ ] 與專案既有風格一致（含 formatter、Checkstyle 設定）
