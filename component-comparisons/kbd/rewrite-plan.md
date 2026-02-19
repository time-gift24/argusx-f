# kbd Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
  - selector API converged to `argusx-kbd` / `argusx-kbd-group`
  - base class contract aligned to shadcn (`rounded-sm`, `text-xs`, tooltip-context selectors)
- [x] remove conflicting local/zardui primary entries
  - removed `appKbd` / `appKbdGroup` public entry points
  - removed legacy `KbdDirective` / `KbdGroupDirective` export names

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
  - kept `size` as ArgusX extension on `argusx-kbd` (`sm/default/lg`)
- [x] ensure extension does not break shadcn main path
  - `size="default"` is a no-op and preserves shadcn baseline classes
- [x] set plain default style behavior
  - default path remains neutral muted keycap style without extra decoration

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
- [x] keep single canonical API path only

## Naming Migration (z -> argusx)
- [x] selector migration
  - `z-kbd`/`z-kbd-group` semantic family -> `argusx-kbd`/`argusx-kbd-group`
- [x] input/output/type symbol migration
  - exported symbols now `ArgusxKbdDirective`, `ArgusxKbdGroupDirective`, `ArgusxKbdSize`, `argusxKbdSizes`
- [x] index export migration
  - `src/app/shared/ui/kbd/index.ts` exports argusx symbols only

## shadcn API Alignment
- [x] API surface alignment
  - class passthrough + `data-slot` contract aligned with shadcn `kbd` / `kbd-group`
- [x] behavior alignment
  - tooltip context classes aligned to shadcn token shape
- [x] accessibility alignment
  - semantic `<kbd>` usage retained for key hints and grouped shortcuts

## Plain Style Alignment
- [x] default variant/style is plain
  - no explicit variant API; default style equals plain baseline
- [x] avoid heavy decoration in default state
  - no gradients/glass/shadow-heavy styles introduced
- [x] verify token usage and no hardcoded brand colors in component internals
  - styles use neutral design tokens (`bg-muted`, `text-muted-foreground`, etc.)

## File-level Plan
1. `src/app/shared/ui/kbd/kbd.directive.ts`
  - rewrote selectors, exported symbol names, shadcn baseline classes, and ArgusX size extension
2. `src/app/shared/ui/kbd/index.ts`
  - switched to argusx-only exports
3. `src/app/shared/ui/kbd/kbd.directive.spec.ts`
  - migrated tests to `argusxKbdSizes` contract
4. `src/app/preview/kbd-preview.component.ts`
  - expanded coverage: shadcn baseline/button/tooltip/input-group + argusx size extension + complex scenario
