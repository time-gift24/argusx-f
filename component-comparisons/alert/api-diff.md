# alert API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| root selector | `z-alert, [z-alert]` | `argusx-alert` | `<Alert />` | `argusx-alert` | yes | adopt-shadcn primitive shape + argusx naming | 单一入口，默认态 plain | Z1/S2/L2 |
| content composition | `zTitle/zDescription/zIcon` 输入驱动单组件 | projection + `argusx-alert-title/description` | `Alert + AlertTitle + AlertDescription` | projection + 子组件 | yes | adopt-shadcn | plain 下仅做结构/排版，无额外装饰 | U1/S3/S4/L3/L4 |
| variant API | `zType: default|destructive` | `variant: plain|destructive|warning|info|success` | `variant: default|destructive` | `variant: plain|destructive|warning|info|success` | partial | adopt-shadcn behavior + extend-argusx | `plain` 语义等价 shadcn `default` | Z2/Z3/S1/L1 |
| default variant value | `default` | `plain` | `default` | `plain` | yes | extend-argusx (plain contract) | 默认值固定 plain | Z3/S1/L1 |
| root layout contract | `flex items-center gap-3` | `grid` + icon column contract | `grid` + icon column contract | 与 shadcn 对齐（含 lucide 扩展） | yes | adopt-shadcn | 默认态无阴影/渐变 | Z3/S1/L1 |
| title typography | `font-medium tracking-tight leading-none` | `line-clamp-1 min-h-4 font-medium tracking-tight` | `line-clamp-1 min-h-4 font-medium tracking-tight` | 与 shadcn 对齐 | yes | adopt-shadcn | 保持信息密度稳定 | Z3/S3/L3 |
| description typography | `text-sm leading-relaxed mt-1` | `text-muted-foreground ... [&_p]:leading-relaxed` | `text-muted-foreground ... [&_p]:leading-relaxed` | 与 shadcn 对齐 | yes | adopt-shadcn | 减少额外样式噪声 | Z3/S4/L4 |
| root slot + a11y attrs | `data-slot="alert"`, `role="alert"` | `data-slot="alert"`, `role="alert"`, `aria-live="polite"` | `data-slot="alert"`, `role="alert"` | 保留并扩展 `aria-live` | no | adopt-shadcn + extend-argusx | a11y 扩展不改变主路径 | Z5/S2/L2 |
| action primitive | none | `argusx-alert-action` | none | `argusx-alert-action` | no | extend-argusx | plain 默认态可叠加操作区 | L5/L6 |
| semantic variants | none | `info`/`warning`/`success` | none | `info`/`warning`/`success` | no | extend-argusx | 均为 token 驱动的低装饰扩展 | L1/L6 |

## Conflict Decisions (Must Adopt shadcn)
- [x] 结构主路径采用 shadcn slot primitives（`AlertTitle`、`AlertDescription`），不保留 zardui 的 `zTitle/zDescription` 一体化输入形态。证据：U1, S3, S4, L3, L4。
- [x] root/layout 对齐 shadcn：采用 grid icon-column contract，而不是 zardui 的 flex layout。证据：Z3, S1, L1。
- [x] 标题与描述排版 contract 完全对齐 shadcn v4。证据：S3, S4, L3, L4。
- [x] destructive 描述文本联动色对齐 shadcn。证据：S1, L1。

## Non-conflict Extensions (ArgusX Plain)
- [x] `variant='plain'`：作为默认 variant，视觉语义等价 shadcn `default`，满足 ArgusX plain contract。证据：S1, L1。
- [x] `variant='info' | 'warning' | 'success'`：shadcn 未定义的语义扩展，保留 plain 风格。证据：L1, L6。
- [x] `argusx-alert-action`：操作区插槽扩展，不改变 shadcn 主路径。证据：L5, L6。
- [x] `aria-live='polite'`：a11y 扩展，不改变交互语义。证据：L2, S2。

## Missing APIs
- [x] 无未覆盖的 shadcn 核心 API（`Alert` / `AlertTitle` / `AlertDescription` + destructive scenario 均已覆盖）。证据：S1, S5, L1, L3, L4, L6。

## Behavior Mismatches
- [x] zardui destructive 自动图标推导（`circle-alert`）未纳入 target，改为 shadcn 风格显式 icon slot。证据：Z4, S5, L6。
- [x] zardui 通过输入渲染 title/description；target 使用投影子组件，与 shadcn 一致。证据：U1, S3, S4, L3, L4。

## Final Target API
- selectors:
  - `argusx-alert`
  - `argusx-alert-title`
  - `argusx-alert-description`
  - `argusx-alert-action` (ArgusX extension)
- inputs:
  - `argusx-alert`: `variant` (`plain | destructive | warning | info | success`, default: `plain`), `class` (string)
  - `argusx-alert-title`: `class` (string)
  - `argusx-alert-description`: `class` (string)
  - `argusx-alert-action`: `class` (string)
- outputs:
  - none
- data attributes:
  - root: `data-slot="alert"`, `data-variant`
  - title: `data-slot="alert-title"`
  - description: `data-slot="alert-description"`
  - action: `data-slot="alert-action"`
- accessibility contract:
  - root `role="alert"`
  - root `aria-live="polite"`
- plain style defaults:
  - default variant 为 `plain`
  - 默认态不使用强阴影、渐变、玻璃化
  - semantic 扩展（info/warning/success）使用 design tokens
