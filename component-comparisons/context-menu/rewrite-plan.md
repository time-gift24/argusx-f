# context-menu Rewrite Plan

## Naming Migration (z -> argusx)
- [x] selectors migrated to `argusx-*` / `[argusxContextMenu*]`. (`src/app/shared/ui/context-menu/context-menu.component.ts:63`, `src/app/shared/ui/context-menu/context-menu.component.ts:753`)
- [x] TS symbols use `ArgusxContextMenu*` naming, including exported component array. (`src/app/shared/ui/context-menu/context-menu.component.ts:1246`)
- [x] barrel export exposes only argusx symbols. (`src/app/shared/ui/context-menu/index.ts:1`)
- [x] no `app-*` compatibility alias retained (breaking change accepted).

## shadcn API Alignment
- [x] API surface aligned with shadcn context family, including Portal/Sub components.
- [x] behavior aligned for right-click open, keyboard open (`Shift+F10`), Escape close, checkbox/radio contracts.
- [x] accessibility aligned via trigger aria state + semantic menu roles + focus management.

## File-level Execution Checklist
1. [x] `src/app/shared/ui/context-menu/context-menu.component.ts`
2. [x] `src/app/shared/ui/context-menu/index.ts`
3. [x] `src/app/preview/context-menu-preview.component.ts`
4. [x] `src/app/preview/llm-chat/llm-chat-session-tabs.component.ts`
5. [x] `src/app/shared/ui/context-menu/context-menu.component.spec.ts`
