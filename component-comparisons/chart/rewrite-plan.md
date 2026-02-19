# chart Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
- [x] remove conflicting local/zardui primary entries

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
- [x] ensure extension does not break shadcn main path
- [x] set plain default style behavior

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
- [x] keep single canonical API path only

## Naming Migration (app -> argusx)
- [x] selector migration: `app-chart-container` -> `argusx-chart`
- [x] selector migration: `app-chart-tooltip` -> `argusx-chart-tooltip`
- [x] selector migration: `app-chart-legend` -> `argusx-chart-legend`
- [x] input/output/type symbol migration (N/A - no z-prefixed symbols)
- [x] index export migration

## shadcn API Alignment
- [x] API surface alignment (config, series, type, options, etc.)
- [x] behavior alignment (keep ApexCharts implementation)
- [x] accessibility alignment (role="img", aria-label)

## Plain Style Alignment
- [x] default variant/style is plain (no heavy shadows, gradients)
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
1. `src/app/shared/ui/chart/chart-container.component.ts` - selector renamed to `argusx-chart`
2. `src/app/shared/ui/chart/chart-tooltip.component.ts` - selector renamed to `argusx-chart-tooltip`
3. `src/app/shared/ui/chart/chart-legend.component.ts` - selector renamed to `argusx-chart-legend`
4. `src/app/shared/ui/chart/index.ts` - updated with examples
5. `src/app/preview/chart-preview.component.ts` - updated with new selectors and expanded examples
6. `src/app/preview/preview-layout.component.ts` - updated reviewStatus to 'reviewed'
