# Dialog 三方对比报告

## 概述

Dialog（模态对话框）是交互密集型组件，需要重点关注行为和可访问性。

## 功能矩阵

| 特性 | zardui | shadcn | local (argusx-f) | 最优 |
|------|--------|--------|------------------|------|
| **打开/关闭状态管理** | ✓ Service | ✓ State | ✓ Model/Signal | shadcn |
| **Portal 渲染** | ✓ CDK Overlay | ✓ Radix Portal | ✓ 内联条件渲染 | zardui |
| **遮罩层点击关闭** | ✓ maskClosable | ✓ Radix 默认 | ✓ | shadcn |
| **ESC 关闭** | ✓ | ✓ Radix 默认 | ✓ | shadcn |
| **焦点陷阱** | ✓ CDK | ✓ Radix | ✓ 手动实现 | shadcn |
| **焦点恢复** | ✓ | ✓ Radix | ✓ effect | shadcn |
| **自定义宽度** | ✓ zWidth | ✓ className | ✗ | zardui |
| **标题/描述** | ✓ zTitle/zDescription | ✓ DialogTitle/Description | ✓ 独立组件 | shadcn |
| **Footer 按钮** | ✓ 内置 OK/Cancel | ✓ DialogFooter | ✓ 独立组件 | shadcn |
| **关闭按钮** | ✓ 内置 | ✓ DialogClose | ✓ 可配置 | shadcn |
| **动画效果** | ✓ CSS transition | ✓ Radix + CSS | ✓ CSS + data-state | shadcn |
| **禁止滚动** | ✓ | ✓ Radix | ✗ | shadcn |
| **Aria 支持** | ✓ 基本 | ✓ Radix 完整 | ✓ 完整 | shadcn |

## 样式差异

### zardui
- 使用 Angular CDK Overlay/Portal 系统
- 内置按钮（OK/Cancel），不支持完全自定义
- 通过 `zCustomClasses` 支持 class 覆盖
- 动画使用 CSS transition + starting-style

### shadcn (React + Radix)
- 基于 Radix UI Dialog Primitive
- 完全组件化组合（Dialog > DialogTrigger > DialogContent > DialogHeader）
- Tailwind 类完全暴露，支持任意定制
- 动画使用 CSS 类 + data-state 属性
- 内置 `DialogClose` 组件处理关闭

### local (argusx-f)
- 指令式组合（`argus-dialog`, `argus-dialog-content`, `argus-dialog-overlay` 等）
- 使用 `model()` 双向绑定 open 状态
- 独立子组件：Header, Title, Description, Footer
- 使用 CSS 变量主题（来自 styles.css）
- 支持 `showCloseButton` 配置

## 行为对比

| 行为 | zardui | shadcn | local |
|------|--------|--------|-------|
| 打开触发 | Service.open() | Dialog open state | [(open)] 双向绑定 |
| 关闭触发 | onCloseClick() | DialogClose / onOpenChange | close button / overlay / ESC |
| 焦点管理 | CDK 自动 | Radix 自动 | 手动 effect |
| 键盘导航 | CDK | Radix | 手动 Tab 处理 |
| 滚动锁定 | CDK | Radix | 无 |

## 性能评估

| 维度 | zardui | shadcn | local |
|------|--------|--------|-------|
| 变更检测 | OnPush | React | OnPush |
| Signal 使用 | ✗ | N/A | ✓ model()/computed() |
| Portal 渲染 | ✓ CDK | ✓ Radix | ✗ 内联 @if |
| 懒加载 | NgModule | 代码分割 | 组件独立 |

**评分（满分 5 分）：**

| 维度 | zardui | shadcn | local | 权重 |
|------|--------|--------|-------|------|
| 功能完整性 | 4.0 | 5.0 | 4.5 | 1.0 |
| 样式灵活性 | 3.5 | 5.0 | 4.0 | 1.0 |
| 行为/A11y | 4.5 | 5.0 | 4.0 | 1.5 (×1.5) |
| 性能 | 4.0 | 4.5 | 4.5 | 1.0 |
| **加权总分** | **4.125** | **4.875** | **4.375** | |

## 推荐实现

基于智能加权，**推荐采用 shadcn 的实现方案**，理由如下：

1. **最完整的功能**: Radix UI 提供开箱即用的无障碍支持
2. **最灵活**: Tailwind 类完全暴露，可任意定制
3. **最佳实践**: 被广泛验证的组件化模式

**本地实现改进建议**：

1. 添加 **body 滚动锁定**（当前缺失）
2. 考虑使用 **CDK Portal** 替代内联渲染
3. 参考 Radix 完善焦点管理（可考虑使用 @angular/cdk/a11y）
4. 添加 **preventScroll** 选项

## 源码参考

- shadcn 示例：`component-comparisons/dialog/sources/shadcn/`
- zardui 源码：`component-comparisons/dialog/sources/zardui/`
- 本地源码：`src/app/shared/ui/dialog/`
