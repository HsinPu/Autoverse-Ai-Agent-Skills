# Common Section Snippets

## When to Use

- 主體 README 已存在，只想補某一小段。
- 需要快速插入 badges、quick start、contributing、support 等常用 section。

## Badges Snippet

~~~markdown
![Build](https://img.shields.io/github/actions/workflow/status/acme/project/ci.yml)
![Coverage](https://img.shields.io/codecov/c/github/acme/project)
![License](https://img.shields.io/github/license/acme/project)
~~~

## Quick Start Snippet

~~~markdown
## Quick Start

```bash
cp .env.example .env
npm install
npm run dev
```
~~~

## Contributing Snippet

~~~markdown
## Contributing

1. Fork repository。
2. 建立 feature branch。
3. 執行 tests 與 lint。
4. 提交 pull request。
~~~

## Support / Ownership Snippet

~~~markdown
## Support

- Owners: Platform Team
- Slack: `#platform-support`
- Email: `platform@example.com`
~~~

## Configuration Snippet

~~~markdown
## Configuration

請建立 `.env` 並設定以下變數：

- `API_BASE_URL`
- `JWT_SECRET`
- `LOG_LEVEL`
~~~
