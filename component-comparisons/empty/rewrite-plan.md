# empty Rewrite Plan

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

## Naming Migration (app -> argusx)
- [x] selector migration: `appEmpty` -> `argusxEmpty`
- [x] input/output/type symbol migration: all class names updated
- [x] index export migration: exports updated to Argusx* names

## shadcn API Alignment
- [x] API surface alignment - uses shadcn structure
- [x] behavior alignment - same semantics
- [x] accessibility alignment - aria-live, role, aria-hidden maintained

## Plain Style Alignment
- [x] default variant/style is plain
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
1. `src/app/shared/ui/empty/empty.directive.ts` - UPDATED with argusxEmpty* selectors
2. `src/app/shared/ui/empty/index.ts` - UPDATED with Argusx* exports
3. `src/app/preview/empty-preview.component.ts` - UPDATED with argusxEmpty* directives
4. `src/app/shared/ui/empty/empty.component.spec.ts` - UPDATED with new class names
