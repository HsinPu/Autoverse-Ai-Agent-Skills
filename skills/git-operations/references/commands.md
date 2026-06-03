# Git 指令參考

供需要詳細選項或進階用法時查閱。以下指令在 Windows（PowerShell/cmd）下適用。

## 目錄（Table of Contents）

- [設定與資訊](#設定與資訊)
- [狀態與差異](#狀態與差異)
- [分支](#分支)
- [提交](#提交)
- [遠端](#遠端)
- [合併與 Rebase](#合併與-rebase)
- [Stash](#stash)
- [還原與重置](#還原與重置)
- [清理](#清理)
- [標籤](#標籤)
- [Clone 與 Init](#clone-與-init)

---

## 設定與資訊

| 用途 | 指令 |
|------|------|
| 使用者名稱/信箱（本 repo） | `git config user.name "Name"`、`git config user.email "email@example.com"` |
| 遠端列表 | `git remote -v` |
| 目前分支 | `git branch --show-current` |
| 單檔歷史 | `git log -p -- <path>` |

---

## 狀態與差異

| 用途 | 指令 |
|------|------|
| 簡短狀態 | `git status -s` |
| 工作區 vs 暫存 | `git diff` |
| 暫存 vs HEAD | `git diff --staged` |
| 兩次 commit 差異 | `git diff <commit1> <commit2>` |
| 僅檔名 | `git diff --name-only` |

---

## 分支

| 用途 | 指令 |
|------|------|
| 建立分支 | `git branch <name>` |
| 建立並切換 | `git switch -c <name>` 或 `git checkout -b <name>` |
| 刪除本地 | `git branch -d <name>`（-D 強制） |
| 刪除遠端追蹤 | `git branch -d -r origin/<name>` |
| 遠端刪除 | `git push origin --delete <name>` |
| 重新命名 | `git branch -m <old> <new>` |

---

## 提交

| 用途 | 指令 |
|------|------|
| 加入所有變更 | `git add .` 或 `git add -A` |
| 互動式暫存 | `git add -p` |
| 還原暫存 | `git restore --staged <path>` 或 `git reset HEAD <path>` |
| 修改上次提交 | `git commit --amend -m "msg"` 或 `--no-edit` |
| 空提交（如 CI） | `git commit --allow-empty -m "msg"` |

**Commit message**：主旨與內文一律使用英文；格式見 SKILL.md「Commit Message 格式」。

---

## 遠端

| 用途 | 指令 |
|------|------|
| 新增遠端 | `git remote add <name> <url>` |
| 拉取並合併 | `git pull [remote] [branch]` |
| 拉取並 rebase | `git pull --rebase [remote] [branch]` |
| 推送 | `git push [remote] [branch]` |
| 設定上游 | `git push -u origin <branch>` |
| 強制推送（慎用） | `git push --force-with-lease` 較安全於 `--force` |

---

## 合併與 Rebase

| 用途 | 指令 |
|------|------|
| 合併 | `git merge <branch>`（可加 `--no-ff` 保留分支紀錄） |
| Rebase | `git rebase <branch>` |
| 互動式 rebase（最近 n 筆） | `git rebase -i HEAD~n` |
| 繼續/跳過/中止 | `git rebase --continue` / `--skip` / `--abort` |

---

## Stash

| 用途 | 指令 |
|------|------|
| 暫存 | `git stash` 或 `git stash push -m "說明"` |
| 含未追蹤 | `git stash -u` |
| 列表 | `git stash list` |
| 取出並移除 | `git stash pop [stash@{n}]` |
| 取出保留 | `git stash apply [stash@{n}]` |
| 刪除 | `git stash drop [stash@{n}]` |

---

## 還原與重置

| 用途 | 指令 |
|------|------|
| 還原工作區檔案 | `git restore <path>` 或 `git checkout -- <path>` |
| 還原暫存 | `git restore --staged <path>` |
| 重置到 commit（保留工作區） | `git reset --soft <commit>` |
| 重置到 commit（保留工作區、清暫存） | `git reset --mixed <commit>` |
| 重置到 commit（全部丟棄） | `git reset --hard <commit>` |
| 還原單一 commit（新 commit） | `git revert <commit>` |

---

## 清理

| 用途 | 指令 |
|------|------|
| 未追蹤檔案 | `git clean -n`（試跑）、`git clean -fd`（刪除） |
| 合併後刪除遠端已刪分支 | `git fetch -p` 或 `git remote prune origin` |

---

## 標籤

| 用途 | 指令 |
|------|------|
| 列出 | `git tag` 或 `git tag -l "v*"` |
| 建立 | `git tag <name>` 或 `git tag -a <name> -m "msg"` |
| 推送標籤 | `git push origin <tag>` 或 `git push origin --tags` |
| 刪除 | `git tag -d <name>`（本地）、`git push origin --delete <name>`（遠端） |

---

## Clone 與 Init

| 用途 | 指令 |
|------|------|
| 複製 | `git clone <url> [目錄]` |
| 淺複製 | `git clone --depth 1 <url>` |
| 初始化 | `git init` |
