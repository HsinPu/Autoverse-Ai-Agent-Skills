# Code Refactoring — 實作範例（TypeScript）

以下為 **TypeScript** 的 BEFORE / AFTER 範例；共通原則與步驟見 [universal-principles.md](universal-principles.md)。Java、Python、C#、Go 等僅語法不同，模式相同。

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

---

## Code Smells 範例

### Long Methods

```typescript
// BEFORE: 一個方法做太多事
function processOrder(order: Order) {
  // 100 lines of validation, calculation, notification, logging...
}

// AFTER: 拆成職責單一的方法
function processOrder(order: Order) {
  validateOrder(order);
  const total = calculateTotal(order);
  saveOrder(order, total);
  notifyCustomer(order);
}
```

### Deeply Nested Conditionals

```typescript
// BEFORE: 箭頭式巢狀
function getDiscount(user: User, order: Order) {
  if (user) {
    if (user.isPremium) {
      if (order.total > 100) {
        if (order.items.length > 5) {
          return 0.2;
        }
      }
    }
  }
  return 0;
}

// AFTER: Early returns（guard clauses）
function getDiscount(user: User, order: Order) {
  if (!user) return 0;
  if (!user.isPremium) return 0;
  if (order.total <= 100) return 0;
  if (order.items.length <= 5) return 0;
  return 0.2;
}
```

### Primitive Obsession

```typescript
// BEFORE: 到處用基本型別
function createUser(name: string, email: string, phone: string) {
  if (!email.includes('@')) throw new Error('Invalid email');
  // more validation...
}

// AFTER: Value objects
class Email {
  constructor(private value: string) {
    if (!value.includes('@')) throw new Error('Invalid email');
  }
  toString() { return this.value; }
}

function createUser(name: string, email: Email, phone: Phone) {
  // Email 已驗證
}
```

### Feature Envy

```typescript
// BEFORE: 方法大量使用別物件的資料
function calculateShipping(order: Order) {
  const address = order.customer.address;
  const weight = order.items.reduce((sum, i) => sum + i.weight, 0);
  const distance = calculateDistance(address.zip);
  return weight * distance * 0.01;
}

// AFTER: 把方法移到資料所在處
class Order {
  calculateShipping() {
    return this.totalWeight * this.customer.shippingDistance * 0.01;
  }
}
```

---

## 重構技巧範例

### Extract Method

```typescript
// 找出「只做一件事」的區塊 → 抽成新方法 → 原處改為呼叫

function printReport(data: ReportData) {
  const header = `Report: ${data.title}\nDate: ${data.date}\n${'='.repeat(40)}`;
  console.log(header);
  // ...
}

// 抽成
function printHeader(data: ReportData) {
  const header = `Report: ${data.title}\nDate: ${data.date}\n${'='.repeat(40)}`;
  console.log(header);
}

function printReport(data: ReportData) {
  printHeader(data);
  // ...
}
```

### Replace Conditional with Polymorphism

```typescript
// BEFORE: 依型別 switch
function getArea(shape: Shape) {
  switch (shape.type) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
    case 'triangle': return shape.base * shape.height / 2;
  }
}

// AFTER: 多型
interface Shape {
  getArea(): number;
}

class Circle implements Shape {
  constructor(private radius: number) {}
  getArea() { return Math.PI * this.radius ** 2; }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}
  getArea() { return this.width * this.height; }
}
```

### Introduce Parameter Object

```typescript
// BEFORE: 參數過多
function searchProducts(
  query: string,
  minPrice: number,
  maxPrice: number,
  category: string,
  inStock: boolean,
  sortBy: string,
  sortOrder: string
) { ... }

// AFTER: 參數物件
interface SearchParams {
  query: string;
  priceRange: { min: number; max: number };
  category?: string;
  inStock?: boolean;
  sort?: { by: string; order: 'asc' | 'desc' };
}

function searchProducts(params: SearchParams) { ... }
```

### Replace Magic Numbers with Constants

```typescript
// BEFORE
if (user.age >= 18 && order.total >= 50) {
  applyDiscount(order, 0.1);
}

// AFTER
const MINIMUM_AGE = 18;
const DISCOUNT_THRESHOLD = 50;
const STANDARD_DISCOUNT = 0.1;

if (user.age >= MINIMUM_AGE && order.total >= DISCOUNT_THRESHOLD) {
  applyDiscount(order, STANDARD_DISCOUNT);
}
```
