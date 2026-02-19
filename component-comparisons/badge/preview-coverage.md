# badge Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
- [x] all non-conflict extension APIs in plain style (`shape`)
- [x] all key state combinations
- [x] shadcn preview parity examples
- [x] one complex combined scenario

## Local Preview Routes
- main: `/preview?component=badge`
- reference: `https://ui.shadcn.com/preview/radix/badge-example`

## Verification Notes
- build: pass (`npm run build`, Angular build success, existing workspace warnings only: markdown css budget + CommonJS dependency notices)
- tests: no `src/app/shared/ui/badge/**/*.spec.ts`
- manual check:
  - core variants: `default/secondary/destructive/outline/ghost/link`
  - extension: `shape=default/square/pill`
  - a11y: `tabindex="0"` focus ring and `aria-invalid="true"` ring/border state
  - complex: link + icon + numeric + shape in same composition
  - status: browser manual check not executed in this terminal session
