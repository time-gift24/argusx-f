# Select 三方对比报告

## 概述

`Select` 属于交互密集型组件（Interaction Heavy），本次以你指定的目标页面为标准：

- https://ui.shadcn.com/preview/radix/select-example?item=select-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite

本地已完成复刻预览并实测以下核心能力：展开态样式、键盘导航、长列表滚动、Dialog 内使用。

## 功能矩阵

| 特性 | zardui | shadcn radix-mira | local (argusx-f) | 最优 |
|---|---|---|---|---|
| 基础触发/选中 | ✓ | ✓ | ✓ | 三者一致 |
| 分组/标签/分隔线 | ✓ | ✓ | ✓ | 三者一致 |
| 尺寸变体 | ✓ | ✓ | ✓ | 三者一致 |
| 大列表滚动 | ✓ | ✓ | ✓ | shadcn/local |
| 展开态动画 | △ | ✓ | ✓ | shadcn/local |
| 键盘导航（↑↓/Home/End/Enter/Esc） | △ | ✓ | ✓ | shadcn/local |
| 禁用项跳过与不可选 | ✓ | ✓ | ✓ | 三者一致 |
| Dialog 内使用 | ✓ | ✓ | ✓ | 三者一致 |
| Popper 位置变体 | △ | ✓ | ✓ | shadcn/local |

## 样式对齐结论

本地 `src/app/shared/ui/select/select.component.ts` 已对齐 `radix-mira` 关键类与 token：

- trigger：边框、背景、ring、size（`h-7`/`h-6`）、icon 尺寸。
- content：`min-w-32`、`rounded-lg`、`ring-1`、`shadow-md`、进入/退出动画、`data-side` 位移动画。
- item：高亮态、选中态、disabled 态、indicator 布局。

截图对照：

- 官方：`component-comparisons/select/sources/shadcn/preview-*.png`
- 本地：`component-comparisons/select/sources/local/preview-*.png`

## 行为对齐结论（重点）

本地新增并验证：

1. 展开后自动高亮（优先当前值，否则首/尾项）并聚焦。
2. `ArrowUp/ArrowDown` 逐项导航，`Home/End` 跳转边界。
3. `Enter/Space` 选中并关闭，`Escape` 关闭并回焦 trigger。
4. 长列表滚动按钮显隐与滚动状态联动。
5. Dialog 场景下可正常展开与选择，不受遮罩影响。

## 性能与实现方式

- zardui：Angular + 组件分层完整，但行为扩展粒度略低。
- shadcn：Radix primitive 行为最完整，默认可访问性最佳。
- local：Angular + signals + CDK overlay，行为已补齐，改造成本最低。

## 加权评分（Interaction Heavy：Behavior ×1.5）

| 维度 | zardui | shadcn | local |
|---|---:|---:|---:|
| 功能完整性 | 4.2 | 5.0 | 4.8 |
| 样式一致性 | 4.1 | 5.0 | 4.8 |
| 行为/A11y（×1.5） | 3.9 | 5.0 | 4.7 |
| 性能与工程可维护性 | 4.3 | 4.7 | 4.8 |
| **加权总分** | **4.10** | **4.93** | **4.76** |

## 推荐实现

- 视觉与交互目标基线：`shadcn radix-mira`
- 在本项目内最佳落地：`local`（已对齐核心行为与样式，且可维护性更高）

