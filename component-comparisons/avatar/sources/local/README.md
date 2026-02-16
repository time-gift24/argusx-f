# local (argusx-f) Avatar 源码

## 组件列表

1. **AvatarComponent** - 根组件
2. **AvatarImageDirective** - 图片指令
3. **AvatarFallbackDirective** - 回退指令
4. **AvatarBadgeComponent** - 徽章组件
5. **AvatarGroupComponent** - 头像组组件
6. **AvatarGroupCountComponent** - 头像组计数组件

## 核心功能

### AvatarComponent
- 尺寸变体: sm (24px) / default (32px) / lg (40px)
- 使用 AvatarRootToken 提供依赖注入
- 管理图片加载状态

### AvatarImageDirective
- 处理图片加载/错误事件
- 与 AvatarRootToken 通信更新状态

### AvatarFallbackDirective
- 根据加载状态显示/隐藏回退内容
- 响应式尺寸

### AvatarBadgeComponent
- 状态指示器容器
- 根据尺寸自动调整

### AvatarGroupComponent
- 头像堆叠容器
- 使用 -space-x-2 实现重叠
- 自动为子头像添加 ring

### AvatarGroupCountComponent
- 显示额外头像数量
- 支持响应式尺寸

## 使用示例

```html
<app-avatar>
  <img appAvatarImage src="/avatar.png" alt="User" />
  <span appAvatarFallback>UN</span>
</app-avatar>

<app-avatar size="lg">
  <img appAvatarImage src="/avatar.png" alt="User" />
  <span appAvatarFallback>UN</span>
  <app-avatar-badge>
    <div class="size-2 rounded-full bg-green-500"></div>
  </app-avatar-badge>
</app-avatar>

<app-avatar-group>
  <app-avatar><img appAvatarImage src="/1.png" /></app-avatar>
  <app-avatar><img appAvatarImage src="/2.png" /></app-avatar>
  <app-avatar-group-count>+5</app-avatar-group-count>
</app-avatar-group>
```
