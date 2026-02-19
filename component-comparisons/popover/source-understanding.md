# popover Source Understanding

## Mapping
- local: `popover`
- zardui: `N/A` (无对应组件)
- shadcn: `popover`
- rationale: zardui 中无 popover 组件，使用本地 CDK Overlay 实现作为基础

## Shadcn Evidence
| id | file | lines | API/Behavior |
| --- | --- | --- | --- |
| S1 | registry/new-york-v4/ui/popover.tsx | 1-56 | Popover (Root): Radix UI Root，props 透传 |
| S2 | registry/new-york-v4/ui/popover.tsx | 8-11 | PopoverTrigger: Radix UI Trigger，props 透传 |
| S3 | registry/new-york-v4/ui/popover.tsx | 13-38 | PopoverContent: align=center, sideOffset=4, className 透传 |
| S4 | registry/new-york-v4/ui/popover.tsx | 40-43 | PopoverAnchor: Radix UI Anchor |
| S5 | registry/new-york-v4/ui/popover.tsx | 45-50 | PopoverHeader: div, data-slot="popover-header" |
| S6 | registry/new-york-v4/ui/popover.tsx | 52-57 | PopoverTitle: div (不是 h2!), data-slot="popover-title" |
| S7 | registry/new-york-v4/ui/popover.tsx | 59-64 | PopoverDescription: p, data-slot="popover-description" |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | N/A | N/A | zardui 无 popover 组件，使用本地 CDK Overlay 实现 |

## Usage Evidence (Doc + Demo)
| id | file | scenario |
| --- | --- | --- |
| U1 | shadcn popover-demo | 表单场景：dimensions 设置 |
| U2 | 本地 popover-preview.component.ts | 现有预览组件 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | popover.component.ts | 51-82 | PopoverComponent: CDK Overlay 实现，selector=app-popover |
| L2 | popover.component.ts | 209-225 | PopoverTriggerDirective: [appPopoverTrigger] |
| L3 | popover.component.ts | 235-243 | PopoverAnchorDirective: [appPopoverAnchor] |
| L4 | popover.component.ts | 253-318 | PopoverContentComponent: glass 变体支持 |
| L5 | popover.component.ts | 328-344 | PopoverHeaderComponent |
| L6 | popover.component.ts | 354-370 | PopoverTitleComponent |
| L7 | popover.component.ts | 380-396 | PopoverDescriptionComponent |
