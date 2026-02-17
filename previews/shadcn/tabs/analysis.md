# tabs 组件能力分析

## 功能完整性

### 本地 (argusx-f)
本地实现了一套完整的 Tabs 组件系统，包含以下子组件:
- **TabsComponent**: 主容器组件，支持水平/垂直方向
- **TabsListComponent**: Tab 列表容器，支持 2 种变体 (default, line)
- **TabsTriggerComponent**: Tab 触发器，支持键盘导航
- **TabsContentComponent**: Tab 内容面板，支持条件渲染

变体数量: 2 种 (default, line)
方向支持: 2 种 (horizontal, vertical)

### shadcn
shadcn tabs 组件基于 Radix UI:
- **Tabs**: 主组件
- **TabsList**: Tab 列表
- **TabsTrigger**: Tab 触发器
- **TabsContent**: Tab 内容

变体数量: 默认 1 种 (通过 class 扩展)
方向支持: 通过 CSS 实现 horizontal/vertical

### zardui
zardui 提供了功能丰富的 Tab 实现:
- **z-tab-group**: Tab 组容器
- **z-tab**: Tab 项目
- 属性:
  - `[zPosition]`: tabs 位置 (top, bottom, left, right)
  - `[zActivePosition]`: 激活指示器位置
  - `[zShowArrow]`: 是否显示滚动箭头
  - `[zAlignTabs]`: 对齐方式 (start, center, end)
  - `(zTabChange)`: 切换事件

变体数量: 通过属性组合实现多种效果

## 性能

### 本地
- 使用 `ChangeDetectionStrategy.OnPush`，变更检测优化良好
- 使用 `computed()` 处理派生状态和样式，避免不必要的计算
- 组件使用 `input()` / `output()` / `model()` 现代化 Signals API
- 模板使用原生控制流 `@if` 条件渲染内容面板
- 使用 `TabsRootToken` 依赖注入实现组件间通信，避免耦合
- 使用 `afterNextRender` 确保初始 tab 自动选中

### shadcn
- React 组件，依赖 React 的细粒度更新机制
- 使用 class-variance-authority (CVA) 管理样式变体
- 基于 Radix UI 实现原生的可访问性支持

### zardui
- Angular 组件，具体实现未详查
- 基于 demo 来看使用属性绑定方式
- 支持滚动箭头处理溢出场景

## 易用性

### 本地
**优点**:
- 完整的 JSDoc 文档和使用示例
- 支持 `class` 输入允许自定义样式
- 子组件组合使用模式清晰
- 导出 `tabsListVariants` 供外部复用
- 支持双向绑定 `[(value)]`
- 自动选中第一个非禁用 tab

**不足**:
- 无内置滚动箭头处理溢出
- Tab 标签仅支持投影内容，无 `label` 属性
- 无动画过渡效果

### shadcn
**优点**:
- API 简洁直观
- 子组件组合使用模式清晰
- 与 Radix UI 深度集成，可访问性优秀

**不足**:
- 变体较少
- 需要自行处理样式扩展

### zardui
**优点**:
- 支持 4 个方向的 tabs 布局
- 支持激活指示器独立定位
- 支持滚动箭头处理溢出
- 支持 tabs 对齐方式
- 有完善的事件回调

**不足**:
- API 相对复杂
- 缺少独立的内容组件

## API 设计

### 本地
```typescript
// TabsComponent
readonly value = model<string>('');  // 双向绑定
readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
readonly disabled = input<boolean>(false);
readonly class = input<string>('');
readonly valueChange = output<string>();

// TabsListComponent
readonly variant = input<TabsListVariant>('default');  // 'default' | 'line'
readonly class = input<string>('');

// TabsTriggerComponent
readonly value = input.required<string>();
readonly disabled = input<boolean>(false);
readonly class = input<string>('');

// TabsContentComponent
readonly value = input.required<string>();
readonly class = input<string>('');
```

**设计特点**:
- 遵循 Angular 20+ 最佳实践，使用 Signals API
- CVA 驱动的变体系统，与 shadcn 保持一致
- 通过 `data-slot` 属性支持 CSS 选择器
- 使用 `TabsRootToken` 抽象实现依赖注入
- 完整的 ARIA 属性支持

### shadcn
```tsx
// Tabs
defaultValue?: string
orientation?: "horizontal" | "vertical"
dir?: "ltr" | "rtl"
activationMode?: "automatic" | "manual"

// TabsList, TabsTrigger, TabsContent
无 props，仅结构语义
```

**设计特点**:
- 极简 API
- 通过子组件实现内容组织

### zardui
```typescript
// z-tab-group
[zPosition]: 'top' | 'bottom' | 'left' | 'right'
[zActivePosition]: 'top' | 'bottom' | 'left' | 'right'
[zShowArrow]: boolean
[zScrollAmount]: number
[zAlignTabs]: 'start' | 'center' | 'end'
(zTabChange): EventEmitter
(zDeselect): EventEmitter

// z-tab
[label]: string | TemplateRef<void>
```

**设计特点**:
- 支持 TemplateRef，灵活度高
- 标签作为属性传入，简化使用
- 事件驱动 API

## 可访问性

### 本地
- `role="tablist"` - 正确的列表角色
- `role="tab"` - 正确的标签角色
- `role="tabpanel"` - 正确的内容面板角色
- `aria-orientation` - 方向属性
- `aria-selected` - 选中状态
- `aria-controls` - 控制关系
- `aria-labelledby` - 标签关联
- `tabindex` 管理焦点
- 完整的键盘导航支持 (Arrow keys, Home, End)
- `data-state` 属性支持视觉样式
- `data-disabled` 属性支持禁用状态
- `data-slot` 属性支持 CSS 选择器

### shadcn
- 使用 Radix UI Tabs，原生 ARIA 支持
- 完整的键盘导航

### zardui
- 未在文档中标注可访问性支持详情
- 从组件结构推断应有基本支持

## 建议

### 开发优先级

| 特性 | 当前状态 | 建议 |
|------|---------|------|
| 滚动箭头 | 无 | **中优先级**: 借鉴 zardui 实现溢出处理 |
| 更多变体 | 2 种 | **低优先级**: 可考虑增加 pill 样式 |
| 方向支持 | 已有 | 保持 |
| 动画过渡 | 无 | **低优先级**: 可添加 content 切换动画 |
| 手动激活模式 | 无 | **低优先级**: 如需要可添加 `activationMode` |
| 可访问性 | 优秀 | 保持 |

### 总结

argusx-f 的本地 Tabs 组件实现质量较高:
1. 遵循 Angular 20+ 最佳实践 (Signals, OnPush, Standalone)
2. API 设计清晰，扩展性好
3. 支持 2 种变体和 2 种方向，覆盖常见场景
4. 可访问性支持完善，完整的 ARIA 和键盘导航
5. 与 shadcn 变体系统对齐，便于迁移

**建议**: 当前实现已达到生产就绪状态，可根据业务需求选择性添加滚动箭头处理、动画过渡等特性。
