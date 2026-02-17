# Alert Dialog 三方对比报告

## 组件概述
Alert Dialog 用于向用户显示重要信息并要求用户做出响应。它会中断用户的当前操作。

## 来源
- **shadcn**: React + Radix UI
- **zardui**: Angular CDK + Portal
- **local (argusx)**: Angular CDK + Overlay

## 功能矩阵

| 特性 | shadcn (Radix) | zardui | local (argusx) | 最优 |
|------|-----------------|--------|-----------------|------|
| 基础打开/关闭 | ✓ | ✓ (Service API) | ✓ (model) | local |
| Trigger 触发器 | ✓ | ✓ | ✓ (Directive) | - |
| 自定义内容 | ✓ | ✓ | ✓ (Content Projection) | - |
| Title/Description | ✓ | ✓ | ✓ (独立组件) | - |
| Header/Footer | ✓ | ✗ | ✓ (独立组件) | local |
| Action/Cancel 按钮 | ✓ | ✓ | ✓ (独立组件) | - |
| Size 变体 | ✗ | ✗ | ✓ (default/sm) | local |
| Destructive 样式 | ✓ | ✓ | ✓ | - |
| 动画效果 | ✓ | ✓ (CSS animations) | ✓ (data-state) | - |
| 点击遮罩关闭 | ✗ | ✗ | ✗ | 一致 |
| ESC 关闭 | ✓ | ✓ | ✓ | 一致 |
| 服务化调用 (confirm/warning/info) | ✗ | ✓ | ✗ | zardui |
| Signal 状态管理 | ✗ | ✗ | ✓ | local |

## 样式差异

### shadcn (Radix React)
```tsx
<AlertDialogContent className="... fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 ...">
```

### zardui (Angular)
```typescript
const alertDialogVariants = cva(
  'fixed z-50 w-full max-w-[calc(100%-2rem)] border bg-background shadow-lg rounded-lg sm:max-w-lg',
);
```
- 使用 CSS transitions 和 `@starting-style` 实现动画
- 使用 CDK Portal 进行内容挂载

### local (argusx Angular)
```typescript
const alertDialogContentVariants = cva(
  'bg-background ring-foreground/10 gap-3 rounded-xl p-4 ring-1 duration-100 outline-none',
  {
    variants: {
      size: {
        default: 'max-w-xs sm:max-w-sm w-full',
        sm: 'max-w-64 w-full',
      },
    },
  }
);
```
- 使用 Angular CDK ConnectedOverlay
- 支持 size 变体
- 使用 data-state 驱动动画

## 行为对比

| 行为 | shadcn | zardui | local | 评估 |
|------|--------|--------|-------|------|
| 焦点陷阱 | Radix 自动 | CDK cdkTrapFocus | CDK cdkTrapFocus | ✓ 一致 |
| ESC 关闭 | ✓ | ✓ | ✓ | ✓ 一致 |
| 遮罩点击关闭 | ✗ | ✗ | ✗ | ✓ 一致 |
| 动画 | CSS classes | CSS transitions | data-state + animate-in/out | - |

## 性能评估

| 方面 | shadcn | zardui | local |
|------|--------|--------|-------|
| 变更检测 | React | Angular OnPush | Angular OnPush |
| 渲染方式 | Radix Portal | CDK Portal | CDK ConnectedOverlay |
| 包体积 | 较大 (Radix) | 中等 | 较小 |
| SSR 支持 | React SSR | Angular SSR | Angular SSR |

## API 对比

### shadcn Props
```tsx
<AlertDialog>
  <AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
      <AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>
      <AlertDialogAction>
```

### zardui Service API
```typescript
// 服务化调用
alertDialog.confirm({
  zTitle: 'Confirm',
  zDescription: 'Are you sure?',
  zOkText: 'Confirm',
  zCancelText: 'Cancel',
  zOnOk: () => { /* handle ok */ },
  zOnCancel: () => { /* handle cancel */ },
});

alertDialog.warning({
  zTitle: 'Warning',
  zOkText: 'OK',
});

alertDialog.info({
  zTitle: 'Info',
  zOkText: 'OK',
});
```

### local Props
```html
<app-alert-dialog [open]="..." [size]="'default'|'sm'">
  <app-alert-dialog-content [size]>
    <app-alert-dialog-header>
      <app-alert-dialog-title>
      <app-alert-dialog-description>
    <app-alert-dialog-footer>
      <app-alert-dialog-cancel>
      <app-alert-dialog-action [variant]>
```

## 推荐实现

**采用 local 实现方案**，理由：

1. ✅ **Signal-based 状态管理** - 使用 `model()` 双向绑定，符合 Angular 20+ 最佳实践
2. ✅ **完整组件结构** - Header/Footer/Media 都是独立组件，易于使用
3. ✅ **支持 size 变体** - default/sm 两种尺寸，比 shadcn 更灵活
4. ✅ **丰富的按钮样式** - variant/size 可配置
5. ✅ **完整的 ARIA 支持** - role="alertdialog", aria-modal, aria-labelledby, aria-describedby
6. ✅ **Angular CDK Overlay** - 稳定性好，与 Angular 生态深度集成

### zardui 亮点（可借鉴）
- **服务化调用** - `confirm()`, `warning()`, `info()` 方法适合快速调用场景
- 可考虑在 local 中添加服务化包装器

## 待改进项

1. **服务化调用** - 添加 ZardAlertDialogService 风格的快速调用方法
2. **更多 size 变体** - lg/xl 可选
3. **portal 配置** - 允许自定义 portal 容器

## 结论

local (argusx) 实现已经非常完善，功能覆盖 shadcn 全部特性，并有自己的增强（size 变体、Signal 状态）。无需从 shadcn 引入更多功能。

zardui 的服务化调用模式值得借鉴，可考虑添加服务包装器以支持快速调用场景。

## 预览组件

已存在预览组件：`src/app/preview/alert-dialog-preview.component.ts`

包含三个示例：
1. Basic Usage - 删除账户确认
2. With Icon - 卡片停用确认
3. Small Size - 小尺寸确认对话框
