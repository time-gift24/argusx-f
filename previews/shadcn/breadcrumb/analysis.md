# breadcrumb 组件能力分析

## 功能完整性

### 本地 (argusx-f)
本地实现了一套完整的 Breadcrumb 组件系统，包含以下子组件:
- **BreadcrumbComponent**: 主容器组件，支持 `class` 输入
- **BreadcrumbListComponent**: 有序列表容器，默认包含样式 (gap, text-muted-foreground 等)
- **BreadcrumbItemComponent**: 列表项容器，支持自定义 class
- **BreadcrumbLinkComponent**: 可点击导航链接，支持 `href` 输入和 RouterLink
- **BreadcrumbPageComponent**: 当前页面指示器 (非可点击)，带有 aria 属性
- **BreadcrumbSeparatorComponent**: 分隔符组件，默认显示 chevron-right 图标，支持自定义内容
- **BreadcrumbEllipsisComponent**: 省略号折叠组件，用于场景

变体/模式: 无视觉变体，但有 7 个子组件支持灵活组合

### shadcn
shadcn breadcrumb 组件:
- **Breadcrumb**: 主容器
- **BreadcrumbList**: 列表容器
- **BreadcrumbItem**: 列表项
- **BreadcrumbLink**: 链接
- **BreadcrumbPage**: 当前页
- **BreadcrumbSeparator**: 分隔符
- **BreadcrumbEllipsis**: 省略号

变体数量: 7 个子组件 (与本地一致)
依赖: radix-ui

### zardui
zardui 提供了以下功能:
- **z-breadcrumb**: 主组件
  - 属性: `[zSize]` (sm | md | lg), `[zAlign]` (start | center | end), `[zWrap]` (wrap | nowrap), `[zSeparator]` (string | TemplateRef)
- **z-breadcrumb-item**: 列表项，支持 RouterLink
- **z-breadcrumb-ellipsis**: 省略号，支持 `[zColor]` (muted | strong)

变体数量: 3 种尺寸 + 对齐方式 + 换行模式

## 性能

### 本地
- 使用 `ChangeDetectionStrategy.OnPush`，变更检测优化良好
- 使用 `computed()` 处理派生样式，避免不必要的计算
- 组件使用 `input()` / `output()` 现代化 API
- 模板使用 `<ng-content>` 投影，无额外包装
- BreadcrumbSeparatorComponent 使用 `@if` 条件渲染，Tree-shakable

### shadcn
- React 组件，依赖 React 的细粒度更新机制
- 使用 class-variance-authority (CVA) 管理样式变体

### zardui
- Angular 组件
- 使用属性绑定方式 (`[zSize]`, `[zAlign]`, `[zWrap]`)

## 易用性

### 本地
**优点**:
- 完整的 JSDoc 文档和使用示例
- 支持 `class` 输入允许自定义样式
- 7 个子组件可灵活组合
- BreadcrumbSeparator 支持自定义内容 (通过 `customContent` 输入)
- 可访问性支持完善 (aria-label, role, aria-current, aria-disabled)
- 导出 `BreadcrumbComponents` 数组方便批量导入

**不足**:
- 无内置尺寸控制，需手动通过 class 设置
- 无内置对齐/换行控制
- 无内置省略号交互 (仅展示省略号图标，需手动配合菜单实现展开)

### shadcn
**优点**:
- API 简洁直观
- 子组件组合使用模式清晰
- 与 radix-ui 集成

**不足**:
- 无视觉变体
- 无尺寸/对齐/换行控制

### zardui
**优点**:
- 支持 `[zSize]`, `[zAlign]`, `[zWrap]` 控制布局
- 支持 `[zSeparator]` 传入 TemplateRef 自定义分隔符
- 省略号支持与 Menu 组件集成 (z-menu)
- 支持 `[zColor]` 控制省略号颜色

**不足**:
- API 文档较少
- 省略号交互依赖 Menu 组件，使用复杂度较高

## API 设计

### 本地
```typescript
// BreadcrumbComponent
readonly class = input<string>('');

// BreadcrumbListComponent
readonly class = input<string>('');

// BreadcrumbItemComponent
readonly class = input<string>('');

// BreadcrumbLinkComponent
readonly class = input<string>('');
readonly href = input<string>('');

// BreadcrumbPageComponent
readonly class = input<string>('');

// BreadcrumbSeparatorComponent
readonly class = input<string>('');
readonly customContent = input<boolean>(false);

// BreadcrumbEllipsisComponent
readonly class = input<string>('');
```

**设计特点**:
- 遵循 Angular 20+ 最佳实践，使用 signals API
- 通过 `data-slot` 属性支持 CSS 选择器，与 shadcn 对齐
- 简洁的投影内容模式，无复杂属性

### shadcn
```tsx
// 所有组件无 props，仅结构语义
// BreadcrumbLink 支持 href 和 child content
// BreadcrumbSeparator 支持 children 自定义
// BreadcrumbEllipsis 仅展示
```

**设计特点**:
- 极简 API
- 通过子组件实现内容组织

### zardui
```typescript
// z-breadcrumb
[zSize]: 'sm' | 'md' | 'lg'
[zAlign]: 'start' | 'center' | 'end'
[zWrap]: 'wrap' | 'nowrap'
[zSeparator]: string | TemplateRef

// z-breadcrumb-item
routerLink (通过 host directives)

// z-breadcrumb-ellipsis
[zColor]: 'muted' | 'strong'
z-menu (指令集成)
```

**设计特点**:
- 支持 TemplateRef，灵活度高
- 内置布局控制属性

## 可访问性

### 本地
- `aria-label="breadcrumb"` - 正确语义标注
- `role="presentation"` - Separator 和 Ellipsis 使用
- `aria-current="page"` - BreadcrumbPage 指示当前页
- `aria-disabled="true"` - BreadcrumbPage 标记为不可交互
- `aria-hidden="true"` - 装饰性元素隐藏
- `data-slot` 属性支持 CSS 选择器

### shadcn
- 使用语义化结构
- aria 属性 (从本地实现对齐推断)

### zardui
- 未在文档中标注可访问性支持

## 建议

### 开发优先级

| 特性 | 当前状态 | 建议 |
|------|---------|------|
| 布局控制 | 无内置 | **中优先级**: 参考 zardui 添加 zSize/zAlign/zWrap |
| 省略号交互 | 仅展示图标 | **中优先级**: 提供可交互的省略号组件或文档示例 |
| 分隔符模板 | 支持自定义 | 保持现状 |
| 可访问性 | 良好 | 保持 |
| RouterLink 集成 | 支持 (通过原生 href) | 保持，Angular 项目推荐使用 RouterLink |

### 总结

argusx-f 的本地 Breadcrumb 组件实现质量较高:
1. 遵循 Angular 20+ 最佳实践 (Signals, OnPush, Standalone)
2. API 设计清晰，7 个子组件职责明确
3. 可访问性支持完善
4. 与 shadcn 结构完全对齐，便于迁移

**建议**: 当前实现已达到生产就绪状态，可根据业务需求选择性添加:
- 布局控制属性 (尺寸/对齐/换行)
- 可交互省略号组件或与 Menu 集成的文档示例
