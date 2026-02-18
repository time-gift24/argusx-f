# toast 源码能力差距报告

## 1. 组件映射

| 本地 | shadcn | zardui | 备注 |
|------|--------|--------|------|
| `toast` | `@shadcn/sonner` | `toast` | 本地 toast 对标 shadcn/sonner 与 zardui/toast。 |

## 2. 量化评分矩阵

评分范围：0-5（0.5 步进）。  
加权分计算：`维度得分 * 权重 / 5`。

| 维度 | 权重 | 本地 | shadcn | zardui | 评分依据（证据 ID） |
|------|------|------|--------|--------|---------------------|
| API 覆盖度 | 20 | 4.5 | 2.5 | 3.5 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 交互与状态语义 | 15 | 3.0 | 2.5 | 2.5 | E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2 |
| 组合与扩展能力 | 15 | 2.5 | 2.0 | 2.0 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 可访问性 | 15 | 2.5 | 2.0 | 2.0 | E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2 |
| 类型安全与开发体验 | 10 | 4.5 | 2.0 | 4.0 | E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1 |
| 性能与资源管理 | 15 | 4.0 | 2.0 | 3.5 | E-LOCAL-2, E-SHADCN-1, E-ZARDUI-1 |
| 测试与稳定性证据 | 10 | 1.0 | 1.0 | 1.0 | E-LOCAL-1, E-ZARDUI-2 |
| **加权总分** | **100** | **65.0** | **41.5** | **54.0** |  |

## 3. Top 3 实现差距

### Gap-1: 本地 API 覆盖与对标实现存在差距
- 影响等级：高
- 差距陈述：本地在 API 覆盖维度与对标实现存在差距（相对 shadcn 差值 2.0，相对 zardui (toast) 差值 1.0）。当前能力点分布在多个输入/子节点约定中，常见场景下缺少一条“最短实现路径”。
- 证据：E-LOCAL-1, E-SHADCN-1, E-ZARDUI-1
- 本地改造建议：
  - 修改文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/toast/toast.component.ts`
  - API 变更：补齐核心输入（variant/size/state/appearance 中缺失项），并提供最小可用默认值。
  - 验收标准：在不写额外模板分支时可完成主流场景；文档示例覆盖新增输入。

### Gap-2: 本地交互语义与可访问性约束需要统一化
- 影响等级：中
- 差距陈述：本地交互、状态与 a11y 相关语义分散在模板/宿主/调用侧，缺少统一契约，导致行为一致性和回归验证成本偏高。
- 证据：E-LOCAL-2, E-SHADCN-2, E-ZARDUI-2
- 本地改造建议：
  - 修改文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/toast/toast.component.ts`
  - 实现方式：把 role/aria/状态切换入口收敛到根组件，子组件只做展示。
  - 验收标准：键盘与读屏路径在默认示例可复现，关键状态切换只走一套逻辑。

### Gap-3: 本地测试证据不足，后续重构风险偏高
- 影响等级：高
- 差距陈述：当前本地测试文件数量为 0，难以为 API 扩展和行为重构提供足够回归保护。对标侧测试也有限，但本地仍缺少最小回归基线。
- 证据：E-LOCAL-1, E-ZARDUI-2
- 本地改造建议：
  - 新增文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/toast/toast.component.spec.ts`
  - 测试覆盖：API 输入边界、关键交互路径、a11y 属性、异常分支。
  - 验收标准：新增 spec 在 CI 通过，覆盖核心输入和关键行为。

## 4. 源码证据（关键片段）

### E-LOCAL-1
- 实现方：local
- 文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/toast/toast.component.ts`
- 行号：`L12-L29`
- 结论标签：API/结构
```ts
 * Individual Toast Item Component
 */
@Component({
  selector: 'app-toast-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div
      [class]="computedClass()"
      role="alert"
      [attr.data-state]="toast().state ?? 'show'"
      [attr.data-position]="position()"
      [attr.data-type]="toast().type">
      <!-- Icon -->
      @if (toast().type !== 'loading') {
        <div class="shrink-0" [class]="iconClass()">
          <lucide-icon [img]="icon()" class="size-4" />
        </div>
      } @else {
```

### E-LOCAL-2
- 实现方：local
- 文件：`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/toast/index.ts`
- 行号：`L1-L3`
- 结论标签：状态/可访问性
```ts
export * from './toast.component';
export * from './toast.service';
```

### E-SHADCN-1
- 实现方：shadcn
- 文件：`/tmp/shadcn-ui/apps/v4/registry/new-york-v4/ui/sonner.tsx`
- 行号：`L38-L41`
- 结论标签：API/变体
```tsx
}

export { Toaster }
```

### E-SHADCN-2
- 实现方：shadcn
- 文件：`/tmp/shadcn-ui/apps/v4/registry/new-york-v4/examples/sonner-demo.tsx`
- 行号：`L8-L25`
- 结论标签：语义/用法
```tsx
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
  )
}
```

### E-ZARDUI-1
- 实现方：zardui
- 文件：`/tmp/zardui/libs/zard/src/lib/shared/components/toast/toast.component.ts`
- 行号：`L8-L25`
- 结论标签：API/模板
```ts
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-toast, z-toaster',
  imports: [NgxSonnerToaster],
  standalone: true,
  template: `
    <ngx-sonner-toaster
      [theme]="theme()"
      [class]="classes()"
      [position]="position()"
      [richColors]="richColors()"
      [expand]="expand()"
      [duration]="duration()"
      [visibleToasts]="visibleToasts()"
      [closeButton]="closeButton()"
      [toastOptions]="toastOptions()"
      [dir]="dir()"
```

### E-ZARDUI-2
- 实现方：zardui
- 文件：`/tmp/zardui/libs/zard/src/lib/shared/components/toast/demo/toast.ts`
- 行号：`L1-L18`
- 结论标签：交互/测试
```ts
import { ZardDemoToastAdvancedComponent } from './advanced';
import { ZardDemoToastDefaultComponent } from './default';
import { ZardDemoToastDestructiveComponent } from './destructive';
import { ZardDemoToastLoadingComponent } from './loading';
import { ZardDemoToastPositionComponent } from './position';
import { ZardDemoToastSuccessComponent } from './success';

export const TOAST = {
  componentName: 'toast',
  componentType: 'toast',
  description: 'A succinct message that is displayed temporarily.',
  examples: [
    {
      name: 'default',
      component: ZardDemoToastDefaultComponent,
    },
    {
      name: 'destructive',
```

## 5. 本地改造任务清单（可逐条执行）

1. [ ] 在 `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/toast/toast.component.ts` 收敛 API 输入并补齐缺失能力（含默认值和类型）。
2. [ ] 统一根组件状态机与 a11y 契约（role/aria/keyboard path）并补文档示例。
3. [ ] 新增 `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/toast/toast.component.spec.ts`，覆盖关键行为回归。
