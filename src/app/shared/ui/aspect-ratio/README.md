# ArgusX Aspect Ratio

`argusx-aspect-ratio` is the ArgusX Angular aspect-ratio primitive.

## API

### Shadcn-aligned baseline

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `ratio` | `number \| string` | `1` | Width/height ratio. Supports numeric values (`16/9`) and fraction strings (`"16/9"`). Invalid values fallback to `1`. |
| `class` | `string` | `''` | Extra host classes. |

### ArgusX plain extensions

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'plain' \| 'subtle'` | `'plain'` | Visual style variant. `plain` is the default baseline. |
| `fit` | `'none' \| 'cover' \| 'contain'` | `'none'` | Applies `object-fit` to direct media children (`img/video/iframe/canvas/svg`). |

## Data Attributes

- `data-slot="aspect-ratio"`
- `data-variant`
- `data-fit`

## Usage

```html
<argusx-aspect-ratio [ratio]="16 / 9" class="rounded-lg border border-border overflow-hidden">
  <img
    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=1200&q=80"
    alt="Sample"
    class="h-full w-full object-cover"
  />
</argusx-aspect-ratio>
```

```html
<argusx-aspect-ratio [ratio]="4 / 3" variant="subtle" fit="contain">
  <img src="..." alt="Contain sample" class="h-full w-full" />
</argusx-aspect-ratio>
```

## Plain Style Contract

- Default behavior is `variant="plain"` with minimal decoration.
- Avoid heavy visual effects in baseline usage.
- Use design tokens instead of hardcoded brand colors in custom classes.
