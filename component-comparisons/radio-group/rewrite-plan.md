# radio-group Rewrite Plan

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
- [x] selector migration: `app-radio-group` -> `argusx-radio-group`
- [x] selector migration: `app-radio-item` -> `argusx-radio-item`
- [x] input/output/type symbol migration
- [x] index export migration: `RadioGroupComponents` -> `ArgusxRadioGroupComponents`

## shadcn API Alignment
- [x] API surface alignment
- [x] behavior alignment
- [x] accessibility alignment

## Plain Style Alignment
- [x] default variant/style is plain
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
1. [x] `src/app/shared/ui/radio-group/radio-group.component.ts` - selector migration
2. [x] `src/app/shared/ui/radio-group/index.ts` - export migration
3. [x] `src/app/preview/radio-group-preview.component.ts` - expanded coverage

## Summary
- Selector names changed from `app-*` to `argusx-*`
- Export name changed from `RadioGroupComponents` to `ArgusxRadioGroupComponents`
- Preview expanded with 6 test scenarios covering all APIs
- No zardui implementation found - used local baseline + shadcn target
- Build has unrelated errors from other components (drawer selector migration)
