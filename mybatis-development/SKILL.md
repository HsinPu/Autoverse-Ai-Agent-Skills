---
name: mybatis-development
description: Read when using MyBatis (and MyBatis-Spring / MyBatis-Spring-Boot-Starter) in Java projects. Provides best practices for mapper design, XML/dynamic SQL, result mapping, Spring transaction integration, performance, and security.
always: true
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# MyBatis 開發（MyBatis Development）

**在使用 MyBatis（含 MyBatis-Spring / Spring Boot Starter）撰寫資料存取層時請讀取本 skill。**

本 skill 以 MyBatis / MyBatis-Spring 官方文件為優先依據，整理偏實務的最佳做法：Mapper 與 XML 結構、參數與結果映射、動態 SQL、與 Spring 交易整合、效能與安全注意事項。

## 適用範圍（Assumptions）

- MyBatis 3.5+；若搭配 Spring，預設使用 MyBatis-Spring（或 Spring Boot Starter）
- 預設以「Mapper interface + XML mapper」為主；簡單查詢可用 annotations，但複雜 mapping 仍以 XML 為優先

## 進階與參考（Bundled resources）

- **Mapper / XML 最佳實務**：命名、參數綁定、ResultMap、SQL fragments、Dynamic SQL，見 [reference/mapper-xml.md](reference/mapper-xml.md)。
- **Spring 整合與交易**：`SqlSessionTemplate`、Mapper 注入、`@Transactional`、Batch Executor 限制，見 [reference/spring-integration.md](reference/spring-integration.md)。
- **效能**：N+1、nested select vs join/nested results、cursor、RowBounds、cache 與 timeout/fetchSize，見 [reference/performance.md](reference/performance.md)。
- **安全**：`#{}` vs `${}`、動態識別字白名單、SQL injection 風險與防護，見 [reference/security.md](reference/security.md)。

---

## 外部參考（官方）

- MyBatis 3 Reference：`https://mybatis.org/mybatis-3/`
- MyBatis 3 Configuration：`https://mybatis.org/mybatis-3/configuration.html`
- MyBatis 3 Mapper XML Files：`https://mybatis.org/mybatis-3/sqlmap-xml.html`
- MyBatis 3 Dynamic SQL：`https://mybatis.org/mybatis-3/dynamic-sql.html`
- MyBatis 3 Java API：`https://mybatis.org/mybatis-3/java-api.html`
- MyBatis-Spring Reference：`https://mybatis.org/spring/`
- MyBatis-Spring Transactions：`https://mybatis.org/spring/transactions.html`
- MyBatis-Spring SqlSessionTemplate：`https://mybatis.org/spring/sqlsession.html`
- MyBatis-Spring Injecting Mappers：`https://mybatis.org/spring/mappers.html`
- MyBatis Spring Boot Starter：`https://www.mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/`
