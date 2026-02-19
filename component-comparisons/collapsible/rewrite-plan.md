# collapsible Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] 锁定 `open/onOpenChange/defaultOpen` 与 Trigger `asChild` 为主路径 API
- [x] 删除 `app-collapsible*` 作为主入口（不保留兼容别名）

## Non-conflict Extensions (ArgusX Plain)
- [x] 定义 `argusxVariant` 扩展 API（`plain | muted`）
- [x] 扩展仅作用于视觉层，不影响 shadcn 状态语义
- [x] 默认 `plain`，并输出 `data-variant`

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 不保留 deprecated alias
- [x] 仅保留单一 canonical API（argusx 命名）

## Naming Migration (z -> argusx)
- [x] selector/attribute 统一为 `argusx-` / `argusx*`
- [x] class/type symbol 迁移为 `ArgusxCollapsible*`
- [x] `index.ts` 仅导出新符号

## shadcn API Alignment
- [x] Root/Trigger/Content 对齐三段式 API 与 `data-slot`
- [x] Trigger 支持 `asChild` 语义
- [x] `data-state`/ARIA/键盘交互对齐

## Plain Style Alignment
- [x] 默认变体 `plain`
- [x] 默认态无高装饰
- [x] 使用 token/中性样式，不在组件内部硬编码品牌色

## File-level Plan
1. [x] `src/app/shared/ui/collapsible/collapsible.component.ts`
2. [x] `src/app/shared/ui/collapsible/index.ts`
3. [x] `src/app/preview/collapsible-preview.component.ts`
4. [x] `component-comparisons/collapsible/preview-coverage.md`（回填验证结果）
