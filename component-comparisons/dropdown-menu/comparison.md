# Dropdown Menu 三方对比报告

## 来源
- zardui: `component-comparisons/dropdown-menu/sources/zardui/README.md`
- shadcn: `component-comparisons/dropdown-menu/sources/shadcn/README.md`
- local: `component-comparisons/dropdown-menu/sources/local/README.md`

## 功能矩阵
| 特性 | zardui | shadcn | local(修复前) | local(修复后) | 最优参考 |
|------|--------|--------|---------------|---------------|----------|
| 打开后焦点落到菜单项 | ✓ | ✓ | 部分 | ✓ | shadcn |
| `data-side` 动画方向 | ✓ | ✓ | ✗ | ✓ | shadcn |
| Tab 收口行为 | ✓ | ✓ | ✗ | ✓ | shadcn |
| outside click/backdrop 收口 | ✓ | ✓ | ✓ | ✓ | local |
| 关闭后触发器焦点恢复策略 | ✓ | ✓ | 部分 | ✓ | shadcn |

## 样式差异
- shadcn 的内容层依赖 `data-state + data-side` 驱动过渡。
- zardui 提供服务态关闭，但 API 语义不同。
- local 修复后保留现有视觉，但把关键状态语义和焦点管理补齐。

## 行为对比
- 修复前 local 打开菜单时焦点策略不统一，`data-side` 缺失导致方向动画无效。
- 修复后 local 在 overlay `positionChange` 中同步 side，打开时可聚焦首项/末项，Tab 可收口。
- 关闭逻辑新增“是否恢复触发器焦点”分支，避免 outside click 抢焦点。

## 性能评估
- 新增的 `positionChange` 仅在 overlay 重定位时触发，开销很小。
- 焦点管理通过单次 rAF 回调完成，不引入持续监听。

## 加权评分（Menu interaction，Behavior ×1.5）
- zardui: 8.7
- shadcn: 9.2
- local 修复前: 7.0
- local 修复后: 8.8

## 已落地修复
- `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts`
  - 增加 overlay `positionChange`，同步 `data-side`。
  - 打开菜单时统一焦点策略（首项/末项）。
  - 新增 Tab 收口。
  - `closeMenu` 增加 `restoreFocus` 策略，outside/backdrop 不抢焦点。
  - 菜单内容补齐 `aria-orientation`。

## 推荐实现
- 采用 shadcn 的 data-state/data-side 语义 + local 现有 CDK overlay 架构。
- local 目前已经具备可对标 shadcn 的关键交互能力。
