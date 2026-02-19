# button Preview Coverage

## Required Scenarios
- [x] all primary input enums
  - `variant`: default / destructive / outline / secondary / ghost / link
  - `size`: xs / sm / default / lg / icon / icon-xs / icon-sm / icon-lg
- [x] all key state combinations
  - enabled / disabled / loading
  - loading with spinner + disabled (shadcn style)
  - extension states with `shape` and `full`
- [x] shadcn preview parity examples
  - outline + icon button
  - size matrix including icon sizes
  - loading with spinner pattern
  - asChild pattern via `getClasses()`
- [x] one complex combined scenario
  - `argusx-button` with `variant`, `size`, `loading`, icon composition

## Local Preview Routes
- main: `/preview?component=button`
- reference: `https://ui.shadcn.com/preview/radix/button-example`

## Verification Notes
- build:
  - `ng build`
- tests:
  - Angular CLI test target is not configured in this workspace (`ng test` reports missing target)
  - executed `npx vitest run src/app/shared/ui/button/button.directive.spec.ts`
- migration checks:
  - `rg -n "argus-button|argusButton" src/app -g"*.ts" -g"*.html"` returns no matches
  - `rg -n "argusx-button" src/app -g"*.ts" -g"*.html"` returns expected usage sites
- manual check:
  - open preview route and verify each section renders and is interactive
