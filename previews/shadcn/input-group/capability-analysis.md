# input-group 源码能力差距报告

## 1. 组件映射

| 本地 | shadcn | zardui | 备注 |
|------|--------|--------|------|
| `input-group` | `@shadcn/input-group` | `input-group` | 本地 input-group 对标 shadcn/input-group 与 zardui/input-group。 |

## 2. 量化评分矩阵

评分范围：0-5（0.5 步进）。  
加权分计算：`维度得分 * 权重 / 5`。

| 维度 | 权重 | 本地 | shadcn | zardui | 评分依据（证据 ID） |
|------|------|------|--------|--------|---------------------|
| API 覆盖度 | 20 | 4.5 | 5.0 | 5.0 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 交互与状态语义 | 15 | 4.0 | 3.5 | 3.5 | E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2 |
| 组合与扩展能力 | 15 | 5.0 | 3.5 | 4.0 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 可访问性 | 15 | 5.0 | 4.0 | 4.0 | E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2 |
| 类型安全与开发体验 | 10 | 5.0 | 2.5 | 4.0 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 性能与资源管理 | 15 | 5.0 | 2.0 | 4.5 | E-LOCAL-2, E-SHADCN-1, E-ZARDUI-1 |
| 测试与稳定性证据 | 10 | 1.0 | 1.0 | 2.5 | E-LOCAL-1, E-ZARDUI-2 |
| **加权总分** | **100** | **87.0** | **66.0** | **81.0** |  |

## 3. Top 3 实现差距

### Gap-1: 本地 API 覆盖与对标实现存在差距
- 影响等级：高
- 差距陈述：本地在 API 覆盖维度与对标实现存在差距（相对 shadcn 差值 -0.5，相对 zardui (input-group) 差值 -0.5）。当前能力点分布在多个输入/子节点约定中，常见场景下缺少一条“最短实现路径”。
- 证据：E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1
- 本地改造建议：
  - 修改文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/input-group/input-group.component.ts`
  - API 变更：补齐核心输入（variant/size/state/appearance 中缺失项），并提供最小可用默认值。
  - 验收标准：在不写额外模板分支时可完成主流场景；文档示例覆盖新增输入。

### Gap-2: 本地交互语义与可访问性约束需要统一化
- 影响等级：中
- 差距陈述：本地交互、状态与 a11y 相关语义分散在模板/宿主/调用侧，缺少统一契约，导致行为一致性和回归验证成本偏高。
- 证据：E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2
- 本地改造建议：
  - 修改文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/input-group/input-group.component.ts`
  - 实现方式：把 role/aria/状态切换入口收敛到根组件，子组件只做展示。
  - 验收标准：键盘与读屏路径在默认示例可复现，关键状态切换只走一套逻辑。

### Gap-3: 本地测试证据不足，后续重构风险偏高
- 影响等级：高
- 差距陈述：当前本地测试文件数量为 0，难以为 API 扩展和行为重构提供足够回归保护。对标 zardui 该映射下有 1 个测试文件，稳定性基线更高。
- 证据：E-LOCAL-1, E-ZARDUI-2
- 本地改造建议：
  - 新增文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/input-group/input-group.component.spec.ts`
  - 测试覆盖：API 输入边界、关键交互路径、a11y 属性、异常分支。
  - 验收标准：新增 spec 在 CI 通过，覆盖核心输入和关键行为。

## 4. 源码证据（关键片段）

### E-LOCAL-1
- 实现方：local
- 文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/input-group/input-group.component.ts`
- 行号：`L19-L36`
- 结论标签：API/结构
```ts
 * ```
 */
