# tabs Source Understanding

## Mapping
- local: `tabs`
- zardui: `tabs`
- shadcn: `tabs`
- rationale: Local component exists and is already shadcn-aligned. Zardui has different API (index-based).

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | /tmp/zardui/libs/zard/src/lib/shared/components/tabs/tabs.component.ts | 1-345 | Root component ZardTabGroupComponent |
| Z2 | /tmp/zardui/libs/zard/src/lib/shared/components/tabs/tabs.variants.ts | - | Tab variants |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | /tmp/zardui/apps/web/public/components/tabs/demo/* | - | Various tab configurations |
| U2 | /tmp/zardui/apps/web/public/components/tabs/doc/api.md | - | API documentation |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/tabs/tabs.component.ts | 1-482 | Already uses shadcn-like API (value model, explicit content) |
| L2 | src/app/preview/tabs-preview.component.ts | 1-70 | Shows usage with app-tabs-* selectors |

## Notes
- Local component already closely matches shadcn API (value model, explicit trigger/content with value)
- Main differences: selectors (`app-tabs-*` vs `Tabs`), no `defaultValue` input
- ZardUI uses different pattern (index-based, child tabs with label)
- Local component variants: `default` (bg-muted), `line` (underline style)
