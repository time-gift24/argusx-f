# button-group 组件能力分析

## 功能完整性

### 本地 (argusx-f)
本地实现了一套完整的 ButtonGroup 组件系统，包含以下子组件:
- **ButtonGroupComponent**: 主组件，支持 `horizontal` / `vertical` 两种方向
- **ButtonGroupTextComponent**: 文本组件，用于按钮组内的文本标签
- **ButtonGroupSeparatorComponent**: 分隔线组件，用于分隔按钮组内的元素

支持特性:
- 水平/垂直方向切换
- 按钮自动连接样式（相邻按钮边框合并，圆角处理）
- 支持 input 元素自动拉伸
- 支持嵌套按钮组
- 支持自定义 class

### shadcn
shadcn button-group 组件:
- 位于 registry:ui
- 具体实现需要查看组件源码

### zardui
zardui 提供了完整的功能:
- **z-button-group**: 主组件，支持 `[zOrientation]` 属性
- **z-button-group-divider**: 分隔线组件
- **z-button-group-text**: 文本指令/组件

支持特性 (从 demo 推断):
- 水平/垂直方向
- 嵌套按钮组
- 与 input 集成
- 与 menu 组件集成
- 尺寸变体 (sm, default, lg)

## 性能

### 本地
- 使用 `ChangeDetectionStrategy.OnPush`，变更检测优化良好
- 使用 `computed()` 处理派生样式，避免不必要的计算
- 组件使用 `input()` 现代化 API，无运行时开销
- 模板使用 `<ng-content>` 投影，内容直接渲染无额外包装
- 使用 Tailwind CSS 组合类，通过 `cn()` 工具合并类名

### shadcn
- React 组件，依赖 React 的细粒度更新机制
- 使用 class-variance-authority (CVA) 管理样式变体

### zardui
- Angular 组件
- 使用属性绑定方式 `[zOrientation]`
- 支持嵌套组件组合

## 易用性

### 本地
**优点**:
- 完整的 JSDoc 文档和使用示例
- 支持 `class` 输入允许自定义样式
- 子组件可组合使用
- 按钮自动连接样式，开箱即用
- 支持单个按钮的圆角处理

**不足**:
- 无内置 divider 组件（虽然有 ButtonGroupSeparatorComponent）
- 无尺寸变体支持（依赖外部按钮组件）
- 无内置 icon 支持

### shadcn
**优点**:
- API 简洁直观
- 与官方 shadcn 风格一致

**不足**:
- 功能相对基础

### zardui
**优点**:
- 支持多种尺寸变体
- 支持与 input 组件集成
- 支持与 menu 组件集成
- 有完整的 demo 示例

**不足**:
- API 文档较少

## API 设计

### 本地
```typescript
// ButtonGroupComponent
readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
readonly class = input<string>('');

// ButtonGroupTextComponent
readonly class = input<string>('');

// ButtonGroupSeparatorComponent
readonly orientation = input<'horizontal' | 'vertical'>('vertical');
readonly class = input<string>('');
```

**设计特点**:
- 遵循 Angular 20+ 最佳实践，使用 signals API
- 通过 `data-slot` 属性支持 CSS 选择器
- 使用 Tailwind CSS 组合类实现按钮连接效果

### shadcn
```tsx
// 推断的 API
orientation?: "horizontal" | "vertical"
```

**设计特点**:
- 极简 API

### zardui
```typescript
// z-button-group
[zOrientation]: 'horizontal' | 'vertical'

// z-button-group-divider
[zOrientation]: 'horizontal' | 'vertical' | null

// z-button-group-text
作为指令使用
```

**设计特点**:
- 支持属性绑定
- 提供独立的 divider 和 text 组件

## 可访问性

### 本地
- `role="group"` - 正确的语义角色
- `data-slot="button-group"` - 支持 CSS 选择器
- `data-orientation` - 指示方向状态

### shadcn
- 使用 `role="group"` (从本地实现对齐推断)

### zardui
- 未在文档中标注可访问性支持

## 建议

### 开发优先级

| 特性 | 当前状态 | 建议 |
|------|---------|------|
| 方向切换 | 本地已有 | 保持 |
| 按钮连接样式 | 本地已有 | 保持 |
| 嵌套支持 | zardui 有，本地支持 | 保持 |
| 尺寸变体 | 无内置 | **低优先级**: 依赖外部按钮组件 |
| 与 Input 集成 | zardui 有 | **低优先级**: 依赖 input 组件 |
| 与 Menu 集成 | zardui 有 | **低优先级**: 依赖 menu 组件 |
| 动画过渡 | 无 | **低优先级**: 可添加 |
| 可访问性 | 良好 | 保持 |

### 总结

argusx-f 的本地 ButtonGroup 组件实现质量较高:
1. 遵循 Angular 20+ 最佳实践 (Signals, OnPush, Standalone)
2. API 设计清晰，扩展性好
3. 按钮自动连接样式，无需手动处理边框和圆角
4. 提供了 Text 和 Separator 子组件
5. 支持嵌套使用

当前实现已达到生产就绪状态，可根据业务需求选择性添加:
- 与其他表单组件（select 等）的集成支持
- 尺寸变体封装
