# Hover Card 组件能力分析

## 1. 组件概述

**组件名称**: hover-card
**类型**: UI 组件 (Popover/Tooltip 系列)
**源码路径**: `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/hover-card/`
**依赖**: Angular CDK Overlay, Radix UI (shadcn)

## 2. 本地实现分析

### 2.1 组件结构

本地实现包含三个核心部分:

| 组件/指令 | 用途 |
|-----------|------|
| `HoverCardComponent` | 根组件，负责 Overlay 定位和显示逻辑 |
| `HoverCardTriggerDirective` | 触发指令，处理 mouseenter/focus 事件 |
| `HoverCardContentComponent` | 内容容器，配置弹出位置和对齐方式 |

### 2.2 核心能力

#### 2.2.1 定位系统
- **支持方向**: `top` | `right` | `bottom` | `left`
- **对齐方式**: `start` | `center` | `end`
- **偏移控制**:
  - `sideOffset`: 方向偏移 (默认 4px)
  - `alignOffset`: 对齐偏移 (默认 0px)
- **自动回退**: 第一个位置不可用时自动切换到对侧

#### 2.2.2 交互触发
- **鼠标触发**: `mouseenter` / `mouseleave`
- **键盘触发**: `focus` / `blur`
- **延迟控制**:
  - `openDelay`: 打开延迟 (默认 200ms)
  - `closeDelay`: 关闭延迟 (默认 300ms)
- **外部点击关闭**: 支持点击外部区域自动关闭
- **键盘关闭**: 支持 Escape 键关闭

#### 2.2.3 动画支持
- **淡入淡出**: fade-in-0 / fade-out-0
- **缩放动画**: zoom-in-95 / zoom-out-95
- **滑动动画**: 根据弹出方向自动选择 slide-in 动画
- **CSS 变量**: 支持 `origin-(--radix-hover-card-content-transform-origin)`

#### 2.2.4 样式系统
- **默认样式**: 使用 Tailwind 工具类
  - 背景: `bg-popover`
  - 文字: `text-popover-foreground`
  - 阴影: `shadow-md`
  - 圆角: `rounded-lg`
  - 宽度: `w-64` (256px)
- **数据状态属性**: `data-state="open|closed"`, `data-side`, `data-[side=*]`
- **自定义类**: 支持通过 `class` 输入覆盖

### 2.3 可访问性 (A11y)

| 特性 | 实现 |
|------|------|
| ARIA role | `role="dialog"` |
| ARIA 属性 | `aria-haspopup="dialog"`, `aria-expanded` |
| 键盘操作 | 支持 Escape 关闭 |
| 数据状态 | 通过 `data-state` 暴露状态 |

## 3. Shadcn 分析

### 3.1 Shadcn Hover Card

- **Registry 名称**: `@shadcn/hover-card`
- **类型**: `registry:ui`
- **文件数**: 1 个文件
- **依赖**: Radix UI

Shadcn 的 hover-card 是基于 Radix UI 的 `@radix-ui/react-hover-card` 实现的轻量级组件,主要提供悬停弹出能力。

## 4. Zardui 分析

**结论**: zardui 目录中不存在 hover-card 组件。

类似的组件有:
- `popover`: 弹出面板
- `tooltip`: 文字提示

这些组件的功能与 hover-card 有重叠,但定位和使用场景不同。

## 5. 能力对比矩阵

| 能力 | 本地实现 | Shadcn | Zardui |
|------|----------|--------|--------|
| 方向定位 (4向) | ✅ | ✅ | N/A |
| 对齐方式 (3种) | ✅ | ✅ | N/A |
| 偏移控制 | ✅ | ✅ | N/A |
| 鼠标触发 | ✅ | ✅ | N/A |
| 键盘触发 | ✅ | ✅ | N/A |
| 延迟打开/关闭 | ✅ | ✅ | N/A |
| 外部点击关闭 | ✅ | ✅ | N/A |
| 键盘快捷键 | ✅ (Escape) | ✅ | N/A |
| 动画效果 | ✅ | ✅ | N/A |
| 双向绑定 | ✅ (model) | N/A | N/A |
| 自定义类 | ✅ | ✅ | N/A |
| 自动回退定位 | ✅ | ✅ | N/A |

## 6. 使用示例

```html
<app-hover-card [openDelay]="200" [closeDelay]="300">
  <!-- 触发元素 -->
  <button appHoverCardTrigger>Hover me</button>

  <!-- 弹出内容 -->
  <app-hover-card-content side="top" align="center">
    <div class="text-sm">
      <h3 class="font-semibold">Title</h3>
      <p class="text-muted-foreground">Description text</p>
    </div>
  </app-hover-card-content>
</app-hover-card>
```

## 7. 总结

本地实现的 hover-card 组件功能完整,基于 Angular CDK Overlay 提供了可靠的定位系统:

**优点**:
- 完整的定位配置 (方向、对齐、偏移)
- 良好的交互体验 (延迟、动画)
- 支持双向绑定 (`open` model)
- 可访问性支持完整
- 基于 Angular Signals 的响应式设计

**特性**:
- 使用 `model<boolean>` 支持双向绑定
- 使用 `computed()` 计算位置和样式
- 使用 `viewChild()` 获取 Overlay 触发元素
- 使用 `signal()` 管理内部状态

**与 Shadcn 对比**:
- 功能基本一致,实现方式不同 (React vs Angular)
- 本地实现增加了双向绑定支持
- 本地实现增加了键盘焦点触发支持
