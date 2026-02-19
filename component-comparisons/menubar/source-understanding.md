# menubar Source Understanding

## Mapping
- local: `src/app/shared/ui/menubar/menubar.component.ts`
- zardui: no dedicated menubar component; reuse comes from zard `menu` primitives (trigger/item/manager) via `menu-core`.
- shadcn: `/tmp/shadcn-menubar.tsx`
- rationale: keep shadcn menubar API and keyboard semantics, but implement with Angular CDK overlay + shared menu-core focus logic.

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/menu.directive.ts` | 56-61, 73-75 | trigger/placement primitives used as base for ArgusX menu-core vocabulary. |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/menu.directive.ts` | 107-118, 155-184 | hover/open/close timing model reused in menu-core. |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/menu-item.directive.ts` | 44-58, 79-95 | item disabled/highlight/pointer behavior baseline. |
| Z4 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/menu-manager.service.ts` | 11-28 | active menu manager pattern copied into `ArgusxMenuManagerService`. |
| Z5 | `src/app/shared/ui/menu-core/menu.directive.ts` | 61-72, 168-177 | ArgusX-ized menu-core trigger API (`argusxTrigger`, `argusxHoverDelay`, `argusxPlacement`) from zard base. |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/shadcn-menubar.tsx` | 51-64 | dedicated `MenubarTrigger` component contract. |
| U2 | `/tmp/shadcn-menubar.tsx` | 67-80 | `MenubarContent` defaults: `align=start`, `alignOffset=-4`, `sideOffset=8`. |
| U3 | `/tmp/shadcn-menubar.tsx` | 91-112 | item API with `variant` + `inset` data attributes. |
| U4 | `/tmp/shadcn-menubar.tsx` | 213-257 | submenu and export family shape. |
| U5 | `/tmp/shadcn-menubar.tsx` | 259-276 | final exported public API list. |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/menubar/menubar.component.ts` | 56-62, 170-172 | root/menubar menu slots and root accessibility role. |
| L2 | `src/app/shared/ui/menubar/menubar.component.ts` | 98-113, 305-353 | top-level Left/Right navigation and open-target switching semantics. |
| L3 | `src/app/shared/ui/menubar/menubar.component.ts` | 149-164, 387-389 | content now emits `data-side` and updates side from overlay position. |
| L4 | `src/app/shared/ui/menubar/menubar.component.ts` | 179-181, 209-233 | menubar defaults aligned to shadcn (`align/start`, `alignOffset=-4`, `sideOffset=8`) and actually applied to positions. |
| L5 | `src/app/shared/ui/menubar/menubar.component.ts` | 410-420, 1070-1094 | content wrapper forwards align/offset/class config through `registerContentConfig`. |
| L6 | `src/app/shared/ui/menubar/menubar.component.ts` | 432-433 | trigger dual form: `[argusxMenubarTrigger]` and `argusx-menubar-trigger`. |
| L7 | `src/app/shared/ui/menubar/menubar.component.ts` | 616, 708 | checkbox keeps menu open; radio selection closes. |
| L8 | `src/app/shared/ui/menubar/menubar.component.ts` | 1102-1119 | full `ArgusxMenubarComponents` export set. |
| L9 | `src/app/preview/menubar-preview.component.ts` | 23-97 | preview covers disabled/inset/destructive/checkbox/radio/submenu and both trigger forms. |
