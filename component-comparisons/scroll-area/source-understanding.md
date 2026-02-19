# scroll-area Source Understanding

## Mapping
- local: `scroll-area`
- zardui: (not available - no scroll-area in zardui)
- shadcn: `scroll-area`
- rationale: zardui 不包含 scroll-area 组件，本组件基于本地现有实现并对齐 shadcn API

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | N/A | - | zardui 无 scroll-area 组件 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | shadcn registry | - | scroll-area-demo: 垂直滚动示例 |
| U2 | shadcn registry | - | scroll-area-horizontal-demo: 水平滚动 + ScrollBar 子组件 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/scroll-area/scroll-area.component.ts | 47 | selector: 'app-scroll-area' |
| L2 | src/app/shared/ui/scroll-area/scroll-area.component.ts | 121 | orientation input: 'vertical' \| 'horizontal' \| 'both' |
| L3 | src/app/shared/ui/scroll-area/scroll-area.component.ts | 126 | class input |
| L4 | src/app/shared/ui/scroll-area/scroll-area.component.ts | 132 | scrollbarVisible input |
| L5 | src/app/shared/ui/scroll-area/scroll-area.component.ts | 137 | scrollChange output |
| L6 | src/app/shared/ui/scroll-area/scroll-area.component.ts | 142 | scrollBottom output |

## Shadcn Baseline
- 基于 Radix UI ScrollArea
- 主要 props: className
- 子组件: ScrollBar (可选)
- API 非常简单，主要通过 className 控制样式

## Target API (After Rewrite)
1. selector: `argusx-scroll-area` (迁移自 app-scroll-area)
2. class input: 保留 (shadcn 使用 className，但 Angular 习惯用 class)
3. orientation input: 保留 (扩展 API)
4. scrollbarVisible input: 保留 (扩展 API)
5. scrollChange output: 保留 (扩展 API)
6. scrollBottom output: 保留 (扩展 API)
