# sidebar Rewrite Plan

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

## Naming Migration (app -> argusx)
- [x] selector migration: app-sidebar-provider -> argusx-sidebar-provider
- [x] selector migration: app-sidebar -> argusx-sidebar
- [x] selector migration: app-sidebar-trigger -> argusx-sidebar-trigger
- [x] selector migration: app-sidebar-inset -> argusx-sidebar-inset
- [x] selector migration: app-sidebar-header -> argusx-sidebar-header
- [x] selector migration: app-sidebar-content -> argusx-sidebar-content
- [x] selector migration: app-sidebar-footer -> argusx-sidebar-footer
- [x] selector migration: app-sidebar-group -> argusx-sidebar-group
- [x] selector migration: app-sidebar-group-label -> argusx-sidebar-group-label
- [x] selector migration: app-sidebar-menu -> argusx-sidebar-menu
- [x] selector migration: app-sidebar-menu-item -> argusx-sidebar-menu-item
- [x] selector migration: app-sidebar-menu-button -> argusx-sidebar-menu-button
- [x] selector migration: app-sidebar-separator -> argusx-sidebar-separator
- [x] selector migration: app-sidebar-input -> argusx-sidebar-input
- [x] index export migration
- [x] SidebarComponents array migration

## shadcn API Alignment
- [x] data-slot attribute alignment
- [x] API surface alignment (保留现有 API)
- [x] behavior alignment
- [x] accessibility alignment

## Plain Style Alignment
- [x] default variant/style is plain
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
1. `src/app/shared/ui/sidebar/sidebar.component.ts` - 更新 selector
2. `src/app/shared/ui/sidebar/index.ts` - 更新导出
