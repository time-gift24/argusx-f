# carousel 组件能力分析

## 功能完整性

### 本地 (ArgusX-F)
- **基础功能**: 完整的走马灯组件，包含内容容器和滑块项
- **导航控制**: 提供 Previous/Next 按钮组件和 Dots 指示器组件
- **方向支持**: 支持 horizontal 和 vertical 两种方向
- **循环模式**: 支持 loop 选项实现无缝循环
- **对齐方式**: 支持 `start`、`center`、`end` 三种对齐方式
- **键盘导航**: 支持方向键控制（ArrowLeft/ArrowRight 水平，ArrowUp/ArrowDown 垂直）
- **缺失功能**:
  - 拖拽滑动支持（dragFree）
  - 自动播放（autoplay）功能仅提供基础框架但未完全实现
  - 触摸滑动支持
  - 缩略图导航
  - 插件系统

### shadcn
- 基于 `embla-carousel-react` 实现
- 提供基础的轮播功能
- 支持循环和自动播放插件

### zardui
- 基于 Embla Carousel 实现，功能最为完善
- 支持 zOptions 配置 Embla 所有选项
- 支持 zPlugins 插件系统（autoplay 等）
- 提供内置导航控件（button/dot/none）
- 支持缩略图导航组件（z-carousel-thumbs）
- 提供完整的 API 暴露（zInited、zSelected 事件）
- 支持水平和垂直方向

## 性能

### 本地 (ArgusX-F)
- 使用 Angular Signals 管理状态，变更检测高效
- OnPush 变更检测策略
- 使用 CSS transform 进行动画，性能良好
- 固定每次滚动一个完整滑块位置（100%），计算简单
- 缺失懒加载优化

### shadcn
- 基于 Embla Carousel，性能经过优化
- 支持虚拟滚动和懒加载

### zardui
- 基于 Embla Carousel，性能经过大量生产验证
- 支持拖拽自由模式（dragFree）
- 插件系统支持按需加载

## 易用性

### 本地 (ArgusX-F)
- **优点**:
  - 提供独立的子组件（Previous/Next/Dots），灵活组合
  - API 通过 output 暴露服务实例
  - 支持内容投影自定义按钮图标
  - 示例代码清晰
- **缺点**:
  - 服务需要通过 output 手动获取，对新手不友好
  - 自动播放功能未完全实现
  - 缺少响应式配置

### shadcn
- API 简单直观
- 文档完善

### zardui
- 提供多种预设演示（default、orientation、plugins、thumbs 等）
- API 配置化程度高
- 内置导航控件可配置
- 提供完整的类型定义

## API 设计

### 本地 (ArgusX-F)
```typescript
// CarouselComponent
readonly opts = input<CarouselOptions>({});
readonly orientation = input<CarouselOrientation>('horizontal');
readonly api = output<CarouselService>();

// CarouselOptions
interface CarouselOptions {
  loop?: boolean;
  align?: 'start' | 'center' | 'end';
  skipSnaps?: boolean;
  containScroll?: boolean;
  dragFree?: boolean;
  slidesToScroll?: number;
  duration?: number;
}
```

**评估**: API 设计合理，但部分选项（dragFree、containScroll 等）未在服务中实现

### shadcn
- 依赖 Embla Carousel 的配置对象
- 通过 props 传递配置

### zardui
```typescript
// 组件属性
[zOptions]: EmblaOptionsType
[zPlugins]: EmblaPluginType[]
[zOrientation]: 'horizontal' | 'vertical'
[zControls]: 'button' | 'dot' | 'none'

// 事件
(zInited): EmblaCarouselType
(zSelected): void
```

**评估**: API 最为完善，配置化程度高

## 可访问性

### 本地 (ArgusX-F)
- 良好的 ARIA 支持:
  - `role="region"` 和 `aria-roledescription="carousel"`
  - 按钮有 `aria-label` 标签
  - Dots 组件有 `aria-label` 和 `aria-current`
  - 支持键盘导航（方向键）
- **待改进**:
  - 拖拽时缺少 aria-live 区域通知
  - 缺少焦点管理（滚动时焦点处理）

### shadcn
- 基础 ARIA 支持
- 依赖 Embla Carousel 的可访问性

### zardui
- 依赖 Embla Carousel 的可访问性
- 提供按钮和点状导航

## 建议

### 开发优先级

1. **高优先级**
   - 实现拖拽滑动支持（dragFree）
   - 实现完整的自动播放功能（基于 setInterval 或 Embla 插件）
   - 添加触摸滑动支持

2. **中优先级**
   - 添加响应式配置支持（根据屏幕尺寸自动调整）
   - 添加焦点管理
   - 完善 aria-live 区域通知

3. **低优先级**
   - 添加缩略图导航组件
   - 插件系统扩展
   - 虚拟滚动支持

### 技术选型建议

当前本地实现:
- 优点: 轻量、依赖少、完全可控
- 缺点: 功能不完整、性能优化空间大

zardui 实现:
- 优点: 功能最全、性能经过验证、API 完善
- 缺点: 依赖 Embla Carousel

**建议**: 如果项目需要生产级轮播组件，推荐参考 zardui 实现基于 Embla Carousel 重构本地组件，或直接集成 zardui 的 carousel 组件
