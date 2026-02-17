# Dropdown Menu 组件能力分析

## 1. 组件概述

### 本地实现 (argusx-f)

- **路径**: `src/app/shared/ui/dropdown-menu/`
- **组件数**: 16 个子组件
- **架构**: 基于 Angular CDK Overlay 实现
- **状态管理**: Angular Signals

### Zardui 实现

- **路径**: 不存在 (`/tmp/zardui/apps/web/public/components/dropdown-menu/`)
- **状态**: 未实现

### Shadcn (React)

- **架构**: 基于 Radix UI Primitive
- **依赖**: `@radix-ui/react-dropdown-menu`
- **注册名**: `@shadcn/dropdown-menu`

---

## 2. 功能对比

| 功能 | argusx-f (本地) | zardui | shadcn |
|------|-----------------|--------|--------|
| 根组件 (DropdownMenu) | ✅ | - | ✅ |
| 触发器 (Trigger) | ✅ | - | ✅ |
| 内容面板 (Content) | ✅ | - | ✅ |
| 普通菜单项 (Item) | ✅ | - | ✅ |
| 可禁用菜单项 | ✅ | - | ✅ |
| 破坏性菜单项 (Destructive) | ✅ | - | ✅ |
| 复选框项 (Checkbox) | ✅ | - | ✅ |
| 单选组 (Radio Group) | ✅ | - | ✅ |
| 单选项 (Radio Item) | ✅ | - | ✅ |
| 标签 (Label) | ✅ | - | ✅ |
| 分组 (Group) | ✅ | - | ✅ |
| 分隔线 (Separator) | ✅ | - | ✅ |
| 快捷键提示 (Shortcut) | ✅ | - | ✅ |
| 子菜单 (Sub) | ✅ | - | ✅ |
| 子菜单触发器 (Sub Trigger) | ✅ | - | ✅ |
| 子菜单内容 (Sub Content) | ✅ | - | ✅ |
| 键盘导航 | ✅ | - | ✅ |
| 点击外部关闭 | ✅ | - | ✅ |
| Escape 关闭 | ✅ | - | ✅ |
| 对齐配置 | ✅ | - | ✅ |
| 偏移量配置 | ✅ | - | ✅ |
| 动画效果 | ✅ | - | ✅ |
| Portal 支持 | ✅ | - | ✅ |

---

## 3. 本地组件详细清单

### 核心组件

| 组件 | 说明 |
|------|------|
| `DropdownMenuComponent` | 根组件，提供 CDK Overlay 和状态管理 |
| `DropdownMenuTriggerComponent` | 触发按钮包装器 |
| `DropdownMenuTriggerDirective` | 触发器指令 |
| `DropdownMenuContentComponent` | 内容包装器 (API 兼容) |
| `DropdownMenuPortalComponent` | Portal 占位符 (API 兼容) |

### 菜单项组件

| 组件 | 说明 |
|------|------|
| `DropdownMenuItemComponent` | 普通菜单项，支持 disabled 和 destructive variant |
| `DropdownMenuCheckboxItemComponent` | 复选框菜单项，支持 checked 双向绑定 |
| `DropdownMenuRadioGroupComponent` | 单选组容器 |
| `DropdownMenuRadioItemComponent` | 单选项，与 radio group 配合使用 |

### 辅助组件

| 组件 | 说明 |
|------|------|
| `DropdownMenuGroupComponent` | 菜单分组容器 |
| `DropdownMenuLabelComponent` | 分组标签，支持 inset |
| `DropdownMenuSeparatorComponent` | 分隔线 |
| `DropdownMenuShortcutComponent` | 键盘快捷键提示 |

### 子菜单组件

| 组件 | 说明 |
|------|------|
| `DropdownMenuSubComponent` | 子菜单容器，提供状态管理 |
| `DropdownMenuSubTriggerComponent` | 子菜单触发器，支持 hover 和点击 |
| `DropdownMenuSubContentComponent` | 子菜单内容，使用固定定位 |

---

## 4. API 对比

### argusx-f (本地) DropdownMenuComponent

```typescript
// Inputs
open: model<boolean>                    // 双向绑定
align: input<DropdownMenuAlign>        // 对齐方式 ('start' | 'center' | 'end')
sideOffset: input<number>(4)           // 偏移量
minWidth: input<number>(128)           // 最小宽度
class: input<string>('')                // 自定义类

// Methods
openMenu() / closeMenu() / toggleMenu()
openMenuAndFocusFirstItem() / openMenuAndFocusLastItem()
```

