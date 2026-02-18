# checkbox 源码能力差距报告

## 1. 组件映射

| 本地 | shadcn | zardui | 备注 |
|------|--------|--------|------|
| `checkbox` | `@shadcn/checkbox` | `checkbox` | 本地 checkbox 对标 shadcn/checkbox 与 zardui/checkbox。 |

## 2. 量化评分矩阵

评分范围：0-5（0.5 步进）。  
加权分计算：`维度得分 * 权重 / 5`。

| 维度 | 权重 | 本地 | shadcn | zardui | 评分依据（证据 ID） |
|------|------|------|--------|--------|---------------------|
| API 覆盖度 | 20 | 2.5 | 3.5 | 5.0 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 交互与状态语义 | 15 | 3.5 | 3.0 | 2.5 | E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2 |
| 组合与扩展能力 | 15 | 2.5 | 3.0 | 2.0 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 可访问性 | 15 | 3.5 | 3.5 | 2.0 | E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2 |
| 类型安全与开发体验 | 10 | 3.5 | 2.5 | 4.0 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 性能与资源管理 | 15 | 3.5 | 2.0 | 4.5 | E-LOCAL-2, E-SHADCN-1, E-ZARDUI-1 |
| 测试与稳定性证据 | 10 | 1.0 | 1.0 | 2.5 | E-LOCAL-1, E-ZARDUI-2 |
| **加权总分** | **100** | **58.0** | **55.5** | **66.0** |  |

## 3. Top 3 实现差距

### Gap-1: 本地 API 覆盖与对标实现存在差距
- 影响等级：高
- 差距陈述：本地在 API 覆盖维度与对标实现存在差距（相对 shadcn 差值 -1.0，相对 zardui (checkbox) 差值 -2.5）。当前能力点分布在多个输入/子节点约定中，常见场景下缺少一条“最短实现路径”。
- 证据：E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1
- 本地改造建议：
  - 修改文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/checkbox/checkbox.component.ts`
  - API 变更：补齐核心输入（variant/size/state/appearance 中缺失项），并提供最小可用默认值。
  - 验收标准：在不写额外模板分支时可完成主流场景；文档示例覆盖新增输入。

### Gap-2: 本地交互语义与可访问性约束需要统一化
- 影响等级：中
- 差距陈述：本地交互、状态与 a11y 相关语义分散在模板/宿主/调用侧，缺少统一契约，导致行为一致性和回归验证成本偏高。
- 证据：E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2
- 本地改造建议：
  - 修改文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/checkbox/checkbox.component.ts`
  - 实现方式：把 role/aria/状态切换入口收敛到根组件，子组件只做展示。
  - 验收标准：键盘与读屏路径在默认示例可复现，关键状态切换只走一套逻辑。

### Gap-3: 本地测试证据不足，后续重构风险偏高
- 影响等级：高
- 差距陈述：当前本地测试文件数量为 0，难以为 API 扩展和行为重构提供足够回归保护。对标 zardui 该映射下有 1 个测试文件，稳定性基线更高。
- 证据：E-LOCAL-1, E-ZARDUI-2
- 本地改造建议：
  - 新增文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/checkbox/checkbox.component.spec.ts`
  - 测试覆盖：API 输入边界、关键交互路径、a11y 属性、异常分支。
  - 验收标准：新增 spec 在 CI 通过，覆盖核心输入和关键行为。

## 4. 源码证据（关键片段）

### E-LOCAL-1
- 实现方：local
- 文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/checkbox/checkbox.component.ts`
- 行号：`L59-L76`
- 结论标签：API/结构
```ts
 * Reference: .vendor/aim/components/ui/checkbox.tsx
 */
@Component({
  selector: 'app-checkbox',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <button
      type="button"
      [id]="id()"
      [class]="computedClass()"
      [attr.data-state]="state()"
      [attr.data-disabled]="disabled() ? '' : null"
      [attr.aria-checked]="ariaChecked()"
      [attr.aria-required]="required() || null"
      [attr.name]="name() || null"
      [attr.value]="value() || null"
      [disabled]="disabled()"
      (click)="toggle()"
```

