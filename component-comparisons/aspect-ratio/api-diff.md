# aspect-ratio API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| primitive entry | N/A | missing before rewrite | `<AspectRatio />` component | `<argusx-aspect-ratio>` | no | adopt-shadcn | plain baseline is neutral container only | Z2/L1/U1 |
| `ratio` input | N/A | missing before rewrite | `ratio` prop on Root | `ratio` (`number \| string`, fallback `1`) | no | adopt-shadcn + extend-argusx | default ratio remains square (plain) | U1/U2/A1 |
| host class override | N/A | missing before rewrite | `className` passthrough | `class` input passthrough | no | adopt-shadcn | caller controls decoration level; default stays low-noise | U1/A1 |
| data slot contract | N/A | missing before rewrite | `data-slot="aspect-ratio"` | `data-slot="aspect-ratio"` | no | adopt-shadcn | slot contract unchanged | U1/A1 |
| style variant extension | N/A | missing before rewrite | N/A | `variant: 'plain' \| 'subtle'` (default `plain`) | no | extend-argusx | `plain` is default and decoration-minimal | A1/P2 |
| media fit extension | N/A | missing before rewrite | N/A | `fit: 'none' \| 'cover' \| 'contain'` (default `none`) | no | extend-argusx | default keeps native media behavior (plain) | A1/P2 |

## Conflict Decisions (Must Adopt shadcn)
- [x] `ratio` / class passthrough / `data-slot`: no existing local API, so shadcn shape is adopted directly as canonical public path (`ratio`, `class`, `data-slot="aspect-ratio"`). Evidence: U1, U2, A1.
- [x] No compatibility alias introduced. Only one entrypoint exists: `argusx-aspect-ratio`. Evidence: A1, A2.

## Non-conflict Extensions (ArgusX Plain)
- [x] `variant` extension: `plain` (default) and `subtle` for optional neutral chrome; does not alter shadcn core API semantics. Evidence: A1 (lines 7-17, 109), P2 (lines 35-66).
- [x] `fit` extension: media `object-fit` helper for direct child media (`none` default, `cover`, `contain`) to reduce repetitive caller classes while keeping baseline behavior untouched. Evidence: A1 (lines 22, 84-94, 115), P2 (lines 35-66).
- [x] ratio normalization extension: supports fraction strings (`"16/9"`) and invalid-value fallback to `1` without breaking shadcn numeric path. Evidence: A1 (lines 24-58, 103), T1 (lines 4-17).

## Missing APIs
- [x] Pre-rewrite missing component export and preview route (`aspect-ratio` nav item had no destination page). Evidence: L1, L2, L3.
- [x] Added shared export and route integration so `/preview?component=aspect-ratio` resolves correctly. Evidence: A2, A3.

## Behavior Mismatches
- [x] Pre-rewrite mismatch: navigation listed `aspect-ratio` but route/component implementation was absent. Expected behavior is navigable preview page with shadcn baseline + ArgusX extension scenarios. Evidence: L3, L2, P2, A3.

## Final Target API
- selectors:
  - `argusx-aspect-ratio`
- inputs:
  - shadcn baseline: `ratio`, `class`
  - ArgusX extension: `variant`, `fit`
- outputs:
  - none
- data attributes:
  - `data-slot="aspect-ratio"`
  - `data-variant`
  - `data-fit`
- accessibility contract:
  - semantic container only; projected media/text retains native semantics
  - no ARIA override that would conflict with child content semantics
- plain style defaults:
  - `variant="plain"` by default
  - no forced heavy shadow/gradient/glass effects
  - neutral token-based subtle option (`subtle`) only when explicitly requested

## Evidence Index
- `A1`: `src/app/shared/ui/aspect-ratio/aspect-ratio.component.ts` (new implementation)
- `A2`: `src/app/shared/ui/index.ts` (new barrel export)
- `A3`: `src/app/app.routes.ts` (preview route registration)
- `P2`: `src/app/preview/aspect-ratio-preview.component.ts` (scenario coverage)
- `T1`: `src/app/shared/ui/aspect-ratio/aspect-ratio.component.spec.ts` (normalization + variant tests)
