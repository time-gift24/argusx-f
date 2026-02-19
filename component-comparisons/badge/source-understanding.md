# badge Source Understanding

## Mapping
- local: `badge`
- zardui: `badge`
- shadcn: `badge`
- rationale: zardui 和 shadcn 都存在同名 `badge`，适合直接做 API 冲突判定；其中 shadcn 定义主 API，zardui 提供可复用的实现轨道（`zType/zShape`）。
- note: 当前会话未暴露 `mcp__shadcn__*` 工具，shadcn 证据通过 `npx shadcn@latest view/search` 获取。

## Shadcn Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | `/tmp/shadcn-badge.tsx` | 7-25 | `badgeVariants` 定义 `variant` 六种取值（default/secondary/destructive/outline/ghost/link），默认 `default`。 |
| S2 | `/tmp/shadcn-badge.tsx` | 29-44 | 组件暴露 `asChild`，并输出 `data-slot="badge"` 与 `data-variant`。 |
| S3 | `/tmp/shadcn-badge.tsx` | 8 | 基础样式含 `rounded-full`、`text-xs`、`transition-[color,box-shadow]`。 |
| S4 | `/tmp/shadcn-badge-demo.tsx` | 9-37 | 示例覆盖 core variants + icon badge + numeric counter。 |
| S5 | `/tmp/shadcn-badge-search.json` | 10-44 | registry 中 badge 相关 item（`badge`, `badge-demo`, `badge-outline`, `badge-secondary`, `badge-destructive`）可用于对齐示例范围。 |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/badge/badge.component.ts` | 10-29 | `z-badge` 组件输入为 `zType` 与 `zShape`，host class 由 variants 计算。 |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/badge/badge.variants.ts` | 7-23 | `zType` 有 4 种，`zShape` 有 `default/square/pill`，并给出默认值。 |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/badge/badge.variants.ts` | 15-17 | shape 语义：`default=rounded-md`、`square=rounded-none`、`pill=rounded-full`。 |
| Z4 | `/tmp/zardui/libs/zard/src/lib/shared/components/badge/index.ts` | 1-2 | 对外导出 `badge.component` 与 `badge.variants`。 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/libs/zard/src/lib/shared/components/badge/doc/api.md` | 5-8 | API 文档声明公开属性 `zType` 与 `zShape` 及默认值。 |
| U2 | `/tmp/zardui/libs/zard/src/lib/shared/components/badge/demo/default.ts` | 13-26 | 真实示例显示 4 种 type、shape 组合和数字徽标写法。 |
| U3 | `/tmp/zardui/apps/web/public/components/badge/demo/shape.md` | 10-12 | 文档 demo 明确给出 `zShape="square"` 场景。 |
| U4 | `/tmp/zardui/apps/web/public/components/badge/demo/default.md` | 14-27 | 文档站 demo 与 libs demo 一致，验证组合行为。 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/badge/badge.directive.ts` | 6-33 | 本地 `argusxBadgeVariants` 以 shadcn 六种 `variant` 为主路径，并新增 `shape` 扩展。 |
| L2 | `src/app/shared/ui/badge/badge.directive.ts` | 53-75 | selector 为 `argusx-badge`，输入 `variant/shape/class`，输出 `data-slot/data-variant/data-shape`。 |
| L3 | `src/app/shared/ui/badge/index.ts` | 1-6 | 导出 `ArgusxBadgeDirective`、`argusxBadgeVariants` 及类型。 |
| L4 | `src/app/preview/badge-preview.component.ts` | 23-185 | preview 覆盖 shadcn 主路径（variants/icons/counters/link）和 ArgusX 扩展（shape + 复杂组合）。 |
