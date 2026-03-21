# Product / App README 範例

## When to Use

- repository 的主體是 web app、mobile app、desktop app、dashboard 或 end-user product。
- README 需要先回答「這個產品做什麼」與「怎麼跑起來」。

## Reader Focus

- evaluator / stakeholder：想先看功能與畫面。
- developer：想知道如何 run locally、如何設定、如何測試。

## What to Highlight

- product value 與 target users
- key features
- quick start / run locally
- screenshots / demo / preview links
- configuration and development workflow

## Example Skeleton

~~~markdown
# Aurora Admin

一個提供營運團隊管理訂單、庫存與報表的 web dashboard。

## Features

- 訂單管理（order management）
- 即時庫存監控（inventory monitoring）
- 匯出營運報表（report export）

## Quick Start

```bash
npm install
npm run dev
```

## Screenshots

![Dashboard](docs/images/dashboard.png)

## Configuration

請建立 `.env` 並設定 `API_BASE_URL`、`AUTH_DOMAIN`。

## Development

```bash
npm test
npm run build
```

## Contributing

歡迎提交 issue 或 pull request。
~~~

## Variation Notes

- 若是 marketing / landing page，可把 `Screenshots` 換成 `Live Demo`。
- 若是 internal admin app，可把 `Contributing` 改為 `Support` 或 `Owners`。
- 若是桌面 App，可補 `Downloads`、`Supported Platforms`。
