# Tooltip 三方对比报告

## 来源
- zardui: `component-comparisons/tooltip/sources/zardui/README.md`
- shadcn: `component-comparisons/tooltip/sources/shadcn/README.md`
- local: `component-comparisons/tooltip/sources/local/README.md`

## 功能矩阵
| 特性 | zardui | shadcn | local(修复前) | local(修复后) | 最优参考 |
|------|--------|--------|---------------|---------------|----------|
| Provider 控制全局延迟 | ✓ | ✓ | 部分（仅构造时生效） | ✓ | shadcn/zardui |
| Trigger `aria-describedby` 关联 | ✓ | ✓ | ✗ | ✓ | shadcn |
| Content 语义角色/ID | ✓ | ✓ | 部分 | ✓ | shadcn |
| sideOffset 默认行为 | 轻偏移 | 0 | 5 | 0 | shadcn |

## 样式差异
- zardui: 动画与延迟控制更丰富（含多触发策略）。
- shadcn: 默认延迟为 0，交互反馈更直接。
- local 修复前默认 300ms 且 provider 更新不响应输入，导致与示例不一致。

## 行为对比
- local 修复前：`app-tooltip-provider` 的 `delayDuration` 在输入变化后不生效。
- local 修复后：改为 `effect` 驱动，延迟配置实时生效；同时补齐 a11y 关联属性。

## 性能评估
- 组件本身轻量。
- 修复后减少“配置不生效导致重复 hover 触发”的交互抖动。

## 加权评分（Interaction-heavy，Behavior ×1.5）
- zardui: 8.8
- shadcn: 9.0
- local 修复前: 6.8
- local 修复后: 8.6

## 已落地修复
- `src/app/shared/ui/tooltip/tooltip.component.ts`
  - Provider 改为 `effect` 同步 `delayDuration`。
  - Trigger 增加 `aria-describedby` 与 `data-state`。
  - Content 增加 `role="tooltip"` 和稳定 `id`。
  - `sideOffset` 默认值从 `5` 调整到 `0`。

## 推荐实现
- 采用 shadcn 的默认交互和语义属性基线，并保留 local 的 CDK overlay 架构。
