# 專案結構與分層（Project Structure）

## 原則

- **依賴方向固定**：web/controller -> application/service -> domain -> infrastructure/repository。
- **把框架放在邊界**：domain 不依賴 Spring；把 Spring annotation 集中在 adapter 層。
- **DTO 與 Entity 分離**：web DTO（request/response）不要直接用 JPA entity。

## 建議 package 結構（單體）

```text
com.example.app/
  AppApplication.java
  config/
  web/
    controller/
    dto/
    advice/
  application/
    service/
  domain/
    model/
    repository/
  infrastructure/
    persistence/
    client/
```

## 常見坑

- controller 直接調 repository（會把交易與商業規則散落）
- entity 直接做 JSON serialization（lazy loading、cycle、security data leak）
- package 只用 `util`/`common` 堆垃圾（優先按 bounded context 或 layer 整理）
