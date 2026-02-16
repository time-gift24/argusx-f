# Input 三方对比报告

## 概述

Input 是最基础的表单组件，本报告对比 zardui、shadcn 和本地实现三种方案的优劣。

**注意**: shadcn Input 不使用 Radix  primitives，它是一个纯样式包装的 HTML input 元素。

## 功能矩阵

| 特性 | zardui | shadcn | local | 最优 |
|------|--------|--------|-------|------|
| **指令式选择器** | ✗ | ✗ | ✓ `appInput` | local |
| **组件式选择器** | ✓ `<z-input>` | ✓ `<Input>` | ✗ | 持平 |
| **variant 支持** | ✓ 2 种 | ✗ | ✓ 2 种 | 持平 |
| **size 支持** | ✓ 3 种 | ✗ | ✗ | zardui |
| **status 支持** | ✓ (error) | ✗ | ✓ 4 种 | local |
| **borderless 模式** | ✗ | ✗ | ✓ | local |
| **双向绑定** | ✓ | ✓ (React) | ✓ (model) | 持平 |
| **CVA 导出** | ✓ | ✗ | ✓ | 持平 |
| **type 属性透传** | ✓ | ✓ | ✓ | 持平 |

## 样式差异

### zardui
- 使用 `z-input-*` 前缀
- 基于 `z-` 系统的主题变量 (z-primary, z-input, z-muted-foreground)
- 支持 variant (default, error)
- 支持 size (sm/default/lg)
- 组件式: `<z-input>`

### shadcn
- 使用 `cn-input-*` 前缀 (样式映射层)
- 纯样式，无状态变体
- 依赖 CSS 变量系统
- 组件式: `<Input>`

### local (argusx)
- 使用 `inputVariants` CVA
- 支持 4 种 status: default/error/warning/success
- 支持 borderless 模式 (无边框透明输入)
- 使用 `bg-input/20` 等主题透明度
- 支持 `aria-invalid` 状态
- 支持 `data-slot` 和 `data-status` 属性
- 指令式: `<input appInput>`

## 行为对比

| 特性 | zardui | shadcn | local |
|------|--------|--------|-------|
| 键盘支持 | 原生 | 原生 | 原生 |
| ARIA 属性 | 基础 | 基础 | 完整 (invalid, status) |
| 焦点样式 | z-primary ring | ring | ring + 自定义 |
| 禁用处理 | disabled | disabled | disabled + pointer-events |
| 数据绑定 | 双向 | 双向 | model() |

## 性能评估

| 特性 | zardui | shadcn | local |
|------|--------|--------|-------|
| 变更检测 | OnPush | React 默认 | OnPush ✓ |
| Signal 使用 | ✓ | N/A | ✓ |
| 指令开销 | 组件 | 组件 | 指令 (更轻量) |

## 推荐实现

基于智能分析，**推荐采用 local (argusx) 实现方案**：

### 优势
1. **status 状态管理** - 支持 default/error/warning/success 四种状态
2. **borderless 模式** - 适用于组合式输入组件
3. **完整 ARIA** - 提供 invalid 状态自动处理
4. **data 属性** - 支持 data-slot 和 data-status
5. **OnPush 策略** - 最佳性能
6. **CVA 导出** - 供消费者自定义

### 待改进
- 考虑添加组件式选择器 (参考 shadcn `<Input>`)
- 考虑添加 size 变体支持

## 总结

| 评分项 | zardui | shadcn | local |
|--------|--------|--------|-------|
| 功能完整性 | 7/10 | 5/10 | **8/10** |
| 样式覆盖 | 8/10 | 7/10 | **8/10** |
| 行为支持 | 7/10 | 6/10 | **8/10** |
| 性能 | 8/10 | 8/10 | **9/10** |
| **总分** | 30/40 | 26/40 | **33/40** |

**local 胜出** - 在保持简洁的同时，提供了更完整的状态管理和 Angular 生态最佳实践。

### zardui 补充说明

基于 zardui.com 官网信息：
- Input 是 zardui 的核心组件之一
- 描述为: "Form input fields with validation and accessibility support"
- 采用组件式 `<z-input>` 选择器
- 使用 CVA 进行样式变体管理
- 支持 size 变体 (sm/default/lg) - 比本地多
- 支持 error 变体用于验证状态

## 使用示例

```html
<!-- 基础用法 -->
<input appInput type="text" placeholder="Enter text" />

<!-- 带状态 -->
<input appInput type="text" status="error" placeholder="Error state" />

<!-- 双向绑定 -->
<input appInput type="text" [(value)]="formControl" />

<!-- 无边框模式 -->
<input appInput type="text" borderless [(value)]="value" />
```

## Preview

预览组件已存在于: `src/app/preview/input-preview.component.ts`

## Sources

- [shadcn Input](https://ui.shadcn.com/docs/components/radix/input)
- [local InputDirective](https://github.com/wanyaozhong/argusx-f/blob/main/src/app/shared/ui/input/input.directive.ts)
- [zardui Input](./sources/zardui.md) (基于 zardui.com 官网)
- [zardui 官网](https://zardui.com/components)
