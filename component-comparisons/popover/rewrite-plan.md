# popover Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
- [x] remove conflicting local/zardui primary entries

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
- [x] ensure extension does not break shadcn main path
- [x] set plain default style behavior

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
- [x] keep single canonical API path only

## Naming Migration (z -> argusx)
- [x] selector migration: app-popover -> argusx-popover, appPopoverTrigger -> argusxPopoverTrigger, etc.
- [x] input/output/type symbol migration: PopoverComponent -> ArgusxPopoverComponent
- [x] index export migration: PopoverComponents -> ArgusxPopoverComponents

## shadcn API Alignment
- [x] API surface alignment: align, sideOffset defaults match shadcn
- [x] behavior alignment: CDK Overlay implementation
- [x] accessibility alignment: aria-expanded, aria-haspopup, aria-controls

## Plain Style Alignment
- [x] default variant/style is plain
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
1. [x] `src/app/shared/ui/popover/popover.component.ts` - 完成 selector 和 API 迁移
2. [x] `src/app/shared/ui/popover/index.ts` - 导出已更新
3. [x] `src/app/preview/popover-preview.component.ts` - 更新使用新 API
4. [x] `src/app/preview/calendar-preview.component.ts` - 更新使用新 API
