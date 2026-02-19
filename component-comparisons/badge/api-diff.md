# badge API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | `z-badge` | `span/a/div[argusx-badge]` | React `<Badge />` | `span/a/div[argusx-badge]` | yes | adopt-shadcn semantics + argusx prefix | Angular 用 attribute selector 承载 shadcn 语义 | Z1/S2/L2 |
| variant prop naming | `zType` | `variant` | `variant` | `variant` | yes | adopt-shadcn | 统一主路径命名，去除 zard 命名 | Z1/S1/L1 |
| variant options | `default/secondary/destructive/outline` | `default/secondary/destructive/outline/ghost/link` | `default/secondary/destructive/outline/ghost/link` | same as shadcn (6) | yes | adopt-shadcn | 默认视觉仍保持克制，无额外装饰 | Z2/S1/L1 |
| default variant value | `default` | `default` | `default` | `default` | no | adopt-shadcn | 与 shadcn 一致 | Z2/S1/L1 |
| shape capability | `zShape` (`default/square/pill`) | `shape` (`default/square/pill`) | N/A | `shape` extension | no | extend-argusx | 保留 zard 能力作为非冲突扩展 | Z2/U1/L1 |
| base radius baseline | `zShape=default` => `rounded-md` | base `rounded-full` + `shape` override | base `rounded-full` | keep `rounded-full` baseline | yes | adopt-shadcn | plain 默认沿 shadcn 基线，不增加视觉噪声 | Z3/S3/L1 |
| class override prop | `class` input | `class` input | `className` prop | `class` input | no | extend-argusx | Angular 约定 | Z1/S2/L2 |
| data attributes | none explicit | `data-slot/data-variant/data-shape` | `data-slot/data-variant` | keep shadcn attrs + argusx extension attr | no | adopt shadcn + extend-argusx | `data-shape` 仅承载扩展态 | S2/L2 |
| host composition | fixed host `<z-badge>` | fixed host span/a/div | `asChild` via Slot | 不提供 `asChild`，用 host tag 差异实现 | yes | adopt-shadcn semantics where applicable | Angular 指令模型下 `asChild` 不成立 | Z1/S2/L2 |

## Conflict Decisions (Must Adopt shadcn)
- [x] `variant` 命名和六种取值完全采用 shadcn；不保留 zard 的 `zType` 主入口。`Z1/Z2/S1/L1`
- [x] 默认圆角基线采用 shadcn `rounded-full`，不采用 zard `zShape=default -> rounded-md`。`Z3/S3/L1`
- [x] host 语义维持 shadcn 的 `data-slot="badge"` 与 `data-variant`。`S2/L2`
- [x] destructive/outline/ghost/link 等交互语义按 shadcn 类名实现。`S1/L1`

## Non-conflict Extensions (ArgusX Plain)
- [x] `shape` 扩展：`shape="default|square|pill"`，对应 `data-shape`，默认不改变 shadcn 基线。来源 zard `zShape`，但主路径仍是 shadcn variant。`Z2/U1/L1/L2`

## Missing APIs
- [x] shadcn `asChild` 未直接暴露为输入；Angular 指令通过挂载到 `span/a/div` 达到相近组合能力。`S2/L2`

## Behavior Mismatches
- [x] zard 默认 shape 是 `rounded-md`，shadcn baseline 为 `rounded-full`；冲突项采用 shadcn，shape 只作为扩展覆盖。`Z3/S3/L1`
- [x] zard 仅 4 种 type，shadcn 有 6 种 variant；冲突项采用 shadcn 六种。`Z2/S1/L1`

## Final Target API
- selectors: `span[argusx-badge], a[argusx-badge], div[argusx-badge]`
- inputs:
  - `variant` (`default|secondary|destructive|outline|ghost|link`, default: `default`)
  - `shape` (`default|square|pill`, default: `default`) [ArgusX extension]
  - `class` (`string`, default: `''`)
- outputs: (none)
- data attributes: `data-slot="badge"`, `data-variant`, `data-shape`
- accessibility contract: focus-visible ring + aria-invalid visual contract with shadcn class matrix
- plain style defaults: 默认态不加阴影/渐变/玻璃化；扩展 shape 仅改变圆角，不改变色彩语义
