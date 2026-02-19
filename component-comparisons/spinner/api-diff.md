# spinner API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | `z-loader` | `app-spinner` | N/A | `argusx-spinner` | no | extend-argusx | N/A | L1 |
| size | `zSize` (sm/default/lg) | `size` (string like 'size-4') | via class | `class` (via class) | yes | adopt-shadcn | size via class is plain | S3 |
| variant | N/A | N/A | N/A | N/A | no | N/A | N/A | N/A |
| class | `class` | `class` | N/A | `class` | no | N/A | passthrough | L1 |
| animation | custom 12-bar spinner | lucide animate-spin | lucide animate-spin | lucide animate-spin | no | extend-argusx | plain animation | Z1 |

## Conflict Decisions (Must Adopt shadcn)
- [x] size: zardui uses `zSize` enum (sm/default/lg), shadcn uses class-based sizing (size-4). Adopt shadcn approach - size controlled via `class` prop. Evidence: S3 (spinner-size.tsx shows class="size-3", class="size-4", etc.)

## Non-conflict Extensions (ArgusX Plain)
- [x] selector: migrate from `app-spinner` to `argusx-spinner` per naming convention
- [x] implementation: reuse zardui's custom spinner structure as optional extension (data-varient), but default to simple lucide icon for plain style

## Missing APIs
- None identified - current API covers basic use cases

## Behavior Mismatches
- N/A - current implementation aligns with shadcn approach

## Final Target API
- selectors: `argusx-spinner`
- inputs:
  - `class`: string (for sizing via Tailwind classes like size-4, size-6)
- outputs: none
- data attributes: none required
- accessibility contract: role="status", aria-label="Loading"
- plain style defaults: simple circular spinner with animate-spin, no heavy decoration
