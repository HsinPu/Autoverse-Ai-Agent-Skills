# DI 與組態（DI and Configuration）

## DI（依賴注入）

- **優先 constructor injection**（也利於單元測試）。
- 避免 field injection（難測、不可變性差）。
- 多實作注入：用 `@Qualifier` 或明確命名 bean；不要靠「剛好掃到哪個」。

## Spring Boot：Configuration Properties（建議）

- 偏好 `@ConfigurationProperties` 管理設定（比 `@Value` 可維護）。
- 設定值要能被驗證（搭配 Bean Validation）。
- 不把 secrets 放在 repo；用環境變數或秘密管理（K8s secret、Vault）。

官方參考：

- https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config.typesafe-configuration-properties

## Spring Boot：設定檔格式與 Profiles

### 設定檔格式（application.properties vs application.yml）

- Boot 官方同時支援 `application.properties` 與 `application.yml/.yaml`；建議整個專案「選一種格式並保持一致」。
- 若同一位置同時存在 `.properties` 與 YAML，官方文件註記 `.properties` 會優先。
- YAML 有限制：不能用 `@PropertySource` 或 `@TestPropertySource` 載入（需要這種載入方式時請用 `.properties`）。

官方參考：

- https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config
- https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config.yaml.mapping-to-properties

### Profiles 與環境

- `application.yaml` 放共用；`application-{profile}.yaml` 放環境差異。
- 針對測試：用 `application-test.yaml` 或 `@DynamicPropertySource`。

官方參考：

- https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config.files.profile-specific

## Auto-configuration 的策略

- 先用 Boot 的預設（依賴版本、logging、actuator），只有真的需要才 override。
- 自定義 configuration 以「小而明確」為原則，不要把整個系統都塞進一個 `@Configuration`。

---

## 純 Spring Framework（無 Boot）建議做法

### 1) 以 Java-based config / annotations 為主

- 新專案建議用 `@Configuration` + `@Bean` + component scanning；XML 仍支援但多用於 legacy。

官方參考：

- Java-based config：https://docs.spring.io/spring-framework/reference/core/beans/java.html
- Annotation-based config：https://docs.spring.io/spring-framework/reference/core/beans/annotation-config.html

### 2) 設定檔用 .properties，並明確加入 PropertySource

在純 Spring 裡，沒有 Boot 那種「自動載入 application.*」慣例；你可以用任何檔名，但要自己把它加入 `Environment`。

Java config 常見寫法：

```java
@Configuration
@PropertySource("classpath:app.properties")
public class AppConfig {

  @Bean
  public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
    return new PropertySourcesPlaceholderConfigurer();
  }
}
```

之後可以用 `Environment` 或 `@Value` 讀取。

官方參考（Environment/properties 概念）：

- https://docs.spring.io/spring-framework/reference/core/beans/environment.html

### 3) YAML 不是純 Spring 的預設設定檔格式

- `@PropertySource` 不支援 YAML（除非你自訂 `PropertySourceFactory` 或自行把 YAML 轉成 properties）。
- 沒有強烈理由時，純 Spring 建議直接用 `.properties`。

### 4) Profiles 用 Spring 的 Environment / @Profile

- `@Profile` 是 Spring Framework 核心能力（XML 與 annotation 都可用），不依賴 Boot。

官方參考：

- https://docs.spring.io/spring-framework/reference/core/beans/environment.html#beans-definition-profiles
