# skeleton Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] No conflicts: skeleton is a simple placeholder component, shadcn has no complex API

## Non-conflict Extensions (ArgusX Plain)
- [x] selector: Convert from directive `[appSkeleton]` to component `<argusx-skeleton>`
- [x] base style: Use `bg-muted` (plain/neutral) instead of `bg-accent`
- [x] data-slot: Keep `data-slot="skeleton"` for styling hooks

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] Remove old directive `[appSkeleton]` selector
- [x] Keep only component `argusx-skeleton` API

## Naming Migration (z -> argusx)
- [x] selector: `appSkeleton` -> `argusx-skeleton`
- [x] class symbol: `SkeletonDirective` -> `ArgusxSkeletonComponent`
- [x] index export: Update export name

## shadcn API Alignment
- [x] API surface: Simple class input (similar to shadcn className)
- [x] behavior: Just renders a placeholder div
- [x] accessibility: Inherits naturally from div element

## Plain Style Alignment
- [x] default variant/style is plain: `bg-muted animate-pulse rounded-md`
- [x] avoid heavy decoration in default state
- [x] verify token usage: uses `bg-muted` from theme tokens

## File-level Plan
1. Rewrite `src/app/shared/ui/skeleton/skeleton.directive.ts` -> `skeleton.component.ts`
2. Update `src/app/shared/ui/skeleton/index.ts`
3. Update `src/app/preview/skeleton-preview.component.ts`

## Implementation Details
- Create component with selector `argusx-skeleton`
- Input: `class: input<string>('')`
- Default classes: `bg-muted animate-pulse rounded-md`
- Data attributes: `data-slot="skeleton"`
- Host class: `block`
