# input API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Selector | `input[z-input], textarea[z-input]` | `input[appInput]` | `<Input />` (input-only) | `input[argusxInput]` | yes | adopt-shadcn | default 路径只保留 input | Z1/L1/S1, `src/app/shared/ui/input/input.directive.ts:14` |
| Wrapper component | none | `<app-input>` | none | removed | yes | adopt-shadcn | 避免双入口 API | L3/S1 |
| Size/Status/Borderless API | `zSize/zStatus/zBorderless` | `size/status/borderless` | none | removed | yes | adopt-shadcn | 通过 class 扩展而非组件 API | Z3/U1/L1/S1 |
| Native input props | supported by directive | partial + host overrides | full `ComponentProps<"input">` | native attrs as canonical API | yes | adopt-shadcn | `type/disabled/placeholder/...` 全部走原生 | U1/L2/S1 |
| `data-slot` | helper method (`setDataSlot`) | host `data-slot="input"` | `data-slot="input"` | host `data-slot="input"` | no | adopt-shadcn | 保持一致 | Z1/L2/S2, `src/app/shared/ui/input/input.directive.ts:25` |
| Forms integration | CVA in directive | CVA in wrapper component | n/a (React controlled/uncontrolled) | CVA in directive | no | extend-argusx | Angular 生态必需扩展 | Z2/L3, `src/app/shared/ui/input/input.directive.ts:16-62` |
| Textarea support | same directive supports textarea | separate textarea component exists | input component does not include textarea | keep separate textarea component | yes | adopt-shadcn | input 与 textarea 组件边界清晰 | Z1/U4/S1, `src/app/shared/ui/textarea/textarea.component.ts` |

## Conflict Decisions (Must Adopt shadcn)
- [x] selector + public API 入口统一为 `input[argusxInput]`，移除 `appInput` 与 `<app-input>`（证据：S1/L1/L3）。
- [x] 删除 `status/size/borderless` public API，避免与 shadcn input 语义冲突（证据：S1/U1/L1）。
- [x] preview 重构为 shadcn 典型示例（default/disabled/with-label/file）并补复杂组合（证据：S3，`src/app/preview/input-preview.component.ts:15-100`）。

## Non-conflict Extensions (ArgusX Plain)
- [x] 保留 directive 级 CVA（`writeValue/registerOnChange/registerOnTouched/setDisabledState`），用于 Reactive Forms（证据：Z2，`src/app/shared/ui/input/input.directive.ts:16-62`）。

## Missing APIs
- [x] 无（strict shadcn-first 下目标 API 已覆盖）。

## Behavior Mismatches
- [x] 历史 mismatch：旧本地支持 wrapper + custom variants，目标行为已统一回 shadcn input 语义（证据：L1/L3/S1）。

## Final Target API
- selectors: `input[argusxInput]`
- inputs:
  - `class`（用于合并额外 class）
  - 其余通过原生 `<input>` 属性表达
- outputs: none
- data attributes:
  - `data-slot="input"`
- accessibility contract:
  - 原生 input 语义优先
  - 通过 `aria-invalid` 触发错误视觉类
- plain style defaults:
  - 默认即普通输入框样式（无 size/status 等扩展状态机）
