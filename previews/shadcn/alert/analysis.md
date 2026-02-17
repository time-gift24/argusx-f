# alert 组件能力分析

## 功能完整性

### 本地 (argusx-f)
本地实现了一套完整的 Alert 组件系统，包含以下子组件:
- **AlertComponent**: 主组件，支持 5 种变体 (default, destructive, warning, info, success)
- **AlertTitleComponent**: 标题组件
- **AlertDescriptionComponent**: 描述组件
- **AlertActionComponent**: 操作按钮容器组件

变体数量: 5 种 (default, destructive, warning, info, success)

### shadcn
shadcn alert 组件相对简洁:
- **Alert**: 主组件，支持 2 种变体 (default, destructive)
- **AlertTitle**: 标题组件
- **AlertDescription**: 描述组件

变体数量: 2 种 (default, destructive)

### zardui
zardui 提供了较基础的功能:
- **z-alert**: 主组件
- 属性: `[zTitle]`, `[zDescription]`, `[zIcon]`, `[zType]`
- 变体: `default`, `destructive`, `outline`, `soft`, `fill` (基于 demo 推断)

变体数量: 5+ 种

## 性能

### 本地
- 使用 `ChangeDetectionStrategy.OnPush`，变更检测优化良好
- 使用 `computed()` 处理派生样式，避免不必要的计算
- 组件使用 `input()` / `output()` 现代化 API，无运行时开销
- 模板使用 `<ng-content>` 投影，内容直接渲染无额外包装

### shadcn
- React 组件，依赖 React 的细粒度更新机制
- 使用 class-variance-authority (CVA) 管理样式变体

### zardui
- Angular 组件，具体实现未详查
- 基于 demo 来看使用属性绑定方式

## 易用性

### 本地
**优点**:
- 完整的 JSDoc 文档和使用示例
- 支持 `class` 输入允许自定义样式
- 子组件 (AlertTitle, AlertDescription, AlertAction) 可组合使用
- 导出 `alertVariants` 供外部复用
- 提供了 `close` 输出事件

**不足**:
- 未内置关闭按钮，需通过 AlertAction 手动添加
- 无内置 icon 支持，需手动添加 lucide-icon

### shadcn
**优点**:
- API 简洁直观
- 子组件组合使用模式清晰
- 配套 AlertDialog 组件用于重要确认

**不足**:
- 变体较少
- 无内置 close 功能

### zardui
**优点**:
- 支持 `[zIcon]` 传入图标
- 支持 `TemplateRef` 灵活渲染
- 有多种外观变体 (outline, soft, fill)

**不足**:
- API 文档较少
- 缺少 AlertTitle/AlertDescription 独立组件

## API 设计

### 本地
```typescript
// AlertComponent
readonly variant = input<AlertVariant>('default');  // 'default' | 'destructive' | 'warning' | 'info' | 'success'
readonly class = input<string>('');
readonly close = output<void>();

// 子组件
readonly class = input<string>('');
```

**设计特点**:
- 遵循 Angular 20+ 最佳实践，使用 signals API
- CVA 驱动的变体系统，与 shadcn 保持一致
- 通过 `data-slot` 属性支持 CSS 选择器

### shadcn
```tsx
// Alert
variant?: "default" | "destructive"

// AlertTitle, AlertDescription
无 props，仅结构语义
```

**设计特点**:
- 极简 API
- 通过子组件实现内容组织

### zardui
```typescript
[zTitle]: string | TemplateRef<void>
[zDescription]: string | TemplateRef<void>
[zIcon]: string | TemplateRef<void>
[zType]: 'default' | 'destructive'
[zAppearance]?: 'outline' | 'soft' | 'fill' (从 demo 推断)
```

**设计特点**:
- 支持 TemplateRef，灵活度高
- 图标作为属性传入，与内容分离

## 可访问性

### 本地
- `role="alert"` - 正确语义角色
- `aria-live="polite"` - 实时通知辅助技术
- `data-slot` 属性支持 CSS 选择器
- 使用语义化结构 (title/description)

### shadcn
- 使用 `role="alert"` (从本地实现对齐推断)
- 语义化子组件

### zardui
- 未在文档中标注可访问性支持

## 建议

### 开发优先级

| 特性 | 当前状态 | 建议 |
|------|---------|------|
| 更多变体 | 本地已有 5 种 | 保持，可考虑扩展 |
| 内置关闭按钮 | 需手动实现 | **中优先级**: 提供内置或可复用的关闭按钮组件 |
| AlertDialog | shadcn 有，独立组件 | **中优先级**: 如需可单独开发 |
| Icon 支持 | 需手动添加 lucide-icon | **低优先级**: 可参考 zardui 提供内置支持 |
| 动画过渡 | 无 | **低优先级**: 可添加 Enter/Leave 动画 |
| 可访问性 | 良好 | 保持 |

### 总结

argusx-f 的本地 Alert 组件实现质量较高:
1. 遵循 Angular 20+ 最佳实践 (Signals, OnPush, Standalone)
2. API 设计清晰，扩展性好
3. 变体丰富 (5 种)，覆盖更多业务场景
4. 可访问性支持完善
5. 与 shadcn 变体系统对齐，便于迁移

**建议**: 当前实现已达到生产就绪状态，可根据业务需求选择性添加内置关闭按钮或 AlertDialog 组件。
