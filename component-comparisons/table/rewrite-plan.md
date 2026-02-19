# table Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] No conflicts: shadcn uses CSS-only approach, local uses directives - both compatible

## Non-conflict Extensions (ArgusX Plain)
- [x] Add argusxType variant (default, striped, bordered)
- [x] Add argusxSize variant (default, compact, comfortable)
- [x] Ensure extensions don't break shadcn main path (these are optional)
- [x] Set plain default style behavior

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] Rename appTable* -> argusxTable*
- [x] Remove old selectors (appTable* no longer exported)
- [x] Keep single canonical API path only

## Naming Migration (app -> argusx)
- [x] selector: appTable* -> argusxTable*
- [x] input: class remains class
- [x] Add new inputs: argusxType, argusxSize
- [x] index export migration

## shadcn API Alignment
- [x] API surface alignment (directive-based)
- [x] behavior alignment (semantic elements)
- [x] accessibility alignment (native elements + data-slot)

## Plain Style Alignment
- [x] default variant is plain (default type, default size)
- [x] avoid heavy decoration in default state
- [x] verify token usage (text-muted-foreground, bg-muted)

## File-level Plan
1. `src/app/shared/ui/table/table.directive.ts` - Updated with new naming + variants
2. `src/app/shared/ui/table/index.ts` - Export updated directives
3. `src/app/shared/ui/index.ts` - Add table export
4. `src/app/preview/table-preview.component.ts` - Updated with new selectors + variant examples
