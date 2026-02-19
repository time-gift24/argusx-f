# skeleton API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | `z-skeleton` | `[appSkeleton]` | N/A | `argusx-skeleton` | yes | extend-argusx | Renamed from appSkeleton to argusx-skeleton | Z1/L1 |
| input/class | `class: input<ClassValue>` | `class: input<string>` | className | `class: input<string>` | no | extend-argusx | Keep local approach (string), shadcn uses className but no conflict | Z1/L1/S1 |
| variant | cva variants (empty) | none | none | none | no | extend-argusx | No variants needed for plain style | Z2 |
| data-slot | `data-slot="skeleton"` | `data-slot="skeleton"` | N/A | `data-slot="skeleton"` | no | extend-argusx | Standard slot attribute | Z1/L1 |
| animation | `animate-pulse` | `animate-pulse` | N/A | `animate-pulse` | no | extend-argusx | Standard loading animation | Z1/L1 |
| base style | `bg-accent rounded-md` | `bg-muted rounded-md` | N/A | `bg-muted rounded-md` | no | extend-argusx | Plain style uses bg-muted (neutral) | L1 |

## Conflict Decisions (Must Adopt shadcn)
- None: skeleton is extremely simple (just a div), no complex API conflicts

## Non-conflict Extensions (ArgusX Plain)
- selector: Convert from directive `[appSkeleton]` to component `<argusx-skeleton>` - aligns with zardui pattern while using argusx prefix
- base style: Use `bg-muted` instead of `bg-accent` - maintains plain/neutral appearance
- data-slot: Keep `data-slot="skeleton"` - standard slot attribute for styling hooks

## Missing APIs
- None: skeleton is a simple placeholder component

## Behavior Mismatches
- None: simple component with no behavioral differences

## Final Target API
- selectors: `argusx-skeleton`
- inputs: `class: input<string>('')`
- outputs: none
- data attributes: `data-slot="skeleton"`
- accessibility contract: Inherits naturally from div element
- plain style defaults: `bg-muted animate-pulse rounded-md`
