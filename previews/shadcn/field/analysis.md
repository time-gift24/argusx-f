# Field 组件能力分析

## 概述

Field 组件是一套用于构建表单字段的组合式 UI 组件库，提供标签、描述、错误提示、分组等能力。该组件库对齐 shadcn/ui 的官方 field 组件设计。

## 组件清单

| 组件 | Selector | 用途 |
|------|----------|------|
| FieldComponent | `app-field` | 字段容器，包裹标签、输入框、描述和错误 |
| FieldSetComponent | `app-field-set` | 字段集容器，用于分组相关字段 |
| FieldLegendComponent | `app-field-legend` | 字段集标题 |
| FieldGroupComponent | `app-field-group` | 多字段分组容器 |
| FieldContentComponent | `app-field-content` | 输入控件容器 |
| FieldLabelComponent | `app-field-label` | 字段标签 |
| FieldTitleComponent | `app-field-title` | 字段小标题（用于 checkbox/radio 组） |
| FieldDescriptionComponent | `app-field-description` | 辅助说明文本 |
| FieldSeparatorComponent | `app-field-separator` | 分隔线（可带中间内容） |
| FieldErrorComponent | `app-field-error` | 错误信息展示 |

## 能力详解

### 1. FieldComponent（字段容器）

**核心属性：**
- `orientation`: 布局方向
  - `vertical`（默认）：垂直布局，标签/描述在输入框上方
  - `horizontal`：水平布局，标签与输入框同一行
  - `responsive`：响应式，桌面端水平，移动端垂直

**特性：**
- 使用 `role="group"` 提供语义化分组
- 通过 `data-slot="field"` 标识插槽
- 支持 `data-invalid` 属性用于错误状态样式
- 支持 disabled 状态的透明度处理

**示例：**
```html
<app-field orientation="horizontal">
  <app-field-label for="email">Email</app-field-label>
  <input appInput id="email" type="email" />
</app-field>
```

### 2. FieldSetComponent（字段集）

**用途：** 语义化容器，用于组织表单的多个相关字段（如"支付信息"、"地址信息"等）

**特性：**
- 使用 `data-slot="field-set"` 标识
- 自动处理 checkbox-group 和 radio-group 的间距
- 支持嵌套结构

### 3. FieldLegendComponent（字段集标题）

**属性：**
- `variant`: 变体
  - `legend`（默认）：较大文本，用于主分区
  - `label`：较小文本，类似于 label

### 4. FieldLabelComponent（字段标签）

**特性：**
- 支持 `for` 属性关联输入控件
- 支持 checked 状态的背景色变化
- 支持 disabled 状态的透明度
- 支持嵌套 field 时的特殊布局（列布局）

### 5. FieldTitleComponent（字段小标题）

**用途：** 用于 checkbox/radio 组的标题，比 FieldLabel 更轻量

**特性：**
- 字体较小（text-xs）
- 支持 disabled 状态的透明度

### 6. FieldDescriptionComponent（辅助说明）

**特性：**
-  muted 颜色主题
- 支持链接样式的自动处理（`[&>a]:...`）
- 支持 text-balance 排版（horizontal 布局时）
- 自动处理与 legend 的间距

### 7. FieldErrorComponent（错误展示）

**属性：**
- `errors`: `Array<FieldErrorItem>` - 错误对象数组
- `errorContent`: `string` - 直接内容

**特性：**
- 自动去重（通过 message 去重）
- 单错误显示为简单文本
- 多错误显示为无序列表
- 使用 `role="alert"` 提供无障碍支持
- 支持响应式布局

**FieldErrorItem 接口：**
```typescript
export interface FieldErrorItem {
  message?: string;
}
```

### 8. FieldSeparatorComponent（分隔线）

**属性：**
- `hasContent`: 是否显示中间内容

**特性：**
- 使用 SeparatorComponent 作为基础
- 可在中间显示文字（如"OR"）
- 支持 variant="outline" 变体

### 9. FieldGroupComponent（字段组）

**用途：** 容器查询上下文，用于响应式字段布局

**特性：**
- 使用 `@container/field-group` 容器查询
- 支持 checkbox-group 和 radio-group 的特殊间距

### 10. FieldContentComponent（内容容器）

**用途：** 包裹输入控件，提供 flex 布局

