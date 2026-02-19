# tabs Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] value binding: Already using value model (shadcn pattern).
- [x] orientation: Already using orientation (shadcn pattern).
- [x] valueChange: Already implemented.
- [x] Selectors: Keep existing `app-tabs-*` for backwards compatibility.

## Non-conflict Extensions (ArgusX Plain)
- [x] Add `defaultValue` input to match shadcn API.
- [x] Ensure variant default is "default" (plain style).
- [x] Keep existing disabled behavior.

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] Keep existing selectors (app-tabs-*) for backwards compatibility.
- [x] Single canonical API path.

## Naming Migration (z -> argusx)
- [x] Selectors already use `app-` prefix (not `z-`), no change needed.

## shadcn API Alignment
- [x] Add `defaultValue` input.
- [x] Verify all inputs/outputs match.

## Plain Style Alignment
- [x] variant default is "default" (bg-muted, rounded).
- [x] Minimal decoration, use theme tokens.
- [x] Verify no hardcoded brand colors.

## File-level Plan
1. `src/app/shared/ui/tabs/tabs.component.ts` - Add defaultValue input
2. `src/app/shared/ui/tabs/index.ts` - No changes needed
3. `src/app/preview/tabs-preview.component.ts` - Update to show defaultValue usage
