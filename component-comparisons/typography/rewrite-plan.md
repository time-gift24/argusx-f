# typography Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] No conflicts exist - CSS classes already aligned with shadcn
- [x] N/A - No conflicting local/zardui entries

## Non-conflict Extensions (ArgusX Plain)
- [x] Define extension API and naming: `argusxTypography*` prefix for selectors and class names
- [x] Ensure extension does not break shadcn main path: CSS classes remain unchanged
- [x] Set plain default style behavior: Using shadcn's default typography CSS (plain style)

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] Remove legacy API entrances and deprecated aliases: Replace `appTypography*` with `argusxTypography*`
- [x] Keep single canonical API path only: Only `argusxTypography*` exports

## Naming Migration (app -> argusx)
- [x] Selector migration: `appTypography*` -> `argusxTypography*`
- [x] Class name migration: `Typography*Directive` -> `ArgusxTypography*Directive`
- [x] Index export migration: Update all export names

## shadcn API Alignment
- [x] API surface alignment: CSS utility classes match shadcn exactly
- [x] Behavior alignment: Directives apply shadcn CSS classes
- [x] Accessibility alignment: Relies on semantic HTML elements (h1-h4, p, blockquote, etc.)

## Plain Style Alignment
- [x] Default variant/style is plain: Using shadcn's default typography CSS classes
- [x] Avoid heavy decoration in default state: shadcn typography is inherently plain
- [x] Verify token usage: Using CSS variables from styles.css theme

## File-level Plan
1. [x] `src/app/shared/ui/typography/typography.directive.ts` - Update selectors and class names
2. [x] `src/app/shared/ui/typography/index.ts` - Update exports
3. [x] Add typography route to `src/app/app.routes.ts`
4. [x] Add typography to `src/app/preview/preview-layout.component.ts` PREVIEW_ITEMS
5. [x] Create `src/app/preview/typography-preview.component.ts`
