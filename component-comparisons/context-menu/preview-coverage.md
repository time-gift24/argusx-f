# context-menu Preview Coverage

## Required Scenarios
- [x] all primary input enums:
  - `side="top|right|bottom|left"` coverage exists. (`src/app/preview/context-menu-preview.component.ts:86-138`)
  - `variant="default|destructive"` coverage exists. (`src/app/preview/context-menu-preview.component.ts:169`, `src/app/preview/context-menu-preview.component.ts:425`)
- [x] key state combinations:
  - disabled items, shortcuts, submenu, checkbox, radio, inset. (`src/app/preview/context-menu-preview.component.ts:67`, `src/app/preview/context-menu-preview.component.ts:239-258`, `src/app/preview/context-menu-preview.component.ts:337-393`, `src/app/preview/context-menu-preview.component.ts:524-559`)
- [x] shadcn parity baseline examples:
  - basic, icons, shortcuts, submenu, groups/labels/separators all present.
- [x] one complex combined scenario:
  - "With Inset" section combines inset + checkbox + radio + submenu in one tree. (`src/app/preview/context-menu-preview.component.ts:504-570`)

## Local Preview Routes
- main: `/preview?component=context-menu`
- route source: `src/app/app.routes.ts:36-40`
- sidebar entry: `src/app/preview/preview-layout.component.ts:21`
- reference: `https://ui.shadcn.com/preview/radix/context-menu-example`
- dependent real usage preserved:
  - `/preview?component=llm-chat` (`src/app/preview/llm-chat/llm-chat-session-tabs.component.ts:90-166`)

## Verification Notes
- build:
  - `npm run build` passed (same session), only pre-existing CommonJS warnings unrelated to menu rewrite.
- tests:
  - `npx vitest run src/app/shared/ui/context-menu/**/*.spec.ts` passed.
  - full menu suite passed: `24/24` tests.
- manual check:
  - verified in browser at `/preview?component=context-menu`:
    - right-click opens menu with expected items.
    - keyboard `Shift+F10` opens menu.
    - explicit side configs render expected `data-side` (`top` and `left` validated).
  - verified in browser at `/preview?component=llm-chat`:
    - session tab context menu opens on right-click.
    - menu entries (`重命名`, `关闭会话`) and color submenu (`更换颜色`) are present and keyboard-openable.
