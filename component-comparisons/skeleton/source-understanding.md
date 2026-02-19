# skeleton Source Understanding

## Mapping
- local: `skeleton`
- zardui: `skeleton`
- shadcn: `skeleton`
- rationale: Skeleton is a simple placeholder component used during data loading

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/skeleton/skeleton.component.ts` | 1-25 | Component with selector `z-skeleton`, input `[class]`, uses cva for variants |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/skeleton/skeleton.variants.ts` | 1-4 | CVA variants definition with base classes `bg-accent animate-pulse rounded-md` |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/skeleton/index.ts` | 1-2 | Exports skeleton component and variants |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/libs/zard/src/lib/shared/components/skeleton/doc/api.md` | 1-10 | API documentation showing `[class]` input |
| U2 | `/tmp/zardui/libs/zard/src/lib/shared/components/skeleton/demo/default.ts` | 1-19 | Default demo showing usage pattern: `<z-skeleton class="h-12 w-12 rounded-full" />` |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/skeleton/skeleton.directive.ts` | 1-27 | Directive form `[appSkeleton]`, input `class`, default styles `bg-muted rounded-md animate-pulse` |
| L2 | `src/app/shared/ui/skeleton/index.ts` | 1-2 | Exports SkeletonDirective |

## Shadcn Evidence
| id | file | note |
| --- | --- | --- |
| S1 | `@shadcn/skeleton` | Simple div with className prop, e.g., `<Skeleton className="h-4 w-[250px]" />` |
| S2 | `skeleton-demo` | Demo shows usage with className for sizing |

## Analysis Summary
- **shadcn**: Very simple - just a div with className
- **zardui**: Component form with selector `z-skeleton`, uses CVA for variants
- **local**: Directive form `[appSkeleton]`, simpler than zardui
- **Decision**: Convert from directive to component (zardui style), rename selector to `argusx-skeleton`
