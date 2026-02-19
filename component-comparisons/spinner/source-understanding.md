# spinner Source Understanding

## Mapping
- local: `spinner`
- zardui: `loader`
- shadcn: `spinner`
- rationale: Spinner is the common name in shadcn and local; zardui uses "loader" for the same component type (loading indicator)

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | /tmp/zardui/libs/zard/src/lib/shared/components/loader/loader.component.ts | 1-57 | Main component with selector `z-loader`, uses custom 12-bar spinner animation |
| Z2 | /tmp/zardui/libs/zard/src/lib/shared/components/loader/loader.variants.ts | 1-16 | Variants definition with `zSize` (sm/default/lg) using cva |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | /tmp/zardui/libs/zard/src/lib/shared/components/loader/demo/loader.ts | 1-19 | Demo definition showing default and size examples |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/spinner/spinner.component.ts | 1-41 | Uses lucide icon (Loader2), has `size` input (accepts string like 'size-4'), uses CSS animate-spin |
| L2 | src/app/shared/ui/spinner/index.ts | 1-2 | Exports SpinnerComponent |

## Shadcn Evidence
| id | source | note |
| --- | --- | --- |
| S1 | @shadcn/spinner | Uses cva for variants, size controlled via class (e.g., size-4) |
| S2 | spinner-demo.tsx | Shows spinner in context with Item component |
| S3 | spinner-size.tsx | Demonstrates size variations via class |
