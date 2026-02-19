# dropdown-menu Rewrite Plan

## Naming Migration (z -> argusx)
- [x] selector migration to `argusx-*` / `[argusxDropdownMenu*]` completed. (`src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts:58`, `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts:691`)
- [x] TS symbols moved to `Argusx*` (`ArgusxDropdownMenu*` classes/types/constants). (`src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts:40-42`, `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts:1034`)
- [x] barrel export kept in `argusx` naming only. (`src/app/shared/ui/dropdown-menu/index.ts:1`)
- [x] no `app-*` compatibility alias retained (breaking change accepted).

## shadcn API Alignment
- [x] API surface aligned: Root/Trigger/Content/Group/Label/Item/Checkbox/RadioGroup/RadioItem/Separator/Shortcut/Sub/SubTrigger/SubContent/Portal.
- [x] behavior aligned: `sideOffset=4`, item `variant` default, checkbox no-close, radio closes.
- [x] accessibility aligned: trigger aria state, content `role=menu`, semantic item roles.

## File-level Execution Checklist
1. [x] `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts`
2. [x] `src/app/shared/ui/dropdown-menu/index.ts`
3. [x] `src/app/preview/dropdown-menu-preview.component.ts`
4. [x] `src/app/shared/ui/dropdown-menu/dropdown-menu.component.spec.ts`
5. [x] `src/app/shared/ui/menu-core/focus.ts` reused by dropdown keyboard navigation
