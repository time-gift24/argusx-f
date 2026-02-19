# combobox Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior  
  scenario: `shadcn Baseline (Single Select)` uses root/input/content/list/item/empty/group and clear/trigger toggles.
- [x] all non-conflict extension APIs in plain style  
  scenario: `ArgusX Plain Extension (Multiple + Chips + size="sm")` uses `multiple`, chips API, `size="sm"`.
- [x] all key state combinations  
  scenarios: disabled root, disabled option, controlled open state, selected/cleared values.
- [x] shadcn preview parity examples  
  parity mapping: single select with searchable input + clear/trigger, grouped list, item indicator.
- [x] one complex combined scenario  
  scenario: controlled `[(open)]`, `size="sm"`, `showTrigger=false`, `showClear=true`, top-aligned content, separator + grouped actions.

## Local Preview Routes
- main: `/preview?component=combobox`
- reference: `https://ui.shadcn.com/preview/radix/combobox-example`

## Verification Notes
- build: `ng build` ✅ (2026-02-19)
- tests: no component spec exists under `src/app/shared/ui/combobox/**/*.spec.ts`, so no targeted spec run
- manual check: preview scenarios are wired in `src/app/preview/combobox-preview.component.ts`; browser walkthrough not executed in this run
