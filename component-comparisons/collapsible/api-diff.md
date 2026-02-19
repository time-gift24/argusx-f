# collapsible API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Root selector / primitive name | 无直接 `collapsible` 组件；最近似是 `z-accordion` | `app-collapsible` | `Collapsible` | `argusx-collapsible` | yes | adopt-shadcn | 仅保留单一 root 语义，默认 plain | Z1,S1,L1 |
| Controlled state (`open`, `onOpenChange`) | accordion 通过内部 toggleItem 管理 | `open` + `onOpenChange` 已存在 | demo 使用 `open` + `onOpenChange` | 保留 `open`(model) + `onOpenChange`(output) | no | adopt-shadcn | plain 不改变状态语义 | S2,L1 |
| Initial state (`defaultOpen`) | `zDefaultValue`（accordion 语义） | `defaultOpen` 已存在 | Radix Root 支持默认态 | 保留 `defaultOpen`，仅初始生效 | no | adopt-shadcn | plain 默认 closed（除非 defaultOpen=true） | U1,S2,L1 |
| Trigger composition (`asChild`) | 无 `asChild`，按钮写死在 item 模板 | Trigger 是元素组件，无 asChild | `CollapsibleTrigger asChild` | `[argusxCollapsibleTrigger]` 指令 + `asChild` boolean | yes | adopt-shadcn | plain 默认不加装饰，由宿主元素控制视觉 | S2,L2 |
| Trigger accessibility | `aria-controls/expanded` + click | 当前支持 click/Enter/Space | primitive 自带 a11y | 指令写入 `aria-controls/expanded`、disabled、防止无障碍回退 | no | adopt-shadcn | plain 不引入额外视觉噪声 | Z2,S1,L2 |
| Content state attributes | `data-state` + `role=region` | 有 `data-state`/`role=region` | `CollapsibleContent data-slot="collapsible-content"` | `argusx-collapsible-content` 保留 `data-slot/state` + `aria-labelledby` | no | adopt-shadcn | 使用轻量过渡（grid rows） | Z2,Z3,S1,L3 |
| Visual extension API | 无单组件 counterpart | 无扩展 API | shadcn 未定义 variant | `argusxVariant: 'plain'｜'muted'`（默认 `plain`） | no | extend-argusx | `plain` 0装饰；`muted` 仅轻背景/边框 | Z3,L3 |
| Data attributes for extension | 无 | 无 `data-variant` | 无 | Root 增加 `data-variant`（扩展轨道） | no | extend-argusx | 默认 `data-variant="plain"` | Z3 |

## Conflict Decisions (Must Adopt shadcn)
- [x] Trigger 组合模式：本地元素组件与 shadcn `asChild` 语义冲突；采用 shadcn 语义，改为可附着在任意宿主元素的触发器指令并提供 `asChild` 输入（S2, L2）。
- [x] 对外命名主入口：去掉 `app-collapsible*` 主入口，统一 `argusx-collapsible*` 家族（S1, L1）。

## Non-conflict Extensions (ArgusX Plain)
- [x] `argusxVariant`（`plain | muted`）: shadcn 未定义 variant，作为 ArgusX 扩展，仅影响容器视觉，不改变 open/close 行为；默认 `plain`（S1, Z3）。

## Missing APIs
- [x] `asChild` 触发器能力缺失：影响与按钮/链接等宿主的无包装组合（S2, L2）。
- [x] 本地 selector 与 preview 使用形态不一致：导致 API 演示与实现契约分离（L2）。

## Behavior Mismatches
- [x] Trigger 声明为元素组件，但 preview 以 attribute 使用，行为与模板契约不一致；目标改为 attribute-first 触发器（L2）。
- [x] Content 动画为 `max-height`，目标改为 zardui 同类 plain 方案 `grid-template-rows` 过渡，减少计算型高度依赖（Z3, L3）。

## Final Target API
- selectors:
  - `argusx-collapsible`
  - `[argusxCollapsibleTrigger]`
  - `argusx-collapsible-content`
- inputs:
  - root: `open` (model), `defaultOpen`, `disabled`, `argusxVariant`, `class`
  - trigger: `asChild`, `disabled`
  - content: `class`
- outputs:
  - root: `openChange` (model), `onOpenChange`
- data attributes:
  - root: `data-slot="collapsible"`, `data-state`, `data-disabled`, `data-variant`
  - trigger: `data-slot="collapsible-trigger"`, `data-state`, `data-disabled`
  - content: `data-slot="collapsible-content"`, `data-state`
- accessibility contract:
  - trigger: `aria-expanded`, `aria-controls`, disabled 时禁交互
  - content: `role="region"`, `aria-labelledby`
- plain style defaults:
  - 默认 `argusxVariant="plain"`
  - 不使用重阴影/渐变/高噪声动画
  - 动画基于轻量 grid rows 过渡
