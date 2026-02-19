# sheet API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | z-sheet | app-sheet | - | argusx-sheet | - | argusx naming | 迁移到 argusx- 前缀 | L1 |
| side | zSide: left/right/top/bottom | side: top/right/bottom/left | side | side: top/right/bottom/left | no | extend-argusx | 默认 right，符合直觉 | Z2/L1 |
| size | zSize: default/sm/lg/custom | size: default/sm/lg/xl/full | size | size: default/sm/lg/xl/full | no | extend-argusx | 默认 default，符合 plain 风格 | Z2/L1 |
| open | model() | model<boolean> | open | open | no | align | 使用 model() 实现双向绑定 | L1 |
| closeOnBackdropClick | zMaskClosable: true | closeOnBackdropClick: true | - | closeOnBackdropClick | no | extend-argusx | 默认 true | L1 |
| closeOnEscape | - | closeOnEscape: true | - | closeOnEscape | no | extend-argusx | 默认 true，符合 a11y | L1 |
| trigger directive | - | appSheetTrigger | - | argusxSheetTrigger | - | argusx naming | 迁移到 argusx- 前缀 | L1 |
| close directive | - | appSheetClose | - | argusxSheetClose | - | argusx naming | 迁移到 argusx- 前缀 | L1 |

## Conflict Decisions (Must Adopt shadcn)
- N/A - shadcn MCP 不可用，基于本地实现和 zardui 进行对比，无明显冲突

## Non-conflict Extensions (ArgusX Plain)
- size 扩展: zardui 只有 default/sm/lg，本地实现增加了 xl/full，符合更大屏幕需求
- closeOnEscape: 新增 API，符合键盘可访问性要求
- closeOnBackdropClick: 保留并默认开启

## Missing APIs
- SheetService: zardui 提供了通过服务打开 sheet 的方式，目前本地实现仅支持模板方式

## Behavior Mismatches
- N/A

## Final Target API
- selectors:
  - argusx-sheet (root)
  - argusx-sheet-content
  - argusx-sheet-header
  - argusx-sheet-footer
  - argusx-sheet-title
  - argusx-sheet-description
  - argusx-sheet-overlay
  - argusx-sheet-portal
  - [argusxSheetTrigger]
  - [argusxSheetClose]
- inputs:
  - side: SheetSide (default: 'right')
  - size: SheetSize (default: 'default')
  - open: model<boolean>
  - class: string
  - closeOnBackdropClick: boolean (default: true)
  - closeOnEscape: boolean (default: true)
- outputs:
  - openChange: OutputEmitterRef<boolean>
- data attributes:
  - data-slot: sheet, sheet-trigger, sheet-close, etc.
  - data-side: top/right/bottom/left
  - data-state: open/closed
- accessibility contract:
  - role="dialog"
  - aria-modal="true"
  - aria-labelledby (via title)
  - aria-describedby (via description)
  - focus trap
  - escape key closes
- plain style defaults:
  - side 默认 right
  - size 默认 default
  - 无强阴影、渐变、玻璃化
