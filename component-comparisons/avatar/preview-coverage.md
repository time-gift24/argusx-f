# Avatar Preview Coverage

## Required Scenarios
- [x] basic avatar with image and fallback
- [x] avatar with different sizes (sm, default, lg)
- [x] avatar with badge (status indicator)
- [x] avatar group (stacked avatars)
- [x] avatar group with count (+N)
- [x] avatar group with badges
- [x] all conflict APIs with shadcn-aligned behavior
- [x] all non-conflict extension APIs in plain style
- [x] all key state combinations (image loading, loaded, error)
- [x] shadcn preview parity examples
- [x] one complex combined scenario (group with badges)

## Local Preview Routes
- main: `/preview?component=avatar`
- reference: `https://ui.shadcn.com/preview/radix/avatar`

## Verification Notes
- build: PASSED - npm run build completes without errors
- tests: N/A - no spec files for avatar component
- manual check: preview at http://localhost:4200/preview/avatar
