# native-select API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector (wrapper) | N/A | `div[appNativeSelectWrapper]` | `NativeSelect` | `div[appNativeSelectWrapper]` | no | keep-local | 使用 directive 是 Angular 常见模式 | L1 |
| selector (select) | N/A | `select[appNativeSelect]` | `NativeSelect` | `select[appNativeSelect]` | no | keep-local | 指令方式语义一致 | L2 |
| selector (option) | N/A | `option[appNativeSelectOption]` | `NativeSelectOption` | `option[appNativeSelectOption]` | no | keep-local | 指令方式语义一致 | L3 |
| selector (optgroup) | N/A | `optgroup[appNativeSelectOptGroup]` | `NativeSelectOptGroup` | `optgroup[appNativeSelectOptGroup]` | no | keep-local | 指令方式语义一致 | L4 |
| selector (icon) | N/A | `lucide-icon[appNativeSelectIcon]` | N/A | `lucide-icon[appNativeSelectIcon]` | no | extend-argusx | 图标是可选的扩展 | L5 |
| size input | N/A | `size: 'sm' \| 'default'` | N/A | `size: 'sm' \| 'default'` | no | extend-argusx | 尺寸变体 | L1,L2 |
| disabled | N/A | 原生支持 | `disabled` | 原生支持 | no | adopt-native | HTML 原生属性 | S1 |
| aria-invalid | N/A | 原生支持 | `aria-invalid` | 原生支持 | no | adopt-native | HTML 原生属性 | S3 |

## Conflict Decisions (Must Adopt shadcn)
无冲突项。本地实现使用指令方式但 API 语义与 shadcn 一致。

## Non-conflict Extensions (ArgusX Plain)
- size 变体 (`sm`, `default`): 保持现有实现，默认 plain 样式
- icon 扩展: 保持现有实现，图标为可选

## Missing APIs
无缺失 API。本地实现已覆盖 shadcn 所有功能。

## Behavior Mismatches
无行为不匹配。

## Final Target API
- selectors:
  - `div[appNativeSelectWrapper]` - 包装器
  - `select[appNativeSelect]` - 选择元素
  - `option[appNativeSelectOption]` - 选项元素
  - `optgroup[appNativeSelectOptGroup]` - 选项组
  - `lucide-icon[appNativeSelectIcon]` - 下拉图标
- inputs:
  - `size: 'sm' | 'default'` - 尺寸变体
  - `class: string` - 自定义类名
- data attributes:
  - `data-slot="native-select-wrapper"`
  - `data-slot="native-select"`
  - `data-slot="native-select-option"`
  - `data-slot="native-select-optgroup"`
  - `data-slot="native-select-icon"`
  - `data-size="sm" | "default"`
- accessibility contract:
  - 使用原生 HTML 语义
  - 支持 `aria-invalid`
  - 图标设置 `aria-hidden="true"`
- plain style defaults:
  - 默认使用 plain 变体样式
  - 无装饰性阴影或渐变
