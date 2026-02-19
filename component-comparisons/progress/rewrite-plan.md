# progress Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] API name: `value` - local already uses shadcn naming (not zardui's `progress`), no changes needed

## Non-conflict Extensions (ArgusX Plain)
- [x] Add `shape` input: 'default' | 'square' = 'default' (inherited from zardui zShape)
- [x] Ensure extension does not break shadcn main path
- [x] Set plain default style behavior

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] No legacy APIs to remove - current implementation is clean

## Naming Migration (z -> argusx)
- [x] Already using `app-progress` selector (argusx prefix)
- [x] No zardui naming used in local component

## shadcn API Alignment
- [x] API surface: value, max already aligned with shadcn
- [x] behavior: progress bar with percentage calculation
- [x] accessibility: role="progressbar", aria attributes

## Plain Style Alignment
- [x] default variant/style is plain (default variant uses bg-primary)
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
1. `src/app/shared/ui/progress/progress.component.ts` - Add shape input
2. `src/app/shared/ui/progress/index.ts` - Export ProgressShape type
3. `src/app/preview/progress-preview.component.ts` - Add shape examples
