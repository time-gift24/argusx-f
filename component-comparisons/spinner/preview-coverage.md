# spinner Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
  - Size via class (e.g., class="size-4")
- [x] all non-conflict extension APIs in plain style
  - argusx-spinner selector, simple lucide icon
- [x] all key state combinations
  - Different sizes shown in preview
- [x] shadcn preview parity examples
  - Basic spinner, size variations, inline loading
- [x] one complex combined scenario
  - Spinner with text in inline loading context

## Local Preview Routes
- main: `/preview?component=spinner`
- reference: `https://ui.shadcn.com/preview/radix/spinner-example`

## Verification Notes
- build: ng build (to verify no errors)
- tests: no spec file exists, skip
- manual check: open /preview?component=spinner to verify visual
