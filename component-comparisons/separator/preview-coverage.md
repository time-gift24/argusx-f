# separator Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior (orientation, class)
- [x] all non-conflict extension APIs in plain style (decorative)
- [x] all key state combinations (horizontal, vertical)
- [x] shadcn preview parity examples (account section, navigation links)
- [x] one complex combined scenario (vertical separators with custom height)

## Local Preview Routes
- main: `/preview?component=separator`
- reference: `https://ui.shadcn.com/preview/radix/separator-example`

## Preview Update Needed
- Update selector from app-separator to argusx-separator
- Add decorative example to show accessibility behavior

## Verification Notes
- build: pending validation
- tests: no spec file exists
- manual check: pending at http://localhost:4200/preview/separator
