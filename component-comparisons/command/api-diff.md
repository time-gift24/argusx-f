# command API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| root selector + export | `z-command` + `Zard*` | old `app-command` (pre-rewrite) | `Command` component family | `argusx-command` + `ArgusxCommand*` | yes | adopt-shadcn shape + argusx prefix | 默认 plain root，不做高装饰 | Z1/S1/L1 |
| root value semantics | `searchTerm` internal + selected option outputs | old local value 指向已选值 | cmdk command 输入值驱动搜索 | `value` 统一为搜索词 (`model<string>`) | yes | adopt-shadcn semantics | 搜索态只影响可见与高亮 | Z1/S1/L1 |
| item selection API | `zCommandSelected` 在 root 触发 | old local 通过 root value 侧写选择 | `CommandItem` 负责触发选择 | `argusx-command-item (select)` 发出 value | yes | adopt-shadcn component path | item 交互维持低噪声 plain 行高 | Z2/Z4/S5/L5 |
| dialog wrapper | zard 无等价 command-dialog 包装 | old local无 `CommandDialog` | `CommandDialog`（title/description/showCloseButton） | 新增 `argusx-command-dialog` 复用 dialog primitives | yes | adopt-shadcn | 默认无重阴影，rounded plain surface | S2/L3 |
| input/list/group/empty/separator slots | zard 有对应分拆组件 | old local已有但 `app-*` 命名 | shadcn 独立 slot 组件 | 全部迁移为 `argusx-command-*` slot 家族 | yes | adopt-shadcn | slot class 维持中性 token | Z3/Z5/Z6/S3/S4/L4 |
| keyboard roving model | zard root 索引 + enter 选择 | old local缺少完整 home/end 边界行为 | cmdk 样式的 roving/enter 行为 | `ArrowUp/Down/Home/End/Enter/Escape` 全覆盖 | yes | adopt-shadcn behavior | 高亮态仅用 muted/accent，不加动画噪声 | Z2/S1/L2 |
| focus helper substrate | zard option 直接 focus 当前项 | old local command 自管，无共享底座 | shadcn不限定底座 | menu-core 扩展通用 focus helper 并被 command 复用 | no | extend-argusx | 底层复用不改变视觉主路径 | Z2/L2/L7 |
| item visual primitives | zard 有自身 variants | old local command 自己维护类串 | shadcn item/shortcut/separator contract | item/shortcut/separator 复用 menu-core variants + command slot states | no | extend-argusx | plain 默认，去品牌硬编码 | Z4/S5/L5 |
| preview scope | zard default demo 单页 | old local只覆盖单一 command 卡片 | command-example 5 场景 | preview 完整复刻 5 场景 | yes | adopt-shadcn example coverage | plain baseline + complex 组合同页展示 | U4/S6/S8/L6 |

## Conflict Decisions (Must Adopt shadcn)
- [x] **选择器与导出命名**：移除 `app-*` 主入口，统一为 `argusx-command*` 与 `ArgusxCommand*` 家族。
- [x] **value 主语义**：`argusx-command` 的 `value` 改为搜索词，不再表示已选值。
- [x] **选择事件路径**：由 item 输出 `(select)` 作为主选择事件通道，替换 root-value 侧写。
- [x] **Dialog API**：新增 `argusx-command-dialog` 对齐 shadcn `CommandDialog` 组件层能力。
- [x] **示例覆盖范围**：preview 对齐 `command-example` 五组示例，不再只展示单个内联场景。

## Non-conflict Extensions (ArgusX Plain)
- [x] **menu-core 底层复用**：在不改语义的前提下复用 menu-core variants 与 focus helper。
- [x] **`keywords` 检索扩展**：`argusx-command-item` 增加 `keywords` 输入，作为搜索补充字段。
- [x] **`loop`/`autoHighlight` 控制项**：保留键盘体验调优开关，不破坏 shadcn 主路径。

## Missing APIs
- [x] `argusx-command-dialog`（old local 缺失）已补齐。
- [x] shadcn 五场景 preview 覆盖（old local 缺失）已补齐。
- [x] menu-core 驱动的 command roving 底层（old local 缺失）已补齐。

## Behavior Mismatches
- [x] zard 使用 selectedIndex + option setSelected；现改为 value-driven highlighted state，与 shadcn slot/state 更一致。
- [x] old local 将 root `value` 作为已选值；现改为搜索词并由 item 事件提交动作。
- [x] old local 无 `CommandDialog`；现补齐并复用现有 `argus-dialog` primitives。

## Final Target API
- selectors:
  - `argusx-command`
  - `argusx-command-dialog`
  - `argusx-command-input`
  - `argusx-command-list`
  - `argusx-command-empty`
  - `argusx-command-group`
  - `argusx-command-item`
  - `argusx-command-shortcut`
  - `argusx-command-separator`
- inputs:
  - root: `value`(model search string), `disabled`, `filter`, `autoHighlight`, `loop`, `class`
  - dialog: `open`(model), `title`, `description`, `showCloseButton`, `class`
  - item: `value`, `disabled`, `keywords`, `class`
  - group/input/list/empty/shortcut/separator: `class` +场景参数
- outputs:
  - item: `select<T>`（主选择事件）
  - root/dialog models: `valueChange`, `openChange`
- data attributes:
  - root/list/group/item/shortcut/separator/empty/input/dialog 均对齐 `data-slot`
  - item: `data-selected`, `data-checked`, `data-disabled`, `data-value`
- accessibility contract:
  - input: `role="combobox"` + `aria-haspopup="listbox"`
  - list: `role="listbox"`
  - item: `role="option"` + `aria-selected` + `aria-disabled`
  - keyboard: Arrow/Home/End/Enter/Escape 行为闭环
- plain style defaults:
  - root 默认 `data-variant="plain"`
  - 视觉使用 token + menu-core primitives，避免强阴影/渐变/品牌色硬编码
