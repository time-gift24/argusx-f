# Kbd 组件能力分析

## 1. 组件概述

**组件用途**: 用于显示键盘按键和快捷键的 UI 组件。适用于文档、工具提示、命令面板和 UI 提示中展示键盘快捷键。

**组件类型**: shadcn/ui 标准组件 (registry:ui)

## 2. 本地实现 (argusx-f)

### 文件结构
```
src/app/shared/ui/kbd/
├── index.ts           # 导出文件
└── kbd.directive.ts   # 指令实现
```

### 核心实现
- **KbdDirective**: 用于 `<kbd>` 元素的指令，应用键盘按键样式
- **KbdGroupDirective**: 用于分组多个 `<kbd>` 元素的指令

### API

| 输入 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `class` | `string` | `''` | 额外的 CSS 类名 |

### 样式实现
```typescript
const kbdBaseClasses = "bg-muted text-muted-foreground in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 h-5 w-fit min-w-5 gap-1 rounded-xs px-1 font-sans text-[0.625rem] font-medium [&_svg:not([class*='size-'])]:size-3 pointer-events-none inline-flex items-center justify-center select-none";
```

特点:
- 使用 `inline-flex` 布局
- 固定高度 `h-5`
- 圆角 `rounded-xs`
- 等宽字体渲染
- 指针事件禁用 `pointer-events-none`
- 支持在 tooltip 内容中显示时的特殊样式

## 3. Zardui 实现

### 文件结构
```
/tmp/zardui/apps/web/public/components/kbd/
├── demo/
│   ├── default.md      # 默认示例
│   ├── group.md        # 分组示例
│   └── tooltip.md      # 工具提示示例
├── doc/
│   ├── api.md          # API 文档
│   └── overview.md    # 概述
└── r/kbd.json          # 组件源码
```

### 核心实现
- **ZardKbdComponent**: 组件模式，selector 为 `z-kbd` 或 `[z-kbd]`
- **ZardKbdGroupComponent**: 组件模式，selector 为 `z-kbd-group` 或 `[z-kbd-group]`
- **kbd.variants.ts**: 使用 class-variance-authority (CVA) 定义变体

### API

| 输入 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `class` | `ClassValue` | `''` | 额外的 CSS 类名 |

### 样式实现 (kbd.variants.ts)
```typescript
export const kbdVariants = cva(
  `min-w-5 w-fit h-5 inline-flex items-center justify-center gap-1 text-xs font-medium font-mono bg-muted text-muted-foreground pointer-events-none rounded-sm px-1 select-none [&_svg:not([class*='size-'])]:size-3 [[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10`,
);
```

特点:
- 使用 `font-mono` 等宽字体
- 圆角为 `rounded-sm` (比本地实现大)
- 支持变体配置

## 4. Shadcn 信息

- **类型**: registry:ui
- **文件数**: 1 file(s)
- **注**: shadcn 原始组件为 React 组件

## 5. 能力对比

| 特性 | 本地实现 (argusx-f) | Zardui 实现 |
|------|---------------------|-------------|
| 实现方式 | Directive | Component |
| Selector | `kbd[appKbd]` | `z-kbd`, `[z-kbd]` |
| 字体 | `font-sans` | `font-mono` |
| 圆角 | `rounded-xs` | `rounded-sm` |
| 分组组件 | `kbd[appKbdGroup]` | `z-kbd-group` |
| 变体支持 | 无 | CVA 变体 |

## 6. 使用示例

### 本地实现
```html
<!-- 单个按键 -->
<kbd appKbd>Esc</kbd>
<kbd appKbd>⌘</kbd>
<kbd appKbd>Ctrl</kbd>

<!-- 按键分组 -->
<kbd appKbdGroup>
  <kbd appKbd>Ctrl</kbd>
  <span>+</span>
  <kbd appKbd>K</kbd>
</kbd appKbdGroup>

<!-- 按钮中使用 -->
<button>
  Submit
  <kbd appKbd class="ml-2">Enter</kbd>
</button>
```

### Zardui 实现
```html
<!-- 单个按键 -->
<z-kbd>Esc</z-kbd>
<z-kbd>⌘</z-kbd>
<z-kbd>Ctrl</z-kbd>

<!-- 按键分组 -->
<z-kbd-group>
  <z-kbd>Ctrl</z-kbd>
  <span>+</span>
  <z-kbd>K</z-kbd>
</z-kbd-group>

<!-- 工具提示中使用 -->
<button z-button [zTooltip]="shortcutTip">Save</button>

<ng-template #shortcutTip>
  Press
  <z-kbd-group>
    <z-kbd class="bg-blue-400 text-white">Ctrl</z-kbd>
    <span>+</span>
    <z-kbd class="bg-blue-400 text-white">S</z-kbd>
  </z-kbd-group>
  to save
</ng-template>
```

## 7. 总结

### 本地实现特点
- 使用 Directive 模式，更轻量
- 依赖原生 `<kbd>` HTML 元素
- 使用 `cn()` 工具函数合并类名
- 符合 argusx-f 项目规范 (OnPush, input(), computed())

### Zardui 实现特点
- 使用 Component 模式
- 使用 CVA 进行变体管理
- 支持多种 selector 方式
- 更适合复杂场景

### 建议
1. 本地实现已满足基本需求
2. 如需变体支持，可参考 Zardui 的 CVA 方式扩展
3. 考虑将 `font-sans` 改为 `font-mono` 以获得更好的等宽字体体验
