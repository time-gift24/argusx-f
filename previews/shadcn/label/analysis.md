# Label 组件能力分析

## 1. 本地实现

### 文件路径
- `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/label/label.directive.ts`
- `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/label/index.ts`

### 实现方式
Angular Directive (`LabelDirective`)

### 核心能力

| 特性 | 状态 | 说明 |
|------|------|------|
| 基础样式 | 已实现 | 使用 CVA 定义样式：`text-xs/relaxed leading-none font-medium` |
| 禁用状态 | 已实现 | `group-data-[disabled=true]:opacity-50` 自动处理 |
| Peer 禁用样式 | 已实现 | `peer-disabled:opacity-50` 支持关联输入框禁用样式 |
| 可访问性 | 已实现 | `select-none` 防止误选，`for` 属性支持 |
| 自定义 class | 已实现 | 通过 `input<string>('')` 支持 |
| 数据槽 | 已实现 | `data-slot="label"` |

### 样式定义
```ts
const labelVariants = cva(
  "text-xs/relaxed leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
  {
    variants: {},
    defaultVariants: {},
  }
);
```

### 使用示例
```html
<label appLabel for="email">Email</label>
<input id="email" type="email" class="peer" />
```

---

## 2. Zardui 实现

**状态**: 不存在

Zardui 目录 `/tmp/zardui/apps/web/public/components/label/` 不存在。

---

## 3. Shadcn 实现

### 注册表信息
- **类型**: `registry:ui`
- **依赖**: radix-ui
- **官方文档**: https://ui.shadcn.com/docs/components/label

### Shadcn 原始实现
Shadcn 的 label 组件基于 Radix UI Label primitives 实现。

### 使用示例 (Shadcn)
```tsx
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import { Label } from "@/registry/new-york-v4/ui/label"

export default function LabelDemo() {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    </div>
  )
}
```

---

## 4. 能力对比

| 能力维度 | 本地实现 | Zardui | Shadcn |
|----------|----------|--------|--------|
| 实现形式 | Directive | N/A | Component |
| 依赖 Radix | 否 | N/A | 是 |
| CVA 样式 | 是 | N/A | 是 |
| 禁用状态 | 是 | N/A | 是 |
| Peer 样式 | 是 | N/A | 是 |
| htmlFor 支持 | 是 | N/A | 是 |

---

## 5. 分析总结

### 本地实现特点
1. **轻量级**: 使用 Directive 而非 Component，更符合 Angular 最佳实践
2. **无额外依赖**: 不依赖 Radix UI，直接使用原生 HTML label 语义
3. **Tailwind 优先**: 所有样式通过 Tailwind 类实现，无额外 CSS
4. **Peer 交互**: 良好支持与 `.peer` 类输入框的联动禁用效果
5. **CVA 支持**: 预留了 variant 扩展能力（当前为空 variants）

### 与 Shadcn 差异
- Shadcn 使用 Radix UI 作为底层，提供无障碍支持
- 本地实现专注于样式复用，通过原生 HTML 实现语义化
- 两者功能基本对等，本地实现更轻量

### 建议
当前本地实现已满足需求，无需额外改造。如需更强无障碍支持，可考虑引入 Radix UI Label。

---

## 6. 文件清单

| 路径 | 类型 | 说明 |
|------|------|------|
| `src/app/shared/ui/label/label.directive.ts` | Directive | 核心实现 |
| `src/app/shared/ui/label/index.ts` | Export | 模块导出 |
