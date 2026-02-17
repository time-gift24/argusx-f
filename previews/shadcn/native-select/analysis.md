# native-select 组件能力分析

## 组件概述

native-select 是一个基于 Angular Directive 的原生 select 样式增强组件，位于 `src/app/shared/ui/native-select/` 目录。该组件提供对 HTML 原生 `<select>` 元素的样式定制，而非自定义下拉菜单。

## 源码位置

- **本地实现**: `src/app/shared/ui/native-select/native-select.directive.ts`
- **导出入口**: `src/app/shared/ui/native-select/index.ts`
- **预览组件**: `src/app/preview/native-select-preview.component.ts`

## 组件结构

该组件由 5 个 Directive 组成：

| Directive | Selector | 用途 |
|-----------|----------|------|
| `NativeSelectWrapperDirective` | `div[appNativeSelectWrapper]` | 包装容器，处理布局和尺寸 |
| `NativeSelectDirective` | `select[appNativeSelect]` | 原生 select 样式 |
| `NativeSelectOptionDirective` | `option[appNativeSelectOption]` | 选项样式（占位符） |
| `NativeSelectOptGroupDirective` | `optgroup[appNativeSelectOptGroup]` | 选项分组样式 |
| `NativeSelectIconDirective` | `lucide-icon[appNativeSelectIcon]` | 下拉箭头图标 |

## 功能特性

### 1. 尺寸变体
- `size: 'sm'` - 小尺寸（h-6, text-[0.625rem]）
- `size: 'default'` - 默认尺寸（h-7, text-xs/relaxed）

### 2. 样式特性
- 使用 CVA (class-variance-authority) 管理样式变体
- 支持 `data-slot` 属性用于 CSS 选择器
- 焦点状态、禁用状态、错误状态（aria-invalid）的完整处理
- 支持暗色模式（dark: 样式）
- 选中区域样式（selection:bg-primary）

### 3. 交互状态
- `:hover` - 悬停背景变化
- `:focus-visible` - 键盘焦点环
- `:disabled` - 禁用态和 `cursor-not-allowed`

### 4. 布局
- 绝对定位的下拉箭头图标
- 右侧 chevron 图标通过 `lucide-icon` 组件渲染

## 使用示例

```html
<!-- 默认尺寸 -->
<div appNativeSelectWrapper class="w-64">
  <select appNativeSelect [value]="value" (change)="value.set($any($event.target).value)">
    <option appNativeSelectOption value="us">United States</option>
  </select>
  <lucide-icon appNativeSelectIcon [img]="ChevronDown" />
</div>

<!-- 小尺寸 + 分组 -->
<div appNativeSelectWrapper [size]="'sm'" class="w-64">
  <select appNativeSelect [size]="'sm'" [value]="timezone">
    <optgroup appNativeSelectOptGroup label="Americas">
      <option appNativeSelectOption value="pst">Pacific (PST)</option>
    </optgroup>
  </select>
  <lucide-icon appNativeSelectIcon [img]="ChevronDown" />
</div>
```

## shadcn 对比

根据 MCP 获取的信息，shadcn 的 native-select 位于 `registry:ui`，但仅有 1 个文件。本地实现与 shadcn 官方 preset 对齐（注释中注明 "Aligned with official shadcn preset"）。

### 主要差异
- shadcn 使用 React，本实现为 Angular Directive
- 本实现提供完整的 Angular Signals 集成
- 本实现额外提供 `NativeSelectOptionDirective` 和 `NativeSelectOptGroupDirective`

## 可访问性 (A11y)

- `aria-invalid` 支持错误状态
- `aria-hidden="true"` 用于图标
- `data-slot` 属性用于语义化
- 支持键盘导航（原生 select 行为）

## 与自定义 Select 的对比

| 特性 | native-select | 自定义 Select |
|------|---------------|---------------|
| 交互方式 | 原生浏览器下拉 | 自定义 UI |
| 样式定制 | 有限（仅边框、背景等） | 完全可控 |
| 性能 | 优（无 JS 渲染） | 需额外渲染 |
| 移动端 | 自带优化 | 需自行处理 |
| 无障碍 | 原生支持 | 需自行实现 |

## 依赖

- `@angular/core` (Signals, Directive, input)
- `class-variance-authority` (CVA 样式变体)
- `lucide-angular` (图标组件)
- `@app/shared/utils/cn` (条件类名合并)

## 总结

native-select 适用于需要保持原生 select 交互行为，同时希望统一视觉风格的场景。它不是自定义下拉菜单的替代品，而是一种轻量级的样式增强方案。

**适用场景**:
- 简单表单场景
- 移动端优先的表单
- 需要原生交互但需统一主题的场景

**不适用场景**:
- 需要自定义下拉面板
- 需要搜索/过滤功能
- 需要多选功能
