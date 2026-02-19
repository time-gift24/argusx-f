# context-menu API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | evidence |
| --- | --- | --- | --- | --- | --- |
| Root | `[z-context-menu]` directive style entry | `argusx-context-menu` root component | `ContextMenu` root | keep root component + projected trigger/content | Z1, L3, S1 |
| Trigger | `[z-context-menu]` only | `[argusxContextMenuTrigger]` + `argusx-context-menu-trigger` | `ContextMenuTrigger` | dual form retained | Z1, L1/L2, S2 |
| Open behavior | right-click + keyboard open helper | `openAt(x,y)` and `openFromTriggerElement` | Radix context open semantics | parity retained | Z1, L4, S1 |
| Content defaults | generic menu content | `side='right'`, `sideOffset=4` | context content with Radix positioning | keep default right + offset 4 | L3/L8, S3 |
| Item variant/inset | `zType` + inset style | `variant='default'`, `inset=false`, data attrs | `variant='default'`, inset support | shadcn naming + defaults | Z3, L6, S4 |
| Checkbox/Radio | menu-item level behavior | checkbox no-close, radio close | same semantics in shadcn | keep behavior | L7, S5/S6 |
| Submenu | nested z-menu demo pattern | `Sub/SubTrigger/SubContent` with side detection | `Sub/SubTrigger/SubContent` | keep full submenu family | U3, L5, S7 |
| Portal | implicit in zard | `argusx-context-menu-portal` placeholder | `ContextMenuPortal` | keep placeholder for API parity | L9, S8 |
| Data attributes | state/disabled markers | `data-slot`, `data-variant`, `data-inset`, `data-disabled`, `data-state`, `data-side` | same shadcn slot/data-* contract | preserve | L5/L6, S1/S4 |

`S1`: `/tmp/shadcn-context-menu.tsx:9-20`  
`S2`: `/tmp/shadcn-context-menu.tsx:15-21`  
`S3`: `/tmp/shadcn-context-menu.tsx:96-112`  
`S4`: `/tmp/shadcn-context-menu.tsx:114-129`  
`S5`: `/tmp/shadcn-context-menu.tsx:137-161`  
`S6`: `/tmp/shadcn-context-menu.tsx:163-185`  
`S7`: `/tmp/shadcn-context-menu.tsx:56-94`  
`S8`: `/tmp/shadcn-context-menu.tsx:31-37`

## Missing APIs
- [x] none in locked scope. All required public parts exist in `ArgusxContextMenuComponents`.

## Behavior Mismatches
- [x] intentional internal mismatch: Radix internals in shadcn vs Angular CDK Overlay in local implementation; external API remains shadcn-first.
- [x] local supports both trigger component and trigger directive (superset of shadcn component-only pattern).

## Final Target API
- selectors:
  - `argusx-context-menu`
  - `[argusxContextMenuTrigger]`, `argusx-context-menu-trigger`
  - `argusx-context-menu-content`, `argusx-context-menu-group`, `argusx-context-menu-label`, `argusx-context-menu-item`
  - `argusx-context-menu-checkbox-item`, `argusx-context-menu-radio-group`, `argusx-context-menu-radio-item`
  - `argusx-context-menu-separator`, `argusx-context-menu-shortcut`
  - `argusx-context-menu-sub`, `argusx-context-menu-sub-trigger`, `argusx-context-menu-sub-content`
  - `argusx-context-menu-portal`
- inputs:
  - content: `side`, `sideOffset`, `class`
  - item: `variant`, `inset`, `disabled`, `class`
  - checkbox/radio: `checked`, `value`, `inset`, `disabled`, `class`
  - root: `[(open)]`, `side`, `sideOffset`, `minWidth`, `class`
- outputs:
  - item `select`
  - checkbox `checkedChange`
  - radio group `[(value)]`
- data attributes:
  - `data-slot`, `data-variant`, `data-inset`, `data-disabled`, `data-state`, `data-side`
- accessibility contract:
  - trigger supports mouse (`contextmenu`) and keyboard (`ContextMenu`, `Shift+F10`)
  - content gets focus on open (`tabindex=-1`) and closes on Escape
  - semantic roles for menu item kinds are preserved
