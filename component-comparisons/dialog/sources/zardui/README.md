# zardui Dialog 源码

## 目录结构

```
libs/zard/src/lib/shared/components/dialog/
├── dialog.component.ts    # 主组件
├── dialog.service.ts     # 对话框服务
├── dialog-ref.ts         # 对话框引用
├── dialog.variants.ts    # 变体
└── index.ts              # 导出
```

## 核心特性

- 基于 Angular CDK Overlay/Portal
- Service 驱动模式：`ZardDialogService.open(options)`
- 内置 OK/Cancel 按钮
- 支持自定义内容组件
- 动画过渡效果

## ZardDialogOptions

```typescript
interface ZardDialogOptions<T, U> {
  zCancelIcon?: ZardIcon;
  zCancelText?: string | null;
  zClosable?: boolean;
  zContent?: string | TemplateRef<T> | Type<T>;
  zCustomClasses?: string;
  zData?: U;
  zDescription?: string;
  zHideFooter?: boolean;
  zMaskClosable?: boolean;
  zOkDestructive?: boolean;
  zOkDisabled?: boolean;
  zOkIcon?: ZardIcon;
  zOkText?: string | null;
  zOnCancel?: EventEmitter<T> | OnClickCallback<T>;
  zOnOk?: EventEmitter<T> | OnClickCallback<T>;
  zTitle?: string | TemplateRef<T>;
  zViewContainerRef?: ViewContainerRef;
  zWidth?: string;
}
```

## 使用示例

```typescript
constructor(private dialog: ZardDialogService) {}

openDialog() {
  this.dialog.open({
    zTitle: 'Confirm',
    zDescription: 'Are you sure?',
    zOkText: 'Confirm',
    zCancelText: 'Cancel',
  });
}
```
