# Spring 整合（MyBatis-Spring Best Practices）

## SqlSession / Mapper 的正確用法

- 在 Spring 環境中，**一律使用** `SqlSessionTemplate`（thread-safe，會參與 Spring 交易）
- 不要在同一個應用混用 `SqlSessionTemplate` 與 MyBatis 的 `DefaultSqlSession`（官方明確警告可能造成資料一致性問題）
- 優先直接注入 Mapper（MyBatis-Spring 會建立 thread-safe mapper proxy）

## 交易（Transactions）

- 使用 Spring `DataSourceTransactionManager`（或在容器交易用 `JtaTransactionManager`）
- `transactionManager` 使用的 `DataSource` 必須與建立 `SqlSessionFactoryBean` 的 `DataSource` 相同，否則交易不會生效
- 使用 `@Transactional`（或 AOP 方式）管理交易；在 Spring 管理的 `SqlSession` 上呼叫 `commit/rollback/close` 會丟 `UnsupportedOperationException`
- 在「沒有 Spring transaction」的情況下執行 mapper/SqlSession 方法時，MyBatis-Spring 會自動 commit（注意一致性）

## Mapper 註冊 / 掃描

- 用 `@MapperScan` 或 `<mybatis:scan>` 掃描 mapper interface，避免逐一註冊
- 若啟用 mapper lazy initialization，注意跨 mapper 的 `<association>/<collection>/<include>/<cache-ref>` 相依限制（官方列出限制），必要時用 `@DependsOn`

## Batch（ExecutorType.BATCH）

- 需要批次寫入時可用 `new SqlSessionTemplate(sqlSessionFactory, ExecutorType.BATCH)`
- 注意：不能在「已存在的 transaction」內混用不同 `ExecutorType`；若需要，請讓不同 executor 在不同 transaction 內執行（例如 `PROPAGATION_REQUIRES_NEW`）
