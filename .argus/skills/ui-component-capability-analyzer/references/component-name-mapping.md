# 组件命名映射参考

当三方组件命名不一致时，先用本表做初始映射，再根据源码职责校正。

| local (`src/app/shared/ui`) | shadcn item | zardui 组件目录/源码目录 |
|----------------------------|-------------|--------------------------|
| `dropdown-menu` | `dropdown-menu` | `dropdown` |
| `separator` | `separator` | `divider` |
| `progress` | `progress` | `progress-bar` |
| `radio-group` | `radio-group` | `radio` |
| `spinner` | `spinner`（若存在） | `loader` |
| `dialog` | `dialog` | `dialog` |
| `alert-dialog` | `alert-dialog` | `alert-dialog` |

映射校正规则：
1. 优先比较 API 语义而不是名字。
2. 若一个 zardui 组件同时覆盖多个 local 组件能力，按“核心交互职责”选择主映射，并在报告备注中解释。
3. 若确实没有可比组件，保留 `N/A`，不要强行映射。

