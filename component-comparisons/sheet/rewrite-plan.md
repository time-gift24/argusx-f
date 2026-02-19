# sheet Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs (shadcn MCP 不可用，基于本地和 zardui 实现)
- [x] remove conflicting local/zardui primary entries (无冲突)

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
- [x] ensure extension does not break shadcn main path
- [x] set plain default style behavior

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
- [x] keep single canonical API path only

## Naming Migration (z -> argusx)
- [x] selector migration: app-sheet -> argusx-sheet
- [x] input/output/type symbol migration: 指令名迁移
- [x] index export migration (如有需要)

## shadcn API Alignment
- [x] API surface alignment
- [x] behavior alignment
- [x] accessibility alignment

## Plain Style Alignment
- [x] default variant/style is plain
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
1. `src/app/shared/ui/sheet/sheet.component.ts` - 完成 selector 和指令名迁移
2. `src/app/shared/ui/sheet/index.ts` - 无需修改，导出名不变
3. `src/app/preview/sheet-preview.component.ts` - 更新模板中的 selector 和指令名
