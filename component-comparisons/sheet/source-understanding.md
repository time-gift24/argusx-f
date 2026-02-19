# sheet Source Understanding

## Mapping
- local: `sheet`
- zardui: `sheet`
- shadcn: `sheet`
- rationale: 组件名称一致，直接复用

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | /tmp/zardui/libs/zard/src/lib/shared/components/sheet/sheet.component.ts | 1-206 | Sheet 组件核心实现，使用 CDK Overlay |
| Z2 | /tmp/zardui/libs/zard/src/lib/shared/components/sheet/sheet.variants.ts | 1-61 | Sheet 样式变体（side: left/right/top/bottom, size: default/sm/lg/custom） |
| Z3 | /tmp/zardui/libs/zard/src/lib/shared/components/sheet/sheet.service.ts | 1-107 | Sheet 服务，用于通过代码打开 sheet |
| Z4 | /tmp/zardui/libs/zard/src/lib/shared/components/sheet/sheet-ref.ts | 1-112 | Sheet 引用，管理关闭逻辑 |
| Z5 | /tmp/zardui/libs/zard/src/lib/shared/components/sheet/doc/api.md | 1-62 | API 文档 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | /tmp/zardui/libs/zard/src/lib/shared/components/sheet/demo/basic.ts | - | 基础使用示例 |
| U2 | /tmp/zardui/libs/zard/src/lib/shared/components/sheet/demo/side.ts | - | 位置示例 |
| U3 | /tmp/zardui/libs/zard/src/lib/shared/components/sheet/demo/dimensions.ts | - | 尺寸示例 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/sheet/sheet.component.ts | 1-530 | 基于 CDK Overlay 实现，包含 SheetComponent, SheetTriggerDirective, SheetCloseDirective 等子组件 |
| L2 | src/app/preview/sheet-preview.component.ts | 1-72 | Preview 组件 |
