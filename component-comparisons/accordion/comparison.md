# Accordion 三方对比报告

## 概述

Accordion（手风琴）组件是交互密集型组件，支持多选或单选展开/收起内容区域。

## 功能矩阵

| 特性 | zardui | shadcn | local | 最优 |
|------|:------:|:------:|:-----:|:----:|
| 单选模式 (single) | ✓ | ✓ | ✓ | - |
| 多选模式 (multiple) | ✓ | ✓ | ✓ | - |
| 可折叠 (collapsible) | ✓ | ✓ | ✓ | - |
| 禁用状态 (disabled) | ✗ | ✓ | ✓ | shadcn/local |
| 默认值 (defaultValue) | ✓ | ✓ | ✓ | - |
| 受控模式 (value) | ✗ | ✓ | ✗ | shadcn |
| 独立 trigger/content | ✗ | ✓ | ✓ | shadcn/local |

## 样式差异

### zardui
- 使用 `accordionVariants()` 变体系统
- ViewEncapsulation.None
- 内联 icon 旋转动画
- 使用 clsx 合并类名

### shadcn
- Radix UI 提供
- Tailwind 类名直接使用
- 支持 border 变体

### local (argusx-f)
- 使用 `cn()` 工具函数
- OnPush 变更检测
- CSS Grid 动画 (`grid-rows-[1fr]` / `grid-rows-[0fr]`)
- 分离的 trigger/content 组件
- AccordionRootDirective 管理状态

## 行为对比

### zardui
- 使用 `contentChildren` 查询子组件
- `toggleItem()` 方法处理单选/多选逻辑
- 无 ARIA 属性支持
- 无 disabled 支持
- 无 keyboard 导航

### shadcn
- Radix UI 原语提供完整 ARIA 支持
- 完整 keyboard 导航 (Enter/Space 展开, Tab 导航)
- 支持 disabled items
- 支持 RTL
- 多种示例 (basic, multiple, disabled, borders, card)

### local
- 使用 `inject()` 获取父组件引用
- 完整 ARIA 属性 (`aria-expanded`, `role="region"`)
- 使用 `inert` 属性隐藏收起内容
- 支持 disabled
- 支持 `AccordionRootDirective` 状态管理

## 性能评估

| 指标 | zardui | shadcn | local |
|------|:------:|:------:|:-----:|
| Change Detection | OnPush | N/A (React) | OnPush |
| 状态管理 | signal + computed | React state | signal + effect |
| 动画实现 | CSS transform | CSS height | CSS grid |
| 依赖大小 | 轻量 | Radix 中等 | 轻量 |

## 评分（交互密集型 ×1.5 行为权重）

| 维度 | zardui | shadcn | local |
|------|:------:|:------:|:-----:|
| 功能性 (1.0) | 7 | 10 | 8 |
| 样式 (1.0) | 8 | 9 | 9 |
| 行为 (1.5) | 4 | 10 | 9 |
| 性能 (1.0) | 8 | 8 | 9 |
| **加权总分** | **22** | **38.5** | **32.5** |

## 推荐实现

基于智能加权，**推荐采用 local (argusx-f) 的实现方案**，理由：

1. **信号架构** - 与 Angular 20+ 最佳实践一致
2. **完整 ARIA** - 支持 accessibility
3. **状态隔离** - AccordionRootDirective 分离关注点
4. **CSS Grid 动画** - 性能优于 height 动画
5. **组件分离** - Trigger/Content 独立，便于扩展

可改进方向：
- 添加受控模式支持 (`value` 输入)
- 添加 `onValueChange` 输出
- 参考 shadcn 添加更多变体 (borders, card)
