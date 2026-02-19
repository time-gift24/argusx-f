# toggle Source Understanding

## Mapping
- local: `toggle`
- zardui: `toggle`
- shadcn: `toggle`
- rationale: 本地之前没有完整的 toggle 组件实现，只有 toggle.directive。zardui 提供了完整的 toggle 组件实现，shadcn 是 API 对标参考。

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | /tmp/zardui/libs/zard/src/lib/shared/components/toggle/toggle.component.ts | 1-116 | 主组件实现，包含 selector: z-toggle, inputs: zValue, zDefault, zDisabled, zType, zSize, zAriaLabel, outputs: zToggleClick, zToggleHover, zToggleChange |
| Z2 | /tmp/zardui/libs/zard/src/lib/shared/components/toggle/toggle.variants.ts | 1-24 | 变体定义：zType (default, outline), zSize (sm, md, lg) |
| Z3 | /tmp/zardui/libs/zard/src/lib/shared/components/toggle/doc/api.md | 1-26 | API 文档 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | /tmp/zardui/libs/zard/src/lib/shared/components/toggle/demo/toggle.ts | 1-48 | 组件示例入口，包含 default, with-forms, with-default, outline, with-text, small, large, disabled 等场景 |
| U2 | /tmp/zardui/libs/zard/src/lib/shared/components/toggle/demo/default.ts | 1-15 | 默认用法示例 |
| U3 | /tmp/zardui/apps/web/public/components/toggle/demo/ | - | Web demo 展示 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/toggle/toggle.directive.ts | 1-69 | 原有的 toggle directive，使用 appToggle 选择器 |
| L2 | src/app/preview/toggle-preview.component.ts | 1-77 | 原有 preview，展示基本用法 |

## Shadcn Evidence
| id | source | note |
| --- | --- | --- |
| S1 | shadcn MCP - toggle-demo | Toggle size="sm" variant="outline" 带图标 |
| S2 | shadcn MCP - toggle-sm | Toggle size="sm" |
| S3 | shadcn MCP - toggle-lg | Toggle size="lg" |
