# Avatar Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
- [x] selector: app-avatar -> argusx-avatar
- [x] image directive: appAvatarImage -> argusxAvatarImage
- [x] fallback directive: appAvatarFallback -> argusxAvatarFallback
- [x] remove conflicting local primary entries

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
- [x] argusx-avatar-badge component
- [x] argusx-avatar-group component
- [x] argusx-avatar-group-count component
- [x] ensure extension does not break shadcn main path
- [x] set plain default style behavior

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
- [x] keep single canonical API path only
- [x] no app-avatar* selectors remaining

## Naming Migration (app -> argusx)
- [x] selector migration:
  - app-avatar -> argusx-avatar
  - appAvatarImage -> argusxAvatarImage (attribute selector)
  - appAvatarFallback -> argusxAvatarFallback (attribute selector)
  - app-avatar-badge -> argusx-avatar-badge
  - app-avatar-group -> argusx-avatar-group
  - app-avatar-group-count -> argusx-avatar-group-count
- [x] input/output/type symbol migration:
  - AvatarRootToken -> ArgusxAvatarRootToken
  - AvatarComponent -> ArgusxAvatarComponent
  - AvatarImageDirective -> ArgusxAvatarImageDirective
  - AvatarFallbackDirective -> ArgusxAvatarFallbackDirective
  - AvatarBadgeComponent -> ArgusxAvatarBadgeComponent
  - AvatarGroupComponent -> ArgusxAvatarGroupComponent
  - AvatarGroupCountComponent -> ArgusxAvatarGroupCountComponent
  - AvatarComponents -> ArgusxAvatarComponents
- [x] index export migration

## shadcn API Alignment
- [x] API surface alignment (selectors, inputs)
- [x] behavior alignment (image loading states)
- [x] accessibility alignment (data-slot, alt text)

## Plain Style Alignment
- [x] default variant/style is plain (rounded-full, muted colors)
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
- [x] `src/app/shared/ui/avatar/avatar.component.ts` - renamed all selectors and exports
- [x] `src/app/shared/ui/avatar/index.ts` - updated exports
- [x] `src/app/preview/avatar-preview.component.ts` - updated to use new selectors
- [x] `src/app/preview/card-preview.component.ts` - updated avatar usage
