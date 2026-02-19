# toggle-group Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
- [x] Selector: app-toggle-group -> argusx-toggle-group
- [x] Selector: app-toggle-group-item -> argusx-toggle-group-item

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
- [x] size: default/sm/lg (already present, keep)
- [x] orientation: horizontal/vertical (already present)
- [x] spacing: number (already present)
- [x] disabled: add to ToggleGroupComponent
- [x] ensure extension does not break shadcn main path
- [x] set plain default style behavior

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
- [x] keep single canonical API path only

## Naming Migration (app -> argusx)
- [x] selector migration: app-toggle-group -> argusx-toggle-group
- [x] selector migration: app-toggle-group-item -> argusx-toggle-group-item
- [x] input/output/type symbol migration
- [x] index export migration

## shadcn API Alignment
- [x] API surface alignment
- [x] behavior alignment
- [x] accessibility alignment

## Plain Style Alignment
- [x] default variant/style is plain (bg-transparent)
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
1. Update `src/app/shared/ui/toggle-group/toggle-group.component.ts`
   - Change selector from app-toggle-group to argusx-toggle-group
   - Change selector from app-toggle-group-item to argusx-toggle-group-item
   - Add disabled input to ToggleGroupComponent
   - Add data-disabled attribute support
2. Update `src/app/shared/ui/toggle-group/index.ts`
   - Update exports for new selector names
3. Update `src/app/preview/toggle-group-preview.component.ts`
   - Update template to use new selector names
4. Update routes if needed (should already have toggle-group route)
