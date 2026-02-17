# Input Group Component Analysis

## Overview

The `input-group` component provides a flexible container for grouping input elements with addons (prefixes/suffixes). It improves usability by combining inputs with icons, text, buttons, or other content.

## Component Architecture

### Local Implementation (argusx-f)

Located at: `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/input-group/`

The local implementation is built as a **modular component system** aligned with the official shadcn/ui preset:

| Component | Selector | Purpose |
|-----------|----------|---------|
| `InputGroupComponent` | `app-input-group` | Main container wrapper |
| `InputGroupAddonComponent` | `app-input-group-addon` | Addon container for icons, text, buttons |
| `InputGroupButtonComponent` | `button[appInputGroupButton]` | Button styled for use inside InputGroup |
| `InputGroupInputComponent` | `app-input-group-input` | Input element with pre-applied styles |
| `InputGroupTextComponent` | `app-input-group-text` | Text element for displaying inside InputGroup |
| `InputGroupTextareaComponent` | `app-input-group-textarea` | Textarea element with pre-applied styles |

### Zardui Implementation

Located at: `/tmp/zardui/libs/zard/src/lib/shared/components/input-group/`

Zardui uses a **single monolithic component** approach:

| Component | Selector | Approach |
|-----------|----------|----------|
| `ZardInputGroupComponent` | `z-input-group` | Single component with content projection |

### shadcn/ui Reference

React implementation from: https://ui.shadcn.com/docs/components/input-group

| Component | Purpose |
|-----------|---------|
| `InputGroup` | Main wrapper |
| `InputGroupAddon` | Container for addons (icons, text, buttons) |
| `InputGroupButton` | Buttons within input groups |
| `InputGroupInput` | Styled input replacement |
| `InputGroupTextarea` | Styled textarea replacement |
| `InputGroupText` | Text display element |

## API Comparison

### InputGroup (Container)

| Property | argusx-f | zardui | shadcn/ui |
|----------|----------|--------|-----------|
| `class` | `string` | `ClassValue` | `className` |
| - | - | `zAddonBefore` | (via content projection) |
| - | - | `zAddonAfter` | (via content projection) |
| - | - | `zAddonAlign` | (via addon component) |
| - | - | `zDisabled` | - |
| - | - | `zLoading` | - |
| - | - | `zSize` | - |

### InputGroupAddon

| Property | argusx-f | shadcn/ui |
|----------|----------|-----------|
| `align` | `'inline-start' \| 'inline-end' \| 'block-start' \| 'block-end'` | Same |
| `class` | `string` | `className` |

### InputGroupButton

| Property | argusx-f | shadcn/ui |
|----------|----------|-----------|
| `size` | `'xs' \| 'sm' \| 'icon-xs' \| 'icon-sm'` | Same |
| `variant` | `ButtonVariant` | Same |
| `type` | `'button' \| 'submit' \| 'reset'` | - |
| `class` | `string` | `className` |

### InputGroupInput

| Property | argusx-f | shadcn/ui |
|----------|----------|-----------|
| `type` | `string` | (passes to native input) |
| `placeholder` | `string` | Same |
| `disabled` | `boolean` | Same |
| `readonly` | `boolean` | Same |
| `required` | `boolean` | Same |
| `value` | `model<string>` | (two-way binding) |
| `ariaInvalid` | `boolean \| string \| undefined` | - |
| `ariaDescribedby` | `string \| undefined` | - |
| `class` | `string` | `className` |

### InputGroupTextarea

| Property | argusx-f | shadcn/ui |
|----------|----------|-----------|
| `placeholder` | `string` | Same |
| `disabled` | `boolean` | Same |
| `readonly` | `boolean` | Same |
| `required` | `boolean` | Same |
| `value` | `model<string>` | (two-way binding) |
| `rows` | `number \| undefined` | - |
| `cols` | `number \| undefined` | - |
| `ariaInvalid` | `boolean \| string \| undefined` | - |
| `ariaDescribedby` | `string \| undefined` | - |
| `class` | `string` | `className` |

## Features Comparison

### Supported Features

| Feature | argusx-f | zardui | shadcn/ui |
|---------|----------|--------|-----------|
| Inline start addon | Yes | Yes | Yes |
| Inline end addon | Yes | Yes | Yes |
| Block start addon (textarea) | Yes | Partial | Yes |
| Block end addon (textarea) | Yes | Partial | Yes |
| Icon addons | Yes | Yes | Yes |
| Text addons | Yes | Yes | Yes |
| Button addons | Yes | Yes | Yes |
| Keyboard addons (kbd) | Yes | No | Yes |
| Dropdown addons | Yes | Yes | Yes |
| Spinner/Loading state | No | Yes | Yes |
| Size variants | No | Yes | No |
| Disabled state | Yes | Yes | Yes |
| Focus visible styling | Yes | Yes | Yes |
| Error/Invalid styling | Yes | No | No |
| Textarea support | Yes | Yes | Yes |
| Custom input support | Yes | No | Yes |
| Two-way binding | Yes | Yes | No |

### argusx-f Unique Features

- **Focus management**: Clicking on addon focuses the input
- **Error state styling**: `aria-invalid` styling support
- **Custom input support**: Uses `data-slot="input-group-control"` for focus state handling
- **Block alignment**: Full support for `block-start` and `block-end` positioning

### zardui Unique Features

- **Loading state**: Built-in spinner support via `zLoading`
- **Size variants**: `sm`, `default`, `lg` sizes
- **Single component**: Simpler usage pattern

## Implementation Patterns

### argusx-f Pattern (Recommended)

```html
<app-input-group>
  <app-input-group-addon align="inline-start">
    <lucide-icon [img]="mailIcon"></lucide-icon>
  </app-input-group-addon>
  <app-input-group-input placeholder="Email" />
  <app-input-group-addon align="inline-end">
    <app-input-group-button variant="ghost" size="icon-xs">
      <lucide-icon [img]="searchIcon"></lucide-icon>
    </app-input-group-button>
  </app-input-group-addon>
</app-input-group>
```

### zardui Pattern

```html
<z-input-group [zAddonBefore]="searchIcon" zAddonAfter=".com" zSize="default">
  <input z-input placeholder="example" />
</z-input-group>
```

## Style Alignment

Both argusx-f and zardui align with shadcn/ui styles:

- Uses Tailwind CSS with CVA (class-variance-authority)
- Focus-visible ring handling via `data-slot` attributes
- Muted foreground colors for addon text
- Consistent border and spacing tokens
- Disabled opacity handling

## Accessibility

| Feature | argusx-f | zardui |
|---------|----------|--------|
| ARIA group role | Yes | Yes |
| ARIA disabled | Yes | Yes |
| ARIA invalid | Yes | No |
| Focus management | Yes | No |
| aria-describedby support | Yes | No |
| Keyboard navigation | Yes | Yes |

## Conclusion

The argusx-f implementation provides:

1. **Full shadcn/ui alignment**: Complete feature parity with React reference
2. **Modular architecture**: Each component has single responsibility
3. **Better accessibility**: Focus management, aria-invalid, aria-describedby support
4. **Two-way binding**: Using Angular signals model
5. **Error state support**: Built-in destructive styling for validation

The zardui implementation offers:

1. **Simpler API**: Single component with input properties
2. **Built-in loading state**: Convenient zLoading prop
3. **Size variants**: Pre-built sm/default/lg sizes

Both implementations align with the shadcn/ui design system, but argusx-f provides more granular control and better accessibility support through its modular component approach.
