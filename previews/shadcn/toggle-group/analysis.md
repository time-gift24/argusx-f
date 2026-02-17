# Toggle-Group Component Analysis

## Component Overview

The `toggle-group` component is a group of toggle buttons that work together, supporting both single selection (radio-like) and multiple selection (checkbox-like) modes.

## Source Locations

| Source | Path |
|--------|------|
| Local | `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/toggle-group/toggle-group.component.ts` |
| Zardui | N/A (not found at `/tmp/zardui/apps/web/public/components/toggle-group/`) |
| Shadcn | `@shadcn/toggle-group` (registry:ui, depends on radix-ui) |

## Local Implementation

### Files
- `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/toggle-group/toggle-group.component.ts` (178 lines)
- `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/toggle-group/index.ts` (exports)
- `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/toggle/toggle.directive.ts` (base directive)

### Architecture

The implementation consists of two components:

1. **ToggleGroupComponent** - Container component
2. **ToggleGroupItemComponent** - Individual toggle item

### Props/API

#### ToggleGroupComponent

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `'default' \| 'outline'` | `'default'` | Visual variant |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` | Size variant |
| `type` | `'single' \| 'multiple'` | `'single'` | Selection mode |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `value` | `string[]` | `[]` | Current value(s) |
| `spacing` | `number` | `0` | Spacing between items |
| `class` | `string` | `''` | Additional CSS class |

| Output | Type | Description |
|--------|------|-------------|
| `valueChange` | `output<string[]>` | Emits selected value(s) |

#### ToggleGroupItemComponent

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `value` | `string` | required | Unique value for this item |
| `group` | `ToggleGroupComponent` | required | Reference to parent group |
| `variant` | `'default' \| 'outline'` | `'default'` | Override variant |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` | Override size |
| `class` | `string` | `''` | Additional CSS class |

### Features

- **Single Selection**: Radio-like behavior (one item selected at a time)
- **Multiple Selection**: Checkbox-like behavior (multiple items can be selected)
- **Orientation**: Horizontal or vertical layout
- **Variants**: Default and outline styles
- **Sizes**: Default, small, and large
- **Spacing Control**: Configurable spacing between items
- **Accessible**: Uses `role="group"` and `aria-pressed` attributes

### Technical Details

- Uses Angular Signals (`signal`, `computed`, `input`, `output`)
- ChangeDetection: OnPush
- Uses `class-variance-authority` (CVA) for variant styling
- Depends on `ToggleDirective` for base toggle styles
- Tailwind CSS for styling via `cn()` utility

### Styling

```typescript
const toggleGroupVariants = cva(
  'rounded-md flex w-fit flex-row items-center gap-0 data-[vertical]:flex-col data-[vertical]:items-stretch',
  // ...
);
```

```typescript
const toggleVariants = cva(
  "hover:text-foreground aria-pressed:bg-muted focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[state=on]:bg-muted gap-1 rounded-md text-xs font-medium transition-all [&_svg:not([class*='size-'])]:size-3.5 group/toggle hover:bg-muted inline-flex items-center justify-center whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  // ...
);
```

### Usage Example

```html
<!-- Single selection (radio-like) -->
<app-toggle-group type="single" (valueChange)="onSelect($event)">
  <app-toggle-group-item value="left" [group]="group">Left</app-toggle-group-item>
  <app-toggle-group-item value="center" [group]="group">Center</app-toggle-group-item>
  <app-toggle-group-item value="right" [group]="group">Right</app-toggle-group-item>
</app-toggle-group>

<!-- Multiple selection (checkbox-like) -->
<app-toggle-group type="multiple" [value]="['bold', 'italic']" (valueChange)="onMultiSelect($event)">
  <app-toggle-group-item value="bold" [group]="group">Bold</app-toggle-group-item>
  <app-toggle-group-item value="italic" [group]="group">Italic</app-toggle-group-item>
  <app-toggle-group-item value="underline" [group]="group">Underline</app-toggle-group-item>
</app-toggle-group>
```

## Comparison with Shadcn

| Feature | Local | Shadcn |
|---------|-------|--------|
| Single selection | Supported | Supported |
| Multiple selection | Supported | Supported |
| Orientation | Horizontal/Vertical | N/A |
| Variants | default, outline | default, outline |
| Sizes | default, sm, lg | default, sm, lg |
| Radix UI | No direct dependency | Yes (radix-ui) |

## Capabilities Summary

### Implemented
- Single selection mode (radio behavior)
- Multiple selection mode (checkbox behavior)
- Horizontal and vertical orientations
- Visual variants (default, outline)
- Size variants (default, sm, lg)
- Spacing control
- Keyboard accessible (native button behavior)
- ARIA attributes (role="group", aria-pressed)

### Not Implemented (Potential Gaps)
- Roving tabindex for keyboard navigation
- Disabled state on individual items
- Controlled/uncontrolled mode distinction
- Value coercion (string to string[] for single mode)

## Dependencies

- `@angular/core` (Signals, Component, input/output)
- `class-variance-authority` (CVA for variants)
- `src/app/shared/utils/cn` (class merge utility)
- `src/app/shared/ui/toggle` (ToggleDirective, toggleVariants)
