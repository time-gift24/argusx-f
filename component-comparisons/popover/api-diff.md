# popover API Diff

## API Matrix
| api | zardui | local (before rewrite) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Root naming | `[zPopover]` directive | `app-popover` component | `Popover` | `argusx-popover` root component | yes | adopt-shadcn | root 不承载品牌样式，仅容器语义 | Z1/L1/S1 |
| Trigger naming and contract | `zTrigger` 行为在 root 指令 | `[appPopoverTrigger]` | `PopoverTrigger` + `asChild` | `[argusxPopoverTrigger]`（元素即 child） | yes | adopt-shadcn | 保持触发元素本身样式，不包裹额外视觉层 | Z1/L1/S2/S8 |
| Content defaults | `zPlacement='bottom'` | root 上 `align/side/sideOffset` | `PopoverContent align='center' sideOffset=4` | content 上 `align='center' sideOffset=4`，`side='bottom'` | yes | adopt-shadcn | 默认 plain 内容样式中性化 | Z1/L2/S3 |
| Content style contract | cva baseline：`w-72 border shadow` + data-state/side 动画 | `bg-popover` + 可选 `glass` | `w-72 border shadow-md` + data-state/side 动画 | plain 与 shadcn 对齐，保留 data-state/side 动画 | yes | adopt-shadcn | plain 为默认，不做强装饰 | Z5/L3/S3 |
| Anchor support | `zOrigin` 输入自定义锚点 | `[appPopoverAnchor]` 仅标记，无定位语义 | `PopoverAnchor` primitive | `[argusxPopoverAnchor]` 接管 overlay origin | yes | adopt-shadcn | anchor 本身无额外视觉，仅定位语义 | Z1/L1/S4 |
| Header / Title / Description typography | demo 内部手写 | header `text-xs` / title `text-sm` | header `text-sm` / title `font-medium` / desc `text-muted-foreground` | 与 shadcn 对齐 | yes | adopt-shadcn | 文本层级收敛到 plain 信息密度 | L4/S5 |
| Open state API | `zVisible` + `zVisibleChange` | `open(model)` + 手动 `openChange` output | `Popover` root props（open/onOpenChange） | `[(open)]` 单一主路径（model） | yes | adopt-shadcn | 语义收敛，去除双轨输出 | Z2/L2/S1 |
| Extension: visual variant | 无 | `glass:boolean` | 无 | `variant='plain' | 'glass'` | no | extend-argusx | 默认 `plain`，`glass` 仅可选增强 | L3 |
| Extension: alignOffset | 无显式 API | 无 | shadcn wrapper 未显式默认，但 props 透传 | `alignOffset` 可选输入（默认 `0`） | no | extend-argusx | 默认 `0` 保持 plain 主路径 | Z4/S3 |
| Preview coverage | zardui 有 default/hover/placement/interactive | 本地仅单场景 | shadcn demo 是 dimensions 基线 | 补齐基线+冲突项+扩展项+复杂组合 | yes | adopt-shadcn + extend-argusx | baseline 先 plain，再叠加扩展 | U2/U3/U4/L5/S8 |

`S1`: `/tmp/shadcn-popover.tsx:8-12`  
`S2`: `/tmp/shadcn-popover.tsx:14-18`  
`S3`: `/tmp/shadcn-popover.tsx:20-35`  
`S4`: `/tmp/shadcn-popover.tsx:42-46`  
`S5`: `/tmp/shadcn-popover.tsx:48-79`  
`S8`: `/tmp/shadcn-popover-demo.tsx:12-17`

## Conflict Decisions (Must Adopt shadcn)
- [x] `selector family`: 从 `app-*`/`[appPopoverTrigger]` 收敛到 `argusx-popover` + `[argusxPopoverTrigger]`，保持 shadcn 组件族语义主路径。证据：L1, S1, S2。
- [x] `content defaults ownership`: `align/sideOffset` 从 root 迁移到 content，并锁定默认 `align='center'`、`sideOffset=4`。证据：L2, S3。
- [x] `anchor semantics`: 由“仅 data-slot 标记”改为真实 overlay anchor origin。证据：L1, S4。
- [x] `typography contract`: header/title/description 默认类改为 shadcn 对齐。证据：L4, S5。
- [x] `single state channel`: 删除手动 `openChange` 双轨，统一 `[(open)]`（model）作为唯一公开状态入口。证据：L2, Z2, S1。

## Non-conflict Extensions (ArgusX Plain)
- [x] `variant`: 定义 `variant='plain' | 'glass'`，默认 `plain`；`glass` 作为可选扩展，不改动 shadcn 主路径。证据：L3。
- [x] `alignOffset`: 新增 cross-axis 偏移输入，默认 `0`；不改变 shadcn 默认行为。证据：Z4, S3。

## Missing APIs
- [x] 已补齐 shadcn 组件族：`popover/trigger/content/anchor/header/title/description`。
- [x] 已补齐 anchor 实际定位能力（不仅是标记）。
- [x] 已补齐 preview 覆盖面（冲突项 + 扩展项 + 复杂组合）。

## Behavior Mismatches
- [x] 实现基座差异（Radix primitive vs Angular CDK overlay）保留为内部实现差异，但不影响对外 API 契约。证据：`/tmp/shadcn-popover.tsx:27-38`，`src/app/shared/ui/popover/popover.component.ts:208-219`。
- [x] shadcn 的 `asChild` 在 Angular 采用 attribute directive 形态等价实现（元素本体作为触发器）。证据：`/tmp/shadcn-popover-demo.tsx:13-15`，`src/app/shared/ui/popover/popover.component.ts:33-41`。

## Final Target API
- selectors:
  - `argusx-popover`
  - `[argusxPopoverTrigger]`
  - `[argusxPopoverAnchor]`
  - `argusx-popover-content`
  - `argusx-popover-header`
  - `argusx-popover-title`
  - `argusx-popover-description`
- inputs:
  - root: `[(open)]`
  - content: `align`, `side`, `sideOffset`, `alignOffset`, `variant`, `class`
- outputs:
  - `openChange` via `model` (`[(open)]`) only
- data attributes:
  - `data-slot`, `data-state`, `data-side`, `data-align`, `data-variant`
- accessibility contract:
  - trigger: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`
  - content: `role="dialog"`, `tabindex="-1"`, `Escape` closes
- plain style defaults:
  - `variant='plain'` 默认
  - 默认样式：token-based `bg-popover/text-popover-foreground/border/shadow-md`
  - 避免默认强阴影/渐变/品牌色硬编码
