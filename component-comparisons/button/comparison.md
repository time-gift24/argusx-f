# Button 三方对比报告

## 概述

Button 是最基础的交互组件，本报告对比 zardui、shadcn 和本地实现三种方案的优劣。

## 功能矩阵

| 特性 | zardui | shadcn | local | 最优 |
|------|--------|--------|-------|------|
| **指令式选择器** | ✓ `z-button` | ✗ | ✓ `argus-button` | local |
| **组件式选择器** | ✗ | ✓ `<Button>` | ✓ `<button argus-button>` | shadcn |
| **variant 支持** | ✓ 6 种 | ✓ 6 种 | ✓ 6 种 | 持平 |
| **size 支持** | ✓ 8 种 | ✓ 8 种 | ✓ 8 种 | 持平 |
| **shape 支持** | ✓ 3 种 | ✗ | ✓ 3 种 | local |
| **loading 状态** | ✓ | ✗ | ✓ | local |
| **disabled 转换** | ✓ | ✗ | ✓ | local |
| **invalid 状态** | ✗ | ✗ | ✓ | local |
| **asChild/Slot** | ✗ | ✓ | ✗ | shadcn |
| **CVA 导出** | ✗ | ✓ | ✓ | 持平 |

## 样式差异

### zardui
- 使用独立前缀 `z-button-*`
- 高度使用 h-6/h-7/h-8/h-9 映射 xs/sm/default/lg
- icon 使用 size-* 类

### shadcn
- 使用 `cn-button-*` 前缀
- CVA 完整导出供外部使用
- 支持 `data-slot`, `data-variant`, `data-size` 属性
- 使用 Slot 组件实现 asChild 模式

### local (argusx)
- 使用 `buttonVariants` CVA 导出
- 支持 shape 变体 (default/circle/square)
- 支持 loading 状态动画
- 支持 invalid/disabled/aria 属性
- 指令与组件双模式选择器

## 行为对比

| 特性 | zardui | shadcn | local |
|------|--------|--------|-------|
| 键盘支持 | 原生 | 原生 | 原生 |
| ARIA 属性 | 基础 | data-* 属性 | 完整 (invalid, disabled, busy) |
| 焦点样式 | focus-visible | focus-visible | focus-visible |
| 禁用处理 | zDisabled | disabled | disabled + aria-disabled |

## 性能评估

| 特性 | zardui | shadcn | local |
|------|--------|--------|-------|
| 变更检测 | OnPush | React 默认 | OnPush ✓ |
| Signal 使用 | ✓ | N/A | ✓ |
| 懒加载 | 组件独立 | 组件独立 | 指令+组件 |

## 推荐实现

基于智能分析，**推荐采用 local (argusx) 实现方案**：

### 优势
1. **完整 ARIA 支持** - 提供 invalid/disabled/aria-busy 状态
2. **shape 变体** - 支持 circle/square 形状
3. **loading 状态** - 内置加载动画支持
4. **双模式** - 指令式 (`argusButton`) 和组件式 (`argus-button`)
5. **类型安全** - 完整的 ButtonVariant/ButtonSize/ButtonShape 类型导出
6. **OnPush 策略** - 最佳性能

### 待改进
- 考虑添加 asChild/Slot 模式（参考 shadcn）
- 考虑导出 buttonVariants 供消费者直接使用

## 总结

| 评分项 | zardui | shadcn | local |
|--------|--------|--------|-------|
| 功能完整性 | 7/10 | 8/10 | **9/10** |
| 样式覆盖 | 8/10 | **9/10** | **9/10** |
| 行为支持 | 7/10 | 7/10 | **9/10** |
| 性能 | 8/10 | 8/10 | **9/10** |
| **总分** | 30/40 | 32/40 | **36/40** |

**local 胜出** - 在保持与 shadcn 样式一致性的同时，提供了更完整的 ARIA 状态管理和 Angular 生态最佳实践。
