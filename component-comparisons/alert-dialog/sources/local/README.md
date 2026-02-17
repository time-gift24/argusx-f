# Alert Dialog - local (argusx) 源码

## 组件概述
argusx 的 Alert Dialog 使用 Angular CDK Overlay 实现，支持 Signal 状态管理。

## 目录结构
- alert-dialog.component.ts - 主组件（包含所有子组件）
- index.ts - 导出

## 组件列表
1. AlertDialogComponent - 根组件
2. AlertDialogTriggerDirective - 触发器指令
3. AlertDialogPortalComponent - Portal 占位
4. AlertDialogOverlayComponent - 遮罩层
5. AlertDialogContentComponent - 内容容器
6. AlertDialogHeaderComponent - 头部
7. AlertDialogFooterComponent - 底部
8. AlertDialogMediaComponent - 媒体/图标
9. AlertDialogTitleComponent - 标题
10. AlertDialogDescriptionComponent - 描述
11. AlertDialogActionComponent - 确认按钮
12. AlertDialogCancelComponent - 取消按钮

## API

### AlertDialogComponent
```typescript
// Inputs
open: model<boolean>()  // 双向绑定
size: input<AlertDialogSize>('default' | 'sm')
class: input<string>('')

// Outputs
actionClick: output<void>()
cancelClick: output<void>()
```

### AlertDialogActionComponent
```typescript
// Inputs
variant: input<AlertDialogActionVariant>('default' | 'destructive' | 'outline')
size: input<AlertDialogButtonSize>('default' | 'sm' | 'lg')
class: input<string>('')

// Outputs
actionClick: output<void>()
```

### AlertDialogCancelComponent
```typescript
// Inputs
size: input<AlertDialogButtonSize>('default' | 'sm' | 'lg')
class: input<string>('')

// Outputs
cancelClick: output<void>()
```

## 使用示例
```html
<button appAlertDialogTrigger (click)="open.set(true)">Show Dialog</button>

<app-alert-dialog [open]="open()">
  <app-alert-dialog-content>
    <app-alert-dialog-header>
      <h3 app-alert-dialog-title>Delete account?</h3>
      <p app-alert-dialog-description>
        This action cannot be undone.
      </p>
    </app-alert-dialog-header>
    <app-alert-dialog-footer>
      <button app-alert-dialog-cancel>Cancel</button>
      <button app-alert-dialog-action variant="destructive">Delete</button>
    </app-alert-dialog-footer>
  </app-alert-dialog-content>
</app-alert-dialog>
```

## 预览组件
预览组件位于：`src/app/preview/alert-dialog-preview.component.ts`

包含三个示例：
1. Basic Usage - 删除账户确认
2. With Icon - 卡片停用确认（带图标）
3. Small Size - 小尺寸确认对话框
