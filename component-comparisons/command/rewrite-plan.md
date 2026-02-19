# command Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
- [x] remove conflicting local/zardui primary entries
  - Selector 从 `app-*` 改为 `argusx-*`
  - 已添加 data-slot 属性对齐 shadcn

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
  - 保留 `filterFn` 自定义过滤函数
  - 保留 `value` model 双向绑定
  - 保留 `disabled` input
  - 保留 CommandRootToken, CommandGroupToken 机制
- [x] ensure extension does not break shadcn main path
  - 扩展 API 不影响 shadcn 主路径
- [x] set plain default style behavior
  - 使用 plain 风格默认样式

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
- [x] keep single canonical API path only

## Naming Migration (z -> argusx)
- [x] selector migration
  - `app-command` -> `argusx-command`
  - `app-command-input` -> `argusx-command-input`
  - 等等
- [x] input/output/type symbol migration
  - 类名从 `CommandComponent` 改为 `ArgusxCommandComponent`
  - 导出从 `CommandComponents` 改为 `ArgusxCommandComponents`
- [x] index export migration

## shadcn API Alignment
- [x] API surface alignment
  - 所有组件 selector 和 data-slot 属性已对齐
- [x] behavior alignment
  - 样式对齐 shadcn
- [x] accessibility alignment
  - role="group", role="option", role="separator"
  - aria-selected, aria-disabled 属性

## Plain Style Alignment
- [x] default variant/style is plain
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals
  - 使用 CSS 变量如 bg-popover, text-popover-foreground 等

## File-level Plan
1. `src/app/shared/ui/command/command.component.ts` - 已完成
2. `src/app/shared/ui/command/index.ts`3. `src/app/preview/ - 已完成
command-preview.component.ts` - 已完成

## 主要改动

### 1. Selector 迁移
| 旧 (app-*) | 新 (argusx-*) |
|------------|---------------|
| app-command | argusx-command |
| app-command-input | argusx-command-input |
| app-command-list | argusx-command-list |
| app-command-empty | argusx-command-empty |
| app-command-group | argusx-command-group |
| app-command-item | argusx-command-item |
| app-command-separator | argusx-command-separator |
| app-command-shortcut | argusx-command-shortcut |

### 2. Class 名称迁移
| 旧 | 新 |
|---- CommandComponent | ArgusxCommandComponent|-----|
| |
| CommandInputComponent | ArgusxCommandInputComponent |
| CommandListComponent | ArgusxCommandListComponent |
| CommandEmptyComponent | ArgusxCommandEmptyComponent |
| CommandGroupComponent | ArgusxCommandGroupComponent |
| CommandItemComponent | ArgusxCommandItemComponent |
| CommandSeparatorComponent | ArgusxCommandSeparatorComponent |
| CommandShortcutComponent | ArgusxCommandShortcutComponent |
| CommandComponents | ArgusxCommandComponents |

### 3. data-slot 属性对齐
- Command: `data-slot="command"`
- CommandInput: 添加外包装 `data-slot="command-input-wrapper"` 和内部 `data-slot="command-input"`
- CommandList: `data-slot="command-list"`
- CommandEmpty: `data-slot="command-empty"`
- CommandGroup: `data-slot="command-group"`
- CommandItem: `data-slot="command-item"`
- CommandSeparator: `data-slot="command-separator"`
- CommandShortcut: `data-slot="command-shortcut"`

### 4. 样式对齐 shadcn
- Command 容器: `bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md`
- CommandList: `max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto`
- CommandItem: `data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground`

### 5. ArgusX 扩展保留
- `filterFn` input - 自定义过滤函数
- `value` model - 双向绑定
- `disabled` input - 禁用状态
- CommandRootToken, CommandGroupToken - 组件间通信