**特性：**
- 支持嵌套 field 时的列布局
- 处理与 label 的间距

## 与 shadcn/ui 对比

### 组件映射

| shadcn/ui (React) | 本地实现 (Angular) | 状态 |
|-------------------|-------------------|------|
| Field | FieldComponent | 已实现 |
| FieldLabel | FieldLabelComponent | 已实现 |
| FieldDescription | FieldDescriptionComponent | 已实现 |
| FieldError | FieldErrorComponent | 已实现 |
| FieldSet | FieldSetComponent | 已实现 |
| FieldLegend | FieldLegendComponent | 已实现 |
| FieldGroup | FieldGroupComponent | 已实现 |
| FieldSeparator | FieldSeparatorComponent | 已实现 |
| - | FieldTitleComponent | 扩展实现 |
| - | FieldContentComponent | 扩展实现 |

### 差异点

1. **命名空间**：shadcn 使用单一 `Field` 组件通过 `asChild` 实现内容分发；Angular 版本拆分为多个独立组件

2. **CVA 变体**：shadcn 使用 `cva` 定义变体；本地实现保持一致，使用 `class-variance-authority`

3. **FieldTitle**：shadcn/ui 官方无此组件，本地实现新增用于 checkbox/radio 组的轻量标题

4. **FieldContent**：shadcn/ui 官方无此组件，本地实现用于包裹输入控件

5. **错误处理**：
   - shadcn: 使用 `FormMessage` 组件
   - 本地: 使用独立的 `FieldErrorComponent`，支持数组去重

## 可访问性（A11y）

- Field 容器使用 `role="group"` 提供语义分组
- FieldError 使用 `role="alert"` 播报错误
- FieldLabel 支持 `for` 属性关联输入
- 支持 disabled 状态的视觉反馈
- 颜色对比符合 WCAG AA

## 使用示例

### 基础表单字段

```html
<app-field>
  <app-field-label for="email">Email Address</app-field-label>
  <input appInput id="email" type="email" placeholder="Enter your email" />
  <app-field-description>We'll never share your email.</app-field-description>
  <app-field-error [errors]="emailControl.errors" />
</app-field>
```

### 水平布局

```html
<app-field orientation="horizontal">
  <app-field-label for="remember">Remember me</app-field-label>
  <input appInput id="remember" type="checkbox" />
</app-field>
```

### 字段分组

```html
<app-field-set>
  <app-field-legend>Personal Information</app-field-legend>
  <app-field-description>Tell us about yourself</app-field-description>

  <app-field-group>
    <app-field>
      <app-field-label for="firstName">First Name</app-field-label>
      <input appInput id="firstName" />
    </app-field>
    <app-field>
      <app-field-label for="lastName">Last Name</app-field-label>
      <input appInput id="lastName" />
    </app-field>
  </app-field-group>
</app-field-set>
```

### 分隔线

```html
<app-field-set>
  <app-field-group>...</app-field-group>
  <app-field-separator>OR</app-field-separator>
  <app-field-group>...</app-field-group>
</app-field-set>
```

## 样式特性

- 使用 Tailwind CSS 工具类
- 主题变量来自 `src/styles.css`（如 `text-muted-foreground`, `text-destructive`）
- 支持 disabled 状态的透明度处理
- 支持响应式布局（容器查询）
- 支持 hover/checked 等交互状态

## 导出

```typescript
// 完整导出
export { FieldComponent } from './field.component';
export { FieldSetComponent } from './field-set.component';
export { FieldLegendComponent } from './field-legend.component';
export { FieldGroupComponent } from './field-group.component';
export { FieldContentComponent } from './field-content.component';
export { FieldLabelComponent } from './field-label.component';
export { FieldTitleComponent } from './field-title.component';
export { FieldDescriptionComponent } from './field-description.component';
export { FieldSeparatorComponent } from './field-separator.component';
export { FieldErrorComponent, type FieldErrorItem } from './field-error.component';
```

## 总结

Field 组件是一套完整的表单字段组合组件，对齐 shadcn/ui 官方设计并做了 Angular 适配：

- **10 个组件**覆盖表单字段的各种场景
- **支持 3 种布局方向**：vertical、horizontal、responsive
- **完整的可访问性**支持
- **与 shadcn/ui 高度一致**的实现
- **新增扩展组件**：FieldTitle、FieldContent 增强灵活性
