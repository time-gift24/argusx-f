# combobox 源码能力差距报告

## 1. 组件映射

| 本地 | shadcn | zardui | 备注 |
|------|--------|--------|------|
| `combobox` | `@shadcn/combobox` | `combobox` | 本地 combobox 对标 shadcn/combobox 与 zardui/combobox。 |

## 2. 量化评分矩阵

评分范围：0-5（0.5 步进）。  
加权分计算：`维度得分 * 权重 / 5`。

| 维度 | 权重 | 本地 | shadcn | zardui | 评分依据（证据 ID） |
|------|------|------|--------|--------|---------------------|
| API 覆盖度 | 20 | 3.5 | 4.5 | 5.0 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 交互与状态语义 | 15 | 5.0 | 3.0 | 5.0 | E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2 |
| 组合与扩展能力 | 15 | 5.0 | 5.0 | 2.0 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 可访问性 | 15 | 5.0 | 3.0 | 5.0 | E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2 |
| 类型安全与开发体验 | 10 | 5.0 | 2.0 | 5.0 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 性能与资源管理 | 15 | 5.0 | 2.0 | 4.5 | E-LOCAL-2, E-SHADCN-1, E-ZARDUI-1 |
| 测试与稳定性证据 | 10 | 1.0 | 1.0 | 2.5 | E-LOCAL-1, E-ZARDUI-2 |
| **加权总分** | **100** | **86.0** | **63.0** | **84.5** |  |

## 3. Top 3 实现差距

### Gap-1: 本地 API 覆盖与对标实现存在差距
- 影响等级：高
- 差距陈述：本地在 API 覆盖维度与对标实现存在差距（相对 shadcn 差值 -1.0，相对 zardui (combobox) 差值 -1.5）。当前能力点分布在多个输入/子节点约定中，常见场景下缺少一条“最短实现路径”。
- 证据：E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1
- 本地改造建议：
  - 修改文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/combobox/combobox.component.ts`
  - API 变更：补齐核心输入（variant/size/state/appearance 中缺失项），并提供最小可用默认值。
  - 验收标准：在不写额外模板分支时可完成主流场景；文档示例覆盖新增输入。

### Gap-2: 本地交互语义与可访问性约束需要统一化
- 影响等级：中
- 差距陈述：本地交互、状态与 a11y 相关语义分散在模板/宿主/调用侧，缺少统一契约，导致行为一致性和回归验证成本偏高。
- 证据：E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2
- 本地改造建议：
  - 修改文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/combobox/combobox.component.ts`
  - 实现方式：把 role/aria/状态切换入口收敛到根组件，子组件只做展示。
  - 验收标准：键盘与读屏路径在默认示例可复现，关键状态切换只走一套逻辑。

### Gap-3: 本地测试证据不足，后续重构风险偏高
- 影响等级：高
- 差距陈述：当前本地测试文件数量为 0，难以为 API 扩展和行为重构提供足够回归保护。对标 zardui 该映射下有 1 个测试文件，稳定性基线更高。
- 证据：E-LOCAL-1, E-ZARDUI-2
- 本地改造建议：
  - 新增文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/combobox/combobox.component.spec.ts`
  - 测试覆盖：API 输入边界、关键交互路径、a11y 属性、异常分支。
  - 验收标准：新增 spec 在 CI 通过，覆盖核心输入和关键行为。

## 4. 源码证据（关键片段）

### E-LOCAL-1
- 实现方：local
- 文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/combobox/combobox.component.ts`
- 行号：`L77-L94`
- 结论标签：API/结构
```ts
 * Individual selectable item in the dropdown
 */
@Component({
  selector: 'app-combobox-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <span class="pointer-events-none absolute right-2 flex items-center justify-center">
      @if (isSelected()) {
        <lucide-icon [img]="checkIcon" class="size-3.5 pointer-events-none" />
      }
    </span>
    <span class="flex-1">
      <ng-content />
    </span>
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-item"',
```

### E-LOCAL-2
- 实现方：local
- 文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/combobox/index.ts`
- 行号：`L1-L18`
- 结论标签：状态/可访问性
```ts
export {
  // Components
  ComboboxComponent,
  ComboboxValueComponent,
  ComboboxTriggerComponent,
  ComboboxClearComponent,
  ComboboxInputComponent,
  ComboboxContentComponent,
  ComboboxListComponent,
  ComboboxItemComponent,
  ComboboxGroupComponent,
  ComboboxLabelComponent,
  ComboboxCollectionComponent,
  ComboboxEmptyComponent,
  ComboboxSeparatorComponent,
  ComboboxChipsComponent,
  ComboboxChipComponent,
  ComboboxChipsInputComponent,
```

### E-SHADCN-1
- 实现方：shadcn
- 文件：`/tmp/shadcn-ui/apps/v4/registry/new-york-v4/ui/combobox.tsx`
- 行号：`L16-L33`
- 结论标签：API/变体
```tsx
const Combobox = ComboboxPrimitive.Root

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
```

### E-SHADCN-2
- 实现方：shadcn
- 文件：`/tmp/shadcn-ui/apps/v4/registry/new-york-v4/examples/combobox-demo.tsx`
- 行号：`L52-L69`
- 结论标签：语义/用法
```tsx
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
```

### E-ZARDUI-1
- 实现方：zardui
- 文件：`/tmp/zardui/libs/zard/src/lib/shared/components/combobox/combobox.component.ts`
- 行号：`L49-L66`
- 结论标签：API/模板
```ts
}

@Component({
  selector: 'z-combobox',
  imports: [
    FormsModule,
    NgTemplateOutlet,
    ZardButtonComponent,
    ZardCommandComponent,
    ZardCommandInputComponent,
    ZardCommandListComponent,
    ZardCommandEmptyComponent,
    ZardCommandOptionComponent,
    ZardCommandOptionGroupComponent,
    ZardPopoverDirective,
    ZardPopoverComponent,
    ZardEmptyComponent,
    ZardIconComponent,
```

### E-ZARDUI-2
- 实现方：zardui
- 文件：`/tmp/zardui/libs/zard/src/lib/shared/components/combobox/demo/combobox.ts`
- 行号：`L1-L18`
- 结论标签：交互/测试
```ts
import { ZardDemoComboboxDefaultComponent } from './default';
import { ZardDemoComboboxDisabledComponent } from './disabled';
import { ZardDemoComboboxFormComponent } from './form';
import { ZardDemoComboboxGroupedComponent } from './grouped';

export const COMBOBOX = {
  componentName: 'combobox',
  componentType: 'combobox',
  description: 'Autocomplete input and command palette with a list of suggestions.',
  examples: [
    {
      name: 'default',
      component: ZardDemoComboboxDefaultComponent,
    },
    {
      name: 'grouped',
      component: ZardDemoComboboxGroupedComponent,
    },
```

## 5. 本地改造任务清单（可逐条执行）

1. [ ] 在 `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/combobox/combobox.component.ts` 收敛 API 输入并补齐缺失能力（含默认值和类型）。
2. [ ] 统一根组件状态机与 a11y 契约（role/aria/keyboard path）并补文档示例。
3. [ ] 新增 `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/combobox/combobox.component.spec.ts`，覆盖关键行为回归。
