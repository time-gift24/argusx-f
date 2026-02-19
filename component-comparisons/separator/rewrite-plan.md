# separator Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
- [x] selector: app-separator -> argusx-separator
- [x] orientation: keep shadcn-aligned API
- [x] class: keep Angular class binding

## Non-conflict Extensions (ArgusX Plain)
- [x] decorative: already implemented in local, extends shadcn with plain a11y
- [x] spacing: optional extension from zardui (not implemented yet, keep for future)
- [x] ensure extension does not break shadcn main path
- [x] set plain default style behavior

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy app-separator selector entry
- [x] keep single canonical API path only

## Naming Migration (app -> argusx)
- [x] selector migration: app-separator -> argusx-separator
- [x] class/type symbol migration: SeparatorComponent -> ArgusxSeparatorComponent
- [x] index export migration

## shadcn API Alignment
- [x] API surface alignment (orientation, class)
- [x] behavior alignment (horizontal/vertical)
- [x] accessibility alignment (decorative prop for role management)

## Plain Style Alignment
- [x] default variant/style is plain (bg-border, no decoration)
- [x] avoid heavy decoration in default state
- [x] verify token usage (bg-border) and no hardcoded brand colors

## File-level Plan
1. `src/app/shared/ui/separator/separator.component.ts` - update selector and class name
2. `src/app/shared/ui/separator/index.ts` - update export
3. `src/app/preview/separator-preview.component.ts` - update imports and usage
