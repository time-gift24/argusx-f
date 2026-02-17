# Radio Group 组件能力分析

## 1. 本地实现分析

### 1.1 组件结构

本地组件位于 `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/radio-group/`，包含两个组件：

1. **RadioGroupComponent** (`app-radio-group`) - 单选组容器
2. **RadioItemComponent** (`app-radio-item`) - 单选项

### 1.2 RadioGroupComponent 能力

| 能力 | 支持情况 | 说明 |
|------|---------|------|
| v-model 双向绑定 | ✅ | 通过 `model<string>` 实现 |
| 禁用状态 | ✅ | 通过 `input<boolean>` 配置 |
| 名称自动生成 | ✅ | 自动生成唯一名称 |
| 必填验证 | ✅ | `required` input |
| 表单集成 | ✅ | 实现 `ControlValueAccessor` |
| 无障碍支持 | ✅ | `role="radiogroup"`, `aria-*` 属性 |

**Inputs:**
- `value`: model<string | undefined> - 当前选中的值
- `disabled`: input<boolean> - 是否禁用
- `name`: input<string> - 组名称
- `required`: input<boolean> - 是否必填
- `ariaLabelledBy`: input<string> - 无障碍标签

**Outputs:**
- 通过 model 实现双向绑定

### 1.3 RadioItemComponent 能力

| 能力 | 支持情况 | 说明 |
|------|---------|------|
| 值绑定 | ✅ | 通过 `value` input |
| 禁用状态 | ✅ | 支持独立禁用 + 继承组禁用 |
| 选中状态 | ✅ | computed 自动计算 |
| 键盘支持 | ✅ | Space/Enter 选中 |
| 自定义样式 | ✅ | `class` input |
| 无障碍支持 | ✅ | `role="radio"`, `aria-*` |

**Inputs:**
- `value`: input.required<string> - 选项值
- `disabled`: input<boolean> - 是否禁用
- `class`: input<string> - 自定义类名

### 1.4 技术特点

- 使用 Angular Signals (`signal`, `computed`, `model`)
- 使用 `ChangeDetectionStrategy.OnPush`
- 通过 `RADIO_GROUP_TOKEN` 实现父子组件通信
- 集成 Lucide 图标库
- 使用 Tailwind CSS 工具类
- 支持 `ng-content` 实现内容透传

### 1.5 使用示例

```html
<!-- 双向绑定方式 -->
<app-radio-group [(value)]="selectedOption">
  <app-radio-item value="option1">Option 1</app-radio-item>
  <app-radio-item value="option2">Option 2</app-radio-item>
</app-radio-group>

<!-- 表单控制方式 -->
<app-radio-group [formControl]="myControl">
  <app-radio-item value="a">A</app-radio-item>
  <app-radio-item value="b">B</app-radio-item>
</app-radio-group>

<!-- 带禁用状态 -->
<app-radio-group [(value)]="selected" [disabled]="isDisabled">
  <app-radio-item value="1">Option 1</app-radio-item>
  <app-radio-item value="2" [disabled]="true">Disabled Option</app-radio-item>
</app-radio-group>
```

---

## 2. Zardui 实现

**状态**: 无 zardui 实现（路径 `/tmp/zardui/apps/web/public/components/radio-group/` 不存在）

---

## 3. Shadcn 实现对比

### 3.1 Shadcn 组件信息

- **依赖**: radix-ui
- **类型**: registry:ui

### 3.2 Shadcn 代码结构

```tsx
// RadioGroup - 使用 Radix UI Primitive
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

// RadioGroupItem - 使用 Radix UI Primitive
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(...)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator ... />
    </RadioGroupPrimitive.Item>
  )
}
```

### 3.3 能力对比

| 能力 | 本地实现 | Shadcn 实现 |
|------|---------|------------|
| 双向绑定 | ✅ model | ✅ React props |
| 禁用状态 | ✅ | ✅ |
| 必填验证 | ✅ | ❌ (需自行处理) |
| 表单集成 | ✅ CVA | 需配合 react-hook-form |
| 无障碍 | ✅ | ✅ Radix 提供 |
| 键盘导航 | ✅ | ✅ Radix 提供 |
| 样式定制 | ✅ class input | ✅ className |

### 3.4 主要差异

1. **底层库**: 本地实现手写，Shadcn 依赖 Radix UI
2. **大小**: Shadcn 更轻量（约 30 行），本地实现更完整（约 290 行）
3. **复杂性**: 本地实现功能更完整（token 注入、computed 派生状态）
4. **无障碍**: Shadcn 依赖 Radix 自动处理，本地实现自行处理

---

## 4. 总结

### 4.1 本地实现优势

- 功能完整：支持表单集成、必填验证、无障碍
- 代码质量高：使用 Angular Signals、OnPush、类型安全
- 可维护性好：结构清晰，注释完整

### 4.2 潜在改进点

1. 缺少 `onValueChange` 事件输出（model 已支持）
2. 缺少键盘导航（方向键切换选项）
3. 可考虑支持 `orientation` 属性（水平/垂直布局）

### 4.3 组件成熟度

- **生产就绪**: ✅
- **符合项目规范**: ✅ (符合 CLAUDE.md 中的 Angular 规范)
- **测试覆盖**: 需验证
