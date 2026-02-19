# dropdown-menu Source Understanding

## Mapping
- local: `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts`
- zardui: `/tmp/zardui/libs/zard/src/lib/shared/components/menu/*`
- shadcn: `/tmp/shadcn-dropdown-menu.tsx`
- rationale: keep shadcn `dropdown-menu` public structure, but reuse zardui menu interaction model (trigger/context/item/manager) through shared `menu-core`.

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/menu.directive.ts` | 56-61 | zard trigger contract: `zTrigger`, `zHoverDelay`, `zPlacement`. |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/menu.directive.ts` | 107-118, 180-184 | hover open/close with delayed close scheduling. |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/menu-item.directive.ts` | 79-95 | pointer move focus and disabled click guard. |
| Z4 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/context-menu.directive.ts` | 47-57 | keyboard open via `ContextMenu` / `Shift+F10`. |
| Z5 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/menu-manager.service.ts` | 11-28 | only one active hover menu is kept. |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/doc/api.md` | 24-35 | z-menu API defaults (`click`, `hoverDelay=100`, `bottomLeft`). |
| U2 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/demo/default.ts` | 17-18 | hover-triggered dropdown demo usage. |
| U3 | `/tmp/shadcn-dropdown-menu.tsx` | 34-43 | shadcn content default `sideOffset=4`. |
| U4 | `/tmp/shadcn-dropdown-menu.tsx` | 62-76 | shadcn `item` uses `variant` default and `data-inset`/`data-variant`. |
| U5 | `/tmp/shadcn-dropdown-menu.tsx` | 241-257 | canonical shadcn export surface for full dropdown family. |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts` | 58-85 | trigger directive uses `argusx` selector and ArrowUp/ArrowDown open semantics. |
| L2 | `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts` | 691-739 | root selector is `argusx-dropdown-menu`; content offset default `sideOffset=4`. |
| L3 | `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts` | 721-723, 874-876 | `data-state` + runtime `data-side` are set on content. |
| L4 | `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts` | 174-190 | item exposes `data-inset`, `data-variant`, default `variant='default'`. |
| L5 | `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts` | 268-272 | checkbox toggles `checkedChange` and intentionally keeps menu open. |
| L6 | `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts` | 362-369 | radio item updates group value then closes menu. |
| L7 | `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts` | 942-965 | content wrapper forwards `align/sideOffset/class` to root via `registerContentConfig`. |
| L8 | `src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts` | 1034-1051 | exported symbol set is fully `Argusx*` and includes Portal/Sub family. |
| L9 | `src/app/shared/ui/menu-core/focus.ts` | 1-52 | shared focus navigation helpers are reused by dropdown/content keyboard logic. |
