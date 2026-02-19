# combobox Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
- [x] move content positioning API ownership to `argusx-combobox-content` (`side/align/offset/anchor`)
- [x] align slot names (`data-slot`) to shadcn combobox contract
- [x] make empty-state visibility depend on list visibility state

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
- [x] expose `variant` with default `plain`
- [x] expose `size` with `sm/default`
- [x] expose controlled `open` model for app-level orchestration
- [x] keep `fixedHeight` list extension and multi-select chips ergonomics

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
- [x] keep single canonical API path only
- [x] drop `app-*` combobox selectors in favor of `argusx-*`
- [x] drop zard-specific width/button API names (`zWidth/buttonVariant`)

## Naming Migration (z -> argusx)
- [x] selector migration
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
1. `src/app/shared/ui/combobox/combobox.component.ts`
2. `src/app/shared/ui/combobox/index.ts`
3. `src/app/preview/combobox-preview.component.ts`
4. `component-comparisons/combobox/{source-understanding,api-diff,rewrite-plan,preview-coverage}.md`
