# breadcrumb Rewrite Plan

## Naming Migration (z -> argusx)
- [x] selector migration
  - `app-breadcrumb*` -> `argusx-breadcrumb*`
  - 增加 semantic attribute selectors：`nav/ol/li/a/span[argusxBreadcrumb*]`
- [x] input/output/type symbol migration
  - 引入 `ArgusxBreadcrumbSize/Align/Wrap/EllipsisColor`
  - 新增 plain 扩展输入：`size/align/wrap/ellipsisColor`
- [x] index export migration
  - 导出 `ArgusxBreadcrumb*` 与 `ArgusxBreadcrumbComponents`
  - 导出 `breadcrumb.variants.ts` 的类型与 variants
- [x] compatibility alias (if needed)
  - 按决策不保留 `app-*` 或旧 TS 命名别名

## shadcn API Alignment
- [x] API surface alignment
  - 组件分解与 `data-slot` 对齐 shadcn
  - separator 改为 children 覆盖默认 icon
- [x] behavior alignment
  - 默认样式结构对齐 shadcn
  - 复杂示例覆盖 dropdown + responsive drawer fallback（参考 shadcn responsive demo）
- [x] accessibility alignment
  - `aria-label`, `aria-current`, `role="presentation"` 规则对齐
  - 语义节点 attribute selector 覆盖 `nav/ol/li/a/span`

## File-level Plan
1. `src/app/shared/ui/breadcrumb/breadcrumb.variants.ts` (新增)
2. `src/app/shared/ui/breadcrumb/breadcrumb.component.ts` (重写)
3. `src/app/shared/ui/breadcrumb/index.ts` (导出更新)
4. `src/app/shared/ui/breadcrumb/breadcrumb.component.spec.ts` (新增 targeted spec)
5. `src/app/preview/breadcrumb-preview.component.ts` (全量 API 场景 + 复杂组合)
6. `src/app/preview/preview-layout.component.ts` (`breadcrumb` 状态 -> `ready_to_review`)
7. `component-comparisons/breadcrumb/*.md` (证据、差异、覆盖说明落盘)
