# Switch 组件能力分析报告

## 1. 组件概述

### 本地组件
- **路径**: `src/app/shared/ui/switch/*.ts`
- **状态**: 不存在（项目未实现本地 switch 组件）

### ZardUI 组件
- **组件名**: `ZardSwitchComponent`
- **Selector**: `z-switch`
- **概述**: 一个可自定义的开关组件，提供最少的配置即可使用

### Shadcn 组件
- **依赖**: Radix UI
- **类型**: `registry:ui`
- **概述**: 一个切换控件，允许用户打开或关闭设置

---

## 2. ZardUI Switch API

### 属性 (Properties)

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `[(zChecked)]` | 开关状态（双向绑定） | `boolean` | `true` |
| `[zDisabled]` | 开关禁用状态 | `boolean` | `false` |
| `[zId]` | 开关 ID | `string` | - |
| `[zType]` | 开关类型 | `default \| destructive` | `default` |
| `[zSize]` | 开关尺寸 | `default \| sm \| lg` | `default` |
| `[class]` | 额外 CSS 类名 | `ClassValue` | `''` |

### 功能特性

1. **双向绑定**: 支持 `[(zChecked)]` 双向绑定
2. **禁用状态**: 支持 `[zDisabled]` 属性禁用开关
3. **尺寸变化**: 支持 `sm` / `default` / `lg` 三种尺寸
4. **类型变化**: 支持 `default` / `destructive` 两种样式类型
5. **表单支持**: 支持 Reactive Forms (`FormControl`)
6. **默认内容**: 支持 Angular 18+ 的 fallback content（默认插槽内容）

### Demo 展示

- `basic.md`: 基础用法 + 双向绑定 + destructive 类型
- `default.md`: 默认展示
- `destructive.md`: 破坏性样式
- `disabled.md`: 禁用状态 + 表单集成
- `size.md`: 三种尺寸展示

---

## 3. Shadcn Switch API (基于 Radix UI)

### Root 组件属性

| 属性 | 类型 | 默认值 |
|------|------|--------|
| `asChild` | `boolean` | `false` |
| `defaultChecked` | `boolean` | - |
| `checked` | `boolean` | - |
| `onCheckedChange` | `function` | - |
| `disabled` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `name` | `string` | - |
| `value` | `string` | `"on"` |

### Thumb 组件属性

| 属性 | 类型 | 默认值 |
|------|------|--------|
| `asChild` | `boolean` | `false` |

### 数据属性 (Data Attributes)

- `[data-state]`: `"checked"` 或 `"unchecked"`
- `[data-disabled]`: 禁用时存在

### 键盘交互

| 按键 | 动作 |
|------|------|
| `Space` | 切换状态 |
| `Enter` | 切换状态 |

### 功能特性

1. **完整键盘导航**: 支持空格键和回车键切换
2. **受控/非受控模式**: 支持两种模式
3. **表单支持**: 渲染 `input` 元素用于表单事件传递
4. **WAI-ARIA 合规**: 符合 switch 角色要求
5. **尺寸支持**: `size` prop 支持 small / default
6. **RTL 支持**: 支持从右到左的语言

---

## 4. 能力对比分析

| 能力 | ZardUI | Shadcn |
|------|--------|--------|
| 双向绑定 | `[(zChecked)]` | `checked` + `onCheckedChange` |
| 禁用状态 | `zDisabled` | `disabled` |
| 尺寸变化 | sm / default / lg | small / default |
| 样式类型 | default / destructive | - |
| 表单支持 | FormControl | name + value |
| 键盘导航 | - | Space / Enter |
| RTL 支持 | - | 支持 |
| 受控模式 | 支持 | 支持 |
| 非受控模式 | - | 支持 |

---

## 5. 实现建议

### 需要实现的功能

基于 ZardUI 现有能力和 Shadcn 的能力，建议实现以下功能：

1. **基础功能**
   - [x] 双向绑定 (`zChecked`)
   - [x] 禁用状态 (`zDisabled`)
   - [x] ID 支持 (`zId`)

2. **样式变体**
   - [x] 尺寸变化 (`zSize`: sm / default / lg)
   - [x] 类型变化 (`zType`: default / destructive)

3. **高级功能**
   - [ ] 表单集成 (Reactive Forms)
   - [ ] 键盘导航支持 (Space / Enter)
   - [ ] RTL 支持
   - [ ] 尺寸: small (Radix 支持)

4. **无障碍 (A11y)**
   - [x] ARIA role="switch"
   - [ ] 焦点管理
   - [ ] 键盘交互

### 组件结构建议

```typescript
@Component({
  selector: 'app-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  // 使用 ZardUI 类似的命名
  inputs: [
    'zChecked: checked',  // 双向绑定
    'zDisabled: disabled',
    'zId: id',
    'zType: type',
    'zSize: size',
  ],
  outputs: [
    'zCheckedChange: checkedChange',
  ],
})
export class SwitchComponent {
  readonly checked = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly id = input<string>('');
  readonly type = input<'default' | 'destructive'>('default');
  readonly size = input<'sm' | 'default' | 'lg'>('default');

  readonly checkedChange = output<boolean>();
}
```

---

## 6. 参考资源

- ZardUI: `/tmp/zardui/apps/web/public/components/switch/`
- Shadcn: https://ui.shadcn.com/docs/components/switch
- Radix UI: https://www.radix-ui.com/docs/primitives/components/switch
