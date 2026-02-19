# button-group Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
  - root `orientation` (horizontal/vertical), text/separator shadcn class baseline, group role/data-slot contract
  - text `asChild` path against label composition
- [x] all non-conflict extension APIs in plain style
  - `[argusxButtonGroupText]` attribute selector extension
  - `autoOrientation` separator extension (default-off, opt-in)
- [x] all key state combinations
  - disabled/loading/open-adjacent button states inside group
- [x] shadcn preview parity examples
  - basic
  - with input
  - with text + asChild
  - with dropdown
  - with separator
  - with select + input
  - nested + pagination
  - vertical + vertical nested
- [x] one complex combined scenario
  - nested groups + select/input + dropdown + vertical compositions

## Local Preview Routes
- main: `/preview?component=button-group`
- reference: `https://ui.shadcn.com/preview/radix/button-group-example`

## Verification Notes
- build:
  - `npm run build` (pass)
  - warning-only output exists in unrelated markdown/mermaid/prism bundles (pre-existing CommonJS and budget warnings)
- tests:
  - no component spec found at `src/app/shared/ui/button-group/**/*.spec.ts`, so no targeted component test run
- manual check:
  - open `/preview?component=button-group` and confirm all sections render:
    - shadcn parity sections and ArgusX extension sections
  - regression focus: `With Input (shadcn)` block should show `button + input` and `input + button` at the same height after global `argusxInput` baseline alignment (`h-7`)
