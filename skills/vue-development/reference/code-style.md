# Code Style / SFC 結構

## 優先順序

- 先遵守專案既有規範；若沒有規範，採 Vue 官方 Style Guide（A/B 為主）作為 baseline。
- Style Guide 本身在官方頁面有註記需 review（文件狀態可能變動），但仍是避免反模式的好參考。

## 檔案與命名

- 元件檔名用 PascalCase（`UserCard.vue`），路由頁面也一致（`UserListPage.vue`）。
- composable 用 `useXxx`（`useAuth()`, `useDebouncedRef()`）。
- 事件命名偏語意：`update:modelValue` / `submit` / `close` / `select`。

## SFC 結構（建議）

- 預設用 `<script setup>` + `<template>` + `<style scoped>`（是否 scoped 依專案）；避免混雜太多 inline logic。
- 大元件拆成「展示（presentational）+ 容器（container）」或「頁面（route view）+ 子元件」，降低單檔複雜度。
- template 優先保持「可掃讀」，複雜條件/格式化抽到 computed 或小函式（但不要把 UI flow 全塞進 script）。

## 風格一致性

- `v-for` 一律加穩定且唯一的 `:key`。
- 避免 `v-if` 與 `v-for` 同層（可先 computed 篩選/排序）。
- Props 明確定義型別與預設值；事件（emits）也要明確列出。
