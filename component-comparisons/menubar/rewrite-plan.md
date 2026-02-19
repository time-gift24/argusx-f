# menubar Rewrite Plan

## Naming Migration (z -> argusx)
- [x] selectors migrated to `argusx-*` / `[argusxMenubar*]` (including trigger dual form). (`src/app/shared/ui/menubar/menubar.component.ts:128`, `src/app/shared/ui/menubar/menubar.component.ts:432`, `src/app/shared/ui/menubar/menubar.component.ts:1054`)
- [x] TS symbol family unified to `ArgusxMenubar*`. (`src/app/shared/ui/menubar/menubar.component.ts:175`, `src/app/shared/ui/menubar/menubar.component.ts:1102`)
- [x] index barrel exports explicit `Argusx*` names only. (`src/app/shared/ui/menubar/index.ts:1-21`)
- [x] no `app-*` compatibility alias retained (breaking change accepted).

## shadcn API Alignment
- [x] API surface aligned for root/menu/trigger/content/item families including submenu + portal.
- [x] behavior aligned:
  - top-level Left/Right navigation
  - Enter/Space/Arrow opening behavior
  - checkbox no-close, radio close
  - content defaults `align=start`, `alignOffset=-4`, `sideOffset=8`
- [x] accessibility/data attributes aligned:
  - `data-slot`, `data-state`, `data-side`, `data-variant`, `data-inset`, `data-disabled`

## File-level Execution Checklist
1. [x] `src/app/shared/ui/menubar/menubar.component.ts`
2. [x] `src/app/shared/ui/menubar/index.ts`
3. [x] `src/app/preview/menubar-preview.component.ts`
4. [x] `src/app/shared/ui/menubar/menubar.component.spec.ts`
5. [x] `src/app/shared/ui/menu-core/focus.ts` reused by menubar navigation helpers
