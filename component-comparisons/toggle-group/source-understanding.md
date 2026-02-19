# toggle-group Source Understanding

## Mapping
- local: `toggle-group`
- zardui: `toggle-group`
- shadcn: `toggle-group`
- rationale: All three use the same component name, but different selector prefixes

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | /tmp/zardui/libs/zard/src/lib/shared/components/toggle-group/toggle-group.component.ts | 32-70 | Component definition with z-prefixed inputs |
| Z2 | /tmp/zardui/libs/zard/src/lib/shared/components/toggle-group/toggle-group.variants.ts | 1-44 | CVA variants for toggle-group |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | /tmp/zardui/libs/zard/src/lib/shared/components/toggle-group/demo/default.ts | - | Default variant demo |
| U2 | /tmp/zardui/libs/zard/src/lib/shared/components/toggle-group/demo/outline.ts | - | Outline variant demo |
| U3 | /tmp/zardui/libs/zard/src/lib/shared/components/toggle-group/demo/single.ts | - | Single selection mode demo |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/toggle-group/toggle-group.component.ts | 47-95 | ToggleGroupComponent with app-toggle-group selector |
| L2 | src/app/shared/ui/toggle-group/toggle-group.component.ts | 106-177 | ToggleGroupItemComponent with app-toggle-group-item selector |
| L3 | src/app/shared/ui/toggle/toggle.directive.ts | 1-69 | ToggleDirective with toggle variants |
