# Avatar API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | N/A | `app-avatar` | `Avatar` | `argusx-avatar` | yes | adopt-shadcn | plain default | L1/S3 |
| image directive | N/A | `img[appAvatarImage]` | `AvatarImage` | `img[argusxAvatarImage]` | yes | adopt-shadcn | plain default | L1/S3 |
| fallback directive | N/A | `[appAvatarFallback]` | `AvatarFallback` | `[argusxAvatarFallback]` | yes | adopt-shadcn | plain default | L1/S3 |
| size prop | N/A | `size: 'default' \| 'sm' \| 'lg'` | N/A | `size: 'default' \| 'sm' \| 'lg'` | no | extend-argusx | default is plain | L1 |
| badge component | N/A | `app-avatar-badge` | N/A | `argusx-avatar-badge` | no | extend-argusx | ArgusX extension | L1 |
| group component | N/A | `app-avatar-group` | N/A | `argusx-avatar-group` | no | extend-argusx | ArgusX extension | L1 |
| group-count | N/A | `app-avatar-group-count` | N/A | `argusx-avatar-group-count` | no | extend-argusx | ArgusX extension | L1 |
| data-slot attr | N/A | `data-slot="avatar"` | `data-slot` | `data-slot="avatar"` | no | adopt-shadcn | aligned | L1/S3 |
| data-size attr | N/A | `data-size` | N/A | `data-size` | no | extend-argusx | plain default | L1 |

## Conflict Decisions (Must Adopt shadcn)
- [x] selector: app-avatar -> argusx-avatar (shadcn uses Avatar, migrated to argusx- prefix)
- [x] image directive: appAvatarImage -> argusxAvatarImage (shadcn uses AvatarImage)
- [x] fallback directive: appAvatarFallback -> argusxAvatarFallback (shadcn uses AvatarFallback)
- [x] data-slot attribute: aligned with shadcn data-slot pattern

## Non-conflict Extensions (ArgusX Plain)
- [x] size: 'default' | 'sm' | 'lg' - ArgusX extension with plain default styling
- [x] argusx-avatar-badge - ArgusX extension for status badges
- [x] argusx-avatar-group - ArgusX extension for stacked avatars
- [x] argusx-avatar-group-count - ArgusX extension for avatar count

## Missing APIs
None - local already has all necessary features

## Behavior Mismatches
None - component behavior is aligned with shadcn

## Final Target API
- selectors:
  - `argusx-avatar` (root)
  - `img[argusxAvatarImage]` (image)
  - `[argusxAvatarFallback]` (fallback)
  - `argusx-avatar-badge` (badge)
  - `argusx-avatar-group` (group)
  - `argusx-avatar-group-count` (group count)
- inputs:
  - `size: 'default' | 'sm' | 'lg'` (on ArgusxAvatarComponent)
  - `class: string` (on all components/directives)
- outputs: none
- data attributes:
  - `data-slot="avatar"`, `data-slot="avatar-image"`, `data-slot="avatar-fallback"`, etc.
  - `data-size` (on avatar root)
- accessibility contract:
  - Fallback shows initials as text
  - Image has alt text support
  - Proper ARIA semantics via data-slot
- plain style defaults:
  - rounded-full for avatar
  - muted colors for fallback
  - minimal decoration, no heavy shadows
