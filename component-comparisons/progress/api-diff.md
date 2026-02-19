# progress API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| value/progress | `progress: number` | `value: number \| undefined` | `value: number` | `value: number \| undefined` | yes | adopt-shadcn | shadcn uses `value`, local already aligned | L1 |
| max | `N/A` | `max: number` (default 100) | `max?: number` (default 100) | `max: number` (default 100) | no | extend-argusx | matches shadcn default | L1 |
| indeterminate | `zIndeterminate: boolean` | `indeterminate: boolean` | N/A | `indeterminate: boolean` | no | extend-argusx | ArgusX extension for loading states | Z1, L1 |
| size | `zSize: 'default' \| 'sm' \| 'lg'` | `size: 'sm' \| 'default' \| 'lg'` | N/A | `size: 'sm' \| 'default' \| 'lg'` | no | extend-argusx | ArgusX extension, plain default | Z2, L1 |
| variant/type | `zType: 'default' \| 'destructive' \| 'accent'` | `variant: 'default' \| 'success' \| 'warning' \| 'danger'` | N/A | `variant: 'default' \| 'success' \| 'warning' \| 'danger'` | no | extend-argusx | ArgusX extension, plain default | Z2, L1 |
| shape | `zShape: 'default' \| 'square'` | N/A | N/A | `shape: 'default' \| 'square'` | no | extend-argusx | ArgusX extension for square variant | Z2 |
| class | `class: ClassValue` | `class: string` | N/A | `class: string` | no | extend-argusx | custom class support | Z1, L1 |
| barClass | `barClass: ClassValue` | N/A | N/A | N/A | - | N/A | Not implemented, use class | Z1 |

## Conflict Decisions (Must Adopt shadcn)
- [x] API name: `value` - local already uses shadcn naming (not zardui's `progress`), no conflict

## Non-conflict Extensions (ArgusX Plain)
- [x] `indeterminate`: extension for indeterminate/loading state, plain animation style
- [x] `size`: 'sm' | 'default' | 'lg' - already aligned with zardui
- [x] `variant`: 'default' | 'success' | 'warning' | 'danger' - ArgusX extension beyond shadcn
- [x] `shape`: 'default' | 'square' - inherited from zardui as ArgusX extension

## Missing APIs
- None - local implementation already has all necessary APIs

## Behavior Mismatches
- None significant - local implementation is well-aligned with both shadcn and zardui

## Final Target API
- selectors: `app-progress` (stays same, already has argusx prefix)
- inputs:
  - `value: number | undefined` (shadcn-aligned)
  - `max: number = 100` (shadcn-aligned default)
  - `indeterminate: boolean = false` (ArgusX extension)
  - `size: 'sm' | 'default' | 'lg' = 'default'` (ArgusX extension)
  - `variant: 'default' | 'success' | 'warning' | 'danger' = 'default'` (ArgusX extension)
  - `shape: 'default' | 'square' = 'default'` (ArgusX extension)
  - `class: string = ''` (extension)
- outputs: none
- data attributes: `data-slot="progress"`, `data-size`, `data-variant`, `data-shape`
- accessibility contract: role="progressbar", aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext
- plain style defaults: variant='default', size='default', shape='default'
