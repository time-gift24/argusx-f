# Tooltip 组件能力分析报告

## 1. 概述

本报告对比分析三个 tooltip 组件实现:
- **本地实现 (argusx-f)**: `src/app/shared/ui/tooltip/`
- **Zardui 实现**: `/tmp/zardui/apps/web/public/components/tooltip/`
- **Shadcn 实现**: 基于 Radix UI 的 shadcn/ui tooltip

---

## 2. 功能对比

| 功能 | 本地实现 (argusx-f) | Zardui | Shadcn |
|------|---------------------|--------|--------|
| **触发方式** | hover / focus | hover / click | hover (通过 asChild) |
| **定位方向** | top / bottom / left / right | top / bottom / left / right | top / bottom / left / right |
| **对齐方式** | start / center / end | - | - |
| **显示延迟** | 通过 TooltipProvider 配置 | zShowDelay (默认 150ms) | - |
| **隐藏延迟** | 固定 100ms | zHideDelay (默认 100ms) | - |
| **箭头指示器** | 有 (旋转方块) | - | 有 |
| **动画效果** | 有 (fade/zoom/slide) | - | 有 |
| **事件回调** | - | zShow / zHide | - |
| **自定义样式** | 通过 class input | - | 通过 sideOffset |
| **Provider 全局配置** | 有 | - | - |

---

## 3. 本地实现详解

### 3.1 组件结构

```
TooltipComponent       - 根组件，管理显示状态和定位
TooltipTriggerDirective - 触发指令，绑定到触发元素
TooltipContentComponent - 内容组件，渲染 tooltip 面板
TooltipProviderComponent - 提供者，配置全局延迟
TooltipService         - 服务，存储全局配置
```

### 3.2 API

```typescript
// TooltipComponent
readonly side = input<TooltipSide>('top');        // 定位方向
readonly sideOffset = input<number>(0);           // 偏移量
readonly open = model<boolean>(false);            // 手动控制显示

// TooltipContentComponent
readonly class = input<string>('');                // 自定义样式类

// TooltipProviderComponent
readonly delayDuration = input<number>(0);        // 显示延迟
```

### 3.3 使用示例

```html
<app-tooltip-provider [delayDuration]="300">
  <app-tooltip side="right">
    <button appTooltipTrigger>Hover me</button>
    <app-tooltip-content>This is a tooltip</app-tooltip-content>
  </app-tooltip>
</app-tooltip-provider>
```

### 3.4 特性

- **无障碍**: 正确的 `role="tooltip"`, `aria-describedby`, `data-state` 属性
- **动画**: 使用 Angular 动画 (fade-in, zoom-in, slide-in)
- **样式**: 使用 Tailwind 工具类，主题变量
- **清理**: 正确的 timeout 清理，防止内存泄漏
- **OnPush**: 变更检测策略设置为 OnPush

---

## 4. Zardui 实现详解

### 4.1 指令式 API

Zardui 使用单一指令 `[zTooltip]` 实现所有功能:

```typescript
@Directive({
  selector: '[zTooltip]',
})
class ZardTooltipDirective {
  @Input() zTooltip: string;          // tooltip 内容
  @Input() zPosition: string;         // 定位
  @Input() zTrigger: 'hover' | 'click'; // 触发方式
  @Input() zShowDelay: number;        // 显示延迟
  @Input() zHideDelay: number;       // 隐藏延迟

  @Output() zShow = new EventEmitter<void>();
  @Output() zHide = new EventEmitter<void>();
}
```

### 4.2 使用示例

```html
<button z-button zType="outline" zTooltip="Tooltip content" zTrigger="click">
  Click
</button>
```

### 4.3 特性对比

- 指令式 API 更简洁
- 支持 click 触发模式
- 提供事件回调 (zShow/zHide)
- 不支持自定义内容，只支持文本

---

## 5. Shadcn 实现详解

### 5.1 组件结构

```tsx
// React + Radix UI
<Tooltip>
  <TooltipTrigger asChild>
    <Button>Hover</Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Add to library</p>
  </TooltipContent>
</Tooltip>
```

### 5.2 特性

- 基于 Radix UI primitives
- 支持 `asChild` 模式
- 自定义内容插槽
- 侧边偏移 (sideOffset)
- 样式通过 className 自定义

---

## 6. 能力差距分析

### 6.1 本地实现已有

- [x] 4 个方向定位
- [x] 箭头指示器
- [x] 动画效果
- [x] Provider 全局配置
- [x] 无障碍支持
- [x] OnPush 变更检测

### 6.2 本地实现缺失

| 功能 | 优先级 | 说明 |
|------|--------|------|
| click 触发 | 高 | Zardui 支持，本地缺失 |
| 事件回调 | 中 | zShow/zHide 事件 |
| 对齐方式 | 低 | start/center/end (Zardui 不支持) |

### 6.3 可改进项

1. **触发模式**: 添加 `trigger` input 支持 'hover' | 'click'
2. **事件输出**: 添加 `shown` / `hidden` Output
3. **对齐**: 实现 `align` input
4. **sideOffset**: 支持更灵活的偏移配置

---

## 7. 结论

本地 tooltip 组件 (`argusx-f`) 功能完整，架构清晰:

- **优势**: Provider 全局配置、正确的无障碍支持、OnPush 优化
- **不足**: 缺少 click 触发模式和事件回调

建议根据业务需求考虑是否添加 click 触发支持和事件回调。

---

## 8. 参考文件

- 本地: `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/tooltip/`
- Zardui: `/tmp/zardui/apps/web/public/components/tooltip/`
- Shadcn: `@shadcn/ui` (基于 Radix UI)
