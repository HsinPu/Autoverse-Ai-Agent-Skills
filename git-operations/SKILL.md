---
name: git-operations
description: Executes and guides Git workflows on Windows (clone, branch, commit, push, pull, merge, rebase, stash, history). Use when the user asks to commit, make a commit, do a commit, push, pull, stage and commit, write commit message, write commit messages, manage branches, resolve conflicts, inspect repository state, or perform any Git operation.
---

# Git 操作

執行與規劃 Git 工作流。環境預設為 **Windows**（PowerShell 或 cmd）。操作須依下列規範嚴謹執行。

## Quick start（必守原則）

1. **先確認再改動**：執行任何會改動歷史或工作區的指令前，**必須**先執行 `git status`；若涉及分支或提交，必要時再執行 `git log -1` 或 `git branch -a` 確認當前狀態。未確認前不得執行 `git commit`、`git merge`、`git rebase`、`git reset`、`git push` 等。
2. **危險操作必須確認**：`git push --force`、`git reset --hard`、`git clean -fd` 等會**永久丟失資料**的指令，**必須**先向使用者說明影響（例如：哪些 commit 或檔案會消失），並在取得明確同意後才執行。
3. **路徑與工作目錄**：路徑一律使用正斜線，或對含空格的路徑以雙引號包裹；執行前若不在 repo 根目錄，**必須**先 `cd` 到該 repo 根目錄再執行 git 指令。

## 常用工作流（Instructions）

### 狀態與歷史

- **查看狀態**：執行 `git status` 確認工作區與暫存區；必要時 `git diff`（工作區 vs 暫存）、`git diff --staged`（暫存 vs HEAD）。
- **查看歷史**：`git log -n 5` 或 `git log --oneline -n 10`；僅在需確認提交內容或 hash 時執行。

### 分支

- **列出**：`git branch -a` 確認本地與遠端分支。
- **建立並切換**：`git switch -c <branch>` 或 `git checkout -b <branch>`；分支名稱須符合專案慣例（通常 lowercase、hyphen）。
- **切換**：`git switch <branch>` 或 `git checkout <branch>`。
- **刪除本地**：`git branch -d <branch>`；若分支未合併且確定要刪除，使用 `-D`。刪除前須確認該分支已無需保留。

### 提交

- **暫存**：`git add <path>` 或 `git add .`；使用 `git add .` 前**必須**以 `git status` 確認範圍，避免誤納入不需提交的檔案。
- **提交**：`git commit -m "message"`；message **必須**符合下方「Commit Message 格式」且**一律使用英文**。
- **修改上一次提交（僅限未 push）**：`git commit --amend -m "new message"` 或 `git commit --amend --no-edit`；若已 push，不得使用 `--amend` 後再 force push，除非使用者明確要求並理解風險。

### 遠端同步

- **拉取**：`git pull` 或 `git pull origin <branch>`；若專案要求線性歷史，使用 `git pull --rebase`。
- **推送**：`git push` 或 `git push origin <branch>`；首次推送該分支時須設定上游：`git push -u origin <branch>`。
- 推送前**必須**先拉取並解決衝突，再執行 push。

### 合併與 Rebase

- **合併**：`git merge <branch>`；若有衝突，**必須**依下方「衝突處理」完成後再執行 `git commit`。
- **Rebase**：`git rebase <branch>`；衝突時依「衝突處理」後執行 `git rebase --continue`；若要放棄則執行 `git rebase --abort`。Rebase 會改寫歷史，僅在未 push 或使用者同意 force push 時使用。

### 暫存與還原

- **暫存工作區**：`git stash` 或 `git stash push -m "說明"`（說明建議用英文，便於辨識）。
- **列出／取出**：`git stash list`、`git stash pop` 或 `git stash apply`。
- **丟棄工作區變更**：`git restore <path>` 或 `git checkout -- <path>`；執行前須確認該路徑的變更可丟棄。
- **還原到某次提交**：`git reset --soft <commit>`（保留變更）、`git reset --hard <commit>`（丟棄變更）；**僅**在使用者明確要求時執行，且須先說明影響。

## Commit Message 格式

- **語言**：commit message 的**主旨（subject）與內文（body／description）一律使用英文**。不使用中文或其他語言。
- **主旨**：一行、約 50 字元以內；使用祈使語氣（如 "Add" 而非 "Added"）。
- **前綴**：`feat:`、`fix:`、`docs:`、`refactor:`、`test:`、`chore:`；可選 scope，如 `feat(auth):`。
- **內文**：可選；若寫第二段，說明原因或細節，同樣使用英文。

**範例 1**  
情境：新增使用者登入並用 JWT 驗證  

```
feat(auth): add JWT-based login and validation

Add login API and token validation middleware.
```

**範例 2**  
情境：修正報表日期顯示錯誤  

```
fix(reports): correct date formatting in timezone conversion

Use UTC timestamps consistently for report generation.
```

## 衝突處理（Workflow）

1. 執行 `git status` 確認標示為 "both modified" 或衝突的檔案。
2. 逐檔編輯，移除 `<<<<<<<`、`=======`、`>>>>>>>` 標記並保留正確內容；必要時與使用者確認要保留的版本。
3. 對已解決的檔案執行 `git add <path>` 標記為已解決。
4. 完成：merge 情境執行 `git commit`（commit message 依上述格式、英文）；rebase 情境執行 `git rebase --continue`。

## 進階與參考（Bundled resources）

- **完整指令與選項**：需查表或進階用法時，見 [references/commands.md](references/commands.md)。
