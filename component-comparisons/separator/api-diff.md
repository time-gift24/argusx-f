# separator API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | z-divider | app-separator | Separator | argusx-separator | yes | adopt-shadcn | - | Z1/L1/S1 |
| orientation | zOrientation | orientation | orientation | orientation | yes | adopt-shadcn | plain default | Z1/L1/S1 |
| spacing | zSpacing | - | - | spacing | no | extend-argusx | plain spacing | Z2 |
| decorative | - | decorative | - | decorative-argusx | no | extend | plain a11y | L1 |
| class | class | class | className | class | yes | adopt-shadcn | - | Z1/L1/S1 |

## Conflict Decisions (Must Adopt shadcn)
- [x] selector: local uses app-separator, shadcn uses Separator -> adopt shadcn: argusx-separator
- [x] orientation: local uses orientation, zardui uses zOrientation -> adopt shadcn: orientation
- [x] class: shadcn uses className but Angular uses class binding -> maintain local class input

## Non-conflict Extensions (ArgusX Plain)
- [x] decorative: local extends shadcn with accessibility control (role="none" vs role="separator") -> argusx-separator with plain a11y
- [x] spacing: zardui has zSpacing (none/sm/default/lg) -> extend as optional plain spacing control

## Missing APIs
- None - all key APIs covered

## Behavior Mismatches
- None - behavior aligned

## Final Target API
- selectors: argusx-separator
- inputs:
  - orientation: 'horizontal' | 'vertical' (default: 'horizontal')
  - decorative: boolean (default: true)
  - class: string (default: '')
  - spacing: 'none' | 'sm' | 'default' | 'lg' (optional extension)
- outputs: none
- data attributes: data-slot="separator", data-orientation
- accessibility contract:
  - decorative=true: role="none", aria-hidden="true"
  - decorative=false: role="separator", aria-orientation
- plain style defaults:
  - variant: plain (default)
  - uses bg-border token
  - no heavy decoration
