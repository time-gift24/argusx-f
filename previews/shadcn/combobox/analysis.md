# Combobox 组件能力分析

## 1. 组件概述

### 本地实现 (argusx-f)

- **路径**: `src/app/shared/ui/combobox/`
- **组件数**: 16 个子组件
- **架构**: 基于 Angular CDK Overlay + CdkListbox 实现
- **状态管理**: Angular Signals

### Zardui 实现

- **路径**: `/tmp/zardui/apps/web/public/components/combobox/`
- **架构**: 基于 Popover + Command 组合
- **文档**: API 和 Overview 已提供

### Shadcn (React)

- **架构**: 基于 Popover + Command 组件组合
- **依赖**: `@base-ui/react`

---

## 2. 功能对比

| 功能 | argusx-f (本地) | zardui | shadcn |
|------|-----------------|--------|--------|
| 单选模式 | ✅ | ✅ | ✅ |
| 多选模式 | ✅ | - | - |
| 搜索过滤 | ✅ | ✅ | ✅ |
| 分组展示 | ✅ | ✅ | ✅ |
| 禁用状态 | ✅ | ✅ | - |
| 清空按钮 | ✅ | - | - |
| Chips 多选 | ✅ | - | - |
| 表单集成 | ✅ (CVA) | ✅ | - |
| 下拉位置 | ✅ 可配置 | - | - |
| 动画效果 | ✅ | - | - |

---

## 3. 本地组件详细清单

### 核心组件

| 组件 | 说明 |
|------|------|
| `ComboboxComponent` | 根组件，提供状态管理和 CDK Overlay |
| `ComboboxInputComponent` | 搜索输入框 |
| `ComboboxChipsComponent` | 多选模式下的 chips 容器 |
| `ComboboxChipsInputComponent` | chips 内的输入框 |
| `ComboboxContentComponent` | 下拉面板容器 |
| `ComboboxListComponent` | 选项列表容器 |

### 修饰组件

| 组件 | 说明 |
|------|------|
| `ComboboxItemComponent` | 单个选项（支持 disabled） |
| `ComboboxTriggerComponent` | 触发按钮 |
| `ComboboxClearComponent` | 清空按钮 |
| `ComboboxValueComponent` | 显示选中值 |
| `ComboboxGroupComponent` | 选项分组 |
| `ComboboxLabelComponent` | 分组标签 |
| `ComboboxSeparatorComponent` | 分隔线 |
| `ComboboxEmptyComponent` | 无结果提示 |
| `ComboboxCollectionComponent` | 选项集合容器 |
| `ComboboxChipComponent` | 单个 chip（多选） |

---

## 4. API 对比

### argusx-f (本地) ComboboxComponent

```typescript
// Inputs
value: model<T | T[] | undefined>      // 双向绑定
multiple: input<boolean>(false)         // 多选模式
disabled: input<boolean>(false)         // 禁用
placeholder: input<string>              // 占位符
filterMode: input<boolean>(true)       // 搜索过滤
side: input<ComboboxSide>('bottom')    // 下拉方向
sideOffset: input<number>(6)           // 偏移量
align: input<ComboboxAlign>('start')   // 对齐方式
alignOffset: input<number>(0)          // 对齐偏移

// Output
valueChange: output<T | T[]>()         // 值变化事件

// Methods (via ComboboxRootToken)
openCombobox() / closeCombobox() / toggleCombobox()
selectValue() / deselectValue() / clearValue()
isSelected() / getDisplayValue()
```

### zardui Combobox

```typescript
// Properties
class: ClassValue
buttonVariant: 'default' | 'outline' | 'secondary' | 'ghost'
zWidth: 'default' | 'sm' | 'md' | 'lg' | 'full'
placeholder: string
searchPlaceholder: string
emptyText: string
disabled: boolean
searchable: boolean
value: string | null
options: ZardComboboxOption[]
groups: ZardComboboxGroup[]
ariaLabel: string
ariaDescribedBy: string

// Outputs
zValueChange: output<string | null>
zComboSelected: output<ZardComboboxOption>
```

### shadcn (React)

```tsx
// 基于 Popover + Command 组合
<Popover>
  <PopoverTrigger>
    <Button variant="outline" role="combobox">
      {value ? frameworks.find(...).label : "Select..."}
      <ChevronsUpDown />
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No result.</CommandEmpty>
        <CommandGroup>
          {frameworks.map((framework) => (
            <CommandItem onSelect={...}>
              {framework.label}
              <Check className={value === framework.value ? "opacity-100" : "opacity-0"} />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

---

## 5. 技术实现差异

| 方面 | argusx-f | zardui | shadcn |
|------|----------|--------|--------|
| 底层库 | Angular CDK | 自研 | Radix UI |
| 列表实现 | CdkListbox | Command | cmdk |
| 下拉定位 | CDK Overlay | Popover | Radix Popover |
| 状态管理 | Signals | - | React useState |
| 表单集成 | ControlValueAccessor | - | - |
| 多选支持 | Chips UI | - | - |
| 可访问性 | ARIA attributes | ariaLabel/ariaDescribedBy | ARIA attributes |

---

## 6. 本地实现亮点

1. **完整的多选支持**: 提供 Chips UI 体验，支持 chips 内输入和删除
2. **双向表单绑定**: 实现 `ControlValueAccessor`，可直接用于 Reactive Forms
3. **灵活的定位策略**: 支持 side、offset、align 等配置
4. **丰富的子组件**: 16 个组件可自由组合
5. **Signal 状态管理**: 符合 Angular v20+ 最佳实践

---

## 7. 待完善功能 (对比 shadcn)

- [ ] 下拉菜单组合 (combobox-dropdown-menu 示例)
- [ ] 响应式宽度支持
- [ ] 更多动画效果

---

## 8. 文件路径

- 本地源码: `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/combobox/`
- Zardui 文档: `/tmp/zardui/apps/web/public/components/combobox/doc/`
- Shadcn 注册: `@shadcn/combobox`

---

## 9. 结论

argusx-f 的 Combobox 实现是三个实现中最完整的:

- **相比 zardui**: 增加了多选模式、Chips UI、表单集成
- **相比 shadcn**: 功能相当，但更贴合 Angular 生态 (Signals + CDK)

该组件已具备生产级别的功能完整度，可直接用于业务开发。
