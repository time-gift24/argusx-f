# button-group Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
  - aligned to shadcn `orientation` defaults and group/text/separator class contracts
  - migrated API naming from `app-*` to `argusx-*`
- [x] remove conflicting local/zardui primary entries
  - removed `app-button-group`, `app-button-group-text`, `app-button-group-separator` selectors from source
  - no compatibility alias or dual-entry mode retained

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
  - semantic attribute selectors: `div[argusxButtonGroup]`, `[argusxButtonGroupText]`, `[argusxButtonGroupSeparator]`
  - separator extension: `autoOrientation` (opt-in)
- [x] ensure extension does not break shadcn main path
  - `autoOrientation` default is `false`; shadcn default `orientation="vertical"` remains intact
- [x] set plain default style behavior
  - token-driven neutral classes only; no gradient/heavy-shadow defaults

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
  - old `app-*` selectors removed from component implementation
- [x] keep single canonical API path only
  - canonical public API is now `argusx-*` selectors plus documented extension selectors

## Naming Migration (z -> argusx)
- [x] selector migration
  - `z-button-group` semantics mapped to `argusx-button-group`
  - local `app-*` selectors migrated to `argusx-*`
- [x] input/output/type symbol migration
  - `zOrientation` -> `orientation`
  - exported type standardized as `ArgusxButtonGroupOrientation`
- [x] index export migration
  - `src/app/shared/ui/button-group/index.ts` now exports argusx symbols + variants

## shadcn API Alignment
- [x] API surface alignment
  - group orientation/defaults and separator orientation/defaults aligned with shadcn
  - text `asChild` API added to match shadcn contract
- [x] behavior alignment
  - group variant classes now match shadcn radix-mira (single-item fixes, nested spacing, select-trigger handling, orientation joins)
  - text style now matches shadcn mira baseline (`px-2.5`, `text-xs/relaxed`)
- [x] accessibility alignment
  - group `role="group"` retained
  - separator marked decorative (`role="none"`, `aria-hidden="true"`)

## Plain Style Alignment
- [x] default variant/style is plain
  - no component-level variant override added; defaults are neutral
- [x] avoid heavy decoration in default state
  - text and separator both stay on neutral token styling, no high-noise decoration
- [x] verify token usage and no hardcoded brand colors in component internals
  - styles rely on shared tokens (`bg-muted`, `bg-input`, border utilities)

## File-level Plan
1. `src/app/shared/ui/button-group/...`
2. `src/app/shared/ui/button-group/index.ts`
3. `src/app/preview/button-group-preview.component.ts`
