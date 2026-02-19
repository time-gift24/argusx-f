# API Reference

## Directive

- `ArgusxInputDirective`
- Selector: `input[argusxInput]`
- ExportAs: `argusxInput`

## Inputs

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `class` | `string` | `''` | Additional classes merged into the host input |

## Native Input API

`ArgusxInputDirective` is shadcn-first and native-input-first.  
Use regular input attributes/properties directly on the host element:

- `type`
- `value`
- `placeholder`
- `disabled`
- `readonly`
- `required`
- `autocomplete`
- `name`
- `id`
- `aria-*`

## Host Attributes

- `data-slot="input"`

## Forms Integration (ControlValueAccessor)

The directive implements `ControlValueAccessor` and supports:

- Template-driven forms (`ngModel`)
- Reactive forms (`FormControl`, `formControlName`)

Methods:

- `writeValue(value?: string): void`
- `registerOnChange(fn: (value: string) => void): void`
- `registerOnTouched(fn: () => void): void`
- `setDisabledState(isDisabled: boolean): void`

## Exported Symbols

- `ArgusxInputDirective`
- `argusxInputVariants`
