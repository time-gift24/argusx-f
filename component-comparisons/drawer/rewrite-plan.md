# drawer Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] 锁定 shadcn 命名与 slot 语义：`argusx-drawer` + `argusxDrawer*` + `data-vaul-drawer-direction`。
- [x] 对齐默认行为：overlay 视觉、close 主路径、header/footer/title/description class 结构。

## Non-conflict Extensions (ArgusX Plain)
- [x] 定义扩展 API：`size(default/sm/lg/full)`、`showCloseButton`。
- [x] 扩展仅在显式配置时生效，不覆盖 shadcn baseline。
- [x] 扩展默认保持 plain（默认 size + 关闭 close icon）。

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 删除旧入口：`app-drawer`、`appDrawerTrigger`、`appDrawerClose` 及相关导出。
- [x] 保留单一路径：全部收敛为 `argusx-*` API。

## Naming Migration (z -> argusx)
- [x] selector migration：`app-*` -> `argusx-*`。
- [x] type/class migration：`Drawer*` -> `ArgusxDrawer*`（含类型导出）。
- [x] `index.ts` 仅导出新命名符号。

## shadcn API Alignment
- [x] API surface：root/trigger/content/close/header/footer/title/description 对齐。
- [x] behavior：方向驱动布局、显式 close action、受控 open/openChange。
- [x] accessibility：`role="dialog"` + `aria-*` 关联 + trigger ARIA 状态。

## Plain Style Alignment
- [x] 默认样式为 plain：中性背景、低装饰遮罩。
- [x] 移除旧 blur + 过重遮罩作为默认态。
- [x] 使用设计 token 类（`bg-background`, `text-muted-foreground`），无品牌色硬编码。

## File-level Plan
1. `src/app/shared/ui/drawer/drawer.component.ts`  
   已重写为 shadcn-first + ArgusX extension，并完成 `argusx` 命名迁移。
2. `src/app/shared/ui/drawer/index.ts`  
   已更新导出到 `ArgusxDrawer*` 符号。
3. `src/app/preview/drawer-preview.component.ts`  
   已扩展为 baseline + direction + extension + complex scenario 全覆盖。
4. `src/app/preview/preview-layout.component.ts`  
   已将 `drawer` 的 `reviewStatus` 标记为 `reviewed`，与本次手动验证一致。
