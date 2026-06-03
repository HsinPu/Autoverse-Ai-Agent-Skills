# Platform Overlay 範例

## When to Use

- 主體 README 已經完成，只需要補 GitHub / Gerrit 專屬資訊。
- 不想為了平台差異重寫整份 README。

## How to Use

- 保持 core README 平台中立。
- 視託管平台加入一到兩個 overlay sections。
- 若 GitHub 與 Gerrit 並存，把差異集中在 `Contributing`、`Links` 或 `Development`。

## GitHub Open Source Overlay

~~~markdown
## Status

![Build](https://img.shields.io/github/actions/workflow/status/acme/project/ci.yml)
![License](https://img.shields.io/github/license/acme/project)

## Links

- Issues: `https://github.com/acme/project/issues`
- Releases: `https://github.com/acme/project/releases`
- Demo: `https://acme.github.io/project`
~~~

## GitHub Package / Release Overlay

~~~markdown
## Installation

```bash
npm install my-package
```

## Releases

- npm: `https://www.npmjs.com/package/my-package`
- GitHub Releases: `https://github.com/acme/my-package/releases`
~~~

## Gerrit Review Overlay

~~~markdown
## Code Review

- 所有變更都必須送到 Gerrit review。
- commit message 必須包含有效的 `Change-Id`。
- 推送 patch set：`git push origin HEAD:refs/for/main`
- merge / submit 由 maintainer 或 approver 完成。
~~~

## GitHub + Gerrit Hybrid Overlay

~~~markdown
## Contributing

- GitHub repository 主要用於瀏覽程式碼、追蹤 issue 與發布版本。
- 所有 code review 請在 Gerrit 完成：`https://gerrit.example.com/projects/my-project`
- 提交變更前請確認 commit message 包含有效的 `Change-Id`。
- 推送 review patch：`git push origin HEAD:refs/for/main`
~~~