### argusx-f DropdownMenuItemComponent

```typescript
// Inputs
inset: input<boolean>(false)            // 缩进
variant: input<DropdownMenuItemVariant> // 'default' | 'destructive'
disabled: input<boolean>(false)        // 禁用
class: input<string>('')                // 自定义类

// Output
select: output<void>()                  // 点击事件
```

### argusx-f DropdownMenuCheckboxItemComponent

```typescript
// Inputs
checked: input<boolean>(false)          // 选中状态
inset: input<boolean>(false)           // 缩进
disabled: input<boolean>(false)        // 禁用
class: input<string>('')                // 自定义类

// Output
checkedChange: output<boolean>()        // 状态变化事件
```

### argusx-f DropdownMenuRadioItemComponent

```typescript
// Inputs
value: input.required<string>()         // 选项值
inset: input<boolean>(false)            // 缩进
disabled: input<boolean>(false)        // 禁用
class: input<string>('')                // 自定义类
```

### argusx-f DropdownMenuSubComponent

```typescript
// Model
open: model<boolean>(false)             // 子菜单展开状态
```

### shadcn (React)

```tsx
// DropdownMenu
<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuCheckboxItem>Checkbox</DropdownMenuCheckboxItem>
    <DropdownMenuRadioGroup>
      <DropdownMenuRadioItem>Option 1</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
    <DropdownMenuSeparator />
    <DropdownMenuLabel>Label</DropdownMenuLabel>
    <DropdownMenuGroup>
      <DropdownMenuItem>Grouped Item</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>Sub Item</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>

// Props
// DropdownMenuContent: side, align, loop, onCloseAutoFocus, etc.
// DropdownMenuItem: inset, variant (default | destructive), disabled
// DropdownMenuCheckboxItem: checked, onCheckedChange
// DropdownMenuRadioGroup: value, onValueChange
// DropdownMenuSub: open, onOpenChange
```

---

## 5. 技术实现差异

| 方面 | argusx-f | zardui | shadcn |
|------|----------|--------|--------|
| 底层库 | Angular CDK | - | Radix UI |
| 定位系统 | CDK Overlay | - | Radix Portal + floating-ui |
| 状态管理 | Signals (model) | - | React useState |
| 动画 | Angular CDK + CSS | - | Radix animations |
| 子菜单定位 | 固定定位 (fixed) | - | Radix 自动计算 |
| 触发方式 | 点击 + 键盘 | - | 点击 + 键盘 |
| Portal | CDK Portal | - | Radix Portal |

---

## 6. 本地实现亮点

1. **完整的 API 兼容**: 提供与 shadcn 完全对齐的组件 API
2. **双向数据绑定**: 使用 Angular Signals `model()` 实现双向绑定
3. **键盘导航支持**: 完整的 ArrowUp/ArrowDown/Home/End/Escape 支持
4. **多种菜单项类型**: 支持普通项、复选项、单选项、破坏性项
5. **子菜单支持**: 完整的子菜单功能，支持 hover 展开
6. **可访问性**: 完整的 ARIA 属性支持 (aria-expanded, aria-haspopup, role)
7. **内容配置注册**: 支持通过 content 组件向根组件注册配置

---

## 7. 待完善功能 (对比 shadcn)

- [ ] Loop 功能 (菜单项循环导航)
- [ ] onCloseAutoFocus 回调
- [ ] onEscapeKeyDown 回调
- [ ] onPointerDownOutside 回调
- [ ] 侧边栏子菜单定位优化

---

## 8. 文件路径

- 本地源码: `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/dropdown-menu/`
- Shadcn 注册: `@shadcn/dropdown-menu`
- Shadcn 依赖: `@radix-ui/react-dropdown-menu`

---

## 9. 结论

argusx-f 的 Dropdown Menu 实现:

- **功能完整性**: 实现了与 shadcn 对齐的所有功能，包括菜单项类型、子菜单、键盘导航等
- **Angular 生态适配**: 使用 Angular CDK Overlay 和 Signals，符合 Angular v20+ 最佳实践
- **API 兼容性**: 组件命名和 API 设计与 shadcn 保持一致，便于迁移和对照学习
- **可访问性**: 完整的 ARIA 支持和键盘导航

该组件已具备生产级别的功能完整度，可直接用于业务开发。
