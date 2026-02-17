# Slider 组件能力分析

## 1. 本地实现状态

**状态**: 未实现

本地路径 `src/app/shared/ui/slider/` 不存在，当前项目中未实现 slider 组件。

## 2. ZardUI 实现分析

### 2.1 组件信息

- **组件名**: `z-slider`
- **源码路径**: `/tmp/zardui/apps/web/public/components/slider/`
- **类型**: 功能组件

### 2.2 API

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `[class]` | 自定义 CSS 类 | `string` | `''` |
| `[zMin]` | 最小可选值 | `number` | `0` |
| `[zMax]` | 最大可选值 | `number` | `100` |
| `[zDefault]` | 默认值（当 zValue 为空时使用） | `number` | `0` |
| `[zValue]` | 受控值输入 | `number \| null` | `null` |
| `[zStep]` | 步进增量 | `number` | `1` |
| `[zDisabled]` | 禁用滑块交互 | `boolean` | `false` |
| `[zOrientation]` | 滑块方向 | `horizontal \| vertical` | `'horizontal'` |

### 2.3 事件

| 事件 | 描述 | 类型 |
|------|------|------|
| `(zSlideIndexChange)` | 滑块值变化时触发 | `number` |

### 2.4 Demo 展示

- **default**: 默认水平滑块，值 50
- **disabled**: 禁用状态滑块
- **min-max**: 自定义范围 (30-120)，步进 10
- **vertical**: 垂直方向滑块

### 2.5 ZardUI 特性总结

- 支持水平/垂直方向
- 支持自定义范围和步进
- 支持禁用状态
- 支持受控/非受控模式
- 事件驱动值变化

## 3. Shadcn 实现分析

### 3.1 组件信息

- **组件名**: slider
- **类型**: registry:ui
- **依赖**: radix-ui
- **文档**: https://ui.shadcn.com/preview/radix/slider-example

### 3.2 Shadcn 特性

- 基于 Radix UI Slider 原语
- 支持多值选择（range）
- 完整的无障碍支持
- 键盘导航支持

## 4. 能力对比

| 特性 | ZardUI | Shadcn |
|------|--------|--------|
| 基础滑块 | 支持 | 支持 |
| 范围选择 | 未知 | 支持 |
| 垂直方向 | 支持 | 支持 |
| 自定义步进 | 支持 | 支持 |
| 禁用状态 | 支持 | 支持 |
| 受控模式 | 支持 | 支持 |
| 双向绑定 | 支持 | 支持 |
| 无障碍 | 未知 | Radix 提供 |

## 5. 实现建议

### 5.1 推荐实现方案

基于 ZardUI 已有的完整实现，建议采用以下方案：

1. **参考 ZardUI**: 直接参考 ZardUI 的 API 设计和实现
2. **增强功能**: 考虑增加 range（范围选择）能力，对齐 Shadcn
3. **无障碍**: 确保实现完整的键盘导航和 ARIA 支持

### 5.2 建议的 API 设计

```typescript
@Component({
  selector: 'app-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'disabled()',
  },
  template: `...`,
})
export class SliderComponent {
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly value = input<number>(0);
  readonly disabled = input(false);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  readonly valueChange = output<number>();
}
```

### 5.3 需要实现的功能

- [ ] 单值滑块
- [ ] 范围选择（可选，对齐 Shadcn）
- [ ] 水平/垂直方向
- [ ] 自定义范围和步进
- [ ] 禁用状态
- [ ] 键盘导航
- [ ] 触摸支持

## 6. 参考资源

- ZardUI 源码: `/tmp/zardui/apps/web/public/components/slider/`
- Shadcn 文档: https://ui.shadcn.com/preview/radix/slider-example
- Radix UI: https://www.radix-ui.com/primitives/docs/components/slider
