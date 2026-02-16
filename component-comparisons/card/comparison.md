# Card 三方对比报告

## 概述

Card 组件是一个基础容器组件，用于展示相关信息。ArgusX-F 项目中的 Card 实现与 shadcn/ui 保持一致。

**更新说明**: zardui 确实存在 card 组件实现，位于 `libs/zard/src/lib/shared/components/card/`，为单一组件模式（z-card），而非 directives 模式。

## 功能矩阵

| 特性 | zardui | shadcn | local | 最优 |
|------|--------|--------|-------|------|
| Card 容器 | ✓ | ✓ | ✓ | zardui/local |
| 指令式子组件 | ✗ | ✓ | ✓ | local |
| 组件式子组件 | ✓ (header/body/footer) | ✓ (组件) | ✗ | shadcn |
| Title 支持 | ✓ (zTitle 输入) | ✓ | ✓ (指令) | shadcn/local |
| Description 支持 | ✓ (zDescription 输入) | ✓ | ✓ (指令) | shadcn/local |
| Action 支持 | ✓ (zAction 输入) | ✓ | ✓ (指令) | shadcn/local |
| Size 变体 | ✗ | ✓ | ✓ | local |
| HeaderBorder | ✓ | ✗ | ✗ | zardui |
| FooterBorder | ✓ | ✗ | ✗ | zardui |
| 双向绑定 | ✓ | ✗ | ✗ | zardui |
| Class 输入 | ✓ | ✓ | ✓ | shadcn/local |
| data-slot 属性 | ✓ | ✓ | ✓ | shadcn/zardui |
| ARIA 支持 | ✓ | ✓ | ✗ | zardui |

## 样式差异

### zardui
```typescript
// 使用 cva + mergeClasses
export const cardVariants = cva('bg-card text-card-foreground flex flex-col rounded-xl border py-6 shadow-sm');
export const cardHeaderVariants = cva(
  '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6',
  'has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
);
export const cardBodyVariants = cva('px-6');
export const cardFooterVariants = cva('flex flex-col gap-2 items-center px-6 [.border-t]:pt-6');
```
- Card: `rounded-xl border bg-card text-card-foreground shadow-sm`
- Header: 支持 grid 布局，响应式容器
- 使用 `@container` 响应式容器

### shadcn (React)
```tsx
const cn = clsx(tailwindMerge)
```
- Card: `rounded-xl border bg-card text-card-foreground shadow`
- CardHeader: `flex flex-col space-y-1.5 p-6`
- CardTitle: `font-semibold leading-none tracking-tight`
- CardDescription: `text-sm text-muted-foreground`
- CardContent: `p-6 pt-0`
- CardFooter: `flex items-center p-6 pt-0`

### local (ArgusX-F Angular)
```typescript
// 使用 cva
const cardVariants = cva(
  'bg-card text-card-foreground group/card flex flex-col rounded-lg border border-border',
  {
    variants: {
      size: { default: 'p-6 gap-4', sm: 'p-4 gap-3' },
    },
  }
);
```
- Card: `rounded-lg border border-border` + size 变体
- CardHeader: `flex flex-col gap-1.5 group/card-header @container/card-header grid...`
- Title/Description/Action 使用独立指令

## 架构对比

### zardui - 单一组件模式
```html
<z-card [zTitle]="title" [zDescription]="desc" [zAction]="actionText">
  内容
</z-card>
```
- 优点: API 简洁，输入即配置，内置 ARIA 支持
- 缺点: 灵活性较低，自定义结构受限

### local - 指令模式
```html
<div appCard>
  <div appCardHeader>
    <div appCardTitle>Title</div>
    <div appCardDescription>Desc</div>
    <div appCardAction>Action</div>
  </div>
  <div appCardContent>内容</div>
  <div appCardFooter>Footer</div>
</div>
```
- 优点: 高度灵活，可任意组合结构
- 缺点: 模板较冗长

### shadcn - 组件模式
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Desc</CardDescription>
    <CardAction>Action</CardAction>
  </CardHeader>
  <CardContent>内容</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```
- 优点: 结构清晰，语义化
- 缺点: React 组件化

## 行为对比

### zardui
- 单一组件，智能内置 header/body/footer
- 支持 zTitle/zDescription/zAction 作为输入
- 支持 zHeaderBorder/zFooterBorder 控制边框
- 内置 aria-labelledby/aria-describedby
- 事件输出: zActionClick

### shadcn
- 纯展示组件，无内置交互
- 提供 data-slot 属性支持父组件检测

### local
- 与 shadcn 行为一致
- 额外支持 size 变体 (default/sm)
- 使用 Angular signals + computed 响应式更新
- OnPush 变更检测策略

## 性能评估

### zardui
- **OnPush 变更检测** ✓
- **Signals 响应式** ✓
- **computed() 派生状态** ✓
- **viewChild 动态 ID 生成** ✓

### shadcn
- React 纯函数组件，重渲染依赖 React 机制

### local
- **OnPush 变更检测** ✓
- **Signals 响应式** ✓
- **computed() 派生状态** ✓

## 推荐实现

基于智能加权，采用 **local (ArgusX-F)** 的实现方案。

理由：
1. 与 shadcn API 完全对齐，开发者迁移成本低
2. 指令模式提供更高灵活性
3. 额外支持 size 变体 (local 优势)
4. Angular signals + OnPush 性能优化
5. zardui 组件式 API 虽简洁但灵活性不足

**注意**: 如果项目追求极简 API，可考虑参考 zardui 模式增强 local 实现：
- 添加 appCardTitle/appCardDescription 作为输入而非指令
- 添加内置 ARIA 支持

## 本地组件已包含预览

Card 预览组件已集成到 `/preview/card` 路由：
- 基础 Card
- Size 变体 (default, sm)
- 带边框 Header/Footer
- 带 Action 按钮
- 带图片
- 登录表单示例
