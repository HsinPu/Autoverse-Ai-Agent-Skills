# Web API（Spring MVC / WebFlux）

## Controller 設計

- controller 只做：request parsing/validation、呼叫 application service、mapping response。
- 回傳型別：REST API 用 `ResponseEntity<...>` 以明確 status/header。
- request/response DTO 明確標註，避免 entity 直出。

## Validation

- 使用 Jakarta Bean Validation（`@Valid`）做輸入驗證。
- 驗證失敗要回一致的 error response（不要讓框架預設訊息到處不一樣）。

## 例外處理

- 用 `@ControllerAdvice` 統一轉換例外 -> HTTP response。
- 錯誤訊息要：可讀、可行動（指明欄位/規則/下一步）。

## API Versioning

- 版本策略要一致（path/header/media-type 擇一）；不要同專案混好幾套。

## 序列化

- 小心循環引用與 lazy loading；對外 API 建議用 DTO + mapper。
- 時間欄位一律用明確格式（ISO-8601）與時區策略（通常用 UTC）。
