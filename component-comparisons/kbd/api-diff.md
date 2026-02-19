# kbd API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| kbd selector | `z-kbd`, `[z-kbd]` | `appKbd` (before rewrite) -> `argusx-kbd` | `Kbd` component | `kbd[argusx-kbd]` | yes | conflict-adopt-shadcn | 默认样式回到 shadcn 中性基线 | Z1, L1, S1 |
| kbd-group selector | `z-kbd-group`, `[z-kbd-group]` | `appKbdGroup` (before rewrite) -> `argusx-kbd-group` | `KbdGroup` component | `kbd[argusx-kbd-group]` | yes | conflict-adopt-shadcn | 只保留单一主入口 | Z3, L2, S2 |
| class passthrough | `class` | `class` | `className` | `class` | no | conflict-adopt-shadcn | Angular 形态下用 `class` 对齐语义 | Z1, U1, S1, L1 |
| base style contract | `rounded-sm`, `text-xs`, neutral tokens | `rounded-xs`, `text-[0.625rem]` (before rewrite) | `rounded-sm`, `text-xs`, neutral tokens | adopt shadcn classes | yes | conflict-adopt-shadcn | plain 默认低装饰，避免强化品牌样式 | Z2, S3, L1 |
| tooltip context style | supports tooltip context style | supported but class token spelling differed | `[[data-slot=tooltip-content]_&]` | adopt shadcn token shape | yes | conflict-adopt-shadcn | tooltip 下只做轻量对比增强 | Z2, S3, L1 |
| `size` API | none | `size` existed | none | `size: sm/default/lg` | no | no-conflict-extend-argusx | `default` 完全等价 shadcn 基线；`sm/lg` 为 plain 扩展 | L1 |
| `data-slot` attrs | none explicit | `kbd` / `kbd-group` | `kbd` / `kbd-group` | same as shadcn | no | conflict-adopt-shadcn | data-slot 仅用于语义/样式，不引入视觉噪声 | S1, S2, L1, L2 |
| `data-size` attr | none | none (before rewrite) | none | `data-size` on kbd | no | no-conflict-extend-argusx | 辅助扩展样式，不影响 shadcn 主路径 | L1 |

## Conflict Decisions (Must Adopt shadcn)
- [x] selector naming: 旧本地 `appKbd/appKbdGroup` 与 shadcn 组件命名体系冲突，统一收敛为 `argusx-kbd/argusx-kbd-group`（基于 shadcn 语义 + argusx 前缀）。证据：S1, S2, L1, L2。
- [x] base classes: 旧本地默认 `rounded-xs + text-[0.625rem]` 与 shadcn `rounded-sm + text-xs` 不一致，采用 shadcn 基线。证据：S3, L1。
- [x] tooltip context token shape: 采用 shadcn `[[data-slot=tooltip-content]_&]` 形式，移除非基线 token 形态。证据：S3, L1。

## Non-conflict Extensions (ArgusX Plain)
- [x] `size` extension: 保留 `sm/default/lg` 作为 ArgusX 扩展，`default` 映射到 shadcn 原始尺寸，`sm/lg` 只做尺寸缩放，不改变颜色/阴影体系。证据：L1。
- [x] `data-size` attribute: 为扩展尺寸提供稳定样式钩子，不影响 shadcn 主语义。证据：L1。

## Missing APIs
- [x] 无。shadcn `kbd` 主路径（kbd + kbd-group + class + data-slot + tooltip context）已覆盖。证据：S1-S6, L1-L4。

## Behavior Mismatches
- [x] 旧命名不一致：`appKbd/appKbdGroup` 与当前 argusx 体系不一致，已迁移为 `argusx-kbd/argusx-kbd-group`。证据：L1, L2。
- [x] 旧默认样式偏离：`rounded-xs + text-[0.625rem]` 与 shadcn baseline 不一致，已回归 `rounded-sm + text-xs`。证据：S3, L1。

## Final Target API
- selectors:
  - `kbd[argusx-kbd]`
  - `kbd[argusx-kbd-group]`
- inputs:
  - `argusx-kbd`: `size` (`sm | default | lg`, default=`default`), `class`
  - `argusx-kbd-group`: `class`
- outputs:
  - none
- data attributes:
  - `argusx-kbd`: `data-slot="kbd"`, `data-size`
  - `argusx-kbd-group`: `data-slot="kbd-group"`
- accessibility contract:
  - retain semantic `<kbd>` element for key tokens and grouped shortcuts
  - `pointer-events-none` prevents accidental interaction on decorative keycaps
- plain style defaults:
  - default size uses shadcn neutral baseline (`rounded-sm`, muted surface, no heavy shadows/gradients)
  - size extension only changes dimensions/typography scale
