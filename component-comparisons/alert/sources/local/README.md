# Alert - local (argusx) 源码

## 目录结构
- alert.component.ts - 主组件
- alert.component.html - 模板
- alert-title.component.ts - 标题组件
- alert-description.component.ts - 描述组件
- alert-action.component.ts - 操作按钮组件
- index.ts - 导出

## 核心特性

1. **5 种变体**: default, destructive, warning, info, success
2. **关闭按钮支持**: 内置 close output 事件
3. **Slots 机制**: 使用 data-slot 属性实现 CSS 选择器
4. **Angular Signals**: 使用 input()/output() API

## 变体定义

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

## 使用示例

```html
<app-alert variant="default">
  <lucide-icon [img]="infoIcon"></lucide-icon>
  <app-alert-title>Information</app-alert-title>
  <app-alert-description>This is an informational message.</app-alert-description>
</app-alert>

<app-alert variant="destructive" (close)="handleClose()">
  <lucide-icon [img]="alertIcon"></lucide-icon>
  <app-alert-title>Error</app-alert-title>
  <app-alert-description>Something went wrong.</app-alert-description>
  <app-alert-action>
    <button argusButton variant="ghost" size="icon" data-close>
      <lucide-icon [img]="xIcon"></lucide-icon>
    </button>
  </app-alert-action>
</app-alert>
```
