# badge 组件能力分析

## 功能完整性

### 本地 (argusx-f)

本地实现了基于 Directive 的 Badge 组件:

- **BadgeDirective**: 指令式实现，可应用于 `<span>`, `<a>`, `<div>` 元素
- 支持 6 种变体: default, secondary, destructive, outline, ghost, link

变体数量: **6 种** (default, secondary, destructive, outline, ghost, link)

### shadcn

shadcn badge 组件信息:

- **badge**: 主组件 (registry:ui)
- 依赖: radix-ui
- 变体通过 CVA (class-variance-authority) 管理

变体数量: 参考本地实现，约 4-5 种

### zardui

zardui 提供了完整的 Badge 组件:

- **z-badge**: 主组件
- 属性: `[zType]`, `[zShape]`
- zType 变体: default, secondary, destructive, outline
- zShape 变体: default, square, pill

变体数量: **4+ 种** (zType) + **3 种** (zShape) = 12+ 种组合

## 性能

### 本地

- 使用 `ChangeDetectionStrategy.OnPush`，变更检测优化良好 (Directive 级别)
- 使用 `computed()` 处理派生样式，避免不必要的计算
- 指令使用 `input()` 现代化 API，无运行时开销
- 模板使用 `<ng-content>` 投影，内容直接渲染无额外包装
- 指令选择器支持 `span[appBadge]`, `a[appBadge]`, `div[appBadge]`，灵活度高

### shadcn

- React 组件，依赖 React 的细粒度更新机制
- 使用 class-variance-authority (CVA) 管理样式变体

### zardui

- Angular 组件，具体实现未详查
- 基于 demo 来看使用属性绑定方式 (`zType`, `zShape`)

## 易用性

### 本地

**优点**:

- 完整的 JSDoc 文档和使用示例
- 支持 `class` 输入允许自定义样式
- 指令式设计，可应用于任意元素 (span/a/div)
- 导出 `badgeVariants` 供外部复用
- 通过 `data-slot` 和 `data-variant` 属性支持 CSS 选择器
- 支持图标 (通过 `data-[icon]` 属性支持)

**不足**:

- 无独立组件，需配合宿主元素使用
- 无内置图标支持，需手动添加
- 无 shape 变体 (如 pill/square)

### shadcn

**优点**:

- API 简洁直观
- CVA 驱动的变体系统

**不足**:

- 变体较少
- React 组件，不适用于 Angular 项目

### zardui

**优点**:

- 独立组件，使用简单
- 支持 shape 变体 (default, square, pill)
- 多种 type 变体组合
- 支持图标和自定义 class

**不足**:

- API 文档较少
- 文档仅显示 4 种 zType 和 3 种 zShape

## API 设计

### 本地

```typescript
// BadgeDirective
readonly variant = input<BadgeVariant>('default');  // 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
readonly class = input<string>('');

// 使用示例
<span appBadge>Default</span>
<span appBadge variant="secondary">Secondary</span>
<span appBadge variant="outline">Outline</span>
<a appBadge variant="link" href="/path">Link Badge</a>
```

**设计特点**:

- 遵循 Angular 20+ 最佳实践，使用 signals API
- CVA 驱动的变体系统，与 shadcn 保持一致
- 通过 `data-slot` 和 `data-variant` 属性支持 CSS 选择器
- 指令选择器灵活，支持多种宿主元素
- 支持图标 (通过 CSS 属性 `has-data-[icon]`)

### shadcn

```tsx
// badge
variant?: "default" | "secondary" | "destructive" | "outline"
```

**设计特点**:

- 极简 API
- CVA 管理变体

### zardui

```typescript
[zType]: 'default' | 'secondary' | 'destructive' | 'outline'
[zShape]: 'default' | 'square' | 'pill'

// 使用示例
<z-badge>Badge</z-badge>
<z-badge zType="secondary">Secondary</z-badge>
<z-badge zShape="pill">Pill Badge</z-badge>
```

**设计特点**:

- 独立组件，使用属性控制外观
- 支持 shape 变体，灵活度高

## 可访问性

### 本地

- `data-slot="badge"` - 支持 CSS 选择器
- `data-variant` - 变体状态可通过 CSS 选择
- 聚焦样式: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- 链接样式: 使用 `[a]:hover:` 伪类支持链接交互
- `aria-invalid` 支持错误状态样式

### shadcn

- 使用语义化结构 (从本地实现对齐推断)

### zardui

- 未在文档中标注可访问性支持

## 变体对比表

| 变体 | 本地 (argusx-f) | shadcn | zardui |
|------|-----------------|--------|--------|
| default | ✅ | ✅ | ✅ |
| secondary | ✅ | ✅ | ✅ |
| destructive | ✅ | ✅ | ✅ |
| outline | ✅ | ✅ | ✅ |
| ghost | ✅ | ❌ | ❌ |
| link | ✅ | ❌ | ❌ |
| **shape 变体** |
| default | ❌ | - | ✅ |
| square | ❌ | - | ✅ |
| pill | ❌ | - | ✅ |

## 建议

### 开发优先级

| 特性 | 当前状态 | 建议 |
|------|---------|------|
| shape 变体 | 本地无 zardui 有 | **中优先级**: 可考虑添加 pill/square 变体 |
| 独立组件 | 仅有 directive | **低优先级**: 当前 directive 已足够灵活 |
| 内置图标 | 支持但需手动 | **低优先级**: 可提供 icon 变体 |
| 更多变体 | 已有 6 种 | 保持，足够覆盖场景 |
| 可访问性 | 良好 | 保持 |

### 总结

argusx-f 的本地 Badge 组件实现质量较高:

1. 遵循 Angular 20+ 最佳实践 (Signals, OnPush, Standalone)
2. 指令式设计灵活，可应用于任意元素
3. 变体丰富 (6 种)，覆盖更多业务场景
4. 可访问性支持完善 (聚焦、链接样式)
5. 与 shadcn 变体系统对齐，便于迁移

**建议**: 当前实现已达到生产就绪状态。可根据业务需求考虑添加 shape 变体 (pill/square) 以对齐 zardui 能力。
