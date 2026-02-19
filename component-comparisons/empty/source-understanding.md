# empty Source Understanding

## Mapping
- local: `empty`
- zardui: `empty` (not available in zardui)
- shadcn: `empty`
- rationale: zardui does not have empty component, using local implementation aligned with shadcn API

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | N/A | N/A | zardui does not have empty component |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | shadcn registry: empty-demo | - | Basic empty state with icon, title, description, and actions |
| U2 | shadcn registry: empty-icon | - | Empty with icon only |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/empty/empty.directive.ts | 1-200 | Implementation using appEmpty* selectors |
| L2 | src/app/preview/empty-preview.component.ts | 1-90 | Preview using appEmpty* directives |

## shadcn API Reference
From shadcn registry:
- `Empty` - Root container
- `EmptyHeader` - Header section
- `EmptyMedia` - Icon/media area (variant: "icon")
- `EmptyTitle` - Title text
- `EmptyDescription` - Description text
- `EmptyContent` - Action buttons/content
