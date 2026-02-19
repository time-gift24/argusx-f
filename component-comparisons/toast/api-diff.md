# toast API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | z-toast, z-toaster | app-toast-item, app-toast-container, app-toaster | sonner Toaster | argusx-toast-item, argusx-toast-container, argusx-toaster | yes | migrate to argusx | prefix change | Z1/L1 |
| variant | default/destructive | success/error/warning/info/loading | default/destructive | plain (as default) + success/error/warning/info/loading | no | extend-argusx | plain as default | L1 |
| position | top-left/center/right, bottom-left/center/right | top-left/center/right, bottom-left/center/right | - | same as local | no | keep local | position stays | Z1/L1 |
| theme | light/dark/system | - | light/dark/system | plain (light only, no dark) | no | extend-argusx | no theme switch | Z1/S1 |
| duration | 4000 | 5000 | - | 5000 | no | keep local | default duration | Z1/L1 |
| closeButton | boolean | dismissible | - | dismissible | no | keep local | close behavior | L1 |
| expand | boolean | - | - | - | no | no conflict | N/A | Z1 |
| richColors | boolean | - | - | - | no | no conflict | N/A | Z1 |
| visibleToasts | number | - | - | - | no | no conflict | N/A | Z1 |

## Conflict Decisions (Must Adopt shadcn)
- [x] selector prefix: 必须迁移到 argusx- 前缀，采用 argusx-toast-item, argusx-toast-container, argusx-toaster

## Non-conflict Extensions (ArgusX Plain)
- [x] toast type: 保留 success/error/warning/info/loading，添加 plain variant 作为默认
- [x] service methods: 保留 success/error/warning/info/loading 快捷方法
- [x] action button: 保留 action 配置

## Missing APIs
- none - local 实现已经完整

## Behavior Mismatches
- none - 主要行为一致

## Final Target API
- selectors: argusx-toast-item, argusx-toast-container, argusx-toaster
- inputs:
  - ToastItemComponent: toast (required), position (required)
  - ToastContainerComponent: none
  - ToasterComponent: none (uses service)
- outputs: none
- data attributes: data-state, data-position, data-type, data-slot
- accessibility contract: role="alert", aria-live="polite", aria-atomic="true"
- plain style defaults: variant=plain, minimal shadows, no gradients
