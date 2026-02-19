# dropdown-menu API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | evidence |
| --- | --- | --- | --- | --- | --- |
| Root | `z-menu` directive, no dedicated dropdown root | `argusx-dropdown-menu` component | `DropdownMenu` root | `argusx-dropdown-menu` | Z1, L2, S1 |
| Trigger | `[z-menu]` | `[argusxDropdownMenuTrigger]` + `argusx-dropdown-menu-trigger` | `DropdownMenuTrigger` | keep component + directive dual form | Z1, L1, S2 |
| Content defaults | placement via zard map (`bottomLeft`) | `sideOffset=4`, `align=start` | `sideOffset=4` | match shadcn defaults | U1, L2/L7, S3 |
| Item variant/inset | `zType` + `zInset` | `variant='default'`, `inset=false` | `variant='default'`, optional `inset` | match shadcn naming + defaults | Z3, L4, S4 |
| Checkbox item | handled by menu item behavior | `checkedChange` and no auto-close | `CheckboxItem` can stay open for multi-select | keep no-close behavior | L5, S5 |
| Radio group/item | generic menu item | `[(value)]` via `model`, select closes | `RadioGroup`/`RadioItem` | keep `[(value)]` + close on selection | L6, S6 |
| Submenu family | nested `z-menu` in demo | `Sub/SubTrigger/SubContent` | `Sub/SubTrigger/SubContent` | parity kept | U2, L8, S7 |
| Portal | no explicit public portal primitive | `argusx-dropdown-menu-portal` placeholder | `DropdownMenuPortal` | keep placeholder for API parity | L8, S8 |
| Data attributes | `data-state`, disabled markers | `data-slot`, `data-variant`, `data-inset`, `data-state`, `data-side` | same shadcn slot/data-* scheme | preserve shadcn data contract | L3/L4, S1/S4 |

`S1`: `/tmp/shadcn-dropdown-menu.tsx:9-13`  
`S2`: `/tmp/shadcn-dropdown-menu.tsx:23-31`  
`S3`: `/tmp/shadcn-dropdown-menu.tsx:34-43`  
`S4`: `/tmp/shadcn-dropdown-menu.tsx:62-76`  
`S5`: `/tmp/shadcn-dropdown-menu.tsx:85-107`  
`S6`: `/tmp/shadcn-dropdown-menu.tsx:111-143`  
`S7`: `/tmp/shadcn-dropdown-menu.tsx:195-239`  
`S8`: `/tmp/shadcn-dropdown-menu.tsx:15-21`

## Missing APIs
- [x] none for locked scope. Root/Trigger/Content/Group/Label/Item/Checkbox/RadioGroup/RadioItem/Separator/Shortcut/Sub/SubTrigger/SubContent/Portal are all present in `ArgusxDropdownMenuComponents`.

## Behavior Mismatches
- [x] intentional internal mismatch: shadcn uses Radix primitives, local uses Angular CDK overlay and signals. Public API contract stays aligned. (`/tmp/shadcn-dropdown-menu.tsx:34-50`, `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts:704-727`)
- [x] local adds `ArrowUp => open last item` on trigger as an accessibility extension; shadcn does not encode this in wrapper source. (`src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts:82-85`)

## Final Target API
- selectors:
  - `argusx-dropdown-menu`
  - `[argusxDropdownMenuTrigger]`, `argusx-dropdown-menu-trigger`
  - `argusx-dropdown-menu-content`, `argusx-dropdown-menu-group`, `argusx-dropdown-menu-label`, `argusx-dropdown-menu-item`
  - `argusx-dropdown-menu-checkbox-item`, `argusx-dropdown-menu-radio-group`, `argusx-dropdown-menu-radio-item`
  - `argusx-dropdown-menu-separator`, `argusx-dropdown-menu-shortcut`
  - `argusx-dropdown-menu-sub`, `argusx-dropdown-menu-sub-trigger`, `argusx-dropdown-menu-sub-content`
  - `argusx-dropdown-menu-portal`
- inputs:
  - content: `align`, `sideOffset`, `class`
  - item: `variant`, `inset`, `disabled`, `class`
  - checkbox/radio: `checked`, `inset`, `disabled`, `value`, `class`
  - root: `[(open)]`, `align`, `sideOffset`, `minWidth`, `class`
- outputs:
  - item `select`
  - checkbox `checkedChange`
  - radio group `[(value)]`
- data attributes:
  - `data-slot`, `data-variant`, `data-inset`, `data-disabled`, `data-state`, `data-side`
- accessibility contract:
  - trigger has `aria-haspopup="menu"` + `aria-expanded`
  - content is `role="menu"` with vertical orientation
  - item roles: `menuitem`, `menuitemcheckbox`, `menuitemradio`
