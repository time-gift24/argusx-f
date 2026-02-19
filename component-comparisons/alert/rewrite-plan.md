# alert Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs - Already aligned
- [x] remove conflicting local/zardui primary entries - N/A, no conflicts

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming - Additional variants (warning, info, success), close output
- [x] ensure extension does not break shadcn main path - Extended variants don't break default/destructive
- [x] set plain default style behavior - Using Tailwind CSS variables, no hardcoded brand colors

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases - N/A, no legacy aliases
- [x] keep single canonical API path only - Already done

## Naming Migration (z -> argusx)
- [x] selector migration - `app-alert` -> `argusx-alert`, etc.
- [x] input/output/type symbol migration - Component names updated to ArgusxAlertComponent, etc.
- [x] index export migration - Updated exports with aliased names

## shadcn API Alignment
- [x] API surface alignment - variant, AlertTitle, AlertDescription
- [x] behavior alignment - Grid layout, slot support
- [x] accessibility alignment - role="alert", aria-live="polite"

## Plain Style Alignment
- [x] default variant/style is plain - Uses `bg-card` and `text-card-foreground`
- [x] avoid heavy decoration in default state - No shadows, gradients
- [x] verify token usage and no hardcoded brand colors in component internals - Uses CSS variables

## File-level Plan
- [x] 1. `src/app/shared/ui/alert/alert.component.ts` - Updated selector to argusx-alert, class to ArgusxAlertComponent
- [x] 2. `src/app/shared/ui/alert/alert-title.component.ts` - Updated selector to argusx-alert-title, class to ArgusxAlertTitleComponent
- [x] 3. `src/app/shared/ui/alert/alert-description.component.ts` - Updated selector to argusx-alert-description, class to ArgusxAlertDescriptionComponent
- [x] 4. `src/app/shared/ui/alert/alert-action.component.ts` - Updated selector to argusx-alert-action, class to ArgusxAlertActionComponent
- [x] 5. `src/app/shared/ui/alert/index.ts` - Updated exports with aliased names
- [x] 6. `src/app/preview/alert-preview.component.ts` - Updated template references
