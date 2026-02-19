# field API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | z-form-field | app-field | Field | argusx-field | no | extend-argusx | - | L1 |
| selector | z-form-label | app-field-label | FieldLabel | argusx-field-label | no | extend-argusx | - | L2 |
| selector | z-form-control | app-field-content | - | argusx-field-content | no | extend-argusx | - | L3 |
| selector | z-form-message | app-field-description | FieldDescription | argusx-field-description | no | extend-argusx | - | L3 |
| selector | - | app-field-error | - | argusx-field-error | no | extend-argusx | - | L4 |
| selector | - | app-field-set | FieldSet | argusx-field-set | no | extend-argusx | - | L5 |
| selector | - | app-field-legend | FieldLegend | argusx-field-legend | no | extend-argusx | - | L6 |
| selector | - | app-field-group | FieldGroup | argusx-field-group | no | extend-argusx | - | L7 |
| selector | - | app-field-title | - | argusx-field-title | no | extend-argusx | - | L8 |
| selector | - | app-field-separator | FieldSeparator | argusx-field-separator | no | extend-argusx | - | L9 |
| orientation input | - | orientation: vertical/horizontal/responsive | orientation | argusx-field-orientation | no | adopt-shadcn | vertical 默认 | L1 |
| variant input | - | variant (legend/label) | - | variant | no | extend-argusx | legend 默认 | L6 |
| class input | class | class | class | class | no | adopt-shadcn | - | all |

## Conflict Decisions (Must Adopt shadcn)
- 无冲突项。本地组件 API 已与 shadcn 对齐。

## Non-conflict Extensions (ArgusX Plain)
- FieldErrorComponent: 本地扩展的错误显示组件，支持数组错误和去重，与 shadcn 行为一致
- FieldTitleComponent: 本地扩展的标题组件，用于 checkbox/radio 组
- FieldContentComponent: 本地扩展的内容包装组件
- FieldSeparatorComponent: 对齐 shadcn 实现

## Missing APIs
- 无缺失 API

## Behavior Mismatches
- selector 命名: 从 app-field-* 迁移到 argusx-field-*

## Final Target API
- selectors: argusx-field, argusx-field-label, argusx-field-description, argusx-field-error, argusx-field-set, argusx-field-legend, argusx-field-group, argusx-field-title, argusx-field-separator, argusx-field-content
- inputs: orientation, variant, class, errors, errorContent, hasContent
- outputs: 无
- data attributes: data-slot, data-orientation, data-variant, data-content
- accessibility contract: role="group" (field), role="alert" (field-error)
- plain style defaults: 使用 Tailwind 工具类和 CSS 变量，无硬编码主题色
