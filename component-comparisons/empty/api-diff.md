# empty API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector: root | N/A | `[appEmpty]` | `[Empty]` | `[argusxEmpty]` | yes | adopt-shadcn (naming) | plain default | L1/S1 |
| selector: header | N/A | `[appEmptyHeader]` | `[EmptyHeader]` | `[argusxEmptyHeader]` | yes | adopt-shadcn (naming) | plain default | L1/S1 |
| selector: media | N/A | `[appEmptyMedia]` | `[EmptyMedia]` | `[argusxEmptyMedia]` | yes | adopt-shadcn (naming) | plain default | L1/S1 |
| selector: title | N/A | `[appEmptyTitle]` | `[EmptyTitle]` | `[argusxEmptyTitle]` | yes | adopt-shadcn (naming) | plain default | L1/S1 |
| selector: description | N/A | `[appEmptyDescription]` | `[EmptyDescription]` | `[argusxEmptyDescription]` | yes | adopt-shadcn (naming) | plain default | L1/S1 |
| selector: content | N/A | `[appEmptyContent]` | `[EmptyContent]` | `[argusxEmptyContent]` | yes | adopt-shadcn (naming) | plain default | L1/S1 |
| variant prop | N/A | yes (default/muted) | yes | yes | no | extend-argusx | plain style | L1/S1 |
| size prop | N/A | yes (default/sm/lg) | no | yes | no | extend-argusx | plain style | L1/S1 |
| media variant | N/A | yes (default/icon) | yes | yes | no | extend-argusx | plain style | L1/S1 |
| data-slot | N/A | yes | yes | yes | no | extend-argusx | N/A | L1/S1 |

## Conflict Decisions (Must Adopt shadcn)
- Selector naming: local used `appEmpty*`, shadcn uses `Empty*`. Adopted `argusxEmpty*` for argusx prefix + shadcn naming convention.

## Non-conflict Extensions (ArgusX Plain)
- Size prop on root: Added `size` input (default/sm/lg) for container sizing - plain style via Tailwind spacing tokens
- Media variant: Already aligned with shadcn (`default`/`icon`)
- Data attributes: Maintained `data-slot`, `data-variant`, `data-size` for styling hooks

## Missing APIs
- None. All shadcn APIs are present.

## Behavior Mismatches
- None. Implementation aligned with shadcn structure.

## Final Target API
- selectors: `[argusxEmpty]`, `[argusxEmptyHeader]`, `[argusxEmptyMedia]`, `[argusxEmptyTitle]`, `[argusxEmptyDescription]`, `[argusxEmptyContent]`
- inputs:
  - `argusxEmpty`: `variant` (default/muted), `size` (default/sm/lg), `class`
  - `argusxEmptyMedia`: `variant` (default/icon), `size` (default/sm/lg), `class`
  - `argusxEmptyHeader`: `class`
  - `argusxEmptyTitle`: `class`
  - `argusxEmptyDescription`: `class`
  - `argusxEmptyContent`: `class`
- outputs: none
- data attributes: `data-slot`, `data-variant`, `data-size`
- accessibility contract: `aria-live="polite"`, `role="status"` on root; `aria-hidden` on icon media
- plain style defaults: variant=default, size=default, neutral colors, minimal borders
