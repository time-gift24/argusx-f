# badge API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | N/A | `appBadge` on span/a/div | N/A (React component) | `argusx-badge` on span/a/div | yes | adopt-shadcn naming with argusx prefix | N/A | L1 |
| variant input | N/A | 6 variants (default/secondary/destructive/outline/ghost/link) | 6 variants (same names) | same 6 variants | no | adopt-shadcn styles exactly | default variant is plain-compatible | S1/L1 |
| default variant value | N/A | `'default'` | `'default'` | `'default'` | no | adopt-shadcn | primary bg as shadcn baseline | S1 |
| class input | N/A | `class` string input | `className` prop | `class` input (Angular convention) | no | extend-argusx | Angular-idiomatic class pass-through | L1 |
| data-slot | N/A | `"badge"` | `"badge"` | `"badge"` | no | adopt-shadcn | N/A | S2/L4 |
| data-variant | N/A | present | present | present | no | adopt-shadcn | N/A | S2/L4 |
| base classes | N/A | h-5, text-[0.625rem], group/badge | no forced height, text-xs | align with shadcn | yes | adopt-shadcn | cleaner plain baseline | S3/L3 |
| destructive style | N/A | bg-destructive/10 text-destructive | bg-destructive text-white | adopt shadcn solid bg | yes | adopt-shadcn | S1/L2 |
| hover selectors | N/A | `[a]:hover` | `[a&]:hover` | adopt shadcn pattern | yes | adopt-shadcn | correct CSS nesting | S1/L2 |
| transition | N/A | `transition-all` | `transition-[color,box-shadow]` | adopt shadcn | yes | adopt-shadcn | more specific | S3/L3 |
| svg size | N/A | `[&>svg]:size-2.5!` | `[&>svg]:size-3` | adopt shadcn | yes | adopt-shadcn | S3/L3 |
| outline default bg | N/A | `bg-input/20 dark:bg-input/30` | no default bg | adopt shadcn (no bg) | yes | adopt-shadcn | cleaner plain | S1/L2 |
| ghost variant | N/A | hover on all elements | `[a&]:hover` only | adopt shadcn | yes | adopt-shadcn | S1/L2 |

## Conflict Decisions (Must Adopt shadcn)
- [x] selector: `appBadge` -> `argusx-badge` (argusx prefix convention per rewrite skill) -- L1
- [x] class symbol: `BadgeDirective` -> `ArgusxBadgeDirective` -- L1
- [x] base classes: remove `h-5`, `text-[0.625rem]`, `group/badge`; adopt shadcn `text-xs`, no forced height -- S3/L3
- [x] destructive variant: adopt `bg-destructive text-white [a&]:hover:bg-destructive/90 dark:bg-destructive/60` -- S1/L2
- [x] hover selectors: `[a]:hover` -> `[a&]:hover` for correct CSS nesting -- S1/L2
- [x] transition: `transition-all` -> `transition-[color,box-shadow]` -- S3/L3
- [x] svg sizing: `[&>svg]:size-2.5!` -> `[&>svg]:size-3` -- S3/L3
- [x] ghost variant: `hover:bg-muted...` -> `[a&]:hover:bg-accent [a&]:hover:text-accent-foreground` -- S1
- [x] outline variant: remove `bg-input/20`, use `[a&]:hover:bg-accent [a&]:hover:text-accent-foreground` -- S1
- [x] default hover: `[a]:hover:bg-primary/80` -> `[a&]:hover:bg-primary/90` -- S1
- [x] secondary hover: `[a]:hover:bg-secondary/80` -> `[a&]:hover:bg-secondary/90` -- S1

## Non-conflict Extensions (ArgusX Plain)
- (none identified -- badge is a simple display component with no additional capabilities needed beyond shadcn)

## Missing APIs
- (none -- all shadcn APIs are covered or not applicable in Angular directive model)

## Behavior Mismatches
- [x] destructive: local uses translucent bg (bg-destructive/10 text-destructive), shadcn uses solid bg (bg-destructive text-white). Adopt shadcn. -- S1/L2
- [x] outline: local adds `bg-input/20 dark:bg-input/30` background, shadcn has no default background. Adopt shadcn. -- S1/L2
- [x] ghost: local applies hover to all elements, shadcn only applies hover when used as anchor `[a&]`. Adopt shadcn. -- S1/L2

## Final Target API
- selectors: `span[argusx-badge], a[argusx-badge], div[argusx-badge]`
- inputs: `variant` (default|secondary|destructive|outline|ghost|link, default: 'default'), `class` (string, default: '')
- outputs: (none)
- data attributes: `data-slot="badge"`, `data-variant`
- accessibility contract: focus-visible ring (border-ring + ring-ring/50 + ring-[3px]), aria-invalid styling (ring-destructive + border-destructive)
- plain style defaults: default variant uses primary bg (shadcn baseline); all variants follow shadcn exactly with no additional decoration
