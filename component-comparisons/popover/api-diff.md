# popover API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Root selector | N/A | `app-popover` | N/A | `argusx-popover` | yes | extend-argusx | N/A | L1/S1 |
| Trigger selector | N/A | `[appPopoverTrigger]` | N/A | `[argusxPopoverTrigger]` | yes | extend-argusx | N/A | L2 |
| Anchor selector | N/A | `[appPopoverAnchor]` | N/A | `[argusxPopoverAnchor]` | yes | extend-argusx | N/A | L3 |
| Content selector | N/A | `app-popover-content` | N/A | `argusx-popover-content` | yes | extend-argusx | N/A | L4 |
| Header selector | N/A | `app-popover-header` | N/A | `argusx-popover-header` | yes | extend-argusx | N/A | L5 |
| Title selector | N/A | `app-popover-title` | N/A | `argusx-popover-title` | yes | extend-argusx | N/A | L6 |
| Description selector | N/A | `app-popover-description` | N/A | `argusx-popover-description` | yes | extend-argusx | N/A | L7 |
| open (model) | N/A | `open` | N/A (controlled via Radix) | `open` (model) | no | extend-argusx | N/A | L1 |
| align | N/A | `align` (start/center/end) | `align` (center default) | `align` (center default) | no | adopt-shadcn | N/A | L1/S3 |
| sideOffset | N/A | `sideOffset` (default 4) | `sideOffset` (default 4) | `sideOffset` (default 4) | no | adopt-shadcn | N/A | L1/S3 |
| side | N/A | `side` (top/right/bottom/left) | N/A (handled by Radix) | `side` (top/right/bottom/left) | no | extend-argusx | N/A | L1 |
| class (content) | N/A | `class` | `className` | `class` | yes | adopt-shadcn | 使用 class 符合 Angular 风格 | L4/S3 |
| glass variant | N/A | `glass: boolean` | N/A | `variant: 'plain' | 'glass'` | no | extend-argusx | glass 作为 ArgusX 扩展变体 | L4 |

## Conflict Decisions (Must Adopt shadcn)
- [x] PopoverContent 的标题应使用 div 而非 h2：shadcn 使用 div，保持语义中性

## Non-conflict Extensions (ArgusX Plain)
- [x] selector 命名：添加 argusx 前缀以符合项目规范
- [x] glass 变体：作为 ArgusX 扩展，保持 plain 风格的对比变体
- [x] CDK Overlay 实现：保留底层实现（无 zardui 可复用）

## Missing APIs
- [x] PopoverAnchor 功能：shadcn 有 Anchor，保留

## Behavior Mismatches
- [x] PopoverTrigger 行为：shadcn 使用 asChild（类似 ngProjectAs），本地使用 directive - 保持 directive 实现更 Angular 风格

## Final Target API
- selectors:
  - `argusx-popover` (root)
  - `[argusxPopoverTrigger]` (trigger)
  - `[argusxPopoverAnchor]` (anchor)
  - `argusx-popover-content` (content)
  - `argusx-popover-header` (header)
  - `argusx-popover-title` (title)
  - `argusx-popover-description` (description)
- inputs:
  - `open`: model<boolean> (two-way binding)
  - `align`: 'start' | 'center' | 'end' (default: 'center')
  - `side`: 'top' | 'right' | 'bottom' | 'left' (default: 'bottom')
  - `sideOffset`: number (default: 4)
  - `class`: string (content class)
  - `variant`: 'plain' | 'glass' (default: 'plain')
- outputs:
  - `openChange`: output<boolean>
- data attributes:
  - data-slot="popover"
  - data-slot="popover-trigger"
  - data-slot="popover-anchor"
  - data-slot="popover-content"
  - data-slot="popover-header"
  - data-slot="popover-title"
  - data-slot="popover-description"
  - data-state="open" | "closed"
  - data-side
- accessibility contract:
  - aria-expanded
  - aria-haspopup="dialog"
  - aria-controls
- plain style defaults:
  - variant: 'plain' (默认无装饰，中性)
  - glass 变体保持低对比度设计
