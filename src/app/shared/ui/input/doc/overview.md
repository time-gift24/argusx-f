# ArgusX Input

`ArgusxInputDirective` is the strict shadcn-first input primitive for ArgusX.

## Selector

- `input[argusxInput]`

## Design Principles

- shadcn-first public API
- native `<input>` attributes as the primary contract
- no wrapper component
- no variant API (`status`, `size`, `borderless`)

## Quick Usage

```html
<input argusxInput type="email" placeholder="Email" />

<input argusxInput disabled type="text" value="Disabled value" />

<input argusxInput aria-invalid="true" type="email" placeholder="Invalid email" />
```

## Forms Usage

```html
<input argusxInput [formControl]="emailControl" />
```

```ts
readonly emailControl = new FormControl('');
```

## Migration Notes (Breaking)

- `appInput` -> `argusxInput`
- remove `<app-input>` usage (wrapper removed)
- remove `status`, `size`, `borderless` input API
- use native input attrs and custom classes instead

## Accessibility Notes

- Native input semantics are preserved.
- Error visuals should be driven by `aria-invalid="true"`.
- Associate helper/error text via `aria-describedby` where applicable.
