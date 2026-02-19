# radio-group API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Root selector | N/A | `app-radio-group` | `RadioGroup` (component) | `argusx-radio-group` | no | extend-argusx | Plain: grid gap-3 | L1/S1 |
| Item selector | N/A | `app-radio-item` | `RadioGroupItem` | `argusx-radio-item` | no | extend-argusx | Plain: rounded-full border | L1/S1 |
| value (model) | N/A | `value = model<string>()` | N/A (controlled via React props) | `value = model<string>()` | no | extend-argusx | Maintains Angular two-way binding | L1 |
| disabled | N/A | `input<boolean>(false)` | Native radix prop | `input<boolean>(false)` | no | adopt-shadcn | Mirrors shadcn behavior | L1/S1 |
| name | N/A | Auto-generated or custom | Via radix | `input<string>` | no | adopt-shadcn | Preserves existing | L1/S1 |
| required | N/A | `input<boolean>(false)` | Via radix | `input<boolean>(false)` | no | adopt-shadcn | Preserves existing | L1 |
| class (item) | N/A | `input<string>('')` | `className` | `className` | no | extend-argusx | Use Angular class binding | L1 |
| data-slot | N/A | `data-slot="radio-group"` | `data-slot="radio-group"` | `data-slot="radio-group"` | no | adopt-shadcn | Standard shadcn pattern | L1/S1 |
| data-slot (item) | N/A | `data-slot="radio-group-item"` | `data-slot="radio-group-item"` | `data-slot="radio-group-item"` | no | adopt-shadcn | Standard shadcn pattern | L1/S1 |
| data-state | N/A | `data-state="checked/unchecked"` | `data-state` | `data-state` | no | adopt-shadcn | Preserves existing | L1/S1 |
| indicator slot | N/A | Custom CircleIcon | `data-slot="radio-group-indicator"` | `data-slot="radio-group-indicator"` | no | adopt-shadcn | Aligns with shadcn slot | L1/S1 |
| aria-labelledby | N/A | `input<string>()` | Via radix | `input<string>()` | no | adopt-shadcn | Preserves existing | L1 |

## Conflict Decisions (Must Adopt shadcn)
- **No significant conflicts found**: The local implementation already aligns well with shadcn patterns. Key alignments:
  - Data attributes (`data-slot`, `data-state`, `data-disabled`) match shadcn
  - Visual styling (rounded-full, border, focus states) aligns with shadcn plain style
  - Role and ARIA attributes match radix primitives

## Non-conflict Extensions (ArgusX Plain)
- **Selector migration**: `app-radio-group` -> `argusx-radio-group`, `app-radio-item` -> `argusx-radio-item`
  - Rationale: Follow ArgusX naming convention
  - Shape: Standard ArgusX prefix
- **value model binding**: Keep Angular two-way binding via `model()`
  - Rationale: Angular-specific pattern, not conflict with shadcn
  - Plain: Works with Angular signals

## Missing APIs
- **No critical missing APIs**: Local implementation covers shadcn functionality plus Angular-specific enhancements

## Behavior Mismatches
- **No behavior mismatches detected**: Implementation aligns with shadcn expected behavior

## Final Target API
- selectors:
  - Root: `argusx-radio-group`
  - Item: `argusx-radio-item`
- inputs:
  - Root: `value` (model), `disabled`, `name`, `required`, `ariaLabelledBy`
  - Item: `value` (required), `disabled`, `className`
- outputs:
  - Root: via model two-way binding
- data attributes:
  - Root: `data-slot="radio-group"`, `data-disabled`
  - Item: `data-slot="radio-group-item"`, `data-state`, `data-disabled`
- accessibility contract:
  - role="radiogroup" on root
  - role="radio" on items
  - aria-checked on items
  - keyboard support (Space/Enter to select)
- plain style defaults:
  - gap-3 for root grid
  - rounded-full, border-input, size-4 for items
  - Focus-visible ring styles
  - Circle icon indicator (filled current)
