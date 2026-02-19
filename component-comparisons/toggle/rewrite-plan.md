# toggle Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
- [x] selector: z-toggle -> argusx-toggle
- [x] value: zValue -> value
- [x] variant: zType -> variant (默认改为 plain)
- [x] size: zSize -> size
- [x] change event: zToggleChange -> toggleChange

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
- [x] default: 添加非受控模式默认值支持
- [x] toggleClick: 点击事件
- [x] toggleHover: 悬停事件
- [x] ensure extension does not break shadcn main path
- [x] set plain default style behavior

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 保留原有的 toggle.directive（用于 directive 用法）
- [x] 新增 argusx-toggle 组件作为主实现
- [x] keep single canonical API path only (组件作为主入口)

## Naming Migration (z -> argusx)
- [x] selector migration: z-toggle -> argusx-toggle
- [x] input migration: zValue -> value, zDefault -> default, zDisabled -> disabled, zType -> variant, zSize -> size, zAriaLabel -> ariaLabel
- [x] output migration: zToggleClick -> toggleClick, zToggleHover -> toggleHover, zToggleChange -> toggleChange
- [x] index export migration

## shadcn API Alignment
- [x] API surface alignment: value, disabled, variant, size, ariaLabel, class
- [x] behavior alignment: 受控/非受控模式, ControlValueAccessor 支持
- [x] accessibility alignment: aria-pressed, aria-label

## Plain Style Alignment
- [x] default variant/style is plain
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
1. [x] `src/app/shared/ui/toggle/toggle.component.ts` - 主组件实现
2. [x] `src/app/shared/ui/toggle/toggle.variants.ts` - 变体定义
3. [x] `src/app/shared/ui/toggle/index.ts` - 导出
4. [x] `src/app/preview/toggle-preview.component.ts` - 预览组件
