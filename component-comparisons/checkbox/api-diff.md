# checkbox API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | `z-checkbox` / `[z-checkbox]` | `app-checkbox` | `<Checkbox />` | `argusx-checkbox` | yes | adopt-shadcn | 单一 element selector，避免双轨入口 | Z1/L1/S1 |
| checked control contract | `[(ngModel)]` + `checkChange` (boolean only) | `checked` + `checkedChange` (`boolean \| indeterminate`) | `checked` + `onCheckedChange` | `checked` + `checkedChange`（Angular 对齐） | yes | adopt-shadcn | 以 shadcn 受控语义为主路径 | Z2/L1/S4 |
| uncontrolled default | 无 `defaultChecked` | 无 `defaultChecked` | `defaultChecked` | 增加 `defaultChecked` | yes | adopt-shadcn | 默认态仍是 plain 样式 | Z2/L1/S3 |
| disabled (forms + prop) | `zDisabled` + `disabledByForm` | `disabled`，但 CVA disable 未落地 | `disabled` | `disabled` + `setDisabledState` 合流 | yes | adopt-shadcn | 禁用态仅降低对比，不加重装饰 | Z3/L3/S3 |
| required/name/value/id | 无 `required/id` 显式能力 | 有 `required/name/value`、id 自动生成 | 通过 Root props 支持 | 完整支持 `required/name/value/id` | yes | adopt-shadcn | 无视觉强化，按 plain 默认呈现 | Z2/L1/S1 |
| state data attrs | 依赖原生 `checked` | `data-state` 手动映射 | 依赖 `data-[state=*]` 样式 | `data-state=checked|unchecked|indeterminate` | yes | adopt-shadcn | plain 下仅状态色变化 | Z4/L2/S2 |
| slot attrs | 无 `data-slot` 约定 | `checkbox`/`checkbox-indicator`/`checkbox-wrapper` | `checkbox`/`checkbox-indicator` | `checkbox`/`checkbox-indicator`（移除 wrapper） | yes | adopt-shadcn | 去掉 wrapper 装饰，保持轻量 | Z1/L1/S2 |
| visual semantic variant | `zType: default/destructive` | 无 | 无官方 prop（通过 class 覆盖） | `variant: plain/destructive` | no | extend-argusx | 默认 `plain`，`destructive` 为增量扩展 | Z4/U5/S3 |
| size extension | `zSize: default/lg` | 无 | 无 | `size: default/lg` | no | extend-argusx | `default` 作为 plain baseline | Z4/U6/S2 |
| shape extension | `zShape: default/circle/square` | 无 | 无 | `shape: default/circle/square` | no | extend-argusx | 仅边角变化，不引入高装饰 | Z4/U4/S2 |
| class override | `class` | `class` | `className` | `class`（合并到根节点） | yes | adopt-shadcn | class 只做增量，不改 plain 默认 | Z2/L1/S1 |
| indeterminate rendering | 不支持（boolean only） | 支持 `MinusIcon` | 支持 via Radix checked state | 支持 `boolean|'indeterminate'` + mixed ARIA | yes | adopt-shadcn | plain 图标与底色克制 | Z2/L2/S1 |

## Conflict Decisions (Must Adopt shadcn)
- [x] `checked` / `onCheckedChange` 语义冲突：zardui 仅 boolean、local 走 model 写法。统一为 shadcn 的 controlled contract（Angular 映射为 `checked` + `checkedChange`），并支持 `indeterminate`。证据：Z2, L1, S4。
- [x] `defaultChecked` 缺失：zardui/local 都没有，直接采用 shadcn uncontrolled 入口。证据：Z2, L1, S3。
- [x] 禁用态冲突：zardui 有 form disabled 合流，local 的 CVA disable 无效。以 shadcn `disabled` 语义为对外 API，同时复用 zardui 的 form 合流实现。证据：Z3, L3, S3。
- [x] slot/data-state 口径冲突：local 多出 `checkbox-wrapper`，zardui无 slot 约定。统一采用 shadcn 的 `checkbox`/`checkbox-indicator` + `data-state`。证据：Z1, L1, S2。

## Non-conflict Extensions (ArgusX Plain)
- [x] `variant`：shadcn 未定义官方视觉变体 prop，承接 zardui `zType` 能力扩展为 `variant: plain | destructive`；默认 `plain`，不引入重阴影与渐变。证据：Z4, U5, S3。
- [x] `size`：承接 zardui `zSize` 扩展为 `size: default | lg`，默认 `default`。证据：Z4, U6。
- [x] `shape`：承接 zardui `zShape` 扩展为 `shape: default | circle | square`。证据：Z4, U4。

## Missing APIs
- [x] `defaultChecked`：当前本地缺失，导致无法表达 shadcn uncontrolled 初始化场景。证据：L1, S3。
- [x] 表单禁用合流：当前本地 `setDisabledState` 为空，Reactive Forms 下行为不完整。证据：L3, Z3。
- [x] shadcn 级别表单受控入口：当前本地 preview 未演示 `checked + checkedChange + name` 复杂组合。证据：L4, S4。

## Behavior Mismatches
- [x] `setDisabledState`：当前实现不会同步 UI 禁用态；改写后禁用来源统一为 `disabled || disabledByForm`。证据：L3, Z3。
- [x] root slot 结构：当前 host 额外 `data-slot=checkbox-wrapper` 偏离 shadcn；改写后只保留 `checkbox` 与 `checkbox-indicator`。证据：L1, S2。
- [x] uncontrolled 初始化：当前无 `defaultChecked`，改写后与 shadcn 一致支持。证据：L1, S3。

## Final Target API
- selectors:
  - `argusx-checkbox`
- inputs:
  - shadcn 主路径：`checked?: boolean | 'indeterminate'`, `defaultChecked?: boolean | 'indeterminate'`, `disabled?: boolean`, `required?: boolean`, `name?: string`, `value?: string`, `id?: string`, `class?: string`
  - ArgusX plain 扩展：`variant?: 'plain' | 'destructive'`（默认 `plain`）、`size?: 'default' | 'lg'`、`shape?: 'default' | 'circle' | 'square'`
- outputs:
  - `checkedChange: boolean | 'indeterminate'`（Angular 对齐 shadcn `onCheckedChange`）
- data attributes:
  - `data-slot="checkbox"`
  - `data-slot="checkbox-indicator"`
  - `data-state="checked|unchecked|indeterminate"`
  - `data-variant`, `data-size`, `data-shape`
- accessibility contract:
  - `role="checkbox"`
  - `aria-checked="true|false|mixed"`
  - `aria-required`, `aria-disabled`, `aria-label`
  - `Space` / `Enter` 键盘切换
- plain style defaults:
  - 默认 `variant='plain'`
  - 默认态无强阴影/渐变/玻璃效果
  - 优先 token 色值（`border-input`、`primary` 等），避免组件内硬编码品牌色
