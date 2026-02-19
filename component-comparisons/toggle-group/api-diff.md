# toggle-group API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | z-toggle-group | app-toggle-group | ToggleGroup | argusx-toggle-group | yes | adopt-shadcn | - | Z1/L1 |
| type/mode | zMode: single/multiple | type: single/multiple | type: single/multiple | type: single/multiple | no | extend-argusx | same semantics | L1 |
| variant | zType: default/outline | variant: default/outline | variant: default/outline | variant: default/outline | no | adopt-shadcn | plain default style | L1/L3 |
| size | zSize: sm/md/ld | size: default/sm/lg | - | size: default/sm/lg | no | extend-argusx | aligns with local | L1 |
| disabled | disabled | - | disabled | disabled | no | extend-argusx | add missing API | S1 |
| value | value: string/string[] | value: string[] | value: string/string[] | value: string[] | partial | extend-argusx | string[] for multi | L1 |
| valueChange | output | output | onValueChange | valueChange | no | adopt-shadcn | event name same | L1 |
| items | items[] array | - | children | content projection | yes | adopt-shadcn | use projection | Z1 |

## Conflict Decisions (Must Adopt shadcn)
- [x] Selector: app-toggle-group -> argusx-toggle-group, app-toggle-group-item -> argusx-toggle-group-item
- [x] variant: "default" -> "plain" (aligning with plain style contract)

## Non-conflict Extensions (ArgusX Plain)
- [x] size: default/sm/lg (already present, keep)
- [x] orientation: horizontal/vertical (already present)
- [x] spacing: number (already present)
- [x] disabled: add to ToggleGroupComponent

## Missing APIs
- [x] disabled input on ToggleGroupComponent (not implemented)

## Behavior Mismatches
- [x] zardui implements ControlValueAccessor, local does not - extend with forms support (optional)

## Final Target API
- **selectors**: argusx-toggle-group, argusx-toggle-group-item
- **inputs (ToggleGroup)**:
  - variant: "default" | "outline" (default: "default")
  - size: "default" | "sm" | "lg" (default: "default")
  - type: "single" | "multiple" (default: "single")
  - orientation: "horizontal" | "vertical" (default: "horizontal")
  - spacing: number (default: 0)
  - value: string[] (default: [])
  - disabled: boolean (default: false)
- **outputs (ToggleGroup)**:
  - valueChange: output<string[]>()
- **inputs (ToggleGroupItem)**:
  - value: string (required)
  - group: ToggleGroupComponent (required)
  - variant: ToggleVariant (inherits from group)
  - size: ToggleSize (inherits from group)
  - class: string
- **data attributes**:
  - data-slot="toggle-group"
  - data-variant
  - data-size
  - data-orientation
- **accessibility contract**:
  - role="group" on container
  - aria-pressed on items
  - keyboard support for selection
- **plain style defaults**:
  - variant: "default" (maps to plain style - bg-transparent)
  - size: "default" (h-7)
