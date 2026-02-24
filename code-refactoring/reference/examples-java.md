# Code Refactoring — 實作範例（Java）

以下為 **Java 11+** 的 BEFORE / AFTER 範例；共通原則與步驟見 [universal-principles.md](universal-principles.md)。SOLID 與分層架構的 Java 範例見 `java-code-style` Skill 的 `reference/design-patterns.md`。

## 目錄（Table of Contents）

- [Code Smells 範例](#code-smells-範例)
  - [Long Methods](#long-methods)
  - [Deeply Nested Conditionals](#deeply-nested-conditionals)
  - [Primitive Obsession](#primitive-obsession)
  - [Feature Envy](#feature-envy)
- [重構技巧範例](#重構技巧範例)
  - [Extract Method](#extract-method)
  - [Replace Conditional with Polymorphism](#replace-conditional-with-polymorphism)
  - [Introduce Parameter Object](#introduce-parameter-object)
  - [Replace Magic Numbers with Constants](#replace-magic-numbers-with-constants)
- [Java 特有重構](#java-特有重構)
  - [Optional 取代 null 檢查](#optional-取代-null-檢查)
  - [Stream 取代迴圈](#stream-取代迴圈)
  - [Record 取代樣板類別](#record-取代樣板類別)
  - [Try-with-resources](#try-with-resources)
  - [Enum 取代字串常數](#enum-取代字串常數)

---

## Code Smells 範例

### Long Methods

```java
// BEFORE: 一個方法做太多事
public OrderResult processOrder(Order order) {
    // 驗證（30 行）
    if (order.getItems() == null || order.getItems().isEmpty()) {
        throw new IllegalArgumentException("Order has no items");
    }
    for (OrderItem item : order.getItems()) {
        if (item.getQuantity() <= 0) {
            throw new IllegalArgumentException("Invalid quantity");
        }
    }

    // 計算（20 行）
    BigDecimal total = BigDecimal.ZERO;
    for (OrderItem item : order.getItems()) {
        total = total.add(item.getPrice().multiply(
                BigDecimal.valueOf(item.getQuantity())));
    }
    if (order.getCoupon() != null) {
        total = total.multiply(BigDecimal.ONE.subtract(order.getCoupon().getRate()));
    }

    // 儲存、通知、記錄…（還有 50 行）
    // ...
    return new OrderResult(order.getId(), total);
}

// AFTER: 拆成職責單一的方法
public OrderResult processOrder(Order order) {
    validateOrder(order);
    BigDecimal total = calculateTotal(order);
    Order saved = saveOrder(order, total);
    notifyCustomer(saved);
    return new OrderResult(saved.getId(), total);
}
```

### Deeply Nested Conditionals

```java
// BEFORE: 箭頭式巢狀
public BigDecimal getDiscount(User user, Order order) {
    if (user != null) {
        if (user.isPremium()) {
            if (order.getTotal().compareTo(HUNDRED) > 0) {
                if (order.getItems().size() > 5) {
                    return new BigDecimal("0.20");
                }
            }
        }
    }
    return BigDecimal.ZERO;
}

// AFTER: Guard clauses（early return）
public BigDecimal getDiscount(User user, Order order) {
    if (user == null) return BigDecimal.ZERO;
    if (!user.isPremium()) return BigDecimal.ZERO;
    if (order.getTotal().compareTo(HUNDRED) <= 0) return BigDecimal.ZERO;
    if (order.getItems().size() <= 5) return BigDecimal.ZERO;
    return new BigDecimal("0.20");
}
```

### Primitive Obsession

```java
// BEFORE: 到處用 String 表示 email，驗證散落各處
public class UserService {
    public void createUser(String name, String email, String phone) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
        // phone 驗證也散在其他地方…
    }

    public void updateEmail(long userId, String newEmail) {
        if (newEmail == null || !newEmail.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
        // 驗證重複…
    }
}

// AFTER: Value Object 封裝驗證與語意
public final class Email {
    private final String value;

    public Email(String value) {
        if (value == null || !value.contains("@")) {
            throw new IllegalArgumentException("Invalid email: " + value);
        }
        this.value = value.toLowerCase().strip();
    }

    public String getValue() { return value; }

    @Override
    public boolean equals(Object o) {
        return o instanceof Email e && value.equals(e.value);
    }

    @Override
    public int hashCode() { return value.hashCode(); }

    @Override
    public String toString() { return value; }
}

// 使用處不再需要重複驗證
public void createUser(String name, Email email, Phone phone) {
    // email 已驗證
}
```

### Feature Envy

```java
// BEFORE: 方法大量使用別物件的資料
public class ShippingCalculator {
    public BigDecimal calculate(Order order) {
        String zip = order.getCustomer().getAddress().getZip();
        BigDecimal weight = order.getItems().stream()
                .map(i -> i.getWeight().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal distance = distanceService.calculate(zip);
        return weight.multiply(distance).multiply(RATE);
    }
}

// AFTER: 讓 Order 提供計算所需的行為
public class Order {
    public BigDecimal getTotalWeight() {
        return items.stream()
                .map(i -> i.getWeight().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public String getShippingZip() {
        return customer.getAddress().getZip();
    }
}

public class ShippingCalculator {
    public BigDecimal calculate(Order order) {
        BigDecimal distance = distanceService.calculate(order.getShippingZip());
        return order.getTotalWeight().multiply(distance).multiply(RATE);
    }
}
```

---

## 重構技巧範例

### Extract Method

```java
// BEFORE: 一段做報表標頭的邏輯混在大方法裡
public void printReport(ReportData data) {
    // 標頭
    String separator = "=".repeat(60);
    System.out.println("Report: " + data.getTitle());
    System.out.println("Date: " + data.getDate());
    System.out.println(separator);
    // 內容（50 行）…
    // 頁尾（20 行）…
}

// AFTER: 抽出 printHeader
private void printHeader(ReportData data) {
    String separator = "=".repeat(60);
    System.out.println("Report: " + data.getTitle());
    System.out.println("Date: " + data.getDate());
    System.out.println(separator);
}

public void printReport(ReportData data) {
    printHeader(data);
    printBody(data);
    printFooter(data);
}
```

### Replace Conditional with Polymorphism

```java
// BEFORE: 依型別 switch
public double getArea(Shape shape) {
    switch (shape.getType()) {
        case "circle":
            return Math.PI * shape.getRadius() * shape.getRadius();
        case "rectangle":
            return shape.getWidth() * shape.getHeight();
        case "triangle":
            return shape.getBase() * shape.getHeight() / 2;
        default:
            throw new IllegalArgumentException("Unknown shape: " + shape.getType());
    }
}

// AFTER: 多型（sealed interface, Java 17+）
public sealed interface Shape permits Circle, Rectangle, Triangle {
    double getArea();
}

public record Circle(double radius) implements Shape {
    public double getArea() { return Math.PI * radius * radius; }
}

public record Rectangle(double width, double height) implements Shape {
    public double getArea() { return width * height; }
}

public record Triangle(double base, double height) implements Shape {
    public double getArea() { return base * height / 2; }
}
```

> Java 11 無 `sealed`，用一般 `interface` + `implements` 即可，模式相同。

### Introduce Parameter Object

```java
// BEFORE: 參數過多
public List<Product> searchProducts(
        String query,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String category,
        boolean inStock,
        String sortBy,
        String sortOrder) {
    // ...
}

// AFTER: 參數物件（Java 16+ record）
public record ProductSearchCriteria(
        String query,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String category,
        boolean inStock,
        SortOption sort) {

    public record SortOption(String field, Direction direction) {}
    public enum Direction { ASC, DESC }
}

public List<Product> searchProducts(ProductSearchCriteria criteria) {
    // ...
}
```

### Replace Magic Numbers with Constants

```java
// BEFORE
if (user.getAge() >= 18 && order.getTotal().compareTo(new BigDecimal("50")) >= 0) {
    applyDiscount(order, new BigDecimal("0.10"));
}

// AFTER
private static final int MINIMUM_AGE = 18;
private static final BigDecimal DISCOUNT_THRESHOLD = new BigDecimal("50");
private static final BigDecimal STANDARD_DISCOUNT = new BigDecimal("0.10");

if (user.getAge() >= MINIMUM_AGE
        && order.getTotal().compareTo(DISCOUNT_THRESHOLD) >= 0) {
    applyDiscount(order, STANDARD_DISCOUNT);
}
```

---

## Java 特有重構

### Optional 取代 null 檢查

```java
// BEFORE: 多層 null 檢查
public String getUserCity(Order order) {
    if (order != null) {
        User user = order.getUser();
        if (user != null) {
            Address address = user.getAddress();
            if (address != null) {
                return address.getCity();
            }
        }
    }
    return "Unknown";
}

// AFTER: Optional 鏈
public String getUserCity(Order order) {
    return Optional.ofNullable(order)
            .map(Order::getUser)
            .map(User::getAddress)
            .map(Address::getCity)
            .orElse("Unknown");
}
```

### Stream 取代迴圈

```java
// BEFORE: 迴圈篩選 + 轉換 + 收集
public List<String> getActiveUserEmails(List<User> users) {
    List<String> emails = new ArrayList<>();
    for (User user : users) {
        if (user.isActive()) {
            String email = user.getEmail().toLowerCase();
            emails.add(email);
        }
    }
    Collections.sort(emails);
    return emails;
}

// AFTER: Stream pipeline
public List<String> getActiveUserEmails(List<User> users) {
    return users.stream()
            .filter(User::isActive)
            .map(User::getEmail)
            .map(String::toLowerCase)
            .sorted()
            .collect(Collectors.toList());
}
```

> Stream 適合篩選-轉換-收集的模式。副作用多或邏輯複雜時，迴圈可能更清楚。

### Record 取代樣板類別

```java
// BEFORE: 傳統 DTO（Java 11）— 大量樣板程式碼
public final class UserResponse {
    private final long id;
    private final String email;
    private final String name;

    public UserResponse(long id, String email, String name) {
        this.id = id;
        this.email = email;
        this.name = name;
    }

    public long getId() { return id; }
    public String getEmail() { return email; }
    public String getName() { return name; }

    @Override
    public boolean equals(Object o) { /* 15 行 */ }

    @Override
    public int hashCode() { return Objects.hash(id, email, name); }

    @Override
    public String toString() {
        return "UserResponse{id=%d, email='%s', name='%s'}".formatted(id, email, name);
    }
}

// AFTER: Record（Java 16+）— 一行搞定
public record UserResponse(long id, String email, String name) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getName());
    }
}
```

### Try-with-resources

```java
// BEFORE: 手動關閉資源（容易遺漏、finally 冗長）
public String readFile(Path path) throws IOException {
    BufferedReader reader = null;
    try {
        reader = Files.newBufferedReader(path);
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line).append('\n');
        }
        return sb.toString();
    } finally {
        if (reader != null) {
            reader.close();
        }
    }
}

// AFTER: try-with-resources（自動關閉）
public String readFile(Path path) throws IOException {
    try (BufferedReader reader = Files.newBufferedReader(path)) {
        return reader.lines().collect(Collectors.joining("\n"));
    }
}
```

### Enum 取代字串常數

```java
// BEFORE: 字串常數散落各處，打錯字不會編譯錯誤
public void updateOrderStatus(Order order, String status) {
    if ("pending".equals(status)) { /* ... */ }
    else if ("processing".equals(status)) { /* ... */ }
    else if ("shipped".equals(status)) { /* ... */ }
    // "shiped" 打錯字也不會報錯
}

// AFTER: Enum（編譯期安全、可附帶行為）
public enum OrderStatus {
    PENDING("待處理"),
    PROCESSING("處理中"),
    SHIPPED("已出貨"),
    DELIVERED("已送達"),
    CANCELLED("已取消");

    private final String label;

    OrderStatus(String label) { this.label = label; }

    public String getLabel() { return label; }
}

public void updateOrderStatus(Order order, OrderStatus status) {
    // 編譯期就能抓到錯誤
    switch (status) {
        case PENDING -> { /* ... */ }
        case PROCESSING -> { /* ... */ }
        case SHIPPED -> { /* ... */ }
        case DELIVERED -> { /* ... */ }
        case CANCELLED -> { /* ... */ }
    }
}
```
