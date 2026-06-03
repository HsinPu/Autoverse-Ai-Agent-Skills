# Dark Mode

## 預設模式

- `dark:` 預設基於 `prefers-color-scheme`。
- Tailwind 的哲學是：light 與 dark 用不同 utility class 描述，不是同一個 class 同時含兩套樣式。

## 手動切換

- 若要用 class 驅動：覆寫 dark variant，例如 `@custom-variant dark (&:where(.dark, .dark *));`
- 若要用 data attribute：`@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`
- 常見做法：在 `<html>` 上切換 class/attribute，並把偏好寫進 `localStorage`；也可在 SSR 時直接渲染避免 FOUC。
