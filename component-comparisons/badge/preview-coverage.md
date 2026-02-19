# badge Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior (all 6 variants displayed)
- [x] all non-conflict extension APIs in plain style (none applicable)
- [x] all key state combinations (focus-visible ring, aria-invalid state)
- [x] shadcn preview parity examples (basic variants, icon badges, numeric counters)
- [x] one complex combined scenario (badges with icons + custom class overrides + multiple variants together)

## Local Preview Routes
- main: `/preview?component=badge`
- reference: `https://ui.shadcn.com/preview/radix/badge-example`

## Verification Notes
- build: must pass `ng build`
- tests: no existing spec file for badge
- manual check: verify all 6 variants render correctly, icon badges display properly, link badges are interactive
