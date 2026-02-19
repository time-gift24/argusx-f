# breadcrumb API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | evidence |
| --- | --- | --- | --- | --- | --- |
| Root selector | `z-breadcrumb` | `app-breadcrumb` | `Breadcrumb` (`nav`) | `argusx-breadcrumb`, `nav[argusxBreadcrumb]` | Z1/L1/S1 |
| List selector | 内置在 root 模板中 `ol` | `app-breadcrumb-list` | `BreadcrumbList` (`ol`) | `argusx-breadcrumb-list`, `ol[argusxBreadcrumbList]` | Z1/L1/S1 |
| Item selector | `z-breadcrumb-item` | `app-breadcrumb-item` | `BreadcrumbItem` (`li`) | `argusx-breadcrumb-item`, `li[argusxBreadcrumbItem]` | Z2/L1/S1 |
| Link selector | item 内置 `<a>` + host directive | `a[app-breadcrumb-link], app-breadcrumb-link` | `BreadcrumbLink` (`a`, asChild) | `argusx-breadcrumb-link`, `a[argusxBreadcrumbLink]` | Z2/L1/S1 |
| Page selector | 无独立组件 | `app-breadcrumb-page` | `BreadcrumbPage` (`span`) | `argusx-breadcrumb-page`, `span[argusxBreadcrumbPage]` | Z2/L1/S1 |
| Separator mode | 根级 `zSeparator`（string/template） | `customContent` input 控制渲染 | children 覆盖默认 icon | 仅手动 separator 组件 children 模式 | Z2/U2/L2/S2 |
| Ellipsis API | `zColor` | 无颜色输入 | class 可扩展 | `ellipsisColor: muted \| strong` | Z3/Z4/S1 |
| Size API | `zSize` | 无 | 无 | `size: sm \| md \| lg`（扩展） | Z1/Z4/L1 |
| Align API | `zAlign` | 无 | 无 | `align: start \| center \| end`（扩展） | Z1/Z4/L1 |
| Wrap API | `zWrap` | 无 | 无 | `wrap: wrap \| nowrap`（扩展） | Z1/Z4/L1 |
| data-slot | 无统一约定 | 部分对齐 | 明确定义全套 slot | 全量对齐 shadcn slot 命名 | L1/S1 |
| Complex preview | ellipsis+menu demo | 无响应式复杂示例 | demo + responsive demo | 覆盖 dropdown + responsive drawer fallback | U3/L3/S3/S4 |

## Missing APIs
- [x] semantic selectors（`nav/ol/li/a/span` attribute）: 本地旧实现缺失，已补齐以匹配 shadcn 语义结构。`L1 -> target`
- [x] 扩展输入 `size/align/wrap/ellipsisColor`: 本地旧实现缺失，已基于 zardui 非冲突能力补齐。`Z1/Z4/L1`
- [x] 响应式复杂示例：本地旧 preview 缺失，已补齐 desktop dropdown / mobile drawer。`L3/S4`

## Behavior Mismatches
- [x] Separator 自定义机制：本地旧实现依赖 `customContent` 布尔输入，且与 children 语义脱节；目标改为 shadcn children 覆盖默认 icon。`L2/S2`
- [x] 命名体系：本地旧 API 为 `app-breadcrumb*`；目标统一迁移 `argusx-*` 并移除旧模板 API。`L1`

## Final Target API
- selectors:
  - `argusx-breadcrumb`, `nav[argusxBreadcrumb]`
  - `argusx-breadcrumb-list`, `ol[argusxBreadcrumbList]`
  - `argusx-breadcrumb-item`, `li[argusxBreadcrumbItem]`
  - `argusx-breadcrumb-link`, `a[argusxBreadcrumbLink]`
  - `argusx-breadcrumb-page`, `span[argusxBreadcrumbPage]`
  - `argusx-breadcrumb-separator`, `li[argusxBreadcrumbSeparator]`
  - `argusx-breadcrumb-ellipsis`, `span[argusxBreadcrumbEllipsis]`
- inputs:
  - all parts: `class?: string`
  - root: `size?: 'sm' | 'md' | 'lg'` (default `md`)
  - list: `align?: 'start' | 'center' | 'end'` (default `start`), `wrap?: 'wrap' | 'nowrap'` (default `wrap`)
  - ellipsis: `ellipsisColor?: 'muted' | 'strong'` (default `muted`)
- outputs:
  - none
- data attributes:
  - `data-slot`: `breadcrumb`, `breadcrumb-list`, `breadcrumb-item`, `breadcrumb-link`, `breadcrumb-page`, `breadcrumb-separator`, `breadcrumb-ellipsis`
  - state attrs: `data-size`, `data-align`, `data-wrap`, `data-color`
- accessibility contract:
  - root: `aria-label="breadcrumb"`
  - page: `role="link" aria-disabled="true" aria-current="page"`
  - separator + ellipsis: `role="presentation" aria-hidden="true"`