### E-LOCAL-2
- 实现方：local
- 文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/checkbox/index.ts`
- 行号：`L1-L16`
- 结论标签：状态/可访问性
```ts
/**
 * Checkbox Component
 *
 * A checkbox component that supports three states: checked, unchecked, and indeterminate.
 * Integrates with Angular Reactive Forms.
 *
 * @example
 * ```html
 * <app-checkbox [(checked)]="rememberMe">Remember me</app-checkbox>
 * ```
 *
 * Reference: .vendor/aim/components/ui/checkbox.tsx
 */

export { CheckboxComponent, CheckboxComponents } from './checkbox.component';
```

### E-SHADCN-1
- 实现方：shadcn
- 文件：`/tmp/shadcn-ui/apps/v4/registry/new-york-v4/ui/checkbox.tsx`
- 行号：`L7-L24`
- 结论标签：API/变体
```tsx
import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
```

### E-SHADCN-2
- 实现方：shadcn
- 文件：`/tmp/shadcn-ui/apps/v4/registry/new-york-v4/examples/checkbox-demo.tsx`
- 行号：`L24-L41`
- 结论标签：语义/用法
```tsx
        <Label htmlFor="toggle">Enable notifications</Label>
      </div>
      <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
        <Checkbox
          id="toggle-2"
          defaultChecked
          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
        />
        <div className="grid gap-1.5 font-normal">
          <p className="text-sm leading-none font-medium">
            Enable notifications
          </p>
          <p className="text-muted-foreground text-sm">
            You can enable or disable notifications at any time.
          </p>
        </div>
      </Label>
    </div>
```

### E-ZARDUI-1
- 实现方：zardui
- 文件：`/tmp/zardui/libs/zard/src/lib/shared/components/checkbox/checkbox.component.ts`
- 行号：`L29-L46`
- 结论标签：API/模板
```ts
type OnChangeType = (value: boolean) => void;

@Component({
  selector: 'z-checkbox, [z-checkbox]',
  imports: [ZardIconComponent, ZardIdDirective],
  template: `
    <main class="relative flex" zardId="checkbox" #z="zardId">
      <input
        #input
        type="checkbox"
        name="checkbox"
        [id]="z.id()"
        [class]="classes()"
        [checked]="checked()"
        [disabled]="disabled()"
        (blur)="onCheckboxBlur()"
        (click)="onCheckboxChange()"
      />
```

### E-ZARDUI-2
- 实现方：zardui
- 文件：`/tmp/zardui/libs/zard/src/lib/shared/components/checkbox/demo/checkbox.ts`
- 行号：`L1-L18`
- 结论标签：交互/测试
```ts
import { ZardDemoCheckboxDefaultComponent } from './default';
import { ZardDemoCheckboxDestructiveComponent } from './destructive';
import { ZardDemoCheckboxDisabledComponent } from './disabled';
import { ZardDemoCheckboxShapeComponent } from './shape';
import { ZardDemoCheckboxSizeComponent } from './size';

export const CHECKBOX = {
  componentName: 'checkbox',
  componentType: 'checkbox',
  description: 'A control that allows the user to toggle between checked and not checked.',
  examples: [
    {
      name: 'default',
      component: ZardDemoCheckboxDefaultComponent,
    },
    {
      name: 'destructive',
      component: ZardDemoCheckboxDestructiveComponent,
```

## 5. 本地改造任务清单（可逐条执行）

1. [ ] 在 `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/checkbox/checkbox.component.ts` 收敛 API 输入并补齐缺失能力（含默认值和类型）。
2. [ ] 统一根组件状态机与 a11y 契约（role/aria/keyboard path）并补文档示例。
3. [ ] 新增 `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/checkbox/checkbox.component.spec.ts`，覆盖关键行为回归。
