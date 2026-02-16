# local (argusx-f) Dialog 源码

## 文件结构

```
src/app/shared/ui/dialog/
├── dialog.component.ts   # 主组件和子组件
├── dialog.service.ts     # 服务（未使用）
├── dialog.css           # 样式
└── index.ts             # 导出
```

## 组件列表

- `DialogComponent` - 根组件，管理 open state
- `DialogPortalComponent` - Portal 容器
- `DialogOverlayComponent` - 遮罩层
- `DialogContentComponent` - 对话框主体
- `DialogHeaderComponent` - 头部
- `DialogTitleComponent` - 标题
- `DialogDescriptionComponent` - 描述
- `DialogFooterComponent` - 底部
- `DialogCloseDirective` - 关闭指令
- `DialogTriggerComponent` - 触发器指令

## 使用示例

```html
<div argus-dialog [(open)]="isOpen">
  <div argus-dialog-content>
    <div argus-dialog-header>
      <h3 argus-dialog-title>Edit Profile</h3>
      <p argus-dialog-description>Make changes to your profile</p>
    </div>
    <div>...content...</div>
    <div argus-dialog-footer>
      <button argus-dialog-close>Cancel</button>
      <button (click)="save()">Save</button>
    </div>
  </div>
</div>
```
