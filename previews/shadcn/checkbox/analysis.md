# checkbox 组件能力分析

## 功能完整性

### 本地 (Angular CheckboxComponent)
- **三态支持**: 支持 checked、unchecked、indeterminate 三种状态
- **表单集成**: 实现 `ControlValueAccessor`，支持 Reactive Forms
- **双向绑定**: 支持 `[(checked)]` 双向绑定
- **禁用状态**: 支持 `disabled` 输入
- **必填校验**: 支持 `required` 属性
- **键盘操作**: 支持 Space 和 Enter 键切换状态
- **自定义样式**: 支持 `class` 输入添加自定义样式
- **无障碍支持**: 完整的 ARIA 属性 (aria-checked, aria-required, aria-invalid)

### shadcn (React + Radix UI)
- **基础功能**: 基于 Radix UI Checkbox primitive
- **三态支持**: 支持 checked、unchecked 状态（indeterminate 需额外处理）
- **表单集成**: 支持 React Hook Form
- **样式系统**: 使用 Tailwind CSS，支持 dark mode

### zardui (Directive 实现)
- **类型变体**: 支持 `default` 和 `destructive` 类型
- **尺寸**: 支持 `default` 和 `lg` 尺寸
- **形状**: 支持 `default`、`circle`、`square` 三种形状
- **禁用状态**: 支持 `zDisabled` 属性
- **实现方式**: Directive 形式，依赖原生 checkbox

## 性能

### 本地
- **变更检测**: 使用 `ChangeDetectionStrategy.OnPush`，高效
- **Signal 架构**: 使用 `model()` 和 `computed()`，细粒度更新
- **无冗余渲染**: computed 属性确保仅在依赖变化时重新计算

### shadcn
- **React 优化**: 基于 Radix UI，性能良好
- **按需渲染**: React 生态的标准优化

### zardui
- **轻量级**: Directive 形式，无额外组件开销
- **依赖原生**: 依赖原生 checkbox 元素，性能最佳

## 易用性

### 本地
- **使用示例**:
  ```html
  <app-checkbox [(checked)]="rememberMe">Remember me</app-checkbox>
  <app-checkbox [formControl]="myControl">Label</app-checkbox>
  ```
- **提供 InjectionToken**: `CHECKBOX_ROOT_TOKEN` 便于子组件访问
- **Lucide 图标**: 内置 CheckIcon 和 MinusIcon

### shadcn
- 需要额外配置和三方依赖
- 需要理解 Radix UI 概念

### zardui
- **最简 API**: 只需添加 directive 即可
  ```html
  <input type="checkbox" z-checkbox zSize="lg" zShape="circle">
  ```
- **属性驱动**: 所有配置通过 HTML 属性完成

## API 设计

### 本地
| 输入 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `checked` | `model<boolean \| 'indeterminate'>` | `false` | 双向绑定 |
| `disabled` | `input<boolean>` | `false` | 禁用状态 |
| `name` | `input<string>` | - | 表单名称 |
| `value` | `input<string>` | - | 表单值 |
| `required` | `input<boolean>` | `false` | 必填校验 |
| `class` | `input<string>` | `''` | 自定义样式 |

| 输出 | 类型 | 说明 |
|------|------|------|
| `checkedChange` | `output<CheckboxCheckedState>` | 状态变化事件 |

### shadcn
| 属性 | 类型 | 说明 |
|------|------|------|
| `checked` | `boolean` | 选中状态 |
| `onCheckedChange` | `function` | 状态变化回调 |
| `disabled` | `boolean` | 禁用状态 |

### zardui
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `zType` | `default \| destructive` | `default` | 视觉类型 |
| `zSize` | `default \| lg` | `default` | 尺寸 |
| `zShape` | `default \| circle \| square` | `default` | 形状 |
| `zDisabled` | `boolean` | `false` | 禁用状态 |

## 可访问性

### 本地
- **ARIA 属性**:
  - `aria-checked`: 反映三态 ("true" | "false" | "mixed")
  - `aria-required`: 必填状态
  - `aria-invalid`: 校验状态
- **键盘支持**: Space 和 Enter 键激活
- **焦点管理**: 支持 focus-visible 样式
- **数据属性**: `data-state` 和 `data-disabled` 便于样式绑定

### shadcn
- 基于 Radix UI，原生支持键盘导航
- 提供 ARIA 属性

### zardui
- 依赖原生 checkbox 的可访问性
- 需手动确保键盘可访问性

## 建议

### 开发优先级
**优先级: 中等**

本地 checkbox 组件已经相当完善，具备以下优势:
1. 完整的 Signal 架构，符合 Angular v20+ 最佳实践
2. 三态支持 (indeterminate) 是独特优势
3. ControlValueAccessor 实现完整，支持表单集成
4. 完整的可访问性支持

**可改进点**:
1. 考虑支持 zardui 的 `zShape` (圆形/方形) 变体
2. 支持 `zType` destructive 类型
3. `setDisabledState` 方法当前为空实现，可考虑增强
4. 可添加 `indeterminate` 手动触发方法 (如 `setIndeterminate()`)

**结论**: 本地组件功能完整度高于 shadcn 和 zardui，适合作为生产使用。三态支持和表单集成是核心差异化能力。
