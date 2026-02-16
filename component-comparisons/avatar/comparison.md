# Avatar 三方对比报告

## 概述

| 属性 | zardui | shadcn | local |
|------|--------|--------|-------|
| 组件类型 | 单一组件 | 3 组件组合 | 6 组件/指令 |
| 框架 | Angular | React | Angular |
| 依赖 | @radix-ui/react-avatar | Radix UI | 无 |

## 功能矩阵

| 特性 | zardui | shadcn | local | 最优 |
|------|--------|--------|-------|------|
| 图片显示 | ✓ | ✓ | ✓ | - |
| 回退文字 | ✓ | ✓ | ✓ | - |
| 加载状态 | ✓ | ✓ | ✓ | - |
| 错误处理 | ✓ | ✓ | ✓ | - |
| 尺寸变体 | ✓ (sm/default/md/lg/xl + 数字) | ✗ | ✓ (sm/default/lg) | zardui |
| 形状变体 | ✓ (circle/rounded/square) | ✗ | ✗ | zardui |
| 状态指示器 | ✓ (online/offline/doNotDisturb/away) | ✗ | ✓ (AvatarBadge) | zardui |
| 头像组 | ✓ | ✓ | ✓ | - |
| 头像组方向 | ✓ (horizontal/vertical) | ✗ | ✗ | zardui |
| 头像组计数 | ✗ | ✗ | ✓ | local |
| 自定义类名 | ✓ | ✓ | ✓ | - |

## 样式差异

### zardui
- 使用 `cva` (class-variance-authority) 管理变体
- 尺寸: sm(32px)/default(40px)/md(48px)/lg(56px)/xl(64px) + 支持数字自定义
- 形状: circle/rounded/square
- 头像组支持 horizontal/vertical 方向
- 状态图标内置 SVG (online/offline/doNotDisturb/away)
- 使用 `mergeClasses` 工具合并类名
- 使用 `NgOptimizedImage` 优化图片加载

### shadcn
- 基础圆形头像
- 使用 Tailwind arbitrary values
- 无内置状态指示器
- 头像组通过外部容器实现 (-space-x-2, ring-2)
- 使用 `cn` 工具合并类名

### local (当前实现)
- 尺寸: sm(24px)/default(32px)/lg(40px)
- 圆形头像，带边框混合模式 (mix-blend-darken/lighten)
- AvatarBadge 组件支持自定义状态
- AvatarGroup 组件支持头像堆叠
- AvatarGroupCount 组件显示剩余计数
- 使用内容投影 (`<ng-content />`)
- 使用 DI Token (AvatarRootToken) 跨组件通信

## 行为对比

### zardui
- 使用 `effect()` 重置图片状态当 src 变化时
- 内置状态: imageLoaded, imageError signals
- 状态通过 effect 自动管理

### shadcn
- Radix UI 处理状态
- 外部容器控制头像组行为

### local
- 使用 signal 管理 imageLoadingState
- 通过 AvatarRootToken 提供依赖注入
- Fallback 根据加载状态显示/隐藏
- Image directive 处理 load/error 事件

## 性能评估

| 维度 | zardui | shadcn | local |
|------|--------|--------|-------|
| Change Detection | OnPush | - | OnPush |
| 图片优化 | NgOptimizedImage | - | 原生 img |
| 变体方式 | cva | Tailwind | cn + computed |
| 状态管理 | signal + effect | Radix | signal |

## 推荐实现

基于智能加权分析：

| 维度 | 权重 | 最优源 |
|------|------|--------|
| 功能完整性 | 1.0 | zardui |
| 样式灵活性 | 1.0 | local |
| 行为健壮性 | 1.0 | zardui |
| 性能 | 1.0 | zardui |

**推荐采用 zardui 的实现方案**，原因：
1. 更完整的尺寸变体支持 (sm 到 xl + 数字自定义)
2. 内置状态指示器 (online/offline/doNotDisturb/away)
3. 使用 NgOptimizedImage 优化性能
4. 头像组支持方向控制 (horizontal/vertical)
5. cva 变体管理更规范

**可从 local 借鉴的功能：**
- AvatarGroupCount 组件 (显示剩余计数)
- AvatarBadge 组件的自定义性

## 本地预览实现

参考 shadcn 示例代码：

```tsx
// shadcn 示例
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

// 头像组
<div className="flex -space-x-2">
  <Avatar>...</Avatar>
  <Avatar>...</Avatar>
</div>
```

当前 local 实现已完整支持上述功能。
