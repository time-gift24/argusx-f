# progress Source Understanding

## Mapping
- local: `progress`
- zardui: `progress-bar` (via component-name-mapping.md)
- shadcn: `progress`
- rationale: zardui naming is `progress-bar`, mapped to local `progress` per naming rules

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | /Users/wanyaozhong/projects/zardui/src/app/shared/components/progress-bar/progress-bar.component.ts | 1-93 | Main component implementation |
| Z2 | /Users/wanyaozhong/projects/zardui/src/app/shared/components/progress-bar/progress-bar.variants.ts | 1-54 | Variant definitions (zType, zSize, zShape) |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | zardui source | - | zIndeterminate animation uses CSS keyframes for indeterminate state |
| U2 | zardui variants | - | Uses bg-primary/20 for container, bg-primary for bar |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/progress/progress.component.ts | 1-114 | Uses shadcn-aligned `value` and `max` inputs |
| L2 | src/app/shared/ui/progress/index.ts | 1-2 | Exports ProgressComponent with types |
