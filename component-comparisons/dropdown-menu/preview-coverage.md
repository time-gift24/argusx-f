# dropdown-menu Preview Coverage

## Required Scenarios
- [x] all primary input enums:
  - `variant="default|destructive"` covered. (`src/app/preview/dropdown-menu-preview.component.ts:45`)
- [x] key state combinations:
  - checkbox state + radio state + separators/labels in one menu. (`src/app/preview/dropdown-menu-preview.component.ts:32-44`)
- [x] shadcn parity baseline:
  - account-style menu with label/group/shortcut-like structure and destructive item.
- [x] complex combined scenario:
  - checkbox + radio-group + destructive action in a single overlay. (`src/app/preview/dropdown-menu-preview.component.ts:32-45`)

## Local Preview Routes
- main: `/preview?component=dropdown-menu`
- route source: `src/app/app.routes.ts:176-180`
- sidebar entry: `src/app/preview/preview-layout.component.ts:42`
- reference: `https://ui.shadcn.com/preview/radix/dropdown-menu-example`

## Verification Notes
- build:
  - `npm run build` passed (menu rewrite branch state), with existing unrelated CommonJS warnings from markdown/mermaid dependencies.
- tests:
  - `npx vitest run src/app/shared/ui/dropdown-menu/**/*.spec.ts` passed.
  - `npx vitest run src/app/shared/ui/menu-core/**/*.spec.ts src/app/shared/ui/dropdown-menu/**/*.spec.ts src/app/shared/ui/context-menu/**/*.spec.ts src/app/shared/ui/menubar/**/*.spec.ts` passed (`24/24`).
- manual check:
  - verified in browser at `/preview?component=dropdown-menu`:
    - click trigger opens menu, checkbox keeps menu open, radio closes menu.
    - `ArrowDown` opens and focuses first item (`Profile`).
    - content emits `data-side` (observed `bottom`) and item keeps `data-variant="default"` by default.
