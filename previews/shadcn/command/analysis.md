# Command Component Capability Analysis

## Overview

Command is a fast, composable, styled command menu component for Angular. It provides a searchable, keyboard-navigable list of commands/actions similar to Spotlight or Command Palette interfaces.

**Registry:** `@shadcn/command`
**Type:** `registry:ui`
**Dependency:** `cmdk`

---

## Component Structure

### Local Implementation (`/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/command/`)

| Component | Selector | Description |
|-----------|----------|-------------|
| `CommandComponent` | `app-command` | Root container for command palette |
| `CommandInputComponent` | `app-command-input` | Search input with search icon |
| `CommandListComponent` | `app-command-list` | Scrollable container for items |
| `CommandEmptyComponent` | `app-command-empty` | Shows when no results match |
| `CommandGroupComponent` | `app-command-group` | Groups related items with heading |
| `CommandItemComponent` | `app-command-item` | Selectable item with keyboard support |
| `CommandShortcutComponent` | `app-command-shortcut` | Displays keyboard shortcuts |
| `CommandSeparatorComponent` | `app-command-separator` | Visual divider |

### Zardui Implementation (`/tmp/zardui/apps/web/public/components/command/`)

| Component | Selector | Description |
|-----------|----------|-------------|
| `z-command` | `[z-command]` | Main palette container with size variants |
| `z-command-input` | `[z-command-input]` | Search input with debounce |
| `z-command-list` | `[z-command-list]` | Container with listbox semantics |
| `z-command-empty` | `[z-command-empty]` | Auto-shows/hides based on search |
| `z-command-option` | `[z-command-option]` | Selectable option with icon support |
| `z-command-option-group` | `[z-command-option-group]` | Groups options with label |
| `z-command-divider` | `[z-command-divider]` | Visual separator |

---

## API Comparison

### Command Root

| Property | Local | Zardui | Notes |
|----------|-------|--------|-------|
| `value` | `model<T>` | `zCommandChange` event | Local uses two-way binding |
| `class` | `input<string>` | `class` | Both support custom CSS |
| `disabled` | `input<boolean>` | - | Local has disabled state |
| `filterFn` | `input<FilterFunction>` | - | Local supports custom filter |

### Command Input

| Property | Local | Zardui | Notes |
|----------|-------|--------|-------|
| `placeholder` | `input<string>` | `placeholder` | Same default text |
| `class` | `input<string>` | `class` | Both support styling |

### Command Item/Option

| Property | Local | Zardui | Notes |
|----------|-------|--------|-------|
| `value` | `input.required<T>` | `zValue` | Local is generic |
| `shortcut` | `input<string>` | `zShortcut` | Same feature |
| `disabled` | `input<boolean>` | `zDisabled` | Same feature |
| `class` | `input<string>` | `class` | Both support styling |
| - | - | `zLabel` | Zardui requires label |
| - | - | `zIcon` | Zardui has icon support |
| - | - | `variant` | Zardui has destructive variant |

---

## Capabilities Analysis

### Features Present in Local Only

1. **Generic Type Support** - Local implementation uses `<T = unknown>` generics for type-safe values
2. **Custom Filter Function** - Supports custom filtering via `filterFn` input
3. **Signal-based State** - Uses Angular Signals (`signal`, `model`, `computed`)
4. **Two-way Binding** - Uses `model<T>` for v-model support
5. **Item Visibility Tracking** - Automatically tracks which items match search
6. **Host Data Attributes** - Rich `data-*` attributes for styling hooks

### Features Present in Zardui Only

1. **Size Variants** - Supports `sm`, `default`, `lg`, `xl` sizes
2. **Icon Support** - `zIcon` property for inline icons
3. **Destructive Variant** - `variant="destructive"` for destructive actions
4. **Debounced Input** - Built-in debounce on search input

### Shared Features

1. Search/filter functionality
2. Grouped items with headings
3. Keyboard shortcuts display
4. Empty state handling
5. Selection with visual feedback
6. Disabled state support
7. Separator/divider between groups

---

## Architecture Patterns

### Local Implementation
- **DI Token Pattern**: Uses `CommandRootToken` and `CommandGroupToken` for parent-child communication
- **Signal-based State**: All state managed via Angular Signals
- **OnPush Strategy**: All components use `ChangeDetectionStrategy.OnPush`
- **Content Projection**: Uses `<ng-content>` for flexible composition

### Zardui Implementation
- **Component-based**: More directive-style with `@Input`/`@Output`
- **Event-based Selection**: Uses `zCommandSelected` event for selection
- **Attribute Selectors**: Uses attribute selectors (`[z-command]`)

---

## Accessibility

### Local Implementation
- `role="group"` for command groups
- `role="option"` for command items
- `role="separator"` for separators
- `aria-selected` on selected items
- `aria-disabled` on disabled items
- Proper `data-*` attributes for styling states

### Zardui Implementation
- ARIA listbox semantics on command list
- `aria-label` support on inputs
- Proper role attributes

---

## Usage Example (Local)

```typescript
import { CommandComponents } from './shared/ui/command';

@Component({
  imports: [CommandComponents],
  template: `
    <app-command [(value)]="selectedValue" class="w-full max-w-md">
      <app-command-input placeholder="Search commands..." />
      <app-command-list>
        <app-command-empty>No results found.</app-command-empty>

        <app-command-group heading="Actions">
          <app-command-item [value]="'create'">
            Create New
            <app-command-shortcut>⌘N</app-command-shortcut>
          </app-command-item>
          <app-command-item [value]="'open'">
            Open File
            <app-command-shortcut>⌘O</app-command-shortcut>
          </app-command-item>
        </app-command-group>

        <app-command-separator />

        <app-command-group heading="Navigation">
          <app-command-item [value]="'dashboard'">Dashboard</app-command-item>
        </app-command-group>
      </app-command-list>
    </app-command>
  `
})
export class DemoComponent {
  selectedValue = model<string | undefined>(undefined);
}
```

---

## Conclusion

The local implementation (`app-command-*`) is more aligned with Angular best practices:
- Uses modern Angular Signals for reactive state management
- Provides generic type support for type-safe values
- Implements two-way binding with `model<T>`
- Supports custom filtering logic
- Rich host data attributes for styling flexibility

The Zardui implementation has some additional features like size variants and icon support that could be considered for enhancement.

Both implementations are feature-complete command palettes that support search, filtering, grouping, keyboard shortcuts, and selection.
