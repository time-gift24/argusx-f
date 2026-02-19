# badge Source Understanding

## Mapping
- local: `badge`
- zardui: N/A (zardui source not available at /tmp/zardui)
- shadcn: `badge`
- rationale: Badge is a simple display component. No zardui counterpart found. shadcn badge is the primary reference.

## Shadcn Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | shadcn/badge.tsx | full | Uses cva with variants: default, secondary, destructive, outline, ghost, link |
| S2 | shadcn/badge.tsx | full | Renders as `<span>` with data-slot="badge", data-variant, supports asChild via Radix Slot |
| S3 | shadcn/badge.tsx | full | Base classes: inline-flex, rounded-full, border-transparent, text-xs, font-medium |
| S4 | shadcn/badge-demo.tsx | full | Demo shows all 4 core variants + icon usage + numeric counter badges |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | N/A | N/A | zardui source directory not available; no badge implementation to reference |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | shadcn badge-demo.tsx | full | Basic variants: default, secondary, destructive, outline |
| U2 | shadcn badge-demo.tsx | full | Custom styled badge with icons (BadgeCheckIcon), numeric counters |

## Local Baseline Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/badge/badge.directive.ts | 1-59 | Uses `appBadge` selector on span/a/div; cva with 6 variants including ghost/link |
| L2 | src/app/shared/ui/badge/badge.directive.ts | 6-23 | Variant styles have minor differences from shadcn (e.g. `[a]:hover` vs `[a&]:hover`, bg-destructive/10 vs bg-destructive text-white) |
| L3 | src/app/shared/ui/badge/badge.directive.ts | 7 | Base classes include `h-5` fixed height and `text-[0.625rem]` vs shadcn `text-xs` |
| L4 | src/app/shared/ui/badge/badge.directive.ts | 41-56 | Missing data-variant attribute selector pattern used by button (has it via host) |
| L5 | src/app/shared/ui/badge/index.ts | 1 | Exports BadgeDirective, badgeVariants, BadgeVariant type |
