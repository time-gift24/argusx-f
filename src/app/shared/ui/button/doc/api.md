# API Reference

## Directive

- `ArgusxButtonDirective`
- Selector: `button[argusx-button], a[argusx-button]`
- ExportAs: `argusxButton`

## Inputs

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `default \| destructive \| outline \| secondary \| ghost \| link` | `default` | Visual style |
| `size` | `default \| xs \| sm \| lg \| icon \| icon-xs \| icon-sm \| icon-lg` | `default` | Control size |
| `shape` | `default \| circle \| square` | `default` | ArgusX extension |
| `full` | `boolean` | `false` | Full width (`w-full`) |
| `loading` | `boolean` | `false` | Adds loading state classes + `aria-busy` |
| `disabled` | `boolean` | `false` | Disables button interaction |
| `invalid` | `boolean` | `false` | Sets `aria-invalid` |
| `asChild` | `boolean` | `false` | Host class is skipped when true |
| `class` | `string` | `''` | Additional classes |

## Methods

| Method | Return | Description |
| --- | --- | --- |
| `getClasses()` | `string` | Returns resolved button classes (for `asChild` composition) |

## Host Attributes

- `data-slot="button"`
- `data-variant`
- `data-size`
- `data-shape`
- `data-loading` (present when loading)
- `data-full` (present when full)
- `aria-disabled`
- `aria-invalid`
- `aria-busy`
- `disabled` (only for native `<button>`)
- `tabindex="-1"` (for disabled/loading `<a>`)

## Exported Symbols

- `ArgusxButtonDirective`
- `argusxButtonVariants`
- `ArgusxButtonVariant`
- `ArgusxButtonSize`
- `ArgusxButtonShape`
