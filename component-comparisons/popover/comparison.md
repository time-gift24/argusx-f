# Popover 三方对比报告

## 来源
- zardui: `component-comparisons/popover/sources/zardui/README.md`
- shadcn: `component-comparisons/popover/sources/shadcn/README.md`
- local: `component-comparisons/popover/sources/local/README.md`

## 功能矩阵
| 特性 | zardui | shadcn | local(修复前) | local(修复后) | 最优参考 |
|------|--------|--------|---------------|---------------|----------|
| `align` 真正参与定位 | ✓ | ✓ | ✗ (参数未生效) | ✓ | shadcn |
| outside click 关闭 | ✓ | ✓ | 部分 | ✓ | shadcn/zardui |
| `data-side` 驱动方向动画 | ✓ | ✓ | ✗ | ✓ | shadcn |
| Escape 关闭 | ✓ | ✓ | 部分 | ✓ | shadcn |
| 触发器 `aria-controls` | ✓ | ✓ | ✗ | ✓ | shadcn |

## 样式差异
- shadcn 在 `data-[side=*]` + `data-[state=*]` 的动画组合最清晰。
- zardui 在 overlay fallback 位置策略更丰富。
- local 修复后已支持 side/align 行为语义，动画触发路径与 shadcn 对齐。

## 行为对比
- 修复前 local 的 `align` 输入无论 start/end/center 都是同一位置。
- 修复前 local 没有稳定的 outside click 收口逻辑，且没有 `data-side`，导致方向动画无效。
- 修复后 local 增加主/备选定位映射，支持 outside click、Escape 关闭，并补齐 `aria-controls` 与内容 `id` 绑定。

## 性能评估
- 计算定位仍为 `computed`，开销可控。
- 交互状态收敛到统一关闭路径，减少状态分叉。

## 加权评分（Overlay-heavy，Behavior ×1.5）
- zardui: 8.8
- shadcn: 9.2
- local 修复前: 6.5
- local 修复后: 8.7

## 已落地修复
- `src/app/shared/ui/popover/popover.component.ts`
  - 重写 `positions` 计算，`align` 与 `sideOffset` 生效。
  - 增加 `(overlayOutsideClick)` 关闭逻辑。
  - 内容节点补齐 `id`、`data-side`、`Escape` 收口。
  - 触发器补齐 `aria-controls`。

## 推荐实现
- 采用 shadcn 的状态/方向动画语义，叠加 zardui 的 fallback 定位思想。
- local 已达到可用且对齐的行为基线。
