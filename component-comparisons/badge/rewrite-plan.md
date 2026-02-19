# badge Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] `variant` 命名/默认值/6 variants 全量采用 shadcn
- [x] 主路径样式采用 shadcn `badgeVariants`（含 destructive/outline/ghost/link 语义）
- [x] 默认圆角采用 shadcn `rounded-full`（不采用 zard `zShape=default -> rounded-md`）
- [x] 保持 `data-slot="badge"` + `data-variant` 与 shadcn 对齐

## Non-conflict Extensions (ArgusX Plain)
- [x] 扩展 `shape` API（`default|square|pill`），来源 zard `zShape` 能力
- [x] 输出 `data-shape` 作为扩展态标记
- [x] extension 不改变 shadcn 的色彩语义，只做圆角维度扩展（plain）

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 仅保留 `argusx-badge` 入口
- [x] 不提供 `appBadge` / `zType` / `zShape` 兼容 alias
- [x] `index.ts` 仅导出 ArgusX 命名对象

## Naming Migration (z -> argusx)
- [x] selector: `z-badge`/legacy selector -> `argusx-badge`
- [x] symbol: `ArgusxBadgeDirective`, `argusxBadgeVariants`
- [x] type export: `ArgusxBadgeVariant`, `ArgusxBadgeShape`

## shadcn API Alignment
- [x] 6 variants 与默认值完全对齐
- [x] `data-slot`、`data-variant` 对齐
- [x] focus-visible / aria-invalid 类名对齐

## Plain Style Alignment
- [x] 默认态无重阴影、渐变、玻璃化
- [x] 扩展 API（shape）只影响轮廓，不破坏 shadcn 主路径
- [x] 使用 tokens（`primary/secondary/destructive/accent/...`），不在组件内部硬编码品牌色

## File-level Plan
1. `src/app/shared/ui/badge/badge.directive.ts`
2. `src/app/shared/ui/badge/index.ts`
3. `src/app/preview/badge-preview.component.ts`
4. `component-comparisons/badge/*.md` deliverables
