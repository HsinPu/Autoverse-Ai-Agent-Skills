# Testing（Spring Boot Testing）

## 分層策略

- **單元測試**：不啟動 Spring，測 pure Java business logic。
- **Slice tests**：`@WebMvcTest` / `@DataJpaTest` 等，只載入必要 bean。
- **整合測試**：`@SpringBootTest`（成本高，留給關鍵路徑）。

## 工具

- MVC：MockMvc（Servlet stack）
- Reactive：WebTestClient（WebFlux）
- 外部依賴：Testcontainers（DB/Redis/Kafka）

## 測試穩定性

- 避免依賴時間與隨機；必要時注入 Clock。
- 避免跨測試共享狀態；資料要可重置。
