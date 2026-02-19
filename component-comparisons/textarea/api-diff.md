# textarea API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Public entry | `textarea[z-input]`（来自 `input` directive） | `<app-textarea>` | `<Textarea {...props} />` | `textarea[argusxTextarea]` | yes | adopt-shadcn | 回归原生 textarea 语义入口 | Z1/L1/S1, `src/app/shared/ui/textarea/textarea.directive.ts:47` |
| Value API | CVA + `value` model | `[(value)]` model + wrapper API | 原生 `value/defaultValue/onChange` | 原生 `[value]`/`(input)` + CVA（Angular 扩展） | yes | adopt-shadcn + extend-argusx | 外部 API 走原生；Forms 通过 CVA 补齐 | Z2/L1/S1, `src/app/shared/ui/textarea/textarea.directive.ts:87` |
| Visual baseline | `zType='textarea'` class | 本地 `baseClasses` | shadcn textarea class baseline | 直接对齐 shadcn baseline class | yes | adopt-shadcn | 默认为 plain 中性风格 | Z3/L2/S1, `src/app/shared/ui/textarea/textarea.directive.ts:6` |
| `data-slot` | helper 可设置 dataset | 固定 `data-slot="textarea"` | 固定 `data-slot="textarea"` | host 固定 `data-slot="textarea"` | no | adopt-shadcn | 与 shadcn 一致 | Z2/L1/S1, `src/app/shared/ui/textarea/textarea.directive.ts:58` |
| Status API | `zStatus` | `status` | none | `argusxStatus` (`default/error/warning/success`) | no | extend-argusx | 保持 plain 默认，仅增量状态能力 | Z2/Z3/U1/L1, `src/app/shared/ui/textarea/textarea.directive.ts:73` |
| Size API | `zSize` | none | none | `argusxSize` (`default/sm/lg`) | no | extend-argusx | 默认仍为 shadcn plain 尺寸 | Z2/Z3/U1, `src/app/shared/ui/textarea/textarea.directive.ts:72` |
| Borderless API | `zBorderless` | none | none | `argusxVariant='borderless'`（default=`plain`） | no | extend-argusx | `plain` 为默认，`borderless` 为可选扩展 | Z2/Z3/U2, `src/app/shared/ui/textarea/textarea.directive.ts:71` |
| Preview coverage | 仅 demo 片段 | `Default/Statuses` | `Basic/Invalid/With Label/With Description/Disabled` | parity + ArgusX extension + complex scenario | yes | adopt-shadcn + extend-argusx | 先对齐官方，再展示扩展 | L3/S2/S3/S4, `src/app/preview/textarea-preview.component.ts:17` |

## Conflict Decisions (Must Adopt shadcn)
- [x] 删除 `<app-textarea>` 包装组件入口，统一为原生 `textarea` 承载 API（证据：L1/S1）。
- [x] 对齐 shadcn `textarea` 默认类、`data-slot="textarea"`、`aria-invalid` 视觉契约（证据：S1，`src/app/shared/ui/textarea/textarea.directive.ts:6-61`）。
- [x] preview 从 `Default/Statuses` 改为 shadcn `textarea-example` 同步分组（证据：L3/S4，`src/app/preview/textarea-preview.component.ts:17-90`）。

## Non-conflict Extensions (ArgusX Plain)
- [x] `argusxStatus`：复用 zardui/local 成熟状态语义，扩展为 `default/error/warning/success`，默认 `default`（证据：Z2/Z3/U1）。
- [x] `argusxSize`：复用 zardui 尺寸分层，提供 `default/sm/lg`，默认 `default`（证据：Z2/Z3/U1）。
- [x] `argusxVariant`：将 zardui `zBorderless` 收敛到 `argusxVariant='borderless'`，并规定默认 `plain`（证据：Z3/U2，`src/app/shared/ui/textarea/textarea.directive.ts:10-34`）。
- [x] 保留 CVA：作为 Angular 生态必需扩展，不改变 shadcn 主 API 路径（证据：Z2，`src/app/shared/ui/textarea/textarea.directive.ts:96-110`）。

## Missing APIs
- [x] 已补齐 shadcn `textarea-example` 的 `Invalid/With Label/With Description/Disabled` 组合（证据：S2/S3/S4，`src/app/preview/textarea-preview.component.ts:27-90`）。

## Behavior Mismatches
- [x] 历史 mismatch：旧组件以 `[(value)]` 包装模型作为主入口；目标行为改为原生 textarea 事件/属性为主，CVA 仅作为 Angular 扩展层（证据：L1/S1，`src/app/shared/ui/textarea/textarea.directive.ts:87-110`）。

## Final Target API
- selectors:
  - `textarea[argusxTextarea]`
- inputs:
  - `argusxVariant?: 'plain' | 'borderless'`（default: `plain`）
  - `argusxSize?: 'default' | 'sm' | 'lg'`（default: `default`）
  - `argusxStatus?: 'default' | 'error' | 'warning' | 'success'`（default: `default`）
  - `class`（class 合并）
  - 其余原生 textarea 属性（`placeholder/rows/cols/disabled/readonly/aria-*` 等）
- outputs:
  - none（使用原生 `(input)`；Reactive Forms 通过 CVA）
- data attributes:
  - `data-slot="textarea"`
  - `data-variant`
  - `data-size`
  - `data-status`（仅非 `default` 输出）
- accessibility contract:
  - 原生 textarea 可访问性语义优先
  - `aria-invalid` 触发 destructive 视觉反馈
  - `blur` 时触发 `registerOnTouched`
- plain style defaults:
  - `argusxVariant='plain'`
  - 默认不使用重装饰效果，基于 token 中性样式
