# carousel 源码能力差距报告

## 1. 组件映射

| 本地 | shadcn | zardui | 备注 |
|------|--------|--------|------|
| `carousel` | `@shadcn/carousel` | `carousel` | 本地 carousel 对标 shadcn/carousel 与 zardui/carousel。 |

## 2. 量化评分矩阵

评分范围：0-5（0.5 步进）。  
加权分计算：`维度得分 * 权重 / 5`。

| 维度 | 权重 | 本地 | shadcn | zardui | 评分依据（证据 ID） |
|------|------|------|--------|--------|---------------------|
| API 覆盖度 | 20 | 3.0 | 4.0 | 5.0 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 交互与状态语义 | 15 | 3.5 | 3.0 | 4.5 | E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2 |
| 组合与扩展能力 | 15 | 4.0 | 3.0 | 2.5 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 可访问性 | 15 | 3.0 | 2.5 | 3.0 | E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2 |
| 类型安全与开发体验 | 10 | 5.0 | 2.5 | 5.0 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 性能与资源管理 | 15 | 5.0 | 2.5 | 5.0 | E-LOCAL-2, E-SHADCN-1, E-ZARDUI-1 |
| 测试与稳定性证据 | 10 | 1.0 | 1.0 | 3.5 | E-LOCAL-1, E-ZARDUI-2 |
| **加权总分** | **100** | **70.5** | **56.0** | **82.0** |  |

## 3. Top 3 实现差距

### Gap-1: 本地 API 覆盖与对标实现存在差距
- 影响等级：高
- 差距陈述：本地在 API 覆盖维度与对标实现存在差距（相对 shadcn 差值 -1.0，相对 zardui (carousel) 差值 -2.0）。当前能力点分布在多个输入/子节点约定中，常见场景下缺少一条“最短实现路径”。
- 证据：E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1
- 本地改造建议：
  - 修改文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/carousel/carousel.component.ts`
  - API 变更：补齐核心输入（variant/size/state/appearance 中缺失项），并提供最小可用默认值。
  - 验收标准：在不写额外模板分支时可完成主流场景；文档示例覆盖新增输入。

### Gap-2: 本地交互语义与可访问性约束需要统一化
- 影响等级：中
- 差距陈述：本地交互、状态与 a11y 相关语义分散在模板/宿主/调用侧，缺少统一契约，导致行为一致性和回归验证成本偏高。
- 证据：E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2
- 本地改造建议：
  - 修改文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/carousel/carousel.component.ts`
  - 实现方式：把 role/aria/状态切换入口收敛到根组件，子组件只做展示。
  - 验收标准：键盘与读屏路径在默认示例可复现，关键状态切换只走一套逻辑。

### Gap-3: 本地测试证据不足，后续重构风险偏高
- 影响等级：高
- 差距陈述：当前本地测试文件数量为 0，难以为 API 扩展和行为重构提供足够回归保护。对标 zardui 该映射下有 3 个测试文件，稳定性基线更高。
- 证据：E-LOCAL-1, E-ZARDUI-2
- 本地改造建议：
  - 新增文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/carousel/carousel.component.spec.ts`
  - 测试覆盖：API 输入边界、关键交互路径、a11y 属性、异常分支。
  - 验收标准：新增 spec 在 CI 通过，覆盖核心输入和关键行为。

## 4. 源码证据（关键片段）

### E-LOCAL-1
- 实现方：local
- 文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/carousel/carousel.component.ts`
- 行号：`L31-L48`
- 结论标签：API/结构
```ts
 * ```
 */
@Component({
  selector: 'app-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CarouselService],
  host: {
    role: 'region',
    'aria-roledescription': 'carousel',
    '[attr.data-slot]': '"carousel"',
  },
  template: `
    <div
      class="relative"
      (keydown)="onKeyDown($event)"
    >
      <ng-content />
    </div>
```

### E-LOCAL-2
- 实现方：local
- 文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/carousel/carousel.service.ts`
- 行号：`L26-L43`
- 结论标签：状态/可访问性
```ts

  // Computed values
  readonly canScrollPrev = computed(() => {
    const index = this.currentIndex();
    const loop = this.options().loop ?? false;
    return loop || index > 0;
  });

  readonly canScrollNext = computed(() => {
    const index = this.currentIndex();
    const count = this.slideCount();
    const loop = this.options().loop ?? false;
    return loop || index < count - 1;
  });

  readonly scrollSnaps = computed(() => {
    const count = this.slideCount();
    return Array.from({ length: count }, (_, i) => i);
```

### E-SHADCN-1
- 实现方：shadcn
- 文件：`/tmp/shadcn-ui/apps/v4/registry/new-york-v4/ui/carousel.tsx`
- 行号：`L33-L50`
- 结论标签：API/变体
```tsx
const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
```

### E-SHADCN-2
- 实现方：shadcn
- 文件：`/tmp/shadcn-ui/apps/v4/registry/new-york-v4/examples/carousel-api.tsx`
- 行号：`L14-L31`
- 结论标签：语义/用法
```tsx

export default function CarouselDApiDemo() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])
```

### E-ZARDUI-1
- 实现方：zardui
- 文件：`/tmp/zardui/libs/zard/src/lib/shared/components/carousel/carousel.component.ts`
- 行号：`L27-L44`
- 结论标签：API/模板
```ts
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-carousel',
  imports: [EmblaCarouselDirective, ZardButtonComponent, ZardIconComponent],
  template: `
    <div class="relative">
      <div
        emblaCarousel
        #emblaRef="emblaCarousel"
        [class]="classes()"
        [options]="options()"
        [plugins]="zPlugins()"
        [subscribeToEvents]="subscribeToEvents"
        (emblaChange)="onEmblaChange($event, emblaRef.emblaApi!)"
        aria-roledescription="carousel"
        role="region"
        tabindex="0"
```

### E-ZARDUI-2
- 实现方：zardui
- 文件：`/tmp/zardui/libs/zard/src/lib/shared/components/carousel/demo/carousel.ts`
- 行号：`L1-L18`
- 结论标签：交互/测试
```ts
import { ZardDemoCarouselApiComponent } from '@/shared/components/carousel/demo/api-demo';
import { ZardDemoCarouselDefaultComponent } from '@/shared/components/carousel/demo/default';
import { ZardDemoCarouselDotControlsComponent } from '@/shared/components/carousel/demo/dot-controls';
import { ZardDemoCarouselOrientationComponent } from '@/shared/components/carousel/demo/orientation';
import { ZardDemoCarouselPluginsComponent } from '@/shared/components/carousel/demo/plugins';
import { ZardDemoCarouselSizeComponent } from '@/shared/components/carousel/demo/sizes';
import { ZardDemoCarouselSpacingComponent } from '@/shared/components/carousel/demo/spacing';

export const CAROUSEL = {
  componentName: 'carousel',
  componentType: 'carousel',
  description:
    'A slideshow component for cycling through elements with support for mouse drag, touch swipe, and automatic playback',
  examples: [
    {
      name: 'default',
      component: ZardDemoCarouselDefaultComponent,
    },
```

## 5. 本地改造任务清单（可逐条执行）

1. [ ] 在 `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/carousel/carousel.component.ts` 收敛 API 输入并补齐缺失能力（含默认值和类型）。
2. [ ] 统一根组件状态机与 a11y 契约（role/aria/keyboard path）并补文档示例。
3. [ ] 新增 `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/carousel/carousel.component.spec.ts`，覆盖关键行为回归。
