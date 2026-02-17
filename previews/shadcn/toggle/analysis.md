# Toggle 组件能力分析

## 1. 组件概述

| 属性 | 值 |
|------|-----|
| **组件类型** | Directive (本地) / Component (zardui) |
| **设计模式** | 无障碍两态切换按钮 |
| **依赖** | Radix UI (shadcn) |

## 2. 本地实现 (`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/toggle/`)

### 文件结构
- `toggle.directive.ts` - 核心指令实现
- `index.ts` - 导出入口

### 功能特性

| 特性 | 支持 | 说明 |
|------|------|------|
| `variant` | 是 | `default` / `outline` |
| `size` | 是 | `default` / `sm` / `lg` |
| `class` | 是 | 自定义 CSS 类名 |
| Disabled | 否 | 需手动在 button 上添加 `disabled` 属性 |
| 双向绑定 | 否 | 需手动绑定 `aria-pressed` |
| 事件 | 否 | 需手动绑定 click 事件 |

### 代码示例

```html
<button
  appToggle
  variant="outline"
  size="sm"
  [attr.aria-pressed]="isPressed() ? 'true' : 'false'"
  (click)="toggle()">
  Toggle Me
</button>
```

### 特点
- **轻量级**: 仅样式指令，不含状态管理
- **灵活性**: 可应用于任意 button 元素
- **样式驱动**: 基于 CVA (class-variance-authority) 实现变体

## 3. Zardui 实现 (`/tmp/zardui/apps/web/public/components/toggle/`)

### 完整 API

#### Inputs

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `[zSize]` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `[zType]` | `'default' \| 'outline'` | `'default'` | 样式类型 |
| `[zValue]` | `boolean` | `undefined` | 受控值 |
| `[zDefault]` | `boolean` | `false` | 非受控初始值 |
| `[disabled]` | `boolean` | `false` | 禁用状态 |
| `[aria-label]` | `string` | `''` | 无障碍标签 |
| `[class]` | `string` | `''` | 自定义类名 |

#### Outputs

| 事件 | Payload | 说明 |
|------|---------|------|
| `(zToggleClick)` | `void` | 点击事件 |
| `(zToggleHover)` | `void` | 悬停事件 |
| `(zToggleChange)` | `boolean` | 值变化事件 |

### Demo 示例

- `default.md` - 默认图标切换
- `with-default.md` - 带默认值的切换
- `outline.md` - 轮廓样式
- `small.md` / `large.md` - 尺寸变体
- `disabled.md` - 禁用状态
- `with-text.md` - 带文本
- `with-forms.md` - 表单集成

### 特点
- **完整组件**: 封装为独立组件
- **受控/非受控**: 支持两种模式
- **内置事件**: hover/click/change 事件
- **表单集成**: 支持 Angular Forms

## 4. Shadcn 实现

- **类型**: `registry:ui`
- **依赖**: Radix UI
- **源码**: `.vendor/aim/components/ui/toggle.tsx` (引用注释)

## 5. 能力对比

| 能力维度 | 本地 Directive | Zardui Component |
|----------|----------------|------------------|
| 实现形式 | Directive | Component |
| 受控模式 | 手动实现 | 原生支持 |
| 非受控模式 | 手动实现 | `[zDefault]` |
| 尺寸 | 3 种 | 3 种 |
| 样式变体 | 2 种 | 2 种 |
| 禁用状态 | 手动 | 原生支持 |
| 事件 | 手动 | 3 种事件 |
| 表单集成 | 手动 | 支持 |
| 体积 | 轻量 | 完整 |

## 6. 建议

### 本地实现定位
当前本地 `ToggleDirective` 是一个**轻量级样式指令**，适用于:
- 已有状态管理，只需样式
- 自定义交互逻辑
- 追求最小 bundle 体积

### 潜在增强方向
1. **添加 disabled 支持** - 在 directive 中添加 `disabled` input
2. **事件输出** - 添加 `toggleChange` output
3. **受控模式** - 添加 `pressed` input + `pressedChange` output
4. **封装组件** - 参考 zardui 提供完整组件

### 与 Zardui 对比
- Zardui 提供了完整功能的组件
- 本地 directive 更轻量，适合已有状态管理场景
- 两者样式保持一致（基于相同 CVA 配置）
