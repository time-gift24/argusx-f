# collapsible Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
- [x] all non-conflict extension APIs in plain style
- [x] all key state combinations
- [x] shadcn preview parity examples
- [x] one complex combined scenario

## Implemented Scenarios
- Shadcn parity: controlled `open` + `onOpenChange` + Trigger `asChild` (`argusx-button` 组合)
- Key states: `defaultOpen`、`disabled`
- ArgusX extension: `argusxVariant="plain"` baseline + `argusxVariant="muted"` 扩展
- Complex combination: controlled + `asChild` + extension + runtime disabled lock + event counter

## Local Preview Routes
- main: `/preview?component=collapsible`
- reference: `https://ui.shadcn.com/preview/radix/collapsible-example`

## Verification Notes
- build: `ng build` passed on 2026-02-19
- tests: no component spec found under `src/app/shared/ui/collapsible`
- manual check:
  - opened `http://127.0.0.1:4300/preview?component=collapsible`
  - verified headings and all required sections are present in rendered iframe snapshot
  - clicked shadcn parity trigger and confirmed `onOpenChange` text updates
  - toggled complex lock and confirmed trigger enters disabled state
