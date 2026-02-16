# Alert 三方对比报告

## 概述

Alert 组件用于向用户显示重要信息。本报告对比 zardui、shadcn 和本地实现的功能、样式、行为和性能。

## 功能矩阵

| 特性 | zardui | shadcn | local | 最优 |
|------|--------|--------|-------|------|
| 基础 Alert | ✓ | ✓ | ✓ | - |
| Title 子组件 | ✓ | ✓ | ✓ | - |
| Description 子组件 | ✓ | ✓ | ✓ | - |
| Action 子组件 | ✗ | ✓ | ✓ | local |
| Icon 支持 | ✓ | ✓ | ✓ | - |
| Variants | 2 | 2 | 5 | local |
| 关闭按钮 | ✗ | ✗ | ✓ | local |
| 模板内容 | ✓ | ✓ | ✗ | zardui |
| Slots 机制 | ✗ | ✓ | ✓ | shadcn |

## 样式差异

### zardui
```ts
// 使用 cva 变体
const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm flex items-center gap-3',
  {
    variants: {
      zType: {
        default: 'bg-card text-card-foreground',
        destructive: 'text-destructive bg-card',
      },
    },
  }
);
```
- 基础布局：`flex items-center gap-3`
- 变体较少，仅支持 default 和 destructive

### shadcn
```tsx
// React + Tailwind
<div className="grid w-full max-w-xl items-start gap-4">
  <Alert>
    <CheckCircle2Icon />
    <AlertTitle>Success!</AlertTitle>
    <AlertDescription>Message here.</AlertDescription>
  </Alert>
</Alert>
```
- 使用 slot 机制实现内容分发
- 变体：default, destructive

### local (argusx)
```ts
const alertVariants = cva(
  "grid gap-0.5 rounded-lg border px-2 py-1.5 text-left text-xs/relaxed...",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "text-destructive bg-card...",
        warning: "text-warning-foreground bg-warning/10...",
        info: "text-info-foreground bg-info/10...",
        success: "text-success-foreground bg-success/10...",
      },
    },
  }
);
```
- 5 种变体：default, destructive, warning, info, success
- 支持 data-slot 属性实现 CSS 选择器
- 支持关闭按钮功能

## 行为对比

### zardui
- 使用 `zStringTemplateOutletDirective` 支持字符串和模板
- 自动根据 `zType` 显示图标
- 不支持内容投影

### shadcn
- 使用 React slot 机制
- 子组件作为独立出口
- 无内置关闭功能

### local
- 使用 Angular 内容投影 (`<ng-content>`)
- 变体更丰富
- 内置 `close` output 事件
- AlertAction 组件支持自定义操作按钮

## 性能评估

| 实现 | Change Detection | 懒加载 | 体积估计 |
|------|-----------------|--------|---------|
| zardui | OnPush | 否 | 中 |
| shadcn | - | 否 | 小 |
| local | OnPush | 否 | 中 |

## 加权评分

Alert 是轻量展示组件，权重：
- Functionality: 1.0
- Styles: 1.0
- Behavior: 1.0
- Performance: 1.0

| 维度 | zardui | shadcn | local |
|------|--------|--------|-------|
| 功能完整性 | 7/10 | 8/10 | 10/10 |
| 样式灵活性 | 6/10 | 7/10 | 10/10 |
| 行为扩展性 | 7/10 | 7/10 | 9/10 |
| 性能优化 | 8/10 | 8/10 | 8/10 |
| **总分** | 28/40 | 30/40 | 37/40 |

## 推荐实现

基于智能加权，**推荐采用 local (argusx)** 的实现方案。

理由：
1. **变体最丰富** - 支持 5 种变体（default, destructive, warning, info, success）
2. **功能最完整** - 内置关闭按钮支持
3. **Slots 机制完善** - 使用 data-slot 属性实现 CSS 选择器
4. **TypeScript 类型安全** - 完整类型定义
5. **Angular 最佳实践** - OnPush + signals + input()/output()

## 可改进点

1. zardui 的模板内容支持值得借鉴（可增强 local 的灵活性）
2. shadcn 的样式组织方式可参考
3. 考虑添加 AlertDialog 组件（shadcn 有独立组件）
