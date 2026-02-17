# Popover 组件能力分析报告

## 1. 组件概述

| 属性 | 本地 (argusx-f) | Zardui | Shadcn |
|------|-----------------|--------|--------|
| 组件名称 | Popover | zPopover | @shadcn/popover |
| 类型 | 组合组件 (多组件+指令) | 组件+指令 | registry:ui |
| 依赖 | Angular CDK Overlay | Angular CDK | radix-ui |

## 2. 本地组件能力

### 2.1 组件结构

本地 popover 由以下组件和指令组成：

| 名称 | 类型 | 功能 |
|------|------|------|
| `PopoverComponent` | Component | 根组件，管理 open 状态和定位 |
| `PopoverTriggerDirective` | Directive | 触发器，点击打开 popover |
| `PopoverAnchorDirective` | Directive | 锚点，指定 popover 附着元素 |
| `PopoverContentComponent` | Component | 内容容器，样式面板 |
| `PopoverHeaderComponent` | Component | 头部容器 |
| `PopoverTitleComponent` | Component | 标题组件 |
| `PopoverDescriptionComponent` | Component | 描述组件 |

### 2.2 输入属性 (Inputs)

**PopoverComponent:**
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `open` | `model<boolean>` | false | 控制显示状态 (双向绑定) |
| `align` | `PopoverAlign` | 'center' | 对齐方式: start/center/end |
| `side` | `PopoverSide` | 'bottom' | 弹出方向: top/right/bottom/left |
| `sideOffset` | `number` | 4 | 偏移距离 |

**PopoverTriggerDirective:**
- 无输入属性，通过 `appPopoverTrigger` 属性选择器使用

**PopoverContentComponent:**
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `class` | `string` | '' | 额外的 CSS 类 |

**PopoverHeaderComponent / PopoverTitleComponent / PopoverDescriptionComponent:**
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `class` | `string` | '' | 额外的 CSS 类 |

### 2.3 输出事件 (Outputs)

**PopoverComponent:**
| 事件 | 类型 | 说明 |
|------|------|------|
| `openChange` | `Output<boolean>` | 状态变化时发出 |

### 2.4 公共方法

**PopoverComponent:**
| 方法 | 说明 |
|------|------|
| `openPop打开 popover |
over()` | | `closePopover()` | 关闭 popover |
| `togglePopover()` | 切换状态 |

### 2.5 功能特性

- [x] 点击触发打开/关闭
- [x] 外部点击关闭
- [x] 支持四个方向 (top/right/bottom/left)
- [x] 支持三种对齐方式 (start/center/end)
- [x] 可配置偏移距离
- [x] 支持 ESC 键关闭
- [x] 动画支持 (fade in/out, zoom in/out, slide)
- [x] 语义化 slots (header, title, description)
- [x] 主题变量支持 (background, foreground)
- [x] 无障碍支持 (aria-expanded, aria-haspopup, aria-controls)

## 3. Zardui 组件能力

### 3.1 API

**ZardPopoverDirective:**
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `zTrigger` | `'click' \| 'hover' \| null` | `'click'` | 触发方式 |
| `zContent` | `TemplateRef<unknown>` | - | 必填，内容模板 |
| `zPlacement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | 位置 |
| `zOrigin` | `ElementRef` | - | 自定义锚点 |
| `zVisible` | `boolean` | false | 手动控制显示 |
| `zOverlayClickable` | `boolean` | true | 外部点击关闭 |

**Outputs:**
| 事件 | 类型 | 说明 |
|------|------|------|
| `zVisibleChange` | `EventEmitter<boolean>` | 可见性变化 |

**z-popover Component:**
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `class` | `string` | '' | 额外样式 |

### 3.2 功能特性对比

| 特性 | 本地 | Zardui |
|------|------|--------|
| 点击触发 | 支持 | 支持 |
| 悬停触发 | 不支持 | 支持 |
| 方向控制 | 支持 (4方向) | 支持 (4方向) |
| 对齐控制 | 支持 (start/center/end) | 不支持 |
| 偏移控制 | 支持 | 不支持 |
| 手动控制 | model 双向绑定 | zVisible |
| 外部点击关闭 | 支持 | 支持 (可配置) |
| ESC 关闭 | 支持 | 未提及 |
| 动画 | 内置 | 未提及 |
| 语义化组件 | Header/Title/Description | 无 |

## 4. Shadcn (Radix UI) 能力

- 类型: `registry:ui`
- 依赖: radix-ui
- 特性: 基于 Radix UI primitives，提供无样式 popover 组件

## 5. 能力差距分析

### 5.1 本地 vs Zardui

| 特性 | 本地已有 | Zardui 有 | 建议 |
|------|----------|-----------|------|
| 点击触发 | ✅ | ✅ | - |
| 悬停触发 | ❌ | ✅ | 可考虑添加 |
| 方向控制 | ✅ | ✅ | - |
| 对齐控制 | ✅ | ❌ | 本地更完善 |
| 偏移控制 | ✅ | ❌ | 本地更完善 |
| 手动控制 | ✅ (model) | ✅ (zVisible) | - |
| 语义化组件 | ✅ | ❌ | 本地更完善 |

### 5.2 建议增强

1. **悬停触发支持**: Zardui 支持 `zTrigger="hover"`，本地可以考虑添加类似功能
2. **可配置 backdrop**: 目前无 backdrop，可考虑添加选项

## 6. 使用示例

### 本地组件用法

```html
<app-popover [open]="open()" (openChange)="open.set($event)">
  <button appPopoverTrigger>Open</button>
  <app-popover-content>
    <app-popover-header>
      <app-popover-title>Title</app-popover-title>
      <app-popover-description>Description</app-popover-description>
    </app-popover-header>
  </app-popover-content>
</app-popover>
```

### Zardui 用法

```html
<button z-button zPopover [zContent]="popoverContent" zPlacement="bottom">
  Open popover
</button>

<ng-template #popoverContent>
  <z-popover>
    <div>Content here</div>
  </z-popover>
</ng-template>
```

## 7. 结论

本地 `popover` 组件功能较为完善:
- 基于 Angular CDK Overlay 实现定位
- 支持多种对齐方式和方向
- 提供完整的语义化子组件 (header/title/description)
- 良好的无障碍支持
- 动画效果内置

与 Zardui 相比，本地组件在对齐控制和语义化方面更完善，但缺少悬停触发功能。如果需要悬停触发，可以参考 Zardui 的实现方式进行扩展。
