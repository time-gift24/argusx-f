# Sheet 三方对比报告

## 来源
- zardui: `component-comparisons/sheet/sources/zardui/README.md`
- shadcn: `component-comparisons/sheet/sources/shadcn/README.md`
- local: `component-comparisons/sheet/sources/local/README.md`

## 功能矩阵
| 特性 | zardui | shadcn | local(修复前) | local(修复后) | 最优参考 |
|------|--------|--------|---------------|---------------|----------|
| `data-state` 动画类可生效 | ✓ | ✓ | ✗ (无效类组合) | ✓ | shadcn |
| side 滑入/滑出语义 | ✓ | ✓ | 部分 | ✓ | shadcn |
| 触发器 `aria-expanded` | ✓ | ✓ | ✗ | ✓ | shadcn |
| Overlay + Escape + Backdrop 关闭 | ✓ | ✓ | ✓ | ✓ | local |
| 标题/描述可访问性链路 | ✓ | ✓ | ✓ | ✓ | local |

## 样式差异
- shadcn 的 sheet 动画依赖 `data-[state=open|closed]`，语义明确。
- zardui 更偏服务驱动弹层。
- local 修复后保留现有结构，动画选择器从“无效组合”改为可触发的 state 类。

## 行为对比
- 修复前 local 使用 `data-[side=top]:data-closed:*` 这种组合，Tailwind 变体不会按预期生效。
- 修复后统一改为 `data-[state=closed|open]:slide-*`，并在各 side 上匹配 shadcn 方向语义。
- 同时补齐 trigger 的 `aria-expanded`。

## 性能评估
- 仅类名/语义修正，不新增额外 watcher。
- 动画路径更稳定，减少“状态变化无动画”的回归风险。

## 加权评分（Overlay-heavy，Behavior ×1.5）
- zardui: 8.9
- shadcn: 9.3
- local 修复前: 6.7
- local 修复后: 8.8

## 已落地修复
- `src/app/shared/ui/sheet/sheet.component.ts`
  - 重写 `contentWrapperClass` 的 side/state 动画组合。
  - 调整为 `data-[state=*]` 驱动，修复滑动动画不生效。
  - `SheetTrigger` 增加 `aria-expanded`。

## 推荐实现
- 继续沿用 shadcn 的状态语义与方向类策略。
- local 现已达到“行为正确 + 语义一致”的可维护状态。
