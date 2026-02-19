# ArgusX Button

`ArgusXButtonDirective` provides a unified button primitive aligned with shadcn-style API and ArgusX extensions.

## Selector

- `button[argusx-button]`
- `a[argusx-button]`

## Core API

- `variant`
- `size`
- `asChild`
- `disabled`
- `class`

## ArgusX Extensions

- `shape`
- `full`
- `loading`
- `invalid`

## Quick Usage

```html
<button argusx-button variant="outline" size="sm">Action</button>

<a argusx-button variant="link" href="/docs">Docs</a>

<button argusx-button loading>
  <lucide-icon [img]="loaderIcon" class="size-4 animate-spin"></lucide-icon>
  Saving
</button>
```
