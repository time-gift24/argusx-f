# table Source Understanding

## Mapping
- local: `table`
- zardui: `table`
- shadcn: `table`
- rationale: Both zardui and shadcn use table primitives (thead, tbody, tr, th, td). Local uses directives, zardui uses components.

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | /tmp/zardui/libs/zard/src/lib/shared/components/table/table.component.ts | 1-153 | Components for table, thead, tbody, tr, th, td, caption |
| Z2 | /tmp/zardui/libs/zard/src/lib/shared/components/table/table.variants.ts | 1-63 | Type variants (default, striped, bordered) and size variants (default, compact, comfortable) |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | /tmp/zardui/apps/web/public/components/table/demo/table.ts | 1-50 | Basic table with header, body, footer |
| U2 | /tmp/zardui/apps/web/public/components/table/demo/simple.ts | 1-30 | Simple table usage |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/table/table.directive.ts | 1-193 | Directive-based table primitives with data-slot attributes |
| L2 | src/app/preview/table-preview.component.ts | 1-74 | Preview with invoice example |
