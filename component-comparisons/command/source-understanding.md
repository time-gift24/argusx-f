# command Source Understanding

## Mapping
- local: `command`
- zardui: `command`
- shadcn: `command`
- rationale: 组件名称一致

## ZardUI Evidence

| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command.component.ts` | 1-282 | 主组件，提供搜索、过滤、键盘导航 |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command-input.component.ts` | 1-143 | 搜索输入框组件 |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command-option.component.ts` | 1-141 | 选项组件，支持选中状态、键盘导航 |
| Z4 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command-list.component.ts` | 1-23 | 列表容器组件 |
| Z5 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command-empty.component.ts` | 1-38 | 空状态组件 |
| Z6 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command-option-group.component.ts` | 1-81 | 选项分组组件 |
| Z7 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command-divider.component.ts` | 1-43 | 分割线组件 |
| Z8 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/command.variants.ts` | 1-76 | 样式变体定义 |

### ZardUI API 清单

**ZardCommandComponent (z-command)**
- inputs: `size`, `class`
- outputs: `zCommandChange`, `zCommandSelected`
- 内部信号: `searchTerm`, `selectedIndex`, `filteredOptions`
- 方法: `onSearch`, `selectOption`, `onKeyDown`, `refreshOptions`, `focus`

**ZardCommandInputComponent (z-command-input)**
- inputs: `placeholder`, `class`
- outputs: `valueChange`
- 内部信号: `searchTerm`, `disabled`
- 方法: `onInput`, `focus`

**ZardCommandOptionComponent (z-command-option)**
- inputs: `zValue`, `zLabel`, `zCommand`, `zIcon`, `zShortcut`, `zDisabled`, `variant`, `class`, `parentCommand`, `commandGroup`
- 内部信号: `isSelected`
- 方法: `onClick`, `setSelected`, `focus`

**ZardCommandListComponent (z-command-list)**
- inputs: `class`

**ZardCommandEmptyComponent (z-command-empty)**
- inputs: `class`

**ZardCommandOptionGroupComponent (z-command-option-group)**
- inputs: `zLabel`, `class`

**ZardCommandDividerComponent (z-command-divider)**
- inputs: `class`

## Usage Evidence (Doc + Demo)

| id | file | scenario |
| --- | --- | --- |
| U1 | `/tmp/zardui/apps/web/public/components/command/demo/default.md` | 默认使用示例 |
| U2 | `/tmp/zardui/apps/web/public/components/command/doc/api.md` | API 文档 |
| U3 | `/tmp/zardui/libs/zard/src/lib/shared/components/command/demo/default.ts` | Demo 代码 |

## Local Baseline Evidence

| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/command/command.component.ts` | 1-510 | 主组件和所有子组件 |
| L2 | `src/app/shared/ui/command/index.ts` | 1-15 | 导出 |

### 本地现有 API

**CommandComponent (app-command)**
- selector: `app-command`
- inputs: `class`, `value` (model), `disabled`, `filterFn`
- outputs: `valueChange`
- 内部信号: `searchTerm`, `itemVisibilityMap`
- 方法: `selectValue`, `isSelected`, `registerItem`, `unregisterItem`
- Token: `CommandRootToken` (抽象类)

**CommandInputComponent (app-command-input)**
- selector: `app-command-input`
- inputs: `placeholder`, `class`

**CommandListComponent (app-command-list)**
- selector: `app-command-list`
- inputs: `class`

**CommandEmptyComponent (app-command-empty)**
- selector: `app-command-empty`
- inputs: `class`

**CommandGroupComponent (app-command-group)**
- selector: `app-command-group`
- inputs: `heading`, `class`
- Token: `CommandGroupToken` (抽象类)

**CommandSeparatorComponent (app-command-separator)**
- selector: `app-command-separator`
- inputs: `class`

**CommandItemComponent (app-command-item)**
- selector: `app-command-item`
- inputs: `value`, `shortcut`, `disabled`, `class`

**CommandShortcutComponent (app-command-shortcut)**
- selector: `app-command-shortcut`
- inputs: `class`

## Shadcn Baseline Evidence

| id | file | API |
| --- | --- | --- |
| S1 | registry:ui/command | Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandShortcut |

### shadcn API 关键特征

- 使用 `data-slot` 属性标识组件类型
- Command 是主容器，样式: `bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md`
- CommandInput 有 `data-slot="command-input-wrapper"` 外包装
- CommandList 有 `data-slot="command-list"`, max-h-[300px]
- CommandItem 有 `data-slot="command-item"`, 选中状态使用 `data-[selected=true]`
- CommandGroup 有 `data-slot="command-group"`
- CommandEmpty 有 `data-slot="command-empty"`
- CommandSeparator 有 `data-slot="command-separator"`
- CommandShortcut 有 `data-slot="command-shortcut"`