@Component({
  selector: 'app-input-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="computedClass()"
      [attr.data-slot]="'input-group'"
      [attr.role]="'group'"
    >
      <ng-content />
    </div>
  `,
  host: {
    '[class.block]': 'true',
  },
})
```

### E-LOCAL-2
- 实现方：local
- 文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/input-group/input-group-addon.component.ts`
- 行号：`L60-L77`
- 结论标签：状态/可访问性
```ts
  private readonly elementRef = inject(ElementRef);

  protected readonly computedClass = computed(() =>
    cn(inputGroupAddonVariants({ align: this.align() }), this.class())
  );

  protected onAddonClick(event: MouseEvent): void {
    // If clicking on a button, don't focus the input
    const target = event.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    // Focus the first input in the parent input-group
    const parentGroup = this.elementRef.nativeElement.closest('[data-slot="input-group"]');
    if (parentGroup) {
      const input = parentGroup.querySelector('input') as HTMLInputElement | null;
      input?.focus();
    }
```

### E-SHADCN-1
- 实现方：shadcn
- 文件：`/tmp/shadcn-ui/apps/v4/registry/new-york-v4/ui/input-group.tsx`
- 行号：`L37-L54`
- 结论标签：API/变体
```tsx
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none [&>svg:not([class*='size-'])]:size-4 [&>kbd]:rounded-[calc(var(--radius)-5px)] group-data-[disabled=true]/input-group:opacity-50",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "order-first w-full justify-start px-3 pt-3 [.border-b]:pb-3 group-has-[>input]/input-group:pt-2.5",
        "block-end":
          "order-last w-full justify-start px-3 pb-3 [.border-t]:pt-3 group-has-[>input]/input-group:pb-2.5",
      },
    },
    defaultVariants: {
```

### E-SHADCN-2
- 实现方：shadcn
- 文件：`/tmp/shadcn-ui/apps/v4/registry/new-york-v4/examples/button-group-input-group.tsx`
- 行号：`L44-L59`
- 结论标签：语义/用法
```tsx
                  data-active={voiceEnabled}
                  className="data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 dark:data-[active=true]:bg-orange-800 dark:data-[active=true]:text-orange-100"
                  aria-pressed={voiceEnabled}
                >
                  <AudioLinesIcon />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Voice Mode</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  )
}
```

### E-ZARDUI-1
- 实现方：zardui
- 文件：`/tmp/zardui/libs/zard/src/lib/shared/components/input-group/input-group.component.ts`
- 行号：`L32-L49`
- 结论标签：API/模板
```ts
import { ZardLoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'z-input-group',
  imports: [ZardStringTemplateOutletDirective, ZardLoaderComponent, ZardIdDirective],
  template: `
    <ng-container zardId="input-group" #z="zardId">
      @let addonBefore = zAddonBefore();
      @if (addonBefore) {
        <div [class]="addonBeforeClasses()" [id]="addonBeforeId()" [attr.aria-disabled]="zDisabled() || zLoading()">
          <ng-container *zStringTemplateOutlet="addonBefore">{{ addonBefore }}</ng-container>
        </div>
      }

      <div [class]="inputWrapperClasses()">
        <ng-content select="input[z-input], textarea[z-input]" />

        @if (zLoading()) {
```

### E-ZARDUI-2
- 实现方：zardui
- 文件：`/tmp/zardui/libs/zard/src/lib/shared/components/input-group/demo/input-group.ts`
- 行号：`L1-L18`
- 结论标签：交互/测试
```ts
import { ZardDemoInputGroupBorderlessComponent } from './borderless';
import { ZardDemoInputGroupDefaultComponent } from './default';
import { ZardDemoInputGroupLoadingComponent } from './loading';
import { ZardDemoInputGroupSizeComponent } from './size';
import { ZardDemoInputGroupTextComponent } from './text';

export const INPUT_GROUP = {
  componentName: 'input-group',
  componentType: 'input-group',
  description: 'Display additional information or actions to an input or textarea.',
  examples: [
    {
      name: 'default',
      component: ZardDemoInputGroupDefaultComponent,
      column: true,
    },
    {
      name: 'text',
```

## 5. 本地改造任务清单（可逐条执行）

1. [ ] 在 `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/input-group/input-group.component.ts` 收敛 API 输入并补齐缺失能力（含默认值和类型）。
2. [ ] 统一根组件状态机与 a11y 契约（role/aria/keyboard path）并补文档示例。
3. [ ] 新增 `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/input-group/input-group.component.spec.ts`，覆盖关键行为回归。
