# drawer API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Selector + naming | `z-sheet` | `app-drawer` | `Drawer` | `argusx-drawer` + `argusxDrawer*` | yes | adopt-shadcn | 单入口，不保留 `app*` 兼容层 | Z2/L1/S1, `src/app/shared/ui/drawer/drawer.component.ts:28` |
| Trigger / Close API | `zOnCancel` + service callbacks | `[appDrawerTrigger]` / `[appDrawerClose]` | `DrawerTrigger` / `DrawerClose` | `[argusxDrawerTrigger]` / `[argusxDrawerClose]` | yes | adopt-shadcn | slot 名与行为保持直观一致 | Z1/L1/S1, `src/app/shared/ui/drawer/drawer.component.ts:155` |
| Slot + data attribute contract | `data-slot="sheet-*"` | `data-slot="drawer-*"` + `data-direction` | `data-slot="drawer-*"` + `data-vaul-drawer-direction` | 对齐 shadcn slot + `data-vaul-drawer-direction` | yes | adopt-shadcn | 方向语义统一在 vaul 风格属性 | Z2/L1/S2, `src/app/shared/ui/drawer/drawer.component.ts:61` |
| Overlay visual baseline | `sheet` 为中性遮罩 | `bg-black/80` + blur | `bg-black/50` | `bg-black/50` | yes | adopt-shadcn | 默认态更 plain、低装饰 | L2/S2, `src/app/shared/ui/drawer/drawer.component.ts:95` |
| Content close button default | 可配置 `zClosable`（默认可关） | `showCloseButton=true` 默认显示 | 默认不自动渲染 close 按钮 | `showCloseButton=false` 默认关闭 | yes | adopt-shadcn | 主路径只依赖 `argusxDrawerClose` 显式关闭 | Z1/L3/S4, `src/app/shared/ui/drawer/drawer.component.ts:315` |
| Controlled open behavior | service 控制 | `[(open)]` + `openChange` | `open/onOpenChange` | `[open]` + `(openChange)` + `argusxDrawerTrigger` | no | adopt-shadcn | 保留 Angular 双向绑定语义 | Z1/L1/S5, `src/app/shared/ui/drawer/drawer.component.ts:77` |
| Direction API | `zSide` (`top/right/bottom/left`) | `direction` | `direction` (vaul root props) | `direction: top/right/bottom/left` | no | adopt-shadcn | 默认 `bottom`，与 shadcn 一致 | Z1/L1/S2, `src/app/shared/ui/drawer/drawer.component.ts:79` |
| Size API | `zSize` (`default/sm/lg`) | `size` (`default/sm/lg/xl/full`) | none | `size` (`default/sm/lg/full`) | no | extend-argusx | 作为 plain 扩展保留，删除 `xl` | Z1/Z3/L3, `src/app/shared/ui/drawer/drawer.component.ts:80` |
| `shouldScaleBackground` | none | input 存在但未生效 | drawer root prop 存在 | 保留 input（当前仅 API 对齐） | yes | adopt-shadcn | 保持 API 对齐，不引入重视觉效果 | L1/S1, `src/app/shared/ui/drawer/drawer.component.ts:83` |

## Conflict Decisions (Must Adopt shadcn)
- [x] 命名冲突统一：`app-*` / `appDrawer*` 全部替换为 `argusx-*` / `argusxDrawer*`，不保留兼容 alias（S1/L1）。
- [x] data attributes 对齐：使用 `data-vaul-drawer-direction`，移除旧 `data-direction` 主路径（S2/L1）。
- [x] 默认 close 按钮行为对齐：`showCloseButton` 改为默认 `false`，关闭动作以 `argusxDrawerClose` 为主（S4/L3）。
- [x] overlay 样式对齐：默认遮罩改为 `bg-black/50`，移除 blur 依赖（S2/L2）。

## Non-conflict Extensions (ArgusX Plain)
- [x] `size` 扩展：保留 `default/sm/lg/full` 以复用 zardui sheet 的 side-size 经验；不改变 shadcn 默认路径（Z3/U2/U3）。
- [x] `showCloseButton` 扩展：作为可选增强，默认关闭，确保不干扰 shadcn 主路径（S4/L3）。

## Missing APIs
- [x] 缺失 vaul 原生拖拽/物理手势细节；当前实现维持键盘 + backdrop + 指令关闭主流程（S1/S4）。

## Behavior Mismatches
- [x] `shouldScaleBackground` 当前为 API 保留项，未实现页面级缩放视觉；不影响 drawer 交互闭环（S1, `src/app/shared/ui/drawer/drawer.component.ts:83`）。

## Final Target API
- selectors:
  - `argusx-drawer`
  - `argusx-drawer-content`
  - `argusx-drawer-header`
  - `argusx-drawer-footer`
  - `argusx-drawer-title`
  - `argusx-drawer-description`
  - `[argusxDrawerTrigger]`
  - `[argusxDrawerClose]`
- inputs:
  - root: `open`, `direction`, `dismissible`, `shouldScaleBackground`, `size`, `class`
  - content: `showCloseButton`, `class`
- outputs:
  - `openChange`
- data attributes:
  - root/content/trigger/close/header/footer/title/description 全量 `data-slot`
  - `data-state`
  - `data-vaul-drawer-direction`
  - `data-size`（ArgusX extension）
- accessibility contract:
  - root 容器 `role="dialog"` + `aria-modal="true"`
  - 自动关联 `aria-labelledby` / `aria-describedby`
  - trigger 暴露 `aria-haspopup/aria-expanded`
  - Escape/backdrop 在 `dismissible=true` 时关闭
- plain style defaults:
  - 默认遮罩 `bg-black/50`
  - 默认不显示额外 close icon
  - 默认 `direction="bottom"` + `size="default"`，使用中性 token 样式
