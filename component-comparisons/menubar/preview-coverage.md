# menubar Preview Coverage

## Required Scenarios
- [x] all primary input enums:
  - content offsets (`alignOffset`, `sideOffset`) used. (`src/app/preview/menubar-preview.component.ts:23`)
  - item variants include destructive path. (`src/app/preview/menubar-preview.component.ts:93`)
- [x] key state combinations:
  - disabled item, inset label/item, checkbox, radio-group, submenu. (`src/app/preview/menubar-preview.component.ts:32`, `src/app/preview/menubar-preview.component.ts:38`, `src/app/preview/menubar-preview.component.ts:66-86`)
- [x] shadcn parity baseline:
  - desktop menubar with multiple top-level menus and shortcut rows.
- [x] one complex combined scenario:
  - `View` + `File` menus jointly cover checkbox + radio + inset + submenu + disabled in the same preview.

## Local Preview Routes
- main: `/preview?component=menubar`
- route source: `src/app/app.routes.ts:232-236`
- sidebar entry: `src/app/preview/preview-layout.component.ts:50`
- reference: `https://ui.shadcn.com/preview/radix/menubar-example`

## Verification Notes
- build:
  - `npm run build` passed after menubar offset/data-side updates; only existing unrelated CommonJS warnings remained.
- tests:
  - `npx vitest run src/app/shared/ui/menubar/**/*.spec.ts` passed (`6/6`).
  - full menu suite passed (`24/24`).
- manual check:
  - verified in browser at `/preview?component=menubar`:
    - `Enter` opens menu; `ArrowRight` switches top-level menu while open.
    - checkbox keeps menu open; radio selection closes menu.
    - submenu opens from `SubTrigger + ArrowRight` (fixed bubbling conflict in `menubar.component.ts`).
    - content exposes `data-side` and default offset behavior (`alignOffset=-4`, `sideOffset=8`) is applied.
