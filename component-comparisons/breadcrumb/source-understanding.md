# breadcrumb Source Understanding

## Mapping
- local: `breadcrumb`
- zardui: `breadcrumb`
- shadcn: `breadcrumb`
- rationale: 三方命名一致；该组件可直接执行 shadcn-first API + zardui implementation baseline 的改造流程。

## shadcn Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | `registry/new-york-v4/ui/breadcrumb.tsx` | 7-109 | 对外 API 主依据：`Breadcrumb/BreadcrumbList/BreadcrumbItem/BreadcrumbLink/BreadcrumbPage/BreadcrumbSeparator/BreadcrumbEllipsis`，并定义 `data-slot` 和 ARIA。 |
| S2 | `registry/new-york-v4/examples/breadcrumb-separator.tsx` | 22-32 | `BreadcrumbSeparator` 支持 children 覆盖默认 icon。 |
| S3 | `registry/new-york-v4/examples/breadcrumb-demo.tsx` | 29-51 | 典型复杂用法：ellipsis + dropdown。 |
| S4 | `registry/new-york-v4/examples/breadcrumb-responsive.tsx` | 60-108 | 响应式复杂用法：desktop dropdown / mobile drawer。 |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/breadcrumb/breadcrumb.component.ts` | 151-166 | 根组件提供 `zSize/zAlign/zWrap`；作为非冲突扩展候选。 |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/breadcrumb/breadcrumb.component.ts` | 75-85 | item 内部自动渲染 separator（`zSeparator` 或默认 chevron）。 |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/breadcrumb/breadcrumb.component.ts` | 46-51 | ellipsis 具备颜色变体 `zColor`。 |
| Z4 | `/tmp/zardui/libs/zard/src/lib/shared/components/breadcrumb/breadcrumb.variants.ts` | 3-58 | 变体基线：`size/align/wrap/ellipsisColor` 对应 class 组合。 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/apps/web/public/components/breadcrumb/doc/api.md` | 5-12 | 文档声明 `zSize/zAlign/zWrap/zSeparator`。 |
| U2 | `/tmp/zardui/apps/web/public/components/breadcrumb/demo/separator.md` | 12-20 | 演示根级 `zSeparator` 自定义分隔符。 |
| U3 | `/tmp/zardui/apps/web/public/components/breadcrumb/demo/ellipsis.md` | 12-26 | 演示 ellipsis 与菜单组合。 |
| U4 | `/tmp/zardui/apps/web/public/components/breadcrumb/demo/default.md` | 12-19 | 演示常规导航层级。 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/breadcrumb/breadcrumb.component.ts` (HEAD) | 34-245 | 旧 API 使用 `app-breadcrumb*` 选择器；未提供 semantic attribute selectors。 |
| L2 | `src/app/shared/ui/breadcrumb/breadcrumb.component.ts` (HEAD) | 167-193 | separator 通过 `customContent` 输入控制，不是 children 驱动。 |
| L3 | `src/app/preview/breadcrumb-preview.component.ts` (HEAD) | 20-84 | 旧 preview 仅覆盖 default / custom separator / ellipsis，未覆盖扩展 API 与响应式复杂场景。 |
