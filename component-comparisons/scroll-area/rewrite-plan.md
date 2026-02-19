# scroll-area Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs (无冲突项)
- [x] remove conflicting local/zardui primary entries (无冲突项)

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
- [x] ensure extension does not break shadcn main path
- [x] set plain default style behavior

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
- [x] keep single canonical API path only

## Naming Migration (z -> argusx)
- [x] selector migration: app-scroll-area -> argusx-scroll-area
- [x] input/output/type symbol migration
- [x] index export migration

## shadcn API Alignment
- [x] API surface alignment
- [x] behavior alignment
- [x] accessibility alignment

## Plain Style Alignment
- [x] default variant/style is plain
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
1. `src/app/shared/ui/scroll-area/scroll-area.component.ts` - 已更新
2. `src/app/preview/scroll-area-preview.component.ts` - 已更新
