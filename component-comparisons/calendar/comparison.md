# Calendar 三方对比报告

## 概述

Calendar 是一个日期选择器组件，属于 **Data Heavy** 组件类型，需要重点关注数据处理和性能。

## 功能矩阵

| 特性 | zardui | shadcn | local | 最优 |
|------|--------|--------|-------|------|
| 单日期选择 | ✓ | ✓ | ✓ | - |
| 日期范围选择 | ✓ | ✓ | ✗ | zardui |
| 多日期选择 | ✓ | ✓ | ✗ | zardui |
| 月/年导航 | ✓ | ✓ | 部分 | zardui |
| 最小/最大日期限制 | ✓ | ✓ | ✓ | - |
| 禁用日期 | ✓ | ✓ | ✓ | - |
| 月份下拉选择 | ✓ | ✓ | ✗ | shadcn |
| 年份下拉选择 | ✓ | ✓ | ✗ | shadcn |
| 周数显示 | ✓ | ✓ | ✗ | zardui |
| 自定义单元格大小 | ✓ | ✓ | ✗ | shadcn |
| ControlValueAccessor | ✓ | N/A | ✗ | zardui |
| 国际化支持 | ✓ | ✓ | ✗ | shadcn |
| 日期格式化定制 | ✓ | ✓ | ✗ | shadcn |

## 样式差异

### zardui
- 使用 `calendarVariants` 和 `calendarDayButtonVariants` 管理样式
- Tailwind 工具类与 CSS 变量结合
- 支持 `calendarWeekdayVariants`  weekday 样式
- 使用 `mergeClasses` 合并类名
- 组件样式通过 `ViewEncapsulation.None` 全局化

### shadcn
- 基于 `react-day-picker` 库
- 使用 CSS 变量 `--cell-size` 控制单元格大小
- 丰富的 Tailwind 样式覆盖 (data-* 属性选择器)
- 支持 RTL (从右到左) 布局
- 使用 `getDefaultClassNames()` 获取默认样式

### local
- 基础 Tailwind 工具类
- 简单的 computed class 合并
- 缺少下拉选择和范围选择样式

## 行为对比

### zardui ⭐
- 完整的键盘导航支持 (Arrow keys, Home, End, PageUp, PageDown, Enter, Space)
- 月份边界智能处理 (跨月导航时保持列位置)
- 焦点管理 (setFocusedDayIndex, resetFocus)
- ControlValueAccessor 支持表单集成
- linkedSignal 管理导航状态
- outputFromObservable 输出日期变化

### shadcn
- 基于 react-day-picker 的完整键盘支持
- Focus management 内置
- RTL 支持
- 丰富的 modifier 状态 (selected, range_start, range_end, range_middle, today, outside, disabled)

### local
- 基础点击行为
- 无键盘导航
- 无焦点管理
- selectDate 方法只打印日志，未实现输出

## 性能评估

### zardui ⭐
- OnPush 变更检测
- linkedSignal 优化信号更新
- computed 派生状态
- 网格组件分离 (ZardCalendarGridComponent)
- 导航组件分离 (ZardCalendarNavigationComponent)

### shadcn
- React memo 优化
- 按需渲染

### local
- OnPush 变更检测 ✓
- computed 派生状态 ✓
- 无分离组件

## 评分 (Data Heavy ×1.5)

| 维度 | 权重 | zardui | shadcn | local |
|------|------|--------|--------|-------|
| Functionality | 1.0 | 9 | 8 | 5 |
| Styles | 1.0 | 8 | 9 | 5 |
| Behavior | 1.5 | 9 | 8 | 3 |
| Performance | 1.5 | 9 | 7 | 6 |
| **加权总分** | - | **26** | **23.5** | **13** |

## 推荐实现

基于智能加权，**采用 zardui 的实现方案**：

1. **架构**: 分离 CalendarGridComponent 和 CalendarNavigationComponent
2. **状态管理**: 使用 linkedSignal + computed
3. **表单集成**: 实现 ControlValueAccessor
4. **键盘导航**: 完整的方向键 + Home/End/PageUp/PageDown 支持
5. **输出**: 使用 outputFromObservable
6. **样式**: 使用 variants 模式管理

### 本地实现改进建议

1. 添加 CalendarMode 类型 (single, multiple, range)
2. 实现 model<Date[]> 支持多日期和范围选择
3. 分离 CalendarGridComponent 和 CalendarNavigationComponent
4. 实现完整的键盘导航
5. 实现 ControlValueAccessor
6. 添加 outputFromObservable 日期变化输出
7. 使用 linkedSignal 优化状态管理

## 参考资源

- zardui: `libs/zard/src/lib/shared/components/calendar/`
- shadcn: `react-day-picker` v9
- local: `src/app/shared/ui/calendar/`
