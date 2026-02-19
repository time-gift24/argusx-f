# button API Diff

## API Matrix
| api | zardui | local (before rewrite) | shadcn | target (argusx) | evidence |
| --- | --- | --- | --- | --- | --- |
| selector | `z-button` / `button[z-button]` / `a[z-button]` | mixed `argus-button` + `argusButton` | `<Button />` | `button[argusx-button], a[argusx-button]` | Z1, L1, S2 |
| visual variant | `zType` | `variant` (already present) | `variant` | `variant` | Z1, L2, S1 |
| size | `zSize` | `size` (already present) | `size` | `size` | Z1, L2, S1 |
| asChild composition | N/A | existed only in old directive branch | `asChild` | `asChild` unified on main directive | L1, S2 |
| shape extension | `zShape` | partial support in legacy component branch | N/A | `shape` (`default/circle/square`) | Z1, Z2, L2 |
| full-width extension | `zFull` | no stable unified API | N/A | `full` | Z1, U3, L2 |
| loading extension | `zLoading` (with spinner in template) | partial; mixed behaviors | docs pattern uses disabled + spinner | `loading` + shadcn-style disabled+spinner example in preview | Z1, U2, L3 |
| disabled semantics | `zDisabled` | disabled handling split across two implementations | native disabled semantics | unified `disabled` + aria + anchor tabindex handling | Z1, L1, S2 |
| data attrs | custom (`data-icon-only`, etc.) | split between old impls | `data-slot`/`data-variant`/`data-size` | shadcn core attrs + argusx extensions (`data-shape`,`data-loading`,`data-full`) | Z1, L1, S2 |

## Missing APIs (resolved in this rewrite)
- [x] Unified `asChild` behavior on the only exported button primitive.
- [x] Unified `shape/full/loading` extension support in the same implementation as shadcn core props.
- [x] Unified selector naming to `argusx-button` and removed legacy selectors.

## Behavior Mismatches (before -> after)
- [x] **Selector fragmentation**: old codebase required both `argus-button` and `argusButton`. Now fully converged to `argusx-button`.
- [x] **Implementation fragmentation**: old component/directive split had different feature sets. Now single directive owns all behaviors.
- [x] **Import fragmentation**: old consumers imported `ButtonComponent` or `ButtonDirective`. Now all consumers import `ArgusxButtonDirective`.

## Final Target API
- selectors:
  - `button[argusx-button], a[argusx-button]`
- inputs:
  - shadcn core: `variant`, `size`, `asChild`, `disabled`, `class`
  - argusx extension: `shape`, `full`, `loading`, `invalid`
- outputs:
  - none (button behavior is host-native click)
- data attributes:
  - `data-slot`, `data-variant`, `data-size`, `data-shape`, `data-loading`, `data-full`
- accessibility contract:
  - `aria-disabled`, `aria-invalid`, `aria-busy`
  - native `disabled` only on `button`
  - `tabindex=-1` on disabled/loading anchor
