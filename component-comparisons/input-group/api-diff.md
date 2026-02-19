# input-group API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | `z-input-group` | `app-input-group` | `InputGroup` | `argusx-input-group` | yes (命名) | adopt-shadcn | N/A | L1/S1 |
| addon.align | `zAddonAlign` | `align` | `align` | `align` | no | extend-argusx | 默认 inline-start | Z1/S2 |
| size | `zSize` | N/A | N/A | `size` | no | extend-argusx | 默认 default | Z1 |
| disabled | `zDisabled` | N/A | N/A | `disabled` | no | extend-argusx | 默认 false | Z1 |
| loading | `zLoading` | N/A | N/A | `loading` | no | extend-argusx | 默认 false | Z1 |

## Conflict Decisions (Must Adopt shadcn)
- [x] selector: `app-input-group` -> `argusx-input-group` (命名冲突，采用 shadcn 风格)
- [x] 所有子组件 selector 迁移: `app-input-group-*` -> `argusx-input-group-*`

## Non-conflict Extensions (ArgusX Plain)
- [x] API name: `size` - 支持尺寸变体，默认 plain 风格
- [x] API name: `disabled` - 支持禁用状态
- [x] API name: `loading` - 支持加载状态

## Missing APIs
- [ ] zardui 的 `addonBefore`/`addonAfter` 支持 TemplateRef，当前本地使用 ng-content 方式，可保持现状

## Behavior Mismatches
- [ ] zardui 通过 effect 同步 size/disabled 到内部 input，本地需要保持一致

## Final Target API
- selectors:
  - `argusx-input-group`
  - `argusx-input-group-addon`
  - `argusx-input-group-button`
  - `argusx-input-group-text`
  - `argusx-input-group-input`
  - `argusx-input-group-textarea`
- inputs:
  - InputGroupComponent: `class`, `disabled`, `loading`, `size`
  - InputGroupAddonComponent: `align`, `class`
  - InputGroupInputComponent: `type`, `placeholder`, `disabled`, `readonly`, `required`, `value`, `ariaInvalid`, `ariaDescribedby`, `class`
- outputs: N/A
- data attributes: `data-slot`, `data-align`, `data-size`
- accessibility contract: `role="group"`, `aria-disabled`
- plain style defaults: variant 默认 plain，无强阴影/渐变
