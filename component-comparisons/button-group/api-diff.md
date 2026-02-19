# button-group API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Root selector | `z-button-group` | `app-button-group` | `ButtonGroup` (`div`) | `argusx-button-group`, `div[argusxButtonGroup]` | yes | adopt-shadcn | default group remains plain border-join container | Z1/L1/S2 |
| `orientation` input | `zOrientation` default `horizontal` | `orientation` default `horizontal` | `orientation` default `horizontal` | `orientation: 'horizontal' \| 'vertical'` default `horizontal` | no | adopt-shadcn | no extra decoration by orientation | Z1/L1/S1/S5 |
| Group class contract | zard has nested gap + orientation join classes | missing select-trigger adaptation, wildcard focus selector differs | canonical class includes single-item round fix + nested-only gap + select-trigger handling | fully align to shadcn radix-mira contract in `argusxButtonGroupVariants` | yes | adopt-shadcn | token-only utility classes, no gradients/shadows | Z4/L2/S1 |
| Text API shape | attribute directive `[z-button-group-text]` | `app-button-group-text` component only | `ButtonGroupText` with `asChild` | `argusx-button-group-text` + `[argusxButtonGroupText]` + `asChild` | yes | adopt-shadcn | mira text capsule baseline (`px-2.5`, `text-xs/relaxed`) | Z3/L1/S3 |
| Text `asChild` semantics | achieved by attribute directive usage | not available | `asChild` boolean | support `asChild` on component + keep attribute selector path | yes | adopt-shadcn | same style contract for wrapper/child path | Z3/L1/S3/S5 |
| Separator API | `z-button-group-divider` + optional parent-aware orientation | `app-button-group-separator` default vertical | `ButtonGroupSeparator` default vertical | `argusx-button-group-separator`, `orientation` default vertical | no | adopt-shadcn | separator is neutral token line (`bg-input`) | Z2/L1/S4/S5 |
| Separator parent-aware orientation | divider auto-derives from parent group | absent | not defined | `autoOrientation` extension (default `false`) to opt into zard behavior | no | extend-argusx | optional extension, default path untouched | Z2 |
| Data attributes | no unified `data-slot` set | group/text/separator slots present | `button-group` + `button-group-separator` defined (`text` 无 `data-slot`) | group/separator 对齐 shadcn，text 不强制 `data-slot` | yes | adopt-shadcn | slots remain structural metadata only | L1/S2/S4 |
| Preview complexity | no dedicated demo in zard repo | only basic horizontal/vertical/text/separator | official example includes input/text asChild/dropdown/select/nested/vertical | preview now covers shadcn mira key paths + ArgusX extension scenarios | yes | adopt-shadcn | examples remain plain visual language | L4/S6/U3 |

## Conflict Decisions (Must Adopt shadcn)
- [x] selector naming: `app-button-group*` migrated to `argusx-*` with shadcn-equivalent structure; removed old primary selectors. (L1/S2)
- [x] group class contract: adopted shadcn radix-mira variant classes（包含 single-item 修正、nested-only gap、select-trigger 适配）。(L2/S1)
- [x] text style contract: updated to shadcn mira baseline (`px-2.5`, `text-xs/relaxed`) from old local style drift. (L3/S3)
- [x] text composition path: added `asChild` input on `argusx-button-group-text` and kept attribute selector as Angular non-conflict extension. (L1/S3/S5)

## Non-conflict Extensions (ArgusX Plain)
- [x] semantic attribute selectors: `div[argusxButtonGroup]`, `[argusxButtonGroupText]`, `[argusxButtonGroupSeparator]` for Angular template ergonomics without changing shadcn semantics. (Z3/S2)
- [x] `autoOrientation` on separator: opt-in parent-aware orientation derived from zard divider behavior; default remains shadcn (`vertical`). (Z2/S4)
- [x] `data-auto-orientation` telemetry attribute: emitted only when extension is enabled to keep debugging explicit while preserving plain visuals. (Z2)

## Missing APIs
- [x] local preview lacked shadcn mira example matrix（input/text asChild/dropdown/select/nested/vertical）。Added parity scenarios. (L4/S6)
- [x] local implementation lacked shadcn select-trigger and nested spacing adaptation classes. Added in `argusxButtonGroupVariants`. (L2/S1)

## Behavior Mismatches
- [x] nested spacing: old local always had `gap-2`; expected is nested-only spacing. Aligned to shadcn class contract. (L2/S1)
- [x] text `asChild`: old local had no `asChild`; expected shadcn boolean prop. Added explicit `asChild` support. (L1/S3/S5)
- [x] text capsule sizing: local style drift fixed to shadcn mira (`text-xs/relaxed`, `px-2.5`). (L3/S3)
- [x] separator orientation ergonomics: old local had no parent-derived path; added opt-in extension `autoOrientation` from zard logic while keeping shadcn default behavior. (Z2/L1/S4)
- [x] `input + button` height mismatch in group compositions was caused by global input baseline (`h-9` vs button `h-7`); fixed by aligning `argusxInput` default size tokens to compact `h-7` baseline. (L2/S1)

## Final Target API
- selectors:
  - `argusx-button-group`, `div[argusxButtonGroup]`
  - `argusx-button-group-text`, `[argusxButtonGroupText]`
  - `argusx-button-group-separator`, `[argusxButtonGroupSeparator]`
- inputs:
  - group: `orientation?: 'horizontal' | 'vertical'` (default `horizontal`), `class?: string`
  - text: `asChild?: boolean` (default `false`), `class?: string`
  - separator: `orientation?: 'horizontal' | 'vertical'` (default `vertical`), `autoOrientation?: boolean` (default `false`), `class?: string`
- outputs:
  - none
- data attributes:
  - group: `data-slot="button-group"`, `data-orientation`
  - text: `data-as-child` (only when `asChild=true`)
  - separator: `data-slot="button-group-separator"`, `data-orientation`, `data-auto-orientation` (extension enabled only)
- accessibility contract:
  - group host uses `role="group"`; consumers should provide `aria-label`/`aria-labelledby` as needed
  - separator is decorative (`role="none"`, `aria-hidden="true"`)
- plain style defaults:
  - default orientation is horizontal
  - default text/separator styles are neutral token-driven (`bg-muted`, `bg-input`, border joins), no heavy effects
