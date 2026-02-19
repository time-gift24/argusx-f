# kbd Preview Coverage

## Target Baseline
- source reference:
  - `https://ui.shadcn.com/preview/radix/kbd-example?item=kbd-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite`
- replicated layout contract:
  - wrapper: `data-slot="example-wrapper"` equivalent grid (`min-h-screen`, 2-column on `md+`)
  - card: title row + dashed content area (`border border-dashed p-4 sm:p-6`)

## Reverse Check (kdb/kbd Capability Completeness)
- [x] `Basic`
  - covered as 3 independent keycaps: `Ctrl`, `⌘K`, `Ctrl + B`
  - capability mapped: `argusx-kbd`
- [x] `Modifier Keys`
  - covered as `⌘` + `C`
  - capability mapped: `argusx-kbd`
- [x] `KbdGroup`
  - covered with grouped semantic keys `Ctrl`, `Shift`, `P`
  - capability mapped: `argusx-kbd-group` + nested `argusx-kbd`
- [x] `Arrow Keys`
  - covered as directional keycaps `↑ ↓ ← →`
  - capability mapped: symbol rendering in `argusx-kbd`
- [x] `With Icons`
  - covered with icon-only keycaps (`CircleDashed`, `ArrowLeft`, `ArrowRight`)
  - capability mapped: icon slot inside `argusx-kbd`
- [x] `With Icons and Text`
  - covered with icon + text mixed content (`Left`, `Voice Enabled`)
  - capability mapped: mixed inline children in `argusx-kbd`
- [x] `InputGroup`
  - covered as `argusx-input-group` + inline-start addon with `<kbd>Space</kbd>`
  - capability mapped: composition with input-group primitives
- [x] `Tooltip`
  - covered as icon button trigger + tooltip content `Save Changes <kbd>S</kbd>`
  - capability mapped: tooltip-context `kbd` style + composition with button
- [x] `With samp`
  - covered as `<kbd><samp>File</samp></kbd>`
  - capability mapped: semantic nested text element support

## Route and Naming Fallback Check
- [x] main preview route works: `/preview?component=kbd`
- [x] typo fallback works: `/preview?component=kdb` auto-normalizes to `kbd`

## Gaps
- none for the current shadcn `kbd-example` scenario set.

