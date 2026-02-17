# chart 组件能力分析

## 功能完整性

### 本地 (argusx-f)
本地实现了一套完整的 Chart 组件系统，基于 ApexCharts 库，包含以下子组件:
- **ChartContainerComponent**: 主图表容器组件
- **ChartTooltipComponent**: 自定义提示框组件
- **ChartLegendComponent**: 自定义图例组件

支持特性:
- **图表类型**: line, area, bar, pie, donut, radialBar, scatter, bubble, heatmap, treemap, rangeBar
- **主题支持**: 亮色/暗色主题自动切换，使用 CSS 变量
- **图例**: 支持 top/bottom/left/right 四个位置
- **提示框**: 支持 dot/line/dashed 三种指示器样式
- **动画**: 支持启用/禁用动画效果
- **标题/副标题**: 支持图表标题和副标题
- **响应式**: 768px 断点自动调整图例位置

### shadcn
shadcn chart 组件:
- 位于 registry:ui
- 基于 recharts 库 (v2.15.4)
- 依赖 lucide-react 图标库
- 提供折线图、面积图、柱状图、饼图等常见图表类型

### zardui
zardui 目录不存在，无法分析。

## 性能

### 本地
- 使用 `ChangeDetectionStrategy.OnPush`，变更检测优化良好
- 使用 `computed()` 处理派生样式和主题变量，避免不必要的计算
- 组件使用 `input()` 现代化 API，无运行时开销
- 动态导入 ApexCharts (`await import('apexcharts')`)，实现代码分割
- 使用 `MutationObserver` 监听主题变化，实时更新图表
- `effect()` 中处理输入变化，自动销毁重建图表实例
- 正确实现 `OnDestroy` 生命周期，防止内存泄漏

**不足**:
- 每次输入变化都销毁并重建图表（`updateChart` 方法），而非增量更新
- `effect()` 中未清理 MutationObserver，可能导致内存泄漏

### shadcn
- React 组件，依赖 React 的细粒度更新机制
- 基于 recharts，图表渲染性能经过优化
- Tree Shaking 友好

### zardui
无法分析（目录不存在）

## 易用性

### 本地
**优点**:
- 完整的 JSDoc 文档和使用示例
- 支持 `class` 输入允许自定义样式
- 子组件可组合使用（Tooltip、Legend）
- 主题自动切换，开箱即用
- 支持自定义 ApexCharts 选项扩展
- 使用 Tailwind CSS 类，样式统一

**不足**:
- 无内置数据处理功能，需要自行准备数据格式
- 无交互事件完整支持（只有 chartReady 和 chartClick）
- 无缩放/导出等高级功能（默认禁用 toolbar）

### shadcn
**优点**:
- 与官方 shadcn/ui 风格一致
- recharts 生态系统成熟，文档丰富
- 组件化程度高，易于组合

**不足**:
- React 专有，不适用于 Angular 项目

### zardui
无法分析

## API 设计

### 本地
```typescript
// ChartContainerComponent
readonly config = input.required<ChartConfig>();        // 颜色配置
readonly series = input<ChartSeries[]>([]);            // 数据系列
readonly type = input<ChartType>('line');               // 图表类型
readonly options = input<Partial<ChartOptions>>({});   // ApexCharts 选项
readonly title = input<string>('');                    // 标题
readonly subtitle = input<string>('');                 // 副标题
readonly categories = input<(string | number)[]>([]); // X轴分类
readonly ariaLabelInput = input<string>('Chart');      // 无障碍标签
readonly showLegend = input<boolean>(true);            // 显示图例
readonly legendPosition = input<ChartLegendPosition>('bottom'); // 图例位置
readonly showTooltip = input<boolean>(true);           // 显示提示框
readonly tooltipIndicator = input<ChartTooltipIndicator>('dot'); // 提示框指示器
readonly animated = input<boolean>(true);              // 动画
readonly height = input<string | number>('auto');      // 高度
readonly width = input<string | number>('100%');       // 宽度
readonly class = input<string>('');                    // 自定义类名

// 输出
readonly chartReady = output<void>();
readonly chartClick = output<unknown>();
```

**设计特点**:
- 遵循 Angular 20+ 最佳实践，使用 Signals API
- 通过 `data-chart` 属性支持 CSS 选择器
- 类型定义完整，覆盖所有 ApexCharts 类型
- 使用 `cn()` 工具合并类名

### shadcn
```tsx
// 基于 recharts 的组件化 API
// 常见组件: LineChart, AreaChart, BarChart, PieChart, etc.
// 属性: data, xKey, yKey, categoryKey, colors, etc.
```

**设计特点**:
- 数据驱动设计
- 组件化程度高

### zardui
无法分析

## 可访问性

### 本地
- `role="img"` - 正确的语义角色
- `data-chart` - 图表标识
- `data-slot="chart"` - 插槽支持
- `aria-label` - 可自定义的无障碍标签
- 使用 CSS 变量确保颜色对比度符合要求

### shadcn
- 使用 `role="img"` (从 recharts 推断)
- 支持自定义 aria-label

### zardui
无法分析

## 建议

### 开发优先级

| 特性 | 当前状态 | 建议 |
|------|---------|------|
| 图表类型支持 | 本地已有 (11种) | 保持 |
| 主题切换 | 本地已有 | 保持 |
| 提示框 | 本地已有 | 保持 |
| 图例 | 本地已有 | 保持 |
| 数据增量更新 | 无 | **中优先级**: 改为增量更新而非重建 |
| 交互事件 | 部分支持 | **中优先级**: 增加更多事件支持 |
| 缩放功能 | 默认禁用 | **低优先级**: 可通过 options 启用 |
| 导出功能 | 无 | **低优先级**: 可通过 options 启用 |
| 清理 MutationObserver | 无 | **高优先级**: 修复内存泄漏 |
| 可访问性 | 良好 | 保持 |

### 总结

argusx-f 的本地 Chart 组件实现质量较高:
1. 遵循 Angular 20+ 最佳实践 (Signals, OnPush, Standalone)
2. API 设计清晰，类型完整
3. 支持 11 种图表类型，覆盖大多数业务场景
4. 主题自动切换，使用 CSS 变量
5. 动态导入 ApexCharts，实现代码分割

当前实现已达到生产就绪状态，建议优先修复:
- **MutationObserver 内存泄漏问题** - 在 effect 中创建但未清理
- **图表增量更新** - 目前每次输入变化都重建图表，性能可优化

可选增强:
- 添加更多交互事件支持
- 提供数据处理工具函数
- 添加图表导出功能
