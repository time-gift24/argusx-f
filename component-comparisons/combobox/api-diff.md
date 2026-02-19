# combobox API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector naming | `z-combobox` | `app-combobox` | `Combobox` export name | `argusx-combobox` + `argusx-*` sub-slots | yes | adopt-shadcn shape + argusx prefix migration | default style remains neutral | Z1/L1/S1 |
| root composition model | popover+command monolith | overlay root + projected slots | root + slot components | root + slot components (single canonical path) | yes | adopt-shadcn slot composition | no decorative root shell | Z1/L1/S1 |
| input `showTrigger/showClear` | not exposed directly | already present | present in `ComboboxInput` | kept and aligned | no | extend-argusx on top of shadcn-compatible input contract | plain controls with muted ghost buttons | S2/L3 |
| content positioning API | popover internals | root carried side/align | `ComboboxContent(side/align/offset/anchor)` | moved to `argusx-combobox-content` | yes | adopt-shadcn | plain popup, low-shadow | S3/L2 |
| item states + indicator | command option check state | item check icon + selected | item indicator + highlighted/disabled | aligned with `data-state`, `data-highlighted`, indicator | yes | adopt-shadcn | plain row highlight only | S5/L1 |
| empty-state visibility | command empty handles internally | local empty always rendered | empty shown only when list empty | empty hidden when visible items exist | yes | adopt-shadcn behavior | plain text-only empty state | S6/L1 |
| chips API | no chips primitives | chips/chip/chips-input present | chips/chip/chips-input present | kept as first-class slots | no | adopt-shadcn main path (already aligned) | compact chip styling | S7/L4 |
| controlled open state | internal signal via popover | internal-only signal | primitive supports controlled interaction patterns | `open` upgraded to model (`[(open)]`) | no | extend-argusx | plain behavior, no visual divergence | Z3/S1 |
| auto-highlight behavior | command-like first match focus | none | showcased in combobox-example | `autoHighlight` input on root | no | extend-argusx | highlighted row stays plain (accent only) | S2/L3 |
| root `variant` / `size` | `buttonVariant/zWidth` | none | no combobox variant prop | `variant="plain"` default + `size` | no | extend-argusx | explicit plain default | Z2/L2 |
| filtering source of truth | command input internal | searchTerm on root/input | primitive input/list filtering | root searchTerm + item visibility registration | no | extend-argusx | plain text filtering | Z3/S4/L3 |
| legacy width/button APIs | `zWidth`, `buttonVariant` | N/A | N/A | removed | yes | adopt-shadcn-compatible API surface (drop zard names) | rely on neutral tokens/classes | Z2/U1 |
| data-slot contract | partial | partial | full slot names | full slot names across all subcomponents | yes | adopt-shadcn | consistent neutral slots | S1-S7/L1 |

## Conflict Decisions (Must Adopt shadcn)
- [x] **Content positioning ownership**: moved side/align/offset/anchor to `argusx-combobox-content` (instead of root-level positioning inputs) to match shadcn content contract.
- [x] **Slot-centric API**: canonical API is root + sub-slots (`value/trigger/input/content/list/item/...`) with shadcn-equivalent slot names; removed legacy single-surface assumptions.
- [x] **Empty-state behavior**: empty now depends on list visibility state, not always-on rendering.
- [x] **Naming collisions**: zard/local prefixes were dropped in favor of shadcn-like slot semantics with argusx selector namespace.

## Non-conflict Extensions (ArgusX Plain)
- [x] **`variant`**: added `variant` with default `plain` to enforce explicit plain style baseline without redefining shadcn semantics.
- [x] **`size`**: added compact `sm/default` sizing layer for input/chips/layout while keeping shadcn slot behavior unchanged.
- [x] **Controlled open model**: exposed `open` as model (`[(open)]`) for preview and app-level orchestration.
- [x] **`autoHighlight`**: added root-level opt-in to highlight first visible enabled item for keyboard-first flows.
- [x] **`fixedHeight` on list**: retained local ergonomics extension for predictable long-list viewport in plain style demos.

## Missing APIs
- [x] **`anchor` wiring from content** (missing in local baseline): now wired to overlay origin/width via `argusx-combobox-content`.
- [x] **Visibility-aware item registry** (missing in local baseline): now introduced so empty/list states are derived from filtered visibility.

## Behavior Mismatches
- [x] **Pre-rewrite root carried positioning props** vs shadcn content-owned props: fixed by moving positioning semantics to content.
- [x] **Pre-rewrite empty rendering** vs shadcn conditional empty: fixed with `hasVisibleItems` registry.
- [x] **Pre-rewrite naming (`app-*`)** vs required argusx namespace policy: fixed with full selector migration.

## Final Target API
- selectors:
  - root: `argusx-combobox`
  - slots: `argusx-combobox-{value,trigger,clear,input,content,list,item,group,label,collection,empty,separator,chips,chip,chips-input}`
- inputs:
  - root: `value`(model), `open`(model), `multiple`, `disabled`, `variant`(default `plain`), `size`(default `default`), `class`
  - root (extension): `autoHighlight`
  - input: `placeholder`, `disabled`, `showTrigger`, `showClear`, `class`
  - content: `side`, `sideOffset`, `align`, `alignOffset`, `anchor`, `class`
  - list: `fixedHeight`, `class`
  - item/chip/group/label/separator/value/chips/chips-input: `class` + per-slot functional inputs (`value`, `label`, `disabled`, `showRemove`, etc.)
- outputs:
  - model outputs: `valueChange`, `openChange`
  - CVA-compatible form integration (`writeValue/registerOnChange/registerOnTouched/setDisabledState`)
- data attributes:
  - root: `data-slot="combobox"`, `data-size`, `data-variant`
  - content/list/item/chips/chip/... all aligned with shadcn slot naming
  - item state attrs: `data-state`, `data-disabled`, `data-highlighted`
- accessibility contract:
  - trigger/input/chips-input expose combobox/listbox ARIA linkage (`role`, `aria-expanded`, `aria-haspopup`)
  - item uses `role="option"` + `aria-selected`
  - escape closes popup; enter commits highlighted item when present
- plain style defaults:
  - default `variant="plain"` with neutral border/background
  - low-contrast hover/highlight, no gradient/glass effect, no hardcoded brand colors
