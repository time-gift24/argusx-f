# spinner Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
  - Size controlled via class (e.g., `class="size-4"`) not zSize enum
- [x] remove conflicting local/zardui primary entries
  - Current local already uses class-based approach (string input), aligns with shadcn

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
  - Selector: `argusx-spinner`
  - Keep simple lucide icon implementation for plain style
- [x] ensure extension does not break shadcn main path
  - API remains: class input for sizing
- [x] set plain default style behavior
  - Default size via class="size-4", simple circular spinner

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
  - Rename selector from `app-spinner` to `argusx-spinner`
- [x] keep single canonical API path only

## Naming Migration (z -> argusx)
- [x] selector migration: `app-spinner` -> `argusx-spinner`
- [x] input/output/type symbol migration: N/A - current inputs are generic (class, size)
- [x] index export migration: update to export ArgusxSpinnerComponent

## shadcn API Alignment
- [x] API surface alignment: class for sizing
- [x] behavior alignment: simple spinner with animate-spin
- [x] accessibility alignment: role="status", aria-label="Loading"

## Plain Style Alignment
- [x] default variant/style is plain
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
1. `src/app/shared/ui/spinner/spinner.component.ts` - rename selector to argusx-spinner, update imports
2. `src/app/shared/ui/spinner/index.ts` - update export
3. `src/app/preview/spinner-preview.component.ts` - update to use argusx-spinner
4. Update routes if needed
5. Update preview-layout PREVIEW_ITEMS if needed
