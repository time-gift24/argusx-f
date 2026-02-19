# combobox Preview Coverage

## Required Scenarios
- [x] all `combobox-example` showcase scenarios from create preview
  list:
  `Basic`, `Disabled`, `Invalid`, `Framework`, `With Clear Button`, `With Auto Highlight`,
  `With Groups`, `With Groups and Separator`, `Large List (100 items)`, `With Icon Addon`,
  `Combobox in Popup`, `Form with Combobox`, `Combobox Multiple`,
  `Combobox Multiple Disabled`, `Combobox Multiple Invalid`, `Frameworks`,
  `Combobox Multiple (No Remove)`, `With Custom Item Rendering`,
  `Combobox in Dialog`, `With Other Inputs`, `Disabled Items`.
- [x] menu-core based visual contract
  applied to combobox content/item/label/separator via shared menu-core variants.
- [x] ArgusX extension parity kept
  retained multiple+chips path in plain style without compatibility aliases.

## Local Preview Routes
- main: `/preview?component=combobox`
- reference:
  `https://ui.shadcn.com/create?base=radix&style=mira&baseColor=neutral&theme=cyan&iconLibrary=lucide&font=nunito-sans&menuAccent=bold&menuColor=default&radius=medium&template=vite&rtl=false&item=combobox-example`
  and
  `https://ui.shadcn.com/preview/radix/combobox-example?item=combobox-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite`

## Verification Notes
- build: `ng build` ✅ (2026-02-19)
- tests: `npx vitest run src/app/shared/ui/combobox/combobox.component.spec.ts` ✅ (12 passed)
- manual check: pending manual QA in `/preview?component=combobox`
