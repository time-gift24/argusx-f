# popover Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] 锁定 shadcn 命名与组件族：`popover/trigger/content/anchor/header/title/description`。
- [x] 锁定 shadcn 默认行为：`align='center'`、`sideOffset=4`、`data-slot` 与 `data-state/side` 动画契约。
- [x] 把 `align/side/sideOffset` 从 root 收敛到 content，避免 root/content 双轨配置。
- [x] 删除旧 `openChange` 手动输出路径，统一 `[(open)]` 模式。

## Non-conflict Extensions (ArgusX Plain)
- [x] 定义 `variant='plain' | 'glass'`，默认 `plain`。
- [x] 增加 `alignOffset` 作为可选增强，默认 `0`。
- [x] 保证扩展项不改变 shadcn 默认交互和默认视觉路径。

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 删除旧入口：`app-popover`、`[appPopoverTrigger]`、`app-popover-content` 等。
- [x] 不保留 alias/deprecated 兼容层，只保留 `argusx-*` 主入口。
- [x] 同步迁移所有调用点（`popover-preview`、`calendar-preview`、`combobox-preview`）。

## Naming Migration (z -> argusx)
- [x] selector 统一：`argusx-popover*`。
- [x] directive 输入统一：`[argusxPopoverTrigger]`、`[argusxPopoverAnchor]`。
- [x] 类型与导出统一：`ArgusxPopover*`、`ArgusxPopoverComponents`。

## shadcn API Alignment
- [x] API surface 对齐（Root/Trigger/Content/Anchor/Header/Title/Description）。
- [x] 行为对齐（默认 align/offset、触发打开、outside click 关闭、escape 关闭）。
- [x] 可访问性对齐（trigger `aria-*` + content `role="dialog"`）。

## Plain Style Alignment
- [x] 默认视觉路径为 `variant='plain'`。
- [x] 默认样式采用 token-based 中性风格（无强装饰）。
- [x] 扩展项 `glass` 作为可选增强，不影响 plain baseline。

## File-level Plan
1. [x] `src/app/shared/ui/popover/popover.component.ts`
2. [x] `src/app/shared/ui/popover/index.ts`（保持导出入口不变）
3. [x] `src/app/preview/popover-preview.component.ts`
4. [x] `src/app/preview/calendar-preview.component.ts`
5. [x] `src/app/preview/combobox-preview.component.ts`
