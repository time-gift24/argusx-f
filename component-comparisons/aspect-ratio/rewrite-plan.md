# aspect-ratio Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
  - kept canonical API concepts: `ratio`, class passthrough, and `data-slot="aspect-ratio"`
- [x] remove conflicting local/zardui primary entries
  - N/A conflict set (component was missing locally and absent in zardui), so no alias/dual path introduced

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
  - added `variant` (`plain`/`subtle`) and `fit` (`none`/`cover`/`contain`)
- [x] ensure extension does not break shadcn main path
  - `ratio` + class path still works exactly as shadcn baseline
- [x] set plain default style behavior
  - default `variant="plain"` and `fit="none"`

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
  - no legacy API existed, and none was created
- [x] keep single canonical API path only
  - single selector: `argusx-aspect-ratio`

## Naming Migration (z -> argusx)
- [x] selector migration
  - component selector is `argusx-aspect-ratio`
- [x] input/output/type symbol migration
  - types are exported as `ArgusxAspectRatio*`
- [x] index export migration
  - added `src/app/shared/ui/aspect-ratio/index.ts` and exported in `src/app/shared/ui/index.ts`

## shadcn API Alignment
- [x] API surface alignment
  - shadcn baseline `ratio` + class passthrough preserved
- [x] behavior alignment
  - host emits `data-slot="aspect-ratio"` and supports media-in-ratio container usage
- [x] accessibility alignment
  - component is a neutral container and does not override projected child semantics

## Plain Style Alignment
- [x] default variant/style is plain
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Execution Log
1. `src/app/shared/ui/aspect-ratio/aspect-ratio.component.ts`
  - implemented shadcn baseline API + ArgusX plain extensions, with ratio normalization and data attributes
2. `src/app/shared/ui/aspect-ratio/index.ts`
  - exported component, variants, types, and normalization helper
3. `src/app/shared/ui/aspect-ratio/aspect-ratio.component.spec.ts`
  - added tests for ratio normalization and default/plain variant behavior
4. `src/app/shared/ui/index.ts`
  - added shared barrel export for `aspect-ratio`
5. `src/app/preview/aspect-ratio-preview.component.ts`
  - added baseline, extension, key-state, and complex composition scenarios
6. `src/app/app.routes.ts`
  - registered `/preview/aspect-ratio` route
