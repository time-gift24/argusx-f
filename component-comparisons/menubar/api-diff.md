# menubar API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | evidence |
| --- | --- | --- | --- | --- | --- |
| Root | no dedicated menubar primitive | `argusx-menubar` root + `argusx-menubar-menu` | `Menubar` + `MenubarMenu` | keep two-level root/menu structure | Z1, L1, S1 |
| Trigger | zard trigger directive pattern only | `[argusxMenubarTrigger]` + `argusx-menubar-trigger` | `MenubarTrigger` component | keep dual trigger form (component + directive) | Z1, L6, S2 |
| Content defaults | placement from menu primitives | `align='start'`, `alignOffset=-4`, `sideOffset=8` | same defaults | exact default parity | L4/L5, S3 |
| Content side state | no menubar-specific side attr in zard | `data-side` tracks overlay top/bottom fallback | Radix sets side-state | keep `data-side` contract | L3, S3 |
| Item variant/inset | zard item supports type/inset | `variant='default'`, `inset=false` + data attrs | same shadcn schema | parity kept | Z3, L7, S4 |
| Checkbox/Radio | menu-item level semantics | checkbox no-close, radio close | same | parity kept | L7, S5/S6 |
| Submenu | nested menus in zard demos | `Sub/SubTrigger/SubContent` implemented | same in shadcn menubar | parity kept | U4, L8, S7 |
| Portal | no explicit public portal in zard | `argusx-menubar-portal` placeholder | `MenubarPortal` | keep placeholder API | L8, S8 |
| Keyboard nav | generic menu arrows in zard | top-level Left/Right menu switch + Enter/Space/Arrow open | menubar keyboard semantics | behavior matched | L2, S2/S3 |

`S1`: `/tmp/shadcn-menubar.tsx:9-35`  
`S2`: `/tmp/shadcn-menubar.tsx:51-64`  
`S3`: `/tmp/shadcn-menubar.tsx:67-83`  
`S4`: `/tmp/shadcn-menubar.tsx:91-107`  
`S5`: `/tmp/shadcn-menubar.tsx:114-138`  
`S6`: `/tmp/shadcn-menubar.tsx:140-162`  
`S7`: `/tmp/shadcn-menubar.tsx:213-257`  
`S8`: `/tmp/shadcn-menubar.tsx:37-41`

## Missing APIs
- [x] none for locked scope. All required parts in `ArgusxMenubarComponents` are present and exported via `src/app/shared/ui/menubar/index.ts`.

## Behavior Mismatches
- [x] intentional internal mismatch: shadcn/Radix internals vs Angular CDK overlay implementation. Public API and data attributes remain aligned.
- [x] local supports trigger directive and trigger component simultaneously (superset of shadcn wrapper).

## Final Target API
- selectors:
  - `argusx-menubar`, `argusx-menubar-menu`
  - `[argusxMenubarTrigger]`, `argusx-menubar-trigger`
  - `argusx-menubar-content`, `argusx-menubar-group`, `argusx-menubar-label`, `argusx-menubar-item`
  - `argusx-menubar-checkbox-item`, `argusx-menubar-radio-group`, `argusx-menubar-radio-item`
  - `argusx-menubar-separator`, `argusx-menubar-shortcut`
  - `argusx-menubar-sub`, `argusx-menubar-sub-trigger`, `argusx-menubar-sub-content`
  - `argusx-menubar-portal`
- inputs:
  - menu content wrapper: `align`, `alignOffset`, `sideOffset`, `class`
  - menu root: `[(open)]`, `align`, `alignOffset`, `sideOffset`, `minWidth`, `class`
  - item family: `variant`, `inset`, `disabled`, `checked`, `value`, `class`
- outputs:
  - item `select`
  - checkbox `checkedChange`
  - radio group `[(value)]`
- data attributes:
  - `data-slot`, `data-variant`, `data-inset`, `data-disabled`, `data-state`, `data-side`
- accessibility contract:
  - root `role="menubar"`
  - triggers expose `aria-haspopup="menu"` and `aria-expanded`
  - content `role="menu"` with Escape close and Left/Right top-level navigation
