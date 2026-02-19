# command API Diff

## API Matrix

| Component | Local (app-command-*) | Zardui (z-*) | Shadcn | Target API |
|-----------|----------------------|--------------|--------|------------|
| Root | app-command | z-command | Command | argusx-command |
| Input | app-command-input | z-command-input | CommandInput | argusx-command-input |
| List | app-command-list | z-command-list | CommandList | argusx-command-list |
| Empty | app-command-empty | z-command-empty | CommandEmpty | argusx-command-empty |
| Group | app-command-group | z-command-option-group | CommandGroup | argusx-command-group |
| Item | app-command-item | z-command-option | CommandItem | argusx-command-item |
| Separator | app-command-separator | z-command-divider | CommandSeparator | argusx-command-separator |
| Shortcut | app-command-shortcut | - | CommandShortcut | argusx-command-shortcut |

## Conflict Decisions

### 1. Selector 冲突
| Local | Shadcn | Decision |
|-------|--------|----------|
| `app-command` | - | 改为 `argusx-command` |
| `app-command-input` | - | 改为 `argusx-command-input` |
| `app-command-list` | - | 改为 `argusx-command-list` |
| `app-command-empty` | - | 改为 `argusx-command-empty` |
| `app-command-group` | - | 改为 `argusx-command-group` |
| `app-command-item` | - | 改为 `argusx-command-item` |
| `app-command-separator` | - | 改为 `argusx-command-separator` |
| `app-command-shortcut` | - | 改为 `argusx-command-shortcut` |

### 2. data-slot 属性对齐
| Component | Local | Shadcn | Decision |
|-----------|-------|--------|----------|
| Root | `data-slot="command"` | `data-slot="command"` | 保持一致 |
| Input wrapper | 无 | `data-slot="command-input-wrapper"` | 需添加外包装 div |
| Input | 无 | `data-slot="command-input"` | 需添加 |
| List | `data-slot="command-list"` | `data-slot="command-list"` | 保持一致 |
| Empty | `data-slot="command-empty"` | `data-slot="command-empty"` | 保持一致 |
| Group | `data-slot="command-group"` | `data-slot="command-group"` | 保持一致 |
| Item | `data-slot="command-item"` | `data-slot="command-item"` | 保持一致 |
| Separator | `data-slot="command-separator"` | `data-slot="command-separator"` | 保持一致 |
| Shortcut | `data-slot="command-shortcut"` | `data-slot="command-shortcut"` | 保持一致 |

### 3. CommandItem 选中状态
| Local | Shadcn | Decision |
|-------|--------|----------|
| `data-selected` | `data-[selected=true]` | 改为 shadcn 形式 |

## Non-conflict Extensions

以下为 ArgusX 自有扩展，需保持 plain 风格：

| Feature | Local | Extension | Plain Style |
|---------|-------|-----------|-------------|
| 自定义过滤函数 | `filterFn` input | 保留 | 默认 fuzzy search |
| 值绑定 | `value` (model) | 保留 | 双向绑定 |
| 禁用状态 | `disabled` input | 保留 | 禁用时 opacity-50 |
| Token 机制 | `CommandRootToken`, `CommandGroupToken` | 保留 | 组件间通信 |

## Missing APIs

| Component | Missing | Implementation |
|-----------|---------|----------------|
| CommandInput | 外包装 div | 添加 `data-slot="command-input-wrapper"` 的 div |
| Command | variant | 默认 plain 样式 |
| CommandItem | icon 支持 | 通过 ng-content 支持自定义图标 |

## Behavior Mismatches

| Behavior | Local | Zardui | Shadcn | Decision |
|----------|-------|--------|--------|----------|
| 搜索过滤 | 本地实现过滤逻辑 | zardui 实现更完整 | cmdk 库 | 保留本地逻辑，参考 zardui 优化 |
| 键盘导航 | 未完整实现 | 完整实现 arrow keys, enter, escape | - | 增强键盘导航 |
| 空状态显示 | 通过 hidden 属性 | computed signal | - | 保留本地实现 |

## Final Target API

### argusx-command
```typescript
@Component({
  selector: 'argusx-command',
  host: {
    '[attr.data-slot]': '"command"',
  }
})
export class ArgusxCommandComponent {
  readonly class = input<string>('');
  readonly value = model<T | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly filterFn = input<(item: CommandItemData<T>, search: string) => boolean>();
  readonly valueChange = output<T | undefined>();
}
```

### argusx-command-input
```typescript
@Component({
  selector: 'argusx-command-input',
  host: {
    '[attr.data-slot]': '"command-input"',
  }
})
export class ArgusxCommandInputComponent {
  readonly placeholder = input<string>('Type a command or search...');
  readonly class = input<string>('');
}
```

### argusx-command-list
```typescript
@Component({
  selector: 'argusx-command-list',
  host: {
    '[attr.data-slot]': '"command-list"',
  }
})
export class ArgusxCommandListComponent {
  readonly class = input<string>('');
}
```

### argusx-command-empty
```typescript
@Component({
  selector: 'argusx-command-empty',
  host: {
    '[attr.data-slot]': '"command-empty"',
  }
})
export class ArgusxCommandEmptyComponent {
  readonly class = input<string>('');
}
```

### argusx-command-group
```typescript
@Component({
  selector: 'argusx-command-group',
  host: {
    '[attr.data-slot]': '"command-group"',
    role: 'group',
  }
})
export class ArgusxCommandGroupComponent {
  readonly heading = input<string>('');
  readonly class = input<string>('');
}
```

### argusx-command-item
```typescript
@Component({
  selector: 'argusx-command-item',
  host: {
    '[attr.data-slot]': '"command-item"',
    '[attr.data-selected]': 'isSelected() ? "true" : null',
    '[attr.data-disabled]': 'disabled() ? "true" : null',
    role: 'option',
  }
})
export class ArgusxCommandItemComponent {
  readonly value = input.required<T>();
  readonly shortcut = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');
}
```

### argusx-command-separator
```typescript
@Component({
  selector: 'argusx-command-separator',
  host: {
    '[attr.data-slot]': '"command-separator"',
    role: 'separator',
  }
})
export class ArgusxCommandSeparatorComponent {
  readonly class = input<string>('');
}
```

### argusx-command-shortcut
```typescript
@Component({
  selector: 'argusx-command-shortcut',
  host: {
    '[attr.data-slot]': '"command-shortcut"',
  }
})
export class ArgusxCommandShortcutComponent {
  readonly class = input<string>('');
}
```
