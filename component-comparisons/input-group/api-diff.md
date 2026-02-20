# input-group API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Root composition | `z-input-group` + `zAddonBefore/zAddonAfter` | 组合式子组件 | `InputGroup + Addon/Input/Textarea/Button/Text` | `argusx-input-group` + 组合式子组件 | yes | adopt-shadcn | 以中性结构为主，不叠加品牌装饰 | Z1,S2,L1 |
| Root visual baseline (radix-mira) | 依赖 zardui 变体 | 已对齐 `bg-input/20` + `h-7` + `ring-2` | `bg-input/20` + `h-7` + `ring-2` | 与 shadcn 一致 | yes | adopt-shadcn | plain 默认密度、低噪声 | S2,L1,L6 |
| Addon align enum | `inline \| block` | `inline-start/inline-end/block-start/block-end` | `inline-start/inline-end/block-start/block-end` | 与 shadcn 一致 | yes | adopt-shadcn | 默认 `inline-start` | Z1,S3,L2 |
| Addon click focus behavior | 无明确约束 | 非按钮点击聚焦首个 `input` | 非按钮点击聚焦首个 `input` | 与 shadcn 一致 | yes | adopt-shadcn | 不引入额外交互动画 | S4,L2 |
| Button defaults | 无独立 button 默认语义 | `variant=ghost` `size=xs` | `variant=ghost` `size=xs` | 与 shadcn 一致 | yes | adopt-shadcn | 默认轻量 ghost/xs | S5,L5 |
| Control slot marker | effect 注入 `data-slot` | input/textarea 显式 `data-slot="input-group-control"` | input/textarea 显式 `data-slot` | 与 shadcn 一致 | no | adopt-shadcn | 结构标记，无额外视觉语义 | Z2,S2,L3 |
| Control id passthrough | 由原生 input/textarea 直接承载 | `argusx-input-group-input/textarea` 透传 `id` 到真实控件 | 示例大量依赖 `id + label/htmlFor` | 支持 `id` 透传 | yes | adopt-shadcn | 不改变默认样式，仅补语义可达性 | S6,L3,L4,L6 |
| Group disabled | `zDisabled` | `disabled`（并传播到控件/button） | shadcn 无 group-level 输入 | 保留 ArgusX 扩展 | no | extend-argusx | 仅降低对比度与交互，不加动效 | Z1,Z4,U1,L1 |
| Group loading | `zLoading` | `loading`（并传播到控件/button） | shadcn 通过 `data-disabled`/spinner 组合示例表达 | 保留 ArgusX 扩展 | no | extend-argusx | 以 spinner/禁用态表达忙碌 | Z1,U3,S8,L1,L5 |
| Group size | `zSize: sm/default/lg` | `size: sm/default/lg`（default 对齐 h-7） | shadcn 无 group size API | 保留 ArgusX 扩展 | no | extend-argusx | default 走 shadcn 基线，sm/lg 为 plain 扩展 | Z1,U2,S2,L1 |
| Kbd parity scenario | 无 | preview 已覆盖 `item=kbd-example` 核心组合 | `With Kbd` 场景 | 对齐 `⌘K/Tab/Ctrl+C/disabled/loading` 主链路 | no | adopt-shadcn | 保持 plain，避免重装饰 | S6,S7,S8,L5 |

## Conflict Decisions (Must Adopt shadcn)
- [x] 组合入口冲突：移除 `zAddonBefore/zAddonAfter` 主入口，采用 shadcn 子组件组合。
- [x] `align` 枚举冲突：采用四态 `inline-start/inline-end/block-start/block-end`。
- [x] 根样式冲突：对齐 radix-mira 基线（`bg-input/20`、`h-7`、`ring-2`）。
- [x] addon 点击语义冲突：采用“非按钮点击仅聚焦 `input`”行为。
- [x] 控件语义冲突：补齐 `id` 透传，满足 shadcn 示例 `label/htmlFor` 链路。

## Non-conflict Extensions (ArgusX Plain)
- [x] `disabled`：group 级禁用并传播到 input/textarea/button。
- [x] `loading`：group 级 loading 并传播到 input/textarea/button；可在 addon 放置 spinner。
- [x] `size`：group 级 `sm/default/lg`；`default` 对齐 shadcn 基线，`sm/lg` 为 plain 扩展。

## Missing APIs
- [x] zardui `zAddonBefore/zAddonAfter` 未保留（按破坏式改写策略移除，改由组合式 API 表达）。

## Behavior Mismatches
- [x] 已修复：根样式此前偏离 radix-mira（`h-8/ring-3`），已对齐 `h-7/ring-2`。
- [x] 已修复：addon 点击此前会聚焦 textarea，现与 shadcn 一致仅聚焦 `input`。
- [x] 已修复：控件此前缺少 `id` 透传，现支持并由单测覆盖。
- [x] 已修复：preview 此前缺少 `item=kbd-example` 主场景，现补齐。

## Final Target API
- selectors:
  - `argusx-input-group`
  - `argusx-input-group-addon`
  - `button[argusxInputGroupButton]`
  - `argusx-input-group-text`
  - `argusx-input-group-input`
  - `argusx-input-group-textarea`
- inputs:
  - `InputGroupComponent`: `class`, `disabled`, `loading`, `size`
  - `InputGroupAddonComponent`: `align`, `class`
  - `InputGroupButtonComponent`: `type`, `variant`, `size`, `disabled`, `class`
  - `InputGroupInputComponent`: `id`, `type`, `placeholder`, `disabled`, `readonly`, `required`, `value`, `ariaInvalid`, `ariaDescribedby`, `class`
  - `InputGroupTextareaComponent`: `id`, `placeholder`, `disabled`, `readonly`, `required`, `value`, `rows`, `cols`, `ariaInvalid`, `ariaDescribedby`, `class`
- outputs:
  - none
- data attributes:
  - group: `data-slot="input-group"`, `data-size`, `data-disabled`
  - addon: `data-slot="input-group-addon"`, `data-align`
  - control: `data-slot="input-group-control"`, `data-size`
  - button: `data-slot="input-group-button"`, `data-size`, `data-variant`, `data-disabled`
- accessibility contract:
  - group: `role="group"`, `aria-disabled`, `aria-busy`
  - control: `id` 可透传；`aria-invalid` / `aria-describedby` 透传
- plain style defaults:
  - default: shadcn radix-mira baseline（中性、低装饰）
  - button default: `ghost/xs`
  - group size default: `default`（对应 h-7）
