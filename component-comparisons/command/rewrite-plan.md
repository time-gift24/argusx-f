# command Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] selector / symbol 统一迁移到 `argusx-*` 与 `Argusx*`。
- [x] root `value` 改为“搜索词”语义。
- [x] 选择由 item `(select)` 主导，移除旧 root-selected 主入口。
- [x] 新增 `argusx-command-dialog` 对齐 `CommandDialog`。
- [x] preview 覆盖 `command-example` 五场景。

## Non-conflict Extensions (ArgusX Plain)
- [x] 引入 `keywords` 输入扩展搜索命中。
- [x] 引入 `autoHighlight` / `loop` 键盘体验扩展。
- [x] 复用 menu-core variants（item/label/separator/shortcut）并保持 plain 默认。

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 删除旧 `app-command*` 兼容入口。
- [x] 删除旧 `Command*` 导出名，保留 `ArgusxCommand*`。
- [x] 不保留 deprecated alias 与双轨行为。

## Naming Migration (z -> argusx)
- [x] selector: `z-command*` / `app-command*` -> `argusx-command*`
- [x] symbol: `Command*` -> `ArgusxCommand*`
- [x] barrel: `src/app/shared/ui/command/index.ts` 仅导出新命名族

## shadcn API Alignment
- [x] root/dialog/input/list/empty/group/item/shortcut/separator 组件面 API 对齐。
- [x] data-slot contract 对齐。
- [x] 键盘行为对齐（Arrow/Home/End/Enter/Escape）。

## Plain Style Alignment
- [x] root 默认 `data-variant="plain"`。
- [x] 复用 token 与 menu-core primitive，避免高装饰。
- [x] preview 至少包含 plain baseline（Inline）+ 复杂组合（Many Groups & Items）。

## menu-core 底层复用
- [x] 扩展 `src/app/shared/ui/menu-core/focus.ts` 通用/command focus helper。
- [x] `ArgusxCommandComponent` 的 roving 聚焦调用 menu-core helper。
- [x] 保持 command 语义为 listbox/option，不直接复用 `argusxMenu*` 指令。

## File-level Plan
1. `src/app/shared/ui/menu-core/focus.ts`
2. `src/app/shared/ui/menu-core/focus.spec.ts`
3. `src/app/shared/ui/command/command.component.ts`
4. `src/app/shared/ui/command/index.ts`
5. `src/app/shared/ui/command/command.component.spec.ts`
6. `src/app/preview/command-preview.component.ts`
7. `component-comparisons/command/{source-understanding,api-diff,rewrite-plan,preview-coverage}.md`
