# badge Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn variant styles for all 6 variants (default, secondary, destructive, outline, ghost, link)
- [x] align base classes with shadcn (text-xs, no forced h-5, transition-[color,box-shadow])
- [x] fix hover selectors to use `[a&]:hover` pattern
- [x] fix destructive variant to use solid bg-destructive text-white
- [x] remove local-only base classes (h-5, text-[0.625rem], group/badge)

## Non-conflict Extensions (ArgusX Plain)
- (none needed for badge -- component is fully covered by shadcn API)

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove `appBadge` selector entirely
- [x] remove `BadgeDirective` export name (replace with `ArgusxBadgeDirective`)
- [x] remove `badgeVariants` export name (replace with `argusxBadgeVariants`)
- [x] no alias or deprecated re-export

## Naming Migration (z -> argusx)
- [x] selector: `appBadge` -> `argusx-badge`
- [x] class: `BadgeDirective` -> `ArgusxBadgeDirective`
- [x] cva export: `badgeVariants` -> `argusxBadgeVariants`
- [x] type: `BadgeVariant` -> `ArgusxBadgeVariant`
- [x] index.ts: update all exports

## shadcn API Alignment
- [x] variant input with 6 variants matching shadcn styles exactly
- [x] data-slot="badge" and data-variant host attributes
- [x] focus-visible and aria-invalid styling from shadcn base classes

## Plain Style Alignment
- [x] default variant follows shadcn (primary bg) -- acceptable as shadcn baseline
- [x] no heavy decoration, gradients, shadows, or glass effects in any variant
- [x] all design tokens from Tailwind theme variables (no hardcoded colors)

## File-level Plan
1. `src/app/shared/ui/badge/badge.directive.ts` -- rewrite with argusx naming and shadcn-aligned styles
2. `src/app/shared/ui/badge/index.ts` -- update exports to new names
3. `src/app/preview/badge-preview.component.ts` -- expand preview with all variants, icons, counters, link badges, combined scenarios
