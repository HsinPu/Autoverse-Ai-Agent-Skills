# Security（Spring Security）

## 原則

- **預設拒絕**：只開放必要 endpoint。
- 認證/授權規則集中管理（HTTP security + method security），避免散落。

## CSRF

- Browser session-based app：通常需要 CSRF。
- 純 API + bearer token：視架構可關閉，但要確保沒有 cookie-based auth。

## 密碼與機密

- 密碼用強雜湊（由 Spring Security 內建 PasswordEncoder 支援）。
- secrets 不寫進 repo、不印 log。

## 常見設定

- Resource Server（JWT / opaque token）
- CORS 規則明確化（不要 `*` + credentials）
- 安全 headers（Spring Security 內建支援）
